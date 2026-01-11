import React, { useEffect, useMemo, useState, memo } from 'react';
import { parseISO, format, differenceInHours, isValid } from 'date-fns';
import { getDataWithMetadata, getListDatasetFromDB } from '../../services/api';
import '../../styles/ListDatasetFromDBControls.css';

const SOURCE_OPTIONS = [
  { label: 'All Sources', value: 'all' },
  { label: 'Scheduled Jobs', value: 'scheduled_job' },
  { label: 'Manual Fetches', value: 'manual_fetch' },
];

const SOURCE_DISPLAY = {
  scheduled_job: 'Scheduled job',
  manual_fetch: 'Manual fetch',
  unknown: 'Unknown',
};

const createDefaultFilters = () => ({
  sourceType: 'all',
  jobId: '',
  stockSymbols: '',
  tags: [],
  freshOnly: false,
});

const normalizeDate = (value, formatString = 'yyyy-MM-dd') => {
  if (!value) return '—';
  try {
    const parsed = typeof value === 'string' ? parseISO(value) : new Date(value);
    if (!isValid(parsed)) return value;
    return format(parsed, formatString);
  } catch {
    return value;
  }
};

// Infer canonical source_type for legacy metadata payloads.
const canonSourceType = (meta) => {
  if (!meta) return 'unknown';

  if (meta.source_type) {
    const candidate = String(meta.source_type).toLowerCase();
    if (candidate === 'manual_fetch' || candidate === 'scheduled_job' || candidate === 'unknown') {
      return candidate;
    }
  }

  const createdBy = String(meta.created_by || '').toLowerCase();
  if (createdBy === 'user') return 'manual_fetch';
  if (createdBy === 'job_scheduler' || createdBy === 'scheduler' || createdBy === 'cron') {
    return 'scheduled_job';
  }

  if (meta.job_id || meta.job_name) return 'scheduled_job';

  return 'unknown';
};

const isDatasetFresh = (metadata) => {
  if (!metadata?.updated_at) return false;
  try {
    const updatedAt = parseISO(metadata.updated_at);
    if (!isValid(updatedAt)) return false;
    return differenceInHours(new Date(), updatedAt) <= 24;
  } catch {
    return false;
  }
};

const buildRequestPayload = (prefix, filters) => {
  const payload = {
    fresh_only: filters.freshOnly,
  };

  if (prefix) {
    payload.prefix = prefix;
  }

  if (filters.sourceType && filters.sourceType !== 'all') {
    payload.source_type = filters.sourceType;

    if (filters.sourceType === 'manual_fetch') {
      payload.created_by = 'user';
    } else if (filters.sourceType === 'scheduled_job') {
      payload.created_by = 'job_scheduler';
    }
  }

  if (filters.jobId.trim()) {
    payload.job_id = filters.jobId.trim();
  }

  const stockIds = filters.stockSymbols
    .split(',')
    .map((item) => item.trim().toUpperCase())
    .filter(Boolean);
  if (stockIds.length > 0) {
    payload.stock_ids = stockIds;
  }

  if (Array.isArray(filters.tags) && filters.tags.length > 0) {
    payload.tags = filters.tags;
  }

  return payload;
};

const getDisplayTags = (metadata) => {
  if (!metadata) return [];
  const sourceType = canonSourceType(metadata);
  if (sourceType === 'unknown') return [];
  const tags = Array.isArray(metadata.tags) ? metadata.tags : [];
  if (sourceType === 'manual_fetch' && tags.length === 0) {
    return ['manual'];
  }
  return tags;
};

const getSourceDisplay = (sourceType) => {
  if (!sourceType) {
    return {
      label: SOURCE_DISPLAY.unknown,
      className: 'unknown',
    };
  }

  const normalized = sourceType.toLowerCase();
  const label = SOURCE_DISPLAY[normalized] || sourceType;
  return {
    label,
    className: normalized.replace(/[^a-z0-9_-]/gi, '-'),
  };
};

// Memoizing the component to prevent unnecessary re-renders
const ListDatasetFromDBControls = memo(({ prefix, refresh, setSelectedItems, compact = false }) => {
  const [datasets, setDatasets] = useState([]);
  const [selectedDatasets, setSelectedDatasets] = useState([]);
  const [availableTags, setAvailableTags] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [summary, setSummary] = useState({ total: 0, filtered: 0 });
  const [filters, setFilters] = useState(() => createDefaultFilters());
  const [draftFilters, setDraftFilters] = useState(() => createDefaultFilters());
  const [detailDataset, setDetailDataset] = useState(null);
  const [detailMetadata, setDetailMetadata] = useState(null);
  const [detailRecords, setDetailRecords] = useState([]);
  const [isDetailLoading, setIsDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState('');

  useEffect(() => {
    const fetchDatasets = async () => {
      setIsLoading(true);
      setError('');
      try {
        const response = await getListDatasetFromDB(buildRequestPayload(prefix, filters));
        const datasetList = Array.isArray(response?.datasets) ? response.datasets : [];
        setDatasets(datasetList);
        setSummary({
          total: typeof response?.total_count === 'number' ? response.total_count : datasetList.length,
          filtered: typeof response?.filtered_count === 'number' ? response.filtered_count : datasetList.length,
        });

        const derivedTags = new Set(filters.tags);
        datasetList.forEach((dataset) => {
          const tags = getDisplayTags(dataset?.metadata);
          tags.forEach((tag) => {
            if (tag) derivedTags.add(tag);
          });
        });
        setAvailableTags(Array.from(derivedTags).sort((a, b) => a.localeCompare(b)));
      } catch (err) {
        console.error('Failed to fetch datasets:', err);
        const message = err?.message ? `Failed to fetch datasets: ${err.message}` : 'Failed to fetch datasets.';
        setError(message);
        setDatasets([]);
        setSummary({ total: 0, filtered: 0 });
      } finally {
        setIsLoading(false);
      }
    };

    fetchDatasets();
  }, [prefix, refresh, filters]);

  useEffect(() => {
    setSelectedDatasets([]);
  }, [filters, prefix, refresh]);

  useEffect(() => {
    setSelectedItems(selectedDatasets);
  }, [selectedDatasets, setSelectedItems]);

  useEffect(() => {
    setDraftFilters((prev) => ({
      ...prev,
      sourceType: filters.sourceType,
      freshOnly: filters.freshOnly,
    }));
  }, [filters.sourceType, filters.freshOnly]);

  useEffect(() => {
    setDetailDataset(null);
    setDetailMetadata(null);
    setDetailRecords([]);
    setDetailError('');
    setIsDetailLoading(false);
  }, [filters, prefix, refresh]);

  const handleCheckboxChange = (dataset, isChecked) => {
    setSelectedDatasets((prev) =>
      isChecked
        ? [...prev, dataset]
        : prev.filter(
            (item) =>
              item.key !== dataset.key &&
              (item.stock_id !== dataset.stock_id ||
                item.start_date !== dataset.start_date ||
                item.end_date !== dataset.end_date)
          )
    );
  };

  const isSelected = (dataset) =>
    selectedDatasets.some(
      (item) =>
        item.key === dataset.key ||
        (item.stock_id === dataset.stock_id &&
          item.start_date === dataset.start_date &&
          item.end_date === dataset.end_date)
    );

  const handleApplyFilters = () => {
    setFilters({ ...draftFilters, tags: [...draftFilters.tags] });
  };

  const handleResetFilters = () => {
    setDraftFilters(createDefaultFilters());
    setFilters(createDefaultFilters());
  };

  const emptyStateMessage = useMemo(() => {
    if (isLoading) return 'Loading datasets…';
    if (error) return '';
    if (summary.filtered === 0) {
      return filters.sourceType === 'all'
        ? 'No datasets found. Try adjusting your filters or create a new dataset.'
        : 'No datasets match the selected filters.';
    }
    return '';
  }, [error, filters.sourceType, isLoading, summary.filtered]);

  const handleTagToggle = (tag) => {
    setDraftFilters((prev) => {
      const hasTag = prev.tags.includes(tag);
      const nextTags = hasTag ? prev.tags.filter((item) => item !== tag) : [...prev.tags, tag];
      return { ...prev, tags: nextTags };
    });
  };

  const handleDatasetClick = async (dataset) => {
    if (detailDataset?.key === dataset.key) {
      setDetailDataset(null);
      setDetailMetadata(null);
      setDetailRecords([]);
      setDetailError('');
      return;
    }

    setDetailDataset(dataset);
    setDetailMetadata(dataset.metadata || null);
    setDetailRecords([]);
    setDetailError('');
    setIsDetailLoading(true);

    try {
      const response = await getDataWithMetadata({
        key: dataset.key,
        prefix,
        stock_id: dataset.stock_id,
        start_date: dataset.start_date,
        end_date: dataset.end_date,
      });

      const recordsPayload = Array.isArray(response)
        ? response
        : Array.isArray(response?.data)
        ? response.data
        : Array.isArray(response?.data?.data)
        ? response.data.data
        : [];

      const metadataPayload = Array.isArray(response)
        ? dataset.metadata || null
        : response?.metadata ?? dataset.metadata ?? null;

      setDetailMetadata(metadataPayload);
      setDetailRecords(Array.isArray(recordsPayload) ? recordsPayload : []);
    } catch (err) {
      console.error('Failed to load dataset details:', err);
      setDetailError('Failed to load dataset details. Please try again.');
    } finally {
      setIsDetailLoading(false);
    }
  };

  const activeDatasetKey = detailDataset?.key;
  const detailSourceType = canonSourceType(detailMetadata);
  const detailSource = getSourceDisplay(detailSourceType);
  const detailDisplayTags = getDisplayTags(detailMetadata);

  return (
    <div className={`ListDatasetFromDBControls ${compact ? 'compact' : ''}`}>
      <div className="dataset-filters">
        <div className="dataset-filters__group">
          <label htmlFor={`source-filter-${prefix}`} className="dataset-filters__label">
            Source Type
          </label>
          <select
            id={`source-filter-${prefix}`}
            value={draftFilters.sourceType}
            onChange={(event) =>
              setDraftFilters((prev) => ({ ...prev, sourceType: event.target.value }))
            }
          >
            {SOURCE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="dataset-filters__group">
          <label htmlFor={`job-filter-${prefix}`} className="dataset-filters__label">
            Job ID
          </label>
          <input
            id={`job-filter-${prefix}`}
            type="text"
            placeholder="UUID..."
            value={draftFilters.jobId}
            onChange={(event) =>
              setDraftFilters((prev) => ({ ...prev, jobId: event.target.value }))
            }
          />
        </div>

        <div className="dataset-filters__group">
          <label htmlFor={`stock-filter-${prefix}`} className="dataset-filters__label">
            Stock Symbols
          </label>
          <input
            id={`stock-filter-${prefix}`}
            type="text"
            placeholder="AAPL, MSFT"
            value={draftFilters.stockSymbols}
            onChange={(event) =>
              setDraftFilters((prev) => ({ ...prev, stockSymbols: event.target.value }))
            }
          />
        </div>

        <div className="dataset-filters__group dataset-filters__group--tags">
          <span className="dataset-filters__label">Ingestion Tags</span>
          <div className="dataset-filters__tag-options">
            {availableTags.length === 0 ? (
              <span className="dataset-filters__tag-empty">No tags available</span>
            ) : (
              availableTags.map((tag) => (
                <label key={tag} className="dataset-filters__tag-option">
                  <input
                    type="checkbox"
                    checked={draftFilters.tags.includes(tag)}
                    onChange={() => handleTagToggle(tag)}
                  />
                  <span>{tag}</span>
                </label>
              ))
            )}
          </div>
        </div>

        <label className="dataset-filters__checkbox">
          <input
            type="checkbox"
            checked={draftFilters.freshOnly}
            onChange={(event) =>
              setDraftFilters((prev) => ({ ...prev, freshOnly: event.target.checked }))
            }
          />
          Fresh only (updated ≤ 24h)
        </label>

        <div className="dataset-filters__actions">
          <button type="button" onClick={handleApplyFilters} disabled={isLoading}>
            Apply Filters
          </button>
          <button type="button" className="secondary" onClick={handleResetFilters} disabled={isLoading}>
            Reset
          </button>
        </div>
      </div>

      <div className="dataset-summary">
        {prefix && <span className="dataset-summary__prefix">Prefix: {prefix}</span>}
        <span>Total: {summary.total}</span>
        <span>Showing: {summary.filtered}</span>
      </div>

      {error && <div className="dataset-error" role="alert">{error}</div>}

      {emptyStateMessage ? (
        <div className="dataset-empty-state">{emptyStateMessage}</div>
      ) : compact ? (
        <div className="dataset-list--compact">
          {datasets.map((dataset) => {
            const { metadata = {} } = dataset;
            const fresh = isDatasetFresh(metadata);
            return (
              <div
                key={dataset.key}
                className={`dataset-card--compact ${isSelected(dataset) ? 'selected' : ''}`}
                onClick={() => handleCheckboxChange(dataset, !isSelected(dataset))}
              >
                <div className="dataset-card--compact__symbol">{dataset.stock_id}</div>
                <div className="dataset-card--compact__dates">
                  {normalizeDate(dataset.start_date)} - {normalizeDate(dataset.end_date)}
                </div>
                <div className={`dataset-card--compact__status ${fresh ? 'fresh' : 'stale'}`}>
                  {fresh ? 'Fresh' : 'Stale'}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="dataset-table__wrapper">
          <table className="dataset-table">
            <thead>
              <tr>
                <th>Select</th>
                <th>Stock ID</th>
                <th>Date Range</th>
                <th>Records</th>
                <th>Source</th>
                <th>Job Name</th>
                <th>Last Updated</th>
                <th>Next Update</th>
                <th>Freshness</th>
                <th>Tags</th>
              </tr>
            </thead>
            <tbody>
              {datasets.map((dataset) => {
                const { metadata = {} } = dataset;
                const fresh = isDatasetFresh(metadata);
                const sourceType = canonSourceType(metadata);
                const source = getSourceDisplay(sourceType);
                const displayTags = getDisplayTags(metadata);
                return (
                  <tr
                    key={dataset.key}
                    className={`dataset-row ${activeDatasetKey === dataset.key ? 'dataset-row--active' : ''}`}
                    onClick={() => handleDatasetClick(dataset)}
                  >
                    <td>
                      <input
                        type="checkbox"
                        checked={isSelected(dataset)}
                        onChange={(event) => handleCheckboxChange(dataset, event.target.checked)}
                        onClick={(event) => event.stopPropagation()}
                        aria-label={`Select dataset ${dataset.stock_id} ${dataset.start_date} to ${dataset.end_date}`}
                      />
                    </td>
                    <td>{dataset.stock_id}</td>
                    <td>
                      <div className="dataset-table__dates">
                        <span>{normalizeDate(dataset.start_date)}</span>
                        <span>→</span>
                        <span>{normalizeDate(dataset.end_date)}</span>
                      </div>
                    </td>
                    <td>{dataset.record_count ?? '—'}</td>
                    <td className="dataset-table__source">
                      <span className={`chip chip--source chip--${source.className || 'unknown'}`}>
                        {source.label}
                      </span>
                    </td>
                    <td className="dataset-table__job">
                      <span className="dataset-table__job-name">{metadata.job_name || '—'}</span>
                      {metadata.job_id && (
                        <span className="dataset-table__job-id">ID: {metadata.job_id}</span>
                      )}
                    </td>
                    <td>{normalizeDate(metadata.updated_at, 'PP pp')}</td>
                    <td>{normalizeDate(metadata.next_update, 'PP pp')}</td>
                    <td>
                      <span className={`chip chip--freshness-${fresh ? 'fresh' : 'stale'}`}>
                        {fresh ? 'Fresh' : 'Stale'}
                      </span>
                    </td>
                    <td>
                      <div className="dataset-table__tags">
                        {displayTags.length === 0
                          ? sourceType === 'unknown'
                            ? ''
                            : '—'
                          : displayTags.map((tag) => (
                              <span key={`${dataset.key}-${tag}`} className="chip chip--tag">
                                {tag}
                              </span>
                            ))}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {detailDataset && !compact && (
        <div className="dataset-detail">
          {/* Detail view content (same as before) */}
          <div className="dataset-detail__header">
            <h4>Dataset Details</h4>
            <button
              type="button"
              className="dataset-detail__close"
              onClick={() => {
                setDetailDataset(null);
                setDetailMetadata(null);
                setDetailRecords([]);
                setDetailError('');
              }}
            >
              Close
            </button>
          </div>
          <div className="dataset-detail__body">
            <div className="dataset-detail__summary">
              <div>
                <span className="dataset-detail__label">Stock ID</span>
                <span className="dataset-detail__value">{detailDataset.stock_id}</span>
              </div>
              <div>
                <span className="dataset-detail__label">Date Range</span>
                <span className="dataset-detail__value">
                  {normalizeDate(detailDataset.start_date)} → {normalizeDate(detailDataset.end_date)}
                </span>
              </div>
              <div>
                <span className="dataset-detail__label">Records</span>
                <span className="dataset-detail__value">
                  {detailRecords.length > 0 ? detailRecords.length : detailDataset.record_count ?? '—'}
                </span>
              </div>
            </div>

            <div className="dataset-detail__metadata">
              <div>
                <span className="dataset-detail__label">Source</span>
                <span className={`chip chip--source chip--${detailSource.className || 'unknown'}`}>
                  {detailSource.label}
                </span>
              </div>
              <div>
                <span className="dataset-detail__label">Job Name</span>
                <span className="dataset-detail__value">{detailMetadata?.job_name || '—'}</span>
                {detailMetadata?.job_id && (
                  <span className="dataset-detail__hint">Job ID: {detailMetadata.job_id}</span>
                )}
              </div>
              <div>
                <span className="dataset-detail__label">Last Updated</span>
                <span className="dataset-detail__value">
                  {normalizeDate(detailMetadata?.updated_at, 'PP pp')}
                </span>
              </div>
              <div>
                <span className="dataset-detail__label">Next Update</span>
                <span className="dataset-detail__value">
                  {normalizeDate(detailMetadata?.next_update, 'PP pp')}
                </span>
              </div>
              <div>
                <span className="dataset-detail__label">Tags</span>
                <div className="dataset-detail__tags">
                  {detailDisplayTags.length === 0
                    ? detailSourceType === 'unknown'
                      ? ''
                      : '—'
                    : detailDisplayTags.map((tag) => (
                        <span key={`${detailDataset.key}-detail-${tag}`} className="chip chip--tag">
                          {tag}
                        </span>
                      ))}
                </div>
              </div>
            </div>

            {detailError && <div className="dataset-detail__error">{detailError}</div>}
            {isDetailLoading && <div className="dataset-detail__loading">Loading dataset records…</div>}

            {!isDetailLoading && !detailError && detailRecords.length > 0 && (
              <div className="dataset-detail__preview">
                <span className="dataset-detail__label">Preview</span>
                <pre>
                  {JSON.stringify(detailRecords.slice(0, 5), null, 2)}
                  {detailRecords.length > 5 ? '\n…' : ''}
                </pre>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
});

ListDatasetFromDBControls.displayName = 'ListDatasetFromDBControls';

export default ListDatasetFromDBControls;

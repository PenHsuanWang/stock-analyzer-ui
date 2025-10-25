// components/containers/StockSearchControls.js
import React, { useState } from 'react';
import { fetchDataFromSource, getDataWithMetadata } from "../../services/api";
import '../../styles/StockSearchControls.css';
import { parseISO, isBefore, format, formatDistanceToNow } from 'date-fns';

const DEFAULT_PREFIX = 'stock_data';

const StockSearchControls = ({
  setChartData,
  setSearchParams,
  dataPrefix = DEFAULT_PREFIX,
}) => {
  const [stockId, setStockId] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [metadata, setMetadata] = useState(null);

  const buildRequestPayload = () => ({
    stock_id: stockId,
    start_date: startDate,
    end_date: endDate,
    prefix: dataPrefix || DEFAULT_PREFIX,
  });

  const formatIsoTimestamp = (value) => {
    if (!value) return '—';
    try {
      const parsed = parseISO(value);
      return `${format(parsed, 'PPpp')} (${formatDistanceToNow(parsed, { addSuffix: true })})`;
    } catch {
      return value;
    }
  };

  const isFresh = (metadataObj) => {
    if (!metadataObj?.updated_at) return false;
    try {
      const updated = parseISO(metadataObj.updated_at);
      const now = new Date();
      const diffMs = now.getTime() - updated.getTime();
      return diffMs <= 24 * 60 * 60 * 1000;
    } catch {
      return false;
    }
  };

  const handleSearch = async () => {
    setError('');

    // Validate inputs
    if (!stockId || !startDate || !endDate) {
      setError('Please enter all fields: Stock ID, Start Date, and End Date.');
      return;
    }

    // Check if start date is before end date
    const start = parseISO(startDate);
    const end = parseISO(endDate);
    if (isBefore(end, start)) {
      setError('The start date must be before the end date.');
      return;
    }

    setIsLoading(true);

    try {
      const payload = buildRequestPayload();

      let chartDataResponse;
      try {
        chartDataResponse = await getDataWithMetadata(payload);
      } catch (fetchError) {
        if (fetchError?.message?.includes('404')) {
          chartDataResponse = await fetchDataFromSource(payload);
        } else {
          throw fetchError;
        }
      }

      const normalizedData = Array.isArray(chartDataResponse)
        ? chartDataResponse
        : chartDataResponse?.data ?? [];
      const receivedMetadata = Array.isArray(chartDataResponse)
        ? null
        : chartDataResponse?.metadata ?? null;

      // Update chart data and metadata
      setChartData(normalizedData);
      setMetadata(receivedMetadata);

      // Update search parameters after successful data fetch
      setSearchParams({
        stockId,
        startDate,
        endDate,
        metadata: receivedMetadata,
      });

    } catch (error) {
      console.error("Error fetching data:", error);
      setError(`Failed to fetch data: ${error.message || 'Please try again later.'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="StockSearchControls">
      {error && <div className="error-message">{error}</div>}
      <div className="stockInputs">
        <input
          type="text"
          value={stockId}
          onChange={(e) => setStockId(e.target.value)}
          placeholder="Stock ID (e.g., AAPL)"
          disabled={isLoading}
        />
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          placeholder="Start Date"
          disabled={isLoading}
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          placeholder="End Date"
          disabled={isLoading}
        />
        <button onClick={handleSearch} disabled={isLoading}>
          {isLoading ? 'Loading...' : 'Search'}
        </button>
      </div>

      {metadata && (
        <div className="metadata-card" aria-live="polite">
          <div className="metadata-card__header">
            <h4>Dataset Metadata</h4>
            <span className={`metadata-card__freshness ${isFresh(metadata) ? 'fresh' : 'stale'}`}>
              {isFresh(metadata) ? 'Fresh (≤24h)' : 'Stale (>24h)'}
            </span>
          </div>
          <div className="metadata-card__grid">
            <div>
              <span className="metadata-card__label">Source Type</span>
              <span className="metadata-card__value">{metadata.source_type || '—'}</span>
            </div>
            <div>
              <span className="metadata-card__label">Job Name</span>
              <span className="metadata-card__value">{metadata.job_name || 'Manual Fetch'}</span>
            </div>
            <div>
              <span className="metadata-card__label">Created At</span>
              <span className="metadata-card__value">{formatIsoTimestamp(metadata.created_at)}</span>
            </div>
            <div>
              <span className="metadata-card__label">Last Updated</span>
              <span className="metadata-card__value">{formatIsoTimestamp(metadata.updated_at)}</span>
            </div>
            <div>
              <span className="metadata-card__label">Schedule Time</span>
              <span className="metadata-card__value">{metadata.schedule_time || '—'}</span>
            </div>
            <div>
              <span className="metadata-card__label">Next Update</span>
              <span className="metadata-card__value">{formatIsoTimestamp(metadata.next_update)}</span>
            </div>
          </div>
          {metadata.tags && metadata.tags.length > 0 && (
            <div className="metadata-card__tags">
              {metadata.tags.map((tag) => (
                <span key={tag} className="metadata-card__tag">
                  {tag}
                </span>
              ))}
            </div>
          )}
          {metadata.description && (
            <p className="metadata-card__description">{metadata.description}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default StockSearchControls;

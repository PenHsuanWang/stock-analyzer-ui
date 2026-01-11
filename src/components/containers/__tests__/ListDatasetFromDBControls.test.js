import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import ListDatasetFromDBControls from '../ListDatasetFromDBControls';

jest.mock('../../../services/api', () => ({
  getListDatasetFromDB: jest.fn(),
  getDataWithMetadata: jest.fn(),
}));

const { getListDatasetFromDB, getDataWithMetadata } = require('../../../services/api');

describe('ListDatasetFromDBControls', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('displays dataset metadata and allows selection', async () => {
    getListDatasetFromDB.mockResolvedValue({
      datasets: [
        {
          key: 'stock_data:AAPL:2025-01-01:2025-02-01',
          stock_id: 'AAPL',
          start_date: '2025-01-01',
          end_date: '2025-02-01',
          record_count: 22,
          metadata: {
            created_by: 'job_scheduler',
            job_id: 'job-uuid',
            job_name: 'Daily Morning Data',
            updated_at: new Date().toISOString(),
            next_update: '2025-02-02T09:00:00Z',
            tags: ['daily', 'morning'],
          },
        },
      ],
      total_count: 1,
      filtered_count: 1,
    });
    getDataWithMetadata.mockResolvedValue({
      data: [{ Date: '2025-01-01', Close: 150.1 }],
      metadata: {
        created_by: 'job_scheduler',
        job_id: 'job-uuid',
        job_name: 'Daily Morning Data',
        updated_at: new Date().toISOString(),
      },
    });

    const setSelectedItems = jest.fn();
    render(
      <ListDatasetFromDBControls
        prefix="stock_data"
        refresh={false}
        setSelectedItems={setSelectedItems}
      />
    );

    await waitFor(() => expect(screen.getByText('AAPL')).toBeInTheDocument());

    fireEvent.click(
      screen.getByLabelText(/Select dataset AAPL 2025-01-01 to 2025-02-01/i)
    );

    expect(setSelectedItems).toHaveBeenLastCalledWith([
      expect.objectContaining({ stock_id: 'AAPL' }),
    ]);

    expect(screen.getByText(/Daily Morning Data/)).toBeInTheDocument();
    expect(screen.getAllByText(/^Fresh$/i).length).toBeGreaterThan(0);
    expect(screen.getByText('Scheduled job')).toBeInTheDocument();
  });

  it('renders a manual fallback tag when metadata tags are empty', async () => {
    getListDatasetFromDB.mockResolvedValue({
      datasets: [
        {
          key: 'stock_data:MSFT:2025-01-01:2025-01-15',
          stock_id: 'MSFT',
          start_date: '2025-01-01',
          end_date: '2025-01-15',
          record_count: 10,
          metadata: {
            created_by: 'user',
            job_name: null,
            updated_at: new Date().toISOString(),
            next_update: null,
            tags: [],
          },
        },
      ],
      total_count: 1,
      filtered_count: 1,
    });
    getDataWithMetadata.mockResolvedValue({
      data: [],
      metadata: {
        created_by: 'user',
        tags: [],
      },
    });

    render(
      <ListDatasetFromDBControls
        prefix="stock_data"
        refresh={false}
        setSelectedItems={jest.fn()}
      />
    );

    await waitFor(() => expect(screen.getByText('MSFT')).toBeInTheDocument());
    expect(screen.getByText('Manual fetch')).toBeInTheDocument();
    expect(screen.getAllByText('manual').length).toBeGreaterThan(0);
  });

  it('applies filters and sends them to the backend', async () => {
    const payloads = [];
    getListDatasetFromDB.mockImplementation(async (payload) => {
      payloads.push(payload);
      return {
        datasets: [
          {
            key: 'stock_data:AAPL:2025-01-01:2025-02-01',
            stock_id: 'AAPL',
            start_date: '2025-01-01',
            end_date: '2025-02-01',
            record_count: 22,
            metadata: {
              created_by: 'job_scheduler',
              job_name: 'Daily Morning Data',
              updated_at: new Date().toISOString(),
              next_update: '2025-02-02T09:00:00Z',
              tags: ['daily', 'alpha'],
            },
          },
        ],
        total_count: 1,
        filtered_count: 1,
      };
    });
    getDataWithMetadata.mockResolvedValue({
      data: [],
      metadata: {},
    });

    render(
      <ListDatasetFromDBControls
        prefix="stock_data"
        refresh={false}
        setSelectedItems={jest.fn()}
      />
    );

    await waitFor(() => expect(payloads.length).toBeGreaterThan(0));

    fireEvent.change(screen.getByLabelText(/Source Type/i), { target: { value: 'scheduled_job' } });
    fireEvent.change(screen.getByLabelText(/Job ID/i), { target: { value: 'job-123' } });
    fireEvent.change(screen.getByLabelText(/Stock Symbols/i), { target: { value: 'AAPL, MSFT' } });
    fireEvent.click(screen.getByRole('checkbox', { name: /daily/i }));
    fireEvent.click(screen.getByRole('checkbox', { name: /alpha/i }));
    fireEvent.click(screen.getByLabelText(/Fresh only/i));

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /Apply Filters/i }));
    });

    await waitFor(() => {
      expect(payloads.some((entry) => entry.source_type === 'scheduled_job')).toBe(true);
    });

    const payload = payloads.find((entry) => entry.source_type === 'scheduled_job');

    expect(payload).toEqual(
      expect.objectContaining({
        prefix: 'stock_data',
        source_type: 'scheduled_job',
        created_by: 'job_scheduler',
        fresh_only: true,
        job_id: 'job-123',
        stock_ids: ['AAPL', 'MSFT'],
        tags: ['daily', 'alpha'],
      })
    );
  });

  it('sends created_by fallback when filtering manual fetches', async () => {
    const payloads = [];
    getListDatasetFromDB.mockImplementation(async (payload) => {
      payloads.push(payload);
      return {
        datasets: [],
        total_count: 0,
        filtered_count: 0,
      };
    });
    getDataWithMetadata.mockResolvedValue({
      data: [],
      metadata: {},
    });

    render(
      <ListDatasetFromDBControls
        prefix="stock_data"
        refresh={false}
        setSelectedItems={jest.fn()}
      />
    );

    await waitFor(() => expect(payloads.length).toBeGreaterThan(0));

    fireEvent.change(screen.getByLabelText(/Source Type/i), { target: { value: 'manual_fetch' } });

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /Apply Filters/i }));
    });

    const payload = payloads[payloads.length - 1];
    expect(payload).toEqual(
      expect.objectContaining({
        source_type: 'manual_fetch',
        created_by: 'user',
      })
    );
  });
});

import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import StockSearchControls from '../StockSearchControls';

jest.mock('../../../services/api', () => ({
  fetchDataFromSource: jest.fn(),
  getDataWithMetadata: jest.fn(),
}));

const mockSetChartData = jest.fn();
const mockSetSearchParams = jest.fn();

const { fetchDataFromSource, getDataWithMetadata } = require('../../../services/api');

describe('StockSearchControls', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const fillFormAndSubmit = () => {
    fireEvent.change(screen.getByPlaceholderText(/Stock ID/i), { target: { value: 'AAPL' } });
    fireEvent.change(screen.getByPlaceholderText(/Start Date/i), { target: { value: '2025-01-01' } });
    fireEvent.change(screen.getByPlaceholderText(/End Date/i), { target: { value: '2025-02-01' } });
    fireEvent.click(screen.getByRole('button', { name: /search/i }));
  };

  it('displays metadata returned from backend and updates chart data', async () => {
    const response = {
      data: [
        { Date: '2025-01-01', Close: 150 },
        { Date: '2025-01-02', Close: 151 },
      ],
      metadata: {
        source_type: 'scheduled_job',
        job_name: 'Daily Morning Data',
        created_at: '2025-01-01T09:00:00Z',
        updated_at: '2025-01-01T09:15:00Z',
        schedule_time: '09:00',
        next_update: '2025-01-02T09:00:00Z',
        tags: ['scheduled', 'daily'],
        description: 'Morning run',
      },
    };
    getDataWithMetadata.mockResolvedValue(response);

    render(
      <StockSearchControls
        setChartData={mockSetChartData}
        setSearchParams={mockSetSearchParams}
      />
    );

    fillFormAndSubmit();

    await waitFor(() => {
      expect(mockSetChartData).toHaveBeenCalledWith(response.data);
    });

    expect(mockSetSearchParams).toHaveBeenCalledWith(
      expect.objectContaining({
        stockId: 'AAPL',
        metadata: response.metadata,
      })
    );

    expect(screen.getByText(/Dataset Metadata/i)).toBeInTheDocument();
    expect(screen.getByText(/Daily Morning Data/i)).toBeInTheDocument();
    expect(screen.getAllByText(/scheduled/i).length).toBeGreaterThanOrEqual(1);
  });

  it('falls back to legacy fetch when metadata endpoint returns 404', async () => {
    getDataWithMetadata.mockRejectedValue(new Error('Backend error: 404 Not Found'));
    fetchDataFromSource.mockResolvedValue([
      { Date: '2025-01-01', Close: 120 },
    ]);

    render(
      <StockSearchControls
        setChartData={mockSetChartData}
        setSearchParams={mockSetSearchParams}
      />
    );

    fillFormAndSubmit();

    await waitFor(() => {
      expect(fetchDataFromSource).toHaveBeenCalled();
      expect(mockSetChartData).toHaveBeenCalledWith([
        { Date: '2025-01-01', Close: 120 },
      ]);
    });

    expect(screen.queryByText(/Dataset Metadata/i)).not.toBeInTheDocument();
  });
});

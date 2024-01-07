import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableRow, Checkbox, Paper } from '@mui/material';

// Dynamic Table Head
const DataTableHead = ({ columns }) => (
  <TableHead>
    <TableRow>
      {/* Optional Checkbox for selection */}
      <TableCell padding="checkbox">
        <Checkbox indeterminate />
      </TableCell>
      {/* Dynamic column headers */}
      {columns.map((column) => (
        <TableCell key={column}>{column}</TableCell>
      ))}
    </TableRow>
  </TableHead>
);

// Dynamic Table Row
const DataTableRow = ({ row, columns }) => (
  <TableRow hover>
    {/* Optional Checkbox for selection */}
    <TableCell padding="checkbox">
      <Checkbox />
    </TableCell>
    {/* Dynamic cells based on row data */}
    {columns.map((column) => (
      <TableCell key={`${column}-${row[column]}`}>
        {row[column] !== null && row[column] !== undefined ? row[column].toString() : ''}
      </TableCell>
    ))}
  </TableRow>
);

// Main Data Table Component
const DataTable = ({ data }) => {
  // Determine columns for the table based on the keys of the first data object
  const columns = data.length > 0 ? Object.keys(data[0]) : [];

  return (
    <Paper>
      <Table>
        {/* Render table head */}
        <DataTableHead columns={columns} />
        <TableBody>
          {/* Render table rows */}
          {data.map((row, index) => (
            // Use a unique identifier from the row as the key, or fallback to the index
            <DataTableRow key={`row-${index}`} row={row} columns={columns} />
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
};

export default DataTable;

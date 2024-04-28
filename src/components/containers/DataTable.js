import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableRow, Checkbox, Paper } from '@mui/material';

// Dynamic Table Head
const DataTableHead = ({ columns, isCheckedAll, handleCheckboxAllChange }) => (
  <TableHead>
    <TableRow>
      {/* Checkbox for select/deselect all */}
      <TableCell padding="checkbox">
        <Checkbox checked={isCheckedAll} onChange={handleCheckboxAllChange} />
      </TableCell>
      {/* Dynamic column headers */}
      {columns.map((column) => (
        <TableCell key={column}>{column}</TableCell>
      ))}
    </TableRow>
  </TableHead>
);

// Dynamic Table Row
const DataTableRow = ({ row, columns, isChecked, handleCheckboxChange }) => (
  <TableRow hover>
    {/* Checkbox for selection */}
    <TableCell padding="checkbox">
      <Checkbox checked={isChecked} onChange={handleCheckboxChange} />
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
  const [isCheckedAll, setIsCheckedAll] = React.useState(true);
  const [checkedRows, setCheckedRows] = React.useState(Array(data.length).fill(true));

  const handleCheckboxAllChange = (event) => {
    setIsCheckedAll(event.target.checked);
    setCheckedRows(Array(data.length).fill(event.target.checked));
  };

  const handleCheckboxChange = (index) => (event) => {
    const newCheckedRows = [...checkedRows];
    newCheckedRows[index] = event.target.checked;
    setCheckedRows(newCheckedRows);
    setIsCheckedAll(newCheckedRows.every(Boolean));
  };

  return (
    <Paper>
      <Table>
        {/* Render table head */}
        <DataTableHead columns={columns} isCheckedAll={isCheckedAll} handleCheckboxAllChange={handleCheckboxAllChange} />
        {/* Render table body */}
        <TableBody>
          {data.map((row, index) => (
            // Use a unique identifier from the row as the key, or fallback to the index
            <DataTableRow key={`row-${index}`} row={row} columns={columns} isChecked={checkedRows[index]} handleCheckboxChange={handleCheckboxChange(index)} />
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
};

export default DataTable;
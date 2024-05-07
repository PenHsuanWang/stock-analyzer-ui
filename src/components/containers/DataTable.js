import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableRow, Checkbox, Paper } from '@mui/material';

const DataTableHead = ({ columns, isCheckedAll, handleCheckboxAllChange }) => (
  <TableHead>
    <TableRow>
      <TableCell padding="checkbox">
        <Checkbox checked={isCheckedAll} onChange={handleCheckboxAllChange} />
      </TableCell>
      {columns.map((column) => (
        <TableCell key={column}>{column}</TableCell>
      ))}
    </TableRow>
  </TableHead>
);

const DataTableRow = ({ row, columns, isChecked, handleCheckboxChange }) => (
  <TableRow hover>
    <TableCell padding="checkbox">
      <Checkbox checked={isChecked} onChange={handleCheckboxChange} />
    </TableCell>
    {columns.map((column) => (
      <TableCell key={`${column}-${row[column]}`}>
        {row[column] !== null && row[column] !== undefined ? row[column].toString() : ''}
      </TableCell>
    ))}
  </TableRow>
);

const DataTable = ({ data, onSelectionChange }) => {
  const columns = data.length > 0 ? Object.keys(data[0]) : [];
  const [isCheckedAll, setIsCheckedAll] = React.useState(false);
  const [checkedRows, setCheckedRows] = React.useState([]);

  const handleCheckboxAllChange = (event) => {
    const newChecked = event.target.checked;
    setIsCheckedAll(newChecked);
    setCheckedRows(newChecked ? data.map((_, index) => index) : []);
    onSelectionChange(newChecked ? data : []);
  };

  const handleCheckboxChange = (index) => (event) => {
    const newCheckedRows = [...checkedRows];
    if (event.target.checked) {
      newCheckedRows.push(index);
    } else {
      const idx = newCheckedRows.indexOf(index);
      if (idx !== -1) {
        newCheckedRows.splice(idx, 1);
      }
    }
    setCheckedRows(newCheckedRows);
    onSelectionChange(data.filter((_, idx) => newCheckedRows.includes(idx)));
  };

  return (
    <Paper>
      <Table>
        <DataTableHead columns={columns} isCheckedAll={isCheckedAll} handleCheckboxAllChange={handleCheckboxAllChange} />
        <TableBody>
          {data.map((row, index) => (
            <DataTableRow key={`row-${index}`} row={row} columns={columns} isChecked={checkedRows.includes(index)} handleCheckboxChange={handleCheckboxChange(index)} />
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
};

export default DataTable;

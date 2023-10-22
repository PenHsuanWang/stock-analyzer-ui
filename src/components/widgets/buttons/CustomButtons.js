// src/components/Widgets/Buttons/CustomButtons.js
import React from 'react';
import '../../../styles/CustomButtons.css';

function SaveButton({ onClick }) {
  return <button className="btn btn-save" onClick={onClick}>Save</button>;
}

function DeleteButton({ onClick }) {
  return <button className="btn btn-delete" onClick={onClick}>Delete</button>;
}

function SearchButton({ onClick }) {
  return <button className="btn btn-search" onClick={onClick}>Search</button>;
}

export { SaveButton, DeleteButton, SearchButton };

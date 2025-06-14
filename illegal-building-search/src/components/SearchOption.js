import React from 'react';

const SearchOption = ({ icon, label, onClick }) => {
  return (
    <div className="search-option-card" onClick={onClick}>
      <div className="icon">{icon}</div>
      <div className="label">{label}</div>
    </div>
  );
};

export default SearchOption;

import React from 'react';

const MapButton = ({ label, onClick }) => {
  return (
    <button className="view-map-button" onClick={onClick}>
      {label}
    </button>
  );
};

export default MapButton;

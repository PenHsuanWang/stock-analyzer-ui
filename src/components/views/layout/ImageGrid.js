import React from 'react';
import { Link } from 'react-router-dom';

function ImageGrid({ images }) {
  return (
    <div className="image-grid">
      {images.map((image) => (
        <Link to="/stock-ma-plot" key={image.id} className="grid-item">
          <img src={image.src} alt={image.alt} />
        </Link>
      ))}
    </div>
  );
}

export default ImageGrid;

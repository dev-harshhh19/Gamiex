import React, { forwardRef } from 'react';
import { Link } from 'react-router-dom';

const ProductCard = forwardRef(({ product }, ref) => {
  return (
    <div 
      ref={ref}
      className="bg-card border border-border rounded-lg overflow-hidden group transition-all duration-300 hover:shadow-lg hover:-translate-y-1 animate-fade-in"
    >
      <Link to={`/product/${product._id}`} className="block">
        <div className="relative h-48 bg-gray-200 flex items-center justify-center">
          <img 
            src={product.imageUrl} 
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
        <div className="p-4">
          <h3 className="text-lg font-semibold text-card-foreground truncate transition-colors duration-300 group-hover:text-primary">
            {product.name}
          </h3>
          <p className="text-muted-foreground text-sm mt-1">{product.category}</p>
          <div className="flex items-center justify-between mt-4">
            <span className="text-xl font-bold text-primary">${product.price}</span>
            <button className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-opacity-90 transition-all duration-300 transform group-hover:scale-105">
              Add to Cart
            </button>
          </div>
        </div>
      </Link>
    </div>
  );
});

export default ProductCard;

import React from 'react';
import { Link } from 'react-router-dom';

export default function ShopCard({ shop }) {
  return (
    <div className="shop-card">
      <img src={shop.bannerImage} alt={shop.name} className="shop-card-banner" style={{ objectFit: 'cover' }} />
      <span className="shop-products-badge">{shop.productsCount}+ Products</span>
      <div className="shop-card-body">
        <img src={shop.logoImage} alt={shop.name} className="shop-card-avatar" style={{ objectFit: 'cover' }} />
        <h3 className="shop-card-name">
          {shop.name}{' '}
          {shop.verified && <i className="fa-solid fa-circle-check badge-verified" style={{ marginLeft: '4px' }}></i>}
        </h3>
        <div className="shop-card-location">
          <i className="fa-solid fa-location-dot"></i> {shop.address}
        </div>
        <div className="shop-card-category">{shop.categoryName}</div>
        <div className="shop-card-footer">
          <div className="shop-rating">
            <i className="fa-solid fa-star"></i> {shop.rating} ({shop.reviewsCount})
          </div>
          <Link 
            to={`/shop/${shop.id}`} 
            className="btn btn-outline" 
            style={{ padding: '6px 12px', fontSize: '0.85rem' }}
          >
            Visit Shop <i className="fa-solid fa-arrow-right"></i>
          </Link>
        </div>
      </div>
    </div>
  );
}

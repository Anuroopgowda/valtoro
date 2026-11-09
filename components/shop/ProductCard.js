import { discountPercent } from "./discount";

export default function ProductCard({ product, position, onBuyNow }) {
  const discount = discountPercent(product);

  return (
    <article className={`deck-card ${position}`}>
      <div className="deck-img">
        <img src={product.image} alt={product.name} draggable="false" />
        {discount > 0 && <span className="deck-badge">{discount}% OFF</span>}
      </div>
      <div className="deck-info">
        <span className="deck-cat">{product.category}</span>
        <h3>{product.name}</h3>
        <div className="deck-price">
          <strong>₹{product.price}</strong>
          {product.originalPrice ? <s>₹{product.originalPrice}</s> : null}
        </div>
        <div className="deck-rating">
          <span>★</span>
          <b>{product.rating}</b>
          <em>/ 5</em>
        </div>
        <button className="deck-buy" onClick={() => onBuyNow?.(product.id)}>
          BUY NOW
        </button>
      </div>
    </article>
  );
}

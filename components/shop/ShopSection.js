"use client";

import { useEffect, useState } from "react";
import DeckCarousel from "./DeckCarousel";
import "./deck-carousel.css";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

function toCard(product) {
  return {
    id: product.productId,
    name: product.name,
    image: product.image,
    price: product.price,
    originalPrice: product.originalPrice ?? null,
    category: product.category,
    rating: product.rating,
    reviews: product.reviews,
  };
}

export default function ShopSection() {
  const [products, setProducts] = useState([]);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const response = await fetch(`${API_URL}/api/products`);
        if (!response.ok) throw new Error(`Request failed (${response.status})`);
        const body = await response.json();
        if (cancelled) return;
        setProducts((body.products || []).map(toCard));
        setStatus("ready");
      } catch {
        if (cancelled) return;
        setProducts([]);
        setStatus("error");
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  function handleBuyNow(productId) {
    const product = products.find((item) => item.id === productId);
    console.log("Buy Now:", product);
    alert(`Buy Now clicked: ${product?.name} (${productId})`);
  }

  return (
    <div id="shop">
      {status === "loading" && <p className="shop-status">Loading collection…</p>}
      {status === "error" && (
        <p className="shop-status">The collection could not be loaded. Start the products API and refresh.</p>
      )}
      {status === "ready" && products.length === 0 && (
        <p className="shop-status">No products yet.</p>
      )}
      {status === "ready" && products.length > 0 && (
        <DeckCarousel
          products={products}
          eyebrow="Valtoro"
          title="Our Underwear Collection"
          subtitle="Swipe, drag or use the arrows to explore"
          onBuyNow={handleBuyNow}
        />
      )}
    </div>
  );
}

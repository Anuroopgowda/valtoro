"use client";

import { useRef, useState } from "react";
import ProductCard from "./ProductCard";
import "./deck-carousel.css";

export default function DeckCarousel({
  products = [],
  eyebrow = "Valtoro",
  title = "Our Underwear Collection",
  subtitle = "Swipe, drag or use the arrows to explore",
  onBuyNow,
}) {
  const trackRef = useRef(null);
  const drag = useRef({ active: false, startX: 0, scrollLeft: 0 });
  const [activeIndex, setActiveIndex] = useState(0);

  if (!products.length) return null;

  const handleScroll = () => {
    const track = trackRef.current;
    if (!track) return;

    const cards = [...track.querySelectorAll(".deck-card")];
    const trackCenter = track.scrollLeft + track.clientWidth / 2;
    let closestIndex = 0;
    let closestDistance = Infinity;

    cards.forEach((card, index) => {
      const cardCenter = card.offsetLeft + card.offsetWidth / 2;
      const distance = Math.abs(trackCenter - cardCenter);
      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = index;
      }
    });

    setActiveIndex(closestIndex);
  };

  const scrollToCard = (index) => {
    const track = trackRef.current;
    if (!track) return;
    const card = track.querySelectorAll(".deck-card")[index];
    if (!card) return;
    track.scrollTo({
      left: card.offsetLeft - (track.clientWidth - card.offsetWidth) / 2,
      behavior: "smooth",
    });
  };

  const handleMouseDown = (event) => {
    if (event.button !== 0) return;
    if (event.target.closest("button")) return;
    const track = trackRef.current;
    drag.current = { active: true, startX: event.pageX, scrollLeft: track.scrollLeft };
    track.classList.add("dragging");
  };

  const handleMouseMove = (event) => {
    if (!drag.current.active) return;
    event.preventDefault();
    const track = trackRef.current;
    const distance = event.pageX - drag.current.startX;
    track.scrollLeft = drag.current.scrollLeft - distance * 1.2;
  };

  const stopDragging = () => {
    drag.current.active = false;
    trackRef.current?.classList.remove("dragging");
  };

  const handleKeyDown = (event) => {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      scrollToCard(Math.min(activeIndex + 1, products.length - 1));
    }
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      scrollToCard(Math.max(activeIndex - 1, 0));
    }
  };

  return (
    <section className="deck-section">
      <div className="deck-head">
        <div className="deck-eyebrow">{eyebrow}</div>
        <h2 className="deck-title">{title}</h2>
        <p className="deck-sub">{subtitle}</p>
      </div>
      <div className="deck">
        <div
          className="deck-stage"
          ref={trackRef}
          onScroll={handleScroll}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={stopDragging}
          onMouseLeave={stopDragging}
          onKeyDown={handleKeyDown}
          tabIndex={0}
          role="region"
          aria-label="Scrollable product collection"
        >
          {products.map((product, index) => {
            const position = index < activeIndex ? "is-left" : index > activeIndex ? "is-right" : "is-active";
            return (
              <ProductCard
                key={product.id}
                product={product}
                position={position}
                onBuyNow={onBuyNow}
              />
            );
          })}
        </div>
        <div className="deck-dots">
          {products.map((product, index) => (
            <button
              key={product.id}
              className={`dot ${index === activeIndex ? "is-active" : ""}`}
              onClick={() => scrollToCard(index)}
              aria-label={`Go to ${product.name}`}
            >
              <span />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

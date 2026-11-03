
"use client";

import { useRef, useState } from "react";
import "./deck-carousel.css";

export default function DeckCarousel({ products = [] }) {
  const trackRef = useRef(null);

  const drag = useRef({
    active: false,
    startX: 0,
    scrollLeft: 0,
  });

  const [activeIndex, setActiveIndex] = useState(0);

  if (!products.length) return null;

  // Find the card closest to the centre
  const handleScroll = () => {
    const track = trackRef.current;
    if (!track) return;

    const cards = [...track.querySelectorAll(".deck-card")];

    const trackCenter =
      track.scrollLeft + track.clientWidth / 2;

    let closestIndex = 0;
    let closestDistance = Infinity;

    cards.forEach((card, index) => {
      const cardCenter =
        card.offsetLeft + card.offsetWidth / 2;

      const distance = Math.abs(trackCenter - cardCenter);

      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = index;
      }
    });

    setActiveIndex(closestIndex);
  };

  // Navigate using indicator dots
  const scrollToCard = (index) => {
    const track = trackRef.current;
    if (!track) return;

    const card = track.querySelectorAll(".deck-card")[index];
    if (!card) return;

    track.scrollTo({
      left:
        card.offsetLeft -
        (track.clientWidth - card.offsetWidth) / 2,
      behavior: "smooth",
    });
  };

  // Start mouse dragging
  const handleMouseDown = (event) => {
    if (event.button !== 0) return;
    if (event.target.closest("button")) return;

    const track = trackRef.current;

    drag.current = {
      active: true,
      startX: event.pageX,
      scrollLeft: track.scrollLeft,
    };

    track.classList.add("dragging");
  };

  // Move carousel horizontally
  const handleMouseMove = (event) => {
    if (!drag.current.active) return;

    event.preventDefault();

    const track = trackRef.current;
    const distance = event.pageX - drag.current.startX;

    track.scrollLeft =
      drag.current.scrollLeft - distance * 1.2;
  };

  // Stop dragging
  const stopDragging = () => {
    drag.current.active = false;
    trackRef.current?.classList.remove("dragging");
  };

  // Keyboard navigation
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

      {/* Heading */}
      <div className="deck-head">
        <div className="deck-eyebrow">
          OUR COLLECTION
        </div>

        <h2 className="deck-title">
          Explore Our Collection
        </h2>

        <p className="deck-sub">
          Discover your perfect style
        </p>
      </div>

      <div className="deck">

        {/* Horizontal scrolling track */}
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

            const cardPosition =
              index < activeIndex
                ? "is-left"
                : index > activeIndex
                  ? "is-right"
                  : "is-active";

            return (
              <article
                key={product.id}
                className={`deck-card ${cardPosition}`}
              >

                {/* Product image */}
                <div className="deck-img">
                  <img
                    src={product.image}
                    alt={product.name}
                    draggable="false"
                  />

                  {product.discount > 0 && (
                    <span className="deck-badge">
                      {product.discount}% OFF
                    </span>
                  )}
                </div>

                {/* Product information */}
                <div className="deck-info">

                  <span className="deck-cat">
                    {product.category}
                  </span>

                  <h3>{product.name}</h3>

                  <div className="deck-price">
                    <strong>₹{product.price}</strong>

                    {product.originalPrice && (
                      <s>₹{product.originalPrice}</s>
                    )}
                  </div>

                  <div className="deck-rating">
                    <span>★</span>
                    <b>{product.rating}</b>
                    <em>/ 5</em>
                  </div>

                  <button
                    className="deck-buy"
                    onClick={() =>
                      alert(`You selected ${product.name}`)
                    }
                  >
                    BUY NOW
                  </button>

                </div>

              </article>
            );
          })}

        </div>

        {/* Product indicators */}
        <div className="deck-dots">
          {products.map((product, index) => (
            <button
              key={product.id}
              className={`dot ${
                index === activeIndex ? "is-active" : ""
              }`}
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

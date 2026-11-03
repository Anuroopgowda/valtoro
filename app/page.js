"use client";
import { useEffect, useState } from "react";
import DeckCarousel from "../components/DeckCarousel";
import { products } from "../data/products";

const features = [
  { title: "Premium cotton blend", text: "Soft on skin", d: "M12 20c-4 0-7-3-7-6s3-5 6-5c0-3 2-5 5-5s6 2 6 5c0 1-.3 2-1 3 2 1 3 3 3 5 0 2-2 4-5 4h-7z" },
  { title: "Breathable fabric", text: "Keeps you fresh", d: "M4 10c6-4 10 4 16 0M4 16c6-4 10 4 16 0M4 4c6-4 10 4 16 0" },
  { title: "4-way stretch", text: "Moves with you", d: "M4 4l6 6M20 4l-6 6M4 20l6-6M20 20l-6-6" },
  { title: "Durable quality", text: "Made to last", d: "M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6l8-3zM8 12l3 3 5-6" },
];

const Svg = ({ children, size = 22 }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{children}</svg>
);

// Called with the product id when the user clicks "Buy Now".
// Replace the body with your cart logic or router.push(`/product/${productId}`).
function handleBuyNow(productId) {
  const product = products.find((p) => p.id === productId);
  console.log("Buy Now:", product);
  alert(`Buy Now clicked: ${product?.name} (${productId})`);
}

export default function Home() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header className={`nav ${scrolled ? "solid" : ""}`}>
        <a href="#home" className="brand">
          <img src="/images/logo-nav.png" alt="" />
          <span>VALTORO</span>
        </a>
        <nav aria-label="Primary">
          {["Home", "Shop", "About", "Features", "Contact"].map((l, i) => (
            <a key={l} href={`#${l.toLowerCase()}`} className={i === 0 ? "active" : ""}>{l}</a>
          ))}
        </nav>
        <div className="actions">
          <button aria-label="Search"><Svg><circle cx="11" cy="11" r="7" /><path d="M21 21l-5-5" /></Svg></button>
          <button aria-label="Account"><Svg><circle cx="12" cy="8" r="4" /><path d="M4 21c0-4 4-6 8-6s8 2 8 6" /></Svg></button>
        </div>
      </header>

      <section id="home" className="hero">
        <div className="hero-left">
          <img className="logo-big" src="/images/logo-bull.png" alt="Valtoro bull logo" />
          <h1>VALTORO</h1>
          <p className="sub">UNDERWEAR</p>
          <p className="tag">COMFORT &nbsp;/&nbsp; CONFIDENCE &nbsp;/&nbsp; EVERYDAY</p>
          <a href="#shop" className="btn-gold">Shop Now →</a>
        </div>
        <div className="hero-photo" />
        <p className="hero-quote">BUILT FOR<br />BIGGER DAYS</p>
      </section>

      <section id="features" className="features">
        {features.map((f) => (
          <div key={f.title} className="feature">
            <svg viewBox="0 0 24 24" width="44" height="44" fill="none" stroke="#d9b583" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={f.d} /></svg>
            <div><strong>{f.title}</strong><span>{f.text}</span></div>
          </div>
        ))}
      </section>

      <div id="shop">
        <DeckCarousel
          products={products}
          eyebrow="Valtoro"
          title="Our Underwear Collection"
          subtitle="Swipe, drag or use the arrows to explore"
          onBuyNow={handleBuyNow}
        />
      </div>

      <section id="about" className="more">
        <img className="box" src="/images/box.jpg" alt="Valtoro gift box with three boxer briefs" />
        <div className="more-text">
          <h2>MORE THAN<br />JUST UNDERWEAR</h2>
          <a href="#contact" className="btn-outline">Explore More →</a>
        </div>
      </section>

      <footer id="contact" className="footer">
        © {new Date().getFullYear()} Valtoro Underwear. Good things feel better.
      </footer>
    </>
  );
}
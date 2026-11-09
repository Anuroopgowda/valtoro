"use client";

import { useEffect, useState } from "react";
import Icon from "../icons/Icon";
import "./header.css";

const LINKS = ["Home", "Shop", "About", "Features", "Contact"];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`nav ${scrolled ? "solid" : ""}`}>
      <a href="#home" className="brand">
        <img src="/images/logo-nav.png" alt="" />
        <span>VALTORO</span>
      </a>
      <nav aria-label="Primary">
        {LINKS.map((label, index) => (
          <a key={label} href={`#${label.toLowerCase()}`} className={index === 0 ? "active" : ""}>
            {label}
          </a>
        ))}
      </nav>
      <div className="actions">
        <button aria-label="Search">
          <Icon>
            <circle cx="11" cy="11" r="7" />
            <path d="M21 21l-5-5" />
          </Icon>
        </button>
        <button aria-label="Account">
          <Icon>
            <circle cx="12" cy="8" r="4" />
            <path d="M4 21c0-4 4-6 8-6s8 2 8 6" />
          </Icon>
        </button>
      </div>
    </header>
  );
}

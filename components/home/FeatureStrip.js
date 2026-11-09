import { features } from "./features";
import "./feature-strip.css";

export default function FeatureStrip() {
  return (
    <section id="features" className="features">
      {features.map((feature) => (
        <div key={feature.title} className="feature">
          <svg viewBox="0 0 24 24" width="44" height="44" fill="none" stroke="#d9b583" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d={feature.d} />
          </svg>
          <div>
            <strong>{feature.title}</strong>
            <span>{feature.text}</span>
          </div>
        </div>
      ))}
    </section>
  );
}

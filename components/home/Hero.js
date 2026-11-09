import "./hero.css";

export default function Hero() {
  return (
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
  );
}

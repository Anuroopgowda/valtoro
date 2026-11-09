import "./about-banner.css";

export default function AboutBanner() {
  return (
    <section id="about" className="more">
      <img className="box" src="/images/box.jpg" alt="Valtoro gift box with three boxer briefs" />
      <div className="more-text">
        <h2>MORE THAN<br />JUST UNDERWEAR</h2>
        <a href="#contact" className="btn-outline">Explore More →</a>
      </div>
    </section>
  );
}

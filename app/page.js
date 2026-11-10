import Header from "../components/layout/Header";
import Hero from "../components/home/Hero";
import FeatureStrip from "../components/home/FeatureStrip";
import AboutBanner from "../components/home/AboutBanner";
import Footer from "../components/layout/Footer";
import ShopSection from "../components/shop/ShopSection";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <Header />
      <Hero />
      <FeatureStrip />
      <ShopSection />
      <AboutBanner />
      <Footer />
      <Link className="inventory-entry" href="/inventory">Inventory</Link>
    </>
  );
}

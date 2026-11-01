import { Jost } from "next/font/google";
import "./globals.css";

const jost = Jost({ subsets: ["latin"], weight: ["300", "400", "500", "600"] });

export const metadata = {
  title: "Valtoro Underwear | Comfort, Confidence, Everyday",
  description: "Premium cotton-blend underwear with 4-way stretch. Built for bigger days.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={jost.className}>{children}</body>
    </html>
  );
}

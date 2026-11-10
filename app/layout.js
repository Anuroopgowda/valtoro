import "./globals.css";
import VisitTracker from "../components/layout/VisitTracker";

export const metadata = {
  title: "Valtoro Underwear | Comfort, Confidence, Everyday",
  description: "Premium cotton-blend underwear with 4-way stretch. Built for bigger days.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <VisitTracker />
        {children}
      </body>
    </html>
  );
}

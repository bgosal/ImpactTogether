import { Navbar } from "@components/NavBar";
import { Footer } from "@components/Footer"
import "./globals.css";

export const metadata = {
  title: "ImpactTogether",
  description: "Build a better community through volunteering",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
          {children}
        <Footer />
      </body>
    </html>
  );
}

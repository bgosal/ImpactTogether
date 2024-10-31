import { Provider } from "@components/Provider"
import { Navbar } from "@components/NavBar"
import { Footer } from "@components/Footer"

import { Righteous } from 'next/font/google'

import "./css/globals.css";
import "./css/event.css";
import "./css/authentication.css";
import "./css/account-management.css"
import "./css/organization-management.css"

export const metadata = {
  title: "ImpactTogether",
  description: "Build a better community through volunteering",
};

const righteous = Righteous({
  subsets: ['latin'],
  weight: '400'
});

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={righteous.className}>
      <body>
        <Provider>
          <Navbar />
            {children}
          <Footer /> 
        </Provider>
      </body>
    </html>
  );
}

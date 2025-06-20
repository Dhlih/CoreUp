import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "../components/sections/Navbar.jsx";
import Footer from "../components/sections/Footer.jsx";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "CoreUp",
  description: "Made with love for learners.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Navbar /> {/* Akan muncul di semua halaman */}
        <main>{children}</main>
      </body>
    </html>
  );
}

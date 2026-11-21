
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CartProvider } from "@/context/CartContext";

export const metadata = {
  title: "Shreyoshi Foods | Pure Nature, Pure Taste",
  description:
    "Discover natural and quality food products at Shreyoshi Foods.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        <CartProvider>
          <Navbar />

          <main>{children}</main>

          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}

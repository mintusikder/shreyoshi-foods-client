
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
<<<<<<< HEAD
import { CartProvider } from "@/context/CartContext";
=======
>>>>>>> f9a220253cddcce1221902b340ed5610ee482fc6

export const metadata = {
  title: "Shreyoshi Foods | Pure Nature, Pure Taste",
  description:
    "Discover natural and quality food products at Shreyoshi Foods.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
<<<<<<< HEAD
      <body suppressHydrationWarning>
        <CartProvider>
          <Navbar />

          <main>{children}</main>

          <Footer />
        </CartProvider>
=======
      <body>
        <Navbar />

        <main>{children}</main>

        <Footer />
>>>>>>> f9a220253cddcce1221902b340ed5610ee482fc6
      </body>
    </html>
  );
}

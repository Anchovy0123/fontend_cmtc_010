import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import Navigation from "./components/nav";
import Footer from "./components/footer";

// ฟอนต์จาก Google Fonts
import { Orbitron } from "next/font/google";
import { Prompt } from "next/font/google";
import { Geist, Geist_Mono } from "next/font/google";

// โหลดฟอนต์
const orbitron = Orbitron({
  subsets: ["latin"],
  weight: ["600"],
  variable: "--font-orbitron",
});

const prompt = Prompt({
  subsets: ["thai", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
  variable: "--font-prompt",
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Metadata หน้าเว็บ
export const metadata = {
  title: "Rhodes Island",
  description: "ระบบธีม Arknights โดย 010 โชติกร",
};

// Layout หลักของเว็บไซต์
export default function RootLayout({ children }) {
  return (
    <html lang="th">
      <body
        className={`
          ${prompt.variable}
          ${geistSans.variable}
          ${geistMono.variable}
          ${orbitron.variable}
          d-flex flex-column min-vh-100
          bg-dark text-light
        `}
        style={{
          fontFamily: "var(--font-prompt), var(--font-orbitron), sans-serif",
        }}
      >
        <Navigation />
        <main className="flex-grow-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}

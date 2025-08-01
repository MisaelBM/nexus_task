import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Nexus Task",
  description:"Produtividade, Gerenciamento e Simplicidade",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-br">
      <head>
        <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
      </head>
      <body
        id="body"
        className={`${geistSans.variable} ${geistMono.variable} relative antialiased`}
      >
        {children}
      </body>
    </html>
  );
}

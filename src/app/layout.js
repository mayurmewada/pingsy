import { Noto_Sans } from "next/font/google";
import localFont from 'next/font/local';
import "./globals.css";

const notoSans = Noto_Sans({
  variable: "--font-noto-sans",
  subsets: ["latin"],
});

const vonca = localFont({
  src: './fonts/vonca-medium.otf', // Adjust path if needed
  display: 'swap',
  variable: '--font-vonca-medium',
});

export const metadata = {
  title: "Pingsy",
  description: "Chat App",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${vonca.variable} ${notoSans.className} overflow-hidden`}
      >
        {children}
      </body>
    </html>
  );
}

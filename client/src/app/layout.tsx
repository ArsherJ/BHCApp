import "./globals.css";
import type { Metadata } from "next";
import { Providers } from "./redux/provider";
import { Poppins } from "next/font/google";
import { useSelector } from "react-redux";
import { IRoot } from "./redux/interfaces";
const poppins = Poppins({
  subsets: ["latin"],
  weight: "400",
});
export const metadata: Metadata = {
  title: "CHO1",
  description: "Barangay Health Center, City Health Office 1",
  icons: [{ rel: "icon", url: "/dasmariñasLogo.png" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="lemonade">
      <body className={poppins.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "苗栗預售屋資訊 | 後龍、竹南、頭份價格比較",
  description: "苗栗縣後龍、竹南、頭份預售屋及新成屋價格資訊整理",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-TW">
      <body className="antialiased">{children}</body>
    </html>
  );
}

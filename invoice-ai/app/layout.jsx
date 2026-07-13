import "./globals.css";

export const metadata = {
  title: "Invoice AI",
  description: "AI Invoice SaaS",
};

export default function RootLayout({ children }) {
  return (
    <html lang="nl">
      <body>{children}</body>
    </html>
  );
}
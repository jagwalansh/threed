import "./globals.css";

export const metadata = {
  title: "threeD - No-code 3D website animation editor",
  description:
    "threeD is a no-code 3D website animation editor. Draw motion paths, position 3D assets, and export production-ready code.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}

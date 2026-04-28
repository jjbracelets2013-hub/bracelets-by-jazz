export const metadata = {
  title: "Bracelets By Jazz",
  description: "Colorful jewelry store",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

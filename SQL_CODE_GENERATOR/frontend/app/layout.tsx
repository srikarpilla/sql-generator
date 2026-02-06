import "./globals.css";

export const metadata = {
  title: "English to SQL Generator",
  description: "Convert natural language to SQL using a local LLM",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

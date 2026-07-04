export const metadata = {
  title: "SQL Trainer · Consumer Growth",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="stylesheet" href="/trainer.css" />
      </head>
      <body>{children}</body>
    </html>
  );
}

export const metadata = {
  title: "SQL Trainer · Consumer Growth",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem("theme");if(t)document.documentElement.setAttribute("data-theme",t);}catch(e){}})();`,
          }}
        />
        <link rel="stylesheet" href="/trainer.css" />
      </head>
      <body>{children}</body>
    </html>
  );
}

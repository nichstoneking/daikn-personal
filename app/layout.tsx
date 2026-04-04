import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "nick",
  openGraph: {
    title: "nick",
    images: [
      {
        url: "https://daikn-personal.vercel.app/preview.png",
        width: 1200,
        height: 630,
      },
    ],
    url: "https://daikn-personal.vercel.app",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    images: ["https://daikn-personal.vercel.app/preview.png"],
  },
  icons: {
    icon: "/pfp.jpg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div className="flex flex-row justify-center text-white bg-[#111313] overflow-auto">
          <div className="sm:w-[600px] w-[300px] min-h-screen justify-self-center text-center">
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}

import ScrollToTop from "@/components/common/ScrollToTop";
import "./globals.css";
import { Poppins, Roboto_Mono } from "next/font/google";
import NextTopLoader from "nextjs-toploader";
import { Toaster } from "react-hot-toast";
import { Suspense } from "react";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
});

const robotoMono = Roboto_Mono({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-roboto-mono",
});

export const metadata = {
  title: "π Dimension - AI π",
  description: "Create an alternate-universe twin powered by generative AI.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${poppins.variable} ${robotoMono.variable}`}>
      <body className="bg-zinc-950 text-white ">
        <Suspense>
          <ScrollToTop />
        </Suspense>
        <NextTopLoader showSpinner={false} color="#BA8CFC" />
        {children}
        <Toaster />
      </body>
    </html>
  );
}

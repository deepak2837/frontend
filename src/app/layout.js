import localFont from "next/font/local";
import "./globals.css";
import Header from "@/components/common/Header";
import NewFooter from "@/components/common/NewFooter";
import ToastProvider from "@/components/Toast";
import SecurityWrapper from "@/components/screenshot/SecurityWrapper";
import AuthInitializer from "@/components/common/AuthInitializer";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = {
  title: "Medgloss",
  description: "Medgloss your study buddy",
  // Add the Fast2SMS meta tag using the 'other' property in metadata
  other: {
    fast2sms: "wEtt2Ocsm8yfOAx738UzmMm4RTpHCLNt",
  },
};

export default function RootLayout({ children, Component, pageProps }) {
  return (
    <html lang="en">
      <head>
        <meta name="fast2sms" content="wEtt2Ocsm8yfOAx738UzmMm4RTpHCLNt" />
        {/* Google AdSense Meta Tag */}
        <meta name="google-adsense-account" content="ca-pub-3706062176737311" />
        {/* Google AdSense Script */}
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3706062176737311"
          crossOrigin="anonymous"
        ></script>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="min-h-screen flex flex-col">
          <SecurityWrapper />
          <AuthInitializer />
          <Header />
          {/* <Aside/> */}
          {/* <TopAdSection/> */}
          <main className="flex-1 bg-white z-10 w-full">
            {children}
          </main>

          {/* <BottomAdSection/> */}
          <footer className="z-10 mt-auto w-full">
            <NewFooter />
          </footer>
        </div>
        <ToastProvider />
      </body>
    </html>
  );
}

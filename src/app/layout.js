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
        {/* Remove Google AdSense Meta Tag and Script */}
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="min-h-screen flex flex-col">
          <SecurityWrapper />
          <AuthInitializer />
          <Header />
          {/* <Aside/> */}
          {/* Remove TopAdSection and BottomAdSection references */}
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

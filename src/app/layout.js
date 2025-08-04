import localFont from "next/font/local";
import "./globals.css";
import Header from "@/components/common/Header";
import NewFooter from "@/components/common/NewFooter";
import ToastProvider from "@/components/Toast";
import SecurityWrapper from "@/components/screenshot/SecurityWrapper";
import AuthInitializer from "@/components/common/AuthInitializer";
import Script from "next/script";
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
        {/* Google Tag Manager */}
        <Script
          id="google-tag-manager"
          dangerouslySetInnerHTML={{
            __html: `
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','GTM-TFJBZFNR');
            `,
          }}
        />
        {/* Google tag (gtag.js) */}
        <Script async src="https://www.googletagmanager.com/gtag/js?id=G-CRVPXNP38V"></Script>
        <Script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5697744162151946"
     crossorigin="anonymous"></Script>
        <Script
          id="google-analytics"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-CRVPXNP38V');
            `,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe 
            src="https://www.googletagmanager.com/ns.html?id=GTM-TFJBZFNR"
            height="0" 
            width="0" 
            style={{display: 'none', visibility: 'hidden'}}
          />
        </noscript>
        {/* End Google Tag Manager (noscript) */}
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

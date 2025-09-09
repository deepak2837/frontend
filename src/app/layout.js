import localFont from "next/font/local";
import "./globals.css";
import Header from "@/components/common/Header";
import NewFooter from "@/components/common/NewFooter";
import ToastProvider from "@/components/Toast";
import SecurityWrapper from "@/components/screenshot/SecurityWrapper";
import AuthInitializer from "@/components/common/AuthInitializer";
import AdsterraAd from "@/components/AdSection/AdsterraAd";
import Script from "next/script";
import Aside from "@/components/AdSection/Aside";
import DesktopAsideAds from "@/components/AdSection/DesktopAsideAds";

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
          {/* <AdsterraAd /> */}
          <DesktopAsideAds />
          {/* <Aside/> */}
          {/* Remove TopAdSection and BottomAdSection references */}
          <div className="main flex-1 bg-white z-10 w-full">
            <main>
              {children}
            </main>
          </div>
          {/* Mobile bottom ad: only show on mobile, after children, before footer */}
          {/* <div
            id="mobile-ad-bottom"
            style={{
              width: "100%",
              minHeight: "100px",
              background: "#f0f0f0",
              border: "1px solid #ccc",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "12px 0",
              zIndex: 30,
            }}
          >
            <Script type="text/javascript" id="mobile-ad-bottom-options" strategy="afterInteractive">
              {`
                atOptions = {
                  'key' : '6f3b82a50edc590c32222299e704b9c7',
                  'format' : 'iframe',
                  'height' : 90,
                  'width' : 728,
                  'params' : {}
                };
              `}
            </Script>
            <Script
              id="mobile-ad-bottom-script"
              type="text/javascript"
              strategy="afterInteractive"
              src="//www.highperformanceformat.com/6f3b82a50edc590c32222299e704b9c7/invoke.js"
            />
          </div> */}
          {/* Adsterra Ad - positioned between main content and footer */}
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

"use client";
import { useEffect, useState } from "react";
import Script from "next/script";
import { createPortal } from "react-dom";
import { useAds } from "@/contexts/AdsContext";

// Flag to show mobile ads on desktop when true
const SHOW_MOBILE_ADS_ON_DESKTOP = true;

const adStyle = {
  position: "fixed",
  top: "100px",
  width: "160px",
  height: "600px",
  zIndex: 40,
  padding: "0",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const adStyleMobileTop = {
  width: "100%",
  minHeight: "100px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  margin: "12px auto",
  zIndex: 30,
  textAlign: "center",
};

const adStyleMobileBottom = {
  width: "100%",
  minHeight: "100px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  margin: "12px auto",
  zIndex: 30,
  textAlign: "center",
};

const DesktopAsideAds = () => {
  const { canShowAds, loading } = useAds();
  const [screen, setScreen] = useState("desktop"); // "desktop" | "mobile" | "none"
  const [headerContainer, setHeaderContainer] = useState(null);
  const [footerContainer, setFooterContainer] = useState(null);

  useEffect(() => {
    const check = () => {
      if (window.innerWidth < 768) setScreen("mobile");
      else if (window.innerWidth >= 1024) setScreen("desktop") ;
       // Changed from "none" to "tablet"
       else setScreen("tablet");
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Create portal containers for mobile ads
  useEffect(() => {
    if (loading || !canShowAds()) return; // Don't create portals if ads shouldn't show
    if (screen === "mobile"   || screen === "tablet" || (screen === "desktop"  && SHOW_MOBILE_ADS_ON_DESKTOP)) {
      // Create container after header
      const headerAd = document.createElement("div");
      headerAd.id = "mobile-header-ad-portal";
      const header = document.querySelector("header") || document.querySelector("nav");
      if (header && header.parentNode) {
        header.parentNode.insertBefore(headerAd, header.nextSibling);
        setHeaderContainer(headerAd);
      }

      // Create container before footer
      const footerAd = document.createElement("div");
      footerAd.id = "mobile-footer-ad-portal";
      const footer = document.querySelector("footer");
      if (footer && footer.parentNode) {
        footer.parentNode.insertBefore(footerAd, footer);
        setFooterContainer(footerAd);
      }

      return () => {
        if (headerAd.parentNode) headerAd.parentNode.removeChild(headerAd);
        if (footerAd.parentNode) footerAd.parentNode.removeChild(footerAd);
        setHeaderContainer(null);
        setFooterContainer(null);
      };
    }
  }, [screen, loading, canShowAds]);

  // Desktop ad script injection
  useEffect(() => {
    if (screen !== "desktop") return;
    if (loading || !canShowAds()) return; // Don't inject scripts if ads shouldn't show
    
    // Left ad
    const leftScript = document.createElement("script");
    leftScript.async = true;
    leftScript.setAttribute("data-cfasync", "false");
    leftScript.src = "//pl27443368.revenuecpmgate.com/dd5c7c3ddbb1a6f1c4b387dc122cfe65/invoke.js";
    const leftDiv = document.getElementById("container-dd5c7c3ddbb1a6f1c4b387dc122cfe65");
    if (leftDiv) leftDiv.innerHTML = "";
    leftDiv?.appendChild(leftScript);

    // Right ad
    const rightScript = document.createElement("script");
    rightScript.async = true;
    rightScript.setAttribute("data-cfasync", "false");
    rightScript.src = "//pl27551376.revenuecpmgate.com/adef7eea5d530e44cc4ad7f61c7f4b73/invoke.js";
    const rightDiv = document.getElementById("container-adef7eea5d530e44cc4ad7f61c7f4b73");
    if (rightDiv) rightDiv.innerHTML = "";
    rightDiv?.appendChild(rightScript);

    return () => {
      leftDiv && (leftDiv.innerHTML = "");
      rightDiv && (rightDiv.innerHTML = "");
    };
  }, [screen, loading, canShowAds]);

  // Mobile ads component
  const MobileAds = () => (
    <>
      {/* Mobile ad below header */}
      {headerContainer && createPortal(
        <div style={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}>
          <div style={adStyleMobileTop}>
            <div style={{ 
              width: "100%", 
              minHeight: "100px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}>
              <Script type="text/javascript" id="mobile-header-ad-async" strategy="afterInteractive">
                {`
                  if (typeof atAsyncOptions !== 'object') var atAsyncOptions = [];
                  atAsyncOptions.push({
                      'key': '564f7ea5e89127fe6d495032756937a5',
                      'format': 'js',
                      'async': true,
                      'container': 'atContainer-564f7ea5e89127fe6d495032756937a5',
                      'params' : {}
                  });
                  var script = document.createElement('script');
                  script.type = "text/javascript";
                  script.async = true;
                  script.src = 'http' + (location.protocol === 'https:' ? 's' : '') + '://www.highperformanceformat.com/564f7ea5e89127fe6d495032756937a5/invoke.js';
                  document.getElementsByTagName('head')[0].appendChild(script);
                `}
              </Script>
              <div id="atContainer-564f7ea5e89127fe6d495032756937a5" style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
              }}></div>
            </div>
          </div>
        </div>,
        headerContainer
      )}
      
      {/* Mobile ad above footer */}
      {footerContainer && createPortal(
        <div style={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}>
          <div style={adStyleMobileBottom}>
            <div style={{ 
              width: "100%", 
              minHeight: "100px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}>
              <Script type="text/javascript" id="mobile-footer-ad-async" strategy="afterInteractive">
                {`
                  if (typeof atAsyncOptions !== 'object') var atAsyncOptions = [];
                  atAsyncOptions.push({
                      'key': '6f3b82a50edc590c32222299e704b9c7',
                      'format': 'js',
                      'async': true,
                      'container': 'atContainer-6f3b82a50edc590c32222299e704b9c7',
                      'params' : {}
                  });
                  var script = document.createElement('script');
                  script.type = "text/javascript";
                  script.async = true;
                  script.src = 'http' + (location.protocol === 'https:' ? 's' : '') + '://www.highperformanceformat.com/6f3b82a50edc590c32222299e704b9c7/invoke.js';
                  document.getElementsByTagName('head')[0].appendChild(script);
                `}
              </Script>
              <div id="atContainer-6f3b82a50edc590c32222299e704b9c7" style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
              }}></div>
            </div>
          </div>
        </div>,
        footerContainer
      )}
    </>
  );

  // Don't show ads if loading or if ads are disabled for this page
  const shouldRenderAds = !loading && canShowAds();

  if (screen === "desktop") {
    return (
      <>
        {/* Desktop sidebar ads */}
        {shouldRenderAds && (
          <>
            <div style={{ ...adStyle, left: 10 }}>
              <div id="container-dd5c7c3ddbb1a6f1c4b387dc122cfe65" style={{ width: "160px", height: "600px" }} />
            </div>
            <div style={{ ...adStyle, right: 10 }}>
              <div id="container-adef7eea5d530e44cc4ad7f61c7f4b73" style={{ width: "160px", height: "600px" }} />
            </div>
            
            {/* Show mobile ads on desktop if flag is enabled */}
            {SHOW_MOBILE_ADS_ON_DESKTOP && <MobileAds />}
          </>
        )}
      </>
    );
  }

  if (screen === "mobile" || screen === "tablet") {
    console.log(screen);
    return shouldRenderAds ? <MobileAds /> : null;
  }

  return null;
};

export default DesktopAsideAds;

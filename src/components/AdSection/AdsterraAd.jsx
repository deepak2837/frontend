"use client";
import Script from "next/script";
import { useEffect, useRef } from "react";

const AdsterraAd = () => {
  const adRef = useRef(null);

  useEffect(() => {
    if (!adRef.current) return;

    adRef.current.innerHTML = `
<script async="async" data-cfasync="false" src="//pl27443368.profitableratecpm.com/dd5c7c3ddbb1a6f1c4b387dc122cfe65/invoke.js"></script>
<div id="container-dd5c7c3ddbb1a6f1c4b387dc122cfe65"></div>`;
  }, []);

  return (
    <div className="adsterra-ad-container flex justify-center items-center my-4">
      <div 
        id="adsterra-ad"
        className=""

      >
        
        {/* <Script async="async" data-cfasync="false" src="//pl27443368.revenuecpmgate.com/dd5c7c3ddbb1a6f1c4b387dc122cfe65/invoke.js"></Script>
<div id="container-dd5c7c3ddbb1a6f1c4b387dc122cfe65"></div> */}

      </div>
    </div>
  );
};

export default AdsterraAd;
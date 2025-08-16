"use client";

import { useEffect, useRef } from "react";

const AdsterraAd = () => {
  const adContainerRef = useRef(null);

  useEffect(() => {
    // Check if ad is already loaded
    if (adContainerRef.current && adContainerRef.current.children.length > 0) {
      return;
    }

    // Adsterra ad script
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.innerHTML = `
      atOptions = {
        'key' : 'f70e881250db3bcb78e3aa00958c28cf',
        'format' : 'iframe',
        'height' : 250,
        'width' : 300,
        'params' : {}
      };
      document.write('<scr' + 'ipt type="text/javascript" src="http' + (location.protocol === 'https:' ? 's' : '') + '://www.profitabledisplaynetwork.com/f70e881250db3bcb78e3aa00958c28cf/invoke.js"></scr' + 'ipt>');
    `;
    
    // Append script to head
    document.head.appendChild(script);

    // Cleanup function
    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  return (
    <div className="adsterra-ad-container flex justify-center items-center my-4">
      <div 
        ref={adContainerRef}
        id="adsterra-ad"
        className="bg-gray-100 border border-gray-200 rounded-lg overflow-hidden flex items-center justify-center"
        style={{ width: '300px', height: '250px' }}
      >
        <div className="text-gray-400 text-sm">Loading ad...</div>
      </div>
    </div>
  );
};

export default AdsterraAd; 
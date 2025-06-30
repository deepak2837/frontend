"use client";
import { useEffect } from "react";

export default function AdSenseClientOnly() {
  useEffect(() => {
    try {
      if (window) {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }
    } catch (e) {}
  }, []);

  return (
    <ins
      className="adsbygoogle"
      style={{ display: "block" }}
      data-ad-client="ca-pub-3706062176737311"
      data-ad-slot="6944319273"
      data-ad-format="auto"
      data-full-width-responsive="true"
    ></ins>
  );
}

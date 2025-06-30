"use client";
import React, { useEffect } from 'react';
import dynamic from "next/dynamic";

import styles from './Aside.module.css';

const AdSenseClientOnly = dynamic(() => import("./AdSenseClientOnly"), { ssr: false });

const Aside = () => {
  useEffect(() => {
    if (typeof window !== 'undefined' && window.adsbygoogle) {
      try {
        // Initialize both left and right ads
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (e) {
        // ignore
      }
    }
  }, []);

  return (
    <div className={styles.asideContainer}>
      {/* Left Ad Section */}
      <div className={styles.leftAd}>
        <AdSenseClientOnly />
      </div>

      {/* Right Ad Section */}
      <div className={styles.rightAd}>
        <AdSenseClientOnly />
      </div>
    </div>
  );
};

export default Aside;
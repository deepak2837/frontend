"use client";
import React, { useEffect } from 'react';

import styles from './Aside.module.css';

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
        <ins
          className="adsbygoogle"
          style={{ display: 'block' }}
          data-ad-client="ca-pub-3706062176737311"
          data-ad-slot="6944319273"
          data-ad-format="auto"
          data-full-width-responsive="true"
        ></ins>
      </div>

      {/* Right Ad Section */}
      <div className={styles.rightAd}>
        <ins
          className="adsbygoogle"
          style={{ display: 'block' }}
          data-ad-client="ca-pub-3706062176737311"
          data-ad-slot="6944319273"
          data-ad-format="auto"
          data-full-width-responsive="true"
        ></ins>
      </div>
    </div>
  );
};

export default Aside;
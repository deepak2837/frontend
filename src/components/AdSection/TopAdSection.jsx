"use client"; // Ensures this runs only on the client side

import { useEffect } from "react";
import styles from "./AdSection.module.css"; // Ensure you are using CSS modules correctly

const TopAdSection = () => {

  return (
    <div className={`${styles.adSection} block md:hidden`}>
      <div className="topAd bg-gray-200 mx-4 mt-20 h-[100px]">
      
       </div>
    </div>
  );
};

export default TopAdSection;

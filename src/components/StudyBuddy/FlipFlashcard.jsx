"use client";
import React from 'react';
import styles from './FlipFlashcard.module.css';

export default function FlipFlashcard({ flashcard, isFlipped }) {
  return (
    <div className={styles.flashcardContainer}>
      <div className={`${styles.flashcard} ${isFlipped ? styles.flipped : ''}`}>
        {/* Front */}
        <div className={styles.flashcardFront}>
          <h3 className={styles.label}>Question:</h3>
          <p className={styles.text}>{flashcard.frontText}</p>
          <div className={styles.hint}>Click to reveal answer</div>
        </div>

        {/* Back */}
        <div className={styles.flashcardBack}>
          <h3 className={styles.label}>Answer:</h3>
          <p className={styles.text}>{flashcard.backText}</p>
          <div className={styles.hint}>Click to see question again</div>
        </div>
      </div>
    </div>
  );
}

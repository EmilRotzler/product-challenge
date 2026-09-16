"use client";

import { useState } from "react";
import Image from "next/image";
import styles from "./ImageCarousel.module.css";

const SLIDE_COUNT = 4;
const PLACEHOLDER_SRC = "/product-placeholder.svg";

export function ImageCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className={styles.carousel}>
      <div className={styles.mainImageWrapper}>
        <Image
          src={PLACEHOLDER_SRC}
          alt=""
          fill
          sizes="(min-width: 1024px) 60vw, 100vw"
          className={styles.mainImage}
          priority
        />
      </div>
      <div className={styles.thumbnails}>
        {Array.from({ length: SLIDE_COUNT }, (_, index) => (
          <button
            key={index}
            type="button"
            aria-label={`Show image ${index + 1}`}
            aria-current={index === activeIndex}
            onClick={() => setActiveIndex(index)}
            className={index === activeIndex ? styles.thumbnailActive : styles.thumbnail}
          >
            <Image src={PLACEHOLDER_SRC} alt="" fill sizes="80px" className={styles.thumbnailImage} />
          </button>
        ))}
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";

const src = (n: string) => (/^https?:\/\//.test(n) ? n : `/assets/media/stills/${n}.jpg`);

export default function Gallery({ frames, title }: { frames: string[]; title: string }) {
  const [at, setAt] = useState(0);
  return (
    <section className="study__gallery">
      <div className="study__screen">
        <img src={src(frames[at])} alt={`${title} — screen ${at + 1}`} />
      </div>
      {frames.length > 1 && (
        <div className="monitor__strip">
          {frames.map((f, i) => (
            <button
              key={f}
              type="button"
              className={`monitor__frame${i === at ? " is-on" : ""}`}
              aria-label={`Screen ${i + 1}`}
              aria-current={i === at}
              onClick={() => setAt(i)}
            >
              <img src={src(f)} alt="" loading="lazy" />
            </button>
          ))}
        </div>
      )}
    </section>
  );
}

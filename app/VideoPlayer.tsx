"use client";

import { useState } from "react";
import { resolveVideo } from "@/lib/video";

/** Nothing from a video host loads until somebody presses play. Until then it
 *  is the still you already had, so the page stays fast and no third party
 *  sees a visitor who never watched anything. */
export default function VideoPlayer({
  video, poster, title,
}: { video: string; poster?: string; title: string }) {
  const [playing, setPlaying] = useState(false);
  const source = resolveVideo(video);

  if (!source) {
    return (
      <span className="play">
        {poster && <img className="shot" src={poster} alt={`${title} — frame`} />}
      </span>
    );
  }

  if (!playing) {
    return (
      <button className="play" type="button" onClick={() => setPlaying(true)} aria-label={`Play ${title}`}>
        {poster
          ? <img className="shot" src={poster} alt="" />
          : <span className="play__blank" aria-hidden="true" />}
        <span className="play__btn" aria-hidden="true" />
        <span className="play__hint">Play</span>
      </button>
    );
  }

  if (source.kind === "file") {
    return (
      <span className="play play--live">
        {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
        <video className="play__video" src={source.src} poster={poster} controls autoPlay playsInline />
      </span>
    );
  }

  return (
    <span className="play play--live">
      <iframe
        className="play__frame"
        src={source.src}
        title={`${title} — ${source.title}`}
        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; fullscreen"
        allowFullScreen
        loading="lazy"
        referrerPolicy="strict-origin-when-cross-origin"
      />
    </span>
  );
}

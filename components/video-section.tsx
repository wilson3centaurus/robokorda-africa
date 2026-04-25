"use client";

import { useState, useRef } from "react";
import { Play, Pause, Volume2, VolumeX, Maximize2, Film } from "lucide-react";
import Link from "next/link";
import { Reveal } from "@/components/reveal";
import { SectionHeader } from "@/components/section-header";

type VideoSectionProps = {
  videoUrl?: string;
  eyebrow?: string;
  title?: string;
  description?: string;
  bgClass?: string;
  fullBleed?: boolean;
};

function getYouTubeId(url: string): string | null {
  const short = url.match(/youtu\.be\/([a-zA-Z0-9_-]+)/);
  if (short) return short[1];
  const watch = url.match(/[?&]v=([a-zA-Z0-9_-]+)/);
  if (watch) return watch[1];
  const embed = url.match(/embed\/([a-zA-Z0-9_-]+)/);
  if (embed) return embed[1];
  return null;
}

function isYouTube(url: string) {
  return url.includes("youtube.com") || url.includes("youtu.be");
}

function isVimeo(url: string) {
  return url.includes("vimeo.com");
}

function getVimeoId(url: string): string | null {
  const match = url.match(/vimeo\.com\/(\d+)/);
  return match ? match[1] : null;
}

export function VideoSection({
  videoUrl,
  eyebrow = "Watch",
  title,
  description,
  bgClass = "section-glow",
  fullBleed = false,
}: VideoSectionProps) {
  const [paused, setPaused] = useState(false);
  const [muted, setMuted] = useState(true);
  const [showControls, setShowControls] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const hasVideo = !!videoUrl;
  const ytId = hasVideo && isYouTube(videoUrl!) ? getYouTubeId(videoUrl!) : null;
  const vimeoId = hasVideo && isVimeo(videoUrl!) ? getVimeoId(videoUrl!) : null;
  const isEmbed = ytId !== null || vimeoId !== null;

  function handleClick() {
    if (!videoRef.current) return;
    if (paused) {
      videoRef.current.play();
      setPaused(false);
    } else {
      videoRef.current.pause();
      setPaused(true);
    }
  }

  function handleMute(e: React.MouseEvent) {
    e.stopPropagation();
    if (!videoRef.current) return;
    videoRef.current.muted = !muted;
    setMuted((m) => !m);
  }

  function handleFullscreen(e: React.MouseEvent) {
    e.stopPropagation();
    videoRef.current?.requestFullscreen?.();
  }

  const embedSrc = ytId
    ? `https://www.youtube.com/embed/${ytId}?rel=0&modestbranding=1&autoplay=1&mute=1&loop=1&playlist=${ytId}`
    : vimeoId
    ? `https://player.vimeo.com/video/${vimeoId}?autoplay=1&muted=1&loop=1&color=342fc5&title=0&byline=0&portrait=0`
    : null;

  const rounded = fullBleed ? "" : "rounded-2xl";

  // For fullBleed: full viewport height on all screens; for normal: 16/9 aspect ratio
  const containerStyle = fullBleed ? undefined : { aspectRatio: "16/9" };
  const containerCls = fullBleed
    ? `relative w-full min-h-[100svh] cursor-pointer`
    : `relative w-full cursor-pointer ${rounded}`;

  const videoContent = (
    <>
      {!hasVideo ? (
        /* ── Placeholder ── */
        <div
          className={`relative flex flex-col items-center justify-center gap-6 py-20 px-6 text-center bg-background ${rounded} ${fullBleed ? "min-h-[100svh]" : ""}`}
          style={fullBleed ? undefined : { aspectRatio: "16/9" }}
        >
          <div className={`absolute inset-0 circuit-bg opacity-20 ${rounded}`} />
          <div className="relative flex items-center justify-center">
            <div className="absolute h-32 w-32 rounded-full border border-[var(--surface-border-subtle)] animate-pulse" />
            <div className="absolute h-20 w-20 rounded-full border border-[var(--surface-border)]" />
            <span className="relative z-10 flex h-14 w-14 items-center justify-center rounded-full border border-[var(--surface-border)] bg-[var(--electric-subtle)]">
              <Film className="h-6 w-6 text-[var(--electric-bright)]" />
            </span>
          </div>
          <div className="relative z-10 space-y-2">
            <p className="text-sm font-semibold text-[var(--text-primary)]">No video added yet</p>
            <p className="text-xs text-[var(--text-secondary)] max-w-xs">
              Add a YouTube link, Vimeo URL, or direct video file in your CMS settings.
            </p>
            <Link
              href="/admin/settings"
              className="mt-3 inline-flex items-center gap-2 rounded-xl border border-[var(--surface-border)] bg-[var(--electric-subtle)] px-4 py-2 text-xs font-semibold text-[var(--electric-bright)] transition hover:border-[var(--electric)] hover:bg-[var(--surface-border)]"
            >
              Add video in CMS Settings
            </Link>
          </div>
        </div>
      ) : isEmbed && embedSrc ? (
        /* ── YouTube / Vimeo ── */
        <div
          className={`relative w-full ${fullBleed ? "min-h-[100svh]" : ""}`}
          style={fullBleed ? undefined : { aspectRatio: "16/9" }}
        >
          <iframe
            src={embedSrc}
            title={title ?? "Video"}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className={`absolute inset-0 h-full w-full ${rounded}`}
            loading="lazy"
          />
        </div>
      ) : (
        /* ── Direct video — autoplay loop muted ── */
        <div
          className={`${containerCls}`}
          style={containerStyle}
          onClick={handleClick}
          onMouseEnter={() => setShowControls(true)}
          onMouseLeave={() => setShowControls(false)}
        >
          <video
            ref={videoRef}
            src={videoUrl}
            className={`absolute inset-0 h-full w-full object-cover ${rounded}`}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            onEnded={() => setPaused(false)}
          />

          {/* Pause indicator overlay */}
          {paused && (
            <div className={`absolute inset-0 flex items-center justify-center bg-[rgba(2,8,16,0.5)] ${rounded}`}>
              <div className="flex h-16 w-16 items-center justify-center rounded-full border border-[var(--surface-border)] bg-[var(--electric-subtle)] shadow-[0_0_32px_var(--electric-glow)]">
                <Play className="h-7 w-7 fill-white translate-x-0.5" />
              </div>
            </div>
          )}

          {/* Hover controls */}
          {(showControls || paused) && (
            <div className="absolute bottom-3 right-3 flex items-center gap-2 z-10" onClick={(e) => e.stopPropagation()}>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); handleClick(); }}
                aria-label={paused ? "Play" : "Pause"}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-[rgba(255,255,255,0.15)] bg-[rgba(2,8,16,0.75)] text-white backdrop-blur-sm transition hover:bg-[rgba(52,47,197,0.4)]"
              >
                {paused
                  ? <Play className="h-3.5 w-3.5 fill-white" />
                  : (
                    <span className="flex h-3.5 w-3.5 items-center justify-center gap-0.5">
                      <span className="h-3.5 w-1 rounded-sm bg-white" />
                      <span className="h-3.5 w-1 rounded-sm bg-white" />
                    </span>
                  )
                }
              </button>
              <button type="button" onClick={handleMute} aria-label={muted ? "Unmute" : "Mute"} className="flex h-8 w-8 items-center justify-center rounded-lg border border-[rgba(255,255,255,0.15)] bg-[rgba(2,8,16,0.75)] text-white backdrop-blur-sm transition hover:bg-[rgba(52,47,197,0.4)]">
                {muted ? <VolumeX className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5" />}
              </button>
              <button type="button" onClick={handleFullscreen} aria-label="Fullscreen" className="flex h-8 w-8 items-center justify-center rounded-lg border border-[rgba(255,255,255,0.15)] bg-[rgba(2,8,16,0.75)] text-white backdrop-blur-sm transition hover:bg-[rgba(52,47,197,0.4)]">
                <Maximize2 className="h-3.5 w-3.5" />
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );

  if (fullBleed) {
    return <div className="w-full bg-background">{videoContent}</div>;
  }

  return (
    <section className={`section-space ${bgClass}`}>
      <div className="section-shell">
        {(title || eyebrow) && (
          <Reveal>
            <SectionHeader eyebrow={eyebrow} title={title ?? ""} description={description} />
          </Reveal>
        )}
        <Reveal delay={title ? 0.06 : 0}>
          <div className="relative mt-8 overflow-hidden rounded-2xl border border-[var(--surface-border)] bg-[var(--space-800)] shadow-[0_0_60px_var(--electric-glow)]">
            <div className="pointer-events-none absolute -inset-px rounded-2xl border border-[var(--surface-border-subtle)]" />
            <div className="pointer-events-none absolute -top-24 left-1/2 h-48 w-96 -translate-x-1/2 rounded-full bg-[var(--electric-subtle)] blur-3xl" />
            {videoContent}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

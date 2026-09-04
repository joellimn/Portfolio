type CaseStudyVideoProps = {
  src: string;
  label: string;
  className?: string;
  /** Dashboard windows use 16px; phone screens 32px; cropped UI clips ~9px. */
  radius?: "window" | "phone" | "clip";
  width?: number;
  height?: number;
  /** Crop this many CSS pixels from the left and right edges. */
  cropX?: number;
  /** Crop this many CSS pixels from the top edge. */
  cropTop?: number;
  /** Crop this many CSS pixels from the bottom edge. */
  cropBottom?: number;
};

const RADIUS = {
  window: "rounded-[16px]",
  phone: "rounded-[32px]",
  clip: "rounded-[9px]",
};

export function CaseStudyVideo({
  src,
  label,
  className = "",
  radius = "window",
  width,
  height,
  cropX = 0,
  cropTop = 0,
  cropBottom = 0,
}: CaseStudyVideoProps) {
  const cropStyle =
    cropX || cropTop || cropBottom
      ? {
          ...(cropX
            ? {
                width: `calc(100% + ${cropX * 2}px)`,
                maxWidth: "none",
                marginLeft: `-${cropX}px`,
              }
            : { width: "100%" }),
          ...(cropTop ? { marginTop: `-${cropTop}px` } : {}),
          ...(cropBottom ? { marginBottom: `-${cropBottom}px` } : {}),
        }
      : { width: "100%" };

  return (
    <div
      className={`overflow-hidden ${RADIUS[radius]} shadow-[4px_4px_5px_rgba(0,0,0,0.05)] ${className}`}
    >
      <video
        src={src}
        width={width}
        height={height}
        className={`block h-auto ${RADIUS[radius]}`}
        style={cropStyle}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        aria-label={label}
      />
    </div>
  );
}

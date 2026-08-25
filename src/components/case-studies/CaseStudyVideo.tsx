type CaseStudyVideoProps = {
  src: string;
  label: string;
  className?: string;
  /** Dashboard windows use 16px; phone screens use 32px like the framed stills. */
  radius?: "window" | "phone";
  /** Crop this many CSS pixels from the left and right edges. */
  cropX?: number;
  /** Crop this many CSS pixels from the bottom edge. */
  cropBottom?: number;
};

const RADIUS = {
  window: "rounded-[16px]",
  phone: "rounded-[32px]",
};

export function CaseStudyVideo({
  src,
  label,
  className = "",
  radius = "window",
  cropX = 0,
  cropBottom = 0,
}: CaseStudyVideoProps) {
  const cropStyle =
    cropX || cropBottom
      ? {
          ...(cropX
            ? {
                width: `calc(100% + ${cropX * 2}px)`,
                maxWidth: "none",
                marginLeft: `-${cropX}px`,
              }
            : { width: "100%" }),
          ...(cropBottom ? { marginBottom: `-${cropBottom}px` } : {}),
        }
      : { width: "100%" };

  return (
    <div
      className={`overflow-hidden ${RADIUS[radius]} shadow-[4px_4px_5px_rgba(0,0,0,0.05)] ${className}`}
    >
      <video
        src={src}
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

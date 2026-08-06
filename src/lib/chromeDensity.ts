/** On-device glass chrome (Menu / resting iPod). */
export const DEVICE_STATUS_BAR_CQI = 8.5;
export const DEVICE_STATUS_BAR_FRACTION = DEVICE_STATUS_BAR_CQI / 100;

/**
 * Full-bleed zoomed chrome (Works / About / case study).
 * ~30% smaller than device so wide viewports don't grow a huge top bar.
 */
export const STAGE_STATUS_BAR_CQI = 5.8;
export const STAGE_STATUS_BAR_FRACTION = STAGE_STATUS_BAR_CQI / 100;

/** Cover Flow destination frame subtracts the zoomed status bar. */
export const STATUS_BAR_FRACTION = STAGE_STATUS_BAR_FRACTION;

export type ChromeDensity = "device" | "stage";

export function statusBarHeightCqi(density: ChromeDensity): string {
  return density === "stage"
    ? `${STAGE_STATUS_BAR_CQI}cqi`
    : `${DEVICE_STATUS_BAR_CQI}cqi`;
}

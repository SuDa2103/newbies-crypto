export const BRAND_FONT_URL =
  "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&subset=latin&display=swap";

/**
 * Mimic python's time.sleep()
 * @param ms
 * @returns
 */
export const sleep = (ms: number = 1e3) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

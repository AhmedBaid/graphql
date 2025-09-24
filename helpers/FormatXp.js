export function formatXP(xp) {
  if (!xp) return "0 kb";

  if (xp.toString().length <= 6) {
    return `${(xp / 1000).toFixed(2)} KB`;
  } else {
    return `${(xp / 1000000).toFixed(2)} MB`;
  }
}
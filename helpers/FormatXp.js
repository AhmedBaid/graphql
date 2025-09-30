export function formatXP(xp) {
  let absoluteXp = Math.abs(xp);
  let isnegative = xp < 0;
  let formattedXp;

  if (absoluteXp < 1000000) {
    formattedXp = `${(absoluteXp / 1000).toFixed(1)} KB`;
  } else {
    formattedXp = `${(absoluteXp / 1000000).toFixed(1)} MB`;
  }

  return isnegative ? `-${formattedXp}` : formattedXp;
}

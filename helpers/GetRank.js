
export function getRank(level) {
  if (level >= 0 && level < 10) {
    return "Aspiring developer";
  } else if (level >= 10 && level < 20) {
    return "Beginner developer";
  } else if (level >= 20 && level < 30) {
    return "Apprentice developer";
  } else if (level >= 30 && level < 40) {
    return "Assistant developer";
  } else if (level >= 40 && level < 50) {
    return "Basic developer";
  } else if (level >= 50 && level < 55) {
    return "Junior developer";
  } else if (level >= 55 && level < 60) {
    return "Confirmed developer";
  } else if (level == 60) {
    return "Full-Stack developer";
  } else {
    return "";
  }
}
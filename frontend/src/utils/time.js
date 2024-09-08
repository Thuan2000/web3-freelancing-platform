export const formatTimeAgo = (createdAt) => {
  const now = Date.now();
  const createdTime = Number(createdAt) * 1000; // Convert to milliseconds
  const diff = now - createdTime;

  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  const remainingMinutes = minutes % 60;
  const remainingHours = hours % 24;

  if (days > 0) {
    return `${days}D${remainingHours}H${remainingMinutes}m ago`;
  } else if (hours > 0) {
    return `${remainingHours}H${remainingMinutes}m ago`;
  } else {
    return `${remainingMinutes}m ago`;
  }
};

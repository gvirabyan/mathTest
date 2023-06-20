export const createDatetimeString = (date, timezone) => {
  const userCurrentDate = new Intl.DateTimeFormat("sv-SE", {
    dateStyle: "short",
    timeZone: timezone,
  }).format(new Date(date));

  const userDateStr = new Intl.DateTimeFormat("sv-SE", {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(new Date(date));

  return `${userCurrentDate}T${userDateStr.split(" ")[1]}.000Z`;
};

export const isToday = date => {
  const today = new Date();
  return today.toDateString() === date.toDateString();
};

export const isYesterday = date => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  return yesterday.toDateString() === date.toDateString();
};

export const isTomorrow = date => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  return tomorrow.toDateString() === date.toDateString();
};

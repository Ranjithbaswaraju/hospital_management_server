// Get short day name (Mon, Tue, ...) from a date string (YYYY-MM-DD)
const getDayFromDate = (dateString) => {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const date = new Date(`${dateString}T00:00:00`);
  return days[date.getDay()];
};

// Check if date is today or in the future
const isPastDate = (dateString) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const selected = new Date(`${dateString}T00:00:00`);
  return selected < today;
};

module.exports = { getDayFromDate, isPastDate };

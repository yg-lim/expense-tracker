const DAYS_IN_WEEK = {
  0: "Sun",
  1: "Mon",
  2: "Tue",
  3: "Wed",
  4: "Thu",
  5: "Fri",
  6: "Sat",
};

const getDay = (dateString) => {
  let fullDate = new Date(dateString);
  let day = fullDate.getDay();
  return DAYS_IN_WEEK[day];
};

const getDate = (dateString) => {
  let fullDate = new Date(dateString);
  return fullDate.getDate();
};

module.exports = {
  getDay,
  getDate,
}
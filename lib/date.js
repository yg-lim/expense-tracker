const MONTHS_IN_YEAR = {
  "01": "January",
  "02": "February",
  "03": "March",
  "04": "April",
  "05": "May",
  "06": "June",
  "07": "July",
  "08": "August",
  "09": "September",
  "10": "October",
  "11": "November",
  "12": "December",
};

const monthToString = (month) => {
  return MONTHS_IN_YEAR[month];
};

const checkIsCurrentMonth = (year, month) => {
  let today = new Date();
  let thisYear = today.getFullYear();
  let thisMonth = +today.getMonth() + 1;

  return thisYear === +year && thisMonth === +month;
};

const validYearMonth = (yearString, monthString) => {
  if (!/^20[1-9][0-9]$/.test(yearString) || !/^0[1-9]|1[0-2]$/.test(monthString)) return false;

  let today = new Date();
  let thisYear = +today.getFullYear();
  let thisMonth = +today.getMonth() + 1;

  let thisMonthYearDate = new Date(thisYear, thisMonth).getTime();
  let inputDate = new Date(yearString, monthString).getTime();

  return thisMonthYearDate >= inputDate;
};

module.exports = {
  monthToString,
  checkIsCurrentMonth,
  validYearMonth,
};
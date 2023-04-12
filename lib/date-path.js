function getNextMonthPath(year, month) {
  let newMonth;
  let newYear;

  if (month === "12") {
    newYear = String(+year + 1);
    newMonth = "01";
  } else {
    newYear = year;
    newMonth = String(+month + 1).padStart(2, "0");
  }

  return `/${newYear}/${newMonth}`;
}

function getPrevMonthPath(year, month) {
  let newMonth;
  let newYear;

  if (month === "01") {
    newYear = String(+year - 1);
    newMonth = "12";
  } else {
    newYear = year;
    newMonth = String(+month - 1).padStart(2, "0");
  }

  return `/${newYear}/${newMonth}`;
}

module.exports = {
  getNextMonthPath,
  getPrevMonthPath,
};
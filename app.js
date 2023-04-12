const config = require("./lib/config");
const express = require("express");
const morgan = require("morgan");
const session = require("express-session");
const flash = require("express-flash");
const { body, validationResult } = require("express-validator");
const LokiStore = require("connect-loki");

const app = express();
const PORT = config.PORT;
const HOST = config.HOST;
const PgPersistence = require("./lib/pg-persistence");
const catchError = require("./lib/catch-error");
const { getDay, getDate } = require("./lib/get-date-info");
const { monthToString, checkIsCurrentMonth, validYearMonth } = require("./lib/date");
const { getPrevMonthPath, getNextMonthPath } = require("./lib/date-path");

app.set("view engine", "pug");

app.use(morgan("common"));
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(session({
  cookie: {
    httpOnly: true,
    maxAge: 31 * 24 * 60 * 60 * 1000,
    path: "/",
    secure: false,
  },
  secret: config.SECRET,
  resave: false,
  saveUninitialized: true,
  store: new LokiStore({}),
}));
app.use(flash());
app.use((req, res, next) => {
  res.locals.store = new PgPersistence();
  res.locals.flash = req.session.flash;
  delete req.session.flash;
  next();
});

app.locals.getDay = getDay;
app.locals.getDate = getDate;
app.locals.monthToString = monthToString;
app.locals.checkIsCurrentMonth = checkIsCurrentMonth;
app.locals.getNextMonthPath = getNextMonthPath;
app.locals.getPrevMonthPath = getPrevMonthPath;
app.locals.getTotal = function(expenses) {
  return expenses.reduce((acc, val) => acc + Number(val.amount), 0).toFixed(2);
}

app.get("/", (req, res) => {
  let today = new Date();
  let year = today.getFullYear();
  let month = String(Number(today.getMonth()) + 1);

  res.redirect(`/expenses/${year}/${month.padStart(2, "0")}`);
});

app.get("/expenses/:year/:month",
  catchError(async (req, res) => {
    let year = req.params.year;
    let month = req.params.month;

    if (!validYearMonth(year, month)) throw new Error("Not found.");

    let expenses = await res.locals.store.loadMonthsExpenses(year, month);
    if (!expenses) throw new Error("Not found.");

    res.render("expenses", {
      year,
      month,
      expenses,
    });
  })
);

app.post("/expenses/:year/:month", 
  [
    body("description")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Description of expense is required.")
      .bail()
      .isLength({ max: 25 })
      .withMessage("Maximum characters for description is 25."),
    body("amount")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Amount is required.")
      .bail()
      .isCurrency({ allow_negatives: false })
      .withMessage("Must enter valid dollar amount."),
    body("date")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Date of expense is required.")
      .bail()
      .isDate({ format: "YYYY-MM-DD", strictMode: true })
      .withMessage("Date must be valid YYYY-MM-DD format.")
      .bail()
      .custom(value => {
        let date = new Date(value);
        let year = date.getFullYear();
        let month = +date.getMonth() + 1;

        return validYearMonth(year, String(month).padStart(2, "0"));
      })
      .withMessage("Expense must be for date in this month or earlier.")
  ],
  catchError(async (req, res) => {
    let year = req.params.year;
    let month = req.params.month;
    let store = res.locals.store;

    let description = req.body.description;
    let amount = req.body.amount;
    let date = req.body.date;

    if (!validYearMonth(year, month)) throw new Error("Not found.");

    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      errors.array().forEach(error => req.flash("error", error.msg));

      let expenses = await store.loadMonthsExpenses(year, month);
      if (!expenses) throw new Error("Not found.");

      res.render("expenses", {
        year,
        month,
        expenses,
        description,
        amount,
        date,
        flash: req.flash(),
      });
    } else {
      let created = store.createNewExpense(description, amount, date);
      if (!created) throw new Error("Not found.");

      req.flash("success", "New expense has been added!");

      let inputDate = new Date(date);
      let redirectYear = inputDate.getFullYear();
      let redirectMonth = String(inputDate.getMonth() + 1);
      res.redirect(`/expenses/${redirectYear}/${redirectMonth.padStart(2, "0")}`);
    }
  })
);

app.get("/expenses/edit/:expenseId",
  catchError((req, res) => {

  })
);

app.use((err, req, res, _next) => {
  console.log(err);
  res.status(404).send(err.message);
});

app.listen(PORT, HOST, () => {
  console.log(`listening on ${PORT}`);
});
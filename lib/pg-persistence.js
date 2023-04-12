const dbQuery = require("./db-query");

module.exports = class PgPersistence {
  async loadMonthsExpenses(year, month) {
    const GET_EXPENSES = "SELECT * FROM expenses" +
                         " WHERE date BETWEEN $1 AND $2" + 
                         " ORDER BY date DESC";

    let startOfMonth = new Date(year, +month - 1, 2).toISOString().substring(0, 10);
    let endOfMonth = new Date(year, +month, 1).toISOString().substring(0, 10);

    let result = await dbQuery(GET_EXPENSES, startOfMonth, endOfMonth);
    return result.rows;
  }

  async createNewExpense(description, amount, date) {
    const CREATE_EXPENSE = "INSERT INTO expenses (description, amount, date)" +
                           " VALUES ($1, $2, $3)";

    let result = await dbQuery(CREATE_EXPENSE, description, amount, date);
    return result.rowCount === 1;
  }
}
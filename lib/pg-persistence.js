const dbQuery = require("./db-query");
const bcrypt = require("bcrypt");

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

  async loadExpense(expenseId) {
    const FIND_EXPENSE = "SELECT * FROM expenses" + 
                         " WHERE id = $1";

    let result = await dbQuery(FIND_EXPENSE, expenseId);
    return result.rows[0];
  }

  async updateExpense(description, amount, date, expenseId) {
    const UPDATE_EXPENSE = "UPDATE expenses" + 
                           " SET description = $1, amount = $2, date = $3" +
                           " WHERE id = $4";
                           
    let result = await dbQuery(UPDATE_EXPENSE, description, amount, date, expenseId);
    return result.rowCount === 1;
  }

  async deleteExpense(expenseId) {
    const DELETE_EXPENSE = "DELETE FROM expenses WHERE id = $1";
    let result = await dbQuery(DELETE_EXPENSE, expenseId);

    return result.rowCount === 1;
  }

  async authenticateUser(username, password) {
    const AUTHENTICATE_USER = "SELECT password FROM users WHERE username = $1";

    let result = await dbQuery(AUTHENTICATE_USER, username);
    return await bcrypt.compare(password, result.rows[0].password);
  }
}
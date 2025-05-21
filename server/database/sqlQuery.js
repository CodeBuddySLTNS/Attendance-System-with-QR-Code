const { default: status } = require("http-status");
const { pool } = require("../database/sqlConnection");
const { CustomError } = require("../lib/utils");

const sqlQuery = async (query, params) => {
  let dbconn;
  try {
    dbconn = await pool.getConnection();
    const [rows] = await dbconn.query(query, params || []);
    return rows;
  } catch (error) {
    if (error) {
      switch (error.code) {
        case "ER_TABLE_EXISTS_ERROR":
          throw new CustomError(error.message, status.BAD_REQUEST, error);

        case "ER_DUP_ENTRY":
          throw new CustomError("Already exists!", status.CONFLICT, error);

        case "ECONNREFUSED":
          throw new CustomError(
            "Database connection error.",
            status.INTERNAL_SERVER_ERROR
          );

        default:
          throw new CustomError(error.message, status.CONFLICT, error);
      }
    }
  } finally {
    if (dbconn) dbconn.release();
  }
};

module.exports = sqlQuery;

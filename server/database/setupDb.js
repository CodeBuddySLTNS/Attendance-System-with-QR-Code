import { sqlQuery } from "./sqlQuery";
import { insertDepartments, sqlTableQueries } from "./sqlTableQueries";

export const setupDb = async () => {
  console.log("Setting up database...");
  await sqlQuery(sqlTableQueries);
  console.log("Database setup successful!");
  console.log("Inserting departments...");
  await sqlQuery(insertDepartments);
  console.log("Departments inserted successfully!");
};

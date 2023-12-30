// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

type Data = {
  // name?: string; // Add the possibility of a single name
  usernames?: string[]; // Add the possibility of an array of names
  firstnames?: string[];
  permissions?: Array<{ add_users: string; delete_messages: string; delete_users: string }>; // "True" (1), "False" (0)
  // allusers?: string[]
};

type ErrorResponse = {
  error: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data | ErrorResponse>
) {
  // Connect to the SQLite database
  const db = await open({
    filename: './database.db',
    driver: sqlite3.Database,
  });

  try {
    // Query 1: Report the usernames of all users aged 25 and above
    const ageResults = await db.all('SELECT username FROM Users WHERE id IN (SELECT id FROM Names WHERE age >= 25)');
    // Extract usernames from the result array
    const unames = ageResults.map((result) => result.username);

    // Query 2: Report only the first name of the user with the username "ZL"
    const firstNameResults = await db.all('SELECT first_name FROM Names WHERE id IN (SELECT id FROM Users WHERE username = "ZL")');
    const fnames = firstNameResults.map((result) => result.first_name);

    // Query 3: Report the permissions of the user with the first name "Edward"
    const permissionResults = await db.all(`
      SELECT
        CASE WHEN add_users = 1 THEN 'True' ELSE 'False' END AS add_users,
        CASE WHEN delete_messages = 1 THEN 'True' ELSE 'False' END AS delete_messages,
        CASE WHEN delete_users = 1 THEN 'True' ELSE 'False' END AS delete_users
      FROM
        permissions
      WHERE
        role = (SELECT role FROM Users WHERE id = (SELECT id FROM Names WHERE first_name = "Edward"))
    `);

    // new API endpoint to get usernames of all users
    // const allResults = await db.all('SELECT * FROM Users');
    // const allResultsUsers = allResults.map((result) => result.username);


    // Combine the results into the response
    const responseData: Data = {
      usernames: unames,
      firstnames: fnames,
      permissions: permissionResults,
      // allusers: allResultsUsers,
    };

    // Respond with the data
    res.status(200).json(responseData);
  } catch (error) {
    console.error('Error executing SQL query:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    // Close the database connection
    await db.close();
  }
}

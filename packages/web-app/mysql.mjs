import "dotenv";
import mysql from "mysql";

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
});

await new Promise((resolve, reject) => {
    connection.connect((err) => {
        if (err) {
            return reject(err);
        }

        resolve();
    });
});

export async function query(sql, params) {
    return new Promise((resolve, reject) => {
        connection.query(sql, params, (err, result) => {
            if (err) {
                return reject(err);
            }

            resolve(result);
        });
    });
}

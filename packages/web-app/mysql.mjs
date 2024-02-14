import "dotenv";
import mysql from "mysql";

const connectionPromise = new Promise((resolve, reject) => {
    const connection = mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
    });

    connection.connect((err) => {
        if (err) {
            return reject(err);
        }

        resolve(connection);
    });
});

export async function query(sql, params) {
    const connection = await connectionPromise;

    return new Promise((resolve, reject) => {
        connection.query(sql, params, (err, result) => {
            if (err) {
                return reject(err);
            }

            resolve(result);
        });
    });
}

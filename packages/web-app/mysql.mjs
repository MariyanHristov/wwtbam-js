import mysql from "mysql";

import { DB_DATABASE, DB_HOST, DB_PASSWORD, DB_USER } from "../env/index.mjs";

const connectionPromise = new Promise((resolve, reject) => {
    const connection = mysql.createConnection({
        host: DB_HOST,
        user: DB_USER,
        password: DB_PASSWORD,
        database: DB_DATABASE,
    });

    connection.connect((err) => {
        if (err) {
            reject(err);
        } else {
            resolve(connection);
        }
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

import "dotenv/config";

export const APP_PORT = Number(process.env["APP_PORT"]);

export const AUTH_SECRET = process.env["AUTH_SECRET"];

export const DB_HOST = process.env["DB_HOST"];
export const DB_DATABASE = process.env["DB_DATABASE"];
export const DB_USER = process.env["DB_USER"];
export const DB_PASSWORD = process.env["DB_PASSWORD"];

export const REDIS_URL = process.env["REDIS_URL"];
export const REDIS_PATH = process.env["REDIS_PATH"];
export const REDIS_CHANNEL = process.env["REDIS_CHANNEL"];

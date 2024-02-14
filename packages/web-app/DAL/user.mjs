import { query } from "../mysql.mjs";

const DAL = {
    getUser: function (user) {
        return query("SELECT * FROM users WHERE id = ?", [user.id]);
    },

    updateUser: function (user) {
        return query("UPDATE users SET name=?, family_name=?, city=?, email=?, country=? WHERE id=?", [
            user.name,
            user.family_name,
            user.city,
            user.email,
            user.country,
            user.id,
        ]);
    },

    insertUser: function (user) {
        return query("INSERT INTO users (name, family_name, city, email, country) VALUES (?, ?, ?, ?, ?)", [
            user.name,
            user.family_name,
            user.city,
            user.email,
            user.country,
        ]);
    },
};

export default DAL;

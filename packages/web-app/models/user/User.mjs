import DAL from "../../DAL/user.mjs";

class User {
    constructor(id, name, family_name, city, email, country, password) {
        this.id = id;
        this.name = name;
        this.family_name = family_name;
        this.city = city;
        this.email = email;
        this.country = country;
        this.password = password;
    }

    setUser(data) {
        this.id = data.id;
        this.name = data.name;
        this.family_name = data.family_name;
        this.city = data.city;
        this.email = data.email;
        this.country = data.country;
        this.password = data.password;
    }

    static async getById(id, callback) {
        try {
            const result = await DAL.getUser({ id });
            if (result.length === 0) {
                return null;
            }

            const { name, family_name, city, email, country } = result[0];
            return new User(id, name, family_name, city, email, country);
        } catch (error) {
            console.error("Error retrieving user:", error.message);
            throw error;
        }
    }

    async update(callback) {
        try {
            await DAL.updateUser(this);
            return callback(null, this);
        } catch (error) {
            console.error("Error updating user:", error.message);
            return callback(error, null);
        }
    }

    static async create(user, callback) {
        try {
            await DAL.insertUser(user);
            return callback(null, user);
        } catch (error) {
            console.error("Error inserting user:", error.message);
            return callback(error, null);
        }
    }
}

export default User;

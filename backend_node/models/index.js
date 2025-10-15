import sequelize from "../db/index.js";
import User from "./User.js";
import UserData from "./UserData.js";

User.hasMany(UserData, {foreignKey: "userId"});      // Name of the foreign key that will be created automatically in "UserData" table
UserData.belongsTo(User, {foreignKey: "userId"});    // Name of the foreign key that will be created automatically in "UserData" table

export {
    sequelize,
    User,
    UserData 
}
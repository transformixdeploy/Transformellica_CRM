import { DataTypes } from "sequelize";
import sequelize from "../db/index.js";
import {rolesEnum, roles} from "../utils/userRoles.js";

const User = sequelize.define('User',{
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    fullName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phoneNumber: {
        type: DataTypes.STRING,
        allowNull: false
    },
    companyName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    jobRole: {
        type: DataTypes.STRING,
        allowNull: false
    },
    websiteURL: {
        type: DataTypes.STRING,
        allowNull: true
    },
    role: {
        type: DataTypes.ENUM,
        values: rolesEnum,
        defaultValue: roles.CLIENT
    }
  },
  {
    // Other model options go here
  },
);

export default User;
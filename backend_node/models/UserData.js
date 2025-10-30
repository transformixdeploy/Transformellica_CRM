import { DataTypes } from "sequelize";
import sequelize from "../db/index.js";
import {categoriesEnum} from "../utils/userDataCategory.js";

const UserData = sequelize.define('userData',{
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    title: {
      type: DataTypes.STRING,
      defaultValue: "title",
      allowNull: false
    },
    category: {
      type: DataTypes.ENUM,
      values: categoriesEnum,
      allowNull: false
    },
    data: {
      type: DataTypes.JSONB,
      allowNull: false
    }
  },
  {
    paranoid: true,
    timestamps: true,
  },
);

export default UserData;
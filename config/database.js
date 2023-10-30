import Sequelize from "sequelize";
import dotenv from 'dotenv'
dotenv.config()

// Create the first database connection
const RC = new Sequelize({
  dialect: 'mysql', // or 'postgres', 'sqlite', 'mssql', etc.
  host: process.env.DB_HOST_RC,
  username: process.env.DB_USER_RC,
  password: process.env.DB_PASSWORD_RC,
  database: process.env.DB_DATABASE_RC,
});

// Create the second database connection
const Vehicle = new Sequelize({
  dialect: 'mysql', // or 'postgres', 'sqlite', 'mssql', etc.
  host: process.env.DB_HOST_VEHICLE,
  username: process.env.DB_USER_VEHICLE,
  password: process.env.DB_PASSWORD_VEHICLE,
  database: process.env.DB_DATABASE_VEHICLE,
});

// const sequilize 


export default { RC, Vehicle }

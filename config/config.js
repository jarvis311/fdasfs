import dotenv from 'dotenv'
dotenv.config()
const config ={
  "development": {
    "username": process.env.DB_USER_VEHICLE,
    "password": process.env.DB_PASSWORD_VEHICLE,
    "database":  process.env.DB_DATABASE_VEHICLE,
    "host":  process.env.DB_HOST_VEHICLE,
    "dialect": "mysql",
    "define": {
      "timestamps": false
  }
  },
  "test": {
    "username": "root",
    "password": null,
    "database": "database_test",
    "host": "127.0.0.1",
    "dialect": "mysql"
  },
  "production": {
    "username": "root",
    "password": null,
    "database": "database_production",
    "host": "127.0.0.1",
    "dialect": "mysql"
  }
}
export default config

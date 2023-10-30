import fs, { readdirSync } from 'fs'
import path from 'path'
import Sequelize from 'sequelize'
import process from 'process'
import Config from '../config/config.js'
import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = Config[env];
const db = {};
const __dirname = dirname(__filename);

let sequelize;

if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}



const files = readdirSync(__dirname).filter(
  (file) =>
    file.indexOf(".") !== 0 &&
    file !== path.basename(__filename) &&
    file.slice(-3) === ".js"
);
// for await (const file of files) {
//       const model = await import(`./${file}`);
//       if (model.default) {
//         const namedModel = await model.default(sequelize, Sequelize.DataTypes);
//         db[namedModel.name] = namedModel;
//       }
//     }

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

// db.BodyTypes.hasMany(db.VehicleInformation,{as: 'most_search_vehicles', foreignKey: 'bodytype_id'})



// db.Compare.belongsTo(db.VehicleInformation,{as: 'vehicle1_name', foreignKey: 'vehicle_id_1'})
// db.Compare.belongsTo(db.VehicleInformation,{as: 'vehicle2_name', foreignKey: 'vehicle_id_2'})



// db.Categories.hasMany(db.VehicleInformation,{as: 'upcomingVehicles', foreignKey: 'category_id'})
// db.Categories.hasMany(db.VehicleInformation,{as: 'letestVehicles', foreignKey: 'category_id'})
// db.Categories.hasMany(db.VehicleInformation,{as: 'recommendedVehicles', foreignKey: 'category_id'})
  //  db.Serve
  


export default db
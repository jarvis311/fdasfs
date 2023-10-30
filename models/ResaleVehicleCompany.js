import {
    Model,
    DataTypes
  } from "sequelize";
  import db from '../config/database.js'
  import ResaleVehicleModel from './ResaleVehicleModel.js'
  class ResaleVehicleCompany extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  ResaleVehicleCompany.init({
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    resale_vehicle_category_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
  }, {
    sequelize: db.Vehicle,
    modelName: 'ResaleVehicleCompany',
    tableName: 'resale_vehicle_company',
    timestamps: false
  });

  ResaleVehicleModel.addScope('selection_condition', {
    attributes: [
        'id',
        ['id' ,'ModelID'],
        ['name','ModelName'],
        'resale_vehicle_company_id'
    ],
  });
  ResaleVehicleCompany.hasMany(ResaleVehicleModel.scope('selection_condition'), {
    as: 'ModelData',
    foreignKey: 'resale_vehicle_company_id'
  })
  ResaleVehicleModel.belongsTo(ResaleVehicleCompany, {
    as: 'get_company',
    foreignKey: 'resale_vehicle_company_id'
  })
  export default ResaleVehicleCompany;
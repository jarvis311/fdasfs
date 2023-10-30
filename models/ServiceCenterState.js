import {
    Model,
    DataTypes
} from "sequelize";
import db from '../config/database.js'
import ServiceCenterCity from '../models/DrivingSchoolCity.js'
class ServiceCenterState extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
        // ServiceCenterState.hasOne(models.ServiceCenterBrand, {
        //     foreignKey: "brand_id",
        // });
        // ServiceCenterState.hasOne(models.ServiceCenterCity, {
        //     foreignKey: "city_id",
        // });
    }
}
ServiceCenterState.init({
    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
    },
    index: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    status: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    deleted_by: {
        type: DataTypes.INTEGER,
    },
    created_at: {
        type: DataTypes.DATE,
    },
    updated_at: {
        type: DataTypes.DATE,
    },
    deleted_at: {
        type: DataTypes.INTEGER,
    },
}, {
    sequelize: db.Vehicle,
    modelName: 'ServiceCenterState',
    tableName: 'service_center_state',
    timestamps: false
});

  

export default ServiceCenterState;
import {
    Model,
    DataTypes
} from "sequelize";
import db from '../config/database.js'
class ServiceCenterData extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
        ServiceCenterData.hasOne(models.ServiceCenterBrand, {
            foreignKey: "brand_id",
        });
        ServiceCenterData.hasOne(models.ServiceCenterCity, {
            foreignKey: "city_id",
        });
    }
}
ServiceCenterData.init({
    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
    },
    name:{
        type: DataTypes.STRING,
        allowNull: false
    },
    index: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    city_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    brand_id: {
        type: DataTypes.STRING,
        allowNull: false
    },
    address: {
        type: DataTypes.STRING,
        allowNull: false
    },
    zipcode: {
        type: DataTypes.INTEGER,
    },
    website: {
        type: DataTypes.STRING,
    },
    number: {
        type: DataTypes.STRING,
    },
    email: {
        type: DataTypes.STRING,
    },
    latitude: {
        type: DataTypes.STRING,
    },
    longitude: {
        type: DataTypes.STRING,
    },
    featured: {
        type: DataTypes.TINYINT,
    },
    type: {
        type: DataTypes.STRING,
        allowNull: false
    },
    paymentMode: {
        type: DataTypes.STRING,
    },
    sun: {
        type: DataTypes.STRING,
        allowNull: false
    },
    mon: {
        type: DataTypes.STRING,
        allowNull: false
    },
    tue: {
        type: DataTypes.STRING,
        allowNull: false
    },
    wed: {
        type: DataTypes.STRING,
        allowNull: false
    },
    thu:{
        type: DataTypes.STRING,
        allowNull: false 
    },
    fri: {
        type: DataTypes.STRING,
        allowNull: false
    },
    sat: {
        type: DataTypes.STRING,
        allowNull: false
    },
    status: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    added_by: {
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
    modelName: 'ServiceCenterData',
    tableName: 'service_center_data',
    timestamps: false
});
export default ServiceCenterData;
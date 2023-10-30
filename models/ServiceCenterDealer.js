import {
    Model,
    DataTypes
  } from "sequelize";
  import db from '../config/database.js'
    class ServiceCenterDealer extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            ServiceCenterDealer.hasOne(models.ServiceCenterBrand, {
                foreignKey: "brand_id",
            });
            ServiceCenterDealer.hasOne(models.ServiceCenterCity, {
                foreignKey: "city_id",
            });
        }
    }
    ServiceCenterDealer.init({
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true,
        },
        index: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        brand_id: {
            type: DataTypes.STRING,
            allowNull: false
        },
        city_id: {
            type: DataTypes.STRING,
            allowNull: false
        },
        name:{
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
        featured :{
            type: DataTypes.TINYINT,
        },
        type:{
            type: DataTypes.STRING,
            allowNull: false
        },
        paymentMode:{
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
        status:{
            type: DataTypes.INTEGER,
            allowNull: false
        },
        added_by: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        deleted_by: {
            type: DataTypes.DATEONLY,
            defaultValue: DataTypes.NOW,
        },
        created_at: {
            type: DataTypes.DATEONLY,
            defaultValue: DataTypes.NOW,
        },
        updated_at: {
            type: DataTypes.DATEONLY,
            defaultValue: DataTypes.NOW,
        },
        deleted_at: {
            type: DataTypes.DATEONLY,
            defaultValue: DataTypes.NOW,
        },
    }, {
        sequelize: db.Vehicle,
        modelName: 'ServiceCenterDealer',
        tableName: 'service_center_dealer',
        timestamps: false
    });
    export default ServiceCenterDealer;

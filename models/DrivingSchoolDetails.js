import {
    Model,
    DataTypes
} from "sequelize";
import db from '../config/database.js'
import moment from "moment"

class DrivingSchoolDetails extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
        DrivingSchoolDetails.belongsTo(models.DrivingSchoolCity, {
            foreignKey: "cityId",
        });
        DrivingSchoolDetails.belongsTo(models.DrivingSchoolArea, {
            foreignKey: "areaId",
        });
    }
}
DrivingSchoolDetails.init({
    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
    },
    cityId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    areaId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    zipCodeId: {
        type: DataTypes.INTEGER,
    },
    zip_code: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    type: {
        type: DataTypes.STRING,
    },
    address: {
        type: DataTypes.STRING,
        allowNull: false
    },
    latitude: {
        type: DataTypes.STRING,
    },
    longitude: {
        type: DataTypes.STRING,
    },
    contactNumber1: {
        type: DataTypes.STRING,
    },
    contactNumber2: {
        type: DataTypes.STRING,
    },
    openTime: {
        type: DataTypes.STRING,
    },
    closeTime: {
        type: DataTypes.STRING,
    },
    closeDays: {
        type: DataTypes.STRING,
    },
    contactName: {
        type: DataTypes.STRING,
    },
    website: {
        type: DataTypes.STRING,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    paymentMode: {
        type: DataTypes.STRING,
    },
    photo: {
        type: DataTypes.STRING,
    },
    coverPhoto: {
        type: DataTypes.STRING,
    },
    establishedYear: {
        type: DataTypes.STRING,
    },
    services: {
        type: DataTypes.TEXT,
    },
    isFeatured: {
        type: DataTypes.INTEGER,
    },
    rowNumber: {
        type: DataTypes.INTEGER,
    },
    schoolValue: {
        type: DataTypes.INTEGER,
    },
    status: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    open_close: {
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
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        get() {
            return this.getDataValue('created_at') ? moment(this.getDataValue('created_at')).format('YYYY-MM-DD HH:mm:ss') : null ;
          }
    },
    updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        get() {
            return this.getDataValue('updated_at') ? moment(this.getDataValue('updated_at')).format('YYYY-MM-DD HH:mm:ss') : null ;
          }
    },
    deleted_at: {
        type: DataTypes.DATE,
    },
    added_by: {
        type: DataTypes.TINYINT,
    },
    deleted_by: {
        type: DataTypes.INTEGER,
    },
}, {
    sequelize: db.Vehicle,
    modelName: 'DrivingSchoolDetails',
    tableName: 'ds_details',
    timestamps: false
});
export default DrivingSchoolDetails;
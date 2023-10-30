import {
    Model,
    DataTypes
} from "sequelize";
import db from '../config/database.js'
import moment from "moment"
class VehicleInformationImages extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {

    }
}
VehicleInformationImages.init({
    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
    },
    vehicle_information_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    vehicle_information_image: {
        type: DataTypes.STRING,
        allowNull: false
    },
    created_at: {
        type: DataTypes.DATE,
        get() {
            return moment(this.getDataValue('created_at')).format('YYYY-MM-DD HH:mm:ss');
        }   
    },
    updated_at: {
        type: DataTypes.DATE,
        get() {
            return moment(this.getDataValue('updated_at')).format('YYYY-MM-DD HH:mm:ss');
        }
    },
}, {
    sequelize: db.Vehicle,
    modelName: 'VehicleInformationImages',
    tableName: 'vehicle_information_images',
    timestamps: false
});
export default VehicleInformationImages;

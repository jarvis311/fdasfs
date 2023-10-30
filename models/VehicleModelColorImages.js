import {
    Model,
    DataTypes
} from "sequelize";
import db from '../config/database.js'
import moment from "moment"

class VehicleModelColorImages extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
        // define association here
    }
}
VehicleModelColorImages.init({
    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
    },
    vehicle_model_color_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    vehicle_model_color_image: {
        type: DataTypes.STRING,
        allowNull: false
    },
    image_position: {
        type: DataTypes.INTEGER,
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
    deleted_at: {
        type: DataTypes.DATE,
    },
}, {
    sequelize: db.Vehicle,
    modelName: 'VehicleModelColorImages',
    tableName: 'vehicle_model_color_images',
    timestamps: false
});
export default VehicleModelColorImages;
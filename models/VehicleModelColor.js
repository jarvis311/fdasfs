import {
    Model,
    DataTypes
} from "sequelize";
import db from '../config/database.js'
import VehicleModelColorImages from './VehicleModelColorImages.js'
import moment from "moment"

class VehicleModelColor extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
        // define association here

    }
}
VehicleModelColor.init({
    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
    },
    vehicle_information_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    color_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    color_code: {
        type: DataTypes.STRING,
        allowNull: false
    },
    image: {
        type: DataTypes.STRING,
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
    deleted_by: {
        type: DataTypes.INTEGER
    }
}, {
    sequelize: db.Vehicle,
    modelName: 'VehicleModelColor',
    tableName: 'vehicle_model_color',
    timestamps: false
});
// VehicleModelColorImages.addScope('condition', {
//     order:[['image_position','ASC']]
//   });

// VehicleModelColor.hasMany(VehicleModelColorImages.scope('condition'), {
//     as: 'vehicle_model_color_images',
//     foreignKey: 'vehicle_model_color_id'
// })
VehicleModelColor.hasMany(VehicleModelColorImages, {
    as: 'vehicle_model_color_images',
    foreignKey: 'vehicle_model_color_id'
})
export default VehicleModelColor;
import {
    Model,
    DataTypes
} from "sequelize";
import db from '../config/database.js'

class VehiclePriceVariant extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
        // define association here
    }
}
VehiclePriceVariant.init({
    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
    },
    vehicle_information_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    link: {
        type: DataTypes.STRING,
    },
    engine: {
        type: DataTypes.STRING,
        allowNull: false
    },
    price_range: {
        type: DataTypes.STRING,
        allowNull: false
    },
    price: {
        type: DataTypes.STRING,
    },
    review_count: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    rating: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    status: {
        type: DataTypes.STRING,
    },
    fuel_type: {
        type: DataTypes.STRING,
    },
    ex_show_room_rice: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    mileage: {
        type: DataTypes.DOUBLE,
        allowNull: false
    },
    rto_price: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    insurance_price: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    other_price: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    on_road_price: {
        type: DataTypes.DOUBLE,
        allowNull: false
    },
    latest_update: {
        type: DataTypes.TEXT
    },
    is_scrapping: {
        type: DataTypes.TINYINT,
        allowNull: false
    },
    launched_at: {
        type: DataTypes.STRING,
    },
    image: {
        type: DataTypes.STRING,
    },
    created_at: {
        type: DataTypes.DATE,
    },
    updated_at: {
        type: DataTypes.DATE,
    },
    deleted_at: {
        type: DataTypes.DATE,
    },
    deleted_by: {
        type: DataTypes.INTEGER,
    },
}, {
    sequelize: db.Vehicle,
    modelName: 'VehiclePriceVariant',
    tableName: 'vehicle_price_variant',
    timestamps: false
});
export default VehiclePriceVariant;
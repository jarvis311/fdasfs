import {
    Model,
    DataTypes
} from "sequelize";
import db from '../config/database.js'
class Km extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
        // define association here
    }
}
Km.init({
    km_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    min: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    max: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    bike: {
        type: DataTypes.STRING,
    },
    scooter	: {
        type: DataTypes.STRING,
    },
    car: {
        type: DataTypes.STRING,
    },
    plane: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    bicycle: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    taxi: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    bus: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    tractor: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    electric_car: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    truck: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
}, {
    sequelize: db.Vehicle,
    modelName: 'Km',
    tableName: 'km',
    timestamps: false
});
export default Km;
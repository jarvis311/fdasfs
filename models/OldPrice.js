import {
    Model,
    DataTypes
} from "sequelize";
import db from '../config/database.js'
class OldPrice extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
        // define association here
    }
}
OldPrice.init({
    oldprice_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    category: {
        type: DataTypes.STRING,
        allowNull: false
    },
    excellentmin: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    excellentmax: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    varygoodmin: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    varygoodmax: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    goodmin: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    goodmax: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    fairmin: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    fairmax: {
        type: DataTypes.FLOAT,
        allowNull: false
    }
}, {
    sequelize: db.Vehicle,
    modelName: 'OldPrice',
    tableName: 'oldprice',
    timestamps: false
});
export default OldPrice;
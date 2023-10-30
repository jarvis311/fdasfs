import {
    Model,
    DataTypes
} from "sequelize";
import db from '../config/database.js'
class KeySpecification extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
        // define association here
    }
}
KeySpecification.init({
    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    icon: {
        type: DataTypes.STRING,
        allowNull: false
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
        type: DataTypes.INTEGER
    }
}, {
    sequelize: db.Vehicle,
    modelName: 'KeySpecification',
    tableName: 'keyspecification',
    timestamps: false
});
export default KeySpecification;
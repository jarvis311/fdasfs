
import {
    Model,
    DataTypes
} from "sequelize";
import db from '../config/database.js'
class FuelState extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
  
}
FuelState.init({
    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
    },
    state:{
        type: DataTypes.STRING,
        defaultValue: null
    },
    created_at: {
        type: DataTypes.DATE,
       defaultValue: DataTypes.NOW,
    },
    updated_at: {
        type: DataTypes.DATE,
       defaultValue: DataTypes.NOW,
    },
    deleted_at: {
        type: DataTypes.STRING,
        defaultValue: null
    }
}, {
    sequelize: db.Vehicle,
    modelName: 'FuelState',
    tableName: 'fuel_states',
    timestamps: false
});
 
export default FuelState;
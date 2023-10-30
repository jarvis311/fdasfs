import Challan from './Challan.js'

import {
    Model,
    DataTypes
} from "sequelize";
import db from '../config/database.js'

class ChallanOffence extends Model {

    static associate(models) {

    }
}

ChallanOffence.init({
    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
    },
    challan_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    offence_name: {
        type: DataTypes.STRING,
        allowNull: false,
        default: "NA"
    },
    mva: {
        type: DataTypes.STRING,
        allowNull: false,
        default: "NA"
    },
    penalty: {
        type: DataTypes.INTEGER,
        allowNull: false,
        default: 0
    },
    created_at: {
        type: DataTypes.DATE,
    },
    updated_at: {
        type: DataTypes.DATE,
    },

}, {
    sequelize: db.Vehicle,
    modelName: 'ChallanOffence',
    tableName: 'challan_offence',
    timestamps: false
});


export default ChallanOffence;



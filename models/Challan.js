import {
    Model,
    DataTypes
} from "sequelize";
import db from '../config/database.js'
import ChallanOffence from "./ChallanOffence.js";

class Challan extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
        // Challan.hasMany(models.ChallanOffence, {
        //     // foreignKey: 'challan_id',
        //     // as: 'challan_id',
        // });
    }
}

Challan.init({
    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
    },
    reg_no: {
        type: DataTypes.STRING,
        allowNull: false
    },
    violator_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    dl_rc_no: {
        type: DataTypes.STRING,
        allowNull: false
    },
    challan_no: {
        type: DataTypes.STRING,
        allowNull: false
    },
    challan_date: {
        type: DataTypes.STRING,
        allowNull: false
    },
    challan_amount: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    challan_status: {
        type: DataTypes.STRING,
        allowNull: false
    },
    challan_payment_date: {
        type: DataTypes.STRING,
        allowNull: false
    },
    transaction_id: {
        type: DataTypes.STRING,
        allowNull: false
    },
    payment_source: {
        type: DataTypes.STRING,
        allowNull: false
    },
    challan_url: {
        type: DataTypes.STRING,
        allowNull: false
    },
    receipt_url: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    payment_url: {
        type: DataTypes.STRING,
        allowNull: false
    },
    state: {
        type: DataTypes.STRING,
        allowNull: false
    },
    date: {
        type: DataTypes.STRING,
    },
    created_at: {
        type: DataTypes.DATE,
    },
    updated_at: {
        type: DataTypes.DATE,
    },
}, {
    sequelize: db.Vehicle,
    modelName: 'Challan',
    tableName: 'challan_details',
    timestamps: false
});


Challan.hasMany(ChallanOffence, {
    foreignKey: "challan_id",
    as: 'ChallanOffence'
});

ChallanOffence.belongsTo(Challan, {
    foreignKey: "challan_id",
    as: 'Challan_Offence',
});

export default Challan;




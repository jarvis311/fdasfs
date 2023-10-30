import {
    Model,
    DataTypes
} from "sequelize";
import db from '../config/database.js'
import VariantKeySpecification from "./VariantKeySpecification.js";
import moment from "moment"

class VariantSpecification extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
        // define association here
    }
}
VariantSpecification.init({
    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    created_at: {
        type: DataTypes.DATE,
        get() {
            return this.getDataValue('created_at') ? moment(this.getDataValue('created_at')).format('YYYY-MM-DD HH:mm:ss') : null;
        }
    },
    updated_at: {
        type: DataTypes.DATE,
        get() {
            return this.getDataValue('created_at') ?  moment(this.getDataValue('updated_at')).format('YYYY-MM-DD HH:mm:ss') : null;
        }
    },
}, {
    sequelize: db.Vehicle,
    modelName: 'VariantSpecification',
    tableName: 'variant_specifications',
    timestamps: false
});

VariantSpecification.hasMany(VariantKeySpecification, {
    as: 'vehicles_specification',
    foreignKey: 'specification_id'
})
export default VariantSpecification;
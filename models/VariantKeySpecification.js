import {
    Model,
    DataTypes
} from "sequelize";
import db from '../config/database.js'
import KeySpecification from './KeySpecification.js'
import moment from "moment"

class VariantKeySpecification extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
        // define association here
    }
}
VariantKeySpecification.init({
    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
    },
    vehicle_information_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    variant_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    specification_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    value: {
        type: DataTypes.TEXT,
    },
    is_feature: {
        type: DataTypes.TINYINT,
        allowNull: false
    },
    variant_key_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    is_specification: {
        type: DataTypes.TINYINT,
        allowNull: false
    },
    is_update: {
        type: DataTypes.TINYINT,
        allowNull: false
    },
    show_key_feature: {
        type: DataTypes.TINYINT,
        allowNull: false
    },
    show_overview: {
        type: DataTypes.TINYINT,
        allowNull: false
    },
    is_scraping: {
        type: DataTypes.TINYINT,
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
}, {
    sequelize: db.Vehicle,
    modelName: 'VariantKeySpecification',
    tableName: 'variant_key_specs',
    timestamps: false
});


VariantKeySpecification.hasOne(KeySpecification, {
    as: 'specification_icon',
    sourceKey:'variant_key_id',
    foreignKey:'id'
})
export default VariantKeySpecification;
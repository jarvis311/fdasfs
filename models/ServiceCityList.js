import {
    Model,
    DataTypes
} from "sequelize";
import db from '../config/database.js'

class ServiceCityList extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
        // define association here
    }
}
ServiceCityList.init({
    affiliation_services_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    service_provider_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    city_id: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    deleted_by: {
        type: DataTypes.INTEGER,
    },
    created_at: {
        type: DataTypes.DATE,
    },
    updated_at: {
        type: DataTypes.DATE,
    },
    deleted_at: {
        type: DataTypes.INTEGER,
    },
}, {
    sequelize: db.Vehicle,
    modelName: 'ServiceCityList',
    tableName: 'service_city_list',
    timestamps: false
});
export default ServiceCityList;
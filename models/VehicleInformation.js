import {
    Model,
    DataTypes
} from "sequelize";
import db from '../config/database.js'
import VehicleInformationImages from './VehicleInformationImages.js'
import VehicleModelColor from './VehicleModelColor.js'
import PriceVariant from './PriceVariant.js'
import moment from "moment"



class VehicleInformation extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
        
    }
}
VehicleInformation.init({
    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
    },
    brand_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    category_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    bodytype_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    bind_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    model_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    fuel_type: {
        type: DataTypes.STRING,
        allowNull: false
    },
    avg_rating: {
        type: DataTypes.DOUBLE,
        allowNull: false
    },
    review_count: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    variant_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    min_price: {
        type: DataTypes.DOUBLE,
        allowNull: false
    },
    max_price: {
        type: DataTypes.DOUBLE,
        allowNull: false
    },
    price_range: {
        type: DataTypes.STRING,
        allowNull: false
    },
    search_count: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    popular_count: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    image: {
        type: DataTypes.STRING,
        allowNull: false
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false
    },
    launched_at: {
        type: DataTypes.STRING,
    },
    Launch_date: {
        type: DataTypes.STRING,
    },
    model_popularity: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    mileage: {
        type: DataTypes.STRING,
        allowNull: false
    },
    engine: {
        type: DataTypes.STRING,
        allowNull: false
    },
    style_type: {
        type: DataTypes.STRING,
        allowNull: false
    },
    max_power: {
        type: DataTypes.STRING,
        allowNull: false
    },
    showroom_price: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    rto_price: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    insurance_price: {
        type: DataTypes.DOUBLE,
        allowNull: false
    },
    other_price: {
        type: DataTypes.DOUBLE,
        allowNull: false
    },
    is_content_writer: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    is_designer: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    on_road_price: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    is_popular_search: {
        type: DataTypes.TINYINT,
        allowNull: false
    },
    is_upcoming: {
        type: DataTypes.TINYINT,
        allowNull: false
    },
    is_latest: {
        type: DataTypes.TINYINT,
        allowNull: false
    },
    price_desc: {
        type: DataTypes.TEXT,
    },
    highlights_desc: {
        type: DataTypes.TEXT,
    },
    key_specs: {
        type: DataTypes.TEXT,
    },
    manufacturer_desc: {
        type: DataTypes.TEXT,
    },
    is_recommended: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    link: {
        type: DataTypes.STRING,
    },
    headtag: {
        type: DataTypes.STRING,
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
    deleted_at: {
        type: DataTypes.DATE,
    },
    deleted_by: {
        type: DataTypes.INTEGER,
    }
}, {
    sequelize: db.Vehicle,
    modelName: 'VehicleInformation',
    tableName: 'vehicle_information',
    timestamps: false
});
VehicleInformation.hasMany(VehicleInformationImages, {
    as: 'vehicle_information_images',
    foreignKey: 'vehicle_information_id'
})
VehicleInformation.hasMany(VehicleModelColor, {
    as: 'vehicles_model_color',
    foreignKey: 'vehicle_information_id'
})
VehicleInformation.hasMany(PriceVariant, {
    as: 'vehicle_varint_price',
    foreignKey: 'vehicle_information_id'
})
export default VehicleInformation
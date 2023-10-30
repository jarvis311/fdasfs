import {
    Model,
    DataTypes
} from "sequelize";
import db from '../config/database.js'
class NewsHeadlines extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
    }
}
NewsHeadlines.init({
    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
    },
    index: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    category_id: {
        type: DataTypes.STRING,
        allowNull: false
    },
    vehicle_category_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    brand_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    tag_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    news_url: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false
    },
    date: {
        type: DataTypes.STRING,
        allowNull: false
    },
    image: {
        type: DataTypes.STRING,
    },
    websiteimage: {
        type: DataTypes.STRING,
    },
    is_slider: {
        type: DataTypes.INTEGER,
    },
    is_popular: {
        type: DataTypes.INTEGER,
    },
    headtag:{
        type: DataTypes.TEXT,
    },
    status: {
        type: DataTypes.INTEGER,
        allowNull: false
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
    deleted_by: {
        type: DataTypes.INTEGER,
    }
}, {
    sequelize: db.Vehicle,
    modelName: 'NewsHeadlines',
    tableName: 'news_headlines',
    timestamps: false
});
export default NewsHeadlines;
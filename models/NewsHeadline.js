import {
    Model,
    DataTypes
  } from "sequelize";
  import db from '../config/database.js'
  
  class NewsHeadline extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  NewsHeadline.init({
    index: {
      type: DataTypes.INTEGER,
    },
    category_id: {
        type: DataTypes.STRING,
      },
    title: {
        type: DataTypes.STRING,
    },
    news_url: {
        type: DataTypes.STRING,
    },
    description: {
        type: DataTypes.STRING,
    },
    date: {
        type: DataTypes.STRING,
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
    headtag: {
        type: DataTypes.STRING,
    },
    vehicle_category_id: {
        type: DataTypes.INTEGER,
    },
    brand_id: {
        type: DataTypes.INTEGER,
    },
    tag_id: {
        type: DataTypes.STRING,
    },
    status: {
        type: DataTypes.INTEGER,
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
        type: DataTypes.INTEGER,
    },
  }, {
    sequelize:db.Vehicle,
    modelName: 'NewsHeadline',
    tableName: 'news_headlines',
    timestamps: false
  });
  export default NewsHeadline;
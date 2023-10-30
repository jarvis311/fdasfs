import {
    Model,
    DataTypes
  } from "sequelize";
  import db from '../config/database.js'
  
  class NewsCategory extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  NewsCategory.init({
    index: {
      type: DataTypes.INTEGER,
    },
    name: {
        type: DataTypes.STRING,
    },
    image: {
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
    modelName: 'NewsCategory',
    tableName: 'news_category',
    timestamps: false
  });
  export default NewsCategory;
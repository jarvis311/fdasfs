import {
    Model,
    DataTypes
  } from "sequelize";
  import db from '../config/database.js'
  
  class News extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  News.init({
    news_headline_id: {
      type: DataTypes.INTEGER,
    },
    news: {
        type: DataTypes.TEXT,
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
    modelName: 'News',
    tableName: 'news',
    timestamps: false
  });
  export default News;
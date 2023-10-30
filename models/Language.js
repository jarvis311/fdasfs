import {
    Model,
    DataTypes
  } from "sequelize";
  import db from '../config/database.js'
  
  class Language extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Language.init({
    lable: {
      type: DataTypes.STRING,
    },
    type: {
        type: DataTypes.STRING,
    },
    gu: {
      type: DataTypes.STRING,
    },
    mr: {
      type: DataTypes.STRING,
    },
    ta: {
      type: DataTypes.STRING,
    },
    te: {
      type: DataTypes.STRING,
    },
    kn: {
      type: DataTypes.STRING,
    },
    hi: {
        type: DataTypes.STRING,
    },
    or: {
      type: DataTypes.STRING,
    },
    bn: {
      type: DataTypes.STRING,
    },
    ml: {
      type: DataTypes.STRING,
    },
    pa: {
      type: DataTypes.STRING,
    },
    created_at: {
      type: DataTypes.DATE,
    },
    updated_at: {
      type: DataTypes.DATE,
    },
    deleted_by: {
        type: DataTypes.INTEGER,
    },
  }, {
    sequelize:db.Vehicle,
    modelName: 'Language',
    tableName: 'language',
    timestamps: false
  });
  export default Language;
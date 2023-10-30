import {
    Model,
    DataTypes
  } from "sequelize";
  import db from '../config/database.js'
  class DLRC extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // DLRC.belongsTo(models.DrivingSchoolCity, {
      //   foreignKey: "city_id",
      // });
      // DLRC.hasMany(models.DrivingSchoolCity, {
      //   foreignKey: "area_id",
      // });
    }
  }
  DLRC.init({
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    thumb_image: {
      type: DataTypes.STRING,
      allowNull: false
    },
    en: {
      type: DataTypes.STRING,
      allowNull: false
    },
    hi: {
      type: DataTypes.STRING,
    },
    mr: {
      type: DataTypes.STRING,
    },
    gu: {
      type: DataTypes.STRING,
    },
    kn: {
      type: DataTypes.STRING,
    },
    ta: {
      type: DataTypes.STRING,
    },
    te: {
      type: DataTypes.STRING,
    },
    bn: {
      type: DataTypes.STRING,
    },
    ml: {
      type: DataTypes.STRING,
    },
    or: {
      type: DataTypes.STRING,
    },
    pa: {
      type: DataTypes.STRING,
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    deleted_by: {
      type: DataTypes.INTEGER,
    },
    deleted_at: {
      type: DataTypes.DATE,
    },
  }, {
    sequelize:db.Vehicle,
    modelName: 'DLRC',
    tableName: 'dl_rc_info',
    timestamps: false
  });
  export default DLRC;
import {
    Model,
    DataTypes
  } from "sequelize";
  import db from '../config/database.js'
  class AffiliationPlace extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */

  }
  AffiliationPlace.init({
    place: {
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
    }
  }, {
    sequelize:db.Vehicle,
    modelName: 'AffiliationPlace',
    tableName: 'affiliation_place',
    timestamps: false
  });
  export default AffiliationPlace;
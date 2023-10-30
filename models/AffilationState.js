import {
    Model,
    DataTypes
  } from "sequelize";
  import db from '../config/database.js'
  class AffilationState extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  AffilationState.init({
    state: {
      type: DataTypes.STRING,
    },
    city: {
        type: DataTypes.STRING,
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
    modelName: 'AffilationState',
    tableName: 'affilation_state',
    timestamps: false
  });
  export default AffilationState;
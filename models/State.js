import {
    Model,
    DataTypes
  } from "sequelize";
  import db from '../config/database.js'
  class State extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  State.init({
    state_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    per: {
      type: DataTypes.FLOAT,
    },
    parent_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
  }, {
    sequelize: db.Vehicle,
    modelName: 'State',
    tableName: 'state',
    timestamps: false
  });
  export default State;
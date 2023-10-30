import {
  Model,
  DataTypes
} from "sequelize";
import db from '../config/database.js'
  class RCReminder extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  RCReminder.init({
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    reg_number: {
      type: DataTypes.STRING,
      allowNull: false
    },
    reminder_type: {
      type: DataTypes.STRING,
      allowNull: false
    },
    doc_type: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    created_at: {
      type: DataTypes.DATE,
    },
    updated_at: {
      type: DataTypes.DATE,
    },
  }, {
    sequelize: db.Vehicle,
    modelName: 'RCReminder',
    tableName: 'rc_reminder',
    timestamps: false
  });
  export default RCReminder;
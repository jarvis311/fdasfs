import {
    Model,
    DataTypes
  } from "sequelize";
  import db from '../config/database.js'
  
  class UserRegistration extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  UserRegistration.init({
    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING,
    },
    email: {
        type: DataTypes.STRING,
    },
    device_id : {
        type: DataTypes.STRING,
        allowNull: false
    },
    google_token : {
        type: DataTypes.TEXT,
    },
    account_id : {
        type: DataTypes.STRING,
        allowNull: false
    }, 
    apple_token : {
        type: DataTypes.STRING,
    },
    fcm_token : {
        type: DataTypes.STRING,
    },
    player_id : {
        type: DataTypes.STRING,
    }, 
    vehicle_number : {
        type: DataTypes.STRING,
    },
    mobile_number : {
        type: DataTypes.STRING,
        allowNull: false
    },
    vahan_token : {
        type: DataTypes.STRING,
    },
    language_key : {
        type: DataTypes.STRING,
        allowNull: false
    },
    is_subscribed : {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    sku : {
        type: DataTypes.STRING,
    },
    purchase_time : {
        type: DataTypes.STRING,
    },
    expiry_date : {
        type: DataTypes.STRING,
    },  
    is_free_trial : {
        type: DataTypes.TINYINT,
        allowNull: false
    },
    is_purchased : {
        type: DataTypes.TINYINT,
        allowNull: false
    },
    no_of_days :  {
        type: DataTypes.TINYINT,
        allowNull: false
    },               
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    deleted_at: {
        type: DataTypes.DATE,
    },
  }, {
    sequelize:db.Vehicle,
    modelName: 'UserRegistration',
    tableName: 'user_registration',
    timestamps: false
  });
  export default UserRegistration;
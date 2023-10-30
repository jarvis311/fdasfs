import {
  Model,
  DataTypes
} from "sequelize";
import db from '../config/database.js'
import VehicleInformation from "./VehicleInformation.js";
import moment from "moment"

class BodyTypes extends Model {
  /**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   */
  static associate(models) {
  }
}
BodyTypes.init({
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  },
  category_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  image: {
    type: DataTypes.STRING,
    allowNull: false
  },
  status: {
    type: DataTypes.TINYINT,
    allowNull: false,
    get() {
      const value = this.getDataValue('status');
      if(value === 1){
        return true
      }
      if(value === 0){
        return false
      }
    }
  },
  position: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  created_at: {
    type: DataTypes.DATE,
    get() {
      return this.getDataValue('created_at') ? moment(this.getDataValue('created_at')).format('YYYY-MM-DD HH:mm:ss') : null ;
    }
  },
  updated_at: {
    type: DataTypes.DATE,
    get() {
      return this.getDataValue('updated_at')  ? moment(this.getDataValue('updated_at')).format('YYYY-MM-DD HH:mm:ss') : null;
    }
  },
  deleted_by: {
    type: DataTypes.INTEGER,
  },
  deleted_at: {
    type: DataTypes.DATE,
  },
}, {
  sequelize: db.Vehicle,
  modelName: 'BodyTypes',
  tableName: 'bodytypes',
  timestamps: false
});
VehicleInformation.addScope('condition', {
  where: {
    is_content_writer: 1,
    is_designer: 1,
  },
  attributes: [
      'id',
      'bodytype_id',
      'model_name',
      'price_range',
      'avg_rating',
      'review_count',
      'image',
      'popular_count',
  ],
});

BodyTypes.hasMany(VehicleInformation.scope('condition'), {
  as: 'most_search_vehicles',
  foreignKey: 'bodytype_id'
})
export default BodyTypes;
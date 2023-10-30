import {
    Model,
    DataTypes,
} from "sequelize";
import db from '../config/database.js'
import moment from "moment";
class License extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
  
}
License.init({
    id:{
       type:DataTypes.BIGINT,
       primaryKey:true,
       autoIncrement:true
    },
    license_no:{
        type: DataTypes.STRING,
        allowNull:false
    },
    dob:{
        type:DataTypes.STRING,
    },
    name:{
        type:DataTypes.STRING,
        allowNull:false
    },
    current_status:{
        type:DataTypes.STRING,
        allowNull:false
    },
    date_of_issue:{
        type:DataTypes.STRING,
        allowNull:false
    },
    last_transaction_at:{
        type:DataTypes.STRING,
        allowNull:false
    },
    old_new_dl_no :{
        type:DataTypes.STRING,
        allowNull:false
    },
    from_non_transport:{
        type: DataTypes.DATE
    },
    to_non_transport:{
        type: DataTypes.DATEONLY
    },
    from_transport:{
        type: DataTypes.STRING,
        default:null
    },
    to_transport:{
        type: DataTypes.STRING,
        defaultValue:null
    },
    hazardous_valid_till:{
        type:DataTypes.STRING,
    },
    hill_valid_till:{
        type:DataTypes.STRING,
    },
    cov_category:{
        type:DataTypes.STRING,
    },
    class_of_vehicle:{
        type:DataTypes.STRING,
    },
    cov_issue_date:{
        type:DataTypes.STRING,
    },
    blood_group:{
        type:DataTypes.STRING,
    },
    gender:{
        type:DataTypes.STRING,
    },
    citizen:{
        type:DataTypes.STRING,
    },
    created_at:{
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        get() {
            return this.getDataValue('created_at') ? moment(this.getDataValue('created_at')).format('YYYY-MM-DD HH:mm:ss') : null ;
          }
    },
    updated_at:{
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        get() {
            return this.getDataValue('updated_at') ? moment(this.getDataValue('updated_at')).format('YYYY-MM-DD HH:mm:ss') : null ;
          }
    },
    deleted_at:{
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    sequelize: db.Vehicle,
    modelName: 'License',
    tableName: 'license_informations',
    timestamps: false
});
 
export default License;
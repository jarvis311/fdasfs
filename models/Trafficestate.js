
import {
    Model,
    DataTypes
} from "sequelize";
import db from '../config/database.js'
import moment from "moment"

// import Traffic from "./Traffic.js";
class Trafficstate extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
        // Brands.belongsTo(models.DrivingSchoolCity, {
        //   foreignKey: "city_id",
        // });
        // Brands.hasMany(models.DrivingSchoolCity, {
        //   foreignKey: "area_id",
        // });
    }
}
Trafficstate.init({
    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
    },
    state_code: {
        type: DataTypes.STRING,
        defaultValue: null
    },
    state_name: {
        type: DataTypes.STRING,
        defaultValue: null
    },
    title: {
        type: DataTypes.STRING,
        defaultValue: null
    },
    title_gu: {
        type: DataTypes.STRING,
        defaultValue: null
    },
    title_hi: {
        type: DataTypes.STRING,
        defaultValue: null
    },
    title_mr: {
        type: DataTypes.STRING,
        defaultValue: null
    },
    title_pa: {
        type: DataTypes.STRING,
        defaultValue: null
    },
    title_ta: {
        type: DataTypes.STRING,
        defaultValue: null
    },
    title_te: {
        type: DataTypes.STRING,
        defaultValue: null
    },
    title_ml: {
        type: DataTypes.STRING,
        defaultValue: null
    },
    title_kn: {
        type: DataTypes.STRING,
        defaultValue: null
    },
    title_bn: {
        type: DataTypes.STRING,
        defaultValue: null
    },
    title_or: {
        type: DataTypes.STRING,
        defaultValue: null
    },

    sub_title: {
        type: DataTypes.STRING,
        defaultValue: null
    },
    sub_title_gu: {
        type: DataTypes.STRING,
        defaultValue: null
    },
    sub_title_hi: {
        type: DataTypes.STRING,
        defaultValue: null
    },
    sub_title_mr: {
        type: DataTypes.STRING,
        defaultValue: null
    },
    sub_title_pa: {
        type: DataTypes.STRING,
        defaultValue: null
    },
    sub_title_ta: {
        type: DataTypes.STRING,
        defaultValue: null
    },
    sub_title_te: {
        type: DataTypes.STRING,
        defaultValue: null
    },
    sub_title_ml: {
        type: DataTypes.STRING,
        defaultValue: null
    },
    sub_title_kn: {
        type: DataTypes.STRING,
        defaultValue: null
    },
    sub_title_bn: {
        type: DataTypes.STRING,
        defaultValue: null
    },
    sub_title_or: {
        type: DataTypes.STRING,
        defaultValue: null
    },

    content: {
        type: DataTypes.STRING,
        defaultValue: null
    },
    content_gu: {
        type: DataTypes.STRING,
        defaultValue: null
    },
    content_hi: {
        type: DataTypes.STRING,
        defaultValue: null
    },
    content_mr: {
        type: DataTypes.STRING,
        defaultValue: null
    },
    content_pa: {
        type: DataTypes.STRING,
        defaultValue: null
    },
    content_ta: {
        type: DataTypes.STRING,
        defaultValue: null
    },
    content_te: {
        type: DataTypes.STRING,
        defaultValue: null
    },
    content_ml: {
        type: DataTypes.STRING,
        defaultValue: null
    },
    content_kn: {
        type: DataTypes.STRING,
        defaultValue: null
    },
    content_bn: {
        type: DataTypes.STRING,
        defaultValue: null
    },
    content_or: {
        type: DataTypes.STRING,
        defaultValue: null
    },

    disclaimer: {
        type: DataTypes.STRING,
        defaultValue: null
    },
    disclaimer_gu: {
        type: DataTypes.STRING,
        defaultValue: null
    },
    disclaimer_hi: {
        type: DataTypes.STRING,
        defaultValue: null
    },
    disclaimer_mr: {
        type: DataTypes.STRING,
        defaultValue: null
    },
    disclaimer_pa: {
        type: DataTypes.STRING,
        defaultValue: null
    },
    disclaimer_ta: {
        type: DataTypes.STRING,
        defaultValue: null
    },
    disclaimer_te: {
        type: DataTypes.STRING,
        defaultValue: null
    },
    disclaimer_ml: {
        type: DataTypes.STRING,
        defaultValue: null
    },
    disclaimer_kn: {
        type: DataTypes.STRING,
        defaultValue: null
    },
    disclaimer_bn: {
        type: DataTypes.STRING,
        defaultValue: null
    },
    disclaimer_or: {
        type: DataTypes.STRING,
        defaultValue: null
    },
    share_image: {
        type: DataTypes.STRING,
        defaultValue: null
    },

    share_url: {
        type: DataTypes.STRING,
        defaultValue: null
    },
    created_at: {
        type: DataTypes.DATE,
       defaultValue: DataTypes.NOW,
       get() {
        return this.getDataValue('created_at') ? moment(this.getDataValue('created_at')).format('YYYY-MM-DD HH:mm:ss') : null ;
      }
    },
    updated_at: {
        type: DataTypes.DATE,
       defaultValue: DataTypes.NOW,
       get() {
        return this.getDataValue('updated_at')  ? moment(this.getDataValue('updated_at')).format('YYYY-MM-DD HH:mm:ss') : null;
      }
    },
    deleted_by: {
        type: DataTypes.STRING,
        defaultValue: null
    }
}, {
    sequelize: db.Vehicle,
    modelName: 'Trafficstate',
    tableName: 'traffic_state',
    timestamps: false
});
 
export default Trafficstate;
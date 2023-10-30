import {
    Op,
    Model,
    DataTypes,
    Sequelize
  } from "sequelize";
  import db from '../config/database.js'
  import AffilationData from "./AffilationData.js";
  import ServiceCategory from "./ServiceCategory.js";
  import AffiliationPlace from "./AffiliationPlace.js";
  class Affilation extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */

  }
  Affilation.init({
    service_category_id: {
        type: DataTypes.INTEGER,
    },
    affiliation_place_id: {
        type: DataTypes.INTEGER,
    },
    is_need_to_show: {
        type: DataTypes.INTEGER,
    },
    created_at: {
      type: DataTypes.DATE,
    },
    updated_at: {
      type: DataTypes.DATE,
    }
  }, {
    sequelize:db.Vehicle,
    modelName: 'Affilation',
    tableName: 'affiliate',
    timestamps: false
  });

  AffilationData.addScope('activeData',{
    where: {
      is_default: 0,
      status: 1,
      deleted_at: null,
    },
    order: [['group_id', 'ASC']],
    order: Sequelize.literal('RAND()'), 
    attributes: [
      'id',
      'service_provider_id',
      'affiliation_services_id',
      'banner',
      'url',
      'utm_term',
      'lable',
      'status',
      'affiliate_id',
      'group_id',
      'title',
      'description',
      'action_button',
      'rc_image',
      'is_priority',
      'is_default',
    ],
  })

  Affilation.hasMany(AffilationData.scope('activeData'),{
    foreignKey: 'affiliate_id',
    as: 'get_affiliation_data_group_wise',
  });


  AffilationData.addScope('affitaionData',{
    where: {
      is_default: 0,
      status: 1,
      deleted_at: null,
    },
    attributes: [
      'id',
      'service_provider_id',
      'affiliation_services_id',
      'banner',
      'url',
      'utm_term',
      'lable',
      'status',
      'affiliate_id',
      'group_id',
      'title',
      'description',
      'action_button',
      'rc_image',
      'is_priority',
      'is_default',
      'position',
    ],
  })

  Affilation.hasMany(AffilationData.scope('affitaionData'),{
    foreignKey: 'affiliate_id',
    as: 'get_affiliation_data',
  });

  Affilation.hasOne(ServiceCategory,{
    foreignKey: 'id',
    sourceKey: 'service_category_id',
    as: 'get_name',
  })
  
  Affilation.belongsTo(AffiliationPlace, {
    foreignKey: 'affiliation_place_id',
    as: 'get_affiliation_place',
  });
  

  AffilationData.addScope('data_affilate',{
    where: {
      is_default: 0,
      status: 1,
      deleted_at: null,
    },
  
    attributes: [
      'id',
      'service_provider_id',
      'affiliation_services_id',
      'banner',
      'url',
      'utm_term',
      'lable',
      'affiliate_id',
      'group_id',
      'is_priority',
    ],
  })

  Affilation.hasMany(AffilationData.scope('data_affilate'),{
    foreignKey: 'affiliate_id',
    sourceKey: 'id',
    as: 'get_affiliation_data_affilate',
  })

  // Define the query scope

  export default Affilation;
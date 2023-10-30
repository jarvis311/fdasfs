import {
    Model,
    DataTypes
  } from "sequelize";
  import db from '../config/database.js'
  import AffiliationServices from '../models/AffiliationServices.js'
  import ServiceProvider from "./ServiceProvider.js";
  class AffilationData extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */

  }
  AffilationData.init({
    affiliate_id: {
      type: DataTypes.INTEGER,
    },
    group_position: {
        type: DataTypes.INTEGER,
    },
    group_id: {
      type: DataTypes.INTEGER,
    },
    is_default: {
      type: DataTypes.INTEGER,
    },
    service_provider_id: {
      type: DataTypes.INTEGER,
    },
    affiliation_services_id: {
      type: DataTypes.INTEGER,
    },
    ad_type_id: {
      type: DataTypes.INTEGER,
    },
    position: {
      type: DataTypes.INTEGER,
    },
    utm_term: {
      type: DataTypes.STRING,
    },
    url: {
      type: DataTypes.STRING,
    },
    status: {
      type: DataTypes.INTEGER,
    },
    lable: {
      type: DataTypes.STRING,
    },
    banner: {
      type: DataTypes.STRING,
    },
    title: {
      type: DataTypes.STRING,
    },
    action_button: {
      type: DataTypes.STRING,
    },
    description: {
      type: DataTypes.STRING,
    },
    rc_image: {
      type: DataTypes.STRING,
    },
    is_priority: {
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
    modelName: 'AffilationData',
    tableName: 'affiliate_data',
    timestamps: false
  });

  AffilationData.belongsTo(AffiliationServices, {
    foreignKey: 'affiliation_services_id', // Foreign key in the Affilation model
    targetKey: 'id', // Target key in the AffiliationServices model
    as: 'get_affiliation_services', // This sets the alias for the association
  });
  
  AffilationData.belongsTo(ServiceProvider, {
    foreignKey: 'service_provider_id', // Foreign key in the Affilation model
    targetKey: 'id', // Target key in the AffiliationServices model
    as: 'get_service_provider_name', // This sets the alias for the association
  });

  export default AffilationData;
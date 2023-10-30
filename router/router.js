import express from 'express';
const router = express.Router()


import ServiceControlleAPI from '../controller/api/ServiceControlleAPI.js'
import DrivingSchoolController from '../controller/api/DrivingSchoolController.js'

import AdType from "../controller/api/AdType.js"
import VehicleInfo from "../controller/api/VehicleInformation.js"
import Traffice_State from "../controller/api/Trafficstate.js"
import ResaleValue from '../controller/api/ResaleValue.js';
import decryptObject from '../middleware/encryptMiddleware.js';
import AppUpdateApiController from '../controller/api/AppUpdateApiController.js';
import FuelPrice from '../controller/api/FuelPrice.js';
import LicenseDetail from '../controller/api/LicenseDetail.js';
// import Feedback from '../controller/api/Feedback.js';
// import VehicleCategory from '../controller/api/VehicleCategory.js';
// import DocumentController from '../controller/api/DocumentController.js';
import { RCDetailsApiController } from '../controller/api/RCDetailsApiController.js';
import { createChallanDetailsController, getChallanDetailsController } from '../controller/api/Challan.controller.js';

import NewsApiController from '../controller/api/NewsApiController.js';




//************** Adtype ************** /
router.get("/get-adtype", AdType.getAllAdType)


/************* Vehicle Information ************** 
************** Mansi  ************** 
************** 06-10-23 ************** 
************** Vehicle Information **************/


router.post("/vasu_vehicle_information", decryptObject, VehicleInfo.getVehicleInformation)
router.post("/vasu_single_vehicle_information", decryptObject, VehicleInfo.getSingleVehicleInformation)
router.post("/vasu_see_all_vehicle", decryptObject, VehicleInfo.getAllVehicleInformation)
router.post('/vasu_compare_vehicle', decryptObject, VehicleInfo.getCompareVehicleInformation)

/************** Vehicle Information End**************/




/***********serviceCenter************************
 **********  Nirmal 09-10-2023 ******************/
router.post('/get_service_center_brand', decryptObject, ServiceControlleAPI.get_service_center_brand)
router.post('/get_service_center_state_city', decryptObject, ServiceControlleAPI.get_service_center_state_city)
/***********serviceCenter Nirmal 10-10-2023 ******************/
router.post('/get_service_center_data', decryptObject, ServiceControlleAPI.get_service_center_data)
router.post('/store_service_center', decryptObject, ServiceControlleAPI.store_service_center)

/*************DrivingSchool Nirmal 10-10-2023*****************************/
router.post('/driving_school_state', decryptObject, DrivingSchoolController.driving_school_state)
router.post('/add_driving_school_details', decryptObject, DrivingSchoolController.add_driving_school_details)
router.post('/driving_school_details', decryptObject, DrivingSchoolController.DrivingSchooldetails)
router.post('/driving_school_details_city_wise', decryptObject, DrivingSchoolController.driving_school_details_city_wise)

/************* Traffic State START************** 
************** Dipak  ************** 
************** 06-10-23 ************** */
// router.post('/add_state' ,decryptObject,Traffice_State.add_state) 
// router.post('/get_state' ,decryptObject,Traffice_State.get_state)
// router.post('/get_state/:id' ,decryptObject,Traffice_State.get_state__ID)
// router.post('/update_state/:id' ,decryptObject,Traffice_State.update_state)
// router.post('/delete_state' ,decryptObject,Traffice_State.delete_state)
// ************** Traffic State END **************/

/************* Traffic State START************** 
************** Nirmal  ************** 
************** 18-10-23 ************** */
router.post('/vasu_traffic_fine', decryptObject, Traffice_State.vasu_traffic_fine)
// ************** Traffic State END **************/

/************* Resale Value ************** 
************** Mansi  ************** 
************** 18-10-23 ************** 
************** Resale Value API **************/
router.post('/vasu_resale_company_models', decryptObject, ResaleValue.getCompayAndModels)
router.post('/vasu_resale_years_variant', decryptObject, ResaleValue.getResaleYearsVariant)
router.post('/vasu_resale_result', decryptObject, ResaleValue.getResaleResult)
router.post('/user_vehicle_search', ResaleValue.getUserVehicleSearch)



/**************Fuel Price Nirmal 19-10-2023 ********/
router.post('/vasu_fuel_states', decryptObject, FuelPrice.getState_new_auth)
router.post('/vasu_fuel_cities', decryptObject, FuelPrice.getFuelData_new_auth)
router.post('/vasu_fuel_history', decryptObject, FuelPrice.petrolHistory)
router.post('/vasu_fuel_data_by_cityname', decryptObject, FuelPrice.getFualPriceByCity)



/************* Affilation And Service APi Start *************
*************** Sumit Patel  ************** 
************** 19-10-23 ************** */
router.post("/services", decryptObject, AppUpdateApiController.services)
router.post("/affilation", decryptObject, AppUpdateApiController.affilation)
router.post("/offer", decryptObject, AppUpdateApiController.offer)
router.post("/get_afiilation_state", decryptObject, AppUpdateApiController.getAffilationState)
router.post("/vasu_news_category_headline", decryptObject, NewsApiController.newsCategoryHeadline)
router.post("/vasu_search_news", decryptObject, NewsApiController.newsSearch)
/************* Affilation And Service APi END ************* */



/**************License detail Nirmal 24-10-2023*************** */
router.post("/vasu_licence_details", decryptObject, LicenseDetail.license_info_new_auth)

/***************feedback api Nirmal 26-10-2023*************** */
// router.post("/feeback",decryptObject,Feedback.feedback)

/***************vehiclecategory api Nirmal 27-10-2023******** */
// router.post("/vasu_vehicle_category",decryptObject,VehicleCategory.GetVehicleCategory)


/************* User Document Upload ************** 
************** Mansi  ************** 
************** 24-10-23 ************** 
************** User Document Upload **************/

// router.post("/user_verification" ,DocumentController.userVerification)
// router.post("/user_vehicle_document_upload" ,DocumentController.userDocumentUpload)
// router.post("/user_vehicle_document_delete" ,DocumentController.userDocumentDelete)
// router.post("/user_verification" ,decryptObject,DocumentController.userVerification)
// router.post("/user_vehicle_document_delete_by_number",DocumentController.userDocumentDeleteByNumber)
// router.post("/user_searched_number_remove",DocumentController.userSearchedNumberRemove)
// router.post("/user_searched_number_store",DocumentController.userSearchedByNumberStore)
// router.post("/vasu_user_record_delete",DocumentController.deleteUserRecord)

// router.post("/user_subscription",DocumentController.useSubscription)



/************* RC Details ************** 
************** Jignesh Patel  ************** 
************** 25-10-23 ************** 
************** RC Details Get Apis **************/
router.post("/get-rc-details", decryptObject, RCDetailsApiController)


/************* Challan module ************** 
************** Jignesh Patel  ************** 
************** 27-10-23 ************** 
************** Challan Get Apis **************/
router.post("/get_challan", decryptObject, getChallanDetailsController)
router.post("/create_challan", decryptObject, createChallanDetailsController)

router.post("/vasu_dl_rc_info", decryptObject, VehicleInfo.getDLRCInformation)


export default router;


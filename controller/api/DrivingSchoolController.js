import DrivingSchoolState from "../../models/DrivingSchoolState.js";
import DrivingSchoolCity from "../../models/DrivingSchoolCity.js";
import DrivingSchoolDetails from "../../models/DrivingSchoolDetails.js";
import redisClient from "../../config/redis.js";
import utils from "../../helpers/utils.js";



/********************* getDrivingSchoolstate 10-10-2023*************start************************* */
const driving_school_state = async (req, res) => {
  try {
    const rto = req.body.hasOwnProperty('rto');
    if (await redisClient.get("driving_school_state")) {
      const data = await redisClient.get("driving_school_state");
      if (data) {
        console.log("data get from the redis");
      }
      let resp = utils.encrypt(JSON.stringify({
        status: true,
        response_code: 200,
        response_message: "Success",
        data: JSON.parse(data),
      }),rto)
      return res.send(resp)
    } else {
      const data = await DrivingSchoolState.findAll({
        attributes: ["id", "state_name", "state_code"],
      });
      let dataStore = await redisClient.set(
        "driving_school_state",
        JSON.stringify(data)
      );
      if (dataStore) {
        console.log("data is store in redis.");
      }
      let resp = utils.encrypt(JSON.stringify({
        status: true,
        response_code: 200,
        response_message: "Success",
        data: data,
      }),rto)
      return res.send(resp)
    }
  } catch (error) {
    return res.send(
      utils.encrypt(
        {
          status: false,
          message: "Error Eccoured !",
        },
        req.body.hasOwnProperty("rto")
      )
    );
  }
};

/********************* getDrivingSchoolstate 10-10-2023*************stop************************* */

/********************* getDrivingSchoolstate 11-10-2023*************start************************* */
const add_driving_school_details = async (req, res) => {
  try {
    let {
      city_id,
      contact,
      driving_school_name,
      zipcode,
      services,
      website,
      paymentMode,
      sun,
      mon,
      tue,
      wed,
      thu,
      fri,
      sat,
      email,
      driving_school_address,
      areaId
    } = req.body;
    const rto = req.body.hasOwnProperty('rto');

    if (!city_id || city_id === undefined) {
      let resp = utils.encrypt(JSON.stringify({
        status: false,
        response_code: 400,
        msg: "Please provide city_id field!!",
      }),rto)
      return res.send(resp)
    } else if (!driving_school_name || driving_school_name.length === 0) {
      let resp = utils.encrypt(JSON.stringify({
        status: false,
        response_code: 400,
        msg: "Please provide name field!!",
      }),rto)
      return res.send(resp)
    }
    let checkcityId = await DrivingSchoolCity.findAll({
      where: { id: city_id },
    });
    // console.log(checkcityId);
    if (checkcityId.length === 0) {
      let resp = utils.encrypt(JSON.stringify({ 
        status:false,
        response_code:400,
        msg: "City is not found" 
      }),rto)
      return res.send(resp)
    }
    let Drivingdetail = {
      name: driving_school_name,
      services: services,
      areaId: areaId,
      cityId: city_id,
      address: driving_school_address,
    };
    let contactNumber1 = contact ? contact.split(",")[0] : null;
    let contactNumber2 = contact ? contact.split(",")[1] : null;
    Drivingdetail.contactNumber1 = contactNumber1;
    Drivingdetail.contactNumber2 = contactNumber2;
    Drivingdetail.type = "school";
    Drivingdetail.sun = sun !== undefined && sun !== "" ? sun : "NA";
    Drivingdetail.mon = mon !== undefined && mon !== "" ? mon : "NA";
    Drivingdetail.tue = tue !== undefined && tue !== "" ? tue : "NA";
    Drivingdetail.wed = wed !== undefined && wed !== "" ? wed : "NA";
    Drivingdetail.thu = thu !== undefined && thu !== "" ? thu : "NA";
    Drivingdetail.fri = fri !== undefined && fri !== "" ? fri : "NA";
    Drivingdetail.sat = sat !== undefined && sat !== "" ? sat : "NA";
    Drivingdetail.zip_code =
      zipcode !== undefined && zipcode !== "" ? zipcode : 0;
    Drivingdetail.website =
      website !== undefined && website !== "" ? website : null;
    Drivingdetail.paymentMode =
      paymentMode !== undefined && paymentMode !== "" ? paymentMode : null;
    Drivingdetail.email = email !== undefined && email !== "" ? email : null;
    Drivingdetail.openTime = "10:00:00";
    Drivingdetail.closeTime = "18:00:00";
    Drivingdetail.added_by = 1;
    Drivingdetail.status = 0;
    Drivingdetail.areaId = areaId !== undefined && areaId !== "" ? areaId : 0;
    let DrivingSchoolDataStore = await DrivingSchoolDetails.create(
      Drivingdetail
    );
    // res.json({msg : DrivingSchoolDataStore})
    // console.log(DrivingSchoolDataStore);
    if (DrivingSchoolDataStore) {
      let resp = utils.encrypt(JSON.stringify({
        status: true,
        response_code: 200,
        response_message: "Data added succesfully!!...",
      }),rto)
      return res.send(resp)
    }
  } catch (error) {
    return res.send(
      utils.encrypt(
        {
          status: false,
          message: "Error Eccoured !",
        },
        req.body.hasOwnProperty("rto")
      )
    );
  }
};
/********************* getDrivingSchoolstate 11-10-2023*************END**************************** */

/********************* DrivingDetailstate 11-10-2023*************start************************* */
const DrivingSchooldetails = async (req, res) => {
  try {
    let { state_id,language_key } = req.body;
    const rto = req.body.hasOwnProperty('rto');
    if (!state_id || state_id === undefined) {
      let message = await utils.translate('state_is_required',language_key)
      let resp = utils.encrypt(JSON.stringify({
        status: false,
        response_code: 400,
        msg: message,
      }),rto)
      return res.send(resp)
    }

    if (await redisClient.get(`DrivingSchoolCity_${state_id}`)) {
      const data = await redisClient.get(`DrivingSchoolCity_${state_id}`);
      if (data) {
        console.log("data get from the redis");
      }
      let resp = utils.encrypt(JSON.stringify({
        status: true,
        response_code: 200,
        response_message: "Success",
        data: JSON.parse(data),
      }),rto)
      return res.send(resp)
    } else {
      const schoolDetail = await DrivingSchoolCity.findAll({
        where: { state_id: state_id },
        attributes: [
          "id",
          "state_id",
          "city_name",
          "other_name",
          "latitude",
          "longitude",
        ],
        order: [["id", "ASC"]],
      });

      let data2 = await redisClient.set(
        `DrivingSchoolCity_${state_id}`,
        JSON.stringify(schoolDetail)
      );
      if (data2) {
        console.log("data is stored in redis caches");
      }

      let drivingSchoolDetail = {
        status: true,
        response_code: 200,
        response_message: "Success",
        data: schoolDetail,
      };
      let resp = utils.encrypt(JSON.stringify({
        status: true,
        response_code: 200,
        response_message: "Success",
        data: schoolDetail,
      }),rto)
      return res.send(resp)
    }
  } catch (error) {
    return res.send(
      utils.encrypt(
        {
          status: false,
          message: "Error Eccoured !",
        },
        req.body.hasOwnProperty("rto")
      )
    );
  }
};
/********************* DrivingDetailstate 11-10-2023*************END************************* */

/********************* DrivingDetailstatewise 11-10-2023*************Start************************* */
const driving_school_details_city_wise = async (req, res) => {
  try {
    let { city_id, language_key } = req.body;
    const rto = req.body.hasOwnProperty('rto');
    
    if (!city_id || city_id === undefined) {
      let message = await utils.translate('City_name_is_required',language_key)
      let resp = utils.encrypt(JSON.stringify({
        status: false,
        response_code: 400,
        msg: message,
      }),rto)
      return res.send(resp)
    }
    if (await redisClient.get(`DrivingSchoolDetails_${city_id}`)) {
      let citywisedata = await redisClient.get(
        `DrivingSchoolDetails_${city_id}`
      );
      if (citywisedata) {
        console.log("===>data get from the redis");
      }
      // await redisClient.del(`DrivingSchoolDetails_${city_id}`)
     
      let resp = utils.encrypt(JSON.stringify({
        status: true,
        response_code: 200,
        response_message: "Success",
        data: JSON.parse(citywisedata),
      }),rto)
      return res.send(resp)
    } else {
      const citywisedata = await DrivingSchoolDetails.findAll({
        where: { cityId: city_id },
        attributes: { exclude: ['added_by'] }
      });
      let city_wise = {
        status: true,
        response_code: 200,
        response_message: "Success",
        data: citywisedata,
      };
      if (citywisedata.length === 0) {
        let resp = utils.encrypt(JSON.stringify({
          status:false,
          response_code:400,
          message: "Please provide valid city_id!!!"
        }),rto)
        return res.send(resp)
      }
      citywisedata.forEach((ele) => {
        ele.zipCodeId = ele.zipCodeId === null ? "" : ele.zipCodeId;
        ele.latitude = ele.latitude === null ? "" : ele.latitude;
        ele.longitude = ele.longitude === null ? "" : ele.longitude;
        ele.contactNumber1 =
          ele.contactNumber1 === null ? "" : ele.contactNumber1;
        ele.contactNumber2 =
          ele.contactNumber2 === null ? "" : ele.contactNumber2;
        ele.website = ele.website === null ? "" : ele.website;
        ele.isFeatured = ele.isFeatured === null ? "" : ele.isFeatured;
        ele.rowNumber = ele.rowNumber === null ? "" : ele.rowNumber;
        ele.isFeatured = ele.isFeatured === null ? "" : ele.isFeatured;
        ele.schoolValue = ele.schoolValue === null ? "" : ele.schoolValue;
        ele.open_close = ele.open_close === null ? "" : ele.open_close;
        ele.deleted_at = ele.deleted_at === null ? "" : ele.deleted_at;
        ele.deleted_by = ele.deleted_by === null ? "" : ele.deleted_by;
        ele.coverPhoto = ele.coverPhoto === null ? "" : ele.coverPhoto;
        ele.photo = ele.photo === null ? "" : ele.photo;
      });
      // console.log(citywisedata);

      let storeinredis = await redisClient.set(
        `DrivingSchoolDetails_${city_id}`,
        JSON.stringify(citywisedata)
      );
      if (storeinredis) {
        console.log("=====>data stored in redis");
      }
      let resp = utils.encrypt(JSON.stringify({
        status: true,
        response_code: 200,
        response_message: "Success",
        data: citywisedata, 
      }),rto)
      return res.send(resp)
    }
  } catch (error) {
    return res.send(
      utils.encrypt(
        {
          status: false,
          message: "Error Eccoured !",
        },
        req.body.hasOwnProperty("rto")
      )
    );
  }
};
/********************* DrivingDetailstatewise 11-10-2023*************END************************* */

export default {
  driving_school_state,
  add_driving_school_details,
  DrivingSchooldetails,
  driving_school_details_city_wise,
};

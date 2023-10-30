import ServiceCenterBrand from "../../models/ServiceCenterBrand.js";
import ServiceCenterState from "../../models/ServiceCenterState.js";
import ServiceCenterData from "../../models/ServiceCenterData.js";
import ServiceCenterDealer from "../../models/ServiceCenterDealer.js";
import ServiceCenterCity from "../../models/ServiceCenterCity.js";
import redisClient from "../../config/redis.js";
import utils from "../../helpers/utils.js";

/******************************************************Get Service centerBrand DATA Nirmal 09-10-2023 start********************************** */
const get_service_center_brand = async (req, res) => {
  try {
    let { type } = req.body;
    console.log(req.body);
    const rto = req.body.hasOwnProperty("rto");
    if (!type || type.length === 0) {
      let resp = {
        status: false,
        response_code: 400,
        msg: "Please provide type field!!",
      };
      // let resp2 = Encryptdata(JSON.stringify(resp),rto)
      let resp2 = utils.encrypt(JSON.stringify(resp), rto);

      return res.send(resp2);
    }
    let car = [];
    let bike = [];
    if (await redisClient.get(`get_service_center_brand`)) {
      let data = await redisClient.get(`get_service_center_brand`);
      if (data) {
        console.log("==>data is get from the redis");
      }
      let response = {
        status: true,
        response_code: 200,
        response_message: "Success",
        data: JSON.parse(data),
      };

      let resp = utils.encrypt(JSON.stringify(response), rto);
      return res.send(resp);
    } else {
      const data2 = await ServiceCenterBrand.findAll({ where: { status: 1 } });
      let ServiveCenter = data2.map((ele) => {
        if (ele.type === 2) {
          car.push({
            id: ele.id,
            brand_name: ele.brand_name,
            brand_slug: ele.brand_slug,
            brand_image: ele.brand_image,
          });
        } else if (ele.type === 1) {
          bike.push({
            id: ele.id,
            brand_name: ele.brand_name,
            brand_slug: ele.brand_slug,
            brand_image: ele.brand_image,
          });
        }
      });
      let data = {
        car: car,
        bike: bike,
      };
      let storedata = await redisClient.set(
        "get_service_center_brand",
        JSON.stringify(data)
      );
      if (storedata) {
        console.log("===>data is stored in redis");
      }
      let resp = {
        status: true,
        response_code: 200,
        response_message: "Success",
        data: data,
      };
      let resp2 = utils.encrypt(JSON.stringify(resp), rto);
      res.send(resp2);
    }
  } catch (error) {
    return res.send(utils.encrypt({
      status: false,
      message: "Error Eccoured !"
  },req.body.hasOwnProperty('rto')))
  }
};
/******************************************************Get Service centerBrand DATA Nirmal 09-10-2023 END********************************** */

/******************************************************Get Service Center & state city Start*********************************************** */
const get_service_center_state_city = async (req, res) => {
  try {
    const rto = req.body.hasOwnProperty("rto");
    if (await redisClient.get("get_service_center_state_city")) {
      let data = await redisClient.get("get_service_center_state_city");
      if (data) {
        console.log("==>data is get from the redis");
      }
      let resp = {
        status: true,
        response_code: 200,
        response_message: "Success",
        data: JSON.parse(data),
      };
      // let resp2 = Encryptdata(JSON.stringify(resp),rto)
      let resp2 = utils.encrypt(JSON.stringify(resp), rto);
      return res.send(resp2);
    } else {
      const data = await ServiceCenterState.findAll({
        attributes: ["id", "name"],
        include: [
          {
            model: ServiceCenterCity,
            as: "get_city",
            attributes: ["id", "state_id", "name"],
          },
        ],
      });
      data.forEach((ele, index) => {
        if (ele.get_city.length === 0) {
          data.splice(index, 1);
        }
      });
      let storeddata = await redisClient.set(
        "get_service_center_state_city",
        JSON.stringify(data)
      );
      if (storeddata) {
        console.log("===>data is stored in redis");
      }

      let resp = {
        status: true,
        response_code: 200,
        response_message: "Success",
        data: data,
      };
      // let resp2 = Encryptdata(JSON.stringify(resp),rto)
      let resp2 = utils.encrypt(JSON.stringify(resp), rto);
      return res.send(resp2);
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

/******************************************************Get Service centerBrand DATA Nirmal 09-10-2023 END********************************** */

/***************************************************Get service centerdata API Nirmal 10-10-2023 Start ********************************************/
const get_service_center_data = async (req, res) => {
  try {
    let { type, cat_id, city_id, brand_id } = req.body;
    const rto = req.body.hasOwnProperty("rto");
    let data = [];
    if (!type || type.length === 0) {
      let resp = {
        status: false,
        response_code: 400,
        msg: "Please provide the type field!!",
      };
      // let resp2 = Encryptdata(JSON.stringify(resp),rto)
      let resp2 = utils.encrypt(JSON.stringify(resp), rto);
      return res.send(resp2);
    } else if (!cat_id || cat_id.length === 0) {
      let resp = utils.encrypt(
        JSON.stringify({
          status: false,
          response_code: 400,
          msg: "Please provide the cat_id field!!",
        }),
        rto
      );
      return res.send(resp);
    } else if (!city_id || city_id.length === 0) {
      let resp = utils.encrypt(
        JSON.stringify({
          status: false,
          response_code: 400,
          msg: "Please provide the city_id field!!",
        }),
        rto
      );
      return res.send(resp);
    } else if (!brand_id || brand_id.length === 0) {
      let resp = utils.encrypt(
        JSON.stringify({
          status: false,
          response_code: 400,
          msg: "Please provide the brand_id field!!",
        }),
        rto
      );
      return res.send(resp);
    }
    if (type === "service") {
      data = await ServiceCenterData.findAll({
        where: {
          type: cat_id,
          city_id: city_id,
          brand_id: brand_id,
          status: 1,
        },
        attributes: [
          "id",
          "name",
          "address",
          "number",
          "email",
          "website",
          "zipcode",
          "paymentMode",
          "sun",
          "mon",
          "tue",
          "wed",
          "thu",
          "fri",
          "sat",
        ],
      });
    }
    if (type === "dealer") {
      data = await ServiceCenterDealer.findAll({
        where: {
          status: 1,
          city_id: city_id,
          type: cat_id,
          brand_id: brand_id,
        },
        attributes: [
          "id",
          "name",
          "address",
          "number",
          "email",
          "website",
          "zipcode",
          "paymentMode",
          "sun",
          "mon",
          "tue",
          "wed",
          "thu",
          "fri",
          "sat",
        ],
      });
    }

    data.forEach((ele) => {
      let time = ele.mon.split("");
      time.splice(7, 1, " - ");
      ele.mon = time.join("");
      let time2 = ele.tue.split("");
      time2.splice(7, 1, " - ");
      ele.tue = time2.join("");
      let time3 = ele.wed.split("");
      time3.splice(7, 1, " - ");
      ele.wed = time3.join("");
      let time4 = ele.thu.split("");
      time4.splice(7, 1, " - ");
      ele.thu = time4.join("");
      let time5 = ele.fri.split("");
      time5.splice(7, 1, " - ");
      ele.fri = time5.join("");
      let time6 = ele.sat.split("");
      time6.splice(7, 1, " - ");
      ele.sat = time6.join("");
      ele.website = ele.website === null ? "" : ele.website;
      ele.email = ele.email === null ? "" : ele.email;
      ele.paymentMode = ele.paymentMode === null ? "" : ele.paymentMode;
      ele.zipcode = ele.zipcode.toString();
    });
    if (data.length === 0) {
      let resp = utils.encrypt(
        JSON.stringify({
          status: false,
          response_code: 400,
          response_message: "data not found!!!",
        }),
        rto
      );
      return res.send(resp);
    }

    let resp2 = utils.encrypt(
      JSON.stringify({
        status: true,
        response_code: 200,
        response_message: "Success",
        data: data,
      }),
      rto
    );
    return res.send(resp2);
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
/***************************************************Get service centerdata API Nirmal 10-10-2023 END ********************************************/

/*****************************************Store Service Center data API nirmal 10-10-2023 Start***********************************************************************/
const store_service_center = async (req, res) => {
  try {
    let {
      type, // service and dealer
      city_id,
      name,
      address,
      car_brand_id,
      sun,
      mon,
      tue,
      wed,
      thu,
      fri,
      sat,
      bike_brand_id,
      zipcode,
      number, // service center contact number
      email,
      website,
      paymentMode,
    } = req.body;
    const rto = req.body.hasOwnProperty("rto");
    if (!type || type.length === 0) {
      let resp = utils.encrypt(
        JSON.stringify({
          status: false,
          response_code: 400,
          msg: "type field is Required",
        }),
        rto
      );
      return res.send(resp);
    } else if (!city_id || city_id.length === 0) {
      let resp = utils.encrypt(
        JSON.stringify({
          status: false,
          response_code: 400,
          msg: "city_id field is Required",
        }),
        rto
      );
      return res.send(resp);
    } else if (!name || name.length === 0) {
      let resp = utils.encrypt(
        JSON.stringify({
          status: false,
          response_code: 400,
          msg: "name field is Required",
        }),
        rto
      );
      return res.send(resp);
    } else if (!address || address.length === 0) {
      let resp = utils.encrypt(
        JSON.stringify({
          status: false,
          response_code: 400,
          msg: "address field is Required",
        }),
        rto
      );
      return res.send(resp);
    } else if (
      (!car_brand_id || car_brand_id.length === 0) &&
      (!bike_brand_id || bike_brand_id.length === 0)
    ) {
      let resp = utils.encrypt(
        JSON.stringify({
          status: false,
          response_code: 400,
          msg: "Required car_brand_id or bike_brand_id field!!",
        }),
        rto
      );
      return res.send(resp);
    } else if (car_brand_id && bike_brand_id) {
      let resp = utils.encrypt(
        JSON.stringify({
          status: false,
          response_code: 400,
          msg: "please do not provide both car_brand_id and bike_brand_id ..provide OnlyOne of them",
        }),
        rto
      );
      return res.send(resp);
    }
    let checkCityid = await ServiceCenterCity.findAll({
      where: { id: city_id },
    });
    if (checkCityid.length === 0) {
      // res.json({
      //   status: false,
      //   response_code: 400,
      //   msg: "City is not found!!!!",
      // });
      let resp = utils.encrypt(
        JSON.stringify({
          status: false,
          response_code: 400,
          msg: "City is not found!!!!",
        }),
        rto
      );
      return res.send(resp);
    }

    let ServiceCenterdata = {
      index: 1,
      city_id: city_id,
      name: name,
      address: address,
      status: 1,
      added_by: 1,
    };
    ServiceCenterdata.sun = sun !== undefined && sun !== "" ? sun : "NA";
    ServiceCenterdata.mon = mon !== undefined && mon !== "" ? mon : "NA";
    ServiceCenterdata.tue = tue !== undefined && tue !== "" ? tue : "NA";
    ServiceCenterdata.wed = wed !== undefined && wed !== "" ? wed : "NA";
    ServiceCenterdata.thu = thu !== undefined && thu !== "" ? thu : "NA";
    ServiceCenterdata.fri = fri !== undefined && fri !== "" ? fri : "NA";
    ServiceCenterdata.sat = sat !== undefined && sat !== "" ? sat : "NA";
    ServiceCenterdata.zipcode =
      zipcode !== undefined && zipcode !== "" ? zipcode : null;
    ServiceCenterdata.website =
      website !== undefined && website !== "" ? website : null;
    ServiceCenterdata.paymentMode =
      paymentMode !== undefined && paymentMode !== "" ? paymentMode : null;
    ServiceCenterdata.email =
      email !== undefined && email !== "" ? email : null;
    ServiceCenterdata.number =
      number !== undefined && number !== "" ? number : null;

    if (type === "service") {
      if (car_brand_id && car_brand_id !== "") {
        ServiceCenterdata["brand_id"] = car_brand_id.trim();
        ServiceCenterdata["type"] = 2;
        let StoreServicecenterdata = await ServiceCenterData.create(
          ServiceCenterdata
        );
        // res.json({ data: StoreServicecenterdata });
        if (StoreServicecenterdata) {
          let resp = utils.encrypt(
            JSON.stringify({
              status: true,
              response_code: 200,
              response_message: "Data Update Successfully!!!",
            }),
            rto
          );
          return res.send(resp);
        }
      }
      if (bike_brand_id && bike_brand_id !== "") {
        ServiceCenterdata["brand_id"] = bike_brand_id.trim();
        ServiceCenterdata["type"] = 1;
        let Storebikeservicedata = await ServiceCenterData.create(
          ServiceCenterdata
        );
        if (Storebikeservicedata) {
          let resp = utils.encrypt(
            JSON.stringify({
              status: true,
              response_code: 200,
              response_message: "Data Update Successfully!!!",
            }),
            rto
          );
          return res.send(resp);
        }
        // res.json({data : Storebikeservicedata})
      }
    }
    if (type === "dealer") {
      if (car_brand_id && car_brand_id !== "") {
        console.log("======>fadfdfdff");
        ServiceCenterdata["brand_id"] = car_brand_id.trim();
        ServiceCenterdata["type"] = 2;
        let StoreServicecenterdata = await ServiceCenterDealer.create(
          ServiceCenterdata
        );
        if (StoreServicecenterdata) {
          let resp = utils.encrypt(
            JSON.stringify({
              status: true,
              response_code: 200,
              response_message: "Data Update Successfully!!!",
            }),
            rto
          );
          return res.send(resp);
        }
        // res.json({ data: StoreServicecenterdata });
      }
      if (bike_brand_id && bike_brand_id !== "") {
        ServiceCenterdata["brand_id"] = bike_brand_id.trim();
        ServiceCenterdata["type"] = 1;
        let Storebikeservicedata = await ServiceCenterDealer.create(
          ServiceCenterdata
        );
        if (Storebikeservicedata) {
          let resp = utils.encrypt(
            JSON.stringify({
              status: true,
              response_code: 200,
              response_message: "Data Update Successfully!!!",
            }),
            rto
          );
          return res.send(resp);
        }
        // res.json({ data: Storebikeservicedata});
      }
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
/*****************************************Store Service Center data API nirmal 10-10-2023 END***********************************************************************/

export default {
  get_service_center_brand,
  get_service_center_state_city,
  get_service_center_data,
  store_service_center,
};

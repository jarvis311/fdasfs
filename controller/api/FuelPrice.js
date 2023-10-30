import utils from "../../helpers/utils.js";
import redisClient from "../../config/redis.js";
import FuelState from "../../models/FuelState.js";
import FuelPrice from "../../models/FuelAPI.js";
import { Sequelize, Op } from "sequelize";

const getState_new_auth = async (req, res) => {
  try {
    const rto = req.body.hasOwnProperty("rto");
    if (await redisClient.get("AllFuelstate")) {
      let allstate = await redisClient.get("AllFuelstate");
      if (allstate) {
        console.log("==> data get from the redis");
      }
      let resp = utils.encrypt(
        {
          status: true,
          response_code: 200,
          response_message: "Data get succesfully!!",
          data: JSON.parse(allstate),
        },
        rto
      );
      return res.send(resp);
    } else {
      let Allstate = await FuelState.findAll();
      let Updatedstate = Allstate.map((ele) => {
        return ele.state;
      });

      let storethestate = await redisClient.set(
        "AllFuelstate",
        JSON.stringify(Updatedstate)
      );
      if (storethestate) {
        console.log("==> data stored in the redis");
      }
      let resp = utils.encrypt(
        {
          status: true,
          response_code: 200,
          response_message: "Data Found Sucessfully",
          Data: Updatedstate,
        },
        rto
      );
      return res.send(resp);
    }
  } catch (error) {
    res.send({
      status: false,
      response_code: 400,
      response_message: "Error occured!!",
    });
  }
};

const getFuelData_new_auth = async (req, res) => {
  try {
    let { state } = req.body;
    console.log(state);
    let date = new Date();
    let today = `${date.getFullYear()}-${
      date.getMonth() + 1
    }-${date.getDate()}`;
    let yesterday = `${date.getFullYear()}-${date.getMonth() + 1}-${
      date.getDate() - 1
    }`;
    // let today = "2023-10-04"
    // let yesterday = "2023-10-03"
    const rto = req.body.hasOwnProperty("rto");
    if (await redisClient.get(`city_list_date${today}_${state}`)) {
      let data = await redisClient.get(`city_list_date${today}_${state}`);
      if (data) {
        console.log("==>today s data is get from the redis ");
      }
      let resp = utils.encrypt(
        {
          status: true,
          response_code: 200,
          response_message: "Data Found Successfully!!",
          data: JSON.parse(data),
        },
        rto
      );
      return res.send(resp);
    } else {
      let Fueldata;
      Fueldata = await FuelPrice.findAll({
        where: {
          date: today,
          state: state,
        },
      });
      if (Fueldata.length > 0) {
        let storedata = await redisClient.set(
          `city_list_date${today}_${state}`,
          JSON.stringify(Fueldata)
        );
        if (storedata) {
          console.log("==>today s data is stored in  redis ");
        }
        let resp = utils.encrypt(
          {
            status: true,
            response_code: 200,
            response_message: "Data Found Succesfully!!",
            data: Fueldata,
          },
          rto
        );
        return res.send(resp);
      } else {
        if (await redisClient.get(`city_list_date${yesterday}_${state}`)) {
          let data = await redisClient.get(
            `city_list_date${yesterday}_${state}`
          );
          if (data) {
            console.log("==> yesterday data is get from the redis");
          }
          // await redisClient.del(`city_list_date${yesterday}_${state}`)
          let resp = utils.encrypt(
            {
              status: true,
              response_code: 200,
              response_message: "Data Found succesFully!!",
              data: JSON.parse(data),
            },
            rto
          );
          return res.send(resp);
        } else {
          Fueldata = await FuelPrice.findAll({
            where: {
              date: yesterday,
              state: state,
            },
          });
          if (Fueldata.length > 0) {
            let storedyesterdaydata = await redisClient.set(
              `city_list_date${yesterday}_${state}`,
              JSON.stringify(Fueldata)
            );
            if (storedyesterdaydata) {
              console.log("===> yesterday data is stored in the redis");
            }
            let resp = utils.encrypt(
              {
                status: true,
                response_code: 200,
                response_message: "Data Found Successfully!!",
                data: Fueldata,
              },
              rto
            );
            return res.send(resp);
          } else {
            let resp = utils.encrypt(
              {
                status: false,
                response_code: 400,
                response_message: "Data not Found!!!",
              },
              rto
            );
            return res.send(resp);
          }
        }
      }
    }
  } catch (error) {
    res.send({
      status: false,
      response_code: 400,
      response_message: "Error Occured!!",
    });
  }
};

const petrolHistory = async (req, res) => {
  const rto = req.body.hasOwnProperty("rto");

  try {
    let { state, city, page, limit, all,language_key } = req.body;
    console.log(req.body);
    console.log(req.body);
    if (!city || city == "") {
      let message = await utils.translate('Enter_City',language_key)
      let resp = utils.encrypt(
        {
          status: false,
          response_code: 400,
          response_message: message,
        },
        rto
      );
      return res.send(resp);
    } else if (!state || state == "") {
      let message = await utils.translate('Enter_State',language_key)
      let resp = utils.encrypt(
        {
          status: false,
          response_code: 400,
          response_message: message,
        },
        rto
      );
      return res.send(resp);
    }
    if (limit == undefined) {
      limit = 10;
    }
    page = page > 0 ? parseInt(page) : 1;
    limit = limit !== "" ? parseInt(limit) : 10;
    console.log(limit);
    let offset = limit * (page - 1);
    let date = new Date();
    date.setDate(date.getDate() - 30);

    let queryOptions = {
      where: {
        state: state,
        city: city,
        created_at: {
          [Op.gt]: date,
        },
      },
      order: [["date", "ASC"]],
    };
    let alldata = await FuelPrice.findAll(queryOptions);
    let totalpage = Math.ceil(alldata.length / limit);
    console.log(alldata.length);
    console.log(totalpage);
    console.log(alldata);

    if (!all && all !== "") {
      if (
        await redisClient.get(
          `Petrol_History_${limit}_${page}_${state}_${city}`
        )
      ) {
        let data = await redisClient.get(
          `Petrol_History_${limit}_${page}_${state}_${city}`
        );
        if (data) {
          console.log("==> data is get from the redis with limit and page");
        }
        let resp = utils.encrypt(
          {
            status: true,
            response_code: 200,
            totalpage: totalpage,
            page: page,
            response_message: "Data Found succesfully!!!",
            data: JSON.parse(data),
          },
          rto
        );
        return res.send(resp);
      } else {
        queryOptions.limit = limit;
        queryOptions.offset = offset;

        let fuelhistory = await FuelPrice.findAll(queryOptions);
        let storedata = await redisClient.set(
          `Petrol_History_${limit}_${page}_${state}_${city}`,
          JSON.stringify(fuelhistory)
        );
        if (storedata) {
          console.log("data is stored in the redis with limit and page ");
        }
        let resp = utils.encrypt(
          {
            status: true,
            response_code: 200,
            response_message: "Data Found Succesfully!!",
            data: fuelhistory,
            totalpage: totalpage,
            page: page,
          },
          rto
        );

        return res.send(resp);
      }
    } else {
      if (await redisClient.get(`All_HistoryRecord_${state}_${city}`)) {
        let data = await redisClient.get(`All_HistoryRecord_${state}_${city}`);
        if (data) {
          console.log("data get from redis without limit and offset");
        }
        let resp = utils.encrypt(
          {
            status: true,
            response_code: 200,
            response_message: "Data Found successfully!!!",
            totalpage: totalpage,
            data: JSON.parse(data),
          },
          rto
        );
        return res.send(resp);
      } else {
        let alldata = await FuelPrice.findAll(queryOptions);
        if (alldata.length > 0) {
          let datastore = await redisClient.set(
            "All_HistoryRecord",
            JSON.stringify(alldata)
          );
          if (datastore) {
            console.log(
              "==>All data is store in redis without limit and offset"
            );
          }
          let resp = utils.encrypt(
            {
              status: false,
              response_code: 200,
              response_message: "Data Found succesfully!!",
              totalpage: totalpage,
              data: alldata,
            },
            rto
          );
          return res.send(resp);
        } else {
          let resp = utils.encrypt(
            JSON.stringify({
              status: false,
              response_code: 400,
              response_message: "Data not Found!!!",
            }),
            rto
          );
          return res.send(resp);
        }
      }
    }
  } catch (error) {
    let resp = utils.encrypt(
      JSON.stringify({
        status: false,
        response_code: 400,
        response_message: "Error Occured!!",
      }),
      rto
    );
    return res.send(resp);
  }
};

const getFualPriceByCity = async (req, res) => {
  console.log(req.body);
  try {
    let { city, state } = req.body;
    const rto = req.body.hasOwnProperty("rto");

    console.log(city);
    if (city === undefined || city.length === 0) {
      let resp = utils.encrypt(
        {
          status: false,
          response_code: 400,
          response_message: "Please enter the city!!!",
        },
        rto
      );
      return res.send(resp);
    } else if (state == undefined || state.length === 0) {
      let resp = utils.encrypt(
        {
          status: false,
          response_code: 400,
          response_message: "Please enter the state!!!",
        },
        rto
      );
      return res.send(resp);
    }
    let date = new Date();
    let today = `${date.getFullYear()}-${
      date.getMonth() + 1
    }-${date.getDate()}`;
    let yesterday = `${date.getFullYear()}-${date.getMonth() + 1}-${
      date.getDate() - 1
    }`;
    // let today = "2023-10-04";
    // let yesterday = "2023-10-03";
    //  console.log(today);
    //  console.log(yesterday);]

    if (await redisClient.get(`FuelPricebyCity_${city}_${state}_${today}`)) {
      let data = await redisClient.get(
        `FuelPricebyCity_${city}_${state}_${today}`
      );
      console.log(data);
      if (data) {
        console.log("===>today s data is get from the redis ");
        // let dd =  await redisClient.del(`FuelPricebyCity_${city}_${state}_${today}`)
        //    if (dd) {
        //      console.log('data deleted');
        //    }
      }
      let resp = utils.encrypt(
        {
          status: true,
          response_code: 200,
          response_message: "Data found SuccessFully!!",
          data: JSON.parse(data),
        },
        rto
      );
      return res.send(resp);
    } else {
      let citypricefortoday = await FuelPrice.findAll({
        where: {
          state: state,
          city: city,
          date: today,
        },
      });
      if (citypricefortoday.length > 0) {
        let storeddata = await redisClient.set(
          `FuelPricebyCity_${city}_${state}_${today}`,
          JSON.stringify(citypricefortoday)
        );
        if (storeddata) {
          console.log("===> today s data is stored in the redis");
        }
      }

      if (citypricefortoday.length === 0) {
        if (
          await redisClient.get(`FuelPricebyCity_${city}_${state}_${yesterday}`)
        ) {
          let data = await redisClient.get(
            `FuelPricebyCity_${city}_${state}_${yesterday}`
          );
          if (data) {
            console.log("==> yesterday data is get from the redis");
            // let dell = await redisClient.del(`FuelPricebyCity_${city}_${state}_${yesterday}`)
            //  if (dell) {
            //     console.log('dataa deleted');
            //  }
          }
          let resp = utils.encrypt(
            {
              status: true,
              response_code: 200,
              response_message: "Data Found successFully!!!",
              data: JSON.parse(data),
            },
            rto
          );
          return res.send(resp);
        } else {
          let citypriceForyesterday = await FuelPrice.findAll({
            where: {
              state: state,
              city: city,
              date: yesterday,
            },
          });
          if (citypriceForyesterday.length > 0) {
            console.log("==> yesterday  data found from DB");
            let yest_DataStored = await redisClient.set(
              `FuelPricebyCity_${city}_${state}_${yesterday}`,
              JSON.stringify(citypriceForyesterday)
            );
            if (yest_DataStored) {
              console.log("==> yesterday s data stored in the redis");
            }
            // yesterdays data response
            let resp = utils.encrypt(
              {
                status: true,
                response_code: 200,
                response_message: "Data Found SuccessFully!!!",
                data: citypriceForyesterday,
              },
              rto
            );
            return res.send(resp);
          }

          if (citypriceForyesterday.length === 0) {
            if (
              await redisClient.get(
                `Oldcitypricedata_than_${yesterday}_${city}_${state}`
              )
            ) {
              let data = await redisClient.get(
                `Oldcitypricedata_than_${yesterday}_${city}_${state}`
              );
              await redisClient.del(`Oldcitypricedata_than_${yesterday}_${city}_${state}`)
              if (data) {
                console.log(`===>Olderthan ${yesterday} data get from redis `);
              }
              let resp = utils.encrypt(
                JSON.stringify({
                  status: true,
                  response_code: 200,
                  response_message: "Data Found SuccessFully!!",
                  data: JSON.parse(data),
                }),
                rto
              );

              return res.send(resp);
            } else {
              let old_cityprice = await FuelPrice.findAll({
                where: {
                  state: state,
                  city: city,
                  [Op.not]: {
                    date: date,
                    date: yesterday,
                  },
                },
              });
              if (old_cityprice.length > 0) {
                let storedata = await redisClient.set(
                  `Oldcitypricedata_than_${yesterday}_${city}_${state}`,
                  JSON.stringify(old_cityprice)
                );
                if (storedata) {
                  console.log(
                    "===> previousday or older than previosday data is stored in the redis"
                  );
                }
                console.log(
                  "===>data shown of previousday and older than previousday from the database"
                );
                // data response expect today and yesterday
                let resp = utils.encrypt(
                  {
                    status: true,
                    response_code: 200,
                    response_message: "Data Found succesfully!!",
                    data: old_cityprice,
                  },
                  rto
                );
                return res.send(resp);
              }
            }
          }
        }
      }
      // todays data response
      let resp = utils.encrypt(
        {
          status: true,
          response_code: 200,
          response_message: "Data Found Successfully!!",
          data: citypricefortoday,
        },
        rto
      );
      return res.send(resp);
    }
  } catch (error) {
    res.send({
      status: false,
      response_code: 400,
      response_message: "Error Occured!!",
    });
  }
};

export default {
  getState_new_auth,
  getFuelData_new_auth,
  petrolHistory,
  getFualPriceByCity,
};

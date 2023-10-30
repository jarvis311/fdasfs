import utils from "../../helpers/utils.js";
import redisClient from "../../config/redis.js";
import Trafficstate from "../../models/Trafficestate.js";
import Traffic from "../../models/Traffic.js";
import TrafficRuleLang from "../../models/TrafficRuleLang.js";

const vasu_traffic_fine = async (req, res) => {
  try {
    let { state_code, language_key } = req.body;
    const rto = req.body.hasOwnProperty("rto");
    if (!state_code || state_code == "") {
      let message = await utils.translate('Please_Enter_Valid_Data',language_key)
      let resp = utils.encrypt(JSON.stringify({
        status: false,
        response_code: 400,
        response_message: message,
      }),rto);
      return res.send(resp)
    }
    // console.log(req.body);
    let title;
    let sub_title;
    let content;
    let disclaimer;
    if (language_key !== "" && language_key !== "en" && language_key!==undefined) {
      title = `title_${language_key}`;
      sub_title = `sub_title_${language_key}`;
      content = `content_${language_key}`;
      disclaimer = `disclaimer_${language_key}`;
    } else if(language_key === "" || language_key === "en"){
      language_key="en",
      title = "title",
      sub_title = "sub_title",
      content = "content",
      disclaimer = "disclaimer";
    }else if(language_key===undefined){
      language_key="en",
      title = "title",
      sub_title = "sub_title",
      content = "content",
      disclaimer = "disclaimer";
    }
    let data = await Trafficstate.findOne({
      where: {
        state_code: state_code,
      },
      attributes: [
        "id",
        "state_code",
        `${sub_title}`,
        `${content}`,
        `${disclaimer}`,
        "share_image",
        "share_url",
      ],
      include: [
        {
          model: Traffic,
          as: "fine_data",
          attributes: ["id", "traffic_state_id", "offence", "penalty"],
        },
      ],
    });
    let convert = async (data, language_key) => {
      if (language_key == "en" || language_key == "") {
        return data;
      } else {
        let newword = await TrafficRuleLang.findAll({
          where: {
            lable: data,
          },
          attributes: [`${language_key}`],
        });
        let newone = newword[0][language_key];
        return newone;
      }
    };

    const processTrafficData = async () => {
      if(data ){
        for (const ele of data.fine_data) {
          console.log("=ele.offenceele.offenceele.offenceele.offence",ele.offence);
          ele.offence = await convert(ele.offence, language_key);
          console.log(ele.offence);
          ele.penalty = await convert(ele.penalty, language_key);
        }
        if (await redisClient.get(`traffic_rule${state_code}_${language_key}`)) {
          let data = await redisClient.get(
            `traffic_rule${state_code}_${language_key}`
          );
          if (data) {
            console.log("==>data get from the redis ");
          }
          let resp = utils.encrypt(JSON.parse(data), rto);
          return res.send(resp);
        } else {
          let storeddata = await redisClient.set(
            `traffic_rule${state_code}_${language_key}`,
            JSON.stringify({
              status: true,
              response_code: 200,
              response_message: "Data found succesfully",
              data: data,
            })
          );
          if (storeddata) {
            console.log("==>data is stored in redis ");
          }
          let resp = utils.encrypt(
            {
              status: true,
              response_code: 200,
              response_message: "Data found succesfully",
              data: data,
            },
            rto
          );
          return res.send(resp);
       }

      }
      
    };

    await processTrafficData().catch((error) => {
      return res.send(error);
    });
    console.log("=calllll");
  } catch (error) {
    console.log("===error",error);
    res.send({
      status: false,
      response_code: 400,
      response_message: "Error occured!!",
      errro:error
    });
  }
};

export default {
  vasu_traffic_fine,
};

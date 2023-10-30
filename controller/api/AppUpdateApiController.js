import {
    Op,
    Sequelize,
    where
} from "sequelize"

import AppUpdate from '../../models/AppUpdate.js'
import ServiceCityList from '../../models/ServiceCityList.js'
import Affilation from '../../models/Affilation.js'
import AffiliationPlace from '../../models/AffiliationPlace.js'
import AffilationData from '../../models/AffilationData.js'
import dd from 'dump-die'
import ServiceCategory from "../../models/ServiceCategory.js"
import Language from "../../models/Language.js"
import UserRegistration from "../../models/UserRegistration.js"
import AffiliationServices from "../../models/AffiliationServices.js"
import ServiceProvider from "../../models/ServiceProvider.js"
import NewsCategory from "../../models/NewsCategory.js"
import NewsHeadline from "../../models/NewsHeadline.js"
import Proxy from "../../models/Proxy.js"
import Quora from "../../models/Quora.js"
import QuoraImage from "../../models/QuoraImage.js"
import utils from "../../helpers/utils.js"
import fs from "fs"
import path from 'path'
 import { dirname} from 'path';
 import { fileURLToPath } from 'url';
import Quotes from "../../models/Quotes.js"
import Offer from "../../models/Offer.js"
import AffilationState from "../../models/AffilationState.js"
 const __filename = fileURLToPath(import.meta.url);
 const __dirname = dirname(__filename);

const affilation = async (req,res) =>{
    const input = req.body;
    
    var  show = false;

    if (input.rto && input.rto != "") {
        show = true;
    }
    
    if (!input.package_name || input.package_name == '') {
        const response = {
        response_code: 400,
        response_message: 'Package Name Field Required',
        };

        let responseData = utils.encrypt(response,show)
         return res.send(responseData)
    }

    if (!input.version_code || input.version_code == '') {
        const response = {
        response_code: 400,
        response_message: 'Version Code Field Required',
        };

        let responseData = utils.encrypt(response,show)
         return res.send(responseData)
        
    }

    const type = input.type || '';
    const appUpdate = await AppUpdate.findOne({ where: { package_name: input.package_name } });
    
    if (!appUpdate) {
        const response = {
        response_code: 404,
        response_message: 'No data found',
        };
        let responseData = utils.encrypt(response,show)
        return res.send(responseData)
    }

    const lang = input.language_key && input.language_key !== false ? input.language_key.toLowerCase() : 'en';
      
      if (input.user_id && input.user_id !== false) {
        UserRegistration.update(
          { language_key: lang }, // The values to update
          { where: { id: input.user_id } } // The condition to find the user
        )
    }
    if (!input.city_id) {
        const response = {
        response_code: 400,
        response_message: 'city_id Field Required',
        };
        let responseData = utils.encrypt(response,show)
        return res.send(responseData)
    }

    const city_id = input.city_id || '0';
    const city_id_all = 'ALL';
  
    // Find all ServiceCityList records that match city_id or city_id_all
    const cityList = await ServiceCityList.findAll({
        attributes: ['affiliation_services_id', 'service_provider_id'],
        where: {
          deleted_at: null ,
          [Op.or]: [
            Sequelize.literal(`FIND_IN_SET(${city_id}, city_id)`),
            Sequelize.literal(`FIND_IN_SET('${city_id_all}', city_id)`),
          ],
        },
      });

       // Extract the values of affiliation_services_id and service_provider_id into separate arrays
       const affiliation_services_id_arr = cityList.map((city) => city.affiliation_services_id);
       const service_provider_id_arr = cityList.map((city) => city.service_provider_id);
       var AffiationProviderArray = Array()
       cityList.forEach((singleCity) => {
         // Create an object with 'sp_id' and 'as_id' properties
         const provider = {
           sp_id: singleCity.service_provider_id,
           as_id: singleCity.affiliation_services_id,
         };
       
         // Check if the provider object already exists in 'AffiationProviderArray'
         const exists = AffiationProviderArray.some((existingProvider) => {
           return (
             existingProvider.sp_id === provider.sp_id &&
             existingProvider.as_id === provider.as_id
           );
         });
       
         // If the provider is not already in the array, push it
         if (!exists) {
           AffiationProviderArray.push(provider);
         }
       });
      
       var affilation_place = Array();
       const placeArr = await AffiliationPlace.findAll({
         where: {
           place: ['service','slider','rc_details','home_slider','rc_car_slider','rc_bike_slider','dl_bike_slider','dl_car_slider','challan_slider','ds_slider'],
         },
         attributes: ['id', 'place'],
         raw: true,
       });
      

       const placeArrNew = placeArr.reduce((result, item) => {
         result[item.place] = item.id;
         return result;
       }, {});

      
      if (placeArrNew.hasOwnProperty('service')) {
        affilation_place.push(placeArrNew['service']);
        var place_id = placeArrNew['service'];
      }
      if (placeArrNew.hasOwnProperty('slider')) {
        affilation_place.push(placeArrNew['slider']);
        var slider_id = placeArrNew['slider'];
      }

      if (placeArrNew.hasOwnProperty('rc_details')) {
        affilation_place.push(placeArrNew['rc_details']);
        var rc_details = placeArrNew['rc_details'];
      }

      if (placeArrNew.hasOwnProperty('home_slider')) {
        affilation_place.push(placeArrNew['home_slider']);
        var home_slider_id = placeArrNew['home_slider'];
      }

      if (placeArrNew.hasOwnProperty('rc_car_slider')) {
        affilation_place.push(placeArrNew['rc_car_slider']);
        var car_slider_id = placeArrNew['rc_car_slider'];
      }

      if (placeArrNew.hasOwnProperty('rc_bike_slider')) {
        affilation_place.push(placeArrNew['rc_bike_slider']);
        var bike_slider_id = placeArrNew['rc_bike_slider'];
      }

      if (placeArrNew.hasOwnProperty('dl_bike_slider')) {
        affilation_place.push(placeArrNew['dl_bike_slider']);
        var dl_bike_slider_id = placeArrNew['dl_bike_slider'];
      }

      if (placeArrNew.hasOwnProperty('dl_car_slider')) {
        affilation_place.push(placeArrNew['dl_car_slider']);
        var dl_car_slider_id = placeArrNew['dl_car_slider'];
      }

      if (placeArrNew.hasOwnProperty('challan_slider')) {
        affilation_place.push(placeArrNew['challan_slider']);
        var challan_slider_id = placeArrNew['challan_slider'];
      }
      if (placeArrNew.hasOwnProperty('ds_slider')) {
        affilation_place.push(placeArrNew['ds_slider']);
        var ds_slider_id = placeArrNew['ds_slider'];
      }
       //return res.json(service_provider_id_arr)
       //return res.json(affilation_place)
      const affilation_program = await Affilation.findAll({
        where: {
          affiliation_place_id : {
            [Sequelize.Op.notIn]: affilation_place,
          },
        },
         include: [
          {
            model: AffilationData,
            as: 'get_affiliation_data_affilate',
            include: [
              {
                 model: AffiliationServices,
                 as: 'get_affiliation_services',
               },
               {
                 model: ServiceProvider,
                 as: 'get_service_provider_name',
               },
             ],
             where: {
               service_provider_id: service_provider_id_arr,
               affiliation_services_id: affiliation_services_id_arr,
               deleted_at:null
             },
             limit:1,
             order: Sequelize.fn('RAND'),
           },
           {
               model: AffiliationPlace,
               as:'get_affiliation_place',
               attributes: ['id', 'place'],
               where:{
                 deleted_at:null
               }
           },
         ],
        order: [['id', 'ASC']],
        attributes: ['affiliation_place_id', 'is_need_to_show', 'id', 'service_category_id'],
      });
    
     
     
      var arrayNew = Array();
      for (const program of affilation_program) {
        var affilateData = program.get_affiliation_data_affilate[0]; // Assuming your Sequelize model uses camelCase instead of snake_case
       
        if (!affilateData) {
          const defaultData = await AffilationData.findOne({
            where: {
              affiliate_id: program.id,
              is_default: 1,
              status: 1,
              deleted_at:null
            },
          });
          if (defaultData) {
            affilateData = defaultData;
          }
        }
        else{
          const affilate_priority_data = await AffilationData.findOne({
            where: {
              affiliate_id: program.id,
              is_default: 0,
              is_priority:1,
              status: 1,
              deleted_at:null
            },
          });
          if (affilate_priority_data) {
            affilateData = defaultData;
          }
        }
       
        if (affilateData) {
          const place = program.get_affiliation_place.place; // Assuming the association is named 'AffiliationPlace'
        
          const serviceProviderName = affilateData.get_service_provider_name.provider; // Adjust to your model structure
          
          if (type === 'ios' && serviceProviderName === 'rapido') {
            continue;
          }
      
          let isNeedToShow;
          if (type !== 'ios' && input.version_code >= 10.06 && (place === 'home_bike' || place === 'home_car')) {
            isNeedToShow = false;
          } else {
            isNeedToShow = check_boolean(program.is_need_to_show);
          }
      
          const temp = {
            is_need_to_show: isNeedToShow,
            banner: affilateData.banner || '',
            url: affilateData.url || '',
            utm_term: affilateData.utm_term || '',
            lable: affilateData.lable ? await language(lang, affilateData.lable) : '',
            service: affilateData.get_affiliation_services.services
              ? affilateData.get_affiliation_services.services.replace(/ /g, '_').toLowerCase()
              : '',
            service_provider: affilateData.get_service_provider_name.provider
              ? affilateData.get_service_provider_name.provider.replace(/ /g, '_').toLowerCase()
              : '',
          };
      
          const arrayPlace = {
            place: place,
            place_data: temp,
          };
          arrayNew.push(arrayPlace);
        }
      }
     
      var rcDetailsArray = [];
      const rcDetailsProgram = await Affilation.findAll({
        where: {
          affiliation_place_id: rc_details,
        },
        include: [
          {
            model: AffilationData,
            as: 'get_affiliation_data',
            where: {
              service_provider_id: { [Op.in]: service_provider_id_arr },
              affiliation_services_id: { [Op.in]: affiliation_services_id_arr },
            },
           
          },
        ],
        order: [['id', 'ASC'],[Sequelize.fn('RAND')],[ Sequelize.col('get_affiliation_data.position', 'ASC') ]],
        attributes: ['is_need_to_show', 'id', 'service_category_id'],
      });

      //return res.json(rcDetailsProgram);
      

      if (rcDetailsProgram.length !== 0 && rc_details) {
        for (const program of rcDetailsProgram) {
          const affilateData = program.get_affiliation_data;
          var rcDetailsData = [];
      
          if (affilateData.length !== 0) {
            for (const data of affilateData) {
              if (data.status) {
                const rc = {
                  is_need_to_show: check_boolean(program.is_need_to_show),
                  banner: data.banner || '',
                  url: data.url || '',
                  utm_term: data.utm_term || '',
                  lable: data.lable ? await language(lang, data.lable) : '',
                  title: data.title ? await language(lang, data.title) : '',
                  description: data.description ? await language(lang, data.description) : '',
                  action_button: data.action_button ? await language(lang, data.action_button) : '',
                  rc_image: data.rc_image || '',
                };
                rcDetailsData.push(rc);
              }
            }
          } else {
            const data = await AffilationData.findOne({
              where: {
                affiliate_id: program.id,
                is_default: 1,
                status: 1,
              },
            });
      
            if (data) {
              const rc = {
                is_need_to_show: check_boolean(program.is_need_to_show),
                banner: data.banner || '',
                url: data.url || '',
                utm_term: data.utm_term || '',
                lable: data.lable ? await language(lang, data.lable) : '',
                title: data.title ? await language(lang, data.title) : '',
                description: data.description ? await language(lang, data.description) : '',
                action_button: data.action_button ? await language(lang, data.action_button) : '',
                rc_image: data.rc_image || '',
              };
              rcDetailsData.push(rc);
            }
          }
      
          rcDetailsArray = rcDetailsData;
        }
      }

  if (home_slider_id) {
    const serviceProgram = await Affilation.findAll({
      where: {
        affiliation_place_id: home_slider_id,
      },
      include: [
        {
          model: AffilationData,
          as: 'get_affiliation_data',
        },  
      ],
      order: [['id', 'ASC'],[Sequelize.fn('RAND')],[ Sequelize.col('get_affiliation_data.position', 'ASC') ]],
      attributes: ['is_need_to_show', 'id', 'service_category_id'],
    });

    if (serviceProgram.length !== 0) {
      for (const program of serviceProgram) {
        var groupIds = [];
        var affilateData = program.get_affiliation_data;
        var homeSliderData = [];

        const affiationPriorityServiceProviderArray = [];
        const affiationPriorityServiceIdArray = [];

        for (const singleValue of affilateData) {
          for (const singleAffilation of AffiationProviderArray) {
            if (
              singleAffilation.sp_id === singleValue.service_provider_id &&
              singleAffilation.as_id === singleValue.affiliation_services_id
            ) {
              affiationPriorityServiceProviderArray.push(singleValue.service_provider_id);
              affiationPriorityServiceIdArray.push(singleValue.affiliation_services_id);
            }
          }
        }

        var homeSliderData = Array();

      
        for (const datas of affilateData) {
          const data = await AffilationData.findOne({
            where: {
              affiliate_id: program.id,
              group_id: datas.group_id,
              status: 1,
              is_default: 0,
              deleted_at:null,
            },
          });

          if (data) {
            var service_provider_id = null;
            var affiliation_services_id = null;

            for (const singleAffilation of AffiationProviderArray) {
              if (
                singleAffilation.sp_id === data.service_provider_id &&
                singleAffilation.as_id === data.affiliation_services_id
              ) {
                service_provider_id = affiationPriorityServiceProviderArray.includes(data.service_provider_id);
                affiliation_services_id = affiationPriorityServiceIdArray.includes(data.affiliation_services_id);
                break;
              }
            }
          }
            if (affiliation_services_id && service_provider_id && data.status) {
              var checkGroupId = groupIds.includes(data.group_id);
              if (checkGroupId) {
                continue;
              }

              groupIds.push(data.group_id);
              const service = {
                is_need_to_show: check_boolean(program.is_need_to_show),
                banner: data.banner || '',
                url: data.url || '',
                utm_term: data.utm_term || '',
                lable: data.lable ? await language(lang, data.lable) : '',
              };
              homeSliderData.push(service);
            }
        else {
            const defaultData = await AffilationData.findOne({
              where: {
                affiliate_id: program.id,
                group_id: datas.group_id,
                status: 1,
                is_default: 1,
                deleted_at:null,
              },
            });

            if (defaultData) {
              var checkGroupId = groupIds.includes(defaultData.group_id);
              if (checkGroupId) {
                continue;
              }

              groupIds.push(defaultData.group_id);
              const service = {
                is_need_to_show: check_boolean(program.is_need_to_show),
                banner: defaultData.banner || '',
                url: defaultData.url || '',
                utm_term: defaultData.utm_term || '',
                lable: defaultData.lable ? await language(lang, defaultData.lable) : '',
              };
              homeSliderData.push(service);
            }
          }
        }
      }
    }
  }

  const newsCategory = await NewsCategory.findOne({ attributes: ['id'] });

    if(newsCategory)
    {
        var newsData = await NewsHeadline.findAll({
          attributes:[
            'id','category_id','title','description', 'date', 'image', 'status','news_url'
          ],
          where: {
            category_id: newsCategory.id,
            status: 1,
          },
          limit: 2,
          order: [['created_at', 'DESC']],
        });
        
        if (newsData.length === 0) {
          var newsData = Array();
        }
    }
    else{
      var newsData = Array();
    }
          
    if (input.version_code  < appUpdate.version_code){
      var response_message = "Your current version not match with minimum version";
      var is_need_to_update = true;
  }else{
      var response_message = "Your current version match with minimum version";
      var is_need_to_update = false;
  }

  if(type == 'ios')
  {
    var proxyData = await Proxy.findOne({
      attributes: [
        ['otp_verify_ios', 'otp_verify'],
        ['hard_otp_verify_ios', 'hard_otp_verify'],
        'parivahan_dl',
      ],
    });
  }
  else{
    var proxyData = await Proxy.findOne({
      attributes: [
        ['otp_verify_android', 'otp_verify'],
        ['hard_otp_verify_android', 'hard_otp_verify'],
        'parivahan_dl',
      ],
    });
  }

    var staticArray = {};
    const staticArray1 = {};
    staticArray['response_msg_key'] = ["msg", "message"];
    if (type === "ios" || (type === "android" && input.version_code >= 10.07)) {
      staticArray['not_register'] = ["Your mobile number is not registered with us. Please Sign Up!"];
      staticArray['otp_sent_success'] = ["OTP sent successfully."];
      staticArray['otp_limit_exceed'] = ["Otp Limit (6) Exceeded For Today!"];
      staticArray['invalid_otp'] = ["Please Enter a Valid OTP."];
      staticArray['login_success'] = ["Login Successfully."];
      staticArray['invalid_auth_key'] = ["Invalid Authentication Key"];
      staticArray['no_rc_found'] = ["No RC details found against the searched RC NUMBER"];
      staticArray['maximum_search_limit'] = ["The maximum daily limit for vehicle searches has been reached."];
      staticArray['session_timeout'] = ["Session Timeout. Please Login."];
      staticArray['rc_data_found'] = ["Data Found Successfully"];
      staticArray['otp_verify_limit_exceed'] = ["Verify OTP Limit Exceeded For Today!"];
      staticArray['invalid_token_key'] = ["Invalid Token Key"];
    } else {
      staticArray['not_register'] = "Your mobile number is not registered with us. Please Sign Up!";
      staticArray['otp_sent_success'] = "OTP sent successfully.";
      staticArray['otp_limit_exceed'] = "Otp Limit (6) Exceeded For Today!";
      staticArray['invalid_otp'] = "Please Enter a Valid OTP.";
      staticArray['login_success'] = "Login Successfully.";
      staticArray['invalid_auth_key'] = "Invalid Authentication Key";
      staticArray['no_rc_found'] = "No RC details found against the searched RC NUMBER";
      staticArray['maximum_search_limit'] = "The maximum daily limit for vehicle searches has been reached.";
      staticArray['session_timeout'] = "Session Timeout. Please Login.";
      staticArray['rc_data_found'] = "Data Found Successfully";
      staticArray['otp_verify_limit_exceed'] = "Verify OTP Limit Exceeded For Today!";
      staticArray['invalid_token_key'] = "Invalid Token Key";
    }


    const sliderListArray = [
      'dl_bike_slider_id',
      'dl_car_slider_id',
      'challan_slider_id',
      'bike_slider_id',
      'car_slider_id',
      'ds_slider_id'
    ];
    
    var sliderDataArrays = {};
    for (const sliderName of sliderListArray) {
      if (sliderName) {
       // sliderDataArrays[sliderName] = await fetchSliderData(eval(sliderName));

        const affilationProgram = await Affilation.findAll({
          where: {
            affiliation_place_id: eval(sliderName), // Assuming sliderName is an array of place IDs
          },
          include: [
            {
              model: AffilationData,
              as: 'get_affiliation_data',
              where: {
                status: 1,
              },
              
            },
          ],
          order: [['id', 'ASC'],[Sequelize.fn('RAND')],[ Sequelize.col('get_affiliation_data.position', 'ASC') ]],
          attributes: ['is_need_to_show', 'id', 'service_category_id'],
        });
        
        const sliderData = [];

        for (const program of affilationProgram) {
          const affilateData = program.get_affiliation_data;
      
          if (affilateData.length > 0) {
            for (const data of affilateData) {
              if (data.status) {
                for (const singleAffilation of AffiationProviderArray) {
                  if (
                    singleAffilation.sp_id === data.service_provider_id &&
                    singleAffilation.as_id === data.affiliation_services_id
                  ) {
                    const slider = {
                      is_need_to_show: check_boolean(program.is_need_to_show),
                      banner: data.banner || '',
                      url: data.url || '',
                      utm_term: data.utm_term || '',
                      lable: data.lable
                        ? await language(lang, data.lable)
                        : '',
                    };
                    sliderData.push(slider);
                  }
                }
              }
            }
          } else {
            const data = await AffilationData.findOne({
              where: {
                affiliate_id: program.id,
                is_default: 1,
                status: 1,
              },
            });
      
            if (data) {
              const slider = {
                is_need_to_show: check_boolean(program.is_need_to_show),
                banner: data.banner || '',
                url: data.url || '',
                utm_term: data.utm_term || '',
                lable: data.lable ? await language(lang, data.lable) : '',
              };
              sliderData.push(slider);
            }
          }
        }
        sliderDataArrays[sliderName] =sliderData;
      }
    }
   
    const quoraAdsData = await Quora.findAll({
      where:{
        deleted_at:null,
      },
      attributes: ['id', 'name', 'link'],
      include: [
        {
          model: QuoraImage,
          as: 'qureka_ads_image',
          attributes: ['id', 'image','qureka_ads_id'],
          where:{
            deleted_at:null
          }
        },
      ],
    })
      
  // Load JSON data from a file
  const nameJson = fs.readFileSync('public/json/indianName.json', 'utf8');
  const nameArray = JSON.parse(nameJson);
  // Generate a random number
  const randomNumber = Math.floor(Math.random() * 14000);

  // Get a random name
  const randomName = nameArray[randomNumber];
  const quotes = await Quotes.findAll({
    attributes: [[Sequelize.col(lang), 'quotes']],
    order: Sequelize.literal('RAND()'), // Random order for random quotes
    limit: 10,
  });
  
    const jsonArray = {
      status: true,
      response_code: 200,
      response_message: response_message,
      current_version: appUpdate.current_version,
      is_need_to_update: is_need_to_update,
      start_io_ads_enable:  await check_boolean(appUpdate.start_io_ads_enable),
      otp_verify: proxyData.dataValues.otp_verify === 1,
      hard_otp_verify: proxyData.dataValues.hard_otp_verify === 1,
      parivahan_dl: proxyData.dataValues.parivahan_dl === 1 ,
      parkplus_enable: false,
      parkplus_fasttag_amount: 140,
      affilation_place_program: arrayNew,
      rc_details: rcDetailsArray,
      rc_car_slider: sliderDataArrays['car_slider_id'],
      rc_bike_slider: sliderDataArrays['bike_slider_id'],
      home_slider: homeSliderData,
      dl_bike_slider:  sliderDataArrays['dl_bike_slider_id'],
      dl_car_slider: sliderDataArrays['dl_car_slider_id'],
      challan_slider: sliderDataArrays['challan_slider_id'],
      ds_slider: sliderDataArrays['ds_slider_id'],
      news_data: newsData,
      parivahan_response_data: staticArray,
      quotes_data: quotes,
      user_name: randomName.name,
      qureka_ads: quoraAdsData,
      is_need_to_show_rto: false,
      ng_version_name: "2.0.109",
  };
  
  let responseData = utils.encrypt(jsonArray,show)
  return res.send(responseData)
  //return res.json(jsonArray)

}

async function fetchSliderData(sliderName) {
  const affilationProgram = await Affilation.findAll({
    where: {
      affiliation_place_id: sliderName, // Assuming sliderName is an array of place IDs
    },
    include: [
      {
        model: AffilationData,
        as: 'get_affiliation_data',
        where: {
          status: 1,
        },
      },
    ],
    order: [['id', 'ASC'],[Sequelize.fn('RAND')]],
    attributes: ['is_need_to_show', 'id', 'service_category_id'],
  });
  
  const sliderData = [];

  for (const program of affilationProgram) {
    const affilateData = program.get_affiliation_data;

    if (affilateData.length > 0) {
      for (const data of affilateData) {
        if (data.status) {
          for (const singleAffilation of AffiationProviderArray) {
            if (
              singleAffilation.sp_id === data.service_provider_id &&
              singleAffilation.as_id === data.affiliation_services_id
            ) {
              const slider = {
                is_need_to_show: check_boolean(program.is_need_to_show),
                banner: data.banner || '',
                url: data.url || '',
                utm_term: data.utm_term || '',
                lable: data.lable
                  ? language(lang, data.lable)
                  : '',
              };
              sliderData.push(slider);
            }
          }
        }
      }
    } else {
      const data = await AffilationData.findOne({
        where: {
          affiliate_id: program.id,
          is_default: 1,
          status: 1,
        },
      });

      if (data) {
        const slider = {
          is_need_to_show: check_boolean(program.is_need_to_show),
          banner: data.banner || '',
          url: data.url || '',
          utm_term: data.utm_term || '',
          lable: data.lable ? language(lang, data.lable) : '',
        };
        sliderData.push(slider);
      }
    }
  }

  return sliderData;
}

 const services = async (req,res)=>{
    const input = req.body;
    let show = false;

    if (input.rto) {
        show = true;
    }

    if (!input.package_name || input.package_name == '') {
        const response = {
        response_code: 400,
        response_message: 'Package Name Field Required',
        };
          let responseData = utils.encrypt(response,show)
          return res.send(responseData)
    }

    if (!input.version_code || input.version_code == '') {
        const response = {
        response_code: 400,
        response_message: 'Version Code Field Required',
        };
        let responseData = utils.encrypt(response,show)
          return res.send(responseData)
    }

    const type = input.type || '';
    const appUpdate = await AppUpdate.findOne({ where: { package_name: input.package_name } });
    
    if (!appUpdate) {
        const response = {
        response_code: 404,
        response_message: 'No data found',
        };
        let responseData = utils.encrypt(response,show)
          return res.send(responseData)
    }

    const lang = input.language_key && input.language_key !== false ? input.language_key.toLowerCase() : 'en';
    
    if (!input.city_id) {
        const response = {
        response_code: 400,
        response_message: 'city_id Field Required',
        };
        let responseData = utils.encrypt(response,show)
          return res.send(responseData)
    }

    const city_id = input.city_id || '0';
    const city_id_all = 'ALL';
   
    // Find all ServiceCityList records that match city_id or city_id_all
    const cityList = await ServiceCityList.findAll({
        attributes: ['affiliation_services_id', 'service_provider_id'],
        where: {
          deleted_at: null ,
          [Op.or]: [
            Sequelize.literal(`FIND_IN_SET(${city_id}, city_id)`),
            Sequelize.literal(`FIND_IN_SET('${city_id_all}', city_id)`),
          ],
        },
      });
    
      // Extract the values of affiliation_services_id and service_provider_id into separate arrays
      const affiliation_services_id_arr = cityList.map((city) => city.affiliation_services_id);
      const service_provider_id_arr = cityList.map((city) => city.service_provider_id);
      var AffiationProviderArray = Array()
      cityList.forEach((singleCity) => {
        // Create an object with 'sp_id' and 'as_id' properties
        const provider = {
          sp_id: singleCity.service_provider_id,
          as_id: singleCity.affiliation_services_id,
        };
      
        // Check if the provider object already exists in 'AffiationProviderArray'
        const exists = AffiationProviderArray.some((existingProvider) => {
          return (
            existingProvider.sp_id === provider.sp_id &&
            existingProvider.as_id === provider.as_id
          );
        });
      
        // If the provider is not already in the array, push it
        if (!exists) {
          AffiationProviderArray.push(provider);
        }
      });
      
    
      const placeArr = await AffiliationPlace.findAll({
        where: {
          place: ['service', 'slider', 'rc_details'],
        },
        attributes: ['id', 'place'],
        raw: true,
      });
     
      const placeId = placeArr.reduce((result, item) => {
        result[item.place] = item.id;
        return result;
      }, {});
    
      
  
      
      const serviceProgram = await Affilation.findAll({
        where: {
          affiliation_place_id: [placeId['service']],
        },
        attributes: ['is_need_to_show', 'id', 'service_category_id'],
        include: [{
          model: AffilationData,
          as: 'get_affiliation_data_group_wise',
        },{
          model:ServiceCategory,
          as:'get_name'
        }],
        order: [['id', 'ASC'],[ Sequelize.fn('RAND') ]],
        
      });
     
      const priotityArray = [];
      const withoutpriotityArray = [];
      var serviceArray = [];
      
      if (serviceProgram.length > 0) {
        for (const program of serviceProgram) {
            const categoryGroupData = await AffilationData.findAll({
                attributes: [[Sequelize.fn('DISTINCT', Sequelize.col('group_id')), 'group_id']],
                where: {
                  affiliate_id: program.id,
                },
              })
              let categoryGroup = categoryGroupData.map((s) => s.group_id)
              
          const uniqueGroup = [];
          const groupId = [];
          const affilateData = program.get_affiliation_data_group_wise;
        
          const AffiationPriorityServiceProviderArray = [];
          const AffiationPriorityServiceIdArray = [];
      
          for (const singleValue of affilateData) {
            const uniqueGroupId = uniqueGroup.includes(singleValue.group_id);
           
            if (!uniqueGroupId) {
              uniqueGroup.push(singleValue.group_id);
            }
            
            if (singleValue.is_priority === 1) {
              for (const singleAffilation of AffiationProviderArray) {
                if (singleAffilation.sp_id === singleValue.service_provider_id && singleAffilation.as_id === singleValue.affiliation_services_id)
                {
                  priotityArray.push(singleValue);
                  AffiationPriorityServiceProviderArray.push(singleValue.service_provider_id);
                  AffiationPriorityServiceIdArray.push(singleValue.affiliation_services_id);
                }
              }
            } else {
              for (const singleAffilation of AffiationProviderArray) {
                if (singleAffilation.sp_id === singleValue.service_provider_id && singleAffilation.as_id === singleValue.affiliation_services_id)
                {
                  withoutpriotityArray.push(singleValue);
                  AffiationPriorityServiceProviderArray.push(singleValue.service_provider_id);
                  AffiationPriorityServiceIdArray.push(singleValue.affiliation_services_id);
                }
              }
            }
          }
         
          var serviceData = [];
          for (const data of affilateData) {
            const resultSericeData = await processAffilateData(data, priotityArray, AffiationPriorityServiceProviderArray, AffiationPriorityServiceIdArray,groupId,program,type);
          
            if (resultSericeData) {
              serviceData.push(resultSericeData);
            }
        }
     
        const missingGroup = categoryGroup.filter(group => !uniqueGroup.includes(group));
      
        if (missingGroup.length > 0) {
          for (const singleMissingGroupValue of missingGroup) {
            const data = await AffilationData.findOne({
              attributes: [
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
                'is_default'
              ],
              where: {
                affiliate_id: program.id,
                group_id: singleMissingGroupValue,
                is_default: 1,
                status: 1,
                deleted_at:null,
              }
            });
         
            if (data) {
              const service = {
                is_need_to_show: await check_boolean(program.is_need_to_show),
                banner: data.banner || '',
                url: data.url || '',
                utm_term: data.utm_term || '',
                lable: data.lable ? await language(lang, data.lable) : ''
              };

              serviceData.push(service);
            }
          }
        }

        // Default Value Record Show End
        if (serviceData.length > 0) {
          const service_arrayss = {
            service_lable: program.get_name.category,
            service_data: serviceData
          };
          serviceArray.push(service_arrayss);
        }

        
      }
      
      const slider_array = [];
    
      const sliderProgram = await Affilation.findAll({
        where: {
          affiliation_place_id: placeId['slider']
        },
        attributes: ['is_need_to_show', 'id', 'service_category_id',],
        include: [
          {
            model: AffilationData,
            as: 'get_affiliation_data',
            where: {
              service_provider_id: service_provider_id_arr,
              affiliation_services_id: affiliation_services_id_arr
            }
          },
          {
            model: AffiliationPlace,
            as:'get_affiliation_place',
            attributes: ['id', 'place']
          }
        ],
        order: [['id', 'ASC'],[Sequelize.fn('RAND')],[ Sequelize.col('get_affiliation_data.position', 'ASC') ]]
      });
   
    
      for (const program of sliderProgram) {
        const affilate_data = program.get_affiliation_data;
        const slider_data = [];
  
        if (affilate_data.length > 0) {
          
            for (const data of affilate_data) {
            for (const singleAffilation of AffiationProviderArray) {
              if (
                singleAffilation.sp_id === data.service_provider_id &&
                singleAffilation.as_id === data.affiliation_services_id
              ) {
             
                const slider = {
                  is_need_to_show: await check_boolean(program.is_need_to_show),
                  banner: data.banner || '',
                  url: data.url || '',
                  utm_term: data.utm_term || '',
                  lable: data.lable ?  await language(lang, data.lable) : '',
                };
                slider_data.push(slider);
              }
            }
          };
        } else {
          // If there is no affilate_data, fetch data from AffiliationData
          AffilationData.findOne({
            where: {
              affiliate_id: program.id,
              is_default: 1,
              status: 1,
            },
          })
            .then(async(data) => {
              if (data) {
                const slider = {
                  is_need_to_show: await check_boolean(program.is_need_to_show),
                  banner: data.banner || '',
                  url: data.url || '',
                  utm_term: data.utm_term || '',
                  lable: data.lable ?  await language(lang, data.lable) : '',
                };
                slider_data.push(slider);
              }
            })
            .catch((error) => {
              console.error(error);
            });
        }
  
        slider_array.push(slider_data);
      };

    const response = {
        status: true,
        response_code: 200,
        response_message: 'Service Affilation Found Succesfully',
        service_program: serviceArray,
        slider_program: slider_array,
    };

    let responseData = utils.encrypt(response,show)
          return res.send(responseData)
   //return  res.json(response);
}

async function processAffilateData(data, priotityArray, AffiationPriorityServiceProviderArray, AffiationPriorityServiceIdArray,groupId,program,type) {
    let service_provider_id = null;
    let affiliation_services_id = null;

    if (priotityArray.some((item) => {
      return (
        item.group_id === data.group_id &&
        item.is_priority === 1 &&
        item.service_provider_id === data.service_provider_id &&
        item.affiliation_services_id === data.affiliation_services_id
      );
    }) &&
      AffiationPriorityServiceProviderArray.includes(data.service_provider_id) &&
      AffiationPriorityServiceIdArray.includes(data.affiliation_services_id)
    ) {
      service_provider_id = AffiationPriorityServiceProviderArray.includes(data.service_provider_id);
      affiliation_services_id = AffiationPriorityServiceIdArray.includes(data.affiliation_services_id);
    } else {
      if (withoutpriotityArray.some((item) => {
        return (
          item.group_id === data.group_id &&
          item.is_priority === 0 &&
          item.service_provider_id === data.service_provider_id &&
          item.affiliation_services_id === data.affiliation_services_id
        );
      }) &&
        AffiationPriorityServiceProviderArray.includes(data.service_provider_id) &&
        AffiationPriorityServiceIdArray.includes(data.affiliation_services_id)
      ) {
        service_provider_id = AffiationPriorityServiceProviderArray.includes(data.service_provider_id);
        affiliation_services_id = AffiationPriorityServiceIdArray.includes(data.affiliation_services_id);
      }
    }

    if (affiliation_services_id && service_provider_id && data.status) {
      const check_group_id = groupId.includes(data.group_id);
  
      if (check_group_id) {
        return;
      }
  
      if (priotityArray.some((item) => item.group_id === data.group_id)) {
        if (data.is_priority === 1) {
          groupId.push(data.group_id);
          // if (type === "ios" && data.get_service_provider_name.provider === 'rapido') {
          //   return;
          // }
  
          const service = {
            is_need_to_show: await check_boolean(program.is_need_to_show),
            banner: data.banner || '',
            url: data.url || '',
            utm_term: data.utm_term || '',
            lable: data.lable ?  await language(lang, data.lable) : '',
          };
          //service_data.push(service);
          return service;
        } else {
          return;
        }
      } else {
        groupId.push(data.group_id);
        // if (type === "ios" && data.get_service_provider_name.provider === 'rapido') {
        //   return;
        // }
  
        const service = {
          is_need_to_show: await check_boolean(program.is_need_to_show),
          banner: data.banner || '',
          url: data.url || '',
          utm_term: data.utm_term || '',
          lable: data.lable ? await language(lang, data.lable) : '',
        };
        return service;
        
      }
    } else {
      const dataItem = await AffilationData.findOne({
        where: {
          affiliate_id: program.id,
          group_id: data.group_id,
          status: 1,
          is_default: 1,
        },
      });
  
      if (dataItem) {
        const check_group_id = groupId.includes(data.group_id);
  
        if (check_group_id) {
          return;
        }
  
        const service = {
          is_need_to_show: await check_boolean(program.is_need_to_show),
          banner: dataItem.banner || '',
          url: dataItem.url || '',
          utm_term: dataItem.utm_term || '',
          lable: dataItem.lable ? await language(lang, dataItem.lable) : '',
        };
        return service;
      }
    }

    return null;
  }
}
async function check_boolean(value) {
  return value === 1;
}

const offer = async (req,res) => {
    const input = req.body;
      
    var  show = false;

    if (input.rto || input.rto != "") {
        show = true;
    }
    
    if (!input.package_name || input.package_name == '') {
        const response = {
        response_code: 400,
        response_message: 'Package Name Field Required',
        };

        let responseData = utils.encrypt(response,show)
        return res.send(responseData)
    }

    if (!input.version_code || input.version_code == '') {
        const response = {
        response_code: 400,
        response_message: 'Version Code Field Required',
        };

        let responseData = utils.encrypt(response,show)
        return res.send(responseData)
        
    }

    const type = input.type || '';
    const appUpdate = await AppUpdate.findOne({ where: { package_name: input.package_name } });
    
    if (!appUpdate) {
        const response = {
        response_code: 404,
        response_message: 'No data found',
        };
        let responseData = utils.encrypt(response,show)
        return res.send(responseData)
    }

    const lang = input.language_key && input.language_key !== false ? input.language_key.toLowerCase() : 'en';

    const offerArray = await Offer.findAll({
      attributes: [
        'lable',
        'description',
        'percentage',
        'code',
        'url',
        'utm_term',
        'color_code',
        'image',
        'action_button',
      ],
      where: {
        status: 1,
      },
    });

    const updatedOfferArray = offerArray.map(async (offer) => {
      offer.lable = await language(lang, offer.lable);
      offer.description = await language(lang, offer.description);
      offer.percentage = await language(lang, offer.percentage);
      offer.action_button = await language(lang, offer.action_button);
      return offer;
    });

    // To await all updates, you can use Promise.all
    const finalOfferArray = await Promise.all(updatedOfferArray);

    const response = {
      status: true,
      response_code: 200,
      response_message: 'Offer Found Succesfully',
      offer: finalOfferArray,
  };

  let responseData = utils.encrypt(response,show)
  return res.send(responseData)
}

const getAffilationState = async (req,res) =>{
  const input = req.body;
      
  var  show = false;

  if (input.rto || input.rto != "") {
      show = true;
  }

    const allstate = await AffilationState.findAll({
      attributes: [
        'id',
        'state',
        'city',
      ],
    });
    let responseData = utils.encrypt(allstate,show)
    return res.send(responseData)
    //return res.json(allstate)
}
async function language(lang, data) {
 
  if (lang === 'en') {
    return data;
  } else {
    // Assuming you have a Language model in Node.js, you can use it here.
    // Replace 'Language' with the actual name of your model.
    const language = await Language.findOne({ where: {
      lable: data, // your search condition
    }, });
    
    if (language && language[lang]) {
      return language[lang];
    } else {
      return data;
    }
  }
}

async function flattenArray(arr) {
  let result = [];

  arr.forEach((item) => {
    if (Array.isArray(item)) {
      result = result.concat(flattenArray(item));
    } else {
      result.push(item);
    }
  });

  return result;
}

export default {services,affilation,getAffilationState,offer}
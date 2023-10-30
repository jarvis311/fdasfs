import {
    Op,
    Sequelize
} from "sequelize"
import ResaleVehicleCompany from '../../models/ResaleVehicleCompany.js'
import ResaleVehicleModel from "../../models/ResaleVehicleModel.js"
import State from "../../models/State.js"
import CarCompany from "../../models/CarCompany.js"
import BikeCompany from "../../models/BikeCompany.js"
import ScooterCompany from "../../models/ScooterCompany.js"
import ScooterModel from "../../models/ScooterModel.js"
import BikeModel from "../../models/BikeModel.js"
import CarModel from "../../models/CarModal.js"
import CarYear from "../../models/CarYear.js"
import BikeYear from "../../models/BikeYear.js"
import ScooterYear from "../../models/ScooterYear.js"
import ScooterTrim from "../../models/ScooterTrim.js"
import CarTrim from "../../models/CarTrim.js"
import BikeTrim from "../../models/BikeTrim.js"
import ResaleYears from "../../models/ResaleYears.js"
import ResaleVehicleTrim from "../../models/ResaleVehicleTrim.js"
import Year from "../../models/Year.js"
import utils from "../../helpers/utils.js"
import ResaleVehicleCategory from "../../models/ResaleVehicleCategory.js"
import ResaleVehiclePrice from "../../models/ResaleVehiclePrice.js"
import VehicleInformation from "../../models/VehicleInformation.js"
import Km from "../../models/Km.js"
import OldPrice from "../../models/OldPrice.js"
import CarPrice from "../../models/CarPrice.js"
import BikePrice from "../../models/BikePrice.js"
import ScooterPrice from "../../models/ScooterPrice.js"
import PriceVariant from "../../models/PriceVariant.js"
import redisClient from "../../config/redis.js"


const getCompayAndModels = async(req,res) =>{
    try {
        const { city_id,cat_id,language_key } = req.body
        const rto = req.body.hasOwnProperty('rto')
        if(city_id && city_id != ""){
            if (await redisClient.get('resale_company_model')) {
                await redisClient.del('resale_company_model');
            }
            let category
            let tableName , modeltableName
            let cityData = await State.findAll({
                where:{
                    state_id : city_id
                },
                attributes:['state_id','name','per','parent_id']
            })
            if(!cityData.length){
                let message = await utils.translate('Please_Enter_Valid_Data',language_key)
                return res.send(utils.encrypt(utils.newErrorResponseWithInvelidInput(message),rto))
            }
            if(!cat_id){
                let message = await utils.translate('Cat_id_required',language_key)
                return res.send(utils.newErrorResponseWithInvelidInput(message))
            }

            if(cat_id == 1){
                category ="car"
                tableName = CarCompany
                modeltableName = CarModel
            }else if(cat_id == 2){
                category ="bike"
                tableName = BikeCompany
                modeltableName = BikeModel

            }else if(cat_id == 3){
                category ="scooter"
                tableName = ScooterCompany
                modeltableName = ScooterModel

            }else{
                let message = await utils.translate('Please_Enter_Valid_Data',language_key)
                return res.send(utils.encrypt(utils.newErrorResponseWithInvelidInput(message),rto))

            }


            let redisresaleModelCityData = await redisClient.get(`resaleModelcategoryCity${cat_id}_${city_id}`)
            let resultData
            if(redisresaleModelCityData){
                resultData = JSON.parse(redisresaleModelCityData)
            }else{
                resultData =  await tableName.findAll({
                    attributes:[['name', 'Company_Name']]
                }).then((rows) => {
                    if(rows){
                        return rows.map((r) => {
                            return r.dataValues;
                        });
                    }
                });

                if(resultData && resultData.length){
                    for (let i = 0; i < resultData.length; i++) {
                        const element = resultData[i];
                        const result = await modeltableName.findAll(
                            {
                                where : {
                                    c_name : element.Company_Name
                                },
                                attributes :[[`${category}_model_id` , 'ModelID'],['name' , 'ModelName']]
                            },
                        )
                        element.ModelData = result.length ? result : []
                    }
                }
                await redisClient.set(`resaleModelcategoryCity${cat_id}_${city_id}`,JSON.stringify(resultData))
            }


            const resp ={
                status : true,
                response_code :200,
                response_message : "Data Found Successfully",
                data:resultData
            }
                    
            return res.send(utils.encrypt(resp,rto))

        }else{
            if(await redisClient.get('resale_company_model')){
                redisClient.del('resale_company_model')
            }
            if(cat_id && cat_id != ""){
                let data = []
                let resaleModelCategoryData = await redisClient.get(`resaleModelcategory${cat_id}`)
                if(resaleModelCategoryData){
                    data = JSON.parse(resaleModelCategoryData)
                }else{
                    let resaleResult = await ResaleVehicleCompany.findAll({
                        where :{
                            resale_vehicle_category_id : cat_id
                        },
                        include: [{
                            model: ResaleVehicleModel,
                            as: "ModelData",
                        },
                    ],
                        attributes:['id',['name','Company_Name']]
                    })
                    if(resaleResult && resaleResult.length){
                        for (let i = 0; i < resaleResult.length; i++) {
                            const element = resaleResult[i];
                            element.ModelData = element.model_data;
                            delete element.model_data;
                            data.push(element);
                        }
                        await redisClient.set(`resaleModelcategory${cat_id}`,JSON.stringify(data))
                    } 
                }
                const resp = {
                    status : true,
                    response_code :200,
                    response_message : "Data Found Successfully",
                    data:data
                }
                return res.send(utils.encrypt(resp,rto))
            }else{
                let message = await utils.translate('Enter_Vehicle_Category_Id',language_key)
                const resp ={
                    status  : false,
                    response_code :400,
                    response_message : message
                }
                // return res.send(resp)
                return res.send(utils.encrypt(resp,rto))
            }
        }
    } catch (error) {
        console.log("-error", error);
        return res.send(utils.encrypt({
            status: false,
            message: "Error Eccoured !"
        },req.body.hasOwnProperty('rto')))
        // return res.send(utils.encrypt({
        //     status: false,
        //     message: "Error Eccoured !"
        // },req.body.hasOwnProperty('rto')))
    }
}

const getResaleYearsVariant = async(req,res) =>{
    try {
        const { city_id,model_id,cat_id , language_key} = req.body
        const rto = req.body.hasOwnProperty('rto')

        if(city_id && city_id != "" ){
            if(await redisClient.get('resale_years_variant')){
                await redisClient.del('resale_years_variant')
            }
            if(!cat_id){
                const message = await utils.translate('Cat_id_required',language_key)
                return res.send(utils.encrypt(utils.newErrorResponseWithInvelidInput(message),rto))
            }
            if(!model_id){
                const message = await utils.translate('Model_is_required',language_key)
                return res.send(utils.encrypt(utils.newErrorResponseWithInvelidInput(message),rto))
            }
            let category, yearTableName , trimTableName
            
            if(cat_id == 1){
                category ="car"
                yearTableName = CarYear
                trimTableName = CarTrim
            }else if(cat_id == 2){
                category ="bike"
                yearTableName = BikeYear
                trimTableName = BikeTrim
            }else if(cat_id == 3){
                category ="scooter"
                yearTableName = ScooterYear
                trimTableName = ScooterTrim
    
            }else{
                const message = await utils.translate('Please_Enter_Valid_Data',language_key)
                return res.send(utils.encrypt(utils.newErrorResponseWithInvelidInput(message),rto))
            }
            let data 
            if(model_id == ""){
                const message = await utils.translate('Please_Enter_Valid_Data',language_key)
                return res.send(utils.encrypt(utils.newErrorResponseWithInvelidInput(message),rto))
            }else{

                let resaleYearVariantRedisData = await redisClient.get(`resaleYearVariantcategoryCity${cat_id}_${model_id}`)
                if(resaleYearVariantRedisData){
                    data = JSON.parse(resaleYearVariantRedisData)
                }else{
                    data = await yearTableName.findAll({
                        where:{
                            [`${category}_model_id`]:model_id
                        },
                        attributes:[[`${category}_model_year_id` , 'ModelYearId'],[`${category}_year_id` , 'YearId']]
                    }).then((rows) => {
                        if(rows){
                            return rows.map((r) => {
                                return r.dataValues;
                            });
                        }
                    });
                    if(data && data.length){
                        for (let i = 0; i < data.length; i++) {
                            let element = data[i];
                            const yearName = await Year.findAll({
                                where:{
                                    year_id : element.YearId
                                },
                                attributes: ['year','Year'],
                            }).then((rows) => {
                                if(rows){
                                    return rows.map((r) => {
                                        return r.dataValues;
                                    });
                                }
                            });
                            element.Year = yearName.length ? yearName[0].Year : '';
                            const trimData = await trimTableName.findAll({
                                where:{
                                    [`${category}_model_year_id`] : element.ModelYearId
                                },
                                attributes:[[`${category}_trim_id`,'TrimId'],['name','Name']]
                            });
                            element.TrimData = trimData;  
                            
                        }
                        await redisClient.set(`resaleYearVariantcategoryCity${cat_id}_${model_id}`,JSON.stringify(data))
                    }
                }
              
            }
            const resp ={
                status : true,
                response_code :200,
                response_message : "Data Found Successfully",
                data:data
            }
            return res.send(utils.encrypt(resp,rto))
        }else{
            if(await redisClient.get('resale_years_variant')){
                await redisClient.del('resale_years_variant')
            }
            if(model_id && model_id != ""){
                let data
                let resaleYearVariantRedisData = await redisClient.get(`resaleYearVariantcategoryModel${model_id}`)
                if(resaleYearVariantRedisData){
                    data = JSON.parse(resaleYearVariantRedisData)
                }else{

                    data = await ResaleYears.findAll({
                        where:{
                            resale_vehicle_model_id:model_id
                        },
                        include: [
                            {
                                model: ResaleVehicleTrim,
                                as:'TrimData',
                                attributes :['id',['id','TrimId'] ,['name', 'Name'],'resale_year_id']
                            },
                        ],
                        attributes:['id',['id','YearID'],['name','Year']]
                    })
                    await redisClient.set(`resaleYearVariantcategoryModel${model_id}`,JSON.stringify(data))
                }
                const resp ={
                    status : true,
                    response_code :200,
                    response_message : "Data Found Successfully",
                    data:data
                }
                return res.send(utils.encrypt(resp,rto))
            }else{
                const message = await utils.translate('Model_is_required',language_key)
                return res.send(utils.encrypt(utils.newErrorResponseWithInvelidInput(message),rto))
            }
        }
    } catch (error) {
        console.log("-error", error);
        return res.send(utils.encrypt({
            status: false,
            message: "Error Eccoured !"
        },req.body.hasOwnProperty('rto'))) 
    }
}
const getResaleResult = async(req,res) =>{
    try {
        const { city_id,cat_id,model_id,trim_id,km,year_id,language_key } = req.body;
        const rto = req.body.hasOwnProperty('rto')
        if(city_id && city_id != "" ){
            if(await redisClient.get('resale_result')){
                await redisClient.del('resale_result')
            }
            let responseData ={}
            if(!cat_id){
                const message = await utils.translate('Cat_id_required',language_key)
                return res.send(utils.encrypt(utils.newErrorResponseWithInvelidInput(message),rto))
            }

            if(!model_id){
                const message = await utils.translate('Model_is_required',language_key)
                return res.send(utils.encrypt(utils.newErrorResponseWithInvelidInput(message),rto))
            }

            if(!trim_id){
                const message = await utils.translate('Trim_is_required',language_key)
                return res.send(utils.encrypt(utils.newErrorResponseWithInvelidInput(message),rto))
            }
            if(!km){
                const message = await utils.translate('Km_is_required',language_key)
                return res.send(utils.encrypt(utils.newErrorResponseWithInvelidInput(message),rto))
            }

            let kilomiter = km.replace(/,/g, '');

            if (!kilomiter) {
                const message = await utils.translate('Please_Enter_Valid_Kilometer',language_key)
                return res.send(utils.encrypt(utils.newErrorResponseWithInvelidInput(message),rto))
            }
            kilomiter = (kilomiter >= 99999 ) && 100000

            let category
            let tableName , trimTableName ,yearTableName
            if(cat_id == 1){
                category ="car"
                tableName = CarPrice
                trimTableName = CarTrim
                yearTableName = CarYear
            }else if(cat_id == 2){
                category ="bike"
                tableName = BikePrice
                trimTableName = BikeTrim
                yearTableName = BikeYear
            }else if(cat_id == 3){
                category ="scooter"
                tableName = ScooterPrice
                trimTableName = ScooterTrim
                yearTableName = ScooterYear
            }else{
                const message = await utils.translate('Cat_id_required',language_key)
                return res.send(utils.encrypt(utils.newErrorResponseWithInvelidInput(message),rto))
                // return res.send(utils.encrypt(utils.newErrorResponseWithInvelidInput('Please Enter Valid Data'),rto))
            }

            let reSalePriceData = await tableName.findAll({
                attributes:[['make' ,'Company'],['model' ,'Model'],['trim' ,'Trim']],
                where:{
                    [`${category}_model_id`]:  model_id,
                    [`${category}_trim_id`] : trim_id
                }
            })
            if(reSalePriceData && reSalePriceData.length){
                responseData ={
                    Company:reSalePriceData[0].Company,
                    Model:reSalePriceData[0].Model,
                    Trim :reSalePriceData[0].Trim
                }
            }else{
                const message = await utils.translate('price_not_Found',language_key)
                return res.send(utils.encrypt(utils.newErrorResponseWithInvelidInput(message),rto))
            }

            let trimData = await trimTableName.findOne({
                where:{
                    [`${category}_trim_id`]:  trim_id,
                },
                attributes :[[`${category}_model_year_id` ,'model_year_id']]
            }).then((res) => {
                if(res){
                    return res.dataValues
                }
            })
            let yearData = await yearTableName.findOne({
                where:{
                    [`${category}_model_year_id`]: trimData ?  trimData.model_year_id : '',
                },
                attributes :[[`${category}_year_id` ,'year_id']]
            }).then((res) => {
                if(res){
                    return res.dataValues
                }
            })
            let year1Data = await Year.findOne({
                where:{
                    year_id : yearData ? yearData.year_id : ''
                },
                attributes : ['year_id','year','bike','car','scooter','plane','bicycle','taxi','bus','tractor','electric_car','truck']
            })
            let year = year1Data ? year1Data.year : null
            responseData.Year = year

            let image

            if((reSalePriceData && reSalePriceData.length) && reSalePriceData[0].Trim != 'NA'){
                let vehicleVariantData = await PriceVariant.findOne({
                    where:{
                        name:{
                            [Op.like] :`%${reSalePriceData[0].Trim}%`
                        }
                    }
                })
                if(vehicleVariantData && vehicleVariantData.image !='NA'){
                    image = vehicleVariantData.image
                }else{
                    image = ''
                }
            }
            responseData.image = image
            if(trim_id){
                let trimData = await tableName.findOne({
                    where:{
                        [`${category}_trim_id`]:  trim_id,
                    },
                    attributes:['onraod_price']
                })
                let onRoad = trimData && trimData.onraod_price

                let oldPrice = onRoad
                let kmData = await Km.findAll({
                    where:{
                        min: {
                            [Op.lte]: km,
                          },
                          max: {
                            [Op.gte]: km,
                          },
                    },
                    attributes : ['km_id','min','max','bike','scooter','car','plane','bicycle','taxi','bus','tractor','electric_car','truck']
                })
                let kmDistanse = (kmData && kmData.length) && kmData[0][category];
                if(kmDistanse){
                    oldPrice = oldPrice -(onRoad * kmDistanse / 100)
                }else{
                    return res.send(utils.encrypt(utils.newErrorResponseWithDataArrayWithMessage('Kilometer Not Found'),rto))
                }

                let yearData = await Year.findAll({
                    where:{
                        year : year 
                    },
                    attributes : ['year_id','year','bike','car','scooter','plane','bicycle','taxi','bus','tractor','electric_car','truck']
                })

                let yearDistance = yearData.length && yearData[0][category]
                if(yearDistance){
                    oldPrice -= onRoad * yearDistance / 100;
                }else{
                    const message = await utils.translate('Year_Not_Found',language_key)
                    return res.send(utils.encrypt(utils.newErrorResponseWithDataArrayWithMessage(message),rto))
                }


                const oldPriceData = await OldPrice.findOne({
                    where:{
                        category :category
                    },
                    attributes : ['oldprice_id','category','excellentmin','excellentmax','varygoodmin','varygoodmax','goodmin','goodmax','fairmin','fairmax']

                })
                let oldDistance = oldPriceData
                if(!oldDistance){
                    const message = await utils.translate('Please_Enter_Valid_Data',language_key)
                    return res.send(utils.encrypt(utils.newErrorResponseWithDataArrayWithMessage(message),rto))
                }      
                
                let _oldPrice = oldPrice;
                let percentage
        
                let excellentmin = _oldPrice - (oldPrice * oldDistance.excellentmin / 100);
                let excellentmax = _oldPrice - (oldPrice * oldDistance.excellentmax / 100);
        
                let _oldPriceMin = excellentmin - (excellentmin * oldDistance.varygoodmin / 100);
                let _oldPriceMax = excellentmin + (excellentmin * oldDistance.varygoodmax / 100);
        
                let _oldPriceValueMin = _oldPriceMin - (_oldPriceMin * oldDistance.goodmin / 100);
                let _oldPriceValueMax = _oldPriceMin + (_oldPriceMin * oldDistance.goodmax / 100);
        
                let fairmin = _oldPriceValueMin - (_oldPriceValueMin * oldDistance.fairmin / 100);
                let fairmax = _oldPriceValueMin + (_oldPriceValueMin * oldDistance.fairmax / 100);
                let stateData  
                if(cat_id == 1){
                    if(city_id){
                        let cityStateData = await State.findOne({
                            where:{
                                state_id : city_id,
                                parent_id :{
                                    [Op.ne]:0
                                }
                            },
                            attributes:['state_id','name','per','parent_id']
                        })
                        if(cityStateData){
                            stateData = await State.findOne({
                                where:{
                                    state_id:cityStateData.parent_id
                                },
                            attributes:['state_id','name','per','parent_id']
                            })  
                            if(stateData){
                                responseData.City = cityStateData.name
                                responseData.State = stateData.name
                            }else{
                                stateData = await State.findOne({
                                    where:{
                                        state_id:600
                                    },
                                    attributes:['state_id','name','per','parent_id']
                                })  
                            }
                        }else{
                            stateData = await State.findOne({
                                where:{
                                    state_id:city_id
                                },
                                attributes:['state_id','name','per','parent_id']
                            })  
                            if(stateData){
                                responseData.State = stateData.name
                            }else{
                                stateData =await State.findOne({
                                    where:{
                                        state_id:600
                                    }
                                })  
                                responseData.City = 'New Delhi'
                                responseData.State = 'Delhi'
                            }
                        }
                    }else{
                        stateData = await State.findOne({
                            where:{
                                state_id:600
                            }
                        })  
                        responseData.State = "Delhi"
                        responseData.City = "New Delhi"
                    }

                    if(stateData && (stateData.per > 0)){
                        let statepr = Math.abs(stateData.per);
                        excellentmin = excellentmin + (excellentmin * statepr / 100);
                        excellentmax = excellentmax + (excellentmax * statepr / 100);

                        _oldPriceMin = _oldPriceMin + (_oldPriceMin * statepr / 100);
                        _oldPriceMax = _oldPriceMax + (_oldPriceMax * statepr / 100);

                        _oldPriceValueMin = _oldPriceValueMin + (_oldPriceValueMin * statepr / 100);
                        _oldPriceValueMax = _oldPriceValueMax + (_oldPriceValueMax * statepr / 100);

                        fairmin = fairmin + (fairmin * statepr / 100);
                        fairmax = fairmax + (fairmax * statepr / 100);
                    }else{
                        let statepr = Math.abs(stateData.per);
                        excellentmin = excellentmin - (excellentmin * statepr / 100);
                        excellentmax = excellentmax - (excellentmax * statepr / 100);

                        _oldPriceMin = _oldPriceMin - (_oldPriceMin * statepr / 100);
                        _oldPriceMax = _oldPriceMax - (_oldPriceMax * statepr / 100);

                        _oldPriceValueMin = _oldPriceValueMin - (_oldPriceValueMin * statepr / 100);
                        _oldPriceValueMax = _oldPriceValueMax - (_oldPriceValueMax * statepr / 100);

                        fairmin = fairmin - (fairmin * statepr / 100);
                        fairmax = fairmax - (fairmax * statepr / 100);
                    }
                }else{
                    responseData.City = "Mumbai";
                    responseData.State = "Maharashtra";
                }

                let odata = {
                    Fair: { min: parseInt(fairmin), max: parseInt(fairmax) },
                    Good: { min: parseInt(_oldPriceValueMin), max: parseInt(_oldPriceValueMax) },
                    VaryGood: { min: parseInt(_oldPriceMin), max: parseInt(_oldPriceMax) },
                    Excellent: { min: parseInt(excellentmin), max: parseInt(excellentmax) }
                };

                if(odata){
                    responseData.Data = odata
                }else{
                    return res.send(utils.encrypt(utils.newErrorResponseWithDataArray(),rto))
                }

                if(await redisClient.get('resale_result')){
                    await redisClient.del('resale_result')
                }
                const response = {
                    status : true,
                    response_code : 200,
                    response_message : 'Data Found Successfully',
                    data : responseData
                }
                return res.send(utils.encrypt(response,rto))

            }
           
        }else{
            if(await redisClient.get('resale_result')){
                await redisClient.del('resale_result')
            }
            if(!cat_id){
                const message = await utils.translate('Cat_id_required',language_key)
                return res.send(utils.encrypt(utils.newErrorResponseWithInvelidInput(message),rto))
            }

            if(!model_id){
                const message = await utils.translate('Model_is_required',language_key)
                return res.send(utils.encrypt(utils.newErrorResponseWithInvelidInput(message),rto))
            }

            if(!trim_id){
                const message = await utils.translate('Trim_is_required',language_key)
                return res.send(utils.encrypt(utils.newErrorResponseWithInvelidInput(message),rto))
            }
            if(!km){
                const message = await utils.translate('Km_is_required',language_key)
                return res.send(utils.encrypt(utils.newErrorResponseWithInvelidInput(message),rto))
            }
            if(!year_id){
                return res.send(utils.encrypt(utils.newErrorResponseWithInvelidInput('Year is Required.'),rto))
            }

            const resp = await calculateResaleVehicleValue({category_id : cat_id, model_id,trim_id,year_id,kilometer:km,rto,language_key:language_key})
            // return resp;
            return res.send(utils.encrypt(resp,rto))
        }
    } catch (error) {
        console.log("-error", error);
        return res.send(utils.encrypt({
            status: false,
            message: "Error Eccoured !"
        },req.body.hasOwnProperty('rto')))
    }
}

const getUserVehicleSearch = async(req,res)  => {
    try {
        let reg_no = { reg_number: req.body.vehicle_number };
        // $rto_obj = new RTONewApiController();
        // $res_vehicle_number = $rto_obj->getRcDetails_new($reg_no);

        let response
        if(response && response.status){
            let vehicleData = response.data[0]
            let category,makerName,maker
            if(['M-CYCLE/SCOOTER (2WN)', 'M-Cycle/Scooter(2WN)', 'Moped(2WN)'].includes(vehicleData.vh_class.toLowerCase())) {
                const makerName = vehicleData.maker.replace(/(INDIA|PVT|LTD|MOTOR|\(SELF-DRUM-CAST\)\/)/g, '');
                const maker = makerName.split(/\s+/);
                let vehicleCompany = '';
                for (const val of maker) {
                    vehicleCompany = await ResaleVehicleCompany.findAll({
                        where:{
                            name : {
                                [Op.like]:`%${val}%`
                            },
                            resale_vehicle_category_id : {
                                [Op.in]:[2, 3] 
                            }
                        }
                        }).map(c => c.id);
                    if(vehicleCompany.length >= 0) {
                        break;
                    }
                }
                let vehicleModels = '';
                let vehicleYear = '';
                const makerModel = vehicleData.maker_modal.split(/\s+/);
                for (const elementModel of makerModel) {
                    vehicleModels = await ResaleVehicleModel.findOne({
                        where:{
                            name:{
                                [Op.like]:`%${elementModel}%`
                            },
                            resale_vehicle_company_id : {
                                [Op.in]:vehicleCompany 
                            }
                        }
                    })
                    if (vehicleModels) {
                        break;
                    }
                }
                if (vehicleModels) {
                    const companyData = await ResaleVehicleCompany.findOne({
                        where:{
                            id : vehicleModels ? vehicleModels.resale_vehicle_company_id : ''
                        }
                    })
                    if (companyData) {
                        category = companyData.resale_vehicle_category_id;
                    } else {
                        category = 2;
                    }
                } else {
                  category = 2;
                }
            }else if (['Motor Car(LMV)'].includes(vehicleData.vh_class.toLowerCase())){
                category = 1;
            } else {
                category = 0;
            }
              

            if(vehicleData && vehicleData.maker.toLowerCase() != 'other' && category != 0){
                const makerName = vehicleData.maker.replace(/(INDIA|PVT|LTD|MOTOR|\(SELF-DRUM-CAST\)\/)/g, '');
                const maker = makerName.split(/\s+/);
                let vehicleCompany = '';
                for (const val of maker) {
                    vehicleCompany = await ResaleVehicleCompany.findOne({
                        where:{
                            name : {
                                [Op.like]:`%${val}%`
                            },
                            resale_vehicle_category_id :category
                        }
                    })
                    if(vehicleCompany) {
                        break;
                    }
                }
                let matchStatus = false
                if(!vehicleCompany){
                    const resp ={
                        status:false,
                        response_code : 400,
                        response_message : 'Record Not Found',
                    }
                    return res.send(utils.encrypt(resp,rto))
                }else{
                    let vehicleModel 
                    let vehicleyear 
                    let makerModel =  vehicleData.maker_modal.split(/\s+/);
                    for (const elementModel of makerModel) {
                        vehicleModel = await ResaleVehicleModel.findOne({
                            where:{
                                name:{
                                    [Op.like]:`%${elementModel}%`
                                }
                            }
                        })
                        if (vehicleModel) {
                            matchStatus = true
                            break;
                        }
                    }
                    let response
                    if(vehicleModel){
                        response = await ResaleVehicleModel.findAll({
                            where:{
                                resale_vehicle_company_id : vehicleCompany.id
                            },
                            attributes:['id',['id','ModelID'],['name','ModelName'],'resale_vehicle_company_id'],
                            order:[['id','DESC']]
                        })
                        let tempModel ={
                            id : vehicleModel.id,
                            ModelID : vehicleModel.id,
                            ModelName : vehicleModel.name,
                            resale_vehicle_company_id : vehicleModel.resale_vehicle_company_id
                        }
                        response.push(tempModel);
                        response.reverse();


                        if(vehicleData.regn_dt){
                            if (vehicleData.regn_dt.includes("-")) {
                                const manufacturerYear = vehicleData.regn_dt.split("-")[2];
                                const responseYearTrim = await ResaleYears.findOne({
                                    where:{
                                        name : manufacturerYear,
                                        resale_vehicle_model_id : vehicleModel.id
                                    },
                                    include:[{
                                        as : 'TrimData',
                                        model: ResaleVehicleTrim,
                                        attributes :['id',['id','TrimId'] ,['name', 'Name'],'resale_year_id']
                                    }]
                                })
                                vehicleyear = responseYearTrim
                            }
                              
                        }


                     
                    }else{
                        response = await ResaleVehicleModel.findAll({
                            where:{
                                resale_vehicle_company_id:vehicleCompany.id,
                            },
                            attributes:['id',['id','ModelID'],['name','ModelName'],'resale_vehicle_company_id'],
                        })
                    }

                    let data = {
                        id : vehicleCompany.id,
                        Company_Name : vehicleCompany.name,
                        resale_vehicle_category_id : category,
                        matchStatus : matchStatus,
                        ModelData : response,
                    }
                    let responseData = {
                        CompanyModelData : [data]
                    }

                    if(vehicleyear){
                        responseData.YearTrimData = [vehicleyear]
                    }
                    const finalResponse = {
                        status : true,
                        response_code : 200,
                        response_message : 'Data Found Successfully',
                        data :responseData
                    }
                    return res.send(finalResponse)
                }
            }else{
                const response = {
                    status : false,
                    response_code  : 400 ,
                    response_message : 'Data Not Found'
                }
                return res.send(response)
            }
        }else{
            const response = {
                status : false,
                response_code  : 400 ,
                response_message : 'Vehicle Not Found'
            }
            return res.send(response)
        }

    } catch (error) {
        console.log("-error", error);
        return res.send({
            status: false,
            message: "Error Eccoured !"
        })
    }
}

async function calculateResaleVehicleValue(data) {
    let {category_id,model_id,trim_id,year_id,kilometer,rto,language_key}= data
    let year 
    let responseData = {}
    let km = kilometer.replace(/,/g, '');
    if (km >= 99999) {
        km = 100000;
    }
    if(km == ""){
        const message = await utils.translate('Please_Enter_Valid_Kilometer',language_key)
        return utils.newErrorResponseWithInvelidInput(message)
    }
    let categoryData = await ResaleVehicleCategory.findOne({
        where:{
            id : category_id
        }
    })

    let modelData = await ResaleVehicleModel.findOne({
        where:{
            id : model_id
        },
        include:[
            {
                model:ResaleVehicleCompany,
                as : 'get_company'
            }
        ]
    })

    let companyId = modelData ? modelData.get_company.id : '';
    let vehicelPriceData = await ResaleVehiclePrice.findAll({
        where:{
            resale_vehicle_company_id :companyId,
            resale_vehicle_model_id : model_id,
            resale_vehicle_trim_id: trim_id,
            resale_year_id:year_id
        }
    })
    if(vehicelPriceData && vehicelPriceData.length){
        let vehicleCompanyData = await ResaleVehicleCompany.findOne({
            where:{
                id : companyId
            }
        })
        let vehicleModelData = await ResaleVehicleModel.findOne({
            where:{
                id : model_id
            }
        })
        let vehicleTrimData = await ResaleVehicleTrim.findOne({
            where:{
                id : trim_id
            }
        })
        let vehicleYearData = await ResaleYears.findOne({
            where:{
                id : year_id
            }
        })

        responseData = {
            Company : vehicleCompanyData ? vehicleCompanyData.name : null,
            Model : vehicleModelData ? vehicleModelData.name : null,
            Trim : vehicleTrimData ? vehicleTrimData.name : null,
            Year : vehicleYearData ? vehicleYearData.name : null,
        }
        year = vehicleYearData ? vehicleYearData.name : null
        let catId ,vehicleVariantData,image
        if(vehicleModelData && vehicleModelData.name != 'NA'){
            if(category_id == 1 || category_id == 10 || category_id == 6){
                catId =2
            }
            if(category_id == 2 || category_id == 3)
            {
                catId=1;
            }
            if(category_id == 7 || category_id == 8)
            {
                catId=3;
            }
            if(category_id == 4)
            {
                catId=5;
            }
            if(catId){
                vehicleVariantData = await VehicleInformation.findOne({
                    where:{
                        category_id :catId,
                        model_name: {
                            [Op.like] :`%${vehicleModelData.name}%`
                        }
                    }
                })
            }
            image = (vehicleVariantData && vehicleVariantData.image != 'NA') ? vehicleVariantData.image : ''
        }else{
            image = '' 
        }
        responseData.image = image
    }else{
        return utils.newErrorResponseWithDataArray()
        // return utils.newErrorResponseWithDataArray()
    }

    if(trim_id){
        const onRoad =vehicelPriceData[0].onraod_price 
        let oldPrice = onRoad
        let kmData = await Km.findAll({
            where:{
                min: {
                    [Op.lte]: km,
                  },
                  max: {
                    [Op.gte]: km,
                  },
            },
            attributes : ['km_id','min','max','bike','scooter','car','plane','bicycle','taxi','bus','tractor','electric_car','truck']

        })
        let kmDistanse = kmData.length && kmData[0][categoryData.category_name.toLowerCase()];
        if(kmDistanse){
            oldPrice = oldPrice -(onRoad * kmDistanse / 100)
        }else{
            return utils.newErrorResponseWithDataArrayWithMessage('Kilometer Not Found')
            // return utils.newErrorResponseWithDataArrayWithMessage('Kilometer Not Found')
        }

        let yearData = await Year.findAll({
            where:{
                year : year 
            },
            attributes : ['year_id','year','bike','car','scooter','plane','bicycle','taxi','bus','tractor','electric_car','truck']

        })

        if(yearData && yearData.length){
            const yearDistance = yearData[0][categoryData.category_name.toLowerCase()];
            if (yearDistance) {
                oldPrice -= onRoad * yearDistance / 100;
            }
        }else{
            const message = await utils.translate('Year_Not_Found',language_key)
            return utils.newErrorResponseWithDataArrayWithMessage(message)

        }

        const oldPriceData = await OldPrice.findOne({
            where:{
                category :categoryData.category_name.toLowerCase()
            },
            attributes : ['oldprice_id','category','excellentmin','excellentmax','varygoodmin','varygoodmax','goodmin','goodmax','fairmin','fairmax']

        })
        let oldDistance = oldPriceData
        if(!oldDistance){
            const message = await utils.translate('Old_Price_Data_Not_Found',language_key)
            return utils.newErrorResponseWithDataArrayWithMessage(message)
        }

        let _oldPrice = oldPrice;
        let percentage

        let excellentmin = _oldPrice - (oldPrice * oldDistance.excellentmin / 100);
        let excellentmax = _oldPrice - (oldPrice * oldDistance.excellentmax / 100);

        let _oldPriceMin = excellentmin - (excellentmin * oldDistance.varygoodmin / 100);
        let _oldPriceMax = excellentmin + (excellentmin * oldDistance.varygoodmax / 100);

        let _oldPriceValueMin = _oldPriceMin - (_oldPriceMin * oldDistance.goodmin / 100);
        let _oldPriceValueMax = _oldPriceMin + (_oldPriceMin * oldDistance.goodmax / 100);

        let fairmin = _oldPriceValueMin - (_oldPriceValueMin * oldDistance.fairmin / 100);
        let fairmax = _oldPriceValueMin + (_oldPriceValueMin * oldDistance.fairmax / 100);

        if ((percentage = 2) > 0) {
            const statepr = Math.abs(percentage);
            excellentmin += excellentmin * statepr / 100;
            excellentmax += excellentmax * statepr / 100;
          
            _oldPriceMin += _oldPriceMin * statepr / 100;
            _oldPriceMax += _oldPriceMax * statepr / 100;
          
            _oldPriceValueMin += _oldPriceValueMin * statepr / 100;
            _oldPriceValueMax += _oldPriceValueMax * statepr / 100;
          
            fairmin += fairmin * statepr / 100;
            fairmax += fairmax * statepr / 100;
        }
          
        let _data = {
            Fair: { min: parseInt(fairmin), max: parseInt(fairmax) },
            Good: { min: parseInt(_oldPriceValueMin), max: parseInt(_oldPriceValueMax) },
            VaryGood: { min: parseInt(_oldPriceMin), max: parseInt(_oldPriceMax) },
            Excellent: { min: parseInt(excellentmin), max: parseInt(excellentmax) }
        };

        if(_data){
            responseData.Data = _data
        }else{
            const message = await utils.translate('Vehicle_Condition_Not_Found',language_key)
            return utils.newErrorResponseWithDataArrayWithMessage(message)
        }
        const response = {
            status :true,
            response_code:200,
            response_message :'Data Found Successfully',
            data:responseData
        }
        return response
    }

}

async function getRcDetails(data){
    let { version_code,type,reg_number,is_skip_db } = data
    let key = 'V@$undh@r@50599#';
    let versionCode = version_code ? version_code : '' 
    let appType = type ? type : ''
    let skipDb ,exist
    let registrationNumber 
    if(reg_number){
        registrationNumber = reg_number
    }else{
        const response  ={
            status : false,
            response_code : 400 ,
            response_message :'Enter Proper Number'
        }
        return response;
    }

    if (!/^[a-zA-Z0-9]+$/.test(reg_number)) {
        const response  ={
            status : false,
            response_code : 400 ,
            response_message :'Enter Proper Number'
        }
        return response;
    }

    skipDb = is_skip_db  ? is_skip_db : ''
    reg_number =  reg_number.toUpperCase()
    const state = reg_number.substring(0, 2);
    const checkState =!isNaN(state);
    
    if (checkState) {
      const state = reg_number.substring(2, 4);
      if (state !== 'BH') {
        const data3 = {};
        const jsonArray = { status: false, response_code: 404, response_message: 'Data_Not_Found', data: data3 };
        return response
      }
    }
    let stateArray = ['AN', 'AP', 'AR', 'AS', 'BR','BH', 'CH', 'CG', 'DD', 'DL', 'GA', 'GJ', 'HR', 'HP', 'JK', 'JH', 'KA', 'KL', 'LA', 'LD', 'MP', 'MH', 'MN', 'ML', 'MZ', 'NL', 'OD', 'PY', 'PB', 'RJ', 'SK', 'TN', 'TS', 'TR', 'UP', 'UK', 'WB'];

    if (stateArray.includes(state)) {
        let tableName = state;
        if ((skipDb == 'true') || (skipDb == true)) {
            exist = null;
        } else {
            // exist = await DB.connection('RC').table(tableName).where('reg_no', input.reg_number).first();
        }
    }else{
        const resp = {
            status : false,
            response_code : 404 ,
            response_message :'Data Not Found'
        }
        return resp
    }

    let rno = reg_number
} 






export default {
    getCompayAndModels,
    getResaleYearsVariant,
    getResaleResult,
    getUserVehicleSearch
}
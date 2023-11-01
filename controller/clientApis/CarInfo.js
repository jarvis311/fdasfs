import {
    Op,
    Sequelize
} from "sequelize"
import utils from "../../helpers/utils.js"
import redisClient from "../../config/redis.js"
import Categories from "../../models/Categories.js"
import BodyTypes from '../../models/BodyTypes.js'
import VehicleInformation from '../../models/VehicleInformation.js'
import Compare from '../../models/Compare.js'
import PriceVariant from '../../models/PriceVariant.js'
import VehicleInformationImages from '../../models/VehicleInformationImages.js'
import VehicleModelColor from '../../models/VehicleModelColor.js'
import VehicleModelColorImages from '../../models/VehicleModelColorImages.js'
import Brands from '../../models/Brands.js'
import VariantSpecification from "../../models/VariantSpecification.js"
import VariantKeySpecification from "../../models/VariantKeySpecification.js"
import KeySpecification from "../../models/KeySpecification.js"
import NewsHeadline from "../../models/NewsHeadlines.js"
import DLRC from "../../models/DLRC.js"
import moment from "moment"








export const getVehicleInformationFrontend = async (req, res) => {
    try {
        const body = req.body;
        if (!body.cat_id) {
            return res.send("Cat_id_required")
        }

        const categoryId = body.cat_id

        // Search Data 
        const searchData = await getSearchData(categoryId)

        // Most Popular Searched 
        const popularSearch = await getPopularSearch(categoryId, searchData.category_name)

        // Popular vehicle budget data 
        const productBudget = await getPopularBudget(categoryId, searchData.category_name)

        // Compare Vehicle Data
        const compareData = await getCompareData(categoryId, searchData.category_name)

        // Brand Data 
        const brand = await getBrandData(categoryId, searchData.category_name)

        let latestUpcoming = {};

        // latest Vechicle Data
        if (searchData.letestVehicles && searchData.upcomingVehicles) {
            if (searchData.letestVehicles.length < 1 && searchData.upcomingVehicles.length < 1) {
                latestUpcoming = []
            } else {
                if (searchData.letestVehicles.length && searchData.upcomingVehicles.length < 1) {
                    latestUpcoming = [{
                        filter_value: "is_latest",
                        lable: "upcoming " + searchData.category_name,
                        lists: searchData.letestVehicles
                    }];
                } else if (searchData.letestVehicles.length < 1 && searchData.upcomingVehicles.length) {
                    latestUpcoming = [{
                        filter_value: "is_upcoming",
                        lable: "latest " + searchData.category_name,
                        lists: searchData.upcomingVehicles
                    }];
                } else {
                    latestUpcoming = [{
                        filter_value: "is_latest",
                        label: "latest " + searchData.category_name,
                        lists: searchData.letestVehicles
                    },
                    {
                        filter_value: "is_upcoming",
                        label: "upcoming " + searchData.category_name,
                        lists: searchData.upcomingVehicles
                    }
                    ];
                }
            }
        }

        const recommended = searchData.recommendedVehicles && searchData.recommendedVehicles.length
            ? {
                lable: `Recommeded ${searchData.category_name} For You.`,
                is_recommended: 1,
                data_list: searchData.recommendedVehicles,
            }
            : null;

        const letestSearch = latestUpcoming.length
            ? {
                lable: `Upcoming & Latest ${searchData.category_name}`,
                is_upcoming: 1,
                is_latest: 1,
                filter_key: "popularity",
                data_list: latestUpcoming,
            }
            : null;


        // Prepare Response 

        let response = {}
        if (recommended) {
            response.is_recommended = recommended
        }
        if (productBudget) {
            response.popular_vehicle_budget = productBudget
        }
        if (popularSearch) {
            response.is_most_search = popularSearch
        }
        if (brand) {
            response.popular_brand = brand
        }
        if (letestSearch) {
            response.is_latest_upcomimg = letestSearch
        }
        if (compareData) {
            response.compare_data = compareData
        }
        const resp = {
            status: true,
            response_code: 200,
            response_message: 'Data Found Successfully',
            ...response
        }
        const cacheResult = await redisClient.get('vehicle_information');
        if (cacheResult) {
            await redisClient.del('vehicle_information');
        }
        return res.send(resp)
    } catch (error) {
        console.log("-error", error);
        return res.send({
            status: false,
            message: "Error Eccoured !"
        })
    }
}

export const getSingleVehicleInformationFrontend = async (req, res) => {
    try {

        const { vehicle_information_id, is_search, variant_id } = req.body;
        if (!vehicle_information_id) {
            return res.send("vehicle_is_required")
        }
        let vehicle_id = vehicle_information_id


        // Get Vehicle Information with vehicle_information_images , VehiclesModelColor ,VehicleVarintPrice
        let vehicleData = await getVehicleIdWiseVehicleInformation(vehicle_id)

        if (!vehicleData) {
            const resp = {
                status: false,
                response_code: 400,
                response_message: 'No Record Found Successfully',
            }

            return res.send(resp);

        }

        // Get Test Drive Link in Brands table
        const brandData = await Brands.findOne({
            where: {
                id: vehicleData.brand_id,
                deleted_at: null
            },
            attributes: ['test_drive_link']
        })

        // Assign test drive link in vehicleData 
        vehicleData.test_drive_link = brandData ? brandData.test_drive_link : '';


        if (vehicleData) {
            let searchvalue = {}
            // Update Popular count and Seach Count in Vehicle Information Table
            if ((is_search && is_search == "true") || (is_search && is_search == true)) {
                searchvalue.search_count = vehicleData.search_count + 1;
                searchvalue.popular_count = vehicleData.popular_count + 1;
            } else {
                searchvalue.popular_count = vehicleData.popular_count + 1;
            }
            await VehicleInformation.update(searchvalue, { where: { id: vehicle_id } });
        }


        // Find the PriceVariant using the variant Is if the variant id is not available, then use the vehicle Id.
        let variantId
        if (variant_id && variant_id !== "") {
            let singlePriceVariant = await PriceVariant.findOne({
                where: {
                    deleted_at: null,
                    id: variant_id,
                }
            })
            if (singlePriceVariant) {
                const { id, name, fuel_type, engine, mileage, review_count, price } = singlePriceVariant
                variantId = id
                vehicleData = {
                    ...vehicleData,
                    variant_id: id,
                    model_name: name,
                    fuel_type: fuel_type,
                    engine: engine,
                    mileage: mileage,
                    review_count: review_count,
                    price_range: price
                }
            }
        } else {
            let variant_name
            if (vehicleData.category_id == 1) {
                variant_name = vehicleData.variant_name
            } else {
                variant_name = vehicleData.model_name + ' ' + vehicleData.variant_name
            }
            let singlePriceVariantData = await PriceVariant.findOne({
                where: {
                    vehicle_information_id: vehicle_id,
                    name: {
                        [Op.like]: variant_name
                    },
                    deleted_at: null
                }
            })
            if (singlePriceVariantData) {
                const { id, fuel_type, engine, mileage, review_count, price } = singlePriceVariantData
                variantId = id
                vehicleData = {
                    ...vehicleData,
                    variant_id: id,
                    fuel_type: fuel_type,
                    engine: engine,
                    mileage: mileage,
                    review_count: review_count,
                    price_range: price
                }
            } else {
                let singlePriceVariantResult = await PriceVariant.findOne({
                    where: {
                        vehicle_information_id: vehicle_id,
                        deleted_at: null
                    }
                })
                if (singlePriceVariantResult) {
                    const { id, fuel_type, engine, mileage, review_count, price } = singlePriceVariantResult
                    variantId = id
                    vehicleData = {
                        ...vehicleData,
                        variant_id: id,
                        fuel_type: fuel_type,
                        engine: engine,
                        mileage: mileage,
                        review_count: review_count,
                        price_range: price
                    }
                }
            }
        }


        // Retrieve the fuelData using the Vehicle ID and locate the category ID field in the VehicleInformation
        let vehicleId = vehicleData.id
        let fuelData = await VehicleInformation.findAll({
            where: {
                category_id: vehicleId,
                deleted_at: {
                    [Op.eq]: null
                }
            },
            attributes: [
                [Sequelize.fn('DISTINCT', Sequelize.col('fuel_type')), 'fuel_type'],
                'fuel_type'
            ],
        })

        let fuelArray = [];
        const fuelTypeArray = [
            {
                "name": "ALL",
                "id": "ALL"
            }
        ];
        if (fuelData.length) {
            for (let i = 0; i < fuelData.length; i++) {
                const singleFuelType = fuelData[i];
                fuelArray[i] = {
                    "name": singleFuelType.fuel_type,
                    "id": singleFuelType.fuel_type
                };
            }
        }
        const FinalFuelData = [...fuelArray, ...fuelTypeArray];



        // Find variantSpecification ,KeyFeature and overView locate the vehicle Id or variant Id
        let variantSpecificationData
        let keyFeatureData
        let overViewData
        if (variantId) {
            variantSpecificationData = await VariantSpecification.findAll({
                include: [
                    {
                        model: VariantKeySpecification,
                        as: 'vehicles_specification',
                        where: {
                            vehicle_information_id: vehicleId,
                            variant_id: variantId,
                        },
                    },
                ],
            })


            keyFeatureData = await VariantKeySpecification.findAll({
                where: {
                    vehicle_information_id: vehicleId,
                    variant_id: variantId,
                    show_key_feature: 1
                },
                attributes: ['name', 'value']
            })
            overViewData = await VariantKeySpecification.findAll({
                where: {
                    vehicle_information_id: vehicleId,
                    variant_id: variantId,
                    show_overview: 1
                },
                include: [
                    {
                        model: KeySpecification,
                        as: 'specification_icon',
                        attributes: ['id', 'icon']
                    }
                ],
                attributes: ['name', 'value', 'variant_key_id']

            })
        } else {
            variantSpecificationData = await VariantSpecification.findAll({
                include: [
                    {
                        model: VariantKeySpecification,
                        as: 'vehicles_specification',
                        where: {
                            vehicle_information_id: vehicleId,
                        },
                    },
                ],
                order: [
                    ['id', 'ASC']
                ],
            })

            keyFeatureData = await VariantKeySpecification.findAll({
                where: {
                    vehicle_information_id: vehicleId,
                    show_key_feature: 1
                },
                attributes: ['name', 'value']
            })
            overViewData = await VariantKeySpecification.findAll({
                where: {
                    vehicle_information_id: vehicleId,
                    show_overview: 1
                },
                include: [
                    {
                        model: KeySpecification,
                        as: 'specification_icon',
                        attributes: ['id', 'icon'],
                        where: {
                            deleted_at: null
                        }
                    }
                ],
                attributes: ['name', 'value', 'variant_key_id']

            })
        }

        // return res.json(overViewData)


        // Find Vehicel Variant Price 
        let finalArray = []
        if (vehicleData.vehicle_varint_price && vehicleData.vehicle_varint_price.length) {
            for (const element of vehicleData.vehicle_varint_price) {
                let prepareJson = {
                    id: element.vehicle_information_id,
                    variant_id: element.id,
                    category_id: vehicleData.category_id,
                    brand_id: vehicleData.brand_id,
                    model_name: element.name,
                    variant_name: element.name,
                    fuel_type: element.fuel_type,
                    price_range: element.price,
                    engine: element.engine,
                    mileage: element.mileage,
                    image: vehicleData.image,
                    other_price: element.other_price ? Math.round(element.other_price) : 0,
                    rto_price: element.rto_price ? Math.round(element.rto_price) : 0,
                    insurance_price: element.insurance_price ? Math.round(element.insurance_price) : 0,
                    showroom_price: Math.round(element.ex_show_room_rice),
                    on_road_price: Math.round(element.on_road_price)
                }
                finalArray.push(prepareJson);
            }
        }
        if (!finalArray.length) {
            vehicleData.VehiclePriceVariant = await VehicleInformation.findAll({
                where: {
                    id: vehicle_id
                },
                attributes: ['id', ['id', 'variant_id'], 'bind_id', 'category_id', 'brand_id', 'model_name', 'variant_name', 'avg_rating', 'review_count', 'fuel_type', 'price_range', 'image', 'min_price', 'mileage', 'engine', 'max_power', 'showroom_price', 'rto_price', 'insurance_price', 'other_price', 'on_road_price']
            })
        } else {
            vehicleData.VehiclePriceVariant = finalArray
        }


        const ShowVariantArray = [
            { category_id: 1 },
            { category_id: 2 },
            { category_id: 3 }
        ];

        const VariantArray = {
            lable: "Show Variant",
            key: "is_show_variant",
            data_list: ShowVariantArray
        };


        // Retrieves the latest two news headlines based on their publication date.
        const currentDate = new Date().toISOString().slice(0, 10);
        let newsData = await NewsHeadline.findAll({
            attributes: ['id', 'index', 'category_id', 'title', 'description', 'date', 'image', 'status', 'news_url'],
            where: {
                deleted_at: null,
                status: 1,
                date: {
                    [Op.lte]: currentDate
                },
                vehicle_category_id: vehicleData.category_id,
                brand_id: vehicleData.brand_id
            },
            order: [['index', 'DESC']],
            limit: 2
        });
        if (newsData.length) {
            vehicleData.newsData = newsData
        } else {
            vehicleData.newsData = await NewsHeadline.findAll({
                attributes: ['id', 'index', 'category_id', 'title', 'description', 'date', 'image', 'status', 'news_url'],
                where: {
                    deleted_at: null,
                    status: 1,
                    date: {
                        [Op.lte]: currentDate
                    },
                },
                order: [['index', 'DESC']],
                limit: 2
            });
        }
        if (variantSpecificationData.length) {
            vehicleData.specification = variantSpecificationData
        }
        if (keyFeatureData.length) {
            vehicleData.key_feature = keyFeatureData
        }
        if (overViewData.length) {
            vehicleData.overview = overViewData
        }

        vehicleData.fuel_types = FinalFuelData;
        vehicleData.show_variant = VariantArray

        const resp = {
            status: true,
            response_code: 200,
            response_message: "Data Found Successfully",
            data: vehicleData
        }
        const cacheResult = await redisClient.get('vasu_single_vehicle_information');
        if (cacheResult) {
            await redisClient.del('vasu_single_vehicle_information');
        }
        return res.send(resp)

    } catch (error) {
        console.log("-error", error);
        const id = req.body.vehicle_information_id
        let vasuSingleVehicleInfo = await redisClient.get('vasu_single_vehicle_information');
        if (!vasuSingleVehicleInfo) {
            await redisClient.set('vasu_single_vehicle_information', '1');
        }
        return res.send({
            status: false,
            message: "Error Eccoured !"
        })
    }
}

export const getAllVehicleInformationgetInbuggrt = async(req,res) =>{
    try {
        // cat_id = 3 ,popularity=is_popular_search,is_upcoming,sort=price_low_to_high,vehicle_type_id=4,budget=10000-15000,15000-20000,keyword=TVS,limit=12,page=1
        let { cat_id , brand_id, keyword, budget,vehicle_type_id,sort,popularity,fuel_type, page,limit,language_key } = req.body;
        
        if(!cat_id){
            res.send("Cat_id_required")
        }

        if (page && page > 0) {
            page = parseInt(page);
        } else {
            page = 1;
        }

        if (limit && limit > 0) {
           limit = parseInt(limit);
        }

        let filterCount = 0
        let whereArray = {
            category_id :cat_id,
            is_content_writer:1,
            is_designer:1,
            deleted_at:null,
        }
        let offset
        let orderBy =[]

        // if brand id here then filter Data using brand Id
        if (brand_id) { 
            filterCount += brand_id.split(',').length;
            whereArray = {...whereArray , brand_id: {
                [Sequelize.Op.in]:  brand_id.split(',')
                }
            }
        }

        // if keyword here then filter Data using model name
        if (keyword) { 
            filterCount++
            whereArray = {...whereArray , 
                model_name: {
                    [Op.like] :`%${keyword}%`
                }
            }
        }

        // if budget here then filter Data using model name
        if(budget){
            let budgetFilter= budget.split(',')
            filterCount += budgetFilter.length
            if(budgetFilter.length){
                let minPriceQuery = []

                for (const element of budgetFilter) {
                    const budgetList = element.split('-');
                    let minPrice = budgetList[0] && budgetList[0]
                    let maxPrice = budgetList[1] ? budgetList[1]  : ''
                          
                    if(minPrice){
                        if (maxPrice != "") {
                            minPriceQuery.push({  [Op.and]: [
                                    { min_price: { [Op.gt]: minPrice } },
                                    { min_price: { [Op.lt]: maxPrice } }
                                  ]})
                        }else{
                            minPriceQuery.push(
                                { min_price: { [Sequelize.Op.gte]: minPrice } }
                            )
                        }
                    }
                }
                whereArray={...whereArray,
                    [Op.or]:minPriceQuery}
            }
        }

        // if popularity then check popular_count ,is_latest,search_count
        if(popularity){
            const popularityNames = popularity.split(',')
            filterCount += popularityNames.length;
            let popularityQuery = []
            for (let i = 0; i < popularityNames.length; i++) {
                const element = popularityNames[i];
                if(element === "is_popular_search"){
                    orderBy.push(['popular_count', 'DESC'])
                }
                if(element === "is_upcoming"){
                    popularityQuery.push({is_upcoming:1})
                }
                if(element === "is_latest"){
                    popularityQuery.push({is_latest:1})
                }
                if(element === "is_recommended"){
                    orderBy.push(['search_count', 'DESC'])
                }
                if(element === "is_most_search"){
                    orderBy.push(['search_count', 'DESC'])
                }
                
            }
            if(popularityQuery.length){
                whereArray={...whereArray,
                    [Op.or]:popularityQuery}
            }
            
        }


        //if fuel_type 
        if(fuel_type){
            let fuelTypeQuery = []
            const fuleTypesCategory = fuel_type.split(',')
            filterCount += fuleTypesCategory.length;
            for (const element of fuleTypesCategory) {
                if(element !== "All" && element !== "ALL"){
                    fuelTypeQuery.push( {
                            [Op.like] :`%${element}%`
                        }                     
                    )
                }
            }
            whereArray={...whereArray,
                fuel_type : {
                    [Op.or]:fuelTypeQuery 
                }
            }
        }

        // if vehicle_type_id here then filter Data using bodytype_id
        if(vehicle_type_id){
            filterCount += vehicle_type_id.split(',').length;
            whereArray = {...whereArray , bodytype_id: {
                [Sequelize.Op.in]:  vehicle_type_id.split(',')
                }
            }
        }

        // if sort here then sort Data 
        if(sort){
            if (sort === 'price_low_to_high') {
                filterCount++;
                orderBy.push(['min_price', 'ASC'])
            }
            if (sort === 'price_high_to_low') {
                filterCount++;
                orderBy.push(['min_price', 'DESC'])
            }
            if (sort === 'mileage_low_to_high') {
                filterCount++;
                whereArray = {...whereArray , 
                    is_upcoming: {
                        [Op.ne]: 1
                      }
                }
                orderBy.push(['mileage', 'ASC'])
            }
            if (sort === 'mileage_high_to_low') {
                filterCount++;
                whereArray = {...whereArray , 
                    is_upcoming: {
                        [Op.ne]: 1
                      }
                }
                orderBy.push(['mileage', 'DESC'])
            }
        }

        if(limit && limit > 0){
            offset =  (page - 1) * limit
        }
        const vehicleData = await VehicleInformation.findAll({
            where:{
                ...whereArray,
            },
            offset:offset,
            limit:limit,
            attributes:['id', 'category_id', 'brand_id', 'model_name', 'fuel_type', 'avg_rating', 'review_count', 'price_range', 'image', 'engine', 'max_power', 'mileage', 'is_popular_search', 'is_upcoming', 'is_latest', 'min_price', 'bodytype_id'],
            order:orderBy,

        })
        const totalCount = await VehicleInformation.count({
            where:{
                ...whereArray,
            },
        })

        // Calculate the total number of pages
        const totalPages = Math.ceil(totalCount / limit);

        // Calculate the last page number
        const lastPage = totalPages || 1;

        const getFilterResult= await getFilterArray(cat_id)

        const resp={
            status: true,
            response_code: 200,
            response_message: "Data Found Successfully",
            data: vehicleData,
            filter:getFilterResult,
            page:page,
            total_page:totalPages ? totalPages : 1,
            total_filter:filterCount
        }
        const cacheResult = await redisClient.get('vasu_see_all_vehicle');
        if (cacheResult) {
            await redisClient.del('vasu_see_all_vehicle');
        }
        res.send(resp)
    } catch (error) {
        console.log("-error", error);
       res.send({
        status: false,
        message: "Error Eccoured !"
       })
    }
}

































const getFilterArray = async(category_id) =>{
    let brandData = await VehicleInformation.findAll({
        where:{
            category_id: category_id,
            is_content_writer:1,
            is_designer:1,
            deleted_at :null
        },
        attributes:[
            [Sequelize.fn('DISTINCT', Sequelize.col('brand_id')) ,'brand_id'],
            'brand_id']
    })
    let categoryIds = brandData.map((s) => s.brand_id)
    let brands = await Brands.findAll({
        where:{
            category_id : category_id,
            deleted_at :null,
            id:{    
                [Op.in] : categoryIds
            }
        },
        attributes: ['id', 'category_id', 'name', ['logo' ,'image']]
    }) 
    const ranges = getRanges(category_id);

    let rangeArray =[]
    for (const element of ranges) {
        const ex = element.split('-');
        const minValue = ex[0] || 0;
        const maxValue = ex[1] || 0;
        // let minRange = await utils.priceRangeToWords(minValue);
        // let maxRange = await utils.priceRangeToWords(maxValue);
        let minRange = await utils.priceIntoWord(minValue,category_id);
        let maxRange = await utils.priceIntoWord(maxValue,category_id);

        // priceIntoWord
        let range;

        if (category_id == 4 || category_id == 5) {
            if (maxRange === 0) {
              range = `Above $${minRange}`;
            } else {
              if (minRange === 0) {
                range = `Below $${maxRange}`;
              } else {
                range = `$${minRange} To $${maxRange}`;
              }
            }
          } else {
            if (maxRange === 0) {
              range = `Above ${minRange}`;
            } else {
              if (minRange === 0) {
                range = `Below ${maxRange}`;
              } else {
                range = `${minRange} To ${maxRange}`;
              }
            }
          }
          
        const resultData = {
            name: range,
            id: element,
            category_id :0,
            image: ""
        };
        rangeArray.push(resultData);

    }


    // $fuelTypeData = VehicleInformation::select('fuel_type')->where('category_id', $category_id)->where('fuel_type', '!=', "NA")->where('category_id', $category_id)->where('is_content_writer', 1)->where('is_designer', 1)->distinct()->get();
    let fuelTypeData = await VehicleInformation.findAll({
        where:{
            category_id : category_id,
            fuel_type: {
                [Op.ne]: "NA"
            },
            is_content_writer:1,
            is_designer:1,
            deleted_at:null

        },
        attributes:[
            [Sequelize.fn('DISTINCT', Sequelize.col('fuel_type')) ,'fuel_type'],
            'fuel_type']
    })
    
    let fuelArray = [];
    fuelTypeData.forEach((singleFuelType, key) => { 
        if (singleFuelType.fuel_type!== "Diesel/Petrol" && singleFuelType.fuel_type!== "Diesel/Petrol/CNG" && singleFuelType.fuel_type!== "Petrol/CNG") {
            let img = "";
            const fuelTypeToUpperCase = singleFuelType.fuel_type.toUpperCase() 
            if (fuelTypeToUpperCase === "PETROL") {
              img = "https://dairylock.sgp1.digitaloceanspaces.com/RTO_Application/fuel/ic_petrol.png";
            } else if (fuelTypeToUpperCase === "ELECTRIC") {
              img = "https://dairylock.sgp1.digitaloceanspaces.com/RTO_Application/fuel/ic_electic.png";
            } else if (fuelTypeToUpperCase === "DIESEL") {
              img = "https://dairylock.sgp1.digitaloceanspaces.com/RTO_Application/fuel/ic_diesel.png";
            } else if (fuelTypeToUpperCase === "CNG") {
              img = "https://dairylock.sgp1.digitaloceanspaces.com/RTO_Application/fuel/ic_cng.png";
            } else if (fuelTypeToUpperCase === "LPG") {
              img = "https://dairylock.sgp1.digitaloceanspaces.com/RTO_Application/fuel/ic_LPG.png";
            } else {
              img = "";
            }
            fuelArray.push( {
              name: singleFuelType.fuel_type,
              id: singleFuelType.fuel_type,
              category_id: 0,
              image: img
            })
          }
    })
    let filterData =[]
    if(fuelArray.length > 1){
        filterData.push({
            lable : "FUEL TYPE",
            key :'fuel_type',
            data_list: fuelArray
        })
    }
    let sortingArray
    if(category_id ==1 || category_id == 2){
        sortingArray = [
            {
              name: "Price High To Low",
              id: "price_high_to_low",
              category_id: 0,
              image: ""
            },
            {
              name: "Price Low To High",
              id: "price_low_to_high",
              category_id: 0,
              image: ""
            },
            {
              name: "Mileage High To Low",
              id: "mileage_high_to_low",
              category_id: 0,
              image: ""
            },
            {
              name: "Mileage Low To High",
              id: "mileage_low_to_high",
              category_id: 0,
              image: ""
            }
          ];
    }else{
        sortingArray = [
            {
              name: "Price High To Low",
              id: "price_high_to_low",
              category_id: 0,
              image: ""
            },
            {
              name: "Price Low To High",
              id: "price_low_to_high",
              category_id: 0,
              image: ""
            }
          ];
    }

    let sorting = {
            lable : "Sorting",
            key : "sort",
            data_list: sortingArray
        }
    const popularityArray = [
        {
            name: "Latest",
            id: "is_latest",
            category_id: 0,
            image: ""
        },
        {
            name: "Upcoming",
            id: "is_upcoming",
            category_id: 0,
            image: ""
        },
        {
            name: "Popular",
            id: "is_popular_search",
            category_id: 0,
            image: ""
        },
        {
            name: "Most Search",
            id: "is_most_search",
            category_id: 0,
            image: ""
        },
        {
            name: "Recommend",
            id: "is_recommended",
            category_id: 0,
            image: ""
        }
        ];

    let popularity = {
        lable : "Popularity",
        key : "popularity",
        data_list: popularityArray
    }

    const bodytypeArray = await BodyTypes.findAll({
        where:{
            category_id :category_id,
            deleted_at:null
        },
        attributes: ['id', 'category_id','name','image']
    })

    if(bodytypeArray.length){
        filterData.push(
            {
                lable : "Vehicle Type",
                key : "vehicle_type_id",
                data_list: bodytypeArray
            }
        )
    }

    let rangeList =  {
        lable : "Budget",
        key : "budget",
        data_list: rangeArray
    }
    let brandArray =  {
        lable : "Brand",
        key : "brand_id",
        data_list: brands
    }
    filterData.push(brandArray,rangeList,sorting,popularity)
    return filterData
}



const getVehicleIdWiseVehicleInformation = async (vehicleId) => {
    const vehicleResult = await VehicleInformation.findOne({
        where: {
            id: vehicleId
        },
        include: [
            {
                model: VehicleInformationImages,
                as: "vehicle_information_images",
            },
            {
                model: VehicleModelColor,
                as: "vehicles_model_color",
                where: {
                    deleted_at: null
                },
                include: [
                    {
                        model: VehicleModelColorImages,
                        as: "vehicle_model_color_images",
                        where: {
                            deleted_at: null
                        },
                    }
                ]
            },
            {
                model: PriceVariant,
                as: "vehicle_varint_price",
                where: {
                    deleted_at: null
                },
            },
        ],
        order: [
            ['id', 'ASC'],
            [{
                model: VehicleModelColor,
                as: 'vehicles_model_color'
            }, 'id', 'ASC'],
            [Sequelize.col('vehicle_varint_price.id', 'ASC')],
            [Sequelize.col('vehicles_model_color.vehicle_model_color_images.image_position', 'ASC')]
        ]
    }).then((rows) => {
        if (rows) {
            let body = rows.get();
            body.created_at = moment(body.created_at).format('YYYY-MM-DD HH:mm:ss')
            return body
        }
    });

    return vehicleResult
}
const getSearchData = async (categoryId) => {
    const searchData = await Categories.findOne({
        where: {
            id: categoryId,
            deleted_at: null
        },
        include: [{
            model: VehicleInformation,
            as: "letestVehicles",
            where: {
                is_latest: 1,
                is_content_writer: 1,
                is_designer: 1
            },
            attributes: [
                'id',
                'category_id',
                'brand_id',
                'model_name',
                'avg_rating',
                'review_count',
                'price_range',
                'image',
            ],
            limit: 4,
        },
        {
            model: VehicleInformation,
            as: "upcomingVehicles",
            where: {
                is_upcoming: 1,
                is_content_writer: 1,
                is_designer: 1
            },
            attributes: [
                'id',
                'category_id',
                'brand_id',
                'model_name',
                'avg_rating',
                'review_count',
                'price_range',
                'image',
                'launched_at',
            ],
            limit: 4,
        },
        {
            model: VehicleInformation,
            as: "recommendedVehicles",
            where: {
                is_content_writer: 1,
                is_designer: 1
            },
            attributes: [
                'id',
                'category_id',
                'brand_id',
                'model_name',
                'avg_rating',
                'review_count',
                'price_range',
                'image',
                'search_count'
            ],
            order: [
                ['search_count', 'DESC']
            ],
            limit: 4
        }
        ],

    })
    return searchData
}

const getBrandData = async (categoryId, category_name) => {
    let uniqueBrandIds = await VehicleInformation.findAll({
        where: {
            category_id: categoryId,
            is_content_writer: 1,
            is_designer: 1,
            deleted_at: null
        },
        attributes: [
            [Sequelize.fn('DISTINCT', Sequelize.col('brand_id')), 'brand_id'],
            'brand_id'
        ],
    })
    let brandList = []
    if (uniqueBrandIds.length) {
        let Brandids = uniqueBrandIds.map(obj => obj.brand_id);
        brandList = await Brands.findAll({
            where: {
                category_id: categoryId,
                deleted_at: null,
                id: {
                    [Op.in]: Brandids
                }
            },
            attributes: ['id', 'category_id', 'name', 'logo', 'test_drive_link']
        })
    }
    return {
        lable: "Popular Brands",
        filter_key: "brand_id",
        data_list: brandList.length ? brandList : []
    }

}
const getPopularSearch = async (categoryId, category_name) => {
    let popularSearch = {}
    const bodytype = await BodyTypes.findAll({
        where: {
            category_id: categoryId,
            deleted_at: null
        },
        include: [{
            model: VehicleInformation,
            as: "most_search_vehicles",
            where: {
                is_content_writer: 1,
                is_designer: 1,
                deleted_at: null
            },
            attributes: [
                'id',
                'bodytype_id',
                'model_name',
                'price_range',
                'avg_rating',
                'review_count',
                'image',
                'popular_count',
            ],
        },],
        order: [
            ['position', 'ASC'],
            ['id', 'ASC'],
            [{
                model: VehicleInformation,
                as: 'most_search_vehicles'
            }, 'popular_count', 'DESC'],
            [{
                model: VehicleInformation,
                as: 'most_search_vehicles'
            }, 'id', 'ASC'],
        ],
    })
    // .then(result => {
    //     if(result && result.length){
    //         const _result = result.map(row => {
    //             let body = row.get();
    //             if(body.status == 1){
    //                 body.status = true
    //             }
    //             if(body.status == 0){
    //                 body.status = false
    //             }
    //             return body;
    //         });
    //         return _result;
    //     }
    // });
    popularSearch = {
        lable: "The Most Searched " + category_name,
        is_popular_search: 1,
        filter_key: "popularity",
        filter_value: "is_most_search",
        sub_filter_key: "vehicle_type_id",
        data_list: bodytype
    }
    return bodytype.length ? popularSearch : null
}
const getCompareData = async (categoryId, category_name) => {
    let compareData = {}
    const compare = await Compare.findAll({
        where: {
            category_id: categoryId,
            status: 1,
            deleted_at: null
        },
        include: [{
            model: VehicleInformation,
            as: "vehicle1_name",
            required: true,
            attributes: [
                'id',
                'model_name',
                'price_range',
                'image',
                'variant_name'
            ],
            duplicating: false,
        },
        {
            model: VehicleInformation,
            as: "vehicle2_name",
            attributes: [
                'id',
                'model_name',
                'price_range',
                'image',
                'variant_name'
            ],
            required: true
        }
        ],
        attributes: [
            'id',
            'vehicle_id_1',
            'vehicle_id_2',
        ],
        order: [
            ['count', 'DESC'],
        ],
        limit: 10,
        distinct: true,
        duplicating: false,
        group: ['id']
    }, {
        type: Sequelize.QueryTypes.SELECT
    })

    if (compare && compare.length < 1) {
        compareData = null;
    } else {
        compareData = {
            lable: "Compare to Buy The Right " + category_name,
        };
        if (compare.length) {
            for (const element of compare) {
                if (element.vehicle1_name) {
                    let priceVarient1
                    priceVarient1 = await PriceVariant.findOne({
                        where: {
                            vehicle_information_id: element.vehicle1_name.id,
                            deleted_at: null
                        },
                        attributes: [
                            'id',
                            'name'
                        ],
                    }

                    )
                    if (!priceVarient1) {
                        element.vehicle1_name.dataValues.variant_id = element.vehicle_id_1
                    } else {
                        element.vehicle1_name.dataValues.variant_id = priceVarient1.id
                    }
                }
                if (element.vehicle2_name) {
                    let priceVarient2
                    priceVarient2 = await PriceVariant.findOne({
                        where: {
                            vehicle_information_id: element.vehicle2_name.id,
                            deleted_at: null
                        },
                        attributes: [
                            'id',
                            'name'
                        ],
                    })
                    if (!priceVarient2) {
                        element.vehicle2_name.dataValues.variant_id = element.vehicle_id_1
                    } else {
                        element.vehicle2_name.dataValues.variant_id = priceVarient2.id
                    }
                }
            }
            compareData.data_list = compare
        }
    }

    return compareData ? compareData : null

}
const getPopularBudget = async (cat_id, category_name) => {
    let popularVehicleBudget = {}
    const ranges = getRanges(cat_id);
    const result = await VehicleInformation.findAll({
        where: {
            category_id: cat_id,
            is_popular_search: 1,
            is_content_writer: 1,
            is_designer: 1
        },
        attributes: ['id', 'category_id', 'brand_id', 'model_name', 'avg_rating', 'review_count', 'price_range', 'image', 'min_price'],
        order: [
            ['avg_rating', 'DESC']
        ],
    }).then((rows) => {
        if (rows.length) {
            return rows.map((r) => {
                return r.dataValues;
            });
        }
    });

    let rangeArray = [];

    if (result.length) {
        const vehicleData = result.map(user => {
            const minPriceValue = user.min_price;
            for (let i = 0; i < ranges.length; i++) {
                const range = ranges[i];
                const ex = range.split('-');
                const minValue = ex[0] ? parseFloat(ex[0]) : null;
                const maxValue = ex[1] ? parseFloat(ex[1]) : null;
                if ((minValue !== "" || minValue == 0) && maxValue) {
                    if (minValue <= minPriceValue && minPriceValue <= maxValue) {
                        user.range = i;
                        break;
                    }
                } else if ((minValue !== "" || minValue == 0) && !maxValue) {
                    if (minValue <= minPriceValue) {
                        user.range = i;
                        break;
                    }
                }
            }
            return user;
        }).reduce((group, arr) => {
            const { range } = arr;
            group[range] = group[range] ?? [];
            group[range].push(arr);
            return group;
        },
            {})
        for (let key in vehicleData) {
            const ex = ranges[key].split('-');
            const minValue = ex[0] || 0;
            const maxValue = ex[1] || 0;
            // let minRange = await  utils.priceRangeToWords(minValue);
            // let maxRange = await utils.priceRangeToWords(maxValue);
            let minRange = await utils.priceIntoWord(minValue, cat_id);
            let maxRange = await utils.priceIntoWord(maxValue, cat_id);
            let range;
            if (cat_id == 4 || cat_id == 5) {
                if (maxRange === 0) {
                    range = `Above $${minRange}`;
                } else {
                    if (minRange === 0) {
                        range = `Below $${maxRange}`;

                    } else {
                        range = `$${minRange} To $${maxRange}`;

                    }
                }
            } else {
                if (maxRange === 0) {
                    range = `Above ${minRange}`;
                } else {
                    if (minRange === 0) {
                        range = `Below ${maxRange}`;
                    } else {
                        range = `${minRange} To ${maxRange}`;
                    }
                }
            }
            const resultData = {
                label: range,
                value: ranges[key],
                //   lists: vehicleData[key]
                lists: vehicleData[key].length ? vehicleData[key].slice(0, 4) : vehicleData[key]
            };
            rangeArray.push(resultData);
        }

        popularVehicleBudget.lable = `Popular New${category_name} by Budget`;
        popularVehicleBudget.filter_key = "popularity";
        popularVehicleBudget.filter_value = "is_popular_search";
        popularVehicleBudget.sub_filter_key = "budget";
        popularVehicleBudget.data_list = rangeArray;
    }



    return rangeArray.length ? popularVehicleBudget : null

}

function getRanges(cat_id) {
    if (cat_id == 1) {
        return [
            '0-15000',
            '15000-30000',
            '30000-50000',
            '50000-70000',
            '70000-100000',
            '100000-200000',
            '200000-500000',
            '500000'
        ];
    } else if (cat_id == 2) {
        return [
            '0-200000',
            '200000-300000',
            '300000-500000',
            '500000-1000000',
            '1000000-2000000',
            '2000000-5000000',
            '5000000-10000000',
            '10000000'
        ];
    } else if (cat_id == 3) {
        return [
            '0-500000',
            '500000-1000000',
            '1000000-1500000',
            '1500000-2000000',
            '2000000-3000000',
            '3000000-5000000',
            '5000000'
        ];
    } else if (cat_id == 4) {
        return [
            '0-1000000',
            '1000000-2000000',
            '2000000-3000000',
            '3000000-4000000',
            '4000000-5000000',
            '5000000'
        ];
    } else if (cat_id == 5) {
        return [
            '0-5000000',
            '5000000-6000000',
            '6000000-7000000',
            '7000000-8000000',
            '8000000-9000000',
            '9000000'
        ];
    } else {
        return [
            '0-3000000',
            '3000000-4000000',
            '4000000-5000000',
            '5000000'
        ];
    }
}
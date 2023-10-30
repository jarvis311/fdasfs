import {
    Op,
    Sequelize,
    where
} from "sequelize"
import NewsHeadline from "../../models/NewsHeadline.js";
import utils from "../../helpers/utils.js";

const newsCategoryHeadline = async(req,res) =>{
  try{
    const input = req.body;
    let show = false; // Default value for show
  
    if (input.rto) {
      show = true;
    }
  
    let limit = 10; // Default value for limit
    if (input.limit && parseInt(input.limit) > 0) {
      limit = parseInt(input.limit);
    }

    let page = 1; // Default value for limit
    if (input.page && parseInt(input.page) > 0) {
      page = parseInt(input.page);
    }
  
    let cat_id;
    if (input.cat_id) {
      cat_id = input.cat_id;
    }

    const currentDate = new Date().toISOString().slice(0, 10);

    var totalCount = await NewsHeadline.count({
        where:{
            status: 1,
        deleted_at:null,
        },
    })

      // Calculate the total number of pages
      const totalPages = Math.ceil(totalCount / limit);

    const offset = (page - 1) * limit;

    var newsData = await getNewsCatData(cat_id, currentDate,limit,offset)

    const response={
        status: true,
        response_code: 200,
        response_message: "Data Found Successfully",
        data: newsData,
        page:page,
        total_page:totalPages ? totalPages : 1,
    }
    let responseData = utils.encrypt(response,show)
          return res.send(responseData)  
    
  }catch(error)
  {
    console.log("Error in fetching the data", error);
  }
}

async function getNewsCatData(cat_id, currentDate,limit,offset) {
    try {
      let whereClause = {
        status: 1,
        deleted_at:null,
        [Op.and]: [
            Sequelize.literal(`FIND_IN_SET(${cat_id}, category_id)`),
          ],
        index: {
          [Op.gt]: 0,
        },
      };
  
      if (process.env.IS_NEWS_STAGING !== 'true') {
        whereClause.date = {
          [Op.lte]: currentDate,
        };
      }
     
      const newsCatData = await NewsHeadline.findAll({
        attributes: ['id', 'index', 'category_id', 'title', 'description', 'date', 'image', 'status', 'news_url'],
        where: whereClause,
        order: [['index', 'DESC']],
        limit,
        offset
      });
      return newsCatData;
    } catch (error) {
      console.error('Error fetching news data:', error);
      throw error;
    }
  }

  const newsSearch = async (req,res)=>{
    try{
        const input = req.body;
      
        let show = false; // Default value for show
      
        if (input.rto) {
          show = true;
        }
      
        let limit = 10; // Default value for limit
        if (input.limit && parseInt(input.limit) > 0) {
          limit = parseInt(input.limit);
        }
    
        let page = 1; // Default value for limit
        if (input.page && parseInt(input.page) > 0) {
          page = parseInt(input.page);
        }
        const offset = (page - 1) * limit;
        
        const whereClause = {
          status: 1,
          title: {
            [Op.like]: `%${input.news}%`,
          },
        };

        const newsData = await NewsHeadline.findAll({
            attributes: ['id', 'index', 'category_id', 'title', 'description', 'date', 'image', 'status', 'news_url'],
            where: whereClause,
            limit: limit,
            offset: offset,
            order: [['index', 'DESC']],
          })

          const totalRecords = await NewsHeadline.count({
            where: whereClause,
            limit: limit,
            offset: offset,
            order: [['index', 'DESC']],
          });
          
          const totalPages = Math.ceil(totalRecords / limit);

          const response={
            status: true,
            response_code: 200,
            response_message: "Data Found Successfully",
            data: newsData,
            page:page,
            total_page:totalPages ? totalPages : 1,
        }
        let responseData = utils.encrypt(response,show)
          return res.send(responseData)  
    }
    catch(error){
        console.error('Error fetching news data:', error);
        throw error;
    }
  }

export default {newsCategoryHeadline,newsSearch}
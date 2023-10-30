import db from "../../models/index.js"
const getAllAdType = async (req, res) => {
    try {
        const adTypeData = await db.AdType.findAll()
        return res.json({
            status: true,
            message: "Data Found SuccessFully !",
            data: adTypeData
        })
    } catch (error) {
        console.log("error --->", error);
        return res.json({
            status: false,
            message: "Error Eccoured !"
        })
    }
}

export default {
    getAllAdType
};
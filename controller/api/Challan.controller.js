import { Sequelize } from "sequelize";
import Challan from "../../models/Challan.js";
import ChallanOffence from "../../models/ChallanOffence.js";
import db from "../../config/database.js"
import utils from "../../helpers/utils.js";

export const getChallanDetailsController = async (req, res) => {

    try {
        let { reg_number, chassis_no } = req.body

        let rto = req.body.hasOwnProperty('rto');

        if (!reg_number || reg_number === '') {
            const response = utils.encrypt(({
                status: false,
                response_code: 400,
                response_message: 'reg_number field Required',
            }), rto);
            return res.send(response);
            // return res.json((response, show));
        }

        reg_number = reg_number.toUpperCase();

        const stateDigits = reg_number.substring(0, 2);
        const checkStateDigits = !isNaN(stateDigits);

        if (checkStateDigits == true) {
            state = reg_number.substring(2, 4);
            if (state !== 'BH') {
                const data3 = [];
                const response = utils.encrypt(({
                    status: true,
                    response_code: 404,
                    response_message: "Data not found!!",
                    data: [],
                }), rto);
                return res.send(response);
            }
        }

        if (chassis_no && chassis_no !== '') {
            await challan_api_call(reg_number, chassis_no)
                .then((challan) => {
                    if (challan.status == true) {
                        const response = utils.encrypt(({
                            status: true,
                            response_code: 200,
                            response_message: "Success",
                            data: challan.data,
                        }), rto);
                        return res.send(response);
                    }
                });
        } else {
            // const existRegisterNumber = await Challan.findOne({ reg_no: reg_number })

            try {
                const query = `SELECT * FROM ${stateDigits.toLowerCase()} WHERE reg_no = :reg_number`;

                const [checkRcDetails, metadata] = await db.Vehicle.query(query, {
                    replacements: { reg_number: reg_number },
                    type: Sequelize.QueryTypes.SELECT
                });

                if (checkRcDetails && checkRcDetails?.chasi_no && !isNaN(checkRcDetails.chasi_no.slice(-5))) {
                    await challan_api_call(reg_number, checkRcDetails.chasi_no.slice(-5))
                        .then((challan) => {
                            if (challan.status === true) {
                                const response = utils.encrypt(({
                                    status: true,
                                    response_code: 200,
                                    response_message: 'Success',
                                    data: JSON.parse(challan.data)
                                }), rto);
                                return res.send(response);
                                // return res.json(encrptSSL(newResponseWithDataArray(challan.data), show));
                            }
                        });
                } else {
                    try {
                        const challanDetails = await Challan.findOne({
                            where: { reg_no: reg_number },
                            include: [{
                                model: ChallanOffence,
                                as: "ChallanOffence"
                            }]
                        });

                        if (challanDetails) {
                            const response = utils.encrypt(({
                                status: true,
                                response_code: 200,
                                response_message: "Success",
                                data: challanDetails,
                            }), rto);
                            return res.send(response);
                        } else {
                            const response = utils.encrypt(({
                                status: true,
                                response_code: 404,
                                response_message: "Data not found!!",
                                data: [],
                            }), rto);
                            return res.send(response);
                        }
                    } catch (error) {
                        console.log('Error >>>', error.message)
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

                }
            } catch (error) {
                console.log('Error >>>', error.message)
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

        }

        async function challan_api_call(reg_number, chassis_no) {
            console.log('Axiios require', reg_number, chassis_no)
            const url = "https://vahanmaster.com/challan.php";
            const postData = {
                veh_no: reg_number,
                chassis_no: chassis_no,
                eng_no: '',
            };
            try {

                let result = response
                try {
                    const response = await fetch(url, {
                        method: "POST",
                        body: postData,
                    });
                    result = response
                } catch (error) {
                    console.log('Error >>>', error.message)
                    const response = utils.encrypt(({
                        status: false,
                        response_code: 400,
                        response_message: 'Something went wrong!!',
                    }), rto);
                    res.send(response)
                }

                if (result && result.status === "Success") {
                    for (const data of result.results) {
                        const checkChallan = await Challan.findOne({
                            where: {
                                reg_no: reg_number,
                                challan_no: data.challan_no
                            }
                        });
                        if (!checkChallan) {
                            const array = {
                                reg_no: reg_number,
                                violator_name: data.accused_name || "NA",
                                dl_rc_no: data.doc_no || "NA",
                                challan_no: data.challan_no || "NA",
                                challan_date: data.date_time ? new Date(data.date_time) : "NA",
                                challan_amount: data.amount || "NA",
                                challan_status: data.challan_status || "NA",
                                challan_payment_date: data.payment_date ? new Date(data.payment_date) : "NA",
                                transaction_id: data.transaction_id || "NA",
                                payment_source: data.payment_source || "NA",
                                challan_url: data.pdf_url || "NA",
                                receipt_url: data.receipt_url || "NA",
                                payment_url: "NA",
                                state: data.state_code || "NA",
                                date: new Date()
                            };
                            const challan = await Challan.create(array);

                            const offenceData = Array.from(new Set(data.offences));

                            for (const offence of offenceData) {
                                const offenceArray = {
                                    challan_id: challan.id,
                                    offence_name: offence.offence_name || "NA",
                                    mva: offence.mva || "NA",
                                    penalty: offence.penalty || "NA"
                                };
                                await ChallanOffence.create(offenceArray);
                            }
                        }
                    }
                }
                const challanDetails = await Challan.findOne({
                    where: { reg_no: reg_number },
                    include: [{
                        model: ChallanOffence,
                        as: "ChallanOffence"
                    }]
                });
                if (challanDetails) {
                    const response = utils.encrypt(({
                        status: true,
                        response_code: 200,
                        response_message: "Success",
                        data: challanDetails,
                    }), rto);
                    return res.send(response);
                } else {
                    const response = utils.encrypt(({
                        status: true,
                        response_code: 404,
                        response_message: "Data not found!!",
                        data: [],
                    }), rto);
                    return res.send(response);
                }

            } catch (error) {
                console.log('Error -->>', error.message)
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
        }

    } catch (error) {
        console.log('Error -->>', error.message)
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
}

export const createChallanDetailsController = async (req, res) => {
    try {
        let { data } = req.body;
        let rto = req.body.hasOwnProperty('rto');

        if (!data || data === '') {
            const response = utils.encrypt(({
                status: false,
                response_code: 400,
                response_message: 'data Field Required',
            }), rto);
            return res.send(response);
        }
        let state
        for (const item of JSON.parse(data)) {
            let reg_number = "NA";
            state = "NA";
            if (item.reg_no) {
                reg_number = item?.reg_no?.toUpperCase();
                state = reg_number.substring(0, 2);
            }
            const checkChallan = await Challan.findOne({ where: { challan_no: data.challan_no || 0 } });

            if (!checkChallan) {
                const array = {
                    reg_no: reg_number,
                    violator_name: item.violator_name || "NA",
                    dl_rc_no: item.dl_rc_no || reg_number,
                    challan_no: item.challan_no || "NA",
                    challan_date: item.challan_date || "NA",
                    challan_amount: item.challan_amount || "NA",
                    challan_status: item.challan_status || "NA",
                    challan_payment_date: item.challan_payment_date || "NA",
                    transaction_id: item.transaction_id || "NA",
                    payment_source: item.payment_source || "NA",
                    challan_url: item.challan_url || "NA",
                    receipt_url: item.receipt_url || "NA",
                    payment_url: "NA",
                    state: state,
                    date: new Date().toLocaleString(),
                };
                await Challan.create(array);
            }
        }
        const response = utils.encrypt(({
            status: true,
            response_code: 200,
            response_message: "Challan Store Successfully",
        }), rto);
        return res.send(response);
    }
    catch (error) {
        console.log('Error -->', error)
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

}
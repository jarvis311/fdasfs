
import { Sequelize } from "sequelize";
import db from "../../config/database.js"
import utils from "../../helpers/utils.js";


// Start 25-10-23 by Jignesh Patel
export const RCDetailsApiController = async (req, res) => {

    let rto = req.body.hasOwnProperty('rto');
    try {
        let { type, version_code, reg_number, is_skip_db, user_id } = req.body;

        let logResponse = "";
        const key = 'V@$undh@r@50599#';
        const versioncode = version_code || '';
        const appType = type || '';
        if (appType === 'ios') {
            version_code = 6.5;
        } else {
            version_code = 9.1;
        }
        if (!reg_number || !/^[a-zA-Z0-9]+$/.test(reg_number?.toUpperCase()) || reg_number == "") {
            const response = utils.encrypt(({
                status: false,
                response_code: 400,
                response_message: 'Enter_Proper_Number',
            }), rto);
            return res.send(response);
        }

        const registrationNumber = reg_number?.toUpperCase();

        const state = registrationNumber.substring(0, 2);
        const checkState = !isNaN(state);

        if (checkState) {
            const stateSubstring = input.reg_number.substring(2, 4);
            if (stateSubstring !== "BH") {
                const response = utils.encrypt(({
                    status: false,
                    response_code: 400,
                    response_message: 'reg_number Field Required',
                }), rto);
                return res.send(response);
            }
        }
        const skipdb = is_skip_db || "";

        const newRegFirstTwoChar = reg_number.slice(0, 2)?.toUpperCase()

        const stateArray = ['AN', 'AP', 'AR', 'AS', 'BR', 'CH', 'CG', 'DD', 'DL', 'GA', 'GJ', 'HR', 'HP', 'JK', 'JH', 'KA', 'KR', 'KL', 'LA', 'LD', 'MP', 'MH', 'MN', 'ML', 'MZ', 'NL', 'OD', 'PY', 'PB', 'RJ', 'SK', 'TN', 'TS', 'TR', 'UP', 'UK', 'WB'];
        const checkIsState = stateArray.includes(newRegFirstTwoChar)

        // CHECK IF STATE IS PRESENT IN DATABASE  
        if (checkIsState) {
            const query = `SELECT * FROM ${newRegFirstTwoChar.toLowerCase()} WHERE reg_no = :reg_number`;
            const [results, metadata] = await db.Vehicle.query(query, {
                replacements: { reg_number: reg_number },
                type: Sequelize.QueryTypes.SELECT
            });
            // Check Maker model in vehicle information 

            if (results) {
                let rcBlockStatus
                let categoryId

                // Check RC is block or not through RCBlock status
                try {
                    if (reg_number) {
                        const query = `SELECT * FROM rc_block WHERE reg_no = :reg_number`;
                        const [resultsOfRcBlock, metadataOfRcBlock] = await db.Vehicle.query(query, {
                            replacements: { reg_number: reg_number },
                            type: Sequelize.QueryTypes.SELECT,
                            raw: true
                        });

                        if (resultsOfRcBlock) {
                            if (resultsOfRcBlock.status == 1) {
                                rcBlockStatus = true
                            } else {
                                rcBlockStatus = false
                            }
                        } else {
                            rcBlockStatus = false
                        }
                    }
                } catch (error) {
                    console.log('Error ===>', error)
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
                // Check vehicle Image in vehicle_information table
                try {
                    if (results?.maker_modal) {
                        if (
                            ['M-CYCLE/SCOOTER (2WN)', 'M-Cycle/Scooter(2WN)', 'Moped(2WN)']
                                .map(item => item.toLowerCase())
                                .includes(results.vh_class.toLowerCase())
                        ) {
                            categoryId = 1;
                        } else if ('Motor Car(LMV)'.toLowerCase() == results.vh_class) {
                            categoryId = 2;
                        } else {
                            categoryId = 3;
                        }
                        const vehicleInfoquery = ` 
                            SELECT * FROM vehicle_information
                            WHERE category_id = :categoryId
                            AND model_name LIKE :modelName
                            `;
                        let model_name = results?.maker_modal
                        const [resultsOfInformation, meta] = await db.Vehicle.query(vehicleInfoquery, {
                            replacements: { categoryId: categoryId, modelName: `%${model_name}%` },
                            type: Sequelize.QueryTypes.SELECT,
                            raw: true
                        });
                        if (resultsOfInformation) {
                            results.image = resultsOfInformation.image
                        } else {
                            results.image = ""
                        }
                    } else {
                        results.image = ""
                    }

                    // Check rc_block status 
                    if (results != null) {
                        let tempArrayData = [];

                        let owner_name = results?.owner_name;
                        let chsNo = results?.chasi_no;
                        let engNO = results?.engine_no;
                        let source = results?.source;

                        if (owner_name == "NA" && appType == "ios") {
                            results.owner_name = "Not Available";
                        }
                        delete results.parivahan_json
                        delete results.own_json

                        if (results.regn_dt == null) {
                            results.regn_dt = "0000-00-00";
                        }
                        if (results.updated_at == null) {
                            results.updated_at = "0000-00-00";
                        }
                        results.is_rc_block = rcBlockStatus
                    } else {
                        // hande scrapping apis 
                    }

                    if (user_id && user_id !== "") {

                        results.fitness_upto_reminder = false;
                        results.insurance_reminder = false;
                        results.puc_reminder = false;
                        results.is_dashboard = false;

                        const reg_number = registrationNumber
                        const rcRemainderQuery = "SELECT * FROM `rc_reminder` WHERE `user_id` = :user_id AND `reg_number` LIKE :reg_number"
                        const [rcRemainderResults, metadata] = await db.Vehicle.query(rcRemainderQuery, {
                            replacements: { reg_number: reg_number, user_id: user_id },
                            type: Sequelize.QueryTypes.SELECT
                        });
                        // console.log('rcRemainderResults >>>', rcRemainderResults)

                        if (rcRemainderResults.doc_type == 3) {
                            results.puc_reminder = true;
                        }
                        if (rcRemainderResults.doc_type == 2) {
                            results.insurance_reminder = true;
                        }
                        if (rcRemainderResults.doc_type == 7) {
                            results.fitness_upto_reminder = true;
                        }
                        const userRegistrationQurry =
                            `   SELECT id, vehicle_number 
                            FROM user_registration
                            WHERE id = :user_id AND FIND_IN_SET('${reg_number}', vehicle_number)
                    `
                        const [userRegistrationResult, registrationMetadata] = await db.Vehicle.query(userRegistrationQurry, {
                            replacements: { user_id: user_id },
                            type: Sequelize.QueryTypes.SELECT
                        });
                        if (userRegistrationResult) {
                            results.is_dashboard = true
                        }
                        const respose = await GetUserDocument(reg_number, user_id, userRegistrationResult)
                        results.userDocument = respose

                    } else {
                        if (user_id && user_id != '') {
                            // store_user_vehicle(req.body);
                        }
                        const response = utils.encrypt(({
                            status: true,
                            response_code: 200,
                            response_message: 'already exist',
                            data: results,
                        }), rto);

                        return res.send(response);
                    }

                    const response = utils.encrypt(({
                        status: true,
                        response_code: 200,
                        response_message: 'already exist',
                        data: results,
                    }), rto);

                    return res.send(response);
                } catch (error) {
                    console.log("Error ===>", error)
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
            } else {
                if (skipdb && skipdb == "true") {

                    const registration_no = "ABCD1234"; // Replace with your actual registration number

                    const reg1 = registration_no.slice(0, -4).toUpperCase();
                    const reg2 = registration_no.slice(-4).toUpperCase();
                    const loginpassw = "somish:Vasundhara_1234"
                    const proxyArray = ["us-wa.proxymesh.com:31280", "fr.proxymesh.com:31280", "jp.proxymesh.com:31280", "au.proxymesh.com:31280", "de.proxymesh.com:31280", "nl.proxymesh.com:31280", "sg.proxymesh.com:31280", "us-il.proxymesh.com:31280", "us.proxymesh.com:31280", "us-ca.proxymesh.com:31280"]
                    // const proxy_rendom = ren
                    // handle scrapping apis 
                }

            }
        } else {
            return res.send(
                utils.encrypt(
                    {
                        status: false,
                        message: "Data_Not_Found",
                    },
                    req.body.hasOwnProperty("rto")
                )
            );
        }



    }
    catch (error) {
        console.log("Error -->", error)
        return res.send(
            utils.encrypt(
                {
                    status: false,
                    message: "Data_Not_Found",
                },
                req.body.hasOwnProperty("rto")
            )
        );
    }


}


async function GetUserDocument(reg_number, user_id, userRegistrationResult) {

    let res = {
        vehicle_driving_licence: [],
        vehicle_insurance: [],
        vehicle_pollution: [],
        vehicle_rc: [],
        vehicle_serviceLog: [],
        vehicle_other_document: []
    };

    const query = `
            SELECT id, vehicle_number, image, title, description, date, count, type
            FROM user_vehicle_document
            WHERE vehicle_number = :regNO AND user_id = :user_id
            `
    const [UserVehicleDocumentResult, metadata] = await db.Vehicle.query(query, {
        replacements: { user_id: user_id, regNO: reg_number },
        type: Sequelize.QueryTypes.SELECT
    });

    const resDocumentArray = [UserVehicleDocumentResult].map(doc => doc);

    if (userRegistrationResult.length === 0) {
        res = null;
    } else {
        resDocumentArray.forEach(val => {
            switch (val.type) {
                case 1:
                    res.vehicle_driving_licence.push(val);
                    break;
                case 2:
                    res.vehicle_insurance.push(val);
                    break;
                case 3:
                    res.vehicle_pollution.push(val);
                    break;
                case 4:
                    res.vehicle_rc.push(val);
                    break;
                case 5:
                    res.vehicle_serviceLog.push(val);
                    break;
                case 6:
                    res.vehicle_other_document.push(val);
                    break;
            }
        });
    }
    return res;
} 
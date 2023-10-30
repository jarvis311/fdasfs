import crypto from "crypto"
import UserRegistration from "../models/UserRegistration.js";
import fs from "fs"

function newErrorResponseWithInvelidInput(message) {
    let response = {
        status: false,
        response_code: 400,
        response_message: message
    }
    return response;
}
function newErrorResponseWithDataArray() {
    let response = {
        status: false,
        response_code: 400,
        response_message:'Data Not Found'
    }
    return response;
}
function newErrorResponseWithDataArrayWithMessage(message) {
    let response = {
        status: false,
        response_code: 404,
        response_message:message
    }
    return response;
}


async function priceRangeToWords(value = 0) {
    const val = Math.abs(value)
    if (val >= 10000000) return `${(value / 10000000).toFixed(2)} Cr`
    if (val >= 100000) return `${(value / 100000).toFixed(2)} Lakh`
    if (val >= 1000) return `${(value / 1000).toFixed(2)} K`
    return val ? val : 0;
}



function encrypt(jsonResponse,show, outputEncoding = "base64") {
    if(show){
        return jsonResponse;
    }else{
        const key = 'V@$undh@r@50599#'
        const cipher = crypto.createCipheriv("aes-128-ecb", key, null);
        return Buffer.concat([cipher.update(JSON.stringify(jsonResponse)), cipher.final()]).toString(outputEncoding) ;
    }
}

async function storeNewVehicle(data) {
    const { user_id, device_id, vehicle_number,reg_number} = data
    let responseUser 
    if(user_id || device_id){
        if(user_id){
            responseUser = await UserRegistration.findOne({
                where:{
                    id: user_id
                }
            })
        }else if(device_id){
            responseUser = await UserRegistration.findOne({
                where:{
                    device_id: device_id
                }
            })
        }

        console.log("=responseUser",responseUser);
        if(responseUser){
            const vehicleNumber = responseUser.vehicle_number.split(",");
            if(vehicleNumber.includes(reg_number)){
                const vehicle_num = responseUser.vehicle_number + "," + reg_number;
                const trimmed_vehicle_num = vehicle_num.replace(/^,|,$/g, "");
                let user ={
                    vehicle_number : vehicle_num
                }
                await UserRegistration.update(user,{
                    where:{
                        id : responseUser.id
                    }
                })
            }
        }else{
            let newUser ={
                device_id: device_id,
                vehicle_number : reg_number
            }
            await UserRegistration.create(newUser)
             .then(user => {
               console.log("===Comparte",user.id);
             })
             .catch(error => {
               console.log("--error",error);
               console.error(error);
             });
        }
    }
}


function count_digit(number) { return number.toString().length; }
function divider(number_of_digits) { 
    let tens = "1"; 
    if (number_of_digits > 8) {
        return 10000000;
    }
    
    while ((number_of_digits - 1) > 0) {
        tens += "0";
        number_of_digits--;
    }
    return tens;
}

async function priceIntoWord(num=0, cat_id) {
    let ext = ""; //thousand, lac, crore
    let number_of_digits = count_digit(num); //this is call :)
    let dividerValue
    let fraction
    if (cat_id == 4 || cat_id == 5) {
      if (number_of_digits > 3) {
        if (number_of_digits % 2 !== 0) {
          dividerValue = divider(number_of_digits);
        } else {
          dividerValue = divider(number_of_digits - 1);
        }
      } else {
        dividerValue = 1;
      }
      fraction = num / dividerValue;
      fraction = Math.round(fraction);

      ext = "M";
    } else {
      if (number_of_digits > 3) {
        if (number_of_digits % 2 !== 0) {
          dividerValue = divider(number_of_digits - 1);
        } else {
          dividerValue = divider(number_of_digits);
        }
      } else {
        dividerValue = 1;
      }
      fraction = num / dividerValue;
      if(fraction !== 0 ){
        fraction = fraction.toFixed(2);
      }
      if (number_of_digits == 4 || number_of_digits == 5) {
        ext = "k";
      }
      if (number_of_digits == 6 || number_of_digits == 7) {
        ext = "Lakh";
      }
      if (number_of_digits == 8 || number_of_digits == 9) {
        ext = "Cr";
      }
    }
    if(fraction === 0 ){
      return fraction
    }else{
      return fraction + " " + ext;
    }
}

async function translate(key,lang) {
  let transLang = lang ? lang : 'en'
  const transalteJson = fs.readFileSync(`public/lang/${transLang}.json`, 'utf8');
  const _result = JSON.parse(transalteJson);
  return _result[key]
}
export default {
    priceRangeToWords,
    priceIntoWord,
    newErrorResponseWithInvelidInput,
    encrypt,
    storeNewVehicle,
    newErrorResponseWithDataArray,
    newErrorResponseWithDataArrayWithMessage,
    translate
}
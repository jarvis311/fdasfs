import CryptoJS from 'crypto-js';
const encryptionKey = 'V@$undh@r@50599#';
import crypto from "crypto"


function decryptValue(encryptedValue) {
    try {
        const key = CryptoJS.enc.Utf8.parse(encryptionKey);
        const bytes = CryptoJS.AES.decrypt(encryptedValue, key, {
            mode: CryptoJS.mode.ECB,
            padding: CryptoJS.pad.Pkcs7,
        });

        const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
        return decryptedData;
    } catch (error) {
        console.error('Decryption Error:', error);
        return null;
    }
}
function decrypt(cipherText, outputEncoding = "utf8") {
    const key = 'V@$undh@r@50599#'
    const cipher = crypto.createDecipheriv("aes-128-ecb", key, null);
    return Buffer.concat([cipher.update(cipherText), cipher.final()]).toString(outputEncoding);
}

function decryptObject(req, res, next) {
    try {
        const encryptedObject = req.body; 
        let decryptedObject = {};
        const files = req.files
        const decryptFiles = {}

        for (const encryptedKey of Object.keys(encryptedObject)) { 
            const encryptedValue = encryptedObject[encryptedKey];
            // const decryptedKey = decryptValue(encryptedKey);
            // const decryptedValue = decryptValue(encryptedValue);
            const decryptedKey =  decrypt(Buffer.from(encryptedKey, "base64"))
            const decryptedValue = encryptedValue ? encryptedValue.startsWith(" ") ? '' : decrypt(Buffer.from(encryptedValue, "base64")) : ''
            decryptedObject[decryptedKey] = decryptedValue;
        }
        if(files){
            for(const encryptFileKey of Object.keys(files)){
                const decryptedKey =  decrypt(Buffer.from(encryptFileKey, "base64"))
                decryptFiles[decryptedKey] = files[encryptFileKey]
            }
            if(decryptFiles){ 
                req.files = decryptFiles
            }
        }
        
        if(decryptedObject.language_key){
            if(decryptedObject.language_key != ""){
                decryptedObject.language_key = decryptedObject.language_key.toLowerCase()
            }else{
                decryptedObject.language_key = "en"
            }
        }else{
            decryptedObject.language_key = "en"
        }
        req.body = decryptedObject;
        next();
    } catch (error) {
        console.log("error",error);
        res.json({status:false,error:'Error Eccourd !'})
    }
    
}


export default decryptObject
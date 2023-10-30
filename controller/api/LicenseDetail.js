import License from "../../models/License.js";
import moment from "moment/moment.js";
import cheerio from "cheerio";
import qs from "qs";
import utils from "../../helpers/utils.js";
// import nodefetch from "node-fetch";

const scrapeData = (htmlData, find, number) => {
  const lines = htmlData.split("\n");
  let lineNumber = 0;

  for (let num = 0; num < lines.length; num++) {
    if (lines[num].includes(find)) {
      if (find === "Registering Authority:") {
        const regAuthority = lines[num].split(": ");
        return regAuthority[1] || "";
      }
      return stripTags(lines[lineNumber + number]).trim();
    } else {
      lineNumber += 1;
    }
  }

  return 0;
};
const stripTags = (input) => {
  return input.replace(/<[^>]*>?/gm, "").trim();
};

const license_info_api_new_auth = async (data) => {
  console.log("====>fun in");
  let home_url = "https://parivahan.gov.in/rcdlstatus/?pur_cd=101";
  let posturl = "https://parivahan.gov.in/rcdlstatus/vahan/rcDlHome.xhtml";
  let license = data.license;
  let dob = moment(data.dob).format("DD-MM-YYYY");
  let response = await fetch(home_url);
  let hometext = await response.text();
  let Set_cookies = response.headers.get("set-cookie");
  let cookiePair = Set_cookies.split(";")[0];
  let cookiearray = cookiePair.split("=");
  let cookies = {};
  let returnData; //GJ2120160016097
  cookies[cookiearray[0]] = cookiearray[1];
  if (cookies[cookiearray[0]].length === 0) {
    returnData = {
      current_status: 0,
    };
  } else {
    let jessionid = cookies["JSESSIONID"].trim();
    console.log("===>", jessionid);
    let headers = {
      "Content-Type": "application/x-www-form-urlencoded",
      Host: "parivahan.gov.in",
      Accept: "application/xml, text/xml, */*; q=0.01",
      "Accept-Language": "en-US,en;q=0.5",
      "Accept-Encoding": "gzip, deflate, br",
      "X-Requested-With": "XMLHttpRequest",
      "Faces-Request": "partial/ajax",
      Origin: "https://parivahan.gov.in",
      Cookie: `JSESSIONID=${jessionid}`,
    };

    const $ = cheerio.load(hometext, {
      xmlMode: true,
    });

    const inputTags = $("input");
    const post_data = {};

    inputTags.each((index, element) => {
      const name = $(element).attr("name");
      const value = $(element).attr("value");
      if (name) {
        post_data[name] = value || "";
      }
    });

    const viewstate = post_data["javax.faces.ViewState"];
    const buttons = $("button");
    let first_left_button_id;

    buttons.each((index, element) => {
      if (index === 1) {
        first_left_button_id = $(element).attr("id");
      }
    });
    console.log("==>button id ", first_left_button_id);
    let postData = qs.stringify({
      "javax.faces.partial.ajax": "true",
      "javax.faces.source": first_left_button_id,
      "javax.faces.partial.execute": "@all",
      "javax.faces.partial.render":
        "form_rcdl:pnl_show form_rcdl:pg_show form_rcdl:rcdl_pnl",
      [first_left_button_id]: first_left_button_id,
      form_rcdl: "form_rcdl",
      "form_rcdl:tf_dlNO": license,
      "form_rcdl:tf_dob_input": dob,
      "javax.faces.ViewState": viewstate,
    });

    try {
      const response = await fetch(posturl, {
        method: "POST",
        headers: headers,
        body: postData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      let responseData = await response.text();
      console.log(responseData);
      function stripTags(input) {
        return input.replace(/<[^>]*>?/gm, "");
      }

      const currentStatus = scrapeData(responseData, "Current Status", 1);
      const holdersName = scrapeData(responseData, "Holder's Name", 1);
      const dateOfIssue = scrapeData(responseData, "Initial Issue Date", 1);
      const lastTransactionAt = scrapeData(
        responseData,
        "Initial Issuing Office",
        1
      );
      const oldNewDLNo = scrapeData(responseData, "Old / New DL No", 1);
      const fromNonTransport = scrapeData(responseData, "Non-Transport", 1);
      const toNonTransport = scrapeData(responseData, "Non-Transport", 2);
      const fromTransport = scrapeData(responseData, ">Transport", 1);
      const toTransport = scrapeData(responseData, ">Transport", 2);
      const hazardousValidTill = scrapeData(
        responseData,
        "Hazardous Valid Till",
        1
      );
      const hillValidTill = scrapeData(responseData, "Hill Valid Till", 1);

      let cov_category1;
      let class_of_vehicle1;
      let cov_issue_date1;

      if (currentStatus !== "0") {
        const tbody = responseData.split("<tbody");
        const end_tbody = tbody[1].split("</tbody>");

        const td = end_tbody[0].split('<td role="gridcell">');
        const datas = [];

        for (let i = 1; i < td.length; i++) {
          datas.push(stripTags(td[i]));
        }

        const cov_category = [];
        const class_of_vehicle = [];
        const cov_issue_date = [];
        let j = 0;
        let k = 1;
        let m = 2;

        for (let i = 0; i < datas.length; i++) {
          if (i === j) {
            cov_category.push(datas[j]);
            j += 3;
          }
          if (i === k) {
            class_of_vehicle.push(datas[k]);
            k += 3;
          }
          if (i === m) {
            cov_issue_date.push(datas[m]);
            m += 3;
          }
        }

        cov_category1 = cov_category.join(", ");
        console.log("====>", cov_category1);
        class_of_vehicle1 = class_of_vehicle.join(", ");
        console.log("====>", class_of_vehicle1);
        cov_issue_date1 = cov_issue_date.join(", ");
        console.log("===>", cov_issue_date1);
      } else {
        const cov_category1 = null;
        const class_of_vehicle1 = null;
        const cov_issue_date1 = null;
      }
      const cov_category = cov_category1;
      const class_of_vehicle = class_of_vehicle1;
      const cov_issue_date = cov_issue_date1;

      console.log("Current Status: " + currentStatus);
      console.log("Holder's Name: " + holdersName);
      console.log("Date Of Issue: " + dateOfIssue);
      console.log("Last Transaction At: " + lastTransactionAt);
      console.log("Old / New DL No.: " + oldNewDLNo);
      console.log("From Non-Transport: " + fromNonTransport);
      console.log("To Non-Transport: " + toNonTransport);
      console.log("From Transport: " + fromTransport);
      console.log("To Transport: " + toTransport);
      console.log("Hazardous Valid Till: " + hazardousValidTill);
      console.log("Hill Valid Till: " + hillValidTill);
      console.log("cov_category", cov_category);
      console.log("class_of_vehicle", class_of_vehicle);
      console.log("cov_issue_date", cov_issue_date);

      returnData = {
        current_status: currentStatus,
        name: holdersName,
        date_of_issue: dateOfIssue,
        last_transaction_at: lastTransactionAt,
        old_new_dl_no: oldNewDLNo,
        from_non_transport: fromNonTransport,
        to_non_transport: toNonTransport,
        from_transport: fromTransport,
        to_transport: toTransport,
        hazardous_valid_till: hazardousValidTill,
        hill_valid_till: hillValidTill,
        cov_category: cov_category,
        class_of_vehicle: class_of_vehicle,
        cov_issue_date: cov_issue_date,
        license_no: license,
      };

      return returnData;
    } catch (error) {
      console.error("Error:", error);
    }
  }
};

const license_info_new_auth = async (req, res) => {
  // console.log(req.body);
  try {
    const { license, dob } = req.body;
    const rto = req.body.hasOwnProperty("rto");
    let Licenseinfodata;
    if (license == undefined || license == "") {
      let resp = utils.encrypt(
        JSON.stringify({ msg: "please provider the license no" }),
        rto
      );
      return res.send(resp);
    }
    if (dob == undefined || dob == "") {
      const data = await License.findAll({
        where: {
          license_no: license.toUpperCase(),
        },
      });
      if (data.length > 0) {
        if (data[0].from_transport == null) {
          data[0].from_transport == "NA";
        }
        if (data[0].to_transport == null) {
          data[0].to_transport == "NA";
        }
        Licenseinfodata = data;

        let resp = utils.encrypt(
          JSON.stringify({
            status: true,
            response_code: 200,
            response_message: "Data Found Successfully",
            data: Licenseinfodata,
          }),
          rto
        );
        return res.send(resp);
      } else {
        let resp = utils.encrypt(
          JSON.stringify({ msg: "Data not found!!!!...." }),
          rto
        );
        return res.send(resp);
      }
    } else if (dob !== "" && dob !== undefined) {
      let dob_date = moment(dob).format("YYYY-MM-DD");
      const data = await License.findAll({
        where: {
          license_no: license.toUpperCase(),
        },
      });
      if (data.length > 0) {
        if (data[0].from_transport == null) {
          data[0].from_transport == "NA";
        }
        if (data[0].to_transport == null) {
          data[0].to_transport == "NA";
        }
        Licenseinfodata = data;
        let resp = utils.encrypt(
          JSON.stringify({
            status: true,
            response_code: 200,
            response_message: "Data Found succesfully!!!!",
            data: Licenseinfodata,
          }),
          rto
        );
        return res.send(resp);
      } else {
        console.log("===>else part ");
        let licensedata = await license_info_api_new_auth(req.body);
        if (licensedata.current_status === 0) {
          let resp = utils.encrypt(
            JSON.stringify({
              status: true,
              response_code: 200,
              response_message: "Data not Found!!!!..",
            }),
            rto
          );
          return res.send(resp);
        }
        licensedata["dob"] = dob_date;
        licensedata.date_of_issue = moment(
          licensedata.date_of_issue,
          "DD-MMM-YYYY"
        ).format("YYYY-MM-DD");
        let new_from_non_transport = licensedata.from_non_transport.split(":");
        licensedata.from_non_transport = moment(
          new_from_non_transport[1],
          "DD-MMM-YYYY"
        ).format("YYYY-MM-DD");
        let new_to_non_transport = licensedata.to_non_transport.split(":");
        licensedata.to_non_transport = moment(
          new_to_non_transport[1],
          "DD-MMM-YYYY"
        ).format("YYYY-MM-DD");
        let new_from_transport = licensedata.from_transport.split(":");
        licensedata.from_transport =
          new_from_transport && new_from_transport.length
            ? new_from_transport[1].trim() == "NA"
              ? null
              : new_from_transport[1].trim()
            : null;
        let new_to_transport = licensedata.to_transport.split(":");
        licensedata.to_transport =
          new_from_transport && new_from_transport.length
            ? new_from_transport[1].trim() == "NA"
              ? null
              : new_from_transport[1].trim()
            : null;
        licensedata.cov_issue_date = moment(
          licensedata.cov_issue_date,
          "DD-MMM-YYYY"
        ).format("YYYY-MM-DD");
        licensedata["license_no"] = license;
        licensedata["gender"] = "NA";
        licensedata["citizen"] = "NA";
        licensedata["blood_group"] = "NA";

        console.log("===>new data is here ", licensedata);

        let finaldatasave = await License.create(licensedata);
        if (finaldatasave) {
          console.log("====> new document save in the database");
        }

        let databasedata = await License.findAll({
          where: {
            license_no: license,
            dob: dob_date,
          },
        });
        if (databasedata) {
          console.log("===>new data found in database ");
        }
        Licenseinfodata = databasedata;
        Licenseinfodata[0].from_transport = null
          ? "NA"
          : Licenseinfodata.from_transport;
        Licenseinfodata[0].to_transport = null
          ? "NA"
          : Licenseinfodata.to_transport;

        let resp = utils.encrypt(
          JSON.stringify({
            status: true,
            response_code: 200,
            response_message: "Data FoundsuccessFully!!",
            data: Licenseinfodata,
          }),
          rto
        );
        return res.send(resp);
      }
    }
  } catch (error) {
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
};

export default {
  license_info_new_auth,
};

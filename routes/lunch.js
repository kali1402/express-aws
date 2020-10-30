const { default: Axios } = require('axios');
var express = require('express');
var router = express.Router();

// 시간
require('date-utils');
var newDate = new Date();
var time = newDate.toFormat('YYYYMMDD');

// env 파일 키
const key = require('dotenv').config().parsed.key;

router.get('/', function (req, res, next) {
    let menu = [];
    Axios.get(`https://open.neis.go.kr/hub/mealServiceDietInfo?KEY=${key}&Type=json&ATPT_OFCDC_SC_CODE=J10&SD_SCHUL_CODE=7530336&MLSV_YMD=${time}`)
        .then(res => {
            const test = res.data.mealServiceDietInfo[1].row[0].DDISH_NM;
            for (let i = 0; i < test.split("<br/>").length; i++) {
                menu[i] = test.split("<br/>")[i].match(/[^(삼일)]/g).join('').match(/[가-힣]/g).join("");
            }
        })
        .then(() => {
            res.render('lunch', { data: menu, title: "점심메뉴" })
        })
});
module.exports = router;
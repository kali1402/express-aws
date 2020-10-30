const { default: Axios } = require('axios');
var express = require('express');
var router = express.Router();

router.get('/', function (req, res, next) {
    let menu = [];
    Axios.get('https://open.neis.go.kr/hub/mealServiceDietInfo?KEY=5eba093627bc4dcb834f1b544816ef34&Type=json&ATPT_OFCDC_SC_CODE=J10&SD_SCHUL_CODE=7530336&MLSV_YMD=20201029')
        .then(res => {
            const test = res.data.mealServiceDietInfo[1].row[0].DDISH_NM;
            for (let i = 0; i < test.split("<br/>").length; i++) {
                menu[i] = test.split("<br/>")[i].match(/[^(삼일)]/g).join('').match(/[가-힣]/g).join("");
                console.log(menu[i]);
            }
        })
        .then(() => {
            res.render('index', { data: menu })
        })
});
module.exports = router;
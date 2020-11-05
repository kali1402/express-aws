const { default: Axios } = require('axios');
var express = require('express');
var router = express.Router();
var { Expo } = require("expo-server-sdk");
const expo = new Expo();

const savedPushTokens = [];

const saveToken = (token) => {
    if (savedPushTokens.indexOf(token === -1)) {
        savedPushTokens.push(token);
    }
};

const handlePushTokens = (message) => {
    let notification = [];

    for (let pushToken of savedPushTokens) {
        if (!Expo.isExpoPushToken(pushToken)) {
            console.log("ERROR");
            continue;
        }

        notification.push({
            to: pushToken,
            sound: "default",
            title: "오늘의 점심메뉴",
            body: message,
            data: { message },
        });
    }
    let chunks = expo.chunkPushNotifications(notification);
    (async () => {
        for (let chunk of chunks) {
            try {
                let receipts = await expo.sendPushNotificationsAsync(chunk);
                console.log(receipts);
            } catch (error) {
                console.error(error);
            }
        }
    })();
};

router.get("/", (req, res) => {
    res.send("서버 실행중...");
});

router.post("/token", (req, res) => {
    saveToken(req.body.token.value);
});

router.post("/message", (req, res) => {
    handlePushTokens(req.body.message);
    res.send(`메세지를 전송합니다. ${req.body.message}`);
});
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
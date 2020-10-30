export const getLunch = async () => {
    const Lunch = await axios
    const key = "5eba093627bc4dcb834f1b544816ef34"
    const today = "20201030"
        .get(
            `https://open.neis.go.kr/hub/mealServiceDietInfo?KEY=${key}&Type=json&ATPT_OFCDC_SC_CODE=J10&SD_SCHUL_CODE=7530336&MLSV_YMD=${today}`,
        )
        .then((res) => res.data.data.Lunch);
    return Lunch;
};
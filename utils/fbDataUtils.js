const axios = require('axios');
const moment = require('moment');

// ******************** FACEBOOK GRAPH API ********************
function getFBData(ID, accessToken, datePreset){
    const metricList = ["page_impressions","page_post_engagements","page_fan_adds"];
    const metricListName = ["reach","engagements","page_likes"];
    const apiEndpoint = `https://graph.facebook.com/v16.0/${ID}/insights?metric=${metricList.join(',')}`;
    const params = {
        "access_token": accessToken,
        "date_preset": datePreset
    };
    return new Promise((resolve, reject) => {
      axios.get(apiEndpoint, { params })
      .then((response) => {
        var responseData = response.data['data'].slice(0, metricList.length + 1);
        const pageDataRaw = { date: [], reach: [], engagements: [], pageLikes: [] };
        pageDataRaw.date = responseData[0]['values'].map(entry => entry.end_time);
        pageDataRaw.reach = responseData[0]['values'].map(entry => parseInt(entry.value));
        pageDataRaw.engagements = responseData[1]['values'].map(entry => parseInt(entry.value));
        pageDataRaw.pageLikes = responseData[2]['values'].map(entry => parseInt(entry.value));
        pageDataRaw.date = pageDataRaw.date.map(date => moment(date).format('DD/MM/YYYY'));
        
        var date = pageDataRaw.date.slice(-1)[0];
        var reach = pageDataRaw.reach.reduce((acc, cur) => acc + cur);
        // Use the arrow function => to define expression: (parameter) => expression
        var engagements = pageDataRaw.engagements.reduce((acc, cur) => acc + cur);
        var pageLikes = pageDataRaw.pageLikes.reduce((acc, cur) => acc+ cur);
      
        resolve({date, reach, engagements, pageLikes});
      })
      .catch((error) => {
        reject(error);
      });
    });
}

module.exports = getFBData;

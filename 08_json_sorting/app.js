const axios = require('axios');

const endpoints = [
    'https://jsonbase.com/sls-team/json-793',
    'https://jsonbase.com/sls-team/json-955',
    'https://jsonbase.com/sls-team/json-231',
    'https://jsonbase.com/sls-team/json-931',
    'https://jsonbase.com/sls-team/json-93',
    'https://jsonbase.com/sls-team/json-342',
    'https://jsonbase.com/sls-team/json-77067676',
    'https://jsonbase.com/sls-team/json-491',
    'https://jsonbase.com/sls-team/json-281',
    'https://jsonbase.com/sls-team/json-718',
    'https://jsonbase.com/sls-team/json-310',
    'https://jsonbase.com/sls-team/json-806',
    'https://jsonbase.com/sls-team/json-469',
    'https://jsonbase.com/sls-team/json-258',
    'https://jsonbase.com/sls-team/json-516',
    'https://jsonbase.com/sls-team/json-79',
    'https://jsonbase.com/sls-team/json-706',
    'https://jsonbase.com/sls-team/json-521',
    'https://jsonbase.com/sls-team/json-350',
    'https://jsonbase.com/sls-team/json-6455555'
];

async function getJson(url) {
    for (let i = 1; i <= 3; i++) {
        try {
            const json = await axios.get(url)
            return json.data
        } catch (error) {
            continue;
        }
    }
    return null;
}

 function findIsDone(data) {

     if (data.hasOwnProperty('isDone')) {
         return data.isDone;
     }

     if (typeof data === 'object') {
         for (let key in data) {
             const inData = data[key]
             const result = findIsDone(inData)
             if (result !== null){
                 return result;
             }
         }
     }
     return null;
 }

async function countIsDone() {

    let counterTrue = 0;
    let counterFalse = 0;

    for (let endpoint of endpoints) {
        const data = await getJson(endpoint);
        if (data === null) {
            console.log(`[Fail] ${endpoint}: The endpoint is unavailable`);
            continue;
        }
        const result = await findIsDone(data);

        if (result !== null) {
            console.log(`[Success] ${endpoint}: isDone - ${result}`);

            if (result) {
                counterTrue++
            } else {
                counterFalse++
            }
        }
    }
    console.log('Found True values: ' + counterTrue, '\nFound False values: ' + counterFalse);
}

countIsDone().catch(console.error);
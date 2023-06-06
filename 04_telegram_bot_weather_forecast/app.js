const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');

const BOT_TOKEN = process.env['BOT_TOKEN'];
const CHAT_ID = process.env['CHAT_ID'];
const OPENWEATHER_API_KEY = process.env['OPENWEATHER_API_KEY'];

const bot = new TelegramBot(BOT_TOKEN, {polling: true});

async function main () {
    bot.onText(/\/start/, async () => {
        await bot.sendMessage(CHAT_ID, 'Welcome to the Weather Forecast Bot! Choose your city:', {
            reply_markup: {
                keyboard: [['Forecast in Kharkiv']],
                resize_keyboard: true,
                one_time_keyboard: true,
            },
        });
    });

    bot.onText(/Forecast in Kharkiv/, async () => {
        await bot.sendMessage(CHAT_ID, 'Choose the forecast interval:', {
            reply_markup: {
                keyboard: [['at intervals of 3 hours'], ['at intervals of 6 hours']],
                resize_keyboard: true,
                one_time_keyboard: true,
            },
        });
    })

    bot.onText(/at intervals of (3|6) hours/, async (msg, match) => {
        const interval = parseInt(match[1]);

        const forecast = await axios
            .get('https://api.openweathermap.org/data/2.5/forecast?q=Kharkiv&APPID='+OPENWEATHER_API_KEY)
        let forecastList = forecast.data.list;

        let  forecastText = 'Погода в Харькове:\r\n\r\n';

        const options = {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
        };
        const options2 = {
            hour: 'numeric',
            minute: 'numeric',
        }

        const groupedDate = new Map();
        forecastList
            .forEach((forecast) => {
                const date = new Date(forecast.dt * 1000).toLocaleString('ru-RU', options);
                const time = new Date(forecast.dt * 1000).toLocaleString('ru-RU', options2);
                const temperature = forecast.main.temp - 273.15;
                const temperatureFeel = forecast.main.feels_like - 273.15;
                let weatherStatus = '';
                const cloudiness = forecast.clouds.all;
                if (cloudiness < 20) {
                    weatherStatus = 'ясно';
                } else if (cloudiness < 50) {
                    weatherStatus = 'небольшая облачность';
                } else if (cloudiness < 80) {
                    weatherStatus = 'облачно с прояснениями';
                } else {
                    weatherStatus = 'пасмурно';
                }

                if (!groupedDate.has(date)) {
                    groupedDate.set(date, []);
                }
                groupedDate.get(date).push(`${time}, +${Math.round(temperature)}°C, ощущается +${Math.round(temperatureFeel)}°C, ${weatherStatus}`)
            });

        for (const key of groupedDate.keys()) {
            forecastText += key + ':\r\n';

            for (let i = 0; i < groupedDate.get(key).length; i++) {
                if (interval === 6 && i % 2 !== 0) {
                    continue;
                }
                forecastText += '  ' + groupedDate.get(key)[i] + '\r\n';
            }
            forecastText += '\r\n';
        }

        await bot.sendMessage(CHAT_ID, forecastText);
    });
}

main().catch(console.error);
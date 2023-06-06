const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');
const NodeCache = require('node-cache');

const cache = new NodeCache({ stdTTL: 60 });

const BOT_TOKEN = process.env['BOT_TOKEN'];
const CHAT_ID = process.env['CHAT_ID'];

const bot = new TelegramBot(BOT_TOKEN, {polling: true});

const CURRENCY_CODES = {
    USD: 840,
    EUR: 978
}

const buttonForm = {
    reply_markup: {
        keyboard: [['USD'], ['EUR']],
        resize_keyboard: true,
        one_time_keyboard: true,
    },
}

async function dataMono () {
    const rates = cache.get( 'mono-rates');
    if (rates) {
        return rates;
    }
    const exchangeMono = await axios
        .get('https://api.monobank.ua/bank/currency')

    cache.set( 'mono-rates', exchangeMono.data);

    return exchangeMono.data;
}

async function dataPrivat () {
    const exchangePrivat = await axios
        .get('https://api.privatbank.ua/p24api/pubinfo?json&exchange&coursid=5')

    return exchangePrivat.data;
}

async function getRatesMono (currency) {
    const ratesMono = await dataMono();
    const rate = ratesMono.find(
        rate => rate.currencyCodeA === CURRENCY_CODES[currency] && rate.currencyCodeB === 980
    );

    return `Monobank. ${currency}: RateBuy ${rate.rateBuy}, RateSell ${rate.rateSell}`;
}

async function getRatesPrivat (currency) {
    const ratesPrivat = await dataPrivat();
    const rate = ratesPrivat.find(rate => rate.ccy === currency);

    return `Privatbank. ${currency}: RateBuy ${rate.buy}, RateSell ${rate.sale}`;
}

async function prepareResponseForCurrency(currency) {
    const usdRateMono = await getRatesMono(currency);
    const usdRatePrivat = await getRatesPrivat(currency);
    return usdRateMono + '\r\n' + usdRatePrivat
}

async function main () {
    bot.onText(/\/start/, async () => {
        await bot.sendMessage(CHAT_ID, 'Welcome to the Exchange rates Bot! Choose currency:', buttonForm);
    });

    bot.onText(/USD/, async () => {
        const message = await prepareResponseForCurrency('USD');
        await bot.sendMessage(CHAT_ID, message, buttonForm);
    });

    bot.onText(/EUR/, async () => {
        const message = await prepareResponseForCurrency('EUR');
        await bot.sendMessage(CHAT_ID, message, buttonForm);
    });
}

main().catch(console.error);
const TelegramBot = require('node-telegram-bot-api');
const {program} = require("commander");
process.env["NTBA_FIX_350"] = 1;

const BOT_TOKEN = process.env['BOT_TOKEN'];
const CHAT_ID = process.env['CHAT_ID'];

const bot = new TelegramBot(BOT_TOKEN, {polling: true});

async function main() {
    program.version('1.0.0');

    program
        .command('message')
        .alias('m')
        .description('Send message to Telegram Bot')
        .argument('<message>', 'Message')
        .action(async (message) => {
                await bot.sendMessage(CHAT_ID, message);
                process.exit(1);
            }
        )

    program
        .command('photo')
        .alias('p')
        .description('Send photo to Telegram Bot. Just drag and drop it console after p-flag')
        .argument('<path>', 'Path')
        .action(async (path) => {
                await bot.sendPhoto(CHAT_ID, path);
                console.log('You successfully sent photo to your Bot')
                process.exit(1);
            }
        )

    await program.parseAsync(process.argv);
}

main().catch(console.error);

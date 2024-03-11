const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');

// Replace 'YOUR_TELEGRAM_BOT_TOKEN' with your actual Telegram bot token
const TELEGRAM_BOT_TOKEN = 'YOUR_TELEGRAM_BOT_TOKEN';
const bot = new TelegramBot(TELEGRAM_BOT_TOKEN, { polling: true });

const ITEMS_PER_PAGE = 5;

bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    const userInput = msg.text?.toLowerCase();

    if (userInput === 'start' || userInput.startsWith('/start')) {
        bot.sendMessage(chatId, 'Welcome! Use /currency to get all available cryptocurrencies.');
    } else if (userInput === 'currency' || userInput.startsWith('/currency')) {
        sendCryptoCurrencies(chatId, 0);
    } else if (userInput.startsWith('/search')) {
        const searchTerm = userInput.substring('/search'.length).trim();
        searchTerm ? searchAndSend(chatId, searchTerm, 0) : bot.sendMessage(chatId, 'Please provide a search term after /search.');
    } else {
        getRateAndSend(chatId, userInput);
    }
});

async function sendCryptoCurrencies(chatId, page) {
    const exchangeInfoUrl = 'https://api.binance.com/api/v3/exchangeInfo';

    try {
        const exchangeInfoResponse = await axios.get(exchangeInfoUrl);
        const symbols = exchangeInfoResponse.data.symbols;

        const usdtSymbols = symbols
            .filter((symbol) => symbol.symbol.endsWith('USDT'))
            .map((symbol) => symbol.symbol)
            .sort();

        const symbolsWithoutUSDT = usdtSymbols.map((symbol) => symbol.replace('USDT', ''));

        const totalPages = Math.ceil(symbolsWithoutUSDT.length / ITEMS_PER_PAGE);

        const startIdx = page * ITEMS_PER_PAGE;
        const endIdx = startIdx + ITEMS_PER_PAGE;
        const symbolsForPage = symbolsWithoutUSDT.slice(startIdx, endIdx);

        const keyboardButtons = symbolsForPage.map(symbol => ({
            text: symbol,
            callback_data: `rate_${symbol}`,
        }));

        const paginationButtons = [];
        if (page > 0) {
            paginationButtons.push({ text: '◀️ Previous', callback_data: `page_${page - 1}` });
        }
        if (page < totalPages - 1) {
            paginationButtons.push({ text: 'Next ▶️', callback_data: `page_${page + 1}` });
        }

        const searchButton = { text: '🔍 Search', callback_data: 'search' };

        const keyboardMarkup = {
            inline_keyboard: [keyboardButtons, paginationButtons, [searchButton]],
        };

        bot.sendMessage(chatId, `Choose a cryptocurrency (Page ${page + 1}/${totalPages}):`, {
            reply_markup: keyboardMarkup,
        });
    } catch (error) {
        console.error('Error fetching cryptocurrency symbols:', error.message);
        bot.sendMessage(chatId, 'Error fetching cryptocurrency symbols. Please try again later.');
    }
}

async function getRateAndSend(chatId, symbolWithoutUSDT) {
    const uppercaseSymbol = symbolWithoutUSDT.toUpperCase();
    const rateUrl = `https://api.binance.com/api/v3/ticker/price?symbol=${uppercaseSymbol}USDT`;

    try {
        const response = await axios.get(rateUrl);
        const rate = response.data.price;
        
        bot.sendMessage(chatId, `Current ${uppercaseSymbol} rate: $${rate}`);
    } catch (error) {
        console.error('Error fetching cryptocurrency rate:', error.message);
        bot.sendMessage(chatId, 'Error fetching cryptocurrency rate. Please try again later.');
    }
}

async function searchAndSend(chatId, searchTerm) {
    const exchangeInfoUrl = 'https://api.binance.com/api/v3/exchangeInfo';

    try {
        const exchangeInfoResponse = await axios.get(exchangeInfoUrl);
        const symbols = exchangeInfoResponse.data.symbols;

        const usdtSymbols = symbols
            .filter((symbol) => symbol.symbol.endsWith('USDT'))
            .map((symbol) => symbol.symbol)
            .sort();

        const symbolsWithoutUSDT = usdtSymbols.map((symbol) => symbol.replace('USDT', ''));

        const matchingSymbols = symbolsWithoutUSDT.filter(symbol => symbol.toLowerCase().includes(searchTerm.toLowerCase()));

        const limitedSymbols = matchingSymbols.slice(0, 5);

        const keyboardButtons = limitedSymbols.map(symbol => ({
            text: symbol,
            callback_data: `rate_${symbol}`,
        }));

        const backButton = { text: '◀️ Back to List', callback_data: 'back_to_list' };

        const keyboardMarkup = {
            inline_keyboard: [keyboardButtons, [backButton]],
        };

        bot.sendMessage(chatId, `Search results for "${searchTerm}":`, {
            reply_markup: keyboardMarkup,
        });
    } catch (error) {
        console.error('Error fetching cryptocurrency symbols:', error.message);
        bot.sendMessage(chatId, 'Error fetching cryptocurrency symbols. Please try again later.');
    }
}

bot.on('callback_query', (callbackQuery) => {
    const chatId = callbackQuery.message.chat.id;
    const callbackData = callbackQuery.data;

    if (callbackData.startsWith('rate_')) {
        const symbolWithoutUSDT = callbackData.replace('rate_', '');
        getRateAndSend(chatId, symbolWithoutUSDT);
    } else if (callbackData.startsWith('page_')) {
        const page = parseInt(callbackData.replace('page_', ''), 10);
        sendCryptoCurrencies(chatId, page);
    } else if (callbackData === 'search') {
        bot.sendMessage(chatId, 'Enter the search term after /search to find specific cryptocurrencies.');
    } else if (callbackData === 'back_to_list') {
        sendCryptoCurrencies(chatId, 0);
    }
});

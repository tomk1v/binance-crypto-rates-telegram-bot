# YouTube Audio Bot by tomk1v

This is a Telegram bot that allows users to fetch audio from YouTube videos and send them as voice messages.

## Setup

1. Install the required dependencies:

    ```
    npm install node-telegram-bot-api axios
    ```

2. Replace `'YOUR_BOT_TOKEN'` with your actual Telegram bot token in the `BOT_TOKEN` variable.

3. Run the bot:

    ```
    node your_bot_script.js
    ```

## Usage

1. Start the bot by sending `/start` in your Telegram chat.
2. Use `/currency` to get a list of available cryptocurrencies.

![image](https://github.com/tomk1v/binance-crypto-rates-telegram-bot/assets/91790934/051a0041-ee7a-4089-b017-5f82a4aa9378)

3. Use `/search` to find specific cryptocurrencies.

![image](https://github.com/tomk1v/binance-crypto-rates-telegram-bot/assets/91790934/18b30102-ed40-4cd5-87e5-b426beaf3b2b)

4. Enter the symbol of a cryptocurrency to get its current rate.

![image](https://github.com/tomk1v/binance-crypto-rates-telegram-bot/assets/91790934/011cf693-e7ef-41e3-a76d-83bde131d695)


## Acknowledgments

- Fetches cryptocurrency rates from the Binance API in the fastest way.
- Allows users to list available cryptocurrencies, search, and get current rates.
- Pagination for displaying a limited number of cryptocurrencies at a time.

## Dependencies

- [node-telegram-bot-api](https://github.com/yagop/node-telegram-bot-api)
- [axios](https://www.npmjs.com/package/axios)

## Issues

If you encounter any issues or have suggestions, please [open an issue](https://github.com/tomk1v/binance-crypto-rates-telegram-bot/issues).

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

const TelegramBot = require('node-telegram-bot-api');
const openai = require('openai');
const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');

dotenv.config();

openai.apiKey = process.env.OPENAI_API_KEY;

const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, {webhook: {}});

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.post('/webhook', (req, res) => {
  bot.processUpdate(req.body);
  res.sendStatus(200);
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

bot.setWebHook(`${process.env.APP_URL}/webhook`);

bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  const message = msg.text;

  if (message.startsWith('/chat')) {
    const prompt = message.substring(6);

    openai.completions.create({
      engine: "chatbot",
      prompt: prompt,
      max_tokens: 2048,
      temperature: 0.5,
    }, (error, response) => {
      if (error) {
        console.log(error);
      } else {
        bot.sendMessage(chatId, response.choices[0].text);
      }
    });
  }
});

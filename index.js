const TelegramBot = require('node-telegram-bot-api');
const openai = require('openai');

openai.apiKey = "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";

// Replace YOUR_TELEGRAM_BOT_TOKEN with your actual bot token
const bot = new TelegramBot("5432059401:AAEVz9SPdl26EgnXLRnHJcc0lW_t8sBNBf4", {polling: true});

bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  const message = msg.text;

  // Use the ChatGPT 3.5 language model to generate a response to the message
  openai.completions.create({
    engine: "chatbot",
    prompt: message,
    max_tokens: 2048,
    temperature: 0.5,
  }, (error, response) => {
    if (error) {
      console.log(error);
    } else {
      // Send the response back to the user
      bot.sendMessage(chatId, response.choices[0].text);
    }
  });
});

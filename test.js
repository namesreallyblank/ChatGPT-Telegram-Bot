const TelegramBot = require('node-telegram-bot-api');
const openai = require('openai');
const express = require('express');
const bodyParser = require('body-parser');

openai.apiKey = "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";

// Replace YOUR_TELEGRAM_BOT_TOKEN with your actual bot token
const bot = new TelegramBot("5432059401:AAEVz9SPdl26EgnXLRnHJcc0lW_t8sBNBf4", {webhook: {}});

const app = express();
const port = process.env.PORT || 3000;

// Body parser middleware
app.use(bodyParser.json());

// Set up the webhook endpoint
app.post('/webhook', (req, res) => {
  bot.processUpdate(req.body);
  res.sendStatus(200);
});

// Start the server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

// Set the webhook
bot.setWebHook(`${process.env.APP_URL}/webhook`);

bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  const message = msg.text;

  // Check if the message is a command
  if (message.startsWith('/chat')) {
    // Extract the prompt from the message
    const prompt = message.substring(6);

    // Use the ChatGPT 3.5 language model to generate a response to the prompt
    openai.completions.create({
      engine: "chatbot",
      prompt: prompt,
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
  }
});



curl -X POST https://api.telegram.org/bot5432059401:AAEVz9SPdl26EgnXLRnHJcc0lW_t8sBNBf4/setWebhook?url=https://3000-namesreally-chatgpttele-nbb382cifrw.ws-eu79.gitpod.io/
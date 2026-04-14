const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: 'YOUR_API_KEY_HERE'
});

const client = new Client({
  authStrategy: new LocalAuth()
});

client.on('qr', (qr) => {
  console.log('Scan this QR code with your WhatsApp:');
  qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
  console.log('Bot is ready!');
});

client.on('message', async (message) => {
  if (message.isStatus) return;
  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [
      {
        role: 'system',
        content: 'You are an order taking assistant for a small business. Take the customer order, confirm the items, calculate the total, and send them this payment link: https://buy.stripe.com/test_9B6aEZgJb5eDf8Z9PL9fW00. Be friendly and professional.'
      },
      {
        role: 'user',
        content: message.body
      }
    ]
  });

  const reply = response.choices[0].message.content;
  message.reply(reply);
});

client.initialize();
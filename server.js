const { Telegraf, Markup } = require('telegraf');
const express = require('express');
const app = express();
const bot = new Telegraf('8144496429:AAFcZefJUtx4IldvJCbyNzp9KfsSUmUv92k');
const web_link = "https://assafhmydy.github.io/My_Services_assaf_Bot/webapp/index.html";

bot.start((ctx) => {
    ctx.reply('مرحباً يا بروفيسور عساف في لوحتك المتطورة 🌐', 
    Markup.inlineKeyboard([
        [Markup.button.webApp('🚀 فتح لوحة التحكم', web_link)],
        [Markup.button.url('📢 قناة المطور', 'https://t.me/Assaf_Abo_Naya')]
    ]));
});

const PORT = process.env.PORT || 3000;
app.get('/', (req, res) => res.send('Bot Status: Online'));
app.listen(PORT, () => {
    console.log('Server is live!');
    bot.launch();
});

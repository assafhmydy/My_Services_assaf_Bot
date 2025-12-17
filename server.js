const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const path = require('path');
const fs = require('fs');

const token = '6977150444:AAEx0ImDyNv7HbYs-0SCWdWP4DJGbMQV2gk'; // توكن البوت الأساسي
const adminId = 6343839778; // ايدي البروفيسور عساف
const bot = new TelegramBot(token, { polling: true });
const app = express();

// إعدادات الواجهة
app.use(express.static(path.join(__dirname, 'public')));

// قاعدة بيانات بسيطة (ملفات JSON)
const dbFile = './database.json';
if (!fs.existsSync(dbFile)) {
    fs.writeFileSync(dbFile, JSON.stringify({ users: [], bots: [], channels: [], banned: [] }));
}

// دالة لجلب البيانات
function getData() {
    return JSON.parse(fs.readFileSync(dbFile));
}

// رسالة البداية /start
bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    const opts = {
        reply_markup: {
            inline_keyboard: [
                [{ text: '🚀 فتح لوحة التحكم', web_app: { url: 'https://assafhmydy.github.io/My_Services_assaf_Bot/' } }],
                [{ text: '➕ صنع بوت جديد', callback_data: 'make_bot' }]
            ]
        }
    };
    bot.sendMessage(chatId, `مرحباً يا بروفيسور عساف في لوحتك المتطورة!\nيمكنك البدء بصنع بوتك أو إدارة خدماتك من هنا.`, opts);
});

// منطق الإدارة (عند إرسال حرف "م")
bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;
    const data = getData();

    if (text === 'م' && chatId === adminId) {
        const stats = `اهلا بك يا بروفيسور في لوحة الإدارة:\n\n` +
                      `• عدد الأعضاء: ${data.users.length}\n` +
                      `• البوتات المصنوعة: ${data.bots.length}\n` +
                      `• المحظورين: ${data.banned.length}`;
        
        bot.sendMessage(chatId, stats, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: "تعيين رسالة Start", callback_data: "set_start" }],
                    [{ text: "إضافة قناة اشتراك", callback_data: "add_channel" }],
                    [{ text: "قائمة الحظر", callback_data: "ban_list" }]
                ]
            }
        });
    }
});

// تشغيل السيرفر لـ Render
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

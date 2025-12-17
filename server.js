const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const path = require('path');
const fs = require('fs');

// --- الإعدادات الأساسية ---
const token = '6977150444:AAEx0ImDyNv7HbYs-0SCWdWP4DJGbMQV2gk'; // توكن البوت الأساسي
const adminId = 6343839778; // آيدي البروفيسور عساف
const bot = new TelegramBot(token, { polling: true });
const app = express();

// قاعدة بيانات بسيطة لتخزين البيانات
const dbFile = './database.json';
if (!fs.existsSync(dbFile)) {
    fs.writeFileSync(dbFile, JSON.stringify({ users: [], bots: [], channels: [], banned: [] }));
}

function getData() { return JSON.parse(fs.readFileSync(dbFile)); }
function saveData(data) { fs.writeFileSync(dbFile, JSON.stringify(data, null, 2)); }

// --- استقبال الرسائل ---

bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;
    const data = getData();

    // تسجيل المستخدم الجديد
    if (!data.users.includes(chatId)) {
        data.users.push(chatId);
        saveData(data);
    }

    // التحقق من الحظر
    if (data.banned.includes(chatId)) {
        return bot.sendMessage(chatId, "🚫 عذراً، لقد تم حظرك من استخدام البوت.");
    }

    // أمر البداية
    if (text === '/start') {
        const opts = {
            reply_markup: {
                inline_keyboard: [
                    [{ text: '🚀 فتح لوحة التحكم', web_app: { url: 'https://assafhmydy.github.io/My_Services_assaf_Bot/' } }],
                    [{ text: '➕ صنع بوت جديد', callback_data: 'make_bot' }]
                ]
            }
        };
        return bot.sendMessage(chatId, `مرحباً يا بروفيسور عساف في "مصنع البوتات" الخاص بك!\n\nأرسل التوكن الآن لصنع بوتك الخاص.`, opts);
    }

    // لوحة المطور (عند إرسال حرف "م")
    if (text === 'م' && chatId === adminId) {
        const stats = `📊 إحصائيات المصنع:\n\n• الأعضاء: ${data.users.length}\n• البوتات: ${data.bots.length}\n• المحظورين: ${data.banned.length}`;
        return bot.sendMessage(chatId, stats);
    }

    // منطق صنع البوت (إذا أرسل المستخدم توكن)
    if (text && text.includes(':')) {
        try {
            const tempBot = new TelegramBot(text);
            const getMe = await tempBot.getMe();
            
            // إضافة البوت لقاعدة البيانات
            data.bots.push({ owner: chatId, token: text, username: getMe.username });
            saveData(data);

            bot.sendMessage(chatId, `✅ تم صنع بوتك بنجاح!\n\nيوزر البوت: @${getMe.username}\nالحالة: يعمل الآن على سيرفراتنا.`);
        } catch (e) {
            bot.sendMessage(chatId, "❌ التوكن الذي أرسلته غير صحيح، يرجى التأكد منه.");
        }
    }
});

// --- تشغيل السيرفر لـ Render ---
app.use(express.static(path.join(__dirname, 'public')));
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => { console.log(`Server running on port ${PORT}`); });

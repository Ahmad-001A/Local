const express = require('express');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3000;
const DATA_FILE = path.join(__dirname, 'messages.json');

app.use(cors());
app.use(express.static('public'));
app.use(express.json());

// Загружаем сохранённые данные
const loadMessages = () => {
    if (fs.existsSync(DATA_FILE)) {
        return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    }
    return [];
};

// Сохраняем данные
const saveMessages = (messages) => {
    fs.writeFileSync(DATA_FILE, JSON.stringify(messages, null, 2));
};

// Получаем данные с удалённого сайта
app.get('/fetch-messages', async (req, res) => {
    try {
        const response = await axios.get('https://f11-m68b.onrender.com');
        if (typeof response.data === 'object') {
            const messages = loadMessages();
            messages.push(...response.data);
            saveMessages(messages);
            res.json(messages);
        } else {
            res.status(500).json({ error: 'Неверный формат данных' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Ошибка при запросе данных' });
    }
});

// Отдаём сохранённые данные
app.get('/messages', (req, res) => {
    res.json(loadMessages());
});

app.listen(PORT, () => {
    console.log(`🚀 Сервер запущен на http://localhost:${PORT}`);
});


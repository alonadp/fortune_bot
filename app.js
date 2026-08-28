// Инициализация Telegram WebApp
const tg = window.Telegram.WebApp;
tg.ready();
tg.expand();

// Предсказания
const predictions = {
  yesno: {
    heads: [
      "Да, сегодня твой день! ✨",
      "Удача на твоей стороне! 🍀",
      "Смело действуй — всё получится! 🚀",
      "Звёзды говорят: ДА! ⭐",
      "Твои усилия окупятся! 💪"
    ],
    tails: [
      "Не сейчас, но скоро! ⏳",
      "Лучше подождать немного... 🌙",
      "Звёзды говорят: НЕТ... пока что 🔮",
      "Пересмотри свой план 🤔",
      "Удача придёт позже! 💫"
    ]
  },
  day: [
    "Сегодня день новых возможностей! Действуй смело. 🌟",
    "Возможны неожиданные перемены — будь готов! 🌀",
    "Хороший день для важных решений. Доверься интуиции. 💡",
    "День спокойствия и размышлений. Не торопи события. 🌙",
    "Энергичный день! Используй его для активных действий. ⚡",
    "Возможны небольшие препятствия, но ты справишься! 💪",
    "День удачи и сюрпризов. Будь открыт новому! 🎁"
  ],
  taro: [
    { name: "Шут", meaning: "Новое начало, спонтанность, приключения 🃏" },
    { name: "Маг", meaning: "Сила воли, мастерство, возможности ✨" },
    { name: "Жрица", meaning: "Интуиция, тайны, подсознание 🌙" },
    { name: "Императрица", meaning: "Плодородие, изобилие, творчество 👑" },
    { name: "Император", meaning: "Власть, структура, контроль 🏛" },
    { name: "Влюблённые", meaning: "Выбор, гармония, отношения 💕" },
    { name: "Колесница", meaning: "Движение вперёд, победа, решимость 🏆" },
    { name: "Сила", meaning: "Внутренняя сила, терпение, сострадание 🦁" },
    { name: "Отшельник", meaning: "Поиск истины, одиночество, мудрость 🕯" },
    { name: "Колесо Фортуны", meaning: "Перемены, судьба, поворотный момент 🎡" },
    { name: "Справедливость", meaning: "Баланс, правда, закон ⚖" },
    { name: "Повешенный", meaning: "Жертва, пауза, новый взгляд 🙃" },
    { name: "Смерть", meaning: "Трансформация, конец и начало 🦋" },
    { name: "Умеренность", meaning: "Баланс, терпение, гармония ⚖" },
    { name: "Дьявол", meaning: "Искушение, зависимость, материализм 😈" },
    { name: "Башня", meaning: "Внезапные перемены, разрушение, пробуждение ⚡" },
    { name: "Звезда", meaning: "Надежда, вдохновение, духовность ⭐" },
    { name: "Луна", meaning: "Иллюзии, страхи, подсознание 🌙" },
    { name: "Солнце", meaning: "Радость, успех, позитив ☀" },
    { name: "Суд", meaning: "Возрождение, призыв, пробуждение 🔔" },
    { name: "Мир", meaning: "Завершение, целостность, путешествие 🌍" }
  ],
  rune: [
    { name: "Fehu (Феху)", meaning: "Богатство, изобилие, новые начинания 💰" },
    { name: "Uruz (Уруз)", meaning: "Сила, здоровье, жизненная энергия 💪" },
    { name: "Thurisaz (Турисаз)", meaning: "Защита, разрушение препятствий 🛡" },
    { name: "Ansuz (Ансуз)", meaning: "Мудрость, общение, вдохновение 📖" },
    { name: "Raido (Райдо)", meaning: "Путешествие, движение, прогресс 🚗" },
    { name: "Kenaz (Кеназ)", meaning: "Огонь, творчество, знание 🔥" },
    { name: "Gebo (Гебо)", meaning: "Дар, партнёрство, баланс 🎁" },
    { name: "Wunjo (Вуньо)", meaning: "Радость, успех, гармония 😊" },
    { name: "Hagalaz (Хагалаз)", meaning: "Перемены, трансформация, испытание ❄" },
    { name: "Nauthiz (Наутиз)", meaning: "Нужда, терпение, выносливость ⏳" },
    { name: "Isa (Иса)", meaning: "Лёд, пауза, размышление 🧊" },
    { name: "Jera (Йера)", meaning: "Урожай, результат, цикл 🌾" },
    { name: "Eihwaz (Эйваз)", meaning: "Защита, выносливость, связь 🌳" },
    { name: "Perthro (Пертро)", meaning: "Тайна, шанс, судьба 🎲" },
    { name: "Algiz (Альгиз)", meaning: "Защита, интуиция, высшая сила 🛡" },
    { name: "Sowilo (Соулу)", meaning: "Солнце, успех, энергия ☀" },
    { name: "Tiwaz (Тейваз)", meaning: "Победа, справедливость, лидерство ⚔" },
    { name: "Berkano (Беркана)", meaning: "Рост, рождение, обновление 🌱" },
    { name: "Ehwaz (Эваз)", meaning: "Движение, прогресс, доверие 🐎" },
    { name: "Mannaz (Манназ)", meaning: "Человек, сообщество, самосознание 👤" },
    { name: "Laguz (Лагуз)", meaning: "Вода, эмоции, поток 🌊" },
    { name: "Inguz (Ингуз)", meaning: "Плодородие, завершение, потенциал 🌟" },
    { name: "Othala (Отала)", meaning: "Наследие, дом, традиции 🏠" },
    { name: "Dagaz (Дагаз)", meaning: "День, прорыв, ясность 🌅" }
  ]
};

// Состояние
let currentMode = null;
let flipCount = 0;
let dailyFlips = 0;
let lastFlipDate = null;
let history = [];

// Проверка ежедневного лимита
function checkDailyLimit() {
  const today = new Date().toDateString();
  if (lastFlipDate !== today) {
    dailyFlips = 0;
    lastFlipDate = today;
  }
  return dailyFlips < 1; // 1 бесплатное гадание в день
}

// Выбор режима
document.querySelectorAll('.mode-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    currentMode = btn.dataset.mode;
    
    // Скрытие/показ экранов
    document.getElementById('modesScreen').style.display = 'none';
    document.getElementById('fortuneScreen').style.display = 'block';
    
    // Обновление заголовка
    const titles = {
      yesno: 'Да / Нет',
      day: 'На день',
      taro: 'Карта дня Таро',
      rune: 'Руна дня'
    };
    document.getElementById('fortuneTitle').textContent = titles[currentMode];
    
    // Сброс UI
    document.getElementById('coin').style.display = 'none';
    document.getElementById('card').style.display = 'none';
    document.getElementById('rune').style.display = 'none';
    document.getElementById('prediction').innerHTML = '<p>Нажми, чтобы узнать свою судьбу!</p>';
    document.getElementById('actionBtn').textContent = 'Узнать';
    
    // Показать нужный элемент
    if (currentMode === 'yesno' || currentMode === 'day') {
      document.getElementById('coin').style.display = 'block';
    } else if (currentMode === 'taro') {
      document.getElementById('card').style.display = 'block';
    } else if (currentMode === 'rune') {
      document.getElementById('rune').style.display = 'block';
    }
  });
});

// Назад
document.getElementById('backBtn').addEventListener('click', () => {
  document.getElementById('modesScreen').style.display = 'grid';
  document.getElementById('fortuneScreen').style.display = 'none';
  currentMode = null;
});

// Основное действие
document.getElementById('actionBtn').addEventListener('click', () => {
  if (!currentMode) return;
  
  if (!checkDailyLimit() && flipCount === 0) {
    tg.showAlert("Бесплатное гадание уже использовано сегодня! Смотри рекламу или покупай Stars для дополнительных попыток.");
    return;
  }
  
  const actionBtn = document.getElementById('actionBtn');
  actionBtn.disabled = true;
  
  if (currentMode === 'yesno' || currentMode === 'day') {
    // Монета
    const coin = document.getElementById('coin');
    const rotation = Math.floor(Math.random() * 360) + 720;
    coin.style.transform = `rotateY(${rotation}deg)`;
    
    setTimeout(() => {
      const isHeads = rotation % 720 < 360;
      let predictionText;
      
      if (currentMode === 'yesno') {
        const result = isHeads ? 'heads' : 'tails';
        predictionText = predictions.yesno[result][Math.floor(Math.random() * predictions.yesno[result].length)];
        predictionText = `<strong>${isHeads ? 'Орёл 🪙' : 'Решка 🌙'}</strong><br>${predictionText}`;
      } else {
        predictionText = predictions.day[Math.floor(Math.random() * predictions.day.length)];
      }
      
      document.getElementById('prediction').innerHTML = predictionText;
      addToHistory(currentMode === 'yesno' ? (isHeads ? 'Орёл' : 'Решка') : 'День', predictionText);
      
      flipCount++;
      dailyFlips++;
      actionBtn.disabled = false;
      actionBtn.textContent = "Узнать ещё раз";
      
      // Шеринг
      setTimeout(() => {
        tg.showConfirm("Поделиться результатом?", () => {
          tg.shareUrl(`https://t.me/share/url?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(`Моё предсказание: ${predictionText} 🔮`)}`);
        });
      }, 1000);
    }, 1000);
    
  } else if (currentMode === 'taro') {
    // Таро
    const card = document.getElementById('card');
    card.style.transform = 'rotateY(180deg)';
    
    setTimeout(() => {
      const cardData = predictions.taro[Math.floor(Math.random() * predictions.taro.length)];
      document.getElementById('prediction').innerHTML = `<strong>${cardData.name}</strong><br>${cardData.meaning}`;
      addToHistory('Таро', `${cardData.name}: ${cardData.meaning}`);
      
      flipCount++;
      dailyFlips++;
      actionBtn.disabled = false;
      actionBtn.textContent = "Вытянуть ещё карту";
      card.style.transform = 'rotateY(0deg)';
      
      setTimeout(() => {
        tg.showConfirm("Поделиться результатом?", () => {
          tg.shareUrl(`https://t.me/share/url?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(`Моя карта Таро: ${cardData.name} — ${cardData.meaning} 🎴`)}`);
        });
      }, 1000);
    }, 800);
    
  } else if (currentMode === 'rune') {
    // Руна
    const runeData = predictions.rune[Math.floor(Math.random() * predictions.rune.length)];
    document.querySelector('.rune-stone').textContent = runeData.name.split(' ')[0];
    
    setTimeout(() => {
      document.getElementById('prediction').innerHTML = `<strong>${runeData.name}</strong><br>${runeData.meaning}`;
      addToHistory('Руна', `${runeData.name}: ${runeData.meaning}`);
      
      flipCount++;
      dailyFlips++;
      actionBtn.disabled = false;
      actionBtn.textContent = "Выбрать ещё руну";
      
      setTimeout(() => {
        tg.showConfirm("Поделиться результатом?", () => {
          tg.shareUrl(`https://t.me/share/url?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(`Моя руна: ${runeData.name} — ${runeData.meaning} ᚠ`)}`);
        });
      }, 1000);
    }, 500);
  }
});

// История
function addToHistory(type, text) {
  history.unshift({ type, text, date: new Date().toLocaleTimeString() });
  if (history.length > 5) history.pop();
  updateHistory();
}

function updateHistory() {
  const historyList = document.getElementById('historyList');
  historyList.innerHTML = history.map(item => 
    `<li><strong>${item.type}</strong> — ${item.text} <small>(${item.date})</small></li>`
  ).join('');
}

// Монетизация
document.getElementById('watchAdBtn').addEventListener('click', () => {
  tg.showAlert("Реклама загружается... (функция в разработке) 📺");
  // Здесь будет интеграция с Telegram Ads
});

document.getElementById('buyStarsBtn').addEventListener('click', () => {
  tg.showAlert("Покупка Stars... (функция в разработке) ⭐");
  // Здесь будет интеграция с Telegram Stars
});

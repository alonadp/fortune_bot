// Safe Telegram WebApp initialization
let tg = null;
try {
  if (window.Telegram && window.Telegram.WebApp) {
    tg = window.Telegram.WebApp;
    tg.ready();
    tg.expand();
  }
} catch (e) {
  console.log('Telegram WebApp not available');
}

// Safe haptic feedback helper
function haptic(type = 'light') {
  try {
    if (tg && tg.HapticFeedback) {
      if (type === 'light') {
        tg.HapticFeedback.impactOccurred('light');
      } else if (type === 'medium') {
        tg.HapticFeedback.impactOccurred('medium');
      } else if (type === 'select') {
        tg.HapticFeedback.selectionChanged();
      }
    }
  } catch (e) {
    // Fail silently
  }
}

// Data
let tarotData = [];
let runesData = [];

// Load data
async function loadData() {
  try {
    const [tarotResponse, runesResponse] = await Promise.all([
      fetch('data/tarot.json'),
      fetch('data/runes.json')
    ]);
    tarotData = await tarotResponse.json();
    runesData = await runesResponse.json();
  } catch (error) {
    console.error('Failed to load data:', error);
    // Fallback to embedded data
    tarotData = [
      { nameRu: "Шут", number: "0", shortMeaning: "Новое начало, спонтанность, приключения" },
      { nameRu: "Маг", number: "I", shortMeaning: "Сила воли, мастерство, возможности" },
      { nameRu: "Жрица", number: "II", shortMeaning: "Интуиция, тайны, подсознание" },
      { nameRu: "Императрица", number: "III", shortMeaning: "Плодородие, изобилие, творчество" },
      { nameRu: "Император", number: "IV", shortMeaning: "Власть, структура, контроль" },
      { nameRu: "Иерофант", number: "V", shortMeaning: "Традиции, духовность, обучение" },
      { nameRu: "Влюблённые", number: "VI", shortMeaning: "Выбор, гармония, отношения" },
      { nameRu: "Колесница", number: "VII", shortMeaning: "Движение вперёд, победа, решимость" },
      { nameRu: "Сила", number: "VIII", shortMeaning: "Внутренняя сила, терпение, сострадание" },
      { nameRu: "Отшельник", number: "IX", shortMeaning: "Поиск истины, одиночество, мудрость" },
      { nameRu: "Колесо Фортуны", number: "X", shortMeaning: "Перемены, судьба, поворотный момент" },
      { nameRu: "Справедливость", number: "XI", shortMeaning: "Баланс, правда, закон" },
      { nameRu: "Повешенный", number: "XII", shortMeaning: "Жертва, пауза, новый взгляд" },
      { nameRu: "Смерть", number: "XIII", shortMeaning: "Трансформация, конец и начало" },
      { nameRu: "Умеренность", number: "XIV", shortMeaning: "Баланс, терпение, гармония" },
      { nameRu: "Дьявол", number: "XV", shortMeaning: "Искушение, зависимость, материализм" },
      { nameRu: "Башня", number: "XVI", shortMeaning: "Внезапные перемены, разрушение, пробуждение" },
      { nameRu: "Звезда", number: "XVII", shortMeaning: "Надежда, вдохновение, духовность" },
      { nameRu: "Луна", number: "XVIII", shortMeaning: "Иллюзии, страхи, подсознание" },
      { nameRu: "Солнце", number: "XIX", shortMeaning: "Радость, успех, позитив" },
      { nameRu: "Суд", number: "XX", shortMeaning: "Возрождение, призыв, пробуждение" }
    ];
    
    runesData = [
      { nameRu: "Феху", symbol: "ᚠ", shortMeaning: "Богатство, изобилие, новые начинания" },
      { nameRu: "Уруз", symbol: "ᚢ", shortMeaning: "Сила, здоровье, жизненная энергия" },
      { nameRu: "Турисаз", symbol: "ᚦ", shortMeaning: "Защита, разрушение препятствий" },
      { nameRu: "Ансуз", symbol: "ᚨ", shortMeaning: "Мудрость, общение, вдохновение" },
      { nameRu: "Райдо", symbol: "ᚱ", shortMeaning: "Путешествие, движение, прогресс" },
      { nameRu: "Кеназ", symbol: "ᚲ", shortMeaning: "Огонь, творчество, знание" },
      { nameRu: "Гебо", symbol: "ᚷ", shortMeaning: "Дар, партнёрство, баланс" },
      { nameRu: "Вуньо", symbol: "ᚹ", shortMeaning: "Радость, успех, гармония" },
      { nameRu: "Хагалаз", symbol: "ᚺ", shortMeaning: "Перемены, трансформация, испытание" },
      { nameRu: "Наутиз", symbol: "ᚾ", shortMeaning: "Нужда, терпение, выносливость" },
      { nameRu: "Иса", symbol: "ᛁ", shortMeaning: "Лёд, пауза, размышление" },
      { nameRu: "Йера", symbol: "ᛃ", shortMeaning: "Урожай, результат, цикл" },
      { nameRu: "Эйваз", symbol: "ᛇ", shortMeaning: "Защита, выносливость, связь" },
      { nameRu: "Пертро", symbol: "ᛈ", shortMeaning: "Тайна, шанс, судьба" },
      { nameRu: "Альгиз", symbol: "ᛉ", shortMeaning: "Защита, интуиция, высшая сила" },
      { nameRu: "Соулу", symbol: "ᛊ", shortMeaning: "Солнце, успех, энергия" },
      { nameRu: "Тейваз", symbol: "ᛏ", shortMeaning: "Победа, справедливость, лидерство" },
      { nameRu: "Беркана", symbol: "ᛒ", shortMeaning: "Рост, рождение, обновление" },
      { nameRu: "Эваз", symbol: "ᛖ", shortMeaning: "Движение, прогресс, доверие" },
      { nameRu: "Манназ", symbol: "ᛗ", shortMeaning: "Человек, сообщество, самосознание" },
      { nameRu: "Лагуз", symbol: "ᛚ", shortMeaning: "Вода, эмоции, поток" },
      { nameRu: "Ингуз", symbol: "ᛜ", shortMeaning: "Плодородие, завершение, потенциал" },
      { nameRu: "Отала", symbol: "ᛟ", shortMeaning: "Наследие, дом, традиции" },
      { nameRu: "Дагаз", symbol: "ᛞ", shortMeaning: "День, прорыв, ясность" }
    ];
  }
}

// Predictions for Yes/No and Daily
const predictions = {
  yesno: {
    yes: [
      "Да, сегодня твой день!",
      "Удача на твоей стороне!",
      "Смело действуй — всё получится!",
      "Звёзды говорят: ДА!",
      "Твои усилия окупятся!"
    ],
    no: [
      "Не сейчас, но скоро!",
      "Лучше подождать немного...",
      "Звёзды говорят: НЕТ... пока что",
      "Пересмотри свой план",
      "Удача придёт позже!"
    ]
  },
  day: [
    "Сегодня день новых возможностей! Действуй смело.",
    "Возможны неожиданные перемены — будь готов!",
    "Хороший день для важных решений. Доверься интуиции.",
    "День спокойствия и размышлений. Не торопи события.",
    "Энергичный день! Используй его для активных действий.",
    "Возможны небольшие препятствия, но ты справишься!",
    "День удачи и сюрпризов. Будь открыт новому!"
  ]
};

// State
let currentMode = null;
let flipCount = 0;
let dailyFlips = 0;
let lastFlipDate = null;
let history = [];

// Daily limit check
function checkDailyLimit() {
  const today = new Date().toDateString();
  if (lastFlipDate !== today) {
    dailyFlips = 0;
    lastFlipDate = today;
  }
  return dailyFlips < 1;
}

// Mode selection
document.querySelectorAll('.mode-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    haptic('select');
    currentMode = btn.dataset.mode;
    
    document.getElementById('modesScreen').style.display = 'none';
    document.getElementById('fortuneScreen').style.display = 'flex';
    
    const titles = {
      yesno: 'Монетка судьбы',
      day: 'Прогноз на день',
      taro: 'Карта дня Таро',
      rune: 'Руна дня'
    };
    document.getElementById('fortuneTitle').textContent = titles[currentMode] || currentMode;
    
    // Reset UI
    document.getElementById('coin').style.display = 'none';
    document.getElementById('card').style.display = 'none';
    document.getElementById('rune').style.display = 'none';
    document.getElementById('prediction').innerHTML = '<p>Нажми, чтобы узнать свою судьбу</p>';
    document.getElementById('actionBtn').querySelector('span').textContent = 'Узнать';
    
    // Reset transformations
    const coinInner = document.querySelector('.coin-inner');
    if (coinInner) coinInner.style.transform = 'rotateY(0deg)';
    
    const cardInner = document.querySelector('.card-inner');
    if (cardInner) cardInner.style.transform = 'rotateY(0deg)';
    
    // Show appropriate element
    if (currentMode === 'yesno' || currentMode === 'day') {
      document.getElementById('coin').style.display = 'block';
    } else if (currentMode === 'taro') {
      document.getElementById('card').style.display = 'block';
    } else if (currentMode === 'rune') {
      document.getElementById('rune').style.display = 'block';
    }
    
    // Show/hide history
    if (history.length > 0) {
      document.getElementById('history').style.display = 'block';
      updateHistory();
    }
  });
});

// Back button
document.getElementById('backBtn').addEventListener('click', () => {
  haptic('select');
  document.getElementById('modesScreen').style.display = 'flex';
  document.getElementById('fortuneScreen').style.display = 'none';
  currentMode = null;
});

// Main action button
document.getElementById('actionBtn').addEventListener('click', async () => {
  if (!currentMode) return;
  
  if (!checkDailyLimit() && flipCount === 0) {
    if (tg && tg.showAlert) {
      tg.showAlert("Бесплатное гадание уже использовано сегодня! Смотри рекламу или покупай Stars для дополнительных попыток.");
    } else {
      alert("Бесплатное гадание уже использовано сегодня!");
    }
    return;
  }
  
  haptic('medium');
  const actionBtn = document.getElementById('actionBtn');
  actionBtn.disabled = true;
  
  if (currentMode === 'yesno' || currentMode === 'day') {
    // Coin flip
    const coinInner = document.querySelector('.coin-inner');
    const rotation = Math.floor(Math.random() * 360) + 1080; // 3+ full rotations
    coinInner.style.transform = `rotateY(${rotation}deg)`;
    
    setTimeout(() => {
      haptic('medium');
      const isYes = rotation % 720 < 360;
      let predictionText;
      
      if (currentMode === 'yesno') {
        const result = isYes ? 'yes' : 'no';
        predictionText = predictions.yesno[result][Math.floor(Math.random() * predictions.yesno[result].length)];
        predictionText = `<strong>${isYes ? 'ДА' : 'НЕТ'}</strong><br>${predictionText}`;
      } else {
        predictionText = predictions.day[Math.floor(Math.random() * predictions.day.length)];
      }
      
      document.getElementById('prediction').innerHTML = `<p>${predictionText}</p>`;
      addToHistory(currentMode === 'yesno' ? (isYes ? 'Да' : 'Нет') : 'День', predictionText);
      
      flipCount++;
      dailyFlips++;
      actionBtn.disabled = false;
      actionBtn.querySelector('span').textContent = "Узнать ещё раз";
      
      // Share prompt
      setTimeout(() => {
        if (tg && tg.showConfirm) {
          try {
            tg.showConfirm("Поделиться результатом?", (confirmed) => {
              if (confirmed && tg.shareUrl) {
                tg.shareUrl(`https://t.me/share/url?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(`Моё предсказание: ${predictionText}`)}`);
              }
            });
          } catch (e) {
            console.log('Share not available');
          }
        }
      }, 1000);
    }, 1200);
    
  } else if (currentMode === 'taro') {
    // Tarot card
    const cardInner = document.querySelector('.card-inner');
    cardInner.style.transform = 'rotateY(180deg)';
    
    setTimeout(() => {
      haptic('medium');
      const cardData = tarotData[Math.floor(Math.random() * tarotData.length)];
      document.getElementById('prediction').innerHTML = `<p><strong>${cardData.nameRu}</strong><br>${cardData.shortMeaning}</p>`;
      
      // Update card display
      const cardNumber = document.getElementById('tarotCardNumber');
      const cardName = document.getElementById('tarotCardName');
      if (cardNumber) cardNumber.textContent = cardData.number || '';
      if (cardName) cardName.textContent = cardData.nameRu;
      
      addToHistory('Таро', `${cardData.nameRu}: ${cardData.shortMeaning}`);
      
      flipCount++;
      dailyFlips++;
      actionBtn.disabled = false;
      actionBtn.querySelector('span').textContent = "Вытянуть ещё карту";
      
      setTimeout(() => {
        cardInner.style.transform = 'rotateY(0deg)';
      }, 3000);
      
      // Share prompt
      setTimeout(() => {
        if (tg && tg.showConfirm) {
          try {
            tg.showConfirm("Поделиться результатом?", (confirmed) => {
              if (confirmed && tg.shareUrl) {
                tg.shareUrl(`https://t.me/share/url?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(`Моя карта Таро: ${cardData.nameRu} — ${cardData.shortMeaning}`)}`);
              }
            });
          } catch (e) {
            console.log('Share not available');
          }
        }
      }, 1000);
    }, 800);
    
  } else if (currentMode === 'rune') {
    // Rune
    const runeData = runesData[Math.floor(Math.random() * runesData.length)];
    const runeSymbol = document.getElementById('runeSymbol');
    if (runeSymbol) {
      runeSymbol.textContent = runeData.symbol;
    }
    
    setTimeout(() => {
      haptic('medium');
      document.getElementById('prediction').innerHTML = `<p><strong>${runeData.nameRu}</strong><br>${runeData.shortMeaning}</p>`;
      addToHistory('Руна', `${runeData.nameRu}: ${runeData.shortMeaning}`);
      
      flipCount++;
      dailyFlips++;
      actionBtn.disabled = false;
      actionBtn.querySelector('span').textContent = "Выбрать ещё руну";
      
      // Share prompt
      setTimeout(() => {
        if (tg && tg.showConfirm) {
          try {
            tg.showConfirm("Поделиться результатом?", (confirmed) => {
              if (confirmed && tg.shareUrl) {
                tg.shareUrl(`https://t.me/share/url?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(`Моя руна: ${runeData.nameRu} — ${runeData.shortMeaning}`)}`);
              }
            });
          } catch (e) {
            console.log('Share not available');
          }
        }
      }, 1000);
    }, 500);
  }
});

// History management
function addToHistory(type, text) {
  history.unshift({ type, text, date: new Date().toLocaleTimeString() });
  if (history.length > 5) history.pop();
  updateHistory();
  document.getElementById('history').style.display = 'block';
}

function updateHistory() {
  const historyList = document.getElementById('historyList');
  historyList.innerHTML = history.map(item => 
    `<li><strong>${item.type}</strong> — ${item.text.replace(/<[^>]*>/g, '')} <small>(${item.date})</small></li>`
  ).join('');
}

// Monetization buttons
document.getElementById('watchAdBtn')?.addEventListener('click', () => {
  haptic('select');
  if (tg && tg.showAlert) {
    tg.showAlert("Реклама загружается... (функция в разработке)");
  } else {
    alert("Реклама загружается...");
  }
});

document.getElementById('buyStarsBtn')?.addEventListener('click', () => {
  haptic('select');
  if (tg && tg.showAlert) {
    tg.showAlert("Покупка Stars... (функция в разработке)");
  } else {
    alert("Покупка Stars...");
  }
});

// Initialize
loadData();

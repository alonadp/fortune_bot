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
let diceThoughtsData = null;
let dailyPersonalityData = null;

// Load data
async function loadData() {
  try {
    const personalityResponse = await fetch('data/daily-personality.json');
    dailyPersonalityData = await personalityResponse.json();
  } catch (error) {
    console.error('Failed to load daily personality:', error);
    // Minimal fallback so the daily layer keeps working offline
    dailyPersonalityData = {
      moods: {
        calm: [{ id: 'mood_calm_01', text: 'Сегодня хороший день не торопить ответы.' }],
        mystic: [{ id: 'mood_mystic_01', text: 'Сегодня Вселенная настроена загадочно.' }],
        playful: [{ id: 'mood_playful_03', text: 'Сегодня Вселенная сама ещё не определилась.' }]
      },
      anomalies: { coin: [], tarot: [], rune: [], dice: [], forecast: [] },
      crossReactions: { aligned: [], mixed: [], reflection: [], action: [] }
    };
  }
  try {
    const diceResponse = await fetch('data/dice-thoughts.json');
    diceThoughtsData = await diceResponse.json();
  } catch (error) {
    console.error('Failed to load dice thoughts:', error);
    // Minimal fallback so the dice keeps working offline
    diceThoughtsData = {
      "1": [{ id: 'release_01', text: 'Не всё, что закончилось, было ошибкой.' }],
      "2": [{ id: 'decide_01', text: 'Уверенность часто приходит после первого шага.' }],
      "3": [{ id: 'reframe_03', text: 'То, что кажется тупиком, иногда просто требует другого маршрута.' }],
      "4": [{ id: 'people_01', text: 'Обращай внимание не на обещания, а на повторяющиеся поступки.' }],
      "5": [{ id: 'chance_03', text: 'Неожиданное не обязательно означает плохое.' }],
      "6": [{ id: 'act_01', text: 'Не жди уверенности. Иногда она появляется только после действия.' }],
      absurd: [{ id: 'absurd_04', text: 'Иногда Вселенная молчит. Иногда ей просто нечего добавить.' }]
    };
  }
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
// Accumulated coin rotation so every toss spins forward from its current pose
let coinRotY = 0;
let lastFlipDate = null;
let history = [];

// Local calendar date (used for all daily resets)
function getLocalDateStr() {
  const today = new Date();
  return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
}

// Daily results cache
function getTodayKey(prefix) {
  return `${prefix}_daily_${getLocalDateStr()}`;
}

function getDailyResult(type) {
  try {
    const key = getTodayKey(type);
    const cached = localStorage.getItem(key);
    return cached ? JSON.parse(cached) : null;
  } catch (e) {
    return null;
  }
}

function setDailyResult(type, data) {
  try {
    const key = getTodayKey(type);
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    // Fail silently
  }
}

// === Dice Thought module ===
// Categories are hidden from the user: 1 release, 2 decide, 3 reframe,
// 4 people, 5 chance, 6 act. "absurd" replaces the thought (not the number)
// with configurable probability.
const DiceThought = {
  ABSURD_CHANCE: 0.12,
  // Dice orientation (rotateX/rotateY in deg) that shows each face to the viewer
  FACE_ROTATIONS: {
    1: { x: 0,   y: 0 },
    2: { x: 0,   y: -90 },
    3: { x: -90, y: 0 },
    4: { x: 90,  y: 0 },
    5: { x: 0,   y: 90 },
    6: { x: 0,   y: 180 }
  },
  rotX: -22,
  rotY: 28,
  lastThoughtId: null,
  rolling: false,

  prefersReducedMotion() {
    return !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  },

  // Spins the CSS cube and returns { value, duration }
  roll() {
    const value = 1 + Math.floor(Math.random() * 6);
    const target = this.FACE_ROTATIONS[value];
    const diceEl = document.getElementById('dice');
    let duration;

    if (this.prefersReducedMotion()) {
      duration = 250;
      this.rotX = target.x;
      this.rotY = target.y;
    } else {
      duration = 1000 + Math.floor(Math.random() * 400); // 1000-1400ms
      // Accumulate 2-3 extra full turns per axis, then land exactly on the face
      const baseX = this.rotX + 360 * (2 + Math.floor(Math.random() * 2));
      const baseY = this.rotY + 360 * (2 + Math.floor(Math.random() * 2));
      this.rotX = baseX + ((((target.x - baseX) % 360) + 360) % 360);
      this.rotY = baseY + ((((target.y - baseY) % 360) + 360) % 360);
    }

    if (diceEl) {
      diceEl.style.transitionDuration = duration + 'ms';
      diceEl.style.transform = `rotateX(${this.rotX}deg) rotateY(${this.rotY}deg)`;
    }
    return { value, duration };
  },

  // Picks a thought for the rolled value; occasionally an absurd one.
  // Never repeats the previous thought back-to-back when possible.
  pickThought(value) {
    if (!diceThoughtsData) return null;
    let pool = diceThoughtsData[String(value)] || [];
    if (Math.random() < this.ABSURD_CHANCE && Array.isArray(diceThoughtsData.absurd) && diceThoughtsData.absurd.length) {
      pool = diceThoughtsData.absurd;
    }
    if (!pool.length) return null;

    let thought = pool[Math.floor(Math.random() * pool.length)];
    if (pool.length > 1 && thought.id === this.lastThoughtId) {
      const others = pool.filter(t => t.id !== this.lastThoughtId);
      thought = others[Math.floor(Math.random() * others.length)];
    }
    this.lastThoughtId = thought.id;
    return thought;
  }
};

// === Daily creative layer ===
// One mood per local calendar day, rare presentation-only "anomalies" after
// results, and a single once-a-day cross-reaction when 3+ modes were used.
// Never alters actual fortune results.
const DailyLayer = {
  ANOMALY_CHANCE: 0.05,
  MOOD_WEIGHTS: [
    { tone: 'calm', weight: 0.45 },
    { tone: 'mystic', weight: 0.40 },
    { tone: 'playful', weight: 0.15 }
  ],
  STATE_KEY: 'fortune_daily_state',
  // Presentation tone of a result, for the light cross-reaction only
  THEME_TONE: { sun: 'positive', energy: 'action', warning: 'caution', moon: 'reflection', calm: 'reflection', mystic: 'neutral' },
  DICE_TONE: { 1: 'reflection', 2: 'action', 3: 'reflection', 4: 'neutral', 5: 'neutral', 6: 'action' },
  state: null
};

function loadDailyState() {
  const today = getLocalDateStr();
  try {
    const raw = localStorage.getItem(DailyLayer.STATE_KEY);
    if (raw) {
      const saved = JSON.parse(raw);
      if (saved && saved.date === today) return saved;
    }
  } catch (e) {
    // Fall through to a fresh state
  }
  return { date: today, mood: null, completed: {}, tones: {}, crossReactionShown: false };
}

function saveDailyState() {
  try {
    localStorage.setItem(DailyLayer.STATE_KEY, JSON.stringify(DailyLayer.state));
  } catch (e) {
    // Fail silently
  }
}

function pickRandom(pool) {
  return pool[Math.floor(Math.random() * pool.length)];
}

// Picks today's mood once and keeps it for the rest of the local day
function ensureDailyMood() {
  const state = DailyLayer.state;
  const moods = dailyPersonalityData && dailyPersonalityData.moods;
  if (!moods) return null;

  if (state.mood && state.mood.tone && moods[state.mood.tone]) {
    const saved = moods[state.mood.tone].find(m => m.id === state.mood.id);
    if (saved) return saved.text;
  }

  const roll = Math.random();
  let acc = 0;
  let tone = 'calm';
  for (const entry of DailyLayer.MOOD_WEIGHTS) {
    acc += entry.weight;
    if (roll < acc) { tone = entry.tone; break; }
  }
  const pool = moods[tone] && moods[tone].length ? moods[tone] : moods.calm;
  const mood = pickRandom(pool);
  state.mood = { id: mood.id, tone };
  saveDailyState();
  return mood.text;
}

function renderDailyMood() {
  const moodText = ensureDailyMood();
  const el = document.getElementById('dailyMood');
  if (!el || !moodText) return;
  document.getElementById('dailyMoodText').textContent = moodText;
  el.style.display = 'flex';
}

// Tiny muted dot on main screen cards already opened today
const MODE_TO_STATE_KEY = { yesno: 'coin', taro: 'tarot', rune: 'rune', dice: 'dice', day: 'forecast' };

function updateDoneDots() {
  if (!DailyLayer.state) return;
  document.querySelectorAll('.mode-btn').forEach(btn => {
    const key = MODE_TO_STATE_KEY[btn.dataset.mode];
    const done = !!DailyLayer.state.completed[key];
    let dot = btn.querySelector('.done-dot');
    if (done && !dot) {
      dot = document.createElement('span');
      dot.className = 'done-dot';
      dot.setAttribute('aria-hidden', 'true');
      btn.appendChild(dot);
    } else if (!done && dot) {
      dot.remove();
    }
  });
}

function hideAtmosNote() {
  const el = document.getElementById('atmosNote');
  if (el) el.style.display = 'none';
}

function showAtmosNote(text) {
  const el = document.getElementById('atmosNote');
  if (!el || !text) return;
  document.getElementById('atmosNoteText').textContent = text;
  el.style.display = 'none';
  void el.offsetWidth;
  el.style.display = 'flex';
}

// Picks the once-a-day cross-reaction type from collected result tones
function pickCrossReaction() {
  const reactions = dailyPersonalityData && dailyPersonalityData.crossReactions;
  if (!reactions) return null;

  const tones = Object.values(DailyLayer.state.tones);
  const count = tone => tones.filter(t => t === tone).length;

  let type;
  if (count('action') >= 2) type = 'action';
  else if (count('reflection') >= 2) type = 'reflection';
  else if (new Set(tones).size <= 2) type = 'aligned';
  else type = 'mixed';

  const pool = reactions[type];
  return pool && pool.length ? pickRandom(pool).text : null;
}

// Records a completed mode and maybe shows ONE atmospheric note:
// the once-a-day cross-reaction has priority over a rare anomaly.
function recordDailyResult(anomalyKey, tone, suppressAnomaly) {
  const state = DailyLayer.state;
  if (!state) return;
  state.completed[anomalyKey] = true;
  if (tone) state.tones[anomalyKey] = tone;
  saveDailyState();

  const completedCount = Object.keys(state.completed).filter(k => state.completed[k]).length;
  if (!state.crossReactionShown && completedCount >= 3) {
    const reaction = pickCrossReaction();
    if (reaction) {
      showAtmosNote(reaction);
      state.crossReactionShown = true;
      saveDailyState();
      return;
    }
  }

  if (suppressAnomaly) return;
  if (Math.random() < DailyLayer.ANOMALY_CHANCE) {
    const pools = dailyPersonalityData && dailyPersonalityData.anomalies;
    const pool = pools && pools[anomalyKey];
    if (pool && pool.length) showAtmosNote(pickRandom(pool).text);
  }
}

function initDailyLayer() {
  DailyLayer.state = loadDailyState();
  saveDailyState();
  renderDailyMood();
  updateDoneDots();
}

// === Visual atmosphere themes (presentation only) ===
const SCREEN_THEMES = { yesno: 'screen--coin', taro: 'screen--tarot', rune: 'screen--rune', day: 'screen--daily', dice: 'screen--dice' };
const RESULT_THEME_CLASSES = ['theme-moon', 'theme-sun', 'theme-warning', 'theme-calm', 'theme-energy', 'theme-mystic'];

function setScreenTheme(mode) {
  const el = document.getElementById('fortuneScreen');
  if (!el) return;
  el.classList.remove(...Object.values(SCREEN_THEMES), ...RESULT_THEME_CLASSES);
  if (SCREEN_THEMES[mode]) el.classList.add(SCREEN_THEMES[mode]);
}

function setResultTheme(theme) {
  const el = document.getElementById('fortuneScreen');
  if (!el || !theme) return;
  el.classList.remove(...RESULT_THEME_CLASSES);
  el.classList.add('theme-' + theme);
}

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
    
    // «Что ты видишь?» lives on its own screen with its own flow
    if (currentMode === 'assoc') {
      currentMode = null;
      openAssocScreen();
      return;
    }
    
    document.getElementById('modesScreen').style.display = 'none';
    document.getElementById('fortuneScreen').style.display = 'flex';
    setScreenTheme(currentMode);
    // Inner screens start compactly, without the big editorial home header
    document.body.classList.add('hide-home-hero');
    
    const titles = {
      yesno: 'Монетка судьбы',
      day: 'Прогноз на день',
      taro: 'Карта дня Таро',
      rune: 'Руна дня',
      dice: 'Кубик мысли'
    };
    document.getElementById('fortuneTitle').textContent = titles[currentMode] || currentMode;
    
    // Reset UI
    document.getElementById('coin').style.display = 'none';
    document.getElementById('card').style.display = 'none';
    document.getElementById('rune').style.display = 'none';
    document.getElementById('questionMark').style.display = 'none';
    document.getElementById('diceScene').style.display = 'none';
    document.getElementById('fortuneSubtitle').style.display = 'none';
    hideAtmosNote();
    document.querySelector('.fortune-display').style.display = 'flex';
    document.getElementById('prediction').style.display = 'block';
    document.getElementById('prediction').classList.remove('prediction--reveal');
    document.getElementById('prediction').innerHTML = '<p>Нажми, чтобы узнать свою судьбу</p>';
    document.getElementById('actionBtn').querySelector('span').textContent = 'Узнать';
    
    // Reset transformations (instantly, without playing the flip transition)
    const coinInner = document.querySelector('.coin-inner');
    if (coinInner) {
      coinInner.style.transitionDuration = '0ms';
      coinInner.style.transform = 'rotateY(0deg)';
    }
    coinRotY = 0;
    
    const cardInner = document.querySelector('.card-inner');
    if (cardInner) cardInner.style.transform = 'rotateY(0deg)';
    
    // Show appropriate element
    if (currentMode === 'yesno') {
      document.getElementById('coin').style.display = 'block';
      document.getElementById('questionMark').style.display = 'none';
    } else if (currentMode === 'day') {
      // Для "на день" показываем знак вопроса
      document.getElementById('coin').style.display = 'none';
      document.getElementById('questionMark').style.display = 'flex';
      document.getElementById('prediction').style.display = 'none';
    } else if (currentMode === 'taro') {
      document.getElementById('card').style.display = 'block';
      document.getElementById('questionMark').style.display = 'none';
    } else if (currentMode === 'rune') {
      document.getElementById('rune').style.display = 'block';
      document.getElementById('questionMark').style.display = 'none';
    } else if (currentMode === 'dice') {
      document.getElementById('diceScene').style.display = 'block';
      document.getElementById('fortuneSubtitle').style.display = 'block';
      // No result shown before the first throw
      document.getElementById('prediction').style.display = 'none';
      document.getElementById('actionBtn').querySelector('span').textContent = 'Бросить кубик';
    }
    
    // Show/hide history (the dice screen stays calm and minimal)
    if (history.length > 0 && currentMode !== 'dice') {
      document.getElementById('history').style.display = 'block';
      updateHistory();
    } else {
      document.getElementById('history').style.display = 'none';
    }
  });
});

// Back button
document.getElementById('backBtn').addEventListener('click', () => {
  haptic('select');
  document.body.classList.remove('hide-home-hero');
  document.getElementById('modesScreen').style.display = 'flex';
  document.getElementById('fortuneScreen').style.display = 'none';
  currentMode = null;
  updateDoneDots();
});

// Main action button
document.getElementById('actionBtn').addEventListener('click', async () => {
  if (!currentMode) return;
  
  // Dice throws are free and unlimited
  if (currentMode !== 'dice' && !checkDailyLimit() && flipCount === 0) {
    if (tg && tg.showAlert) {
      tg.showAlert("Бесплатное гадание уже использовано сегодня! Смотри рекламу или покупай Stars для дополнительных попыток.");
    } else {
      alert("Бесплатное гадание уже использовано сегодня!");
    }
    return;
  }
  
  haptic(currentMode === 'dice' ? 'light' : 'medium');
  const actionBtn = document.getElementById('actionBtn');
  actionBtn.disabled = true;
  hideAtmosNote();
  
  if (currentMode === 'dice') {
    // Thought Dice: physical number is always shown; the thought may be absurd
    if (DiceThought.rolling) return;
    DiceThought.rolling = true;
    actionBtn.querySelector('span').textContent = 'Кубик думает…';

    const rollResult = DiceThought.roll();
    const scene = document.getElementById('diceScene');

    if (scene) {
      scene.classList.remove('dice-scene--settled');
      if (!DiceThought.prefersReducedMotion()) {
        scene.classList.remove('dice-scene--rolling');
        void scene.offsetWidth;
        scene.style.animationDuration = rollResult.duration + 'ms';
        scene.classList.add('dice-scene--rolling');
      }
    }

    setTimeout(() => {
      haptic('select');
      if (scene) {
        scene.classList.remove('dice-scene--rolling');
        scene.classList.add('dice-scene--settled');
      }

      const thought = DiceThought.pickThought(rollResult.value);
      const isAbsurd = !!(thought && String(thought.id).indexOf('absurd') === 0);
      const prediction = document.getElementById('prediction');
      prediction.innerHTML = `<p class="dice-caption">Твоя мысль</p><p class="dice-thought">${thought ? thought.text : 'Мысль потерялась по дороге. Брось ещё раз.'}</p>`;
      prediction.style.display = 'block';
      prediction.classList.remove('prediction--reveal');
      void prediction.offsetWidth;
      prediction.classList.add('prediction--reveal');

      // Gently reveal the result only if it sits below the viewport
      if (prediction.getBoundingClientRect().bottom > window.innerHeight) {
        prediction.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }

      DiceThought.rolling = false;
      actionBtn.disabled = false;
      actionBtn.querySelector('span').textContent = 'Бросить ещё раз';

      // Absurd thought already carries the humor — skip the anomaly then
      recordDailyResult('dice', DailyLayer.DICE_TONE[rollResult.value] || 'neutral', isAbsurd);
    }, rollResult.duration + 150);

  } else if (currentMode === 'yesno') {
    // Coin flip - YES/NO only
    const coinInner = document.querySelector('.coin-inner');
    
    // Determine result FIRST — the animation only visualizes it
    const isYes = Math.random() < 0.5;
    
    const reducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let tossDuration;
    
    if (reducedMotion) {
      // Short direct flip to the result, no long spin
      tossDuration = 300;
      coinRotY = isYes ? 0 : 180;
      coinInner.style.transitionDuration = '250ms';
      coinInner.style.transform = `rotateY(${coinRotY}deg)`;
    } else {
      tossDuration = 1300;
      // 3-5 full spins around the vertical axis, landing exactly on ДА (0°) or НЕТ (180°)
      const spins = (Math.floor(Math.random() * 3) + 3) * 360;
      const baseY = coinRotY + spins;
      const finalFace = isYes ? 0 : 180;
      coinRotY = baseY + ((((finalFace - baseY) % 360) + 360) % 360);
      
      coinInner.style.transitionDuration = tossDuration + 'ms';
      coinInner.style.transform = `rotateY(${coinRotY}deg)`;
    }
    
    setTimeout(() => {
      haptic('medium');
      
      const result = isYes ? 'yes' : 'no';
      let predictionText = predictions.yesno[result][Math.floor(Math.random() * predictions.yesno[result].length)];
      predictionText = `<strong>${isYes ? 'ДА' : 'НЕТ'}</strong><br>${predictionText}`;
      
      document.getElementById('prediction').innerHTML = `<p>${predictionText}</p>`;
      addToHistory(isYes ? 'Да' : 'Нет', predictionText);
      
      flipCount++;
      dailyFlips++;
      actionBtn.disabled = false;
      actionBtn.querySelector('span').textContent = "Узнать ещё раз";
      recordDailyResult('coin', isYes ? 'positive' : 'caution', false);
      
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
    }, tossDuration + 60);
    
  } else if (currentMode === 'day') {
    // Daily prediction - check cache
    let predictionText = getDailyResult('day_prediction');
    
    if (!predictionText) {
      // Generate new prediction for today
      predictionText = predictions.day[Math.floor(Math.random() * predictions.day.length)];
      setDailyResult('day_prediction', predictionText);
    }
    
    setTimeout(() => {
      haptic('medium');
      
      // Hide question mark and collapse display area, show prediction in its place
      document.getElementById('questionMark').style.display = 'none';
      document.querySelector('.fortune-display').style.display = 'none';
      document.getElementById('prediction').style.display = 'block';
      document.getElementById('prediction').innerHTML = `<p>${predictionText}</p>`;
      addToHistory('День', predictionText);
      
      flipCount++;
      dailyFlips++;
      actionBtn.disabled = false;
      actionBtn.querySelector('span').textContent = "Посмотреть снова";
      recordDailyResult('forecast', 'neutral', false);
      
      // Share prompt
      setTimeout(() => {
        if (tg && tg.showConfirm) {
          try {
            tg.showConfirm("Поделиться результатом?", (confirmed) => {
              if (confirmed && tg.shareUrl) {
                tg.shareUrl(`https://t.me/share/url?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(`Мой прогноз на день: ${predictionText}`)}`);
              }
            });
          } catch (e) {
            console.log('Share not available');
          }
        }
      }, 500);
    }, 500);
    
  } else if (currentMode === 'taro') {
    // Tarot card - check daily cache
    let cardData = getDailyResult('tarot');
    
    if (!cardData) {
      // Generate new card for today
      cardData = tarotData[Math.floor(Math.random() * tarotData.length)];
      setDailyResult('tarot', cardData);
    }
    
    const cardInner = document.querySelector('.card-inner');
    cardInner.style.transform = 'rotateY(180deg)';
    
    setTimeout(() => {
      haptic('medium');
      setResultTheme(cardData.theme || 'mystic');
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
      actionBtn.querySelector('span').textContent = "Посмотреть снова";
      recordDailyResult('tarot', DailyLayer.THEME_TONE[cardData.theme] || 'neutral', false);
      
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
    // Rune - check daily cache
    let runeData = getDailyResult('rune');
    
    if (!runeData) {
      // Generate new rune for today
      runeData = runesData[Math.floor(Math.random() * runesData.length)];
      setDailyResult('rune', runeData);
    }
    
    const runeSymbol = document.getElementById('runeSymbol');
    if (runeSymbol) {
      runeSymbol.textContent = runeData.symbol;
    }
    
    setTimeout(() => {
      haptic('medium');
      setResultTheme(runeData.theme || 'mystic');
      document.getElementById('prediction').innerHTML = `<p><strong>${runeData.nameRu}</strong><br>${runeData.shortMeaning}</p>`;
      addToHistory('Руна', `${runeData.nameRu}: ${runeData.shortMeaning}`);
      
      flipCount++;
      dailyFlips++;
      actionBtn.disabled = false;
      actionBtn.querySelector('span').textContent = "Посмотреть снова";
      recordDailyResult('rune', DailyLayer.THEME_TONE[runeData.theme] || 'neutral', false);
      
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

// === «Что ты видишь?» — association / metaphoric cards ===
//
// Author deck, cards A001–A010. `internalName` is developer-only and is never
// rendered to the user. Real illustrations will be added later: set `image`
// to e.g. 'assets/association-cards/A001.webp' and the card front switches
// from its CSS/SVG placeholder to the image automatically. While `image` is
// null/undefined or fails to load, the placeholder is shown, so a broken
// image can never appear.
const ASSOCIATION_DECK = [
  {
    id: 'A001',
    internalName: 'Дверь',
    image: 'assets/association-cards/A001.webp',
    elements: [
      {
        id: 'door',
        label: 'Дверь',
        insight: 'Возможно, сейчас ты особенно замечаешь саму возможность что-то изменить.',
        question: 'Какой шаг уже доступен тебе, но ты всё ещё ждёшь подходящего момента?'
      },
      {
        id: 'light',
        label: 'Свет',
        insight: 'Возможно, тебя сейчас больше притягивает не путь, а ощущение того, что где-то должно стать легче.',
        question: 'Ты действительно хочешь туда — или просто больше не хочешь оставаться здесь?'
      },
      {
        id: 'chair',
        label: 'Стул',
        insight: 'Иногда привычное удерживает нас не потому, что там хорошо, а потому, что оно знакомо.',
        question: 'Что ты получаешь, оставаясь на месте?'
      },
      {
        id: 'shadow',
        label: 'Тень',
        insight: 'Возможно, неизвестность сейчас занимает в твоих мыслях больше места, чем сама возможность.',
        question: 'Что именно тебя пугает — реальный риск или отсутствие гарантий?'
      }
    ]
  },
  {
    id: 'A002',
    internalName: 'Лодка',
    image: 'assets/association-cards/A002.webp',
    elements: [
      {
        id: 'boat',
        label: 'Лодка',
        insight: 'Возможно, часть тебя уже готова двигаться дальше.',
        question: 'Если бы решение зависело только от тебя, куда бы ты направилась?'
      },
      {
        id: 'rope',
        label: 'Верёвка',
        insight: 'Иногда нас удерживает совсем небольшая вещь — но именно ей мы отдаём слишком много значения.',
        question: 'Что на самом деле не позволяет тебе двинуться?'
      },
      {
        id: 'water',
        label: 'Вода',
        insight: 'Возможно, сейчас тебе важнее не направление, а ощущение спокойствия.',
        question: 'Тебе действительно нужно принять решение прямо сейчас?'
      },
      {
        id: 'horizon',
        label: 'Горизонт',
        insight: 'Твоё внимание оказалось там, куда ещё невозможно дотянуться.',
        question: 'Не слишком ли много сил сейчас уходит на то, чего ещё нет?'
      }
    ]
  },
  {
    id: 'A003',
    internalName: 'Развилка',
    image: 'assets/association-cards/A003.webp',
    elements: [
      {
        id: 'light_path',
        label: 'Светлая дорога',
        insight: 'Возможно, сейчас тебя притягивает вариант, который кажется понятнее и безопаснее.',
        question: 'Ты выбираешь его потому, что хочешь — или потому, что он меньше пугает?'
      },
      {
        id: 'dark_path',
        label: 'Тёмная дорога',
        insight: 'Иногда неизвестное притягивает именно потому, что там может оказаться что-то новое.',
        question: 'Что бы ты выбрала, если бы не боялась ошибиться?'
      },
      {
        id: 'sign',
        label: 'Указатель',
        insight: 'Возможно, тебе хочется получить подтверждение извне.',
        question: 'Чьего разрешения или совета ты сейчас ждёшь?'
      },
      {
        id: 'person',
        label: 'Человек',
        insight: 'Возможно, дело вообще не в двух дорогах, а в готовности сделать первый шаг.',
        question: 'Какое решение ты уже практически приняла?'
      }
    ]
  },
  {
    id: 'A004',
    internalName: 'Мост',
    image: 'assets/association-cards/A004.webp',
    elements: [
      {
        id: 'bridge',
        label: 'Мост',
        insight: 'Возможно, ты уже видишь способ перейти из нынешней ситуации в другую.',
        question: 'Какой переход сейчас кажется тебе самым важным?'
      },
      {
        id: 'other_side',
        label: 'Другой берег',
        insight: 'Иногда мы настолько смотрим на результат, что забываем про путь к нему.',
        question: 'Готова ли ты к тому, что находится между «сейчас» и «потом»?'
      },
      {
        id: 'water',
        label: 'Вода',
        insight: 'Возможно, тебе сейчас хочется не перемен, а внутренней тишины.',
        question: 'Что можно перестать контролировать хотя бы ненадолго?'
      },
      {
        id: 'figure',
        label: 'Фигура',
        insight: 'Ты заметила человека раньше дороги.',
        question: 'В этой ситуации ты больше думаешь о собственном выборе или о реакции других?'
      }
    ]
  },
  {
    id: 'A005',
    internalName: 'Открытая клетка',
    image: 'assets/association-cards/A005.webp',
    elements: [
      {
        id: 'bird',
        label: 'Птица',
        insight: 'Возможность двигаться уже может существовать, даже если готовность ещё не появилась.',
        question: 'Что бы ты сделала, если бы точно знала, что можешь вернуться?'
      },
      {
        id: 'cage',
        label: 'Клетка',
        insight: 'Иногда знакомые ограничения становятся частью ощущения безопасности.',
        question: 'Что привычное тебе трудно оставить, даже если оно уже мешает?'
      },
      {
        id: 'open_door',
        label: 'Открытая дверца',
        insight: 'Возможно, препятствие, которое раньше существовало, уже изменилось.',
        question: 'Не продолжаешь ли ты ждать разрешения, которое тебе больше не требуется?'
      },
      {
        id: 'sky',
        label: 'Небо',
        insight: 'Ты посмотрела не на ограничение, а на пространство вокруг него.',
        question: 'Чего тебе сейчас хочется больше — определённости или свободы?'
      }
    ]
  },
  {
    id: 'A006',
    internalName: 'Лестница',
    image: 'assets/association-cards/A006.webp',
    elements: [
      {
        id: 'first_step',
        label: 'Первая ступень',
        insight: 'Возможно, сейчас тебе важнее конкретное действие, чем понимание всего пути.',
        question: 'Какой самый маленький шаг можно сделать сегодня?'
      },
      {
        id: 'stairs',
        label: 'Ступени',
        insight: 'Ты увидела путь как последовательность.',
        question: 'Не пытаешься ли ты решить сразу то, что можно проходить постепенно?'
      },
      {
        id: 'fog',
        label: 'Туман',
        insight: 'Неопределённость сейчас может быть центральной частью твоего вопроса.',
        question: 'Что изменилось бы, если бы тебе не требовалось заранее знать результат?'
      },
      {
        id: 'top',
        label: 'Верх',
        insight: 'Возможно, твоё внимание слишком далеко впереди.',
        question: 'Что происходит прямо сейчас, пока ты думаешь о том, что будет потом?'
      }
    ]
  },
  {
    id: 'A007',
    internalName: 'Чемодан',
    image: 'assets/association-cards/A007.webp',
    elements: [
      {
        id: 'suitcase',
        label: 'Чемодан',
        insight: 'Возможно, внутри ты уже готовишься к перемене, даже если она ещё не произошла.',
        question: 'Что ты уже мысленно оставила позади?'
      },
      {
        id: 'train',
        label: 'Поезд',
        insight: 'Возможно, тебя беспокоит возможность, которая может пройти мимо.',
        question: 'Ты действительно опаздываешь — или просто боишься упустить шанс?'
      },
      {
        id: 'clock',
        label: 'Часы',
        insight: 'Сейчас особенно заметным для тебя оказалось время.',
        question: 'Почему тебе кажется, что решение нужно принять именно сейчас?'
      },
      {
        id: 'platform',
        label: 'Пустая платформа',
        insight: 'Возможно, сильнее всего ты почувствовала отсутствие людей.',
        question: 'Чьей поддержки тебе хотелось бы в этой ситуации?'
      }
    ]
  },
  {
    id: 'A008',
    internalName: 'Стена',
    image: 'assets/association-cards/A008.webp',
    elements: [
      {
        id: 'wall',
        label: 'Стена',
        insight: 'Возможно, сейчас проблема ощущается значительно больше тебя.',
        question: 'Что в этой ситуации действительно невозможно, а что просто очень сложно?'
      },
      {
        id: 'crack',
        label: 'Трещина',
        insight: 'Ты первой заметила несовершенство препятствия.',
        question: 'Где находится самое слабое место проблемы?'
      },
      {
        id: 'light',
        label: 'Свет',
        insight: 'Даже среди ограничения твоё внимание нашло возможность.',
        question: 'Что уже говорит тебе о том, что ситуация может измениться?'
      },
      {
        id: 'person',
        label: 'Человек',
        insight: 'Возможно, тебя больше заинтересовало не препятствие, а тот, кто перед ним стоит.',
        question: 'Что находится в зоне твоего влияния прямо сейчас?'
      }
    ]
  },
  {
    id: 'A009',
    internalName: 'Два стула',
    image: 'assets/association-cards/A009.webp',
    elements: [
      {
        id: 'first_chair',
        label: 'Первый стул',
        insight: 'Возможно, ты автоматически заняла одну из сторон этой истории.',
        question: 'Что ты хотела бы сказать, сидя на этом месте?'
      },
      {
        id: 'second_chair',
        label: 'Второй стул',
        insight: 'Твоё внимание сначала оказалось на другой стороне.',
        question: 'Что ты пытаешься понять в другом человеке?'
      },
      {
        id: 'distance',
        label: 'Расстояние',
        insight: 'Возможно, важнее самих людей сейчас стало то, что находится между ними.',
        question: 'Что создаёт эту дистанцию?'
      },
      {
        id: 'empty_space',
        label: 'Пустое пространство',
        insight: 'Возможно, эта история занимает меньше места, чем пространство вокруг неё.',
        question: 'Что ещё существует в твоей жизни за пределами этой ситуации?'
      }
    ]
  },
  {
    id: 'A010',
    internalName: 'Зеркало',
    image: 'assets/association-cards/A010.webp',
    elements: [
      {
        id: 'person',
        label: 'Человек',
        insight: 'Возможно, сейчас тебе важнее то, какой ты себя ощущаешь.',
        question: 'Чего хочется именно тебе, если на минуту убрать ожидания других?'
      },
      {
        id: 'reflection',
        label: 'Отражение',
        insight: 'Возможно, твоё внимание привлекла другая версия возможного.',
        question: 'Какой ты позволяешь себе быть только в мыслях?'
      },
      {
        id: 'mirror',
        label: 'Зеркало',
        insight: 'Иногда мы ищем ответ, продолжая смотреть на ситуацию с одной и той же позиции.',
        question: 'Что изменится, если посмотреть на неё совершенно иначе?'
      },
      {
        id: 'surrounding_space',
        label: 'Пространство вокруг',
        insight: 'Ты заметила контекст раньше главного объекта.',
        question: 'Не стала ли одна проблема занимать в твоей голове больше места, чем она занимает в жизни?'
      }
    ]
  }
];

// Simple conceptual SVG placeholders (technical stand-ins until the real
// A001.webp…A010.webp illustrations are added)
const ASSOC_PLACEHOLDERS = {
  // Дверь: приоткрытая дверь, свет, стул, тень
  A001:
    '<svg viewBox="0 0 120 160" fill="none" xmlns="http://www.w3.org/2000/svg">' +
    '<rect x="44" y="36" width="40" height="78" rx="3" stroke="currentColor" stroke-width="1.6"/>' +
    '<path d="M50 114 L50 42 L72 48 L72 110 Z" stroke="currentColor" stroke-width="1.4" opacity="0.7"/>' +
    '<path d="M78 54 L90 46 M78 68 L94 64 M78 82 L90 84" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" opacity="0.55"/>' +
    '<path d="M26 114 V96 M26 104 H36 V114 M28 114 V118 M34 114 V118" stroke="currentColor" stroke-width="1.4" opacity="0.75"/>' +
    '<path d="M46 122 L86 132" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" opacity="0.35"/>' +
    '</svg>',
  // Лодка: лодка, верёвка, вода, горизонт
  A002:
    '<svg viewBox="0 0 120 160" fill="none" xmlns="http://www.w3.org/2000/svg">' +
    '<path d="M40 88 L84 88 L76 100 L48 100 Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>' +
    '<path d="M62 88 V58 L78 84" stroke="currentColor" stroke-width="1.4" opacity="0.8"/>' +
    '<path d="M40 90 C34 96 30 104 30 112" stroke="currentColor" stroke-width="1.3" opacity="0.6"/>' +
    '<path d="M26 118 C34 114 42 122 50 118 C58 114 66 122 74 118 C82 114 90 122 98 118" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" opacity="0.5"/>' +
    '<path d="M24 44 L96 44" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" opacity="0.35"/>' +
    '</svg>',
  // Развилка: две дороги, указатель, человек
  A003:
    '<svg viewBox="0 0 120 160" fill="none" xmlns="http://www.w3.org/2000/svg">' +
    '<path d="M60 138 C60 118 60 106 60 94" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>' +
    '<path d="M60 94 C52 74 44 58 36 40" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>' +
    '<path d="M60 94 C68 74 76 58 84 40" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" opacity="0.55"/>' +
    '<path d="M84 70 V56 M84 60 L96 56 L84 52" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round" opacity="0.7"/>' +
    '<circle cx="52" cy="118" r="3.4" stroke="currentColor" stroke-width="1.4" opacity="0.85"/>' +
    '<path d="M52 122 L52 132" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" opacity="0.85"/>' +
    '</svg>',
  // Мост: арка моста, берега, вода, фигура
  A004:
    '<svg viewBox="0 0 120 160" fill="none" xmlns="http://www.w3.org/2000/svg">' +
    '<path d="M24 94 C42 68 78 68 96 94" stroke="currentColor" stroke-width="1.6"/>' +
    '<path d="M20 94 L100 94" stroke="currentColor" stroke-width="1.3" opacity="0.6"/>' +
    '<path d="M30 118 C38 114 46 122 54 118 C62 114 70 122 78 118 C86 114 94 122 102 118" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" opacity="0.5"/>' +
    '<circle cx="44" cy="80" r="3" stroke="currentColor" stroke-width="1.3" opacity="0.8"/>' +
    '<path d="M44 83 L44 92" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" opacity="0.8"/>' +
    '</svg>',
  // Открытая клетка: клетка, дверца, птица, небо
  A005:
    '<svg viewBox="0 0 120 160" fill="none" xmlns="http://www.w3.org/2000/svg">' +
    '<path d="M40 120 L80 120" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>' +
    '<path d="M44 120 V68 C44 52 76 52 76 68 V120" stroke="currentColor" stroke-width="1.6"/>' +
    '<path d="M52 120 V60 M60 120 V56 M68 120 V60" stroke="currentColor" stroke-width="1.2" opacity="0.5"/>' +
    '<path d="M76 86 L92 78" stroke="currentColor" stroke-width="1.4" opacity="0.75"/>' +
    '<path d="M84 42 C87 38 90 38 92 42 C94 38 97 38 100 42" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" opacity="0.85"/>' +
    '</svg>',
  // Лестница: ступени, туман, верх
  A006:
    '<svg viewBox="0 0 120 160" fill="none" xmlns="http://www.w3.org/2000/svg">' +
    '<path d="M24 130 L44 130 L44 110 L64 110 L64 90 L84 90 L84 70 L98 70" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>' +
    '<path d="M74 52 C80 48 88 50 94 48" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" opacity="0.4"/>' +
    '<path d="M66 42 C74 38 84 40 92 38" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" opacity="0.3"/>' +
    '</svg>',
  // Чемодан: чемодан, часы, платформа
  A007:
    '<svg viewBox="0 0 120 160" fill="none" xmlns="http://www.w3.org/2000/svg">' +
    '<rect x="36" y="74" width="46" height="36" rx="5" stroke="currentColor" stroke-width="1.6"/>' +
    '<path d="M50 74 V66 C50 62 68 62 68 66 V74" stroke="currentColor" stroke-width="1.4" opacity="0.8"/>' +
    '<path d="M36 90 L82 90" stroke="currentColor" stroke-width="1.2" opacity="0.4"/>' +
    '<circle cx="90" cy="50" r="9" stroke="currentColor" stroke-width="1.4" opacity="0.75"/>' +
    '<path d="M90 45 V50 L94 52" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" opacity="0.75"/>' +
    '<path d="M26 124 L96 124" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" opacity="0.4"/>' +
    '</svg>',
  // Стена: кладка, трещина, свет
  A008:
    '<svg viewBox="0 0 120 160" fill="none" xmlns="http://www.w3.org/2000/svg">' +
    '<rect x="32" y="50" width="56" height="70" stroke="currentColor" stroke-width="1.6"/>' +
    '<path d="M32 74 H88 M32 96 H88" stroke="currentColor" stroke-width="1.1" opacity="0.35"/>' +
    '<path d="M46 50 V74 M74 50 V74 M60 74 V96 M46 96 V120 M74 96 V120" stroke="currentColor" stroke-width="1.1" opacity="0.35"/>' +
    '<path d="M64 50 L58 66 L66 84 L60 102 L66 120" stroke="currentColor" stroke-width="1.4" opacity="0.85"/>' +
    '<path d="M68 60 L76 54 M70 76 L80 72" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" opacity="0.5"/>' +
    '<circle cx="42" cy="130" r="2.6" stroke="currentColor" stroke-width="1.3" opacity="0.7"/>' +
    '</svg>',
  // Два стула: два стула напротив, расстояние
  A009:
    '<svg viewBox="0 0 120 160" fill="none" xmlns="http://www.w3.org/2000/svg">' +
    '<path d="M32 110 V78 M32 92 H50 V110 M36 110 V116 M48 110 V116" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>' +
    '<path d="M88 110 V78 M88 92 H70 V110 M84 110 V116 M72 110 V116" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" opacity="0.7"/>' +
    '<path d="M56 102 L64 102" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-dasharray="2 4" opacity="0.5"/>' +
    '</svg>',
  // Зеркало: зеркало, отражение, человек, пространство
  A010:
    '<svg viewBox="0 0 120 160" fill="none" xmlns="http://www.w3.org/2000/svg">' +
    '<ellipse cx="66" cy="72" rx="22" ry="32" stroke="currentColor" stroke-width="1.6"/>' +
    '<ellipse cx="66" cy="72" rx="15" ry="25" stroke="currentColor" stroke-width="1.1" opacity="0.35"/>' +
    '<path d="M54 118 H78 M66 104 V118" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" opacity="0.6"/>' +
    '<circle cx="34" cy="88" r="3.4" stroke="currentColor" stroke-width="1.4" opacity="0.85"/>' +
    '<path d="M34 92 L34 104" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" opacity="0.85"/>' +
    '<circle cx="70" cy="66" r="2.6" stroke="currentColor" stroke-width="1.2" opacity="0.5"/>' +
    '</svg>',
  generic:
    '<svg viewBox="0 0 120 160" fill="none" xmlns="http://www.w3.org/2000/svg">' +
    '<rect x="46" y="66" width="28" height="28" rx="3" transform="rotate(45 60 80)" stroke="currentColor" stroke-width="1.6"/>' +
    '<circle cx="60" cy="80" r="2.2" fill="currentColor" opacity="0.8"/>' +
    '</svg>'
};

// Screen states: choosing -> revealing -> observing -> associating -> result
const Assoc = {
  state: 'choosing',
  spread: [],
  chosenCard: null,
  lastChosenId: null,
  busy: false,
  timers: [],

  setTimer(fn, ms) {
    this.timers.push(setTimeout(fn, ms));
  },

  clearTimers() {
    this.timers.forEach(clearTimeout);
    this.timers = [];
  },

  // 4 unique cards; avoids repeating the just-chosen card when the deck allows
  sampleSpread() {
    let pool = ASSOCIATION_DECK;
    if (this.lastChosenId && pool.length - 1 >= 4) {
      pool = pool.filter(c => c.id !== this.lastChosenId);
    }
    const copy = pool.slice();
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy.slice(0, Math.min(4, copy.length));
  }
};

// Card front: real image when available, CSS/SVG placeholder otherwise.
// The placeholder stays visible until the image actually loads, so a broken
// image icon can never appear.
function renderAssocFront(container, card) {
  container.innerHTML = '<span class="assoc-placeholder" aria-hidden="true">' +
    (ASSOC_PLACEHOLDERS[card.id] || ASSOC_PLACEHOLDERS.generic) + '</span>';
  if (card.image) {
    const img = new Image();
    img.className = 'assoc-image';
    // Decorative: internalName is developer-only and never shown to the user
    img.alt = '';
    img.onload = () => {
      container.innerHTML = '';
      container.appendChild(img);
    };
    img.src = card.image;
  }
}

function startAssocRound() {
  Assoc.clearTimers();
  Assoc.state = 'choosing';
  Assoc.busy = false;
  Assoc.chosenCard = null;
  Assoc.spread = Assoc.sampleSpread();

  document.getElementById('assocSubtitle').style.display = 'block';
  document.getElementById('assocStage').style.display = 'none';
  document.getElementById('assocQuestion').style.display = 'none';
  document.getElementById('assocResult').style.display = 'none';
  document.getElementById('assocAgainBtn').style.display = 'none';
  document.getElementById('assocBigCard').classList.remove('assoc-card--flipped');

  const grid = document.getElementById('assocGrid');
  grid.style.display = 'grid';
  grid.innerHTML = '';
  Assoc.spread.forEach((card, i) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'assoc-card assoc-card--enter';
    btn.style.animationDelay = (i * 70) + 'ms';
    btn.setAttribute('aria-label', 'Закрытая карта ' + (i + 1));
    btn.innerHTML = '<span class="assoc-back" aria-hidden="true"></span>';
    btn.addEventListener('click', () => chooseAssocCard(card, btn));
    grid.appendChild(btn);
  });
}

function chooseAssocCard(card, btn) {
  if (Assoc.busy || Assoc.state !== 'choosing') return;
  Assoc.busy = true;
  Assoc.state = 'revealing';
  Assoc.chosenCard = card;
  Assoc.lastChosenId = card.id;
  haptic('light');

  // Prepare the big card, back side up, with this card's face
  renderAssocFront(document.getElementById('assocBigFront'), card);
  const bigCard = document.getElementById('assocBigCard');
  bigCard.classList.remove('assoc-card--flipped');

  const grid = document.getElementById('assocGrid');
  const subtitle = document.getElementById('assocSubtitle');
  const stage = document.getElementById('assocStage');

  if (DiceThought.prefersReducedMotion()) {
    // Short reveal without movement or a long flip
    grid.style.display = 'none';
    subtitle.style.display = 'none';
    stage.style.display = 'flex';
    bigCard.classList.add('assoc-card--flipped');
    haptic('select');
    Assoc.setTimer(showAssocQuestion, 350);
    return;
  }

  // The other three fade out; the chosen card drifts to the spread center
  const gridRect = grid.getBoundingClientRect();
  const rect = btn.getBoundingClientRect();
  const dx = (gridRect.left + gridRect.width / 2) - (rect.left + rect.width / 2);
  const dy = (gridRect.top + gridRect.height / 2) - (rect.top + rect.height / 2);
  Array.from(grid.children).forEach(el => {
    if (el !== btn) el.classList.add('assoc-card--dismissed');
  });
  btn.classList.add('assoc-card--chosen');
  btn.style.transform = `translate(${dx}px, ${dy}px) scale(1.12)`;

  Assoc.setTimer(() => {
    // Swap to the centered stage card and flip it
    grid.style.display = 'none';
    subtitle.style.display = 'none';
    stage.style.display = 'flex';
    Assoc.setTimer(() => {
      Assoc.state = 'observing';
      bigCard.classList.add('assoc-card--flipped');
      haptic('select');
      // A quiet moment to just look at the image before the prompt appears
      // (600ms flip + ~700ms observing pause)
      Assoc.setTimer(showAssocQuestion, 600 + 700);
    }, 60);
  }, 440);
}

function showAssocQuestion() {
  const card = Assoc.chosenCard;
  if (!card) return;
  Assoc.state = 'associating';

  const options = document.getElementById('assocOptions');
  options.innerHTML = '';
  card.elements.forEach(element => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'assoc-option';
    b.textContent = element.label;
    b.addEventListener('click', () => chooseAssocElement(element));
    options.appendChild(b);
  });

  document.getElementById('assocQuestion').style.display = 'block';
  Assoc.busy = false;
}

function chooseAssocElement(element) {
  if (Assoc.state !== 'associating') return;
  Assoc.state = 'result';
  haptic('select');

  document.getElementById('assocQuestion').style.display = 'none';
  document.getElementById('assocChoice').textContent = element.label;
  document.getElementById('assocInsight').textContent = element.insight;
  document.getElementById('assocReflection').textContent = element.question;
  document.getElementById('assocResult').style.display = 'block';
  document.getElementById('assocAgainBtn').style.display = 'flex';

  // Keep the top of the card in view when the result stretches the page
  const stage = document.getElementById('assocStage');
  if (stage.getBoundingClientRect().top < 0) {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

function openAssocScreen() {
  document.getElementById('modesScreen').style.display = 'none';
  document.getElementById('assocScreen').style.display = 'flex';
  document.body.classList.add('hide-home-hero');
  startAssocRound();
  window.scrollTo(0, 0);
}

document.getElementById('assocBackBtn').addEventListener('click', () => {
  haptic('select');
  Assoc.clearTimers();
  Assoc.state = 'choosing';
  Assoc.busy = false;
  document.body.classList.remove('hide-home-hero');
  document.getElementById('assocScreen').style.display = 'none';
  document.getElementById('modesScreen').style.display = 'flex';
});

document.getElementById('assocAgainBtn').addEventListener('click', () => {
  haptic('light');
  startAssocRound();
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Initialize
loadData().then(() => {
  initDailyLayer();
});

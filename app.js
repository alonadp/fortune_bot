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
// DEMO DECK. Real author illustrations will be added later: set `image` to a
// path like 'assets/association-cards/card-001.webp' and the card front
// switches from its CSS/SVG placeholder to the image automatically. While
// `image` is null/undefined or fails to load, the placeholder is shown, so a
// broken image can never appear.
const ASSOCIATION_DECK = [
  {
    id: 'door_01',
    image: null,
    title: 'Дверь и свет',
    elements: [
      {
        id: 'door',
        label: 'Дверь',
        insight: 'Возможно, твоё внимание сейчас больше направлено на возможность выйти из ситуации, чем на то, что удерживает тебя внутри.',
        question: 'Какую дверь ты давно видишь, но пока не решаешься открыть?'
      },
      {
        id: 'light',
        label: 'Свет',
        insight: 'Иногда мы замечаем первым то, чего нам не хватает. Свет за дверью может быть про надежду, что дальше будет легче.',
        question: 'Что для тебя сейчас стало бы светом — пусть даже совсем небольшим?'
      },
      {
        id: 'darkness',
        label: 'Темнота',
        insight: 'Возможно, сейчас важнее не то, куда идти, а то, что осталось неосвещённым. Непонятное — не обязательно плохое.',
        question: 'О чём ты уже догадываешься, но пока не хочешь рассматривать ближе?'
      },
      {
        id: 'space',
        label: 'Пустое пространство',
        insight: 'Пустота вокруг может ощущаться как одиночество — а может быть свободным местом для чего-то нового. Попробуй посмотреть на неё вторым взглядом.',
        question: 'Чем бы ты заполнила это пространство, если бы могла выбрать что угодно?'
      }
    ]
  },
  {
    id: 'road_02',
    image: null,
    title: 'Развилка',
    elements: [
      {
        id: 'road',
        label: 'Дорога',
        insight: 'Возможно, тебе сейчас ближе само движение, чем конкретная цель. Дорога под ногами — это уже выбор.',
        question: 'Куда ты сейчас идёшь по привычке, а куда — по желанию?'
      },
      {
        id: 'fork',
        label: 'Развилка',
        insight: 'Иногда мы застреваем не потому, что нет пути, а потому что путей два. Возможно, сам выбор занимает больше места, чем кажется.',
        question: 'Какое решение ты откладываешь, потому что оба варианта чем-то дороги?'
      },
      {
        id: 'horizon',
        label: 'Горизонт',
        insight: 'Взгляд вдаль может быть про желание заранее увидеть, чем всё закончится. Но горизонт открывается только по мере движения.',
        question: 'Что изменилось бы, если разрешить себе не знать финал заранее?'
      }
    ]
  },
  {
    id: 'circle_03',
    image: null,
    title: 'Круг и фигура',
    elements: [
      {
        id: 'circle',
        label: 'Круг',
        insight: 'Круг часто замечают первым те, кому сейчас важны границы — свои или чужие. Возможно, хочется ясности, где заканчивается твоё.',
        question: 'Внутри какого круга тебе спокойно, а какой уже стал тесен?'
      },
      {
        id: 'figure',
        label: 'Маленькая фигура',
        insight: 'Возможно, ты сейчас ощущаешь себя меньше ситуации, в которой находишься. Это ощущение — не факт, а масштаб взгляда.',
        question: 'Если посмотреть на ситуацию издалека, что в ней на самом деле большое?'
      },
      {
        id: 'distance',
        label: 'Расстояние между ними',
        insight: 'Иногда первым замечается не предмет, а дистанция. Возможно, сейчас для тебя важна тема «ближе или дальше».',
        question: 'К чему тебе хочется приблизиться, а от чего — отойти на шаг?'
      }
    ]
  },
  {
    id: 'shapes_04',
    image: null,
    title: 'Две фигуры',
    elements: [
      {
        id: 'both',
        label: 'Обе фигуры',
        insight: 'Возможно, тебе сейчас близка тема диалога: двое разных, но стоящих рядом. Разность — не всегда конфликт.',
        question: 'С кем тебе стоит поговорить не ради победы, а ради ясности?'
      },
      {
        id: 'sharp',
        label: 'Угловатая фигура',
        insight: 'Острые формы часто замечают, когда внутри есть напряжение. Возможно, что-то ждёт от тебя прямого ответа.',
        question: 'Где тебе сейчас нужно сказать точнее и проще, чем обычно?'
      },
      {
        id: 'round',
        label: 'Округлая фигура',
        insight: 'Мягкая форма может быть про потребность в спокойствии и поддержке — без условий и споров.',
        question: 'Что помогает тебе смягчаться — и было ли это у тебя на этой неделе?'
      },
      {
        id: 'gap',
        label: 'Пространство между ними',
        insight: 'Возможно, важнее всего сейчас не стороны, а то, что между ними: пауза, тишина, недосказанное.',
        question: 'Какая пауза в твоей жизни затянулась — и чья очередь делать шаг?'
      }
    ]
  },
  {
    id: 'stairs_05',
    image: null,
    title: 'Лестница',
    elements: [
      {
        id: 'steps',
        label: 'Ступени',
        insight: 'Возможно, тебе сейчас ближе идея постепенности: не всё сразу, а по одной ступени. Это не медленно — это надёжно.',
        question: 'Какой маленький шаг доступен тебе уже сегодня?'
      },
      {
        id: 'top',
        label: 'Верх лестницы',
        insight: 'Взгляд наверх может быть про цель. А иногда — про ожидания, которые кто-то поставил за тебя.',
        question: 'Куда ведёт твоя лестница — и ты ли выбирала это направление?'
      },
      {
        id: 'bottom',
        label: 'Начало внизу',
        insight: 'Иногда мы оглядываемся на начало, чтобы понять, сколько уже пройдено. Возможно, этому пути не хватает твоего признания.',
        question: 'Что из уже сделанного ты так и не разрешила себе засчитать?'
      }
    ]
  },
  {
    id: 'window_06',
    image: null,
    title: 'Окно',
    elements: [
      {
        id: 'window',
        label: 'Окно',
        insight: 'Окно — возможность видеть, оставаясь внутри. Возможно, тебе сейчас ближе наблюдать, чем участвовать. Это тоже позиция.',
        question: 'За чем ты наблюдаешь со стороны, хотя внутри уже есть своё мнение?'
      },
      {
        id: 'outside',
        label: 'То, что снаружи',
        insight: 'Возможно, внимание тянется наружу — к тому, что за пределами привычного. Любопытство редко бывает случайным.',
        question: 'Что за пределами твоей привычной жизни давно тебя зовёт?'
      },
      {
        id: 'frame',
        label: 'Рама',
        insight: 'Рама задаёт границы вида. Иногда мы замечаем не картину, а рамки, через которые смотрим на неё.',
        question: 'Какая привычная рамка сужает твой взгляд на ситуацию?'
      }
    ]
  }
];

// Simple conceptual SVG placeholders (technical stand-ins for future art)
const ASSOC_PLACEHOLDERS = {
  door_01:
    '<svg viewBox="0 0 120 160" fill="none" xmlns="http://www.w3.org/2000/svg">' +
    '<rect x="38" y="40" width="44" height="82" rx="3" stroke="currentColor" stroke-width="1.6"/>' +
    '<path d="M44 122 L44 46 L68 52 L68 118 Z" stroke="currentColor" stroke-width="1.4" opacity="0.7"/>' +
    '<circle cx="63" cy="86" r="1.8" fill="currentColor" opacity="0.8"/>' +
    '<path d="M74 62 L86 54 M74 76 L90 72 M74 90 L86 92" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" opacity="0.55"/>' +
    '</svg>',
  road_02:
    '<svg viewBox="0 0 120 160" fill="none" xmlns="http://www.w3.org/2000/svg">' +
    '<path d="M60 138 C60 116 60 104 60 92" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>' +
    '<path d="M60 92 C52 72 44 56 36 38" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>' +
    '<path d="M60 92 C68 72 76 56 84 38" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>' +
    '<circle cx="36" cy="32" r="2.4" stroke="currentColor" stroke-width="1.3" opacity="0.7"/>' +
    '<circle cx="84" cy="32" r="2.4" stroke="currentColor" stroke-width="1.3" opacity="0.7"/>' +
    '</svg>',
  circle_03:
    '<svg viewBox="0 0 120 160" fill="none" xmlns="http://www.w3.org/2000/svg">' +
    '<circle cx="60" cy="66" r="34" stroke="currentColor" stroke-width="1.6"/>' +
    '<circle cx="60" cy="122" r="4" stroke="currentColor" stroke-width="1.4" opacity="0.85"/>' +
    '<path d="M60 128 L60 138" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" opacity="0.85"/>' +
    '</svg>',
  shapes_04:
    '<svg viewBox="0 0 120 160" fill="none" xmlns="http://www.w3.org/2000/svg">' +
    '<path d="M40 62 L56 94 L24 94 Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>' +
    '<circle cx="84" cy="80" r="16" stroke="currentColor" stroke-width="1.6"/>' +
    '</svg>',
  stairs_05:
    '<svg viewBox="0 0 120 160" fill="none" xmlns="http://www.w3.org/2000/svg">' +
    '<path d="M26 128 L46 128 L46 108 L66 108 L66 88 L86 88 L86 68 L98 68" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>' +
    '<circle cx="98" cy="52" r="2.4" stroke="currentColor" stroke-width="1.3" opacity="0.7"/>' +
    '</svg>',
  window_06:
    '<svg viewBox="0 0 120 160" fill="none" xmlns="http://www.w3.org/2000/svg">' +
    '<rect x="34" y="38" width="52" height="72" rx="3" stroke="currentColor" stroke-width="1.6"/>' +
    '<path d="M60 38 L60 110 M34 74 L86 74" stroke="currentColor" stroke-width="1.3" opacity="0.7"/>' +
    '<path d="M40 126 L80 126" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" opacity="0.45"/>' +
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
    img.alt = card.title || '';
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

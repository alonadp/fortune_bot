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
    
    document.getElementById('modesScreen').style.display = 'none';
    document.getElementById('fortuneScreen').style.display = 'flex';
    setScreenTheme(currentMode);
    // The dice screen starts compactly, without the big home hero
    document.body.classList.toggle('hide-home-hero', currentMode === 'dice');
    
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
    
    // Reset transformations
    const coinInner = document.querySelector('.coin-inner');
    if (coinInner) coinInner.style.transform = 'rotateY(0deg)';
    
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
    
    // Determine result FIRST
    const isYes = Math.random() < 0.5;
    
    // Calculate rotation: 3-5 full spins + exact final position
    const spins = (Math.floor(Math.random() * 3) + 3) * 360; // 1080, 1440, or 1800 degrees
    const finalRotation = spins + (isYes ? 0 : 180); // Stop exactly at 0° (YES) or 180° (NO)
    
    coinInner.style.transform = `rotateY(${finalRotation}deg)`;
    
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
    }, 1200);
    
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

// Initialize
loadData().then(() => {
  initDailyLayer();
});

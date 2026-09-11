// Mapping item types to emojis for visual feedback before CSS is ready
const ICONS = {
    "cup": "☕",
    "pastry": "🥐",
    "cookie": "🍪",
    "cake": "🍰"
};

// Used to measure available width for the board's responsive scale.
// Not in the `dom` map below since it's a layout element, not an
// interactive one.
const boardWrapper = document.querySelector('.board-wrapper');

// Shorthand lookup for every DOM element the game reads from or writes to
const dom = {
    board: document.getElementById('board'),
    instruction: document.getElementById('instruction'),
    levelCounter: document.getElementById('level-counter'),
    attempts: document.getElementById('attempts'),
    feedback: document.getElementById('feedback'),
    controls: document.getElementById('controls'),
    checkBtn: document.getElementById('check-btn'),
    hintBtn: document.getElementById('hint-btn'),
    resetBtn: document.getElementById('reset-btn'),
    nextBtn: document.getElementById('next-btn'),
    restartBtn: document.getElementById('restart-btn'),
    levelNav: document.getElementById('level-nav')
};

// Number of wrong attempts on the current level before the Hint button appears
const HINT_THRESHOLD = 3;

const STORAGE_KEYS = {
    level: 'coffeeGameLevel',
    complete: 'coffeeGameComplete',
    totalAttempts: 'coffeeGameTotalAttempts'
};

// Highest level unlocked so far — never regressed, only ever raised in showFeedback()
function getSavedLevel() {
    return Number.parseInt(localStorage.getItem(STORAGE_KEYS.level)) || 0;
}

// Game state variables
let currentLevelIndex = getSavedLevel();
let currentAttempts = 0;
let totalAttempts = Number.parseInt(localStorage.getItem(STORAGE_KEYS.totalAttempts)) || 0;

// Initialize the game
function initGame() {
    // Prevent out of bounds if localStorage has an old invalid level
    if (currentLevelIndex >= LEVELS.length) {
        currentLevelIndex = LEVELS.length - 1;
    }

    bindEvents();
    updateBoardScale();
    window.addEventListener('resize', updateBoardScale);

    // Finishing the game only bumps coffeeGameLevel to LEVELS.length, which
    // the clamp above folds back into a valid index. Without this flag, a
    // refresh after completion would just re-enter the last level instead
    // of showing the completion screen.
    if (localStorage.getItem(STORAGE_KEYS.complete) === 'true') {
        renderLevelNav();
        showGameComplete();
    } else {
        loadLevel(currentLevelIndex);
    }
}

// #board's own size never changes. On narrow screens it's scaled down
// visually instead, via the transform: scale() rule in style.css. This
// computes that scale factor from .board-wrapper's available width, read
// via getComputedStyle so it can't drift from style.css's :root value.
function updateBoardScale() {
    const boardWidth = Number.parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--board-width'));
    const scale = Math.min(boardWrapper.clientWidth / boardWidth, 1);
    document.documentElement.style.setProperty('--board-scale', scale);
}

// Bind static event listeners once
function bindEvents() {
    dom.checkBtn.addEventListener('click', handleCheckSolution);
    dom.hintBtn.addEventListener('click', handleShowHint);
    dom.resetBtn.addEventListener('click', () => loadLevel(currentLevelIndex));
    dom.nextBtn.addEventListener('click', handleNextLevel);
    dom.restartBtn.addEventListener('click', handleRestartGame);
}

// Load a specific level by its index in the array
function loadLevel(index) {
    const level = LEVELS[index];
    if (!level) return;

    // Being on any level means the game isn't in its finished state — clear
    // the flag showGameComplete() sets, so going back to a level from the
    // nav bar doesn't leave the completion screen stuck showing on refresh.
    localStorage.removeItem(STORAGE_KEYS.complete);

    // Reset state for the new level
    currentAttempts = 0;
    updateUI(level);
    renderBoard(level);
    renderControls(level);
    renderLevelNav();
}

// Update text counters and instructions
function updateUI(level) {
    dom.levelCounter.textContent = `Level ${level.id} of ${LEVELS.length}`;
    dom.instruction.textContent = level.instruction;

    // currentAttempts resets every level; totalAttempts carries over for
    // the whole game. Showing both here keeps that carry-over visible
    // during play, not just at the end.
    dom.attempts.textContent = `Attempts: ${currentAttempts} (Total: ${totalAttempts})`;

    // Undo showGameComplete()'s hiding of these — otherwise navigating to a
    // level from the nav bar after finishing the game leaves them hidden
    dom.checkBtn.classList.remove('hidden');
    dom.resetBtn.classList.remove('hidden');

    // Restart only belongs on the completion screen — undo showGameComplete()
    // revealing it as soon as the player is back on an actual level
    dom.restartBtn.classList.add('hidden');

    // Hint reappears per level only after HINT_THRESHOLD wrong attempts on
    // that level (see showFeedback()) — hide it whenever a level (re)loads
    dom.hintBtn.classList.add('hidden');

    dom.nextBtn.classList.add('hidden');
    dom.feedback.classList.remove('success', 'error', 'hint');
    dom.feedback.textContent = "";
}

// Clear board and render items
function renderBoard(level) {
    dom.board.innerHTML = "";
    dom.board.style.cssText = "";
    dom.board.classList.remove('shake');

    // Levels that don't test 'display' still need a flex layout to show
    // the other properties on. .board--flex supplies that via CSS instead
    // of an inline style, so it survives applyStylesToBoard()'s cssText
    // reset below and doesn't clash with level 1's own display dropdown.
    dom.board.classList.toggle('board--flex', !level.controls.includes('display'));

    level.items.forEach(itemType => {
        const itemDiv = document.createElement('div');
        itemDiv.className = `item item--${itemType}`;
        itemDiv.textContent = ICONS[itemType] || "";
        // Purely decorative — hide it from screen readers instead of
        // having its unicode name read aloud.
        itemDiv.setAttribute('aria-hidden', 'true');
        dom.board.appendChild(itemDiv);
    });
}

// Build the select dropdowns dynamically based on level.controls
function renderControls(level) {
    dom.controls.innerHTML = "";

    level.controls.forEach(controlType => {
        const wrapper = document.createElement('div');
        wrapper.className = 'control-group';

        const label = document.createElement('label');
        label.textContent = controlType;

        const selectElement = document.createElement('select');
        selectElement.dataset.property = controlType;
        selectElement.id = `control-${controlType}`;
        label.htmlFor = selectElement.id;

        // Default empty option
        const defaultOption = document.createElement('option');
        defaultOption.value = "";
        defaultOption.textContent = `Choose...`;
        defaultOption.disabled = true;
        defaultOption.selected = true;
        selectElement.appendChild(defaultOption);

        // Generate options from the OPTIONS constant
        if (OPTIONS[controlType]) {
            OPTIONS[controlType].forEach(value => {
                const optionElement = document.createElement('option');
                optionElement.value = value;
                optionElement.textContent = value;
                selectElement.appendChild(optionElement);
            });
        }

        // Apply style to the board immediately upon change, and clear any
        // stale feedback/next-button/correctness state from a previous check
        selectElement.addEventListener('change', () => {
            applyStylesToBoard();
            dom.feedback.classList.remove('success', 'error', 'hint');
            dom.feedback.textContent = "";
            dom.nextBtn.classList.add('hidden');
            selectElement.classList.remove('select--correct', 'select--incorrect');
            selectElement.removeAttribute('aria-invalid');
        });

        wrapper.appendChild(label);
        wrapper.appendChild(selectElement);
        dom.controls.appendChild(wrapper);
    });
}

// Apply selected flexbox styles from all dropdowns to the board container
function applyStylesToBoard() {
    const allSelects = dom.controls.querySelectorAll('select');

    // Clear existing inline styles first — .board--flex (set by renderBoard())
    // isn't affected by this, since it's a class, not an inline style
    dom.board.style.cssText = "";

    allSelects.forEach(select => {
        if (select.value) {
            dom.board.style.setProperty(select.dataset.property, select.value);
        }
    });
}


// Check if the current user selection matches the level solution
function handleCheckSolution() {
    const level = LEVELS[currentLevelIndex];
    let isCorrect = true;

    // Compare each control against the solution and mark it correct or
    // incorrect individually, so the player sees exactly which property
    // is still wrong.
    const allSelects = dom.controls.querySelectorAll('select');
    allSelects.forEach(select => {
        const prop = select.dataset.property;
        const propCorrect = select.value === level.solution[prop];
        select.classList.toggle('select--correct', propCorrect);
        select.classList.toggle('select--incorrect', !propCorrect);
        select.setAttribute('aria-invalid', String(!propCorrect));
        if (!propCorrect) {
            isCorrect = false;
        }
    });

    showFeedback(isCorrect);
}

// Display success or error feedback and handle animations
function showFeedback(isCorrect) {
    dom.feedback.classList.remove('success', 'error', 'hint');

    if (isCorrect) {
        dom.feedback.textContent = "Excellent! The order is ready.";
        dom.feedback.classList.add('success');
        dom.nextBtn.classList.remove('hidden');
        dom.hintBtn.classList.add('hidden');

        // Save progress, but never regress it — replaying an earlier level
        // must not re-lock levels already unlocked past this one
        localStorage.setItem(STORAGE_KEYS.level, Math.max(getSavedLevel(), currentLevelIndex + 1));
        renderLevelNav();
    } else {
        currentAttempts++;

        // Tracked for the whole game, not just this level, and persisted
        // so it survives a refresh — same as the level-unlock progress.
        totalAttempts++;
        localStorage.setItem(STORAGE_KEYS.totalAttempts, totalAttempts);

        dom.attempts.textContent = `Attempts: ${currentAttempts} (Total: ${totalAttempts})`;
        dom.feedback.textContent = "Not quite... Try again!";
        dom.feedback.classList.add('error');

        // The per-dropdown markers already show what's wrong; Hint is just
        // an extra nudge for anyone still stuck after a few tries.
        if (currentAttempts >= HINT_THRESHOLD) {
            dom.hintBtn.classList.remove('hidden');
        }

        // Trigger the shake animation, removing the class on its own
        // animationend instead of a setTimeout duration that would have
        // to match style.css's keyframes by hand. Remove it first and
        // force a reflow so consecutive wrong attempts within one
        // animation's duration still restart it instead of no-op'ing.
        dom.board.classList.remove('shake');
        void dom.board.offsetWidth;
        dom.board.classList.add('shake');
        dom.board.addEventListener('animationend', () => {
            dom.board.classList.remove('shake');
        }, { once: true });
    }
}

// Names the property (or properties) still wrong, for anyone stuck after
// a few failed attempts. Doesn't reveal the correct value — just where
// to look.
function handleShowHint() {
    const level = LEVELS[currentLevelIndex];
    const allSelects = dom.controls.querySelectorAll('select');
    const wrongProps = [];

    allSelects.forEach(select => {
        const prop = select.dataset.property;
        if (select.value !== level.solution[prop]) {
            wrongProps.push(prop);
        }
    });

    dom.feedback.classList.remove('success', 'error');
    dom.feedback.classList.add('hint');
    dom.feedback.textContent = wrongProps.length > 0
        ? `Hint: take another look at ${wrongProps.join(', ')}.`
        : "Hint: everything here looks right — press Check!";
}

// Advance to the next level or show game completion
function handleNextLevel() {
    if (currentLevelIndex < LEVELS.length - 1) {
        currentLevelIndex++;
        loadLevel(currentLevelIndex);
    } else {
        showGameComplete();
    }
}

// Wipe saved progress and start over from level 1
function handleRestartGame() {
    // All three keys must be cleared before loadLevel() runs — it calls
    // renderLevelNav(), which reads the saved level to decide which levels
    // are unlocked. Clearing them after would still render this pass with
    // everything unlocked.
    localStorage.removeItem(STORAGE_KEYS.level);
    localStorage.removeItem(STORAGE_KEYS.complete);
    localStorage.removeItem(STORAGE_KEYS.totalAttempts);
    currentLevelIndex = 0;
    totalAttempts = 0;
    loadLevel(currentLevelIndex);
}

// Render the level switcher — one button per level, showing locked/completed/current state
function renderLevelNav() {
    dom.levelNav.innerHTML = "";
    const savedLevel = getSavedLevel();

    LEVELS.forEach((level, index) => {
        const btn = document.createElement('button');
        btn.textContent = level.id;

        const isCompleted = index < savedLevel;
        const isCurrent = index === currentLevelIndex;
        const isLocked = index > savedLevel;

        // Sighted users also get completed/current styling that a screen
        // reader can't infer from the number alone — spell it out here.
        // "current" takes priority over "completed" (a level can be both,
        // e.g. right after passing it) to match the .active ring in CSS,
        // which visually wins over .completed for the same reason.
        let label = `Level ${level.id}`;
        if (isLocked) {
            label += ' (locked)';
        } else if (isCurrent) {
            label += isCompleted ? ' (current, completed)' : ' (current)';
        } else if (isCompleted) {
            label += ' (completed)';
        }
        btn.setAttribute('aria-label', label);

        if (isCompleted) {
            btn.classList.add('completed');
        }

        if (isCurrent) {
            btn.classList.add('active');
            btn.setAttribute('aria-current', 'step');
        }

        // Only allow clicking on unlocked or current levels
        if (!isLocked) {
            btn.addEventListener('click', () => {
                currentLevelIndex = index;
                loadLevel(currentLevelIndex);
            });
        } else {
            btn.disabled = true;
        }

        dom.levelNav.appendChild(btn);
    });
}

// Handle end of game state
function showGameComplete() {
    localStorage.setItem(STORAGE_KEYS.complete, 'true');
    dom.instruction.textContent = "Well done! You completed all the orders.";
    dom.board.innerHTML = "";
    dom.controls.innerHTML = "";
    dom.nextBtn.classList.add('hidden');
    dom.checkBtn.classList.add('hidden');
    dom.hintBtn.classList.add('hidden');
    dom.resetBtn.classList.add('hidden');
    dom.feedback.classList.remove('success', 'error', 'hint');
    dom.feedback.textContent = "";
    dom.restartBtn.classList.remove('hidden');
    dom.levelCounter.textContent = "Finished!";
    dom.attempts.textContent = `Total attempts: ${totalAttempts}`;
}

// Bootstrap the game
initGame();
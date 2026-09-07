// Mapping item types to emojis for visual feedback before CSS is ready
const ICONS = {
    "cup": "☕",
    "pastry": "🥐",
    "cookie": "🍪",
    "cake": "🍰"
};

// DOM Elements object mapping based on the spec contract
const dom = {
    board: document.getElementById('board'),
    instruction: document.getElementById('instruction'),
    levelCounter: document.getElementById('level-counter'),
    attempts: document.getElementById('attempts'),
    feedback: document.getElementById('feedback'),
    controls: document.getElementById('controls'),
    checkBtn: document.getElementById('check-btn'),
    resetBtn: document.getElementById('reset-btn'),
    nextBtn: document.getElementById('next-btn'),
    levelNav: document.getElementById('level-nav')
};

// Game state variables
let currentLevelIndex = parseInt(localStorage.getItem('coffeeGameLevel')) || 0;
let currentAttempts = 0;

// Initialize the game
function initGame() {
    // Prevent out of bounds if localStorage has an old invalid level
    if (currentLevelIndex >= LEVELS.length) {
        currentLevelIndex = 0;
    }
    
    bindEvents();
    loadLevel(currentLevelIndex);
}

// Bind static event listeners once
function bindEvents() {
    dom.checkBtn.addEventListener('click', handleCheckSolution);
    dom.resetBtn.addEventListener('click', () => loadLevel(currentLevelIndex));
    dom.nextBtn.addEventListener('click', handleNextLevel);
}

// Load a specific level by its index in the array
function loadLevel(index) {
    const level = LEVELS[index];
    if (!level) return;

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
    dom.attempts.textContent = currentAttempts;

    // Hide feedback and next button initially
    dom.nextBtn.classList.add('hidden');
    dom.feedback.classList.add('hidden');
    dom.feedback.classList.remove('success', 'error');
    dom.feedback.textContent = "";
}

// Clear board and render items
function renderBoard(level) {
    dom.board.innerHTML = "";
    dom.board.style.cssText = ""; 
    dom.board.classList.remove('shake');

    // FIX: Automatically apply display: flex if the level doesn't explicitly test it
    if (!level.controls.includes('display')) {
        dom.board.style.display = 'flex';
    }

    level.items.forEach(itemType => {
        const itemDiv = document.createElement('div');
        itemDiv.className = `item item--${itemType}`;
        itemDiv.textContent = ICONS[itemType] || "";
        dom.board.appendChild(itemDiv);
    });
}


// Build the select dropdowns dynamically based on level.controls
// Build the select dropdowns dynamically based on level.controls
function renderControls(level) {
    dom.controls.innerHTML = "";

    level.controls.forEach(controlType => {
        // Create a wrapper for the label and select element
        const wrapper = document.createElement('div');
        wrapper.style.display = 'flex';
        wrapper.style.flexDirection = 'column';
        wrapper.style.marginBottom = '10px';

        // Create the label dynamically based on the control type
        const label = document.createElement('label');
        label.textContent = controlType;
        label.style.fontWeight = 'bold';
        label.style.marginBottom = '4px';

        const selectElement = document.createElement('select');
        selectElement.dataset.property = controlType;

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

        // Apply style to the board immediately upon change
        selectElement.addEventListener('change', applyStylesToBoard);
        
        // Append label and select to the wrapper, then to the DOM
        wrapper.appendChild(label);
        wrapper.appendChild(selectElement);
        dom.controls.appendChild(wrapper);
    });
}


// Apply selected flexbox styles from all dropdowns to the board container
function applyStylesToBoard() {
    const allSelects = dom.controls.querySelectorAll('select');
    const currentLevel = LEVELS[currentLevelIndex];
    
    // Clear existing inline styles first
    dom.board.style.cssText = "";
    
    // FIX: Re-apply the default flex if this level doesn't control 'display'
    if (!currentLevel.controls.includes('display')) {
        dom.board.style.display = 'flex';
    }
    
    allSelects.forEach(select => {
        if (select.value) {
            dom.board.style[select.dataset.property] = select.value;
        }
    });
}


// Check if the current user selection matches the level solution
function handleCheckSolution() {
    const level = LEVELS[currentLevelIndex];
    let isCorrect = true;

    // Loop over the required controls and compare with the solution object
    const allSelects = dom.controls.querySelectorAll('select');
    allSelects.forEach(select => {
        const prop = select.dataset.property;
        if (select.value !== level.solution[prop]) {
            isCorrect = false;
        }
    });

    showFeedback(isCorrect);
}

// Display success or error feedback and handle animations
function showFeedback(isCorrect) {
    dom.feedback.classList.remove('hidden', 'success', 'error');

    if (isCorrect) {
        dom.feedback.textContent = "Excellent! The order is ready.";
        dom.feedback.classList.add('success');
        dom.nextBtn.classList.remove('hidden');
        
        // Save progress to local storage
        localStorage.setItem('coffeeGameLevel', currentLevelIndex + 1);
        renderLevelNav();
    } else {
        currentAttempts++;
        dom.attempts.textContent = currentAttempts;
        dom.feedback.textContent = "Not quite... Try again!";
        dom.feedback.classList.add('error');
        
        // Trigger shake animation
        dom.board.classList.add('shake');
        setTimeout(() => {
            dom.board.classList.remove('shake');
        }, 500);
    }
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

// Render navigation links for completed levels
function renderLevelNav() {
    dom.levelNav.innerHTML = "";
    const savedLevel = parseInt(localStorage.getItem('coffeeGameLevel')) || 0;

    LEVELS.forEach((level, index) => {
        const btn = document.createElement('button');
        btn.textContent = level.id;
        
        if (index < savedLevel) {
            btn.classList.add('completed');
        }

        // Only allow clicking on unlocked or current levels
        if (index <= savedLevel) {
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
    dom.instruction.textContent = "Well done! You completed all the orders.";
    dom.board.innerHTML = "";
    dom.controls.innerHTML = "";
    dom.nextBtn.classList.add('hidden');
    dom.checkBtn.classList.add('hidden');
    dom.resetBtn.classList.add('hidden');
    dom.feedback.classList.add('hidden');
    dom.levelCounter.textContent = "Finished!";
}

// Bootstrap the game
initGame();
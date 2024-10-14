const icons = [
    'fa-apple-alt', 'fa-apple-alt', 'fa-carrot', 'fa-carrot',
    'fa-cheese', 'fa-cheese', 'fa-lemon', 'fa-lemon',
    'fa-pizza-slice', 'fa-pizza-slice', 'fa-hamburger', 'fa-hamburger',
    'fa-ice-cream', 'fa-ice-cream', 'fa-bacon', 'fa-bacon'
];

const memoryGame = document.querySelector('.memory-game');
const gameStatus = document.getElementById('game-status');
const remainingGuessesDisplay = document.getElementById('remaining-guesses');
const restartButton = document.getElementById('restart-button');
const moveCounterDisplay = document.getElementById('move-counter');
const elapsedTimeDisplay = document.getElementById('elapsed-time');

let firstCard = null;
let secondCard = null;
let lockBoard = false;
let incorrectGuesses = 0;
let matchedCards = 0;
const maxIncorrectGuesses = 7;
const totalPairs = icons.length / 2;

// Initialize remaining guesses
let remainingGuesses = maxIncorrectGuesses;

// Initialize move counter and timer
let moveCount = 0;
let timerInterval = null;
let elapsedSeconds = 0;

// Shuffle the icons using Fisher-Yates algorithm
function shuffleIcons() {
    const shuffled = [...icons];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

// Create the game grid with cards
function createCards() {
    // Reset the game status and remaining guesses
    gameStatus.innerText = '';
    remainingGuesses = maxIncorrectGuesses;
    updateRemainingGuesses();
    
    // Reset move counter and timer
    moveCount = 0;
    updateMoveCounter();
    resetTimer();
    startTimer();
    
    // Reset matched cards count
    matchedCards = 0;
    
    // Clear any existing cards
    memoryGame.innerHTML = '';

    // Shuffle the icons and create card elements
    const shuffledIcons = shuffleIcons();
    shuffledIcons.forEach(icon => {
        const card = document.createElement('button');
        card.classList.add('memory-card');
        card.dataset.icon = icon;
        card.innerHTML = `<i class="fas"></i>`; // Placeholder for the icon
        card.addEventListener('click', flipCard);
        memoryGame.appendChild(card);
    });
}

// Flip a card
function flipCard() {
    if (lockBoard) return;
    if (this === firstCard) return;
    if (this.classList.contains('matched')) return; // Prevent flipping already matched cards

    this.classList.add('flipped');
    this.innerHTML = `<i class="fas ${this.dataset.icon}"></i>`;

    if (!firstCard) {
        // First card flipped
        firstCard = this;
        return;
    }

    // Second card flipped
    secondCard = this;
    moveCount++;
    updateMoveCounter();
    checkForMatch();
}

// Check if the two flipped cards match
function checkForMatch() {
    let isMatch = firstCard.dataset.icon === secondCard.dataset.icon;

    isMatch ? disableCards() : unflipCards();
}

// Disable the matched cards
function disableCards() {
    firstCard.classList.add('matched');
    secondCard.classList.add('matched');
    matchedCards++;

    // Check if the user has won the game
    if (matchedCards === totalPairs) {
        winGame();
    }

    resetBoard();
}

// Unflip the cards if they don't match
function unflipCards() {
    lockBoard = true;
    incorrectGuesses++;
    remainingGuesses--;
    updateRemainingGuesses();

    if (incorrectGuesses >= maxIncorrectGuesses) {
        endGame(); // End the game if maximum incorrect guesses are made
        return;
    }

    setTimeout(() => {
        firstCard.classList.remove('flipped');
        secondCard.classList.remove('flipped');
        firstCard.innerHTML = `<i class="fas"></i>`;
        secondCard.innerHTML = `<i class="fas"></i>`;
        resetBoard();
    }, 1000);
}

// Reset the board state
function resetBoard() {
    [firstCard, secondCard] = [null, null];
    lockBoard = false;
}

// Update the remaining guesses display
function updateRemainingGuesses() {
    remainingGuessesDisplay.innerHTML = `<p>Guesses: <span class="alert">${remainingGuesses}</span></p>`;
}

// Update the move counter display
function updateMoveCounter() {
    moveCounterDisplay.innerHTML = `<p>Moves: <span>${moveCount}</span></p>`;
}

// Start the timer
function startTimer() {
    timerInterval = setInterval(() => {
        elapsedSeconds++;
        updateTimerDisplay();
    }, 1000);
}

// Update the elapsed time display
function updateTimerDisplay() {
    const minutes = Math.floor(elapsedSeconds / 60);
    const seconds = elapsedSeconds % 60;
    const formattedMinutes = minutes.toString().padStart(2, '0');
    const formattedSeconds = seconds.toString().padStart(2, '0');
    elapsedTimeDisplay.innerHTML = `<p>Time: <span>${formattedMinutes}:${formattedSeconds}</span></p>`;
}

// Reset the timer
function resetTimer() {
    clearInterval(timerInterval);
    elapsedSeconds = 0;
    updateTimerDisplay();
}

// End the game after maximum incorrect guesses
function endGame() {
    gameStatus.innerHTML = '<div class="game-over-message"><h2>Game over</h2><p>You reached the maximum number of guesses.</p></div>';
    disableAllCards();
    stopTimer();
}

// Display the win message
function winGame() {
    gameStatus.innerHTML = "<div class='you-won-message'><h2>You did it!</h2> <p>Here's how you got on:</p></div>";
    disableAllCards();
    stopTimer();
}

// Disable all cards to prevent further interaction
function disableAllCards() {
    const allCards = document.querySelectorAll('.memory-card');
    allCards.forEach(card => {
        card.removeEventListener('click', flipCard);
    });
}

// Stop the timer
function stopTimer() {
    clearInterval(timerInterval);
}

// Restart the game
function restartGame() {
    // Reset all variables
    firstCard = null;
    secondCard = null;
    lockBoard = false;
    incorrectGuesses = 0;
    remainingGuesses = maxIncorrectGuesses;
    moveCount = 0;
    elapsedSeconds = 0;
    
    updateRemainingGuesses();
    updateMoveCounter();
    resetTimer();

    // Remove all existing cards and recreate them
    memoryGame.innerHTML = '';
    createCards();
}

// Event listener for the restart button
restartButton.addEventListener('click', restartGame);

// Start the game for the first time
createCards();

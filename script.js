let suits = ['♠', '♣', '♦', '♥'];
let values = Array.from({ length: 13 }, (_, i) => i + 1); // 1 (Ace) to 13 (King)
let deck = [];
let tableau = [];
let foundations = Array(8).fill().map(() => []); // 8 foundation piles
let moveTracker = 0; // To track moves
let undoStack = [];
let redoStack = [];
let timerInterval = null;
let gameTime = 0;
let isDragging = false;
let draggedCardData;

// Event listeners
document.getElementById('new-game').addEventListener('click', newGame);
document.getElementById('undo').addEventListener('click', undo);
document.getElementById('redo').addEventListener('click', redo);
document.getElementById('rules-button').addEventListener('click', toggleRules);
document.getElementById('close-rules').addEventListener('click', toggleRules);

// Initialize the Game
function newGame() {
    deck = createDeck();
    shuffle(deck);
    
    tableau = Array.from({ length: 15 }, () => []);
    
    // Deal cards into Tableau
    for (let col = 0; col < tableau.length; col++) {
        let cardsToDeal = 14 - (Math.floor(col / 5) * 2); // Increment by 5, fewer cards
        for (let i = 0; i < cardsToDeal; i++) {
            tableau[col].push(deck.pop());
        }
    }
    
    renderTableau();
    startTimer();
    moveTracker = 0; // Reset moves
}

// Create and shuffle the deck
function createDeck() {
    return Array(2).fill().flatMap(() => {
        return suits.flatMap(suit => values.map(value => ({ suit, value })));
    });
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// Render the tableau and foundations
function renderTableau() {
    const tableauDiv = document.getElementById('tableau');
    tableauDiv.innerHTML = ''; // clear current tableau
    
    tableau.forEach((column, colIndex) => {
        column.forEach((card, index) => {
            const cardDiv = document.createElement('div');
            cardDiv.className = 'card';
            cardDiv.dataset.value = card.value;
            cardDiv.dataset.suit = card.suit;
            cardDiv.draggable = true; // Make the cards draggable
            
            // Display face-up or face-down
            if (index !== column.length - 1) {
                cardDiv.style.background = 'lightcoral'; // back of a card
                cardDiv.style.opacity = '0.5'; // semi-transparent for face down
            } else {
                cardDiv.style.background = 'white'; // face-up
            }
            
            // Add drag and drop event listeners
            cardDiv.addEventListener('dragstart', (e) => {
                isDragging = true;
                draggedCardData = JSON.stringify({ colIndex, cardIndex: index });
                e.dataTransfer.effectAllowed = 'move';
            });

            cardDiv.addEventListener('dragend', () => { isDragging = false; });
            tableauDiv.appendChild(cardDiv);
        });
    });
    renderFoundations();
}

// Render foundations area
function renderFoundations() {
    const foundationsDiv = document.getElementById('foundations');
    foundationsDiv.innerHTML = ''; // clear current foundations
    
    foundations.forEach((foundation) => {
        const foundationDiv = document.createElement('div');
        foundationDiv.className = 'foundation';
        if (foundation.length > 0) {
            const topCard = foundation[foundation.length - 1];
            foundationDiv.textContent = `${topCard.suit} ${topCard.value}`;
        }
        foundationsDiv.appendChild(foundationDiv);
    });
}

// Drag and drop functionality to handle card movement
const tableauDiv = document.getElementById('tableau');
tableauDiv.addEventListener('dragover', (event) => {
    event.preventDefault();
    const potentialDropIndex = getColumnIndexFromEvent(event);
    if (potentialDropIndex !== null) {
        highlightColumn(potentialDropIndex, true);
    }
});

tableauDiv.addEventListener('dragleave', () => {
    renderTableau(); // Clear highlights
});

tableauDiv.addEventListener('drop', (event) => {
    const targetColIndex = getColumnIndexFromEvent(event);
    if (targetColIndex !== null && isDragging && draggedCardData) {
        onDrop(JSON.parse(draggedCardData), targetColIndex);
        renderTableau(); // Clear highlights
    }
});

function getColumnIndexFromEvent(event) {
    const target = event.target;
    return Array.from(target.parentNode.children).indexOf(target);
}

function highlightColumn(columnIndex, isHighlight) {
    const cards = tableauDiv.children;
    const start = columnIndex * (Math.floor(cards.length / 15));  // Approximation based on column
    const end = start + (Math.floor(cards.length / 15));
    for (let i = start; i < end; i++) {
        cards[i].style.border = isHighlight ? "2px solid yellow" : "none";
    }
}

function onDrop({ colIndex, cardIndex }, targetColIndex) {
    const cardToMove = tableau[colIndex][cardIndex];

    if (canMove(cardToMove, targetColIndex)) {
        tableau[targetColIndex].push(cardToMove);
        tableau[colIndex].splice(cardIndex, 1);
        moveTracker++;
        
        // Check if any suits can be completed to the foundations
        checkFoundations(cardToMove);
        
        renderTableau();
        checkVictory();
    }
}

// Rule for moving cards
function canMove(cardToMove, targetColIndex) {
    const targetCol = tableau[targetColIndex];

    // If the target column is empty or the top card is one rank higher and same suit
    if (targetCol.length === 0 || 
        (targetCol[targetCol.length - 1].value === cardToMove.value + 1 && 
         targetCol[targetCol.length - 1].suit === cardToMove.suit)) {
        return true;
    }
    return false;
}

// Check completed suits and move to foundations
function checkFoundations(card) {
    const foundationIndex = suits.indexOf(card.suit);
    if (foundations[foundationIndex].length === 0 && card.value === 1) {
        foundations[foundationIndex].push(card); // If it's an Ace
    } else if (foundations[foundationIndex].length > 0 && foundations[foundationIndex][foundations[foundationIndex].length - 1].value === card.value - 1) {
        foundations[foundationIndex].push(card); // If the next card in sequence
    }
}

// Toggle rules modal
function toggleRules() {
    const rulesModal = document.getElementById('rules-modal');
    rulesModal.classList.toggle('hidden');
}

function startTimer() {
    if (timerInterval) return; // prevent multiple intervals
    timerInterval = setInterval(() => {
        gameTime++;
        document.getElementById('timer').textContent = formatTime(gameTime);
    }, 1000);
}

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

function undo() {
    if (undoStack.length) {
        redoStack.push({ tableau: tableau, foundations: foundations }); // save current state for redo
        const lastState = undoStack.pop();
        tableau = lastState.tableau;
        foundations = lastState.foundations;
        renderTableau();
    }
}

function redo() {
    if (redoStack.length) {
        undoStack.push({ tableau: tableau, foundations: foundations }); // save current state for undo
        const lastState = redoStack.pop();
        tableau = lastState.tableau;
        foundations = lastState.foundations;
        renderTableau();
    }
}

// Check for victory condition
function checkVictory() {
    if (foundations.every(foundation => foundation.length === 13)) {
        clearInterval(timerInterval);
        alert("Congratulations! You've cleared all cards!");
    }
}

// Start the game on page load
newGame();

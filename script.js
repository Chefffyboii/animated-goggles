// Game state
const columns = [];
let moves = 0;
const moveCounter = document.getElementById('move-counter');

// Increment moves
function incrementMoves() {
    moves++;
    moveCounter.textContent = `Moves: ${moves}`;
}

/**
 * Initializes the game
 * @param {number} numColumns 
 * @param {number} numCardsPerColumn 
 */
function initializeGame(numColumns, numCardsPerColumn) {
    columns.length = 0;
    for (let i = 0; i < numColumns; i++) {
        const column = [];
        for (let j = 0; j < numCardsPerColumn; j++) {
            column.push({
                value: numCardsPerColumn - j,  // Descending cards
                suit: i % 2 === 0 ? 'hearts' : 'spades',
                revealed: j === 0 // Only top card revealed
            });
        }
        columns.push(column);
    }
    renderColumns();
}

// Create a card element
function createCardElement({ value, suit, revealed }) {
    const cardElement = document.createElement('div');
    cardElement.classList.add('card');
    cardElement.textContent = revealed ? `${value}` : '';
    cardElement.style.backgroundColor = revealed 
        ? (suit === 'hearts' ? 'red' : 'black') 
        : 'gray';
    cardElement.setAttribute('draggable', revealed);
    cardElement.setAttribute('role', 'button');
    cardElement.setAttribute('tabindex', revealed ? '0' : '-1');
    return cardElement;
}

// Make a card draggable
function makeCardDraggable(cardElement, card, columnIndex) {
    if (!card.revealed) return;
    cardElement.addEventListener('dragstart', (event) => {
        event.dataTransfer.setData('text/plain', JSON.stringify({ columnIndex }));
    });
}

// Handle drop
function handleDrop(event, targetColumnIndex) {
    event.preventDefault();
    const { columnIndex: fromColumnIndex } = JSON.parse(event.dataTransfer.getData('text/plain'));

    const fromColumn = columns[fromColumnIndex];
    const toColumn = columns[targetColumnIndex];

    if (!fromColumn.length) return;

    const movingCard = fromColumn[fromColumn.length - 1];
    const targetCard = toColumn[toColumn.length - 1];

    // Rules: Can move to empty column or onto card one higher
    const validMove = !targetCard || movingCard.value === targetCard.value - 1;

    if (validMove) {
        fromColumn.pop();
        toColumn.push(movingCard);

        // Reveal next hidden card in source column
        const lastCard = fromColumn[fromColumn.length - 1];
        if (lastCard && !lastCard.revealed) {
            lastCard.revealed = true;
        }

        incrementMoves();
        renderColumns();
    }
}

// Move rendering
function renderColumns() {
    const columnsContainer = document.getElementById('columns');
    columnsContainer.innerHTML = '';

    columns.forEach((column, columnIndex) => {
        const columnContainer = document.createElement('div');
        columnContainer.classList.add('column');
        makeColumnDroppable(columnContainer, columnIndex);

        column.forEach((card) => {
            const cardElement = createCardElement(card);
            makeCardDraggable(cardElement, card, columnIndex);
            columnContainer.appendChild(cardElement);
        });

        columnsContainer.appendChild(columnContainer);
    });
}

// Make columns droppable
function makeColumnDroppable(columnElement, columnIndex) {
    columnElement.addEventListener('dragover', handleDragOver);
    columnElement.addEventListener('dragleave', handleDragLeave);
    columnElement.addEventListener('drop', (event) => handleDropEvent(event, columnIndex));
}

// Drag-and-drop handlers
function handleDragStart(event, card, columnIndex) {
    event.dataTransfer.setData('text/plain', JSON.stringify({ columnIndex }));
}

function handleDragOver(event) {
    event.preventDefault();
    event.currentTarget.classList.add('dragging-over');
}

function handleDragLeave(event) {
    event.currentTarget.classList.remove('dragging-over');
}

function handleDropEvent(event, columnIndex) {
    event.currentTarget.classList.remove('dragging-over');
    handleDrop(event, columnIndex);
}

// Initialize
initializeGame(4, 5);


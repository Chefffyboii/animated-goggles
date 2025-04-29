// Initialize the game state
const columns = [];
let moves = 0;
const moveCounter = document.getElementById('move-counter');

// Function to increment the move counter
function incrementMoves() {
    moves++;
    moveCounter.textContent = `Moves: ${moves}`;
}

/**
 * Initializes the game with the specified number of columns and cards.
 * @param {number} numColumns - Number of columns.
 * @param {number} numCardsPerColumn - Number of cards per column.
 */
function initializeGame(numColumns, numCardsPerColumn) {
    columns.length = 0; // Clear existing columns
    for (let i = 0; i < numColumns; i++) {
        const column = [];
        for (let j = 0; j < numCardsPerColumn; j++) {
            column.push({ value: j + 1, suit: i % 2 === 0 ? 'hearts' : 'spades' });
        }
        columns.push(column);
    }
    renderColumns();
}

// Create the card element
function createCardElement({ value, suit }) {
    const cardElement = document.createElement('div');
    cardElement.classList.add('card');
    cardElement.textContent = `${value}`; // Show card value
    cardElement.setAttribute('draggable', true);
    cardElement.setAttribute('role', 'button'); // ARIA role
    cardElement.setAttribute('tabindex', '0'); // For keyboard focus
    cardElement.style.backgroundColor = suit === 'hearts' ? 'red' : 'black'; // Simple color distinction

    // Optional: Handle keyboard drag-and-drop
    cardElement.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            // Trigger drag-start logic
        }
    });

    return cardElement;
}

// Function to make cards draggable
function makeCardDraggable(cardElement, card, columnIndex) {
    cardElement.setAttribute('draggable', true);
    cardElement.addEventListener('dragstart', (event) =>
        handleDragStart(event, card, columnIndex)
    );
}

// Function to handle the drop event on a column
function handleDrop(event, targetColumnIndex) {
    event.preventDefault();
    const data = event.dataTransfer.getData('text/plain');
    const { card, columnIndex } = JSON.parse(data);

    try {
        // Ensure that cards can only be placed in valid positions.
        moveCard(card, columnIndex, targetColumnIndex);
        incrementMoves();
    } catch (error) {
        console.error('Error during card move:', error.message);
    }
}

// Function to actually move the card between columns
function moveCard(card, fromColumnIndex, toColumnIndex) {
    try {
        const fromColumn = columns[fromColumnIndex];
        const toColumn = columns[toColumnIndex];
        const cardIndex = fromColumn.indexOf(card);

        if (cardIndex === -1) {
            throw new Error('Card not found in the source column.');
        }

        // Remove the card from the original column and add it to the new column
        fromColumn.splice(cardIndex, 1);
        toColumn.push(card);

        renderColumns(); // Re-render the columns after the move
    } catch (error) {
        console.error('Error while moving the card:', error.message);
    }
}

// Render columns with cards
function renderColumns() {
    const columnsContainer = document.getElementById('columns');
    columnsContainer.innerHTML = ''; // Clear existing columns

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

// Allow column to accept drops
function makeColumnDroppable(columnElement, columnIndex) {
    columnElement.addEventListener('dragover', handleDragOver);
    columnElement.addEventListener('dragleave', handleDragLeave);
    columnElement.addEventListener('drop', (event) =>
        handleDropEvent(event, columnIndex)
    );
}

// Drag-and-drop handlers
function handleDragStart(event, card, columnIndex) {
    event.dataTransfer.setData(
        'text/plain',
        JSON.stringify({ card, columnIndex })
    );
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

// Initialize the game
initializeGame(4, 5);

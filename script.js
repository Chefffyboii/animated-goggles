// Define move counter globally
let moves = 0;
const moveCounter = document.getElementById('move-counter');

// Function to increment the move counter
export function incrementMoves() {
    moves++;
    moveCounter.textContent = `Moves: ${moves}`;
}

// Game columns
const columns = [
    [{ value: 2, suit: 'hearts' }, { value: 3, suit: 'hearts' }, { value: 4, suit: 'hearts' }],
    [{ value: 5, suit: 'hearts' }, { value: 6, suit: 'hearts' }],
    [{ value: 7, suit: 'hearts' }, { value: 8, suit: 'hearts' }],
    [{ value: 9, suit: 'hearts' }, { value: 10, suit: 'hearts' }],
];

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
    cardElement.addEventListener('dragstart', (event) => handleDragStart(event, card, columnIndex));
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
        console.error("Error during card move:", error.message);
    }
}

// Function to actually move the card between columns
function moveCard(card, fromColumnIndex, toColumnIndex) {
    try {
        const fromColumn = columns[fromColumnIndex];
        const toColumn = columns[toColumnIndex];
        const cardIndex = fromColumn.indexOf(card);

        if (cardIndex === -1) {
            throw new Error("Card not found in the source column.");
        }

        // Remove the card from the original column and add it to the new column
        fromColumn.splice(cardIndex, 1);
        toColumn.push(card);

        renderColumns();  // Re-render the columns after the move
    } catch (error) {
        console.error("Error while moving the card:", error.message);
    }
}

// Render columns with cards
function renderColumns() {
    const columnsContainer = document.getElementById('columns');
    columnsContainer.innerHTML = '';  // Clear existing columns

    columns.forEach((column, columnIndex) => {
        const columnContainer = document.createElement('div');
        columnContainer.classList.add('column');
        makeColumnDroppable(columnContainer, columnIndex);

        column.forEach(card => {
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
    columnElement.addEventListener('drop', (event) => handleDropEvent(event, columnIndex));
}

// Drag-and-drop handlers
function handleDragStart(event, card, columnIndex) {
    event.dataTransfer.setData('text/plain', JSON.stringify({ card, columnIndex }));
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

// Initial call to render columns when the game starts
renderColumns();

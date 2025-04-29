const columns = [
    [{ value: 2, suit: 'hearts' }, { value: 3, suit: 'hearts' }, { value: 4, suit: 'hearts' }],
    [{ value: 5, suit: 'hearts' }, { value: 6, suit: 'hearts' }],
    [{ value: 7, suit: 'hearts' }, { value: 8, suit: 'hearts' }],
    [{ value: 9, suit: 'hearts' }, { value: 10, suit: 'hearts' }],
];

let moves = 0;
const moveCounter = document.getElementById('move-counter');

// Create the card element
function createCardElement(card) {
    const cardElement = document.createElement('div');
    cardElement.classList.add('card');
    cardElement.textContent = card.value; // Show card value
    cardElement.setAttribute('draggable', true);
    cardElement.style.backgroundColor = card.suit === 'hearts' ? 'red' : 'black'; // Simple color distinction
    return cardElement;
}

// Function to make cards draggable
function makeCardDraggable(cardElement, card, columnIndex) {
    cardElement.setAttribute('draggable', true);
    cardElement.addEventListener('dragstart', (event) => {
        event.dataTransfer.setData('text/plain', JSON.stringify({ card, columnIndex }));
    });
}

// Function to handle the drop event on a column
function handleDrop(event, targetColumnIndex) {
    event.preventDefault();
    const data = event.dataTransfer.getData('text/plain');
    const { card, columnIndex } = JSON.parse(data);

    // Ensure that cards can only be placed in valid positions.
    moveCard(card, columnIndex, targetColumnIndex);
    incrementMoves();
}

// Function to actually move the card between columns
function moveCard(card, fromColumnIndex, toColumnIndex) {
    const fromColumn = columns[fromColumnIndex];
    const toColumn = columns[toColumnIndex];
    const cardIndex = fromColumn.indexOf(card);

    // Remove the card from the original column and add it to the new column
    fromColumn.splice(cardIndex, 1);
    toColumn.push(card);

    renderColumns();  // Re-render the columns after the move
}

// Increment move counter
function incrementMoves() {
    moves++;
    moveCounter.textContent = `Moves: ${moves}`;
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
    columnElement.addEventListener('dragover', (event) => {
        event.preventDefault();
        columnElement.classList.add('dragging-over');
    });

    columnElement.addEventListener('dragleave', () => {
        columnElement.classList.remove('dragging-over');
    });

    columnElement.addEventListener('drop', (event) => {
        columnElement.classList.remove('dragging-over');
        handleDrop(event, columnIndex);
    });
}

// Initial call to render columns when the game starts
renderColumns();

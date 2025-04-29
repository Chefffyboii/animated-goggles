import { columns } from './gameLogic.js';

/**
 * Renders the columns and cards in the game.
 * @param {HTMLElement} columnsContainer - The container for the columns.
 */
export function renderColumns(columnsContainer) {
    columnsContainer.innerHTML = '';  // Clear existing columns

    columns.forEach((column, columnIndex) => {
        const columnContainer = document.createElement('div');
        columnContainer.classList.add('column');

        column.forEach(card => {
            const cardElement = createCardElement(card);
            makeCardDraggable(cardElement, card, columnIndex);
            columnContainer.appendChild(cardElement);
        });

        columnsContainer.appendChild(columnContainer);
    });
}

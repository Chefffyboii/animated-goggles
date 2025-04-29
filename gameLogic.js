// Initialize the game state
export const columns = [];

/**
 * Initializes the game with the specified number of columns and cards.
 * @param {number} numColumns - Number of columns.
 * @param {number} numCardsPerColumn - Number of cards per column.
 */
export function initializeGame(numColumns, numCardsPerColumn) {
    columns.length = 0; // Clear existing columns
    for (let i = 0; i < numColumns; i++) {
        const column = [];
        for (let j = 0; j < numCardsPerColumn; j++) {
            column.push({ value: j + 1, suit: i % 2 === 0 ? 'hearts' : 'spades' });
        }
        columns.push(column);
    }
}

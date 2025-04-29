import { incrementMoves } from './script.js';

// Change 'let' to 'const' because 'moves' is not reassigned
const moves = 0;

Deno.test("incrementMoves should increase move counter", () => {
    incrementMoves();  // This function will increase the moves by 1
    if (moves !== 1) {
        throw new Error("Move counter didn't increment correctly");
    }
});

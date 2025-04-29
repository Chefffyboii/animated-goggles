// test.js
import { incrementMoves } from './script.js';  // Importing the function correctly

// Test case for incrementMoves
Deno.test("incrementMoves should increase move counter", () => {
    let moves = 0;
    incrementMoves();  // This function will increase the moves by 1
    if (moves !== 1) {
        throw new Error("Move counter didn't increment correctly");
    }
});

// DOM Manipulations

import { COORDINATES_MAP, players, step_length } from './constraints.js'

const diceButton = document.querySelector('#dice-btn');
const resetButton = document.querySelector('#reset-btn');

resetButton.addEventListener('click',() => {
    confirm('Do you want to reset the game..');
})

const playerPieceElements = {
    P1: document.querySelectorAll('[player-id="P1"].player-piece'),
    P2: document.querySelectorAll('[player-id="P2"].player-piece'),
}


export class UI {
    static listenDiceCLick(callback) {
        diceButton.addEventListener("click", callback);
    }
    static listenResetCLick(callback) {
        resetButton.addEventListener("click", callback);
    }

    static listenpieceClick(callback) {
        document.querySelector(".player-pieces").addEventListener('click', callback);
    }

    /**
     @param {string} player
     @param {Number} piece
     @param {Number} newPosition
     */


    static setPiecePosition(player, piece, newPosition) {
        if (!playerPieceElements[player] || !playerPieceElements[player][piece]) {
            console.error(`Player element of given player : ${player} and ${piece} not found`);
            return;
        }

        const [x, y] = COORDINATES_MAP[newPosition];

        const pieceElement = playerPieceElements[player][piece];

        pieceElement.style.top = y * step_length + '%';
        pieceElement.style.left = x * step_length + '%';
    }

    static setTurn(index) {
        if (index < 0 || index >= players.length) {
            console.error("Index out of bounce..");
            return;
        }

        const PLAYER = players[index];
        // display player id
        document.querySelector('.active-player span').innerText = PLAYER;


        const activePlayerBase = document.querySelector('.player-base.highlight');
        if (activePlayerBase) {
            activePlayerBase.classList.remove('highlight');
        }
        // Highlight the player
        document.querySelector(`[player-id="${PLAYER}"].player-base`).classList.add('highlight');
    }

    static enableDice() {
        diceButton.removeAttribute('disabled');
    }
    static disableDice() {
        diceButton.setAttribute('disabled', '');
    }

    /**
      @param {string} player
      @param {Number[]} pieces
     */

    static highlightPieces(player, pieces) {
        pieces.forEach(piece => {
            const pieceElement = playerPieceElements[player][piece];
            pieceElement.classList.add('highlight');
        })
    }

    static unHighlightPieces() {
        document.querySelectorAll('.player-piece.highlight').forEach(ele => {
            ele.classList.remove('highlight');
        })
    }

    static setDiceValue(value) {
        document.querySelector('.dice-value').innerText = value;
    }
}

// UI.setPiecePosition('P1', 0, 0);
// UI.setTurn(0);
// UI.setTurn(1);

// UI.disableDice();
// UI.enableDice();
// UI.highlightPieces('P1',[0]);
// UI.unHighlightPieces();

// UI.setDiceValue(1);
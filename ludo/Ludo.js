import { UI } from "./UI.js";
import { STATE, basePositions, homeEntrance, homePositions, players, safePoints, startPositions, turningPoints } from "./constraints.js";

export class Ludo {
    currentPositions = {
        P1: [],
        P2: [],
    }

    dice_Value;

    get diceValue() {
        return this.dice_Value;
    }

    set diceValue(value) {
        this.dice_Value = value;

        UI.setDiceValue(value);
    }

    _turn;
    get turn() {
        return this._turn;
    }

    set turn(value) {
        this._turn = value;

        UI.setTurn(value);
    }

    _state;
    get state() {
        return this._state;
    }

    set state(value) {
        this._state = value;

        if (value === STATE.dice_not_rolled) {
            UI.enableDice();
            UI.unHighlightPieces();
        }
        else {
            UI.disableDice();
        }
    }
    constructor() {
        console.log('Hello World. Lets play LUDO...');

        // this.diceValue = 5;
        // this.turn = 1;
        // this.state = STATE.dice_rolled;

        this.listenDiceClick();
        this.listenResetClick();
        this.listenPieceCLick();

        this.resetGame();
        // this.setPiecePosition('P1', 0, 0);
        // this.setPiecePosition('P2', 0, 1);
        // // this.setPiecePosition('P1', 2, homePositions.P1);
        // // this.setPiecePosition('P1', 3, homePositions.P1);
        // // this.diceValue = 6;
        // // console.log(this.getEligiblePieces('P1'));
    }

    listenDiceClick() {
        UI.listenDiceCLick(this.onDiceClick.bind(this));
    }

    onDiceClick() {
        console.log("Dice Clicked");

        this.diceValue = Math.floor(Math.random() * 7 + 1);
        this.state = STATE.dice_rolled;

        this.checkForEligiblePiece();
    }

    checkForEligiblePiece(){
        const player_id = players[this.turn];
        // eligible pieces of given player

        const eligiblePieces = this.getEligiblePieces(player_id);

        if(eligiblePieces.length > 0){
            //highlight the pieces
            UI.highlightPieces(player_id, eligiblePieces);
        }else{
            this.incrementTurn();
        }
    }

    incrementTurn(){
        this.turn = this.turn === 0 ? 1 : 0;
        this.state = STATE.dice_not_rolled;
    }

    getEligiblePieces(player_id){
        return [0,1,2,3].filter(piece => {
            const currPos = this.currentPositions[player_id][piece];

            if(currPos === homePositions[player_id]){
                return false;
            }

            if(basePositions[player_id].includes(currPos) && this.diceValue !== 6){
                return false;
            }

            if(homeEntrance[player_id].includes(currPos) && this.diceValue > homePositions[player_id] - currPos){
                return false;
            }

            return true;
        })
    }


    listenResetClick() {
        UI.listenResetCLick(this.resetGame.bind(this));
    }

    resetGame() {
        console.log("Reset Button Clicked");
        this.currentPositions = structuredClone(basePositions);

        players.forEach(player => {
            [0, 1, 2, 3].forEach(piece => {
                this.setPiecePosition(player, piece, this.currentPositions[player][piece]);
            })
        });

        this.turn = 0;
        this.state = STATE.dice_not_rolled;
    }


    listenPieceCLick() {
        UI.listenpieceClick(this.onPieceClick.bind(this));
    }

    onPieceClick(event) {
        const target = event.target;
        if (!target.classList.contains('player-piece')) {
            return;
        }
        console.log("Piece clicked");

        const Player_id = target.getAttribute('player-id');
        const piece_id = target.getAttribute('piece');
        this.handlePieceClick(Player_id, piece_id);
    }

    handlePieceClick(player, piece) {
        console.log(player, piece);
        const currPos = this.currentPositions[player][piece];

        if(basePositions[player].includes(currPos)){
            this.setPiecePosition(player, piece, startPositions[player]);
            this.state = STATE.dice_not_rolled;
            return;
        }

        UI.unHighlightPieces();
        this.movePiece(player, piece, this.diceValue);
    }

    // Set Piece Position

    setPiecePosition(player, piece, newPosition) {
        this.currentPositions[player][piece] = newPosition;
        UI.setPiecePosition(player, piece, newPosition);
    }


    movePiece(player, piece, moveSteps) {

        const interval = setInterval(() => {
            this.incrementPiecePosition(player, piece);
            moveSteps--;

            if(moveSteps === 0){
                clearInterval(interval);

                // Check for win
                if(this.hasPlayerWon(player)){
                    alert(`Player : ${player} has won!`);
                    this.resetGame();
                    return;
                }

                const isKill = this.checkForKill(player, piece);

                if(isKill || this.diceValue === 6){
                    this.state = STATE.dice_not_rolled;
                    return;
                }

                this.incrementTurn();
            }
        }, 200);
    }


    checkForKill(player, piece){
        const currPos = this.currentPositions[player][piece];
        const opponent = player === 'P1' ? 'P2' : 'P1';

        let kill = false;

        [0,1,2,3].forEach(piece => {
            const opponentPosition = this.currentPositions[opponent][piece];

            if(currPos === opponentPosition && !safePoints.includes(currPos)){
                this.setPiecePosition(opponent, piece, basePositions[opponent][piece]);
                kill = true;
            }
        });

        return kill;
    }

    hasPlayerWon(player){
        return [0,1,2,3].every(piece => this.currentPositions[player][piece] === homePositions[player])
    }

    incrementPiecePosition(player, piece) {
        this.setPiecePosition(player, piece, this.getIncrementPosition(player, piece));
    }

    getIncrementPosition(player, piece){
        const currPos = this.currentPositions[player][piece];

        if (currPos === turningPoints[player]) {
            return homeEntrance[player][0];
        }

        else if (currPos === 51) {
            return 0;
        }
        else {
            return currPos + 1;
        }
    }
}
/*
The game class

This class represents a Space Invaders game.
Create an insance of it, change any of the default values in the settings and call 'start' to run the game.

Call 'initialise' before 'start' to set canvas the game will draw to.

Call 'moveShip' or 'shipFare' to control the ship.

Listen for 'gameWon' or 'gameLost' event to handle the game ending.
*/

// constants for the keyboard
var KEY_LEFT = 37;
var KEY_RIGHT = 39;
var KEY_SPACE = 32;

// create an instance of the game class
function Game() {
    // set the initial config
    this.config = {
        bombRate: 0.05,
        bombMinVelocity: 50,
        bombMaxVelocity: 50,
        invaderInitialVelocity: 25,
        invaderAcceleration: 0,
        invaderDropDistance: 20,
        rocketVelocity: 120,
        rocketMaxFire: 2,
        gameWidth: 400,
        gameHeight: 300,
        fps: 50,
        debugMode: false,
        invaderRanks: 5,
        invaderFiles: 10,
        shipSpeed: 120,
        levelDifficultyMultiplier: 0.2,
        pointsPerInvader: 5,
        limitLevelIncrease: 25
    };

    // all state is in the variable below
    this.lives = 3;
    this.width = 0;
    this.height = 0;
    this.gameBounds = {left: 0, top: 0, right: 0, bottom: 0};
    this.inveralId = 0;
    this.score = 0;
    this.level =  1;

    // the state stack
    this.stateStack = [];

    // input/output
    this.pressedKey = {};
    this.gameCanvas = null;

    // all sounds
    this.sounds = null;

    // the previous x position, used for touch
    this.previousX = 0;
}

// initialise the game with a canvas
Game.prototype.initialise = function(gameCanvas) {
    // set the game canvas
    this.gameCanvas = gameCanvas;

    // set the game width and height
    this.width = gameCanvas.width;
    this.height = gameCanvas.height;

    // set the state game bounds
    this.gameBounds = {
        left: gameCanvas.width / 2 - this.config.gameWidth / 2,
        right: gameCanvas.width / 2 + this.config.gameWidth / 2,
        top: gameCanvas.height / 2 - this.config.gameHeight / 2,
        bottom: gameCanvas.height / 2 + this.config.gameHeight / 2,
    };
};

Game.prototype.moveToState = function(state) {
    // if we are in a state, leave it
    if (this.currentState() && this.currentState().leave) {
        this.currentState().leave(game);
        this.stateStack.pop();
    }

    // if there's an enter function for the new state, call it
    if (state.enter) {
        state.enter(game);
    }

    // set the current game
    this.stateStack.pop();
    this.stateStack.push(state);
};

// start the game
Game.prototype.start = function() {
    // move into the 'welcome' state
    this.moveToState(new WelcomeState());

    // set the game variables
    this.lives = 3;
    this.config.debugMode = /debug=true/.test(window.location.href);

    // set the curren state
    var game = this;
    this.intervalId = setInterval(function() { GameLoop(game);}, 1000 / this.config.fps);
};

// returns the curren state
Game.prototype.currentState = function() {
    return this.stateStack.length > 0 ? this.stateStack[this.stateStack.length - 1] : null;
}

// mute or unmute the game
Game.prototype.mute = function(mute) {
    // if we're been told to mute, mute
    if (mute === true) {
        this.sounds.mute = true;
    } else if (mute === false) {
        this.sounds.mute = false;
    } else {
        // toggle mute instead
        this.sounds.mute = this.sounds.mute ? false : true;
    }
}

// the main loop
function GameLoop(game) {
    
}
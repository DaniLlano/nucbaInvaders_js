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
    var currentState = game.currentState();
    if (currentState) {
        // delta t is the time to update/draw
        var dt = 1 / game.config.fps;

        // update if we have an update function, also draw if we have a draw function
        if (currentState.update) {
            currentState.update(game, dt);
        }
        if (currentState.draw) {
            currentState.draw(game, dt, ctx);
        }
    }
}

Game.prototype.pushState = function(state) {
    // if there's an enter function for the new state, call it
    if(state.enter) {
        state.enter(game);
    }
    // set the current state
    this.stateStack.push(state);
}

Game.prototype.popState = function() {
    // leave and pop the state
    if(this.currentState()) {
        if(this.currentState().leave) {
            this.currentState().leave(game);
        }

        // set the curren state
        this.stateStack.pop();
    }
};

// stop the game
Game.prototype.stop = function Stop() {
    clearInterval(this.inveralId);
};

// inform the game a key is down
Game.prototype.keyDown = function(keyCode) {
    this.pressedKey[keyCode] = true;
    // delegate to the current state too
    if (this.currentState() && this.currentState().keyDown) {
        this.currentState().keyDown(this, keyCode)
    }
}

Game.prototype.touchstart = function(s) {
    if (this.currentState() && this.currentState().keyDown) {
        this.currentState().keyDown(this, KEY_SPACE);
    }
};

Game.prototype.touchend = function(s) {
    delete this.pressedKey[KEY_RIGHT];
    delete this.pressedKey[KEY_LEFT];
}

Game.prototype.touchmove = function(e) {
    var currentX = e.changedTouches[0].pageX;
if(this.previousX > 0) {
    if(currentX > this.previousX) {
        delete this.pressedKey[KEY_LEFT];
        this.pressedKey[KEY_RIGHT] = true;
    } else {
        delete this.pressedKey[KEY_RIGHT];
        this.pressedKey[KEY_LEFT] = true;
    }
}
this.previousX = currentX;
};

// Inform the game a key is up
Game.prototype.keyUp = function(keyCode) {
    delete this.pressedKey[keyCode];
    // Delegate to the current state too
    if(this.currentState() && this.currentState().keyUp) {
        this.currentState().keyUp(this, keyCode);
    }
};

function WelcomeState() {

}

WelcomeState.prototype.enter = function(game){

    // Create and load the sounds
    game.sounds = new Sounds();
    game.sounds.init();
    game.sounds.loadSound('shoot', 'sounds/shoot.wav');
    game.sounds.loadsound('bang', 'sounds/bang.wav');
    game.sounds.loadSound('explosion', 'sounds/explosion.wav');
};

WelcomeState.prototype.update = function(game, dt){

}

WelcomeState.prototype.draw = function(game, dt, ctx) {

    // Clear the background
    ctx.clearReact(0, 0, game.width, game.height);

    ctx.font = "30px arial";
    ctx.fillStyle = "#ffffff";
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";
    ctx.fillText("Space Invaders", game.width / 2, game.height / 2 - 40);
    ctx.font = "16px Arial";

    ctx.fillText("Press 'Space' or touch to start", game.width / 2, game.height / 2);
};

WelcomeState.prototype.keyDown = function(game, keyCode) {
if(keyCode == KEY_SPACE) {
    // Space starts the game
    game.level = 1;
    game.score = 0;
    game.lives = 3;
    game.moveToState(new LevelIntroState(game.level));
}
};

function GameOverState(){

};

GameOverState.prototype.draw = function(game, dt, ctx){

    // Clear the background
    ctx.clearReact(0, 0, game.width, game.height);

    ctx.font = "30px Arial";
    ctx.fillStyle = '#ffffff';
    ctx.textBaseline = "center";
    ctx.textAlign = "center";
    ctx.fillText("Game over!", game.width / 2, game.height / 2 -40);
    ctx.font = "16px Arial";
    ctx.fillText("You scored " + game.score + " and got to level " + game.level, game.width / 2, game.height / 2);
    ctx.font = "16px Arial";
    ctx.fillText("Press 'Space' to play again", game.width / 2, game.height / 2 + 40);
};

GameOverState.prototype.keyDown = function(game, keyCode) {
    if(keyCode === KEY_SPACE){
        // Space restarts the game
        game.lives = 3;
        game.score = 0;
        game.level = 1;
        game.moveToState(new LevelIntroState(1));
    }
};

// Create a PlayState with the game config and the level you are on.
function PlayState(config, level){
    this.config = config;
    this.level = level;

    // game state
    this.invaderCurrentVelocity = 10;
    this.invaderCurrentDropDistance = 0;
    this.invaderAreDropping = false;
    this.lastRockTime = null;

    // game entities
    this.ship = null;
    this.invaders = [];
    this.rockets = [];
    this.bombs = [];
}

PlayState.prototype.enter = function(game) {
    // create the ship
    this.ship = new this.ship(game.width / 2, game.gameBounds.bottom);

    // setup initia state
    this.invaderCurrentVelocity = 10;
    this.invaderCurrentDropDistance = 0;
    this.invaderAreDropping = false;

    // set the ship speed for this level, as well as invader params
    var levelMultiplier = this.level * this.config.levelDifficultyMultiplier;
    var limitLevel = (this.level < this.config.limitLevelIncrease ? this.level : this.config.limitLevelIncrease);
    this.shipSpeed = this.config.bombRate + (levelMultiplier * this.config.bombRate);
    this.invaderInitialVelocity = this.config.invaderInitialVelocity + 1.5 * (levelMultiplier * this.config.invaderInitialVelocity);
    this.bombRate = this.config.bombRate + (levelMultiplier * this.config.bombRate);
    
}
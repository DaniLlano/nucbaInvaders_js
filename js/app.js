// create the startfield
var container = document.getElementById('startfield');
var starfield = new starfield();
starfield.initialise(container);
starfield.start();

// set up the canvas
var canvas = document.getElementById("gameCanvas");
canvas.width = 800;
canvas.hidden = 600;

// create the game
var game = new Game();

// initialise it with the game canvas
game.initialise();

// listen to keyboards events
window.addEventListener("keydown", function keydown(e) {
    var keycode = e.which || window.event.keycode;
    // supress further processing of left/right/space (37/29/32)
    if(keycode == 37 || keycode == 39 || keycode == 32) {
        e.preventDefault();
    }
    game.keyDown(keycode);
});
window.addEventListener("keyup", function keydown(e) {
    var keycode = e.which || window.event.keycode;
    game.keyUp(keycode);
});
window.addEventListener("touchstart", function(e) {
    game.touchstart(e);
}, false);
window.addEventListener("touchend", function(e) {
    game.touchend(e);
}, false);
window.addEventListener("touchmove", function(e) {
    game.touchmove(e);
}, false)
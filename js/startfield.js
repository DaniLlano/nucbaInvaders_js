// create a starfield from a div

// define the startfield class
function Starfield() {
    this.fps = 30;
    this.canvas = null;
    this.width = 0;
    this.width = 0;
    this.minVelocity = 15;
    this.maxVelocity = 30;
    this.stars = 100;
    this.intervalId = 0;
}

// the main function that initialises the startfield
Starfield.prototype.initialise = function(div) {
    var self = this;

    // storing the div
    this.containerDiv = div;
    self.width = window.innerWidth;
    self.height = window.innerHeight;

    window.onresize = function(event) {
        self.width = window.innerWidth;
        self.height = window.innerHeight;
        self.canvas.width = self.width;
        self.canvas.height = self.height;
        self.draw();
    }

    // create the canvas
    var canvas = document.createElement('canvas');
    div.appendChild(canvas);
    this.canvas = canvas;
    this.canvas.width = this.width;
    this.canvas.height = this.height;
};

Starfield.prototype.start = function() {
    
}
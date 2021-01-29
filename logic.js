// SELECT CANVAS
const cvs = document.getElementById('canvas');
const ctx = cvs.getContext('2d');
//FRAMES
let frames = 0
//IMAGE
const sprite = new Image();
sprite.src = 'sprite-2.png'

const state = {
    current: 0,
    getReady: 0,
    game: 1,
    over: 2
}

















//BACKGROUND OBJECT
const bg = {
    sx: 0,
    sy: 0,
    w: 345,
    h: 600,
    dx: 0,
    dy: cvs.height - 600,
    draw: function(){
        ctx.drawImage(sprite, this.sx, this.sy, this.w, this.h,
            this.dx, this.dy, this.w, this.h)
    }
}

//BIRD OBJECT
const bird = {
    animation: [
        {sx:643, sy:93},
        {sx:643, sy:132},
        {sx:643, sy:170},
        {sx: 643, sy:132}
    ],
    w: 45,
    h: 40,
    dx: cvs.width/2 - 45/2,
    dy: 150,
    frame: 2,
    draw: function(){
        let bird = this.animation[this.frame]
        ctx.drawImage(sprite, bird.sx, bird.sy, this.w, this.h,
            this.dx, this.dy, this.w, this.h)
    }
}

//STARTING SCREEN
const startScreen={
    sx: 380,
    sy: 30,
    w: 235,
    h: 55,
    dx: cvs.width/2  - 225/2,
    dy: 50,
    draw: function(){
        ctx.drawImage(sprite, this.sx, this.sy, this.w, this.h,
            this.dx, this.dy, this.w, this.h)
    }
}

// GAME OVER 
const gameOver={
    sx: 520,
    sy: 280,
    w: 315,
    h: 300,
    dx: cvs.width/2  - 315/2,
    dy: 50,
    draw: function(){
        ctx.drawImage(sprite, this.sx, this.sy, this.w, this.h,
            this.dx, this.dy, this.w, this.h)
    }
}


function draw(){
    bg.draw();
    bird.draw();
    // startScreen.draw();
    // gameOver.draw();
}

function update(){

}

function loop(){
    update();
    draw();
    frames++
    requestAnimationFrame(loop);
}

loop();
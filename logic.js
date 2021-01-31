// SELECT CANVAS
const cvs = document.getElementById('canvas');
const ctx = cvs.getContext('2d');
//FRAMES AND GAME VARIABLES
let frames = 0;
let gravity = 0.3;
let jump = 4.5;
let speed = 0;
//OTHER VARS
let degToRad = Math.PI/180;
//IMAGE
const sprite = new Image();
sprite.src = 'sprite-2.png';
//GAME STATES
let state = {
  current: 0,
  beforeGame: 0,
  game: 1,
  endGame: 2,
};

document.addEventListener('keydown', evt => {
  if (evt.code === 'Space') {
    switch (state.current) {
      case state.beforeGame:
        state.current = state.game;
        break;
      case state.game:
        bird.jump();
        break;
      case state.endGame:
        state.current = state.beforeGame;
        break;
    }
  }
});

//BACKGROUND 
const bg = {
  sx: 0,
  sy: 0,
  w: 345,
  h: 600,
  dx: 0,
  dy: cvs.height - 600,
  draw: function () {
    ctx.drawImage(sprite, this.sx, this.sy, this.w, this.h, this.dx, this.dy, this.w, this.h);
  },
  update: function(){
      if(state.current === state.game){
        this.dx = (this.dx-2)%(this.w/2);
      }
  }
};

const fg = {
  sx: 0,
  sy: 450,
  w: 345,
  h: 150,
  dx: 0,
  dy: cvs.height - 150,
  draw: function () {
    ctx.drawImage(sprite, this.sx, this.sy, this.w, this.h, this.dx, this.dy, this.w, this.h);
  },
  update: function(){
      if(state.current === state.game){
        this.dx = (this.dx-2)%(this.w);
      }
  }  
}


//BIRD
const bird = {
  images: [
    { sx: 643, sy: 93 },
    { sx: 643, sy: 132 },
    { sx: 643, sy: 170 },
    { sx: 643, sy: 132 },
  ],
  w: 45,
  h: 40,
  dx: cvs.width / 2 - 45 / 2,
  dy: 150,
  frame: 0,
  period: 0,
  rotation: 0,
  draw: function () {
    let bird = this.images[this.frame];

    // ctx.save();
    // ctx.translate(this.dx, this.dy);
    // ctx.rotate(this.rotation)

    ctx.drawImage(sprite, bird.sx, bird.sy, this.w, this.h, this.dx, this.dy, this.w, this.h);
    // ctx.restore();
},
  fall: function () {
    this.period = state.current == state.beforeGame ? 10 : 5;
    //Change birds image each 5 or 10 frames depending on game state
    this.frame += frames % this.period == 0 ? 1 : 0;
    this.frame = this.frame % 4;
    if (state.current == state.beforeGame) {
      //RESET Y POSITION
      this.dy = 150;
      this.rotation = 0 * degToRad;
      speed = 0
    } else {
      speed += gravity;
      this.dy += speed;
      //if bird touches ground
      const ground = cvs.height - 170;
      const birdBottom = this.dy + this.h / 2;
      if (birdBottom >= ground) {
        this.frame = 1;
        this.dy = ground - this.h / 2;
        if (state.current == state.game) {
          state.current = state.endGame;
        }
      }
    //   if (speed >= jump){
    //       this.rotation = 90 * degToRad;
    //       this.frame = 1;
    //   } else {
    //       this.rotation = -25 * degToRad;
    //   }
    }
  },
  jump: function () {
    speed = -jump;
  },
};

const pipes = {

}











//STARTING SCREEN
const startScreen = {
  sx: 380,
  sy: 30,
  w: 235,
  h: 55,
  dx: cvs.width / 2 - 225 / 2,
  dy: 50,
  draw: function () {
    if (state.current == state.beforeGame) {
      ctx.drawImage(sprite, this.sx, this.sy, this.w, this.h, this.dx, this.dy, this.w, this.h);
    }
  },
};

// GAME OVER
const gameOver = {
  sx: 520,
  sy: 280,
  w: 315,
  h: 300,
  dx: cvs.width / 2 - 315 / 2,
  dy: 50,
  draw: function () {
    if (state.current == state.endGame) {
      ctx.drawImage(sprite, this.sx, this.sy, this.w, this.h, this.dx, this.dy, this.w, this.h);
    }
  },
};

function draw() {
  ctx.fillStyle= "#ffffff";
  ctx.fillRect(0, 0, cvs.width, cvs.height);
  bg.draw();
  fg.draw();
  bird.draw();
  startScreen.draw();
  gameOver.draw();
}

function update() {
  bird.fall();
  fg.update();
}

function loop() {
  update();
  draw();
  frames++;
  requestAnimationFrame(loop);
}

loop();

// SELECT CANVAS
const cvs = document.getElementById('canvas');
const ctx = cvs.getContext('2d');
//FRAMES AND GAME VARIABLES
let frames = 0;
let gravity = 0.3;
let jump = 4.5;
let speed = 0;
//OTHER VARS
let degToRad = Math.PI / 180;
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

document.addEventListener('keydown', (evt) => {
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
        pipes.clear();
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
  }
};

//BIRD
const bird = {
  images: [
    { sx: 643, sy: 93 },
    { sx: 643, sy: 132 },
    { sx: 643, sy: 170 },
    { sx: 643, sy: 132 },
  ],
  radius: 8,
  w: 43,
  h: 39,
  dx: 50,
  dy: 150,
  frame: 0,
  period: 0,
  rotation: 0,
  draw: function () {
    let bird = this.images[this.frame];
    ctx.drawImage(sprite, bird.sx, bird.sy, this.w, this.h, this.dx, this.dy, this.w, this.h);
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
      speed = 0;
    } else {
      speed += gravity;
      this.dy += speed;
      //if bird touches ground
      const ground = cvs.height - 170;
      const birdBottom = this.dy + this.h / 2;
      if (birdBottom >= ground) {
        this.frame = 0;
        this.dy = ground - this.h / 2;
        if (state.current == state.game) {
          state.current = state.endGame;
        }
      }
    }
  },
  jump: function () {
    speed = -jump;
  },
};

const pipes = {
  position: [], 
  bottom: {
    sx: 851,
    sy: 0,
  },
  top: {
    sx: 934, //935
    sy: 160, //162
  },
  w: 70,
  h: 400,
  gap: 100,
  dx: 2,
  maxYPos: -150,
  clear: function () {
    this.position = [];
  },
  draw: function () {
    for (let i = 0; i < this.position.length; i++) {
      let p = this.position[i];
      //top pipe
      ctx.drawImage(sprite, this.top.sx, this.top.sy, this.w, this.h, p.x, p.y, this.w, this.h);
      //bottom pipe
      ctx.drawImage(sprite, this.bottom.sx, this.bottom.sy, this.w, this.h, p.x, p.y + this.h + this.gap, this.w, this.h);
    }
  },
  update: function () {
    if (state.current !== state.game) return;
    //Draw pipe every 100 frames
    if (frames % 100 == 0) {
      this.position.push({
        x: cvs.width,
        y: this.maxYPos * (Math.random() + 1),
      });
    }
    for (let i = 0; i < this.position.length; i++) {
      let p = this.position[i];
      let bottomPipeYPos = p.y + this.h + this.gap;
      // COLLISION DETECTION
      // TOP 
      if (
        bird.dx + bird.radius > p.x &&
        bird.dx - bird.radius < p.x + this.w &&
        bird.dy + bird.radius > p.y &&
        bird.dy - bird.radius < p.y + this.h
      ) {
        // ctx.drawImage(sprite, 520, 280, 200, 100, bird.dx - bird.radius, bird.dy - bird.radius, 200, 100);
        state.current = state.endGame;
      }
      // BOTTOM 
      if (
        bird.dx + bird.radius > p.x &&
        bird.dx - bird.radius < p.x + this.w &&
        bird.dy + bird.radius > bottomPipeYPos &&
        bird.dy - bird.radius < bottomPipeYPos + this.h
      ) {
        state.current = state.endGame;
      }

      p.x -= this.dx;
      //Remove pipe outside canvas
      if (p.x + this.w <= 0) {
        this.position.shift();
      }
    }
  },
};

const score = {
  highest: 0,
  value: 0,
  draw: function () {
    ctx.fillStyle = '#fff';
    ctx.strokeStyle = '#9E80FE';
  },
};

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
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, cvs.width, cvs.height);
  bg.draw();
  bird.draw();
  pipes.draw();

  startScreen.draw();
  gameOver.draw();
}

function update() {
  bird.fall();
  pipes.update();
}

function loop() {
  update();
  draw();
  frames++;
  requestAnimationFrame(loop);
}

loop();

class GameManager {
  constructor() {
    // Initialize canvas and drawing context.
    this.canvas = document.getElementById('game-canvas')
    this.context = this.canvas.getContext('2d');
    this.prevTime = 0;

    // Initialize snek stuff
    this.sneks = [];
    this.snekSpeed = 100;
    this.snekStepCounter = 0;

    // munchie stuff
    this.munchies = [];
    this.munchieWindow = 2000;
    this.munchieCounter = 0;
  }

  /**
   *
   */
  init() {
    // Create our player sneks!
    this.sneks.push(
      new Snek({ x: 10, y: 10 }, DIRECTIONS.RIGHT, this.canvas.width, this.canvas.height, 'blue'),
      new Snek({ x: 50, y: 50 }, DIRECTIONS.DOWN, this.canvas.width, this.canvas.height, 'red'),
    );

    // Initialize event stuff
    window.onkeydown = this.keydown.bind(this);

    // Starts rendering the game.
    this.update(0);
  }

  /**
   *
   * @param {*} currentTime
   */
  update(currentTime) {
    const deltaTime = currentTime - this.prevTime;
    this.prevTime = currentTime;

    this.snekStepCounter += deltaTime;
    if (this.snekStepCounter >= this.snekSpeed) {
      this.sneks.forEach((snek, index) => {
        snek.update();
        this.checkCollisions(snek, index);
      });

      this.snekStepCounter = 0;
    }

    this.munchieCounter += deltaTime;
    if (this.munchieCounter >= this.munchieWindow) {
      this.spawnMunchie();
      this.munchieCounter = 0;
    }

    // Update all children with delta time (if necessary)
    this.draw();
    requestAnimationFrame(this.update.bind(this));
  }

  spawnMunchie() {
    let munchX = (Math.round(Math.random() * 37) * 20) + 10;
    let munchY = (Math.round(Math.random() * 24) * 20) + 10;

    this.munchies.push({ x: munchX, y: munchY });
  }

  keydown(e) {
    // ask q about turning restrictions
    // Player one
    if (e.keyCode === KEYS.LEFT && this.sneks[0].direction !== DIRECTIONS.RIGHT) {
      this.sneks[0].changeDirection(DIRECTIONS.LEFT);
    }

    if (e.keyCode === KEYS.UP && this.sneks[0].direction !== DIRECTIONS.DOWN) {
      this.sneks[0].changeDirection(DIRECTIONS.UP);
    }

    if (e.keyCode === KEYS.RIGHT && this.sneks[0].direction !== DIRECTIONS.LEFT) {
      this.sneks[0].changeDirection(DIRECTIONS.RIGHT);
    }

    if (e.keyCode === KEYS.DOWN && this.sneks[0].direction !== DIRECTIONS.UP) {
      this.sneks[0].changeDirection(DIRECTIONS.DOWN);
    }

    // Player two
    if (e.keyCode === KEYS.A && this.sneks[1].direction !== DIRECTIONS.RIGHT) {
      this.sneks[1].changeDirection(DIRECTIONS.LEFT);
    }

    if (e.keyCode === KEYS.W && this.sneks[1].direction !== DIRECTIONS.DOWN) {
      this.sneks[1].changeDirection(DIRECTIONS.UP);
    }

    if (e.keyCode === KEYS.D && this.sneks[1].direction !== DIRECTIONS.LEFT) {
      this.sneks[1].changeDirection(DIRECTIONS.RIGHT);
    }

    if (e.keyCode === KEYS.S && this.sneks[1].direction !== DIRECTIONS.UP) {
      this.sneks[1].changeDirection(DIRECTIONS.DOWN);
    }

    // Other keystrokes

    if (e.keyCode === KEYS.SPACE) {
      this.sneks[0].addSegment();
    }
  }

  checkCollisions(snek, index) {
    const headPosition = snek.segmentPositions[0];

    // Snek collisions
    this.sneks.forEach((otherSnek, otherIndex) => {
      if (index !== otherIndex) {
        otherSnek.segmentPositions.forEach(position => {
          if (headPosition.x === position.x && headPosition.y === position.y) {
            console.log(snek);
          }
        });
      }
    });

    // Munchie collisions
    let collidedMunchie = -1;
    this.munchies.forEach((munchie, i) => {
      if (headPosition.x === munchie.x && headPosition.y === munchie.y) {
        snek.addSegment();
        collidedMunchie = i;
      }
    });

    if (collidedMunchie != -1) {
      this.munchies.splice(collidedMunchie, 1);
    }
  }

  /**
   *
   *
   * @memberof GameManager
   */
  draw() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.sneks.forEach(snek => {
      snek.draw(this.context);
    });

    this.munchies.forEach(this.drawMunchie.bind(this));
  }

  drawMunchie(position) {
    this.context.fillStyle = 'black';
    this.context.fillRect(position.x - 5, position.y - 5, 10, 10);
  }
}

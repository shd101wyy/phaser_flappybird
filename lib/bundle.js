/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	//global variables

	window.onload = function () {
	  var game = new Phaser.Game(288, 505, /*Phaser.AUTO*/Phaser.CANVAS, 'flappy_bird');

	  // Game States
	  game.state.add('boot', __webpack_require__(1));
	  game.state.add('gameover', __webpack_require__(2));
	  game.state.add('menu', __webpack_require__(3));
	  game.state.add('play', __webpack_require__(4));
	  game.state.add('preload', __webpack_require__(10));

	  game.state.start('boot');
	};

/***/ },
/* 1 */
/***/ function(module, exports) {

	
	'use strict';

	function Boot() {}

	Boot.prototype = {
	  preload: function preload() {
	    this.load.image('preloader', 'assets/preloader.gif');
	  },
	  create: function create() {
	    // If this is not a desktop (so it's a mobile device)
	    if (this.game.device.desktop == false) {
	      // Set the scaling mode to SHOW_ALL to show all the game
	      this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

	      // Set a minimum and maximum size for the game
	      // Here the minimum is half the game size
	      // And the maximum is the original game size
	      this.game.scale.setMinMax(this.game.width / 2, this.game.height / 2, this.game.width, this.game.height);
	    }

	    // Center the game horizontally and vertically
	    this.game.scale.pageAlignHorizontally = true;
	    this.game.scale.pageAlignVertically = true;

	    this.game.input.maxPointers = 1;
	    this.game.state.start('preload');
	  }
	};

	module.exports = Boot;

/***/ },
/* 2 */
/***/ function(module, exports) {

	
	'use strict';

	function GameOver() {}

	GameOver.prototype = {
	  preload: function preload() {},
	  create: function create() {
	    var style = { font: '65px Arial', fill: '#ffffff', align: 'center' };
	    this.titleText = this.game.add.text(this.game.world.centerX, 100, 'Game Over!', style);
	    this.titleText.anchor.setTo(0.5, 0.5);

	    this.congratsText = this.game.add.text(this.game.world.centerX, 200, 'You Win!', { font: '32px Arial', fill: '#ffffff', align: 'center' });
	    this.congratsText.anchor.setTo(0.5, 0.5);

	    this.instructionText = this.game.add.text(this.game.world.centerX, 300, 'Click To Play Again', { font: '16px Arial', fill: '#ffffff', align: 'center' });
	    this.instructionText.anchor.setTo(0.5, 0.5);
	  },
	  update: function update() {
	    if (this.game.input.activePointer.justPressed()) {
	      this.game.state.start('play');
	    }
	  }
	};
	module.exports = GameOver;

/***/ },
/* 3 */
/***/ function(module, exports) {

	'use strict';

	function Menu() {}

	Menu.prototype = {
	  preload: function preload() {},
	  create: function create() {
	    // add the background sprite
	    this.background = this.game.add.sprite(0, 0, 'background');

	    // add the ground sprite as a tile
	    // and start scrolling in the negative x direction
	    this.ground = this.game.add.tileSprite(0, 400, 335, 112, 'ground');
	    this.ground.autoScroll(-200, 0);

	    this.titleGroup = this.game.add.group();

	    this.title = this.game.add.sprite(0, 0, 'title');
	    this.titleGroup.add(this.title);

	    this.bird = this.game.add.sprite(200, 5, 'bird');
	    this.titleGroup.add(this.bird);

	    this.bird.animations.add('flap');
	    this.bird.animations.play('flap', 12, true);

	    this.titleGroup.x = 30;
	    this.titleGroup.y = 100;

	    // this.game.add.tween(object).to(properties, duration, ease, autoStart, delay, repeat, yoyo);
	    this.game.add.tween(this.titleGroup).to({ y: 115 }, 350, Phaser.Easing.Linear.NONE, true, 0, 1000, true);

	    this.startButton = this.game.add.button(this.game.width / 2, 300, 'startButton', this.startClick, this);
	    this.startButton.anchor.setTo(0.5, 0.5);

	    // this.startButton.inputEnabled = true
	    // this.startButton.input.useHandCursor = true
	  },
	  startClick: function startClick() {
	    this.game.state.start('play');
	  },
	  update: function update() {}
	};

	module.exports = Menu;

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Bird = __webpack_require__(5);
	var Ground = __webpack_require__(6);
	var PipeGroup = __webpack_require__(7);
	var Scoreboard = __webpack_require__(9);

	function Play() {}

	Play.prototype = {
	  create: function create() {
	    this.game.physics.startSystem(Phaser.Physics.ARCADE);
	    this.game.physics.arcade.gravity.y = 1200;

	    this.background = this.game.add.sprite(0, 0, 'background');

	    // create a new Bird object
	    this.bird = new Bird(this.game, 100, this.game.height / 2);
	    // and add it to the game
	    this.game.add.existing(this.bird);

	    // create and add a new Ground object
	    this.ground = new Ground(this.game, 0, 400, 335, 112);
	    this.game.add.existing(this.ground);

	    // create and add a group to hold our pipeGroup prefabs
	    this.pipes = this.game.add.group();

	    // keep the spacebar from propagating up to the browser
	    this.game.input.keyboard.addKeyCapture([Phaser.Keyboard.SPACEBAR]);

	    // add keyboard controls
	    var flapKey = this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
	    flapKey.onDown.addOnce(this.startGame, this);
	    flapKey.onDown.add(this.bird.flap, this.bird);

	    // add mouse/touch controls
	    this.game.input.onDown.addOnce(this.startGame, this);
	    this.game.input.onDown.add(this.bird.flap, this.bird);

	    // instructions
	    this.instructionGroup = this.game.add.group();
	    this.instructionGroup.add(this.game.add.sprite(this.game.width / 2, 100, 'getReady'));
	    this.instructionGroup.add(this.game.add.sprite(this.game.width / 2, 325, 'instructions'));
	    this.instructionGroup.setAll('anchor.x', 0.5);
	    this.instructionGroup.setAll('anchor.y', 0.5);

	    this.score = 0;

	    this.scoreText = this.game.add.bitmapText(this.game.width / 2, 10, 'flappyfont', this.score.toString(), 24);
	    this.scoreText.visible = false;

	    this.scoreSound = this.game.add.audio('score');
	  },
	  update: function update() {
	    var _this = this;

	    if (this.bird.alive) {
	      this.game.physics.arcade.collide(this.bird, this.ground, this.deathHandler, null, this);

	      this.pipes.forEach(function (pipeGroup) {
	        _this.checkScore(pipeGroup);
	        _this.game.physics.arcade.collide(_this.bird, pipeGroup, _this.deathHandler, null, _this);
	      });
	    }
	  },
	  checkScore: function checkScore(pipeGroup) {
	    if (pipeGroup.exists && !pipeGroup.hasScored && pipeGroup.topPipe.world.x <= this.bird.world.x) {
	      pipeGroup.hasScored = true;
	      this.score += 1;
	      this.scoreText.setText(this.score.toString());
	      this.scoreSound.play();
	    }
	  },
	  startGame: function startGame() {
	    this.bird.body.allowGravity = true;
	    this.bird.alive = true;

	    this.score = 0;

	    // add a timer
	    // add a timer
	    this.pipeGenerator = this.game.time.events.loop(Phaser.Timer.SECOND * 1.25, this.generatePipes, this);
	    this.pipeGenerator.timer.start();

	    this.instructionGroup.destroy();
	    this.scoreText.visible = true;
	  },
	  generatePipes: function generatePipes() {
	    var pipeY = this.game.rnd.integerInRange(-100, 100);
	    var pipeGroup = this.pipes.getFirstExists(false);
	    if (!pipeGroup) {
	      pipeGroup = new PipeGroup(this.game, this.pipes);
	    }
	    pipeGroup.reset(this.game.width + pipeGroup.width / 2, pipeY);

	    //pipeGroup.x = this.game.width
	    //pipeGroup.y = pipeY
	  },
	  deathHandler: function deathHandler() {
	    console.log('game over');
	    this.bird.alive = false;
	    this.pipes.callAll('stop');
	    this.pipeGenerator.timer.stop();
	    this.ground.stopScroll();
	    this.scoreboard = new Scoreboard(this.game);
	    this.game.add.existing(this.scoreboard);
	    this.scoreboard.show(this.score);
	  },
	  shutdown: function shutdown() {
	    this.game.input.keyboard.removeKey(Phaser.Keyboard.SPACEBAR);
	    this.bird.destroy();
	    this.pipes.destroy();
	    this.scoreboard.destroy();
	  }
	};

	module.exports = Play;

/***/ },
/* 5 */
/***/ function(module, exports) {

	'use strict';

	var Bird = function Bird(game, x, y, frame) {
	  Phaser.Sprite.call(this, game, x, y, 'bird', frame);

	  this.anchor.setTo(0.5, 0.5);

	  this.flapSound = this.game.add.audio('flap');

	  this.animations.add('flap');
	  this.animations.play('flap', 12, true);

	  this.alive = false;

	  this.game.physics.arcade.enableBody(this);
	  this.body.allowGravity = false;

	  this.checkWorldBounds = true;
	  this.outOfBoundsKill = true;
	};

	Bird.prototype = Object.create(Phaser.Sprite.prototype);
	Bird.prototype.constructor = Bird;

	Bird.prototype.update = function () {
	  // check to see if our angle is less than 90
	  // if it is, rotate the bird towards the ground by 2.5 degrees
	  if (this.angle < 90 && this.alive) {
	    this.angle += 2.5;
	  }
	};

	Bird.prototype.flap = function () {
	  this.flapSound.play();
	  // cause our bird to "jump" upward
	  this.body.velocity.y = -400;

	  // rotate the bird to -40 degrees
	  this.game.add.tween(this).to({ angle: -40 }, 100).start();
	};

	module.exports = Bird;

/***/ },
/* 6 */
/***/ function(module, exports) {

	'use strict';

	var Ground = function Ground(game, x, y, width, height, frame) {
	  Phaser.TileSprite.call(this, game, x, y, width, height, 'ground', frame);
	  this.autoScroll(-200, 0);

	  // enable physics on the ground sprite
	  // this is needed for collision detection
	  this.game.physics.arcade.enableBody(this);

	  // we don't want the ground's body
	  // to be affected by gravity
	  this.body.allowGravity = false;

	  // don't move even after collision
	  this.body.immovable = true;
	};

	Ground.prototype = Object.create(Phaser.TileSprite.prototype);
	Ground.prototype.constructor = Ground;

	Ground.prototype.update = function () {

	  // write your prefab's specific update code here

	};

	module.exports = Ground;

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Pipe = __webpack_require__(8);

	var PipeGroup = function PipeGroup(game, parent) {
	  Phaser.Group.call(this, game, parent);

	  this.topPipe = new Pipe(this.game, 0, 0, 0);
	  this.add(this.topPipe);

	  this.bottomPipe = new Pipe(this.game, 0, 440, 1);
	  this.add(this.bottomPipe);

	  this.hasScored = false;

	  // this.topPipe.body.velocity.x = -200;
	  // this.bottomPipe.body.velocity.x = -200;
	  this.setAll('body.velocity.x', -200);
	};

	PipeGroup.prototype = Object.create(Phaser.Group.prototype);
	PipeGroup.prototype.constructor = PipeGroup;

	PipeGroup.prototype.reset = function (x, y) {
	  this.topPipe.reset(0, 0);
	  this.bottomPipe.reset(0, 440);

	  this.x = x;
	  this.y = y;

	  this.setAll('body.velocity.x', -200);

	  this.hasScored = false;

	  this.exists = true;
	};

	PipeGroup.prototype.checkWorldBounds = function () {
	  if (!this.topPipe.inWorld) {
	    this.exists = false;
	  }
	};

	PipeGroup.prototype.update = function () {
	  this.checkWorldBounds();
	};

	module.exports = PipeGroup;

/***/ },
/* 8 */
/***/ function(module, exports) {

	'use strict';

	var Pipe = function Pipe(game, x, y, frame) {
	  Phaser.Sprite.call(this, game, x, y, 'pipe', frame);

	  this.anchor.setTo(0.5, 0.5);
	  this.game.physics.arcade.enableBody(this);

	  this.body.allowGravity = false;
	  this.body.immovable = true;
	};

	Pipe.prototype = Object.create(Phaser.Sprite.prototype);
	Pipe.prototype.constructor = Pipe;

	Pipe.prototype.update = function () {};

	module.exports = Pipe;

/***/ },
/* 9 */
/***/ function(module, exports) {

	'use strict';

	var Scoreboard = function Scoreboard(game) {
	  Phaser.Group.call(this, game);

	  this.gameover = this.create(this.game.width / 2, 100, 'gameover');
	  this.gameover.anchor.setTo(0.5, 0.5);

	  this.scoreboard = this.create(this.game.width / 2, 200, 'scoreboard');
	  this.scoreboard.anchor.setTo(0.5, 0.5);

	  this.scoreText = this.game.add.bitmapText(this.scoreboard.width, 180, 'flappyfont', '', 18);
	  this.add(this.scoreText);

	  this.bestScoreText = this.game.add.bitmapText(this.scoreboard.width, 230, 'flappyfont', '', 18);
	  this.add(this.bestScoreText);

	  // add our start button with a callback
	  this.startButton = this.game.add.button(this.game.width / 2, 300, 'startButton', this.startClick, this);
	  this.startButton.anchor.setTo(0.5, 0.5);

	  this.add(this.startButton);

	  this.y = this.game.height;
	  this.x = 0;
	};

	Scoreboard.prototype = Object.create(Phaser.Group.prototype);
	Scoreboard.prototype.constructor = Scoreboard;

	Scoreboard.prototype.show = function (score) {
	  var medal, bestScore;

	  // Step 1
	  this.scoreText.setText(score.toString());

	  if (!!localStorage) {
	    // Step 2
	    bestScore = localStorage.getItem('bestScore');

	    // Step 3
	    if (!bestScore || bestScore < score) {
	      bestScore = score;
	      localStorage.setItem('bestScore', bestScore);
	    }
	  } else {
	    // Fallback. LocalStorage isn't available
	    bestScore = 'N/A';
	  }

	  // Step 4
	  this.bestScoreText.setText(bestScore.toString());

	  // Step 5 & 6
	  if (score >= 10 && score < 20) {
	    medal = this.game.add.sprite(-65, 7, 'medals', 1);
	    medal.anchor.setTo(0.5, 0.5);
	    this.scoreboard.addChild(medal);
	  } else if (score >= 20) {
	    medal = this.game.add.sprite(-65, 7, 'medals', 0);
	    medal.anchor.setTo(0.5, 0.5);
	    this.scoreboard.addChild(medal);
	  }

	  // Step 7
	  if (medal) {

	    var emitter = this.game.add.emitter(medal.x, medal.y, 400);
	    this.scoreboard.addChild(emitter);
	    emitter.width = medal.width;
	    emitter.height = medal.height;

	    emitter.makeParticles('particle');

	    emitter.setRotation(-100, 100);
	    emitter.setXSpeed(0, 0);
	    emitter.setYSpeed(0, 0);
	    emitter.minParticleScale = 0.25;
	    emitter.maxParticleScale = 0.5;
	    emitter.setAll('body.allowGravity', false);

	    emitter.start(false, 1000, 1000);
	  }
	  this.game.add.tween(this).to({ y: 0 }, 1000, Phaser.Easing.Bounce.Out, true);
	};

	Scoreboard.prototype.startClick = function () {
	  this.game.state.start('play');
	};

	module.exports = Scoreboard;

/***/ },
/* 10 */
/***/ function(module, exports) {

	'use strict';

	function Preload() {
	  this.asset = null;
	  this.ready = false;
	}

	Preload.prototype = {
	  preload: function preload() {
	    this.asset = this.game.add.sprite(this.width / 2, this.height / 2, 'preloader');
	    this.asset.anchor.setTo(0.5, 0.5);

	    this.load.onLoadComplete.addOnce(this.onLoadComplete, this);
	    this.load.setPreloadSprite(this.asset);

	    //this.load.image('yeoman', 'assets/yeoman-logo.png');
	    this.load.image('background', 'assets/background.png');
	    this.load.image('ground', 'assets/ground.png');
	    this.load.image('title', 'assets/title.png');
	    this.load.image('startButton', 'assets/start-button.png');
	    this.load.image('instructions', 'assets/instructions.png');
	    this.load.image('getReady', 'assets/get-ready.png');
	    this.load.image('scoreboard', 'assets/scoreboard.png');
	    this.load.image('gameover', 'assets/gameover.png');
	    this.load.image('particle', 'assets/particle.png');

	    this.load.spritesheet('bird', 'assets/bird.png', 34, 24, 3);
	    this.load.spritesheet('pipe', 'assets/pipes.png', 54, 320, 2);
	    this.load.spritesheet('medals', 'assets/medals.png', 44, 46, 2);

	    this.load.bitmapFont('flappyfont', 'assets/fonts/flappyfont/flappyfont.png', 'assets/fonts/flappyfont/flappyfont.fnt');

	    this.load.audio('score', 'assets/score.wav');
	    this.load.audio('flap', 'assets/flap.wav');
	    this.load.audio('pipeHit', 'assets/pipe-hit.wav');
	    this.load.audio('groundHit', 'assets/ground-hit.wav');
	  },
	  create: function create() {
	    this.asset.cropEnabled = false;
	  },
	  update: function update() {
	    if (!!this.ready) {
	      this.game.state.start('play');
	    }
	  },
	  onLoadComplete: function onLoadComplete() {
	    this.ready = true;
	  }
	};

	module.exports = Preload;

/***/ }
/******/ ]);
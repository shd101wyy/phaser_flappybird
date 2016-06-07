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
	  var game = new Phaser.Game(288, 505, Phaser.AUTO, 'flappy_bird');

	  // Game States
	  game.state.add('boot', __webpack_require__(1));
	  game.state.add('gameover', __webpack_require__(2));
	  game.state.add('menu', __webpack_require__(3));
	  game.state.add('play', __webpack_require__(4));
	  game.state.add('preload', __webpack_require__(7));

	  game.state.start('boot');
	};

/***/ },
/* 1 */
/***/ function(module, exports) {

	
	'use strict';

	function Boot() {}

	Boot.prototype = {
	  preload: function () {
	    this.load.image('preloader', 'assets/preloader.gif');
	  },
	  create: function () {
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
	  preload: function () {},
	  create: function () {
	    var style = { font: '65px Arial', fill: '#ffffff', align: 'center' };
	    this.titleText = this.game.add.text(this.game.world.centerX, 100, 'Game Over!', style);
	    this.titleText.anchor.setTo(0.5, 0.5);

	    this.congratsText = this.game.add.text(this.game.world.centerX, 200, 'You Win!', { font: '32px Arial', fill: '#ffffff', align: 'center' });
	    this.congratsText.anchor.setTo(0.5, 0.5);

	    this.instructionText = this.game.add.text(this.game.world.centerX, 300, 'Click To Play Again', { font: '16px Arial', fill: '#ffffff', align: 'center' });
	    this.instructionText.anchor.setTo(0.5, 0.5);
	  },
	  update: function () {
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
	  preload: function () {},
	  create: function () {
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
	  startClick: function () {
	    this.game.state.start('play');
	  },
	  update: function () {}
	};

	module.exports = Menu;

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	let Bird = __webpack_require__(5);
	let Ground = __webpack_require__(6);

	function Play() {}

	Play.prototype = {
	  create: function () {
	    this.game.physics.startSystem(Phaser.Physics.ARCADE);
	    this.game.physics.arcade.gravity.y = 500;

	    this.background = this.game.add.sprite(0, 0, 'background');

	    // create a new Bird object
	    this.bird = new Bird(this.game, 100, this.game.height / 2);
	    // and add it to the game
	    this.game.add.existing(this.bird);

	    // create and add a new Ground object
	    this.ground = new Ground(this.game, 0, 400, 335, 112);
	    this.game.add.existing(this.ground);
	  },
	  update: function () {
	    this.game.physics.arcade.collide(this.bird, this.ground);
	  }
	};

	module.exports = Play;

/***/ },
/* 5 */
/***/ function(module, exports) {

	'use strict';

	let Bird = function (game, x, y, frame) {
	  Phaser.Sprite.call(this, game, x, y, 'bird', frame);

	  this.anchor.setTo(0.5, 0.5);

	  this.animations.add('flap');
	  this.animations.play('flap', 12, true);

	  this.game.physics.arcade.enableBody(this);
	};

	Bird.prototype = Object.create(Phaser.Sprite.prototype);
	Bird.prototype.constructor = Bird;

	Bird.prototype.update = function () {

	  // write your prefab's specific update code here

	};

	module.exports = Bird;

/***/ },
/* 6 */
/***/ function(module, exports) {

	'use strict';

	let Ground = function (game, x, y, width, height, frame) {
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
/***/ function(module, exports) {

	'use strict';

	function Preload() {
	  this.asset = null;
	  this.ready = false;
	}

	Preload.prototype = {
	  preload: function () {
	    this.asset = this.add.sprite(this.width / 2, this.height / 2, 'preloader');
	    this.asset.anchor.setTo(0.5, 0.5);

	    this.load.onLoadComplete.addOnce(this.onLoadComplete, this);
	    this.load.setPreloadSprite(this.asset);

	    //this.load.image('yeoman', 'assets/yeoman-logo.png');
	    this.load.image('background', 'assets/background.png');
	    this.load.image('ground', 'assets/ground.png');
	    this.load.image('title', 'assets/title.png');
	    this.load.image('startButton', 'assets/start-button.png');
	    this.load.spritesheet('bird', 'assets/bird.png', 34, 24, 3);
	  },
	  create: function () {
	    this.asset.cropEnabled = false;
	  },
	  update: function () {
	    if (!!this.ready) {
	      this.game.state.start('play');
	    }
	  },
	  onLoadComplete: function () {
	    this.ready = true;
	  }
	};

	module.exports = Preload;

/***/ }
/******/ ]);
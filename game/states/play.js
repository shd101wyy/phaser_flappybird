'use strict'

let Bird = require('../prefabs/bird')
let Ground = require('../prefabs/ground')
let PipeGroup = require('../prefabs/pipeGroup')
let Scoreboard = require('../prefabs/scoreboard')

function Play() {}

Play.prototype = {
  create: function() {
    this.game.physics.startSystem(Phaser.Physics.ARCADE)
    this.game.physics.arcade.gravity.y = 1200

    this.background = this.game.add.sprite(0, 0, 'background')

    // create a new Bird object
    this.bird = new Bird(this.game, 100, this.game.height/2)
    // and add it to the game
    this.game.add.existing(this.bird)

    // create and add a new Ground object
    this.ground = new Ground(this.game, 0, 400, 335, 112)
    this.game.add.existing(this.ground)

    // create and add a group to hold our pipeGroup prefabs
    this.pipes = this.game.add.group()

    // keep the spacebar from propagating up to the browser
    this.game.input.keyboard.addKeyCapture([Phaser.Keyboard.SPACEBAR])

    // add keyboard controls
    let flapKey = this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR)
    flapKey.onDown.addOnce(this.startGame, this)
    flapKey.onDown.add(this.bird.flap, this.bird)

    // add mouse/touch controls
    this.game.input.onDown.addOnce(this.startGame, this)
    this.game.input.onDown.add(this.bird.flap, this.bird)


    // instructions
    this.instructionGroup = this.game.add.group()
    this.instructionGroup.add(this.game.add.sprite(this.game.width/2, 100,'getReady'))
    this.instructionGroup.add(this.game.add.sprite(this.game.width/2, 325,'instructions'))
    this.instructionGroup.setAll('anchor.x', 0.5)
    this.instructionGroup.setAll('anchor.y', 0.5)

    this.score = 0

    this.scoreText = this.game.add.bitmapText(this.game.width/2, 10, 'flappyfont', this.score.toString(), 24)
    this.scoreText.visible = false

    this.scoreSound = this.game.add.audio('score')

  },
  update: function() {
    if (this.bird.alive) {
      this.game.physics.arcade.collide(this.bird, this.ground, this.deathHandler, null, this)

      this.pipes.forEach((pipeGroup)=> {
        this.checkScore(pipeGroup)
        this.game.physics.arcade.collide(this.bird, pipeGroup, this.deathHandler, null, this)
      })
    }
  },
  checkScore: function(pipeGroup) {
    if (pipeGroup.exists && !pipeGroup.hasScored && pipeGroup.topPipe.world.x <= this.bird.world.x) {
      pipeGroup.hasScored = true
      this.score += 1
      this.scoreText.setText(this.score.toString())
      this.scoreSound.play()
    }

  },
  startGame: function() {
    this.bird.body.allowGravity = true
    this.bird.alive = true

    this.score = 0

    // add a timer
    // add a timer
    this.pipeGenerator = this.game.time.events.loop(Phaser.Timer.SECOND * 1.25, this.generatePipes, this)
    this.pipeGenerator.timer.start()

    this.instructionGroup.destroy()
    this.scoreText.visible = true
  },
  generatePipes: function() {
    let pipeY = this.game.rnd.integerInRange(-100, 100)
    let pipeGroup = this.pipes.getFirstExists(false)
    if (!pipeGroup) {
      pipeGroup = new PipeGroup(this.game, this.pipes)
    }
    pipeGroup.reset(this.game.width + pipeGroup.width/2, pipeY);

    //pipeGroup.x = this.game.width
    //pipeGroup.y = pipeY
  },
  deathHandler: function() {
    console.log('game over')
    this.bird.alive = false
    this.pipes.callAll('stop')
    this.pipeGenerator.timer.stop()
    this.ground.stopScroll()
    this.scoreboard = new Scoreboard(this.game)
    this.game.add.existing(this.scoreboard)
    this.scoreboard.show(this.score)
  },
  shutdown: function() {
    this.game.input.keyboard.removeKey(Phaser.Keyboard.SPACEBAR)
    this.bird.destroy()
    this.pipes.destroy()
    this.scoreboard.destroy()
  }
}

module.exports = Play

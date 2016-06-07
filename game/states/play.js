'use strict'

let Bird = require('../prefabs/bird')
let Ground = require('../prefabs/ground')
let PipeGroup = require('../prefabs/pipeGroup')

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
    flapKey.onDown.add(this.bird.flap, this.bird)

    // add mouse/touch controls
    this.input.onDown.add(this.bird.flap, this.bird)

    // add a timer
    this.pipeGenerator = this.game.time.events.loop(Phaser.Timer.SECOND * 1.25, this.generatePipes, this)
    this.pipeGenerator.timer.start()

  },
  update: function() {
    this.game.physics.arcade.collide(this.bird, this.ground, this.deathHandler, null, this)

    this.pipes.forEach((pipeGroup)=> {
      this.game.physics.arcade.collide(this.bird, pipeGroup, this.deathHandler, null, this)
    })
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
    this.game.state.start('gameover')
  },
  shutdown: function() {
    this.game.input.keyboard.removeKey(Phaser.Keyboard.SPACEBAR)
    this.bird.destroy()
    this.pipes.destroy()
  }
}

module.exports = Play

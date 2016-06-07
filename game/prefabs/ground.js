'use strict'

let Ground = function(game, x, y, width, height, frame) {
  Phaser.TileSprite.call(this, game, x, y, width, height, 'ground', frame)
  this.autoScroll(-200, 0)

  // enable physics on the ground sprite
  // this is needed for collision detection
  this.game.physics.arcade.enableBody(this)

  // we don't want the ground's body
  // to be affected by gravity
  this.body.allowGravity = false

  // don't move even after collision
  this.body.immovable = true
}

Ground.prototype = Object.create(Phaser.TileSprite.prototype)
Ground.prototype.constructor = Ground

Ground.prototype.update = function() {

  // write your prefab's specific update code here

}

module.exports = Ground

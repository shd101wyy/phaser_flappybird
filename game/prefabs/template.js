'use strict'

let Prefab = function(game, x, y, frame) {
  Phaser.Sprite.call(this, game, x, y, 'prefab_name', frame)
}

Prefab.prototype = Object.create(Phaser.Sprite.prototype)
Prefab.prototype.constructor = Prefab

Prefab.prototype.update = function() {
}

module.exports = Prefab

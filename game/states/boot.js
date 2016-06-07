
'use strict'

function Boot() {
}

Boot.prototype = {
  preload: function() {
    this.load.image('preloader', 'assets/preloader.gif')
  },
  create: function() {
    // If this is not a desktop (so it's a mobile device)
    if (this.game.device.desktop == false) {
        // Set the scaling mode to SHOW_ALL to show all the game
        this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

        // Set a minimum and maximum size for the game
        // Here the minimum is half the game size
        // And the maximum is the original game size
        this.game.scale.setMinMax(this.game.width/2, this.game.height/2,
            this.game.width, this.game.height);
    }

    // Center the game horizontally and vertically
    this.game.scale.pageAlignHorizontally = true
    this.game.scale.pageAlignVertically = true

    this.game.input.maxPointers = 1
    this.game.state.start('preload')
  }
}

module.exports = Boot

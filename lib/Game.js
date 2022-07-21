const inq = require('inquirer');
const Player = require('./Player');
const Enemy = require('./Enemy');
const inquirer = require('inquirer');

// Game object constructor
function Game() {
    this.roundNumber = 0;
    this.isPlayerTurn = false;
    this.enemies = [];
    this.currentEnemy;
    this.player;
};

// Game object initialization method
Game.prototype.initializeGame = function() {
    // populate enemies array
    this.enemies.push(new Enemy('goblin', 'axe'));
    this.enemies.push(new Enemy('orc', 'club'));
    this.enemies.push(new Enemy('skeleton', 'sword'));

    // set starting enemy
    this.currentEnemy = this.enemies[0];

    inquirer.prompt({
        type: 'text',
        name: 'name',
        message: 'Enter a name for your character:'
    }).then(({name}) => {
        this.player = new Player(name);

        // start a battle
        this.startNewBattle();
    });
};

module.exports = Game;

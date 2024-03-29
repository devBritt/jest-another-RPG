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

Game.prototype.startNewBattle = function() {
    // determine if player or enemy moves first
    if (this.player.agility > this.currentEnemy.agility) {
        this.isPlayerTurn = true;
    } else {
        this.isPlayerTurn = false;
    };

    // display stats and enemy description
    console.log(this.player.name + "'s stats:");
    console.table(this.player.getStats());
    console.log(this.currentEnemy.getDescription());

    this.battle();
};

Game.prototype.battle = function() {
    // run attack sequence
    if (this.isPlayerTurn) {
        // ask player what they would like to do
        inquirer.prompt({
            type: 'list',
            message: 'What would you like to do?',
            name: 'action',
            choices: ['Attack', 'Use potion']
        })
        .then(({ action }) => {
            if (action === 'Use potion') {
                if (!this.player.getInventory()) {
                    console.log("You don't have any potions!");
                    return this.checkEndOfBattle;
                }

                // ask which potion to use
                inquirer.prompt({
                    type: 'list',
                    message: 'Which potion would you like to use?',
                    name: 'action',
                    choices: this.player.getInventory().map((item, index) => `${index + 1}: ${item.name}`)})
                    .then(({ action }) => {
                        const potionDetails = action.split(': ');

                        this.player.usePotion(potionDetails[0] - 1);
                        console.log(`${this.player.name} used a ${potionDetails[1]} potion.`);

                        this.checkEndOfBattle();
                    });
            } else {
                const damage = this.player.getAttackValue();
                this.currentEnemy.reduceHealth(damage);

                console.log(`${this.player.name} attacked the ${this.currentEnemy.name}`);
                console.log(this.currentEnemy.name + "'s health:", this.currentEnemy.getHealth());

                this.checkEndOfBattle();
            };
        });
    } else {
        const damage = this.currentEnemy.getAttackValue();
        this.player.reduceHealth(damage);

        console.log(`${this.player.name} was attacked by the ${this.currentEnemy.name}!`);
        console.log(`${this.player.name}'s health:`, this.player.getHealth());

        this.checkEndOfBattle();
    };
};

Game.prototype.checkEndOfBattle = function() {
    if (this.player.isAlive() && this.currentEnemy.isAlive()) {
        this.isPlayerTurn = !this.isPlayerTurn;
        this.battle();
    } else if (this.player.isAlive() && !this.currentEnemy.isAlive()) {
        console.log(`${this.player.name} defeated the ${this.currentEnemy.name}`);

        // add enemy potion to inventory
        this.player.addPotion(this.currentEnemy.potion);
        console.log(`${this.player.name} found a ${this.currentEnemy.potion.name} potion`);
        
        this.roundNumber++;

        // check for game end
        if (this.roundNumber < this.enemies.length) {
            this.currentEnemy = this.enemies[this.roundNumber];
            this.startNewBattle();
        } else {
            console.log(`${this.player.name} defeated every enemy. Game YOU WIN!!!`);
        }
    } else {
        console.log(`${this.player.name} was defeated. Game over...`);
    }
};

module.exports = Game;

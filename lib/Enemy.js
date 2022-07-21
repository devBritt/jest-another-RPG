const Character = require('./Character.js');
const Potion = require('./Potion');

class Enemy extends Character {
    constructor(name, weapon) {
        // call parent constructor
        super(name);

        this.weapon = weapon;
        this.potion = new Potion();
    };

    getDescription() {
        return `A ${this.name} holding a ${this.weapon} has appeared!`;
    };
};


module.exports = Enemy;
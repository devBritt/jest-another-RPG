const Player = require('../lib/Player');
const Potion = require('../__mocks__/Potion');

jest.mock('../lib/Potion');

test('creates a player object', () => {
    const player = new Player('Meira');

    expect(player.name).toBe('Meira');
    expect(player.health).toEqual(expect.any(Number));
    expect(player.agility).toEqual(expect.any(Number));
    expect(player.inventory).toEqual(
        expect.arrayContaining([expect.any(Object)])
    );
});
"use strict";
import DavGame from './game.js';

const data = {
    target: '#game',
    spawnPosition: {
        x: 2,
        y: 2
    }
}

const game = new DavGame( data );
console.log(game);

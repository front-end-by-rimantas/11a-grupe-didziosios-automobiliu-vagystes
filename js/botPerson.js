import Person from './person.js';

class BotPerson extends Person {
    constructor( DOM, index, hair, clothes ) {
        super( DOM, index, hair, clothes );
        this.speed = 100;
        // this.speed = 0;
        this.directionCorrection = 90;
        this.direction = Math.floor(Math.random() * 4) * 90 - this.directionCorrection;
        this.keyboard = {
            up: false,
            right: false,
            down: false,
            left: false
        }
    }

    changeDirection () {
        this.direction += Math.floor(Math.random() * 2) * 180 - this.directionCorrection;
        this.DOM.style.transform = `translate(-50%, -50%) rotate(${this.direction}deg);`;
    }

    move = ( dt ) => {
        const { x, y } = this.nextPosition( dt );
        this.x = x;
        this.y = y;

         this.DOM.style.left = this.x + 'px';
         this.DOM.style.top = this.y + 'px';
    }
}

export default BotPerson;
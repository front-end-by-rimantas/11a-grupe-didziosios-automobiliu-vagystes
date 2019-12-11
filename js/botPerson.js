import Person from './person.js';

class BotPerson extends Person {
    constructor( DOM, index, hair, clothes ) {
        super( DOM, index, hair, clothes );
        this.speed = 20;
        this.direction = Math.random() * 360;
        this.directionCorrection = 90;
        // timeChangeDirection
        this.tcd = {
            min: 3,
            max: 10,
            current: 5,
            last: 0
        }
        this.keyboard = {
            up: false,
            right: false,
            down: false,
            left: false
        }
    }

    changeDirection ( dt ) {
        this.tcd.last += dt;
        if ( this.tcd.last >= this.tcd.current ) {
            this.tcd.last = 0;
            this.direction = Math.random() * 360;
            this.tcd.current = Math.random() * (this.tcd.max - this.tcd.min) + this.tcd.min;
        }
    }

    move = ( dt ) => {
        this.changeDirection( dt );

        const { x, y } = this.nextPosition( dt );
        this.x = x;
        this.y = y;

         this.DOM.style.left = this.x + 'px';
         this.DOM.style.top = this.y + 'px';
    }
}

export default BotPerson;
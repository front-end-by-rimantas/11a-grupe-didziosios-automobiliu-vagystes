import Person from './person.js';

class PlayerPerson extends Person {
    constructor ( DOM, index, x, y, hair, clothes ) {
        super( DOM, index, x, y, hair, clothes );
        this.directionCorrection = -90;
        this.collisionDistance = 0;

        this.initEventListeners();
    }

    initEventListeners () {
        window.addEventListener('keydown', (e) => {
            switch (e.keyCode) {
                case 38:
                case 87:
                    this.keyboard.up = true;
                    break;
            
                case 39:
                case 68:
                    this.keyboard.right = true;
                    break;
            
                case 40:
                case 83:
                    this.keyboard.down = true;
                    break;
        
                case 37:
                case 65:
                    this.keyboard.left = true;
                    break;
                default:
                    break;
            }
        })

        window.addEventListener('keyup', (e) => {
            switch (e.keyCode) {
                case 38:
                case 87:
                    this.keyboard.up = false;
                    break;
            
                case 39:
                case 68:
                    this.keyboard.right = false;
                    break;
            
                case 40:
                case 83:
                    this.keyboard.down = false;
                    break;
        
                case 37:
                case 65:
                    this.keyboard.left = false;
                    break;
                default:
                    break;
            }
        })
    }
}

export default PlayerPerson;
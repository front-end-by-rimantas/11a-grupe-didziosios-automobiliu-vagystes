class PlayerPerson {
    constructor ( DOM, hair, clothes ) {
        this.DOM;
        this.DOMmap;
        this.width = 52;                        // px
        this.height = 36;                       // px
        this.life = Infinity;
        this.x = 1500;                             // px
        this.y = 600;                             // px
        this.direction = 0;                     // deg
        this.hairColor = hair || this.randomHairColor();
        this.clothesColor = clothes || this.randomClothesColor();
        this.keyboard = {
            up: false,
            right: false,
            down: false,
            left: false
        }

        this.render( DOM );
    }

    randomHairColor() {
        const colors = ['black', 'blonde', 'brown'];
        return colors[ Math.floor(Math.random() * colors.length) ];
    }

    randomClothesColor() {
        const colors = ['blue', 'red', 'green', 'white'];
        return colors[ Math.floor(Math.random() * colors.length) ];
    }

    render( DOM ) {
        const HTML = `<img id="person"
                        class="person player"
                        src="./img/characters/character_${this.hairColor}_${this.clothesColor}.png">`;
        DOM.insertAdjacentHTML('beforeend', HTML);
        this.DOM = DOM.querySelector('#person');

        // zmogeliuko pozicija reletyviai sugeneruotam zemelapiui

        this.DOMmap = DOM.querySelector('.map');
        const DOMstyle = getComputedStyle(this.DOMmap);
        this.x = -parseFloat(DOMstyle.width) / 2;
        this.y = -parseFloat(DOMstyle.height) / 2;

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

        return;
    }

    move = () => {
        this.x += 1;
        this.y += 1;
        this.DOMmap.style.left = this.x + 'px';
        this.DOMmap.style.top = this.y + 'px';
    }
}

export default PlayerPerson;
class PlayerPerson {
    constructor ( DOM, hair, clothes ) {
        this.DOM;
        this.DOMmap;
        this.width = 52;                            // px
        this.height = 36;                           // px
        this.life = Infinity;
        this.x = 0;                              // px - pozicijos koordinates
        this.y = 0;                               // px - pozicijos koordinates
        this.speed = 0;                             // 0px/s - pradinis ejimo greitis
        this.maxSpeed = 1000;                         // 50px/s - maksimalus greitis
        this.accelaration = 100;                    // 100px/s - pagreitis
        this.direction = 0;                         // deg - pasisukimo kampas
        this.rotationSpeed = 180;                   // deg/s - sukimosi kampinis greitis
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

        console.log(DOMstyle.width, window.innerWidth);
        

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

    nextPosition = ( dt ) => {
        let nextX = 0;
        let nextY = 0;

        if ( this.keyboard.up ) {
            this.speed += this.accelaration * dt;
        }
        if ( this.keyboard.down ) {
            this.speed -= this.accelaration * dt;
        }
        if ( this.keyboard.left ) {
            this.direction -= this.rotationSpeed * dt;
        }
        if ( this.keyboard.right ) {
            this.direction += this.rotationSpeed * dt;
        }

        // kad nevirsyti max greicio
        if ( this.speed > this.maxSpeed ) this.speed = this.maxSpeed;
        if ( this.speed < 0 ) this.speed = 0;

        // trigonometrija judejimo pozicijai skaiciuoti
        const radians = (this.direction - 90) * Math.PI / 180;
        nextX += this.x + this.speed * Math.cos( radians ) * dt;
        nextY += this.y + this.speed * Math.sin( radians ) * dt;

        return { x: nextX, y: nextY };
    }

    move = ( dt ) => {
        // const np = this.nextPosition( dt );
        // const x = np.x;
        // const y = np.y;
        const { x, y } = this.nextPosition( dt );
        this.x = x;
        this.y = y;

        this.DOM.style.transform = `translate(-50%, -50%) rotate(${this.direction}deg)`;
        this.DOMmap.style.left = this.x + (window.innerWidth / 2) + 'px';
        this.DOMmap.style.top = this.y + (window.innerHeight / 2) + 'px';
    }
}

export default PlayerPerson;
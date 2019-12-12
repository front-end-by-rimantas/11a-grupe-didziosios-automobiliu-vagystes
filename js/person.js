class Person {
    constructor ( DOM, index, x, y, hair, clothes ) {
        this.DOM;
        this.index = index;
        this.DOMmap;
        this.width = 52;                            // px
        this.height = 36;                           // px
        this.life = Infinity;
        this.x = x;                              // px - pozicijos koordinates
        this.y = y;                               // px - pozicijos koordinates
        this.speed = 0;                             // 0px/s - pradinis ejimo greitis
        this.maxSpeed = 300;                         // 50px/s - maksimalus greitis
        this.accelaration = 100;                    // 100px/s - pagreitis
        this.direction = 0;                         // deg - pasisukimo kampas
        this.directionCorrection = 0;
        this.rotationSpeed = 180;                   // deg/s - sukimosi kampinis greitis
        this.hairColor = hair || this.randomHairColor();
        this.clothesColor = clothes || this.randomClothesColor();
        this.keyboard = {
            up: false,
            right: false,
            down: false,
            left: false
        },
        this.collisionDistance = Math.random() * 30;

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
        let HTML = '';
        // zaidejo zmogeliuka iklijuojame vienur
        if ( this.index === 1 ) {
            HTML = `<img id="person${this.index}"
                            class="person ${this.index === 1 ? 'player' : ''}"
                            src="./img/characters/character_${this.hairColor}_${this.clothesColor}.png">`;
            DOM.insertAdjacentHTML('beforeend', HTML);
        } else {
            // bot'u zmogeliukus iklijuojame kitur
            HTML = `<img id="person${this.index}"
                        class="person ${this.index === 1 ? 'player' : ''}"
                        src="./img/characters/character_${this.hairColor}_${this.clothesColor}.png"
                        style="top: ${this.y}px;
                                left: ${this.x}px;">`;
            DOM.querySelector('.map').insertAdjacentHTML('beforeend', HTML);
        }
        this.DOM = DOM.querySelector('#person'+this.index);

        // zmogeliuko pozicija reletyviai sugeneruotam zemelapiui
        this.DOMmap = DOM.querySelector('.map');
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
        const radians = (this.direction + this.directionCorrection) * Math.PI / 180;
        nextX += this.x + this.speed * Math.cos( radians ) * dt - this.collisionDistance * Math.cos( radians ) * dt;
        nextY += this.y + this.speed * Math.sin( radians ) * dt - this.collisionDistance * Math.sin( radians ) * dt;

        return { x: nextX, y: nextY };
    }

    rotate = ( dt ) => {
        this.DOM.style.transform = `translate(-50%, -50%) rotate(${this.direction}deg)`;
    }

    move = ( dt ) => {
        // const np = this.nextPosition( dt );
        // const x = np.x;
        // const y = np.y;
        const { x, y } = this.nextPosition( dt );
        this.x = x;
        this.y = y;

        this.DOMmap.style.left = this.x + (window.innerWidth / 2) + 'px';
        this.DOMmap.style.top = this.y + (window.innerHeight / 2) + 'px';
    }
}

export default Person;
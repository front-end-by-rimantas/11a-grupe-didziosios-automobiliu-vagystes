class Person {
    constructor ( x, y, angle, hair, clothes ) {
        this.width = 52;                        // px
        this.height = 36;                       // px
        this.life = 1;
        this.x = x;                             // px
        this.y = y;                             // px
        this.direction = angle;                 // deg
        this.hairColor = hair || this.randomHairColor();
        this.ClothesColor = clothes || this.randomClothesColor();
    }

    randomHairColor() {
        const colors = ['black', 'blonde', 'brown'];
        return colors[ Math.floor(Math.random() * colors.length) ];
    }

    randomClothesColor() {
        const colors = ['blue', 'red', 'green', 'white'];
        return colors[ Math.floor(Math.random() * colors.length) ];
    }
}

export default Person;
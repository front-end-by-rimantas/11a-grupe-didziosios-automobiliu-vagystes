import PlayerPerson from './playerPerson.js';

class DavGame {
    constructor ( data ) {
        this.GAME;
        this.DOM = document.querySelector(data.target);
        this.player;
        this.playerCar;
        this.selected = 'person';      // 'person' || 'car'
        this.playerSection = {
            x: data.spawnPosition.x || 2,
            y: data.spawnPosition.y || 2
        }

        this.init();
    }

    init() {
        this.DOM.innerHTML = `
            <div class="zoom">
                <div class="map">
                    ${this.renderMap()}
                </div>
            </div>`;
        this.DOM.classList.add('dav');

        this.player = new PlayerPerson( this.DOM, 'black', 'blue' );

        // uzkurti zaidimo varykli
        this.GAME = window.requestAnimationFrame(() => {
            this.gameStep();
        })
    }

    gameStep() {
        // pajudiname zaidejo masina ar zmogeliuka (juda zemelapis)
        this.player.move();
        // priklausomai nuo posukiu, pasukame masina
        // tikriname, ar:
            // - masina neatsitrenke i pastata
            // - neatsitrenke i kita masina (abi sustoja)
            // - ispradiu kitos masinos nejuda
                // - pajudiname kitas masinas
                // - kitos masinos nepadare avarijos (abi sustoja)
            // - pajudiname zmogeliukus, bet tik ant saligatvio
            // - ar mano masina nenetrenke zmogeliuko (jis mirsta, be kraujo ir tiesiog dingsta)
            // - jei zmogeliuku yra maziau nei [KIEKIS], tai jie random laiko intervalais vis atsiranda random vietoje
        
        // kartojame zaidimo perpiesimus
        window.requestAnimationFrame(() => {
            this.gameStep();
        })
    }

    renderMap() {
        return 'ZEMELAPIS + REIKIAMOS SEKCIJOS';
    }
}

export default DavGame;
import PlayerPerson from './playerPerson.js';
import mapData from './data/map.js';

class DavGame {
    constructor ( data ) {
        this.time = 0;
        this.GAME;
        this.MAP;
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
        this.time = Date.now();
        this.DOM.innerHTML = `
            <div class="zoom">
                <div class="map">
                    ${this.renderMap()}
                </div>
            </div>`;
        this.DOM.classList.add('dav');

        this.updateMapWithSidewalks();

        this.player = new PlayerPerson( this.DOM, 'black', 'blue' );

        // uzkurti zaidimo varykli
        this.GAME = window.requestAnimationFrame(() => {
            this.gameStep();
        })
    }

    gameStep() {
        const now = Date.now();
        const dt = (now - this.time) / 1000;
        this.time = now;
        
        // pajudiname zaidejo masina ar zmogeliuka (juda zemelapis)
        this.player.move( dt );
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

    updateMapWithSidewalks() {
        this.MAP = mapData;
    }

    renderMap() {
        console.log(this.MAP);
        
        return 'ZEMELAPIS + REIKIAMOS SEKCIJOS';
    }
}

export default DavGame;
import PlayerPerson from './playerPerson.js';
import mapData from './data/map.js';

class DavGame {
    constructor ( data ) {
        this.time = 0;
        this.GAME;
        this.MAP;
        this.DOM = document.querySelector(data.target);
        this.DOMmap;
        this.tileSize = 128;
        this.sectionTileCount = 20;
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
        this.updateMapWithSidewalks();

        this.DOM.innerHTML = `
            <div class="zoom">
                <div class="map" style="
                    width: ${3 * this.sectionTileCount * this.tileSize}px;
                    height: ${3 * this.sectionTileCount * this.tileSize}px;
                    top: ${-1.5 * this.sectionTileCount * this.tileSize}px;
                    left: ${-1.5 * this.sectionTileCount * this.tileSize}px;"></div>
                <pre class="popup"></pre>
            </div>`;
        this.DOM.classList.add('dav');
        this.DOMmap = this.DOM.querySelector('.map');

        this.renderMap();

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
            // isitikiname, jog galima pajudeti norima kryptimi
            this.player.rotate( dt );
            if ( this.isAllowedPosition( this.player.nextPosition( dt ) ) ) {
                this.player.move( dt );
            }
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

    isAllowedPosition ( position ) {
        const x = position.x
        const y = position.y;
        const xTile = Math.floor(-x / this.tileSize);
        const yTile = Math.floor(-y / this.tileSize);
        const xSection = Math.floor(xTile / this.sectionTileCount)
        const ySection = Math.floor(yTile / this.sectionTileCount)
        const p = {
            x,
            y,
            xt: xTile - xSection * this.sectionTileCount,
            yt: yTile - ySection * this.sectionTileCount,
            xs: xSection,
            ys: ySection
        }
        document.querySelector('pre.popup').textContent = JSON.stringify(p, null, 4)
        

        const tileType = this.MAP[ySection][xSection][yTile - ySection * this.sectionTileCount][xTile - xSection * this.sectionTileCount]; 
        if ( tileType === 1 || tileType === 2 ) {
            return true;
        }

        return false;
    }

    updateMapWithSidewalks() {
        this.MAP = mapData;
        for ( let sy=0; sy<this.MAP.length; sy++ ) {
            const sectionsRow = this.MAP[sy];
            for ( let sx=0; sx<sectionsRow.length; sx++ ) {
                const section = sectionsRow[sx];
                for ( let y=0; y<section.length; y++ ) {
                    const row = section[y];
                    for ( let x=0; x<row.length; x++ ) {
                        const tile = row[x];
                        // jei randame kelio tipa (value: 2), tai aplinkinius 0 -> 1
                        if ( tile === 2 ) {
                            for ( let dy=-1; dy<=1; dy++ ) {
                                if ( y+dy >= 0 && y+dy < section.length ) {
                                    for ( let dx=-1; dx<=1; dx++ ) {
                                        if ( x+dx >= 0 && x+dx < row.length ) {
                                            if ( section[y+dy][x+dx] !== 2 ) {
                                                section[y+dy][x+dx] = 1;
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    renderMap() {
        let HTML = '';
        const pathToTile = './img/tiles/';
        const roadTile = `asphalt-road/road_asphalt22.png"`;
        const sidewalkTile = `grass/land_grass04.png"`;
        const buildingTile = `sand/land_sand05.png"`;
        const tiles = [buildingTile, sidewalkTile, roadTile];

        const sectionSize = this.sectionTileCount * this.tileSize;
        
        for ( let sy=0; sy<this.MAP.length; sy++ ) {
            const sectionsRow = this.MAP[sy];
            for ( let sx=0; sx<sectionsRow.length; sx++ ) {
                const section = sectionsRow[sx];
                HTML += `<div class="sector"
                                style="width: ${sectionSize}px;
                                        height: ${sectionSize}px;
                                        top: ${sy * sectionSize}px;
                                        left: ${sx * sectionSize}px;">`;
                for ( let y=0; y<section.length; y++ ) {
                    const row = section[y];
                    for ( let x=0; x<row.length; x++ ) {
                        const tile = row[x];
                        HTML += `<img src="${pathToTile}${tiles[tile]}.png"
                                        style="top: ${y * this.tileSize}px;
                                                left: ${x * this.tileSize}px;">`;
                    }
                }
                HTML += '</div>';
            }
        }

        return this.DOMmap.innerHTML = HTML;
    }
}

export default DavGame;
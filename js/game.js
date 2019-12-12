import PlayerPerson from './playerPerson.js';
import BotPerson from './botPerson.js';
import mapData from './data/map.js';

class DavGame {
    constructor ( data ) {
        this.time = 0;
        this.GAME;
        this.MAP;
        this.DOM = document.querySelector(data.target);
        this.DOMmap;
        this.tileSize = 128;
        this.sectionTileCount = 10;
        this.botPersons = [];
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

        const DOMstyle = getComputedStyle(this.DOMmap);
        const personX = -parseFloat(DOMstyle.width) / 2;
        const personY = -parseFloat(DOMstyle.height) / 2;
        this.player = new PlayerPerson( this.DOM, 1, personX, personY, 'black', 'blue' );
        this.generateBotPersons(1000);

        // uzkurti zaidimo varykli
        this.GAME = window.requestAnimationFrame(() => {
            this.gameStep();
        })
    }

    generateBotPersons ( count ) {
        const DOMstyle = getComputedStyle(this.DOMmap);

        while ( this.botPersons.length < count ) {
            const personX = Math.floor(Math.random() * parseInt(DOMstyle.width));
            const personY = Math.floor(Math.random() * parseInt(DOMstyle.height));
            let xTile = Math.floor(personX / this.tileSize);        // 0 - 29       || 18
            let yTile = Math.floor(personY / this.tileSize);
            const xSector = Math.floor(xTile / this.sectionTileCount);  // 0 - 2    || 1
            const ySector = Math.floor(yTile / this.sectionTileCount);
            xTile -= xSector * this.sectionTileCount;               // 0 - 9    || 7
            yTile -= ySector * this.sectionTileCount;
            // if ( xSector > 2 || xSector < 0 ||
            //      ySector > 2 || ySector < 0 ) {
            //     console.log(personX, personY, xTile, yTile, xSector, ySector);
            // }
            
            // console.log('-');
            // console.log(ySector, xSector, yTile, xTile);
            // console.log(this.MAP[ySector]);
            // console.log(this.MAP[ySector][xSector]);
            // console.log(this.MAP[ySector][xSector][yTile]);
            
            // tikriname ar apskaiciuotose random coord yra saligatvis
            if ( this.MAP[ySector][xSector][yTile][xTile] === 1 ) {
                this.botPersons.push( new BotPerson( this.DOM, this.botPersons.length + 2, personX, personY ) );
            }
        }
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

        for ( let i=0; i<this.botPersons.length; i++ ) {
            const bot = this.botPersons[i];
            if ( this.isBotAllowedPosition( bot.nextPosition( dt ) ) ) {
                bot.move( dt );
            } else {
                bot.changeDirection();
                bot.rotate();
            }
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

    isBotAllowedPosition ( position ) {
        const x = position.x
        const y = position.y;
        let xTile = Math.floor(x / this.tileSize);
        let yTile = Math.floor(y / this.tileSize);
        const xSection = Math.floor(xTile / this.sectionTileCount);
        const ySection = Math.floor(yTile / this.sectionTileCount);
        xTile -= xSection * this.sectionTileCount;
        yTile -= ySection * this.sectionTileCount;
        const p = {
            x,
            y,
            xt: xTile - xSection * this.sectionTileCount,
            yt: yTile - ySection * this.sectionTileCount,
            xs: xSection,
            ys: ySection
        }
        
        if ( ySection < 0 || ySection > 2 ||
             xSection < 0 || xSection > 2 ||
             yTile < 0 || yTile > this.sectionTileCount - 1 ||
             xTile < 0 || xTile > this.sectionTileCount - 1 ) return false;
        
        // console.log(x, y, ySection, xSection, yTile, xTile);
        
        const tileType = this.MAP[ySection][xSection][yTile][xTile];
        if ( tileType === 1 ) {
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
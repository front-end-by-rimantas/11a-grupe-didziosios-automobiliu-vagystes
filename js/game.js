class DavGame {
    constructor ( data ) {
        this.DOM = document.querySelector(data.target);
        this.player;
        this.playerCar;
        this.selected = 'car';      // 'player' || 'car'
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
                <div class="car car-black-1"></div>
                <div class="person person-black-blue"></div>
            </div>`;
        this.DOM.classList.add('dav');

        // uzkurti zaidimo varykli
        // requestAnimationFrame()
    }

    renderMap() {
        return 'ZEMELAPIS + REIKIAMOS SEKCIJOS';
    }
}

export default DavGame;
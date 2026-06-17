class Level {
    constructor(canvas, ctx, matrix) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.matrix = matrix;

        this.mapHeight = this.matrix.length;
        this.mapWidth = this.matrix[0].length;

        this.canvasHeight = this.canvas.height;
        this.canvasWidth = this.canvas.width;

        this.tileHeight = parseInt(this.canvasHeight / this.mapHeight);
        this.tileWidth = parseInt(this.canvasWidth / this.mapWidth);
    }

    collition(x, y) {
        if (this.matrix[y][x] === 1) {
            return true;
        }
        return false;
    }

    mapGrid() {
        var tileSizeW = this.canvasWidth / this.mapWidth;
        var tileSizeH = this.canvasHeight / this.mapHeight;

        this.ctx.strokeStyle = "#ff0000";
        this.ctx.lineWidth = 1;

        for (let y = 0; y < this.canvasHeight; y += tileSizeH) {
            for (let x = 0; x < this.canvasWidth; x += tileSizeW) {
                this.ctx.strokeRect(x, y, tileSizeW, tileSizeH);
                this.ctx.stroke();
                
            }
        }
    }

    render() {
        var color;

        for (let y = 0; y < this.mapHeight; y++) {
            for (let x = 0; x < this.mapWidth; x++) {
                if (this.matrix[y][x] === 1) {
                    color = "#000000"; //Wall
                } else {
                    color = "#6f6f6f"; //Floor
                }
                this.ctx.fillStyle = color;
                this.ctx.fillRect(x * this.tileWidth, y * this.tileHeight, this.tileWidth, this.tileHeight);
            }
        }
        //this.mapGrid();
    }

}

export default Level;
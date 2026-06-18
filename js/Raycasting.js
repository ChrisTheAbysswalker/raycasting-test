class Raycasting {
    constructor(ctx, level, x, y, playerAngle, angleIncrement, column) {
        this.ctx = ctx;
        this.level = level;
        this.x = x;
        this.y = y;

        this.playerAngle = playerAngle;
        this.angleIncrement = angleIncrement;

        this.column = column;
        this.angleOffset = 0;

        this.wallHitX = 0;
        this.wallHitY = 0;
        this.wallHitXHorizontal = 0;
        this.wallHitXVertical = 0;
        this.wallHitYHorizontal = 0;
        this.wallHitYVertical = 0;
        this.distance
    }

    setAngle(angle) {
        this.playerAngle = this.normalizeAngle(angle + this.angleIncrement);
    }

    normalizeAngle(angle) {
        angle = angle % (2 * Math.PI);
        if (angle < 0) angle += 2 * Math.PI;
        return angle;
    }

    getDistance(x1, y1, x2, y2) {
        return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    }

    castRay() {
        const tileSize = 50;

        this.isLookingDown = this.playerAngle < Math.PI;
        this.isLookingLeft = this.playerAngle > Math.PI / 2 && this.playerAngle < 3 * Math.PI / 2;

        const tanAngle = Math.tan(this.playerAngle);

        if (Math.abs(tanAngle) < 0.000001) {
            this.wallHitX = this.x;
            this.wallHitY = this.y;
            return;
        }

        let horizontalCollition = false;

        let yH = Math.floor(this.y / tileSize) * tileSize;
        if (this.isLookingDown) yH += tileSize;

        let xH = this.x + (yH - this.y) / tanAngle;

        const yStepH = this.isLookingDown ? tileSize : -tileSize;
        const xStepH = yStepH / tanAngle;

        let nextXH = xH;
        let nextYH = this.isLookingDown ? yH : yH - 1;

        while (!horizontalCollition) {
            const tileX = Math.floor(nextXH / tileSize);
            const tileY = Math.floor(nextYH / tileSize);

            if (tileX < 0 || tileX >= this.level.mapWidth ||
                tileY < 0 || tileY >= this.level.mapHeight) {
                this.wallHitXHorizontal = nextXH;
                this.wallHitYHorizontal = nextYH;
                horizontalCollition = true;
                break;
            }

            if (this.level.collition(tileX, tileY)) {
                this.wallHitXHorizontal = nextXH;
                this.wallHitYHorizontal = nextYH;
                horizontalCollition = true;
            } else {
                nextXH += xStepH;
                nextYH += yStepH;
            }
        }

        let verticalCollition = false;

        let xV = Math.floor(this.x / tileSize) * tileSize;
        if (!this.isLookingLeft) xV += tileSize;

        let yV = this.y + (xV - this.x) * tanAngle;

        const xStepV = this.isLookingLeft ? -tileSize : tileSize;
        const yStepV = tileSize * tanAngle * (this.isLookingLeft ? -1 : 1);

        let nextXV = this.isLookingLeft ? xV - 1 : xV;
        let nextYV = yV;

        while (!verticalCollition) {
            const tileX = Math.floor(nextXV / tileSize);
            const tileY = Math.floor(nextYV / tileSize);

            if (tileX < 0 || tileX >= this.level.mapWidth ||
                tileY < 0 || tileY >= this.level.mapHeight) {
                this.wallHitXVertical = nextXV;
                this.wallHitYVertical = nextYV;
                verticalCollition = true;
                break;
            }

            if (this.level.collition(tileX, tileY)) {
                this.wallHitXVertical = nextXV;
                this.wallHitYVertical = nextYV;
                verticalCollition = true;
            } else {
                nextXV += xStepV;
                nextYV += yStepV;
            }
        }

        const distH = horizontalCollition
            ? this.getDistance(this.x, this.y, this.wallHitXHorizontal, this.wallHitYHorizontal)
            : Infinity;

        const distV = verticalCollition
            ? this.getDistance(this.x, this.y, this.wallHitXVertical, this.wallHitYVertical)
            : Infinity;

        if (distH < distV) {
            this.wallHitX = this.wallHitXHorizontal;
            this.wallHitY = this.wallHitYHorizontal;
            this.distance = distH;
            
        } else {
            this.wallHitX = this.wallHitXVertical;
            this.wallHitY = this.wallHitYVertical;
            this.distance = distV;
        }

        //this.distance = this.distance * Math.cos(this.playerAngle);

    }

    wallRender() {
        this.castRay();
        var columnHeight = this.ctx.canvas.height;
        var proyectionDistance = (this.ctx.canvas.width / 2) / Math.tan(30);
        var wallH = (columnHeight / this.distance) * proyectionDistance;

        var y0 = parseInt(this.ctx.canvas.height / 2) - parseInt(wallH / 2);
        var y1 = y0 + parseInt(wallH);

        var x = this.column;

        this.ctx.beginPath();
        this.ctx.moveTo(x, y0);
        this.ctx.lineTo(x, y1);
        this.ctx.strokeStyle = "#aeaeae";
        this.ctx.stroke();
    }

    render() {
        this.castRay();
        this.ctx.beginPath();
        this.ctx.moveTo(this.x, this.y);
        this.ctx.lineTo(this.wallHitX, this.wallHitY);
        this.ctx.strokeStyle = "#5dbcef";
        this.ctx.stroke();
    }
}

export default Raycasting;
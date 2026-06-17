class Raycasting {
    constructor(ctx, level, x, y, playerAngle, angleIncrement, column) {
        this.ctx = ctx;
        this.level = level;
        this.x = x;
        this.y = y;
        this.playerAngle = playerAngle;
        this.angleIncrement = angleIncrement;
        this.column = column;

        this.wallHitX = 0;
        this.wallHitY = 0;

        this.wallHitXHorizontal = 0;
        this.wallHitXVertical = 0;

        this.wallHitYHorizontal = 0;
        this.wallHitYVertical = 0;
    }

    setAngle(angle) {
        this.playerAngle = this.normalizeAngle(angle + this.angleIncrement);
    }

    normalizeAngle(angle) {
        angle = angle % (2 * Math.PI);
        if (angle < 0) {
            angle += 2 * Math.PI;
        }
        return angle;
    }

    getDistance(x1, y1, x2, y2) {
        return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    }

    castRay() {
        this.xIntercept = 0;
        this.yIntercept = 0;

        this.xStep = 0;
        this.yStep = 0;

        this.isLookingDown = false;
        this.isLookingLeft = false;

        if (this.playerAngle < Math.PI) {
            this.isLookingDown = true;
        }

        if (this.playerAngle > Math.PI / 2 && this.playerAngle < 3 * Math.PI / 2) {
            this.isLookingLeft = true;
        }

        var tileSize = 50;
        var horizontalCollition = false;
        this.yIntercept = Math.floor(this.y / tileSize) * tileSize;

        if (this.isLookingDown) {
            this.yIntercept += tileSize;
        }

        var tanAngle = Math.tan(this.playerAngle);

        if (Math.abs(tanAngle) < 0.000001) {
            this.wallHitX = this.x;
            this.wallHitY = this.y;
            return;
        }

        var adyacent = (this.yIntercept - this.y) / tanAngle;
        this.xIntercept = this.x + adyacent;

        this.yStep = this.isLookingDown ? tileSize : -tileSize;
        this.xStep = this.yStep / tanAngle;

        if ((this.isLookingLeft && this.xStep > 0) || (!this.isLookingLeft && this.xStep < 0)) {
            this.xStep = -this.xStep;
        }

        var nextXHorizontal = this.xIntercept;
        var nextYHorizontal = this.yIntercept;

        if (!this.isLookingDown) {
            nextYHorizontal -= 1;
        }

        while (!horizontalCollition) {
            var tileX = Math.floor(nextXHorizontal / tileSize);
            var tileY = Math.floor(nextYHorizontal / tileSize);

            if (tileX < 0 || tileX >= this.level.mapWidth || tileY < 0 || tileY >= this.level.mapHeight) {
                horizontalCollition = true;
                this.wallHitX = nextXHorizontal;
                this.wallHitY = nextYHorizontal;
                break;
            }

            if (this.level.collition(tileX, tileY)) {
                horizontalCollition = true;
                this.wallHitXHorizontal = nextXHorizontal;
                this.wallHitYHorizontal = nextYHorizontal;
                this.wallHitX = nextXHorizontal;
                this.wallHitY = nextYHorizontal;
            } else {
                nextXHorizontal += this.xStep;
                nextYHorizontal += this.yStep;
            }


        }

        var verticalCollition = false;
        this.xIntercept = Math.floor(this.x / tileSize) * tileSize;

        if (this.isLookingLeft) {
            this.xIntercept += tileSize;
        }

        var mirror = (this.xIntercept - this.x) * tanAngle;
        this.yIntercept = this.y + mirror;

        this.xStep = tileSize;
        if (this.isLookingLeft) {
            this.xStep = -this.xStep;
        }

        this.yStep = tileSize / tanAngle;

        if ((this.isLookingDown && this.yStep > 0) || (this.isLookingDown && this.yStep < 0)) {
            this.yStep = -this.yStep;
        }

        var nextXVertical = this.xIntercept;
        var nextYVertical = this.yIntercept;

        if (this.isLookingLeft) {
            nextXVertical--;
        }

        while (!verticalCollition && (nextXVertical >= 0 && nextYVertical >= 0 && nextXVertical < this.level.mapWidth && nextYVertical < this.level.mapHeight)) {
            var tileX = Math.floor(nextXVertical / tileSize);
            var tileY = Math.floor(nextYVertical / tileSize);

            if (this.level.collition(tileX, tileY)) {
                verticalCollition = true;
                this.wallHitXVertical = nextXVertical;
                this.wallHitYVertical = nextYVertical;
            } else {
                nextXVertical += this.xStep;
                nextYVertical += this.yStep;
            }
        }

        var horizontalDistamce = 9999;
        var verticalDistamce = 9999;

        if (horizontalCollition) {
            horizontalDistamce = this.getDistance(this.x, this.y, this.wallHitXHorizontal, this.wallHitYHorizontal);
        }
        if (verticalCollition) {
            verticalDistamce = this.getDistance(this.x, this.y, this.wallHitXVertical, this.wallHitYVertical);
        }
        console.log(horizontalDistamce, verticalDistamce);

        if (horizontalDistamce < verticalDistamce) {
            this.wallHitX = this.wallHitXHorizontal;
            this.wallHitY = this.wallHitYHorizontal;
        } else {
            this.wallHitX = this.wallHitXVertical;
            this.wallHitY = this.wallHitYVertical;
        }

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
import Ray from "./Raycasting.js";

class Player {
    constructor(ctx, level, x, y) {
        this.ctx = ctx;
        this.level = level;
        this.x = x;
        this.y = y;

        this.isWalking = 0; //0 = Standing, 1 = Forward, -1 = Backwards
        this.isSpining = 0; //0 = N/A, -1 = Left, 1 = Right

        this.rotationAngle = 0;
        this.rotationSpeed = 3 * (Math.PI / 180);

        this.moveSpeed = 2;

        this.ray = new Ray(this.ctx, this.level, this.x, this.y, this.rotationAngle, 0, 0);
    }

    getMovementDirection(direction) {
        switch (direction) {
            case "left":
                this.isSpining = -1;
                break;
            case "right":
                this.isSpining = 1;
                break;
            case "up":
                this.isWalking = 1;
                break;
            case "down":
                this.isWalking = -1;
                break;
        }
    }

    stopWalking() {
        this.isWalking = 0;
    }

    stopSpining() {
        this.isSpining = 0;
    }

    checkCollision(x, y) {
        var tileX = Math.floor(x / this.level.tileWidth);
        var tileY = Math.floor(y / this.level.tileHeight);

        if (this.level.collition(tileX, tileY)) {
            return true;
        }

        return false;
    }

    playerMovement() {
        var newX = this.x + this.isWalking * Math.cos(this.rotationAngle) * this.moveSpeed;
        var newY = this.y + this.isWalking * Math.sin(this.rotationAngle) * this.moveSpeed;

        if (!this.checkCollision(newX, newY)) {
            this.x = newX;
            this.y = newY;
        }

        this.rotationAngle += this.isSpining * this.rotationSpeed;
        this.rotationAngle = this.normalizeAngle(this.rotationAngle);

        this.ray.playerAngle = this.rotationAngle;
    }

    normalizeAngle(angle) {
        angle = angle % (2 * Math.PI);
        if (angle < 0) {
            angle += 2 * Math.PI;
        }
        return angle;
    }

    render() {
        this.playerMovement();

        this.ray.x = this.x;
        this.ray.y = this.y;
        this.ray.render();
        
        this.ctx.fillStyle = "#ff0000";
        this.ctx.fillRect(this.x - 3, this.y - 3, 6, 6);

        var rayX = this.x + Math.cos(this.rotationAngle) * 50;
        var rayY = this.y + Math.sin(this.rotationAngle) * 50;

        this.ctx.beginPath();
        this.ctx.moveTo(this.x, this.y);
        this.ctx.lineTo(rayX, rayY);
        this.ctx.strokeStyle = "#fffb00";
        this.ctx.stroke();
    }
}

export default Player;
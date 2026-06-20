import Level from "./Level.js";
import Player from "./Player.js";

document.addEventListener("DOMContentLoaded", function () {
    var btn = document.getElementById("btn");
    var canvas = document.getElementById("canvas");
    var ctx = canvas.getContext("2d");
    var FPS = 50;

    var height = 500;
    var width = 500;

    var map_textures;

    var map = [
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 1, 1, 0, 0, 0, 1, 0, 1],
        [1, 0, 1, 2, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 1, 1, 0, 1],
        [1, 0, 0, 0, 0, 0, 1, 3, 0, 1],
        [1, 0, 1, 0, 0, 0, 1, 4, 0, 1],
        [1, 0, 0, 0, 1, 1, 1, 1, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    ]

    var level;
    var player;
    var is2dView = false;

    function colorCanvas() {
        //Rendering the ceiling
        ctx.fillStyle = "#0d1929";
        ctx.fillRect(0, 0, canvas.width, canvas.height / 2);

        //Rendering the floor
        ctx.fillStyle = "#5d411a";
        ctx.fillRect(0, 250, canvas.width, canvas.height);
    }

    function gameLoop() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (is2dView) {
            level.render();
            player.render2d();
            btn.textContent = "3D View";
        } else {
            colorCanvas();
            player.render();
            btn.textContent = "2D View";
        }
    }

    function draw() {
        canvas.width = width;
        canvas.height = height;

        map_textures = new Image();
        map_textures.onload = function () {
            level = new Level(canvas, ctx, map, map_textures);
            player = new Player(ctx, level, width / 2, height / 2);
            setInterval(gameLoop, 1000 / FPS);
        };
        map_textures.src = "./assets/textures/mepTextures.webp";
    }

    draw();

    document.addEventListener("keydown", function (e) {
        switch (e.keyCode) {
            case 37:
                player.getMovementDirection("left");
                break;
            case 39:
                player.getMovementDirection("right");
                break;
            case 38:
                player.getMovementDirection("up");
                break;
            case 40:
                player.getMovementDirection("down");
                break;
        }
    });

    document.addEventListener("keyup", function (e) {
        switch (e.keyCode) {
            case 37:
                player.stopSpining();
                break;
            case 39:
                player.stopSpining();
                break;
            case 38:
                player.stopWalking();
                break;
            case 40:
                player.stopWalking();
                break;
        }
    });

    btn.addEventListener("click", function () {
        is2dView = !is2dView;
    });

});
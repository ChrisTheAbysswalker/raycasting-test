import Level from "./Level.js";
import Player from "./Player.js";

document.addEventListener("DOMContentLoaded", function() { 
    var canvas;
    var ctx;
    var FPS = 50;

    var height = 500;
    var width = 500;

    var map = [
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 1, 1, 0, 0, 0, 1, 0, 1],
        [1, 0, 1, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 1, 1, 0, 1],
        [1, 0, 0, 0, 0, 0, 1, 0, 0, 1],
        [1, 0, 1, 0, 0, 0, 1, 0, 0, 1],
        [1, 0, 0, 0, 1, 1, 1, 1, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    ]

    var level;
    var player;

    function draw() {
        canvas = document.getElementById("canvas");
        ctx = canvas.getContext("2d");

        canvas.width = width;
        canvas.height = height;

        level = new Level(canvas, ctx, map);
        player = new Player(ctx, level, width / 2, height / 2);

        setInterval(gameLoop, 1000 / FPS);
    }

    function gameLoop() {
        level.render();
        player.render();
    }

    document.addEventListener("keydown", function(e) {
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

    document.addEventListener("keyup", function(e) {
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

    draw();
 });
function Berry(){//COLOR = 3
    this.location = [Math.floor(Math.random() * (xSize-1)), Math.floor(Math.random() * (ySize-1))];
    this.drawBerry = function(){
        drawSq(this.location[0], this.location[1], 3);
    }
    this.regenerate = function(){
        SCORE++;

        this.location = [Math.floor(Math.random() * (xSize-1)), Math.floor(Math.random() * (ySize-1))];
        while(inSnake(this.location)){
            this.location = [Math.floor(Math.random() * (xSize-1)), Math.floor(Math.random() * (ySize-1))];
        }
        this.drawBerry();
    }
}
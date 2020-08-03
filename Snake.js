function Snake(interval){
    this.INTERVAL = interval;
    this.body = [[0,0], [1,0]];
    this.checkIfDead = function(){
        for(let i = 0; i < this.body.length; i ++){
            for(let j = i+1; j < this.body.length; j ++){
                if(this.body[i][0] == this.body[j][0] && this.body[i][1] == this.body[j][1]){
                    clearInterval(INTERVAL);
                    renderLose();
                    
                    console.log("DEAD");
                    return false;
                }
            }
        }
        return true;
    }
    this.renderSnake = function(){
        render();
        for(let i = 0; i < this.body.length; i ++){
            //console.log(i);
            drawSq(this.body[i][0], this.body[i][1], 2);
        }
        render();
    }
    this.updateUsingNode = function(node, bool){
        if(bool){
            let a = this.body.shift();
            drawSq(a[0], a[1], 6);
        }
        this.body.push(node.position);
        this.renderSnake();
    }
    this.updateUsingDirection = function(direction, bool){
        if(bool){
            let a = this.body.shift();
            drawSq(a[0], a[1], 6);
        }
        

        let newElement = [...this.body[this.body.length-1]];

        switch(direction){
            case Direction.LEFT:
                newElement[0] --;
                if(newElement[0] < 0){
                    clearInterval(this.INTERVAL);
                    renderLose();
                    this.body.push(newElement);
                    this.renderSnake();
                    return false;
                }
                //console.log(newElement);
                this.body.push(newElement);
                break;
            case Direction.RIGHT:
                newElement[0] ++;
                if(newElement[0] > xSize-1){
                    clearInterval(this.INTERVAL);
                    renderLose();
                    this.body.push(newElement);
                    this.renderSnake();
                    return false;
                }
                //console.log(newElement);
                this.body.push(newElement);
                break;
            case Direction.UP:
                newElement[1] --;
                if(newElement[1] < 0){
                    clearInterval(this.INTERVAL);
                    renderLose();
                    this.body.push(newElement);
                    this.renderSnake();
                    return false;
                }
                //console.log(newElement);
                this.body.push(newElement);
                break;
            case Direction.DOWN:
                newElement[1] ++;
                if(newElement[1] > ySize-1){
                    clearInterval(this.INTERVAL);
                    renderLose();
                    this.body.push(newElement);
                    this.renderSnake();
                    return false;
                }
                //console.log(newElement);
                this.body.push(newElement);
                break;
        }

        this.renderSnake();
        return true;
    }
}
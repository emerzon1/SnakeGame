const color = ['white', 'black', 'red', 'green', 'CornflowerBlue', 'yellow', 'white']
/* TODO ==> 
    CHECK IF POSSIBLE SQUARES USING ASTAR RETURN, if not restart;
    Click and drag start and end points
    Let user choose PROBWALL

*/
function Node(pos) {
    this.position = pos;
    this.f = 0;
    this.g = 0;
    this.closed = false;
    this.parent = null;
    this.open = false;
}
console.log(color)
arr = [];
let WIDTH = 1320;
let HEIGHT = 720;
let PROBWALL = 0;
const canvas = document.getElementById('myCanvas');
canvas.width = WIDTH;
c = canvas.getContext("2d");
const rectSize = 30;
let xSize = WIDTH / rectSize;
let ySize = HEIGHT / rectSize;
let start = [0, 0];
let end = [xSize - 1, 0];
let BEGIN = true;
let SPEED = 0;
canvas.height = HEIGHT;

var setup = () => {
    for (let i = 0; i < xSize; i++) {
        temp = [];
        for (let j = 0; j < ySize; j++) {


            temp.push((Math.random() < PROBWALL) ? 1 : 0);

        }
        arr.push(temp);
    }
}
var render = () => {
    for (let i = 0; i < arr.length; i++) {
        for (let j = 0; j < arr[i].length; j++) {
            c.beginPath();
            c.rect(i * rectSize, j * rectSize, rectSize, rectSize);
            if (arr[i][j] == 0) {
                c.stroke();
            }
            else {
                c.fillStyle = color[arr[i][j]]
                c.fill();
            }
        }
    }
}
setup();
render();



function createGrid() {
    let res = [];
    for (let i = 0; i < xSize; i++) {
        temp = [];
        for (let j = 0; j < ySize; j++) {
            if (arr[i][j] != 1) {
                temp.push(new Node([i, j]));
            }
            else {
                temp.push("");
            }
        }
        res.push(temp);
    }
    return res;
}
//setup


var drawSq = (i, j, col) => {
    c.beginPath();
    c.rect(i * rectSize, j * rectSize, rectSize, rectSize);
    if (col == 0) {
        c.stroke()
    }
    else {
        c.fillStyle = color[col];
        c.fill();
    }

}

let grid = createGrid();
document.getElementById('reset').addEventListener('click', () => {
    location.reload();
})
function delay() {
    return new Promise(resolve => {
        setTimeout(() => { resolve(); }, SPEED);
    });

}
var getAdjValues = (i, j) => { // * * *
    // * - *
    // * * *
    let res = [[i, j - 1], [i + 1, j], [i, j + 1], [i - 1, j]];
    let actualRes = [];
    for (let i = 0; i < res.length; i++) {
        if ((res[i][0] >= 0 && res[i][0] < xSize) && (res[i][1] >= 0 && res[i][1] < ySize)) {
            if (arr[res[i][0]][res[i][1]] != 1) {
                actualRes.push(res[i])
            }
        }
    }

    return actualRes;
}
var getAdjValuesAS = (i, j) => { // * * *
    // * - *
    // * * *
    let res = [[i, j - 1], [i + 1, j], [i, j + 1], [i - 1, j]]//, [i - 1, j - 1], [i - 1, j + 1], [i + 1, j - 1], [i + 1, j + 1]];
    let actualRes = [];
    for (let i = 0; i < res.length; i++) {
        if ((res[i][0] >= 0 && res[i][0] < xSize) && (res[i][1] >= 0 && res[i][1] < ySize)) {
            if (arr[res[i][0]][res[i][1]] != 1) {
                actualRes.push(res[i])
            }
        }
    }

    return actualRes;
}
let stack;
let val;
let visited;
let tmp;
let currInd = 0;
let open;
let closed;

function manhattan(a, b) {
    return Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]);
}
let q;
async function astar() {
    open = new Heap((a, b) => a.f - b.f)

    let startNode = nodeAt(start);
    startNode.f = 0;
    startNode.g = 0;
    startNode.open = true;
    open.push(new Node(start));
    while (!open.empty()) {
        q = open.pop();
        q.closed = true;
        drawSq(q.position[0], q.position[1], 4);
        if (q.position[0] == end[0] && q.position[1] == end[1]) {
            console.log(nodeAt(q.position));
            let curr = nodeAt(q.position);
            while (curr.parent != null) {
                drawSq(curr.position[0], curr.position[1], 5);
                console.log(curr.position);
                curr = curr.parent;
            }
            return;
        }
        let neighbors = getAdjValuesAS(q.position[0], q.position[1]);
        for (let i = 0; i < neighbors.length; i++) {
            var cNode = nodeAt(neighbors[i]);
            if (cNode.closed) {
                continue;
            }
            nodeG = q.g + 1;

            if (!cNode.open || nodeG < cNode.g) {//H value will be same so only need to compare G, not f
                cNode.g = nodeG;
                let hVal = manhattan(cNode.position, end);
                cNode.f = hVal + cNode.g;
                cNode.parent = q;
                if (!cNode.open) {
                    open.push(nodeAt(neighbors[i]));
                    cNode.open = true;
                }
                else {
                    open.updateItem(cNode);
                }
            }
        }
        drawSq(start[0], start[1], 2);
        await delay();
    }
}
function nodeAt(val) {
    return grid[val[0]][val[1]];
}
async function bfs() {
    visited = [];

    for (let i = 0; i < xSize; i++) {
        temp = [];

        for (let j = 0; j < ySize; j++) {
            temp.push(false);

        }

        visited.push(temp);
    }
    //console.log('visited');
    stack = [];
    stack.push(nodeAt(start))
    //console.log(stack);
    while (stack.length > 0) {
        val = stack.shift();
        val.closed = true;
        //console.log(currInd);

        if (arr[val.position[0]][val.position[1]] != 1) {
            if (visited[val.position[0]][val.position[1]] == false) {
                if (val.position[0] != 0 || val.position[1] != 0) {
                    drawSq(val.position[0], val.position[1], 4)
                }
                //console.log(val);
                await delay();
                //console.log('lol');
                visited[val.position[0]][val.position[1]] = true;
                tmp = getAdjValues(val.position[0], val.position[1])
                for (let i = 0; i < tmp.length; i++) {
                    if (tmp[i][0] == end[0] && tmp[i][1] == end[1]) {
                        console.log(nodeAt(val.position));
                        let curr = nodeAt(val.position);
                        while (curr.parent != null) {
                            drawSq(curr.position[0], curr.position[1], 5);
                            console.log(curr.position);
                            curr = curr.parent;
                        }
                        return;
                    }
                    if (stack.length <= 10000) {
                        if (arr[tmp[i][0]][tmp[i][1]] != 1) {
                            var currNode = nodeAt(tmp[i]);
                            if (currNode.open || currNode.closed) {
                                let a_ = 0;
                            }
                            else {
                                currNode.parent = nodeAt(val.position);
                                currNode.open = true;
                                stack.push(nodeAt(tmp[i]));
                            }
                        }
                    }
                }

            }

            //stack = stack.splice(0, currInd-100);
            document.getElementById('par').textContent = (stack.length);

        }

    }
}

async function dfs() {
    visited = [];
    for (let i = 0; i < xSize; i++) {
        temp = [];
        for (let j = 0; j < ySize; j++) {
            temp.push(false);
        }
        visited.push(temp);
    }
    stack = [];
    stack.push(nodeAt(start));

    while (stack.length > 0) {
        val = stack.pop();
        val.closed = true;
        //console.log(currInd);

        if (arr[val.position[0]][val.position[1]] != 1) {
            if (visited[val.position[0]][val.position[1]] == false) {
                if (val.position[0] != 0 || val.position[1] != 0) {
                    drawSq(val.position[0], val.position[1], 4)
                }
                //console.log(val);
                await delay();
                //console.log('lol');
                visited[val.position[0]][val.position[1]] = true;
                tmp = getAdjValues(val.position[0], val.position[1])
                for (let i = 0; i < tmp.length; i++) {
                    if (tmp[i][0] == end[0] && tmp[i][1] == end[1]) {
                        console.log(nodeAt(val.position));
                        let curr = nodeAt(val.position);
                        while (curr.parent != null) {
                            drawSq(curr.position[0], curr.position[1], 5);
                            console.log(curr.position);
                            curr = curr.parent;
                        }
                        return;
                    }
                    if (stack.length <= 10000) {
                        if (arr[tmp[i][0]][tmp[i][1]] != 1) {
                            var currNode = nodeAt(tmp[i]);
                            if (currNode.open || currNode.closed) {
                                let a_ = 0;
                            }
                            else {
                                currNode.parent = nodeAt(val.position);
                                currNode.open = true;
                                stack.push(nodeAt(tmp[i]));
                            }
                        }
                    }
                }

            }
        }
    }
}
let SNAKE_SPEED = 100;
let INTERVAL;
document.getElementById('start').addEventListener('click', () => {
    INTERVAL = setInterval(() => {update()}, SNAKE_SPEED);
});
function Berry(){//COLOR = 3
    this.location = [Math.floor(Math.random() * (xSize-1)), Math.floor(Math.random() * (ySize-1))];
    this.drawBerry = function(){
        drawSq(this.location[0], this.location[1], 3);
    }
    this.regenerate = function(){
        
        this.location = [Math.floor(Math.random() * (xSize-1)), Math.floor(Math.random() * (ySize-1))];
        drawSq(this.location[0], this.location[1], 3);
    }
}
function Snake(){
    this.body = [[0,0], [1,0], [2, 0], [3, 0], [4,0]];
    this.checkIfDead = function(){
        for(let i = 0; i < this.body.length; i ++){
            for(let j = i+1; j < this.body.length; j ++){
                if(this.body[i][0] == this.body[j][0] && this.body[i][1] == this.body[j][1]){
                    clearInterval(INTERVAL);
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
            console.log(i);
            drawSq(this.body[i][0], this.body[i][1], 2);
        }
        render();
    }
    this.updateUsingDirection = function(direction, bool){
        if(bool){
            let a = this.body.shift();
            drawSq(a[0], a[1], 6);
        }
        
        console.log(direction);
        let newElement = [...this.body[this.body.length-1]];
        switch(direction){
            case Direction.LEFT:
                newElement[0] --;
                if(newElement[0] < 0){
                    clearInterval(INTERVAL);

                }
                console.log(newElement);
                this.body.push(newElement);
                break;
            case Direction.RIGHT:
                newElement[0] ++;
                if(newElement[0] > xSize-1){
                    clearInterval(INTERVAL);

                }
                console.log(newElement);
                this.body.push(newElement);
                break;
            case Direction.UP:
                newElement[1] --;
                if(newElement[1] < 0){
                    clearInterval(INTERVAL);

                }
                console.log(newElement);
                this.body.push(newElement);
                break;
            case Direction.DOWN:
                newElement[1] ++;
                if(newElement[1] > ySize-1){
                    clearInterval(INTERVAL);

                }
                console.log(newElement);
                this.body.push(newElement);
                break;
        }
        
        this.renderSnake();
    }
}
let snake = new Snake();
let berry = new Berry();
let EATEN_BERRY = true;
berry.drawBerry();
snake.renderSnake();
function checkIfBerryGone(){
    if(snake.body[snake.body.length-1][0] == berry.location[0] && snake.body[snake.body.length-1][1] == berry.location[1]){
        console.log("EATEN!");
        berry.regenerate();
        berry.drawBerry();
        EATEN_BERRY = false;
    }
}
const Direction = {
    NONE: 0,
    LEFT: 1,
    RIGHT: 2,
    UP: 3,
    DOWN: 4
}

let prevDirection = Direction.RIGHT;
let currDirection = Direction.RIGHT;
document.addEventListener('keypress', (e) => {

    if(e.key == 'w'){
        if(prevDirection != Direction.DOWN){
            currDirection = Direction.UP;
        }
    }
    if(e.key == 'a'){
        if(prevDirection != Direction.RIGHT){
            currDirection = Direction.LEFT;
        }
    }
    if(e.key == 's'){
        if(prevDirection != Direction.UP){
            currDirection = Direction.DOWN;
        }
    }
    if(e.key == 'd'){
        if(prevDirection != Direction.LEFT){
            currDirection = Direction.RIGHT;
        }
    }
});
function update(){
    if(currDirection == Direction.NONE){
        snake.updateUsingDirection(prevDirection, EATEN_BERRY);
    }
    else{
        snake.updateUsingDirection(currDirection, EATEN_BERRY);
        prevDirection = currDirection;
        currDirection = Direction.NONE;
    }
    EATEN_BERRY = true;
    checkIfBerryGone();
    snake.checkIfDead();
    
}


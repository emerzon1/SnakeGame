const color = ['white', 'red', 'red', 'green', 'CornflowerBlue', 'yellow', 'white']
/* TODO ==> 
   USE MongoDB to store scores
*/

console.log(color)
arr = [];
let TAKEINPUT = true;
let WIDTH = Math.max(Math.floor(window.innerWidth / 30) * 30 - 60, 750);
let HEIGHT = Math.max(Math.floor(window.innerHeight / 30) * 30 - 180, 300);
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
function delay(a) {
    return new Promise(resolve => {
        setTimeout(() => { resolve(); }, a);
    });

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
        let neighbors = getAdjValues(q.position[0], q.position[1]);
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

let PERSON;
let HIGHSCORE;
const starter = {
    name: 'Evan Merzon',
    score: '5'
}

let SCORE = 5;
let SNAKE_SPEED = parseInt(document.getElementById('speed').value);
document.getElementById('speed').addEventListener('change', (e) => {
    SNAKE_SPEED = parseInt(document.getElementById('speed').value);
});
let INTERVAL;
let started = false;
document.getElementById('start').addEventListener('click', () => {
    started = true;
    INTERVAL = setInterval(() => { update() }, SNAKE_SPEED);
});
var getFromLocalStorage = () => {
    if (!window.localStorage.getItem('user')) {
        window.localStorage.setItem('user', JSON.stringify(starter));
    }
    let item = JSON.parse(window.localStorage.getItem('user'));
    document.getElementById('highscore').textContent = "The highscore is " + item['score'] + ", made by " + item['name'];
}
var setInLocalStorage = () => {
    if (window.localStorage.getItem('user')) {
        score = JSON.parse(window.localStorage.getItem('user'))
        if (SCORE > score['score']) {
            window.localStorage.removeItem('user');
            window.localStorage.setItem('user', JSON.stringify({ name: document.getElementById('name').value, score: SCORE }));
            document.getElementById('highscore').textContent = "The highscore is " + SCORE + ", made by " + document.getElementById('name').value;

        }
        else {
            getFromLocalStorage();
        }
        //window.localStorage.removeItem('user')
    }
}

getFromLocalStorage();

var renderLose = () => {
    setInLocalStorage();
    c.beginPath();
    c.fillStyle = "white";
    c.rect(0, 0, xSize, ySize);
    c.fill();
    c.fillStyle = "red";
    c.font = "150px Comic Sans MS";
    c.textAlign = "center";
    c.fillText("You Lose!", canvas.width / 2, canvas.height / 2);
}




let snake = new Snake(INTERVAL);
let berry = new Berry();
function inSnake(location) {
    for (let i = 0; i < snake.body.length; i++) {
        if (snake.body[i][0] == location[0] && snake.body[i][1] == location[1]) {
            return true;
        }
    }
    return false;
}
let EATEN_BERRY = true;
berry.drawBerry();
snake.renderSnake();
function checkIfBerryGone() {
    if (snake.body[snake.body.length - 1][0] == berry.location[0] && snake.body[snake.body.length - 1][1] == berry.location[1]) {
        console.log("EATEN!");
        berry.regenerate();
        document.getElementById('score').textContent = SCORE;
        berry.drawBerry();
        EATEN_BERRY = false;
    }
}


let prevDirection = Direction.RIGHT;
let currDirection = Direction.RIGHT;
document.addEventListener('keypress', (e) => {
    if (TAKEINPUT) {
        BEGIN = false;
        /*if(e.key == 'w' || e.key == 'a' || e.key == 's' || e.key == 'd' && !started){
            started = true;
            INTERVAL = setInterval(() => {update()}, SNAKE_SPEED);
        }*/
        if (e.key == 'w' && started) {
            if (prevDirection != Direction.DOWN) {
                currDirection = Direction.UP;
            }
        }
        if (e.key == 'a' && started) {
            if (prevDirection != Direction.RIGHT) {
                currDirection = Direction.LEFT;
            }
        }
        if (e.key == 's' && started) {
            if (prevDirection != Direction.UP) {
                currDirection = Direction.DOWN;
            }
        }
        if (e.key == 'd' && started) {
            if (prevDirection != Direction.LEFT) {
                currDirection = Direction.RIGHT;
            }
        }
    }
});
document.addEventListener('keydown', (e) => {
    if (TAKEINPUT) {
        BEGIN = false;
        if (e.keyCode >= 38 && e.keyCode <= 40 && !started) {
            started = true;
            INTERVAL = setInterval(() => { update() }, SNAKE_SPEED);
        }
        if (e.keyCode == 38 && started) {
            if (prevDirection != Direction.DOWN) {
                currDirection = Direction.UP;
            }
        }
        if (e.keyCode == 37 && started) {
            if (prevDirection != Direction.RIGHT) {
                currDirection = Direction.LEFT;
            }
        }
        if (e.keyCode == 40 && started) {
            if (prevDirection != Direction.UP) {
                currDirection = Direction.DOWN;
            }
        }
        if (e.keyCode == 39 && started) {
            if (prevDirection != Direction.LEFT) {
                currDirection = Direction.RIGHT;
            }
        }
    }
});
function getAdjValues(i, j) { // * * *
    // * - *
    // * * *
    let res = [[i, j - 1], [i + 1, j], [i, j + 1], [i - 1, j]];
    let actualRes = [];
    for (let i = 0; i < res.length; i++) {
        if ((res[i][0] >= 0 && res[i][0] < xSize) && (res[i][1] >= 0 && res[i][1] < ySize)) {
            if (arr[res[i][0]][res[i][1]] != 1) {
                var push = true;
                for(let j = 0; j < snake.body.length; j ++){
                    if(snake.body[j][0] == res[i][0] && snake.body[j][1] == res[i][1]){
                        push = false;
                    }
                }
                if(push){
                    actualRes.push(res[i]);
                } 
            }
        }
    }

    return actualRes;
}
var getAdjValuesDIR = (i, j, dir) => { // * * *
    // * - *
    // * * *
    let res = [[i, j - 1], [i + 1, j], [i, j + 1], [i - 1, j]];
    if (dir == Direction.RIGHT) {
        res.splice(3, 1);
    }
    if (dir == Direction.LEFT) {
        res.splice(1, 1)
    }
    if (dir == Direction.UP) {
        res.splice(2, 1)
    }
    if (dir == Direction.DOWN) {
        res.splice(0, 1);
    }
    let actualRes = [];
    for (let i = 0; i < res.length; i++) {
        if ((res[i][0] >= 0 && res[i][0] < xSize) && (res[i][1] >= 0 && res[i][1] < ySize)) {
            //if (arr[res[i][0]][res[i][1]] != 1) {
                actualRes.push(res[i])
            //}
        }
    }

    return actualRes;
}
var findDirection = (a, b) => {
    if (a.position[0] > b.position[0]) {
        return Direction.RIGHT;
    }
    if (a.position[0] < b.position[0]) {
        return Direction.LEFT;
    }
    if (a.position[1] > b.position[1]) {
        return Direction.DOWN;
    }
    return Direction.UP;
}
let currAlgo = -1;
const searchAlgo  = {
    NONE: -1,
    ASTAR: 0,
    DFS: 1,
    BFS: 2
}
let PATH = [];
async function dfs() {
    currAlgo = searchAlgo.DFS;
    grid = createGrid();
    visited = [];
    for (let i = 0; i < xSize; i++) {
        temp = [];
        for (let j = 0; j < ySize; j++) {
            temp.push(false);
        }
        visited.push(temp);
    }
    stack = [];
    stack.push(nodeAt(snake.body[snake.body.length - 1]));
    let first = true;
    while (stack.length > 0) {
        val = stack.pop();
        val.closed = true;
        //console.log(currInd);
        
        if (arr[val.position[0]][val.position[1]] != 1) {
            if (visited[val.position[0]][val.position[1]] == false) {
                if (val.position[0] == berry.location[0] && val.position[1] == berry.location[1]) {
                    //console.log(nodeAt(berry.location));
                    let curr = nodeAt(val.position);
                    while (curr.parent != null) {
                        //drawSq(curr.position[0], curr.position[1], 5);
                        PATH.push(findDirection(curr, curr.parent));
                        curr = curr.parent;
                    }
                    
                    return;
                }
                //if (val.position[0] != 0 || val.position[1] != 0) {
                //drawSq(val.position[0], val.position[1], 4)
                //}
                //console.log(val);
                //await delay(SNAKE_SPEED);

                visited[val.position[0]][val.position[1]] = true;
                if (first) {
                    first = false;
                    tmp = getAdjValuesDIR(val.position[0], val.position[1], prevDirection);
                }
                else {
                    tmp = getAdjValues(val.position[0], val.position[1]);
                }
                for (let i = 0; i < tmp.length; i++) {

                    if (stack.length <= 10000) {
                        if (arr[tmp[i][0]][tmp[i][1]] != 1) {
                            var currNode = nodeAt(tmp[i]);
                            if (currNode.closed) {
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
async function bfs() {
    currAlgo = searchAlgo.BFS
    grid = createGrid();
    visited = [];

    for (let i = 0; i < xSize; i++) {
        temp = [];

        for (let j = 0; j < ySize; j++) {
            temp.push(false);

        }

        visited.push(temp);
    }
    let first = true;
    //console.log('visited');
    stack = [];
    stack.push(nodeAt(snake.body[snake.body.length - 1]));
    //console.log(stack);
    while (stack.length > 0) {
        val = stack.shift();
        val.closed = true;
        //console.log(currInd);
        
        if (arr[val.position[0]][val.position[1]] != 1) {
            if (visited[val.position[0]][val.position[1]] == false) {
                if (val.position[0] == berry.location[0] && val.position[1] == berry.location[1]) {
                    //console.log(nodeAt(val.position));
                    let curr = nodeAt(val.position);
                    while (curr.parent != null) {
                        //drawSq(curr.position[0], curr.position[1], 5);
                        PATH.push(findDirection(curr, curr.parent));
                        curr = curr.parent;
                    }
                
                    return;
                }
                //console.log(val);
                //await delay();
                //console.log('lol');
                visited[val.position[0]][val.position[1]] = true;
                //if (first) {
                    //first = false;
                    tmp = getAdjValuesDIR(val.position[0], val.position[1], prevDirection);
                //}
                //else {
                    tmp = getAdjValues(val.position[0], val.position[1]);
                //}
                for (let i = 0; i < tmp.length; i++) {

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


        }

    }
}

document.getElementById('dfs').addEventListener('click', () => {
    if (BEGIN) {

        TAKEINPUT = false;
        BEGIN = false;
        dfs();
        started = true;
        INTERVAL = setInterval(() => { update() }, SNAKE_SPEED);
    }
})
document.getElementById('AS').addEventListener('click', () => {
    if (BEGIN) {

        TAKEINPUT = false;
        BEGIN = false;
        astar();
    }
})
document.getElementById('bfs').addEventListener('click', () => {
    if (BEGIN) {

        TAKEINPUT = false;
        BEGIN = false;
        bfs();
        started = true;
        INTERVAL = setInterval(() => { update() }, SNAKE_SPEED);
    }
});
let THIS_EATEN_BERRY = true;
let index = PATH.length - 1;
function update() {
    if (TAKEINPUT) {
        if (currDirection == Direction.NONE) {
            let resultupdate = snake.updateUsingDirection(prevDirection, EATEN_BERRY);
            if (!resultupdate) {
                clearInterval(INTERVAL);
            }
        }
        else {
            let resultupdate = snake.updateUsingDirection(currDirection, EATEN_BERRY);
            if (!resultupdate) {
                clearInterval(INTERVAL);
            }
            prevDirection = currDirection;
            currDirection = Direction.NONE;
        }
    }
    else {
        if(index < 0){
            index = PATH.length - 1;
        }
        console.log(PATH[index] + "index");
        let resultupdate = snake.updateUsingDirection(PATH[index], THIS_EATEN_BERRY);
        THIS_EATEN_BERRY = true;
        if (!resultupdate) {
            clearInterval(INTERVAL);
        }
        //console.log("RUNNING");
        if (index == 0) {
            prevDirection = PATH[0];
            PATH = [];
            checkIfBerryGone();
            THIS_EATEN_BERRY = false;
            //setup();
            //for(let i = 0; i < snake.body.length-1; i ++){
                //arr[snake.body[i][0]][snake.body[i][1]] = 1;
            //}
            if(currAlgo == searchAlgo.BFS){
                bfs();
            }
            else if(currAlgo == searchAlgo.DFS){
                dfs();
            }
            else if(currAlgo == searchAlgo.ASTAR){
                astar();
            }
            index = PATH.length - 1;
            
        }
        index -= 1;
        snake.checkIfDead();

    }
    EATEN_BERRY = true;
    checkIfBerryGone();
    snake.checkIfDead();


}


const color = [
    "white",
    "red",
    "red",
    "green",
    "CornflowerBlue",
    "yellow",
    "white",
];
/* TODO ==> 
   Setup LONGEST PATH --> hamiltonian cycle
*/
let THIS_EATEN_BERRY = true;
arr = [];
let TAKEINPUT = true;
let WIDTH = Math.min(
    100000,
    Math.max(Math.floor(window.innerWidth / 30) * 30 - 60, 750)
);
let HEIGHT = Math.min(
    60000000,
    Math.max(Math.floor(window.innerHeight / 30) * 30 - 180, 300)
);
let PROBWALL = 0;
const canvas = document.getElementById("myCanvas");
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
            temp.push(Math.random() < PROBWALL ? 1 : 0);
        }
        arr.push(temp);
    }
};
var render = () => {
    for (let i = 0; i < arr.length; i++) {
        for (let j = 0; j < arr[i].length; j++) {
            c.beginPath();
            c.rect(i * rectSize, j * rectSize, rectSize, rectSize);
            if (arr[i][j] == 0) {
                c.stroke();
            } else {
                c.fillStyle = color[arr[i][j]];
                c.fill();
            }
        }
    }
};
setup();
render();

function createGrid() {
    let res = [];
    for (let i = 0; i < xSize; i++) {
        temp = [];
        for (let j = 0; j < ySize; j++) {
            if (arr[i][j] != 1) {
                temp.push(new Node([i, j]));
            } else {
                temp.push("");
            }
        }
        res.push(temp);
    }
    return res;
}

var drawSq = (i, j, col) => {
    c.beginPath();
    c.rect(i * rectSize, j * rectSize, rectSize, rectSize);
    if (col == 0) {
        c.stroke();
    } else {
        c.fillStyle = color[col];
        c.fill();
    }
};

let grid = createGrid();
document.getElementById("reset").addEventListener("click", () => {
    location.reload();
});

async function delay(a) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve();
        }, a);
    });
}

var getAdjValuesAS = (i, j) => {
    let res = [
        [i, j - 1],
        [i + 1, j],
        [i, j + 1],
        [i - 1, j],
    ]; //, [i - 1, j - 1], [i - 1, j + 1], [i + 1, j - 1], [i + 1, j + 1]];
    let actualRes = [];
    for (let i = 0; i < res.length; i++) {
        if (
            res[i][0] >= 0 &&
            res[i][0] < xSize &&
            res[i][1] >= 0 &&
            res[i][1] < ySize
        ) {
            if (arr[res[i][0]][res[i][1]] != 1) {
                actualRes.push(res[i]);
            }
        }
    }

    return actualRes;
};
let stack;
let val;
let visited;
let tmp;
let currInd = 0;
let open;
let closed;
let currAlgo = -1;

function manhattan(a, b) {
    return Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]);
}
let q;

function nodeAt(val) {
    return grid[val[0]][val[1]];
}

let PERSON;
let HIGHSCORE;
const starter = {
    name: "Evan Merzon",
    score: "5",
};

let SCORE = 2;
let SNAKE_SPEED = parseInt(document.getElementById("speed").value);
document.getElementById("speed").addEventListener("change", (e) => {
    SNAKE_SPEED = parseInt(document.getElementById("speed").value);
});
let INTERVAL;
let started = false;
document.getElementById("start").addEventListener("click", () => {
    started = true;
    INTERVAL = setInterval(() => {
        update();
    }, SNAKE_SPEED);
});
var getFromLocalStorage = () => {
    if (!window.localStorage.getItem("user")) {
        window.localStorage.setItem("user", JSON.stringify(starter));
    }
    let item = JSON.parse(window.localStorage.getItem("user"));
    document.getElementById("highscore").textContent =
        "The highscore is " + item["score"] + ", made by " + item["name"];
};
var getName = (a, b) => {
    if (b == -1) {
        return a;
    }
    if (b == 0) {
        return "Computer: A*";
    }
    if (b == 1) {
        return "Computer: DFS";
    }

    return "Computer: BFS";
};
var setInLocalStorage = () => {
    if (window.localStorage.getItem("user")) {
        score = JSON.parse(window.localStorage.getItem("user"));
        if (SCORE > score["score"]) {
            window.localStorage.removeItem("user");
            window.localStorage.setItem(
                "user",
                JSON.stringify({
                    name: getName(
                        document.getElementById("name").value,
                        currAlgo
                    ),
                    score: SCORE,
                })
            );
            document.getElementById("highscore").textContent =
                "The highscore is " +
                SCORE +
                ", made by " +
                document.getElementById("name").value;
        } else {
            getFromLocalStorage();
        }
    }
};

getFromLocalStorage();

var renderLose = () => {
    setInLocalStorage();
    c.beginPath();
    c.fillStyle = "darkCyan";

    c.font = "150px Comic Sans MS";
    c.textAlign = "center";
    c.fillText("You Lose!", canvas.width / 2, canvas.height / 2);
};

let snake = new Snake(INTERVAL);
let berry = new Berry();

function inSnake(location) {
    for (let i = 0; i < snake.body.length; i++) {
        if (
            snake.body[i][0] == location[0] &&
            snake.body[i][1] == location[1]
        ) {
            return true;
        }
    }
    return false;
}
let EATEN_BERRY = true;
berry.drawBerry();
snake.renderSnake();

function checkIfBerryGone() {
    if (
        snake.body[snake.body.length - 1][0] == berry.location[0] &&
        snake.body[snake.body.length - 1][1] == berry.location[1]
    ) {
        berry.regenerate();
        document.getElementById("score").textContent = SCORE;
        berry.drawBerry();
        EATEN_BERRY = false;
        THIS_EATEN_BERRY = false;
    }
}

let prevDirection = Direction.RIGHT;
let currDirection = Direction.RIGHT;
document.addEventListener("keypress", (e) => {
    if (TAKEINPUT) {
        BEGIN = false;
        /*if(e.key == 'w' || e.key == 'a' || e.key == 's' || e.key == 'd' && !started){
            started = true;
            INTERVAL = setInterval(() => {update()}, SNAKE_SPEED);
        }*/
        if (e.key == "w" && started) {
            if (prevDirection != Direction.DOWN) {
                currDirection = Direction.UP;
            }
        }
        if (e.key == "a" && started) {
            if (prevDirection != Direction.RIGHT) {
                currDirection = Direction.LEFT;
            }
        }
        if (e.key == "s" && started) {
            if (prevDirection != Direction.UP) {
                currDirection = Direction.DOWN;
            }
        }
        if (e.key == "d" && started) {
            if (prevDirection != Direction.LEFT) {
                currDirection = Direction.RIGHT;
            }
        }
    }
});
document.addEventListener("keydown", (e) => {
    if (TAKEINPUT) {
        BEGIN = false;
        if (e.keyCode >= 38 && e.keyCode <= 40 && !started) {
            started = true;
            INTERVAL = setInterval(() => {
                update();
            }, SNAKE_SPEED);
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

function getAdjValues(i, j) {
    let res = [
        [i, j - 1],
        [i + 1, j],
        [i, j + 1],
        [i - 1, j],
    ];
    let actualRes = [];
    for (let i = 0; i < res.length; i++) {
        if (
            res[i][0] >= 0 &&
            res[i][0] < xSize &&
            res[i][1] >= 0 &&
            res[i][1] < ySize
        ) {
            if (arr[res[i][0]][res[i][1]] != 1) {
                var push = true;
                for (let j = 0; j < snake.body.length; j++) {
                    if (
                        snake.body[j][0] == res[i][0] &&
                        snake.body[j][1] == res[i][1]
                    ) {
                        push = false;
                    }
                }
                if (push) {
                    actualRes.push(res[i]);
                }
            }
        }
    }

    return actualRes;
}
function getAdjValuesH(i, j) {
    let res = [
        [i, j - 1],
        [i + 1, j],
        [i, j + 1],
        [i - 1, j],
    ];
    let actualRes = [];
    for (let i = 0; i < res.length; i++) {
        if (
            res[i][0] >= 0 &&
            res[i][0] < xSize &&
            res[i][1] >= 0 &&
            res[i][1] < ySize
        ) {
            if (arr[res[i][0]][res[i][1]] != 1) {
                var push = true;

                if (push) {
                    actualRes.push(res[i]);
                }
            }
        }
    }

    return actualRes;
}
var getAdjValuesDIR = (i, j, dir) => {
    let res = [
        [i, j - 1],
        [i + 1, j],
        [i, j + 1],
        [i - 1, j],
    ];
    if (dir == Direction.RIGHT) {
        res.splice(3, 1);
    }
    if (dir == Direction.LEFT) {
        res.splice(1, 1);
    }
    if (dir == Direction.UP) {
        res.splice(2, 1);
    }
    if (dir == Direction.DOWN) {
        res.splice(0, 1);
    }
    let actualRes = [];
    for (let i = 0; i < res.length; i++) {
        if (
            res[i][0] >= 0 &&
            res[i][0] < xSize &&
            res[i][1] >= 0 &&
            res[i][1] < ySize
        ) {
            var push = true;
            for (let j = 0; j < snake.body.length; j++) {
                if (
                    snake.body[j][0] == res[i][0] &&
                    snake.body[j][1] == res[i][1]
                ) {
                    push = false;
                }
            }
            if (push) {
                actualRes.push(res[i]);
            }
        }
    }

    return actualRes;
};
var getAdjValuesHDIR = (i, j, dir) => {
    let res = [
        [i, j - 1],
        [i + 1, j],
        [i, j + 1],
        [i - 1, j],
    ];
    if (dir == Direction.RIGHT) {
        res.splice(3, 1);
    }
    if (dir == Direction.LEFT) {
        res.splice(1, 1);
    }
    if (dir == Direction.UP) {
        res.splice(2, 1);
    }
    if (dir == Direction.DOWN) {
        res.splice(0, 1);
    }
    let actualRes = [];
    for (let i = 0; i < res.length; i++) {
        if (
            res[i][0] >= 0 &&
            res[i][0] < xSize &&
            res[i][1] >= 0 &&
            res[i][1] < ySize
        ) {
            var push = true;

            if (push) {
                actualRes.push(res[i]);
            }
        }
    }

    return actualRes;
};
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
};

const searchAlgo = {
    NONE: -1,
    ASTAR: 0,
    DFS: 1,
    BFS: 2,
    HAMILTONIAN: 3,
};
let PATH = [];
let shortestPath;
async function astarH(location) {
    currAlgo = searchAlgo.ASTAR;
    open = new Heap((a, b) => a.f - b.f);

    let startNode = nodeAt(snake.body[snake.body.length - 1]);
    console.log(startNode);
    console.log(nodeAt(location));
    startNode.f = 0;
    startNode.g = 0;
    startNode.open = true;
    open.push(startNode);
    let first = true;
    while (!open.empty()) {
        q = open.pop();
        q.closed = true;
        if (q.position[0] == location[0] && q.position[1] == location[1]) {
            let curr = nodeAt(q.position);
            shortestPath = [];
            while (curr.parent != null) {
                shortestPath.unshift(curr);
                curr.seen = true;
                PATH.push(findDirection(curr, curr.parent));
                curr = curr.parent;
            }
            curr.seen = true;
            shortestPath.unshift(curr);
            return;
        }
        let neighbors;
        if (first) {
            first = false;
            neighbors = getAdjValuesHDIR(
                q.position[0],
                q.position[1],
                prevDirection
            );
        } else {
            neighbors = getAdjValuesH(q.position[0], q.position[1]);
        }
        for (let i = 0; i < neighbors.length; i++) {
            var cNode = nodeAt(neighbors[i]);
            if (cNode.closed) {
                continue;
            }
            nodeG = q.g + 1;

            if (!cNode.open || nodeG < cNode.g) {
                cNode.g = nodeG;
                let hVal = manhattan(cNode.position, end);
                cNode.f = hVal + cNode.g;
                cNode.parent = q;
                if (!cNode.open) {
                    open.push(nodeAt(neighbors[i]));
                    cNode.open = true;
                } else {
                    open.updateItem(cNode);
                }
            }
        }
    }
    console.log("ENDED LOOP");
    shortestPath = [];
    while (q.parent != null) {
        q.seen = true;
        shortestPath.unshift(q);
        PATH.push(findDirection(q, q.parent));
        q = q.parent;
    }
    q.seen = true;
    shortestPath.unshift(q);
}
const hasAdjNodes = (a, b) => {
    if (a.position[1] > b.position[1]) {
        //a is below of b, the path goes from A to B.
        try {
            if (
                grid[a.position[0] - 1][a.position[1]] &&
                grid[a.position[0] - 1][a.position[1] - 1]
            ) {
                if (
                    !grid[a.position[0] - 1][a.position[1]].seen &&
                    !grid[a.position[0] - 1][a.position[1] - 1].seen
                ) {
                    grid[a.position[0] - 1][a.position[1]].seen = true;
                    grid[a.position[0] - 1][a.position[1] - 1].seen = true;
                    return [
                        grid[a.position[0] - 1][a.position[1]],
                        grid[a.position[0] - 1][a.position[1] - 1],
                    ];
                }
            }
        } catch (error) {}
        try {
            if (
                grid[a.position[0] + 1][a.position[1]] &&
                grid[a.position[0] + 1][a.position[1] - 1]
            ) {
                if (
                    !grid[a.position[0] + 1][a.position[1]].seen &&
                    !grid[a.position[0] + 1][a.position[1] - 1].seen
                ) {
                    grid[a.position[0] + 1][a.position[1]].seen = true;
                    grid[a.position[0] + 1][a.position[1] - 1].seen = true;
                    return [
                        grid[a.position[0] + 1][a.position[1]],
                        grid[a.position[0] + 1][a.position[1] - 1],
                    ];
                }
            }
        } catch (error) {}
    } else if (a.position[1] < b.position[1]) {
        //a is on top of b, the path goes from A to B. --going up
        try {
            if (
                grid[a.position[0] - 1][a.position[1]] &&
                grid[a.position[0] - 1][a.position[1] + 1]
            ) {
                if (
                    !grid[a.position[0] - 1][a.position[1]].seen &&
                    !grid[a.position[0] - 1][a.position[1] + 1].seen
                ) {
                    grid[a.position[0] - 1][a.position[1]].seen = true;
                    grid[a.position[0] - 1][a.position[1] + 1].seen = true;
                    return [
                        grid[a.position[0] - 1][a.position[1]],
                        grid[a.position[0] - 1][a.position[1] + 1],
                    ];
                }
            }
        } catch (error) {}
        try {
            if (
                grid[a.position[0] + 1][a.position[1]] &&
                grid[a.position[0] + 1][a.position[1] + 1]
            ) {
                if (
                    !grid[a.position[0] + 1][a.position[1]].seen &&
                    !grid[a.position[0] + 1][a.position[1] + 1].seen
                ) {
                    grid[a.position[0] + 1][a.position[1]].seen = true;
                    grid[a.position[0] + 1][a.position[1] + 1].seen = true;
                    return [
                        grid[a.position[0] + 1][a.position[1]],
                        grid[a.position[0] + 1][a.position[1] + 1],
                    ];
                }
            }
        } catch (error) {}
    } else if (a.position[0] > b.position[0]) {
        //a is to the right of b, the path goes from A to B.
        try {
            if (
                grid[a.position[0]][a.position[1] + 1] &&
                grid[a.position[0] - 1][a.position[1] + 1]
            ) {
                if (
                    !grid[a.position[0]][a.position[1] + 1].seen &&
                    !grid[a.position[0] - 1][a.position[1] + 1].seen
                ) {
                    grid[a.position[0]][a.position[1] + 1].seen = true;
                    grid[a.position[0] - 1][a.position[1] + 1].seen = true;
                    return [
                        grid[a.position[0]][a.position[1] + 1],
                        grid[a.position[0] - 1][a.position[1] + 1],
                    ];
                }
            }
        } catch (error) {}
        try {
            if (
                grid[a.position[0]][a.position[1] - 1] &&
                grid[a.position[0] - 1][a.position[1] - 1]
            ) {
                if (
                    !grid[a.position[0]][a.position[1] - 1].seen &&
                    !grid[a.position[0] - 1][a.position[1] - 1].seen
                ) {
                    grid[a.position[0]][a.position[1] - 1].seen = true;
                    grid[a.position[0] - 1][a.position[1] - 1].seen = true;
                    return [
                        grid[a.position[0]][a.position[1] - 1],
                        grid[a.position[0] - 1][a.position[1] - 1],
                    ];
                }
            }
        } catch (error) {}
    } else if (a.position[0] < b.position[0]) {
        //a is below b, the path goes from A to B. --going up
        try {
            if (
                grid[a.position[0]][a.position[1] + 1] &&
                grid[a.position[0] + 1][a.position[1] + 1]
            ) {
                if (
                    !grid[a.position[0]][a.position[1] + 1].seen &&
                    !grid[a.position[0] + 1][a.position[1] + 1].seen
                ) {
                    grid[a.position[0]][a.position[1] + 1].seen = true;
                    grid[a.position[0] + 1][a.position[1] + 1].seen = true;
                    return [
                        grid[a.position[0]][a.position[1] + 1],
                        grid[a.position[0] + 1][a.position[1] + 1],
                    ];
                }
            }
        } catch (error) {}
        try {
            if (
                grid[a.position[0]][a.position[1] - 1] &&
                grid[a.position[0] + 1][a.position[1] - 1]
            ) {
                if (
                    !grid[a.position[0]][a.position[1] - 1].seen &&
                    !grid[a.position[0] + 1][a.position[1] - 1].seen
                ) {
                    grid[a.position[0]][a.position[1] - 1].seen = true;
                    grid[a.position[0] + 1][a.position[1] - 1].seen = true;
                    return [
                        grid[a.position[0]][a.position[1] - 1],
                        grid[a.position[0] + 1][a.position[1] - 1],
                    ];
                }
            }
        } catch (error) {}
    }
    return null;
};
async function hamiltonian(head, tail) {
    let HEAD = nodeAt(head);
    let TAIL = nodeAt(tail);
    console.log(TAIL);
    let a;
    astarH(TAIL.position);
    console.log(TAIL);
    currAlgo = searchAlgo.HAMILTONIAN;
    PATH = [];
    //console.log(shortestPath);

    let index = 1;
    while (index < shortestPath.length) {
        let adjNodes = hasAdjNodes(
            shortestPath[index - 1],
            shortestPath[index]
        );
        if (adjNodes) {
            shortestPath.splice(index, 0, adjNodes[0], adjNodes[1]);
            index = 0;
        }
        index++;
    }
    for (let i = 1; i < shortestPath.length; i++) {
        PATH.push(findDirection(shortestPath[i - 1], shortestPath[i]));
    }
}
async function astar(location) {
    currAlgo = searchAlgo.ASTAR;
    open = new Heap((a, b) => a.f - b.f);

    let startNode = nodeAt(snake.body[snake.body.length - 1]);
    console.log(startNode);
    console.log(nodeAt(location));
    startNode.f = 0;
    startNode.g = 0;
    startNode.open = true;
    open.push(startNode);
    let first = true;
    while (!open.empty()) {
        q = open.pop();
        q.closed = true;
        if (q.position[0] == location[0] && q.position[1] == location[1]) {
            let curr = nodeAt(q.position);
            shortestPath = [];
            while (curr.parent != null) {
                shortestPath.unshift(curr);
                PATH.push(findDirection(curr, curr.parent));
                curr = curr.parent;
            }
            shortestPath.unshift(curr);
            return;
        }
        let neighbors;
        if (first) {
            first = false;
            neighbors = getAdjValuesDIR(
                q.position[0],
                q.position[1],
                prevDirection
            );
        } else {
            neighbors = getAdjValues(q.position[0], q.position[1]);
        }
        for (let i = 0; i < neighbors.length; i++) {
            var cNode = nodeAt(neighbors[i]);
            if (cNode.closed) {
                continue;
            }
            nodeG = q.g + 1;

            if (!cNode.open || nodeG < cNode.g) {
                cNode.g = nodeG;
                let hVal = manhattan(cNode.position, end);
                cNode.f = hVal + cNode.g;
                cNode.parent = q;
                if (!cNode.open) {
                    open.push(nodeAt(neighbors[i]));
                    cNode.open = true;
                } else {
                    open.updateItem(cNode);
                }
            }
        }
    }
    console.log("ENDED LOOP");
    shortestPath = [];
    while (q.parent != null) {
        shortestPath.unshift(q);
        PATH.push(findDirection(q, q.parent));
        q = q.parent;
    }
    shortestPath.unshift(q);
}
async function dfs() {
    currAlgo = searchAlgo.DFS;

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

        if (arr[val.position[0]][val.position[1]] != 1) {
            if (visited[val.position[0]][val.position[1]] == false) {
                if (
                    val.position[0] == berry.location[0] &&
                    val.position[1] == berry.location[1]
                ) {
                    let curr = nodeAt(val.position);
                    while (curr.parent != null) {
                        PATH.push(findDirection(curr, curr.parent));
                        curr = curr.parent;
                    }

                    return;
                }
                visited[val.position[0]][val.position[1]] = true;
                if (first) {
                    first = false;
                    tmp = getAdjValuesDIR(
                        val.position[0],
                        val.position[1],
                        prevDirection
                    );
                } else {
                    tmp = getAdjValues(val.position[0], val.position[1]);
                }
                for (let i = 0; i < tmp.length; i++) {
                    if (stack.length <= 10000) {
                        if (arr[tmp[i][0]][tmp[i][1]] != 1) {
                            var currNode = nodeAt(tmp[i]);
                            if (currNode.closed) {
                                let a_ = 0;
                            } else {
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
    console.log("ENDED LOOP");
    while (val.parent != null) {
        PATH.push(findDirection(val, val.parent));
        val = val.parent;
    }
}
async function bfs(location) {
    currAlgo = searchAlgo.BFS;

    visited = [];

    for (let i = 0; i < xSize; i++) {
        temp = [];

        for (let j = 0; j < ySize; j++) {
            temp.push(false);
        }

        visited.push(temp);
    }
    let first = true;

    stack = [];
    stack.push(nodeAt(snake.body[snake.body.length - 1]));

    while (stack.length > 0) {
        val = stack.shift();
        val.closed = true;

        if (arr[val.position[0]][val.position[1]] != 1) {
            if (visited[val.position[0]][val.position[1]] == false) {
                if (
                    val.position[0] == location[0] &&
                    val.position[1] == location[1]
                ) {
                    let curr = nodeAt(val.position);
                    shortestPath = [];
                    while (curr.parent != null) {
                        shortestPath.unshift(curr);
                        PATH.push(findDirection(curr, curr.parent));
                        curr = curr.parent;
                    }
                    shortestPath.unshift(curr);
                    return shortestPath;
                }
                visited[val.position[0]][val.position[1]] = true;
                if (first) {
                    first = false;
                    tmp = getAdjValuesDIR(
                        val.position[0],
                        val.position[1],
                        prevDirection
                    );
                } else {
                    tmp = getAdjValues(val.position[0], val.position[1]);
                }
                for (let i = 0; i < tmp.length; i++) {
                    if (stack.length <= 10000) {
                        if (arr[tmp[i][0]][tmp[i][1]] != 1) {
                            var currNode = nodeAt(tmp[i]);
                            if (currNode.open || currNode.closed) {
                                let a_ = 0;
                            } else {
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
    console.log(val);
    shortestPath = [];
    while (val.parent != null) {
        console.log("Not null");
        shortestPath.unshift(val);
        PATH.push(findDirection(val, val.parent));
        val = val.parent;
    }
    shortestPath.unshift(val);
    return shortestPath;
}

document.getElementById("dfs").addEventListener("click", () => {
    if (BEGIN) {
        TAKEINPUT = false;
        BEGIN = false;
        dfs();
        started = true;
        INTERVAL = setInterval(() => {
            update();
        }, SNAKE_SPEED);
    }
});
document.getElementById("AS").addEventListener("click", () => {
    if (BEGIN) {
        TAKEINPUT = false;
        BEGIN = false;
        astar(berry.location);
        started = true;
        INTERVAL = setInterval(() => {
            update();
        }, SNAKE_SPEED);
    }
});
document.getElementById("bfs").addEventListener("click", () => {
    if (BEGIN) {
        TAKEINPUT = false;
        BEGIN = false;
        bfs(berry.location);
        started = true;
        INTERVAL = setInterval(() => {
            update();
        }, SNAKE_SPEED);
    }
});
document.getElementById("ham").addEventListener("click", () => {
    if (BEGIN) {
        TAKEINPUT = false;
        BEGIN = false;
        hamiltonian([1, 0], [0, 0]);
        started = true;
        INTERVAL = setInterval(() => {
            update();
        }, SNAKE_SPEED);
    }
});

let index = PATH.length - 1;
let prevSnake = snake.body;

function update() {
    if (TAKEINPUT) {
        if (currDirection == Direction.NONE) {
            let resultupdate = snake.updateUsingDirection(
                prevDirection,
                EATEN_BERRY
            );
            if (!resultupdate) {
                renderLose();
                clearInterval(INTERVAL);
            }
        } else {
            let resultupdate = snake.updateUsingDirection(
                currDirection,
                EATEN_BERRY
            );
            if (!resultupdate) {
                renderLose();
                clearInterval(INTERVAL);
            }
            prevDirection = currDirection;
            currDirection = Direction.NONE;
        }
    } else {
        if (index < 0) {
            index = PATH.length - 1;
        }
        if (currAlgo == searchAlgo.HAMILTONIAN) {
            snake.updateUsingNode(shortestPath[index], THIS_EATEN_BERRY);
            THIS_EATEN_BERRY = true;
        } else {
            let resultupdate = snake.updateUsingDirection(
                PATH[index],
                THIS_EATEN_BERRY
            );
            THIS_EATEN_BERRY = true;
            if (!resultupdate) {
                console.log(PATH[index]);
                renderLose();
                clearInterval(INTERVAL);
            }
        }
        if (index == 0) {
            prevDirection = PATH[0];
            PATH = [];
            checkIfBerryGone();
            grid = [];
            grid = [...createGrid()];
            if (snake.body.length > 0) {
                prevSnake = [...snake.body];
            }
            if (currAlgo == searchAlgo.BFS) {
                bfs(berry.location);
            } else if (currAlgo == searchAlgo.DFS) {
                dfs();
            } else if (currAlgo == searchAlgo.ASTAR) {
                astar(berry.location);
            } else if (currAlgo == searchAlgo.HAMILTONIAN) {
                hamiltonian(snake.body[snake.body.length - 1], snake.body[0]);
            }
            if (PATH.length == 0) {
                clearInterval(INTERVAL);
                drawSq(
                    prevSnake[prevSnake.length - 1][0],
                    prevSnake[prevSnake.length - 1][1],
                    5
                );
                renderLose();
            }
            index = PATH.length - 1;
        } else {
            index -= 1;
        }

        snake.checkIfDead();
    }
    EATEN_BERRY = true;
    checkIfBerryGone();
    snake.checkIfDead();
}

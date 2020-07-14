class Game {
  constructor() {
    this.isAgainstAI = false;
    this.isStarted = false;
    this.numRows = null;
    this.numCols = null;
    this.cellSize = null;
    this.gameMap = [];
    this.activePlayer = "O";
    this.startScreen = document.querySelector(".startScreen");
    this.gameScreen = document.querySelector(".gameScreen");
    this.resultsScreen = document.querySelector(".resultsScreen");
    this.cells = document.querySelector(".cells");
    this.canvas = document.querySelector(".canvas");
    this.resultsTxt = document.querySelector(".resultsTxt");
    this.startBtn = document.querySelector(".startBtn");
    this.restartBtn = document.querySelector(".restartBtn");
    this.openSettingsBtn = document.querySelector(".openSettingsBtn");
    this.startOverBtn = document.querySelector(".startOverBtn");
    this.saveGame = this.saveGame.bind(this);
    this.init();
  }
  init() {
    this.cells.onclick = (e) => {
      this.toggleMark(e);
    };
    this.startBtn.onclick = () => {
      this.setSettings();
      this.setSizes();
      this.setDefaultGameState();
      this.start();
    };
    this.restartBtn.onclick = () => {
      this.setDefaultGameState();
      this.start();
    };
    this.openSettingsBtn.onclick = () => {
      this.startScreen.classList.remove("hidden");
      this.gameScreen.classList.add("hidden");
      this.isStarted = false;
    };
    this.startOverBtn.onclick = () => {
      this.resultsScreen.classList.add("hidden");
      this.gameScreen.classList.remove("hidden");
      this.setDefaultGameState();
      this.start();
    };
    window.addEventListener("beforeunload", this.saveGame);
    let savedData = localStorage.getItem("gameMap");
    if (savedData) {
      this.loadGame();
      this.setSizes();
      this.start();
    }
  }
  start() {
    this.gameScreen.classList.remove("hidden");
    this.startScreen.classList.add("hidden");
    this.setSizes();
    this.createCells();
    this.drawMarks();
    this.isStarted = true;
  }
  setSizes() {
    let gameWidth = window.innerWidth * 0.5;
    let gameHeight = window.innerHeight * 0.8;
    this.canvas.width = gameWidth;
    this.canvas.height = gameHeight;
    this.canvas.style.width = gameWidth;
    this.canvas.style.height = gameHeight;
    this.cellSize = {
      width: gameWidth / this.numRows,
      height: gameHeight / this.numCols,
    };
  }
  setSettings() {
    this.numRows = getValidNumber(
      document.querySelector("input[name=rows]").value
    );
    this.numCols = getValidNumber(
      document.querySelector("input[name=cols]").value
    );
    this.isAgainstAI = document.querySelector("input[name=mode]").checked;
  }
  setDefaultGameState() {
    this.activePlayer = "O";
    this.gameMap.splice(0, this.gameMap.length);
    for (let i = 0; i < this.numRows; i++) {
      this.gameMap[i] = new Array(this.numCols).fill("emptyCell");
    }
  }
  createCells() {
    //на canvas нельзя навесить click, поэтому под ним поле с клетками
    this.cells.innerHTML = "";
    let { width, height } = this.cellSize;
    for (let row = 0; row < this.numRows; row++) {
      let rowContainer = document.createElement("div");
      rowContainer.className = "row";
      for (let col = 0; col < this.numCols; col++) {
        let cell = document.createElement("div");
        cell.style.width = width + "px";
        cell.style.height = height + "px";
        cell.setAttribute("col", col);
        cell.setAttribute("row", row);
        rowContainer.appendChild(cell);
      }
      this.cells.appendChild(rowContainer);
    }
  }
  toggleMark(e) {
    let row = e.target.getAttribute("row");
    let col = e.target.getAttribute("col");
    let clickSound;
    if (this.gameMap[row][col] == "emptyCell") {
      clickSound = new Audio();
      clickSound.src = "./assets/success.mp3";
      clickSound.play();
    } else {
      clickSound = new Audio();
      clickSound.src = "./assets/fail.mp3";
      clickSound.play();
      return;
    }
    if (this.activePlayer === "O") {
      this.gameMap[row][col] = "O";
      this.activePlayer = "X";
    } else {
      this.gameMap[row][col] = "X";
      this.activePlayer = "O";
    }
    if (this.isAgainstAI) {
      let AImove = getAIMove.call(this);
      if (AImove) {
        this.gameMap[AImove.row][AImove.col] = "X";
        this.activePlayer = "O";
      } else {
        //если у ai нет возможных ходов, игра заканчивается
        this.gameOver("draw");
      }
    }
    if (checkWinConditions.call(this, "O")) {
      this.gameOver("O");
    }
    if (checkWinConditions.call(this, "X")) {
      this.gameOver("X");
    }
    this.drawMarks();
  }
  drawMarks() {
    let ctx = this.canvas.getContext("2d");
    ctx.clearRect(0, 0, this.width, this.height);
    let { width, height } = this.cellSize;
    for (let row = 0; row < this.numRows; row++) {
      for (let col = 0; col < this.numCols; col++) {
        let pos = {
          x: width * row,
          y: height * col,
        };
        let mark = this.gameMap[row][col];
        drawMark.call(this, mark, pos);
      }
    }
  }
  gameOver(winner = false) {
    this.gameScreen.classList.add("hidden");
    this.resultsScreen.classList.remove("hidden");
    this.resultsTxt.innerHTML = getResultsTxt(winner);
  }
  saveGame() {
    if (this.isStarted) {
      localStorage.setItem("gameMap", JSON.stringify(this.gameMap));
      localStorage.setItem("activePlayer", this.activePlayer);
      localStorage.setItem("againstAI", this.isAgainstAI);
      localStorage.setItem("numRows", this.numRows);
      localStorage.setItem("numCols", this.numCols);
    }
  }
  loadGame() {
    this.gameMap = JSON.parse(localStorage.getItem("gameMap"));
    this.activePlayer = localStorage.getItem("activePlayer");
    this.numRows = Number(localStorage.getItem("numRows"));
    this.numCols = Number(localStorage.getItem("numCols"));
    if (localStorage.getItem("againstAI") === "true") {
      this.isAgainstAI = true;
    } else {
      this.isAgainstAI = false;
    }
  }
}
const game = new Game();

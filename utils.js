function drawMark(mark, pos) {
  let ctx = this.canvas.getContext("2d");
  let { width, height } = this.cellSize;
  let { x, y } = pos;
  let halfWidth = width / 2;
  let halfHeight = height / 2;
  let centerX = x + halfWidth;
  let centerY = y + halfHeight;
  switch (mark) {
    case "O":
      ctx.beginPath();
      ctx.lineWidth = 2;
      ctx.strokeStyle = "#01bBC2";
      ctx.arc(x + halfWidth, y + halfHeight, width / 3, 0, 2 * Math.PI);
      ctx.stroke();
      ctx.beginPath();
      ctx.lineWidth = 1;
      ctx.strokeStyle = "white";
      ctx.strokeRect(x, y, width, height);
      break;
    case "X":
      ctx.strokeStyle = "green";
      ctx.beginPath();
      ctx.moveTo(centerX - halfWidth * 0.75, centerY - halfHeight * 0.75);
      ctx.lineTo(centerX + halfWidth * 0.75, centerY + halfHeight * 0.75);
      ctx.stroke();
      ctx.moveTo(centerX + halfWidth * 0.75, centerY - halfHeight * 0.75);
      ctx.lineTo(centerX - halfWidth * 0.75, centerY + halfHeight * 0.75);
      ctx.stroke();
      ctx.strokeStyle = "white";
      ctx.strokeRect(x, y, width, height);
    default:
      ctx.strokeStyle = "white";
      ctx.strokeRect(x, y, width, height);
      break;
  }
}
function checkWinConditions(mark) {
  let numRows = this.gameMap.length;
  let numCols = this.gameMap[0].length; //в каждом ряду одинаковое количество колонок
  let data = this.gameMap;
  for (let row = 0; row < numRows; row++) {
    for (let col = 0; col < numCols; col++) {
      //по повертикали
      if (col + 5 <= numCols) {
        let counter = 5;
        for (let i = 0; i < 5; i++) {
          if (data[row][col + i] === mark) {
            counter--;
          }
          if (counter === 0) {
            return true;
          }
        }
      }
      //по горизонтали
      if (row + 5 <= numRows) {
        let counter1 = 5;
        for (let i1 = 0; i1 < 5; i1++) {
          if (data[row + i1][col] === mark) {
            counter1--;
          }
          if (counter1 === 0) {
            return true;
          }
        }
      }
      //лесенкой вниз
      if (row + 5 <= numRows && col + 5 <= numCols) {
        let counter2 = 5;
        for (let i2 = 0; i2 < 5; i2++) {
          if (data[row + i2][col + i2] === mark) {
            counter2--;
          }
          if (counter2 === 0) {
            return true;
          }
        }
      }
      //лесенкой вверх
      if (col + 5 <= numCols && row - 5 >= 0) {
        let counter3 = 5;
        for (let i3 = 0; i3 < 5; i3++) {
          if (data[row - i3][col + i3] === mark) {
            counter3--;
          }
          if (counter3 === 0) {
            return true;
          }
        }
      }
    }
  }
  return false;
}
function getValidNumber(x) {
  if (x < 5) {
    return 5;
  } else if (x > 25) {
    return 25;
  } else {
    return Number(x);
  }
}
function getAIMove() {
  let numRows = this.gameMap.length;
  let numCols = this.gameMap[0].length;
  //сначала проверяем есть ли место рядом поставленными крестиками
  for (let row = 0; row < numRows; row++) {
    for (let col = 0; col < numCols; col++) {
      if (this.gameMap[row][col] === "X") {
        if (row + 1 < numRows && this.gameMap[row + 1][col] === "emptyCell") {
          return { row: row + 1, col: col };
        }
        if (col < numCols && this.gameMap[row][col + 1] === "emptyCell") {
          return { row: row, col: col + 1 };
        }
      }
    }
  }
  //если нету, то ставим в рандомном доступном месте
  let avaliableCells = [];
  for (let row = 0; row < numRows; row++) {
    let ind = this.gameMap[row].indexOf("emptyCell");
    if (ind !== -1) {
      avaliableCells.push({ row: row, col: ind });
    }
  }
  if (avaliableCells) {
    let randomNum = Math.floor(Math.random() * avaliableCells.length);
    return avaliableCells[randomNum];
  } else {
    return false;
  }
}
function getResultsTxt(winner) {
  let txt;
  switch (winner) {
    case "X":
      txt = "Победили крестики ";
      break;
    case "O":
      txt = "Победили нолики";
    case "draw":
      txt = "Ничья";
  }
  return txt;
}

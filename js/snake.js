(function () {
  if (typeof Game === "undefined") {
    window.Game = {};
  }

  var Coord = Game.Coord = function () {}

  Coord.VECTORS = {
    "N": [-1, 0],
    "E": [ 0, 1],
    "S": [ 1, 0],
    "W": [ 0,-1]
  },

  Coord.plus = function (coord, dir) {
    return [
      coord[0] + Coord.VECTORS[dir][0],
      coord[1] + Coord.VECTORS[dir][1]
    ];
  },

  Coord.equals = function (coord1, coord2) {
    return (coord1[0] === coord2[0] && coord1[1] === coord2[1]);
  },

  Coord.isOpposite = function (curDir, newDir) {
    return(
        (curDir === "N" && newDir === "S") ||
        (curDir === "S" && newDir === "N") ||
        (curDir === "E" && newDir === "W") ||
        (curDir === "W" && newDir === "E"));
  };

  var Snake = Game.Snake = function (board) {
    this.dir = "S";
    this.board = board;
    var middle = Math.floor(this.board.grid.length / 2);
    var startSegs = this.startingSegments([middle,middle]);
    this.segments = startSegs;
    this.head = this.segments[0];
    this.growTurns = 0;
    this.score = 0;
    this.highScore = 0;
  };

  Snake.prototype.reset = function () {
    this.dir = "S";
    var middle = Math.floor(this.board.grid.length / 2);
    var startSegs = this.startingSegments([middle,middle]);
    this.segments = startSegs;
    this.head = this.segments[0];
    this.growTurns = 0;
    this.score = 0;
    this.board.apple.replaceApple();
  }

  Snake.prototype.includes = function (pos) {
    var found = false;
    this.segments.forEach( function (snakeSeg) {
      if (Coord.equals(pos,snakeSeg)) {
        found = true;
      }
    });
    return found;
  };

  Snake.prototype.collision = function (pos) {
    var found = false;
    this.segments.slice(1,this.segments.length).forEach( function (snakeSeg) {
      if (Coord.equals(pos,snakeSeg)) {
        found = true;
      }
    }.bind(this));
    return found;
  };


  Snake.prototype.startingSegments = function (pos) {
    var nextPos = pos;
    var segments = [];
    for (var i = 0; i < 5; i++) {
      nextPos = Coord.plus(nextPos, "N");
      segments.push(nextPos);
    }
    return segments;
  };

  Snake.prototype.move = function () {
    var nextPos = Coord.plus(this.head, this.dir);
    if (this.eatApple()) {
      this.score += 10;
      if (this.highScore <= this.score) {
        this.highScore = this.score;
      }
      this.board.apple.replaceApple();
    }

    if (this.validMove(nextPos)) {
      this.segments.unshift(nextPos);
      this.head = this.segments[0];


      if (this.growTurns > 0) {
        this.growTurns -= 1;
      } else {
        this.segments.pop();
      }
    } else {
      this.board.lose = true;
    }

  };

  Snake.prototype.validMove = function (pos) {
    if (pos[0] >= this.board.grid.length ||
        pos[1] >= this.board.grid.length ||
        pos[0] < 0 ||
        pos[1] < 0)
    {
      return false;
    } else if (this.collision(pos)) {
      return false;
    } else {
      return true;
    }
  };

  Snake.prototype.turn = function (newDir) {
    if (!Game.Coord.isOpposite(this.dir,newDir)) {
      this.dir = newDir;
    }
  };

  Snake.prototype.eatApple = function () {
    if (Coord.equals(this.board.apple.position, Coord.plus(this.head, this.dir))) {
      this.growTurns += 3;
      return true;
    } else {
      return false;
    }
  };

  var Board = Game.Board = function () {
    this.grid = this.newGrid();
    this.snake = new Snake(this);
    this.apple = new Apple(this);
    this.apple.replaceApple();
    this.lose = false;
  };

  Board.prototype.newGrid = function() {
    var grid = new Array(40);
    for (var i = 0; i < grid.length; i++) {
      grid[i] = new Array(40);
    }
    return grid;
  };

  Board.prototype.render = function () {
    var string = "";
    for (var i = 0; i < this.grid.length; i++) {
      for (var j = 0; j < this.grid[i].length; j++) {
        string += " ";
        if (this.snake.includes([i,j])) {
          string += " s ";
        } else if (Coord.equals(this.apple.position,[i,j])) {
          string += " a ";
        } else {
          string += " . ";
        }
        string += " ";
      }
      string += "\n";
    }
    return string;
  };

  var Apple = Game.Apple = function (board) {
    this.board = board;
    this.replaceApple();
  };

  Apple.prototype.replaceApple = function () {
    var xCoord = Math.floor(Math.random() * this.board.grid.length);
    var yCoord = Math.floor(Math.random() * this.board.grid.length);
    while (this.board.snake.includes([xCoord,yCoord])) {
      xCoord = Math.floor(Math.random() * this.board.grid.length);
      yCoord = Math.floor(Math.random() * this.board.grid.length);
    };

    this.position = [xCoord,yCoord];
  };

})();

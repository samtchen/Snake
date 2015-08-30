(function() {
  if (typeof Game === "undefined") {
    window.Game = {};
  }

  var View = Game.View = function ($el) {
    this.$el = $el;
    this.paused = false;
    this.board = new Game.Board();
    this.setupGrid();
    this.setupStart();
  };

  View.prototype.setupStart = function () {
    var start = "<button class=start>Start!</button>";
    $('.button').html(start);
    $('.start').one('click',this.start.bind(this));
    $('.prompt').html("Press Start!")
    this.prompt = setInterval(function () {
      $('.prompt').toggleClass("white-font");
    }, 700);
  };

  View.prototype.pause = function () {
    this.paused = true;
    $('.scores').addClass("white-font");
    $('.overlay').removeClass("hidden");
    $('.button').addClass("hidden");
    $('.prompt').html("Press Space To Unpause")
    clearInterval(this.interval);
    this.prompt = setInterval(function () {
      $('.prompt').toggleClass("white-font");
    }, 700);
  }

  View.prototype.pauseHandler = function (event) {
    if (event.keyCode == 32) {
      if (this.paused) {
        this.start();
      } else {
        this.pause();
      }
    }
  }

  View.prototype.start = function () {
    $('body').off();
    this.paused = false;
    clearInterval(this.prompt);
    $('.button').removeClass("hidden");
    $('.prompt').removeClass("white-font");
    $('.scores').removeClass("white-font");
    $('.overlay').addClass("hidden");
    this.bindEvent();
    this.bindPause();
    setTimeout(this.startInterval.bind(this),300);
  };

  View.prototype.bindPause = function () {
    // this.boundPauseHandler = this.pauseHandler.bind(event,this);
    // $('body').on('keydown', this.pauseHandler.bind(event));
    $('body').on('keydown', function (event) {
      if (event.keyCode == 32) {
        if (this.paused) {
          this.start();
        } else {
          this.pause();
        }
      }
    }.bind(this));
  };

  View.prototype.startInterval = function () {
    this.interval = setInterval(this.step.bind(this), 75);
  };

  View.prototype.setupRestart = function () {
    $('.scores').addClass("white-font");
    $('.overlay').removeClass("hidden");
    $('.prompt').html("Game Over!")
    this.prompt = setInterval(function () {
      $('.prompt').toggleClass("white-font");
    }, 700);
    var restart = "<button class=restart>Restart!</button>";
    $('.button').html(restart);
    $('.restart').on('click', this.restart.bind(this));
  };

  View.prototype.restart = function () {
    $('.overlay').removeClass("hidden");
    clearInterval(this.prompt);
    $('.scores').removeClass("white-font");
    $('.prompt').removeClass("white-font");
    $('.overlay').addClass("hidden");
    this.board.snake.reset();
    this.board.lose = false;
    this.start();
  };

  View.prototype.render = function () {
    // none html rendering
    // this.$el.empty();
    // this.$el.text(this.board.render());

    this.updateClasses([this.board.apple.position], "apple");
    this.updateClasses(this.board.snake.segments, "snake");
  };

  View.prototype.updateClasses = function(coords, className) {
    this.$li.filter("." + className).removeClass();

    coords.forEach(function(coord){
      var flatCoord = (coord[0] * this.board.grid.length) + coord[1];
      this.$li.eq(flatCoord).addClass(className);
    }.bind(this));
  };

  View.prototype.setupGrid = function () {
    var html = "";
    for (var i = 0; i < this.board.grid.length; i++) {
      html += "<ul data-col=" + i + ">";
      for (var j = 0; j < this.board.grid.length; j++) {
        html += "<li data-col=" + i + " data-row=" + j + "></li>";
      }
      html += "</ul>";
    }

    this.$el.html(html);
    this.$li = this.$el.find("li");
  }



  View.prototype.bindEvent = function() {
    var that = this;
    $('body').on('keydown',function (event) {
      if (event.keyCode === 87) {
        that.board.snake.turn("N");
        $('body').off('keydown', arguments.callee);
      } else if (event.keyCode === 65) {
        that.board.snake.turn("W");
        $('body').off('keydown', arguments.callee);
      } else if (event.keyCode === 83) {
        that.board.snake.turn("S");
        $('body').off('keydown', arguments.callee);
      } else if (event.keyCode === 68) {
        that.board.snake.turn("E");
        $('body').off('keydown', arguments.callee);
      } else if (event.keyCode == 32) {
        $('body').off('keydown', arguments.callee);
      }
    });
  };

  View.prototype.step = function () {
    this.bindEvent();
    if (!this.board.lose) {
      this.board.snake.move();
      $('.score').html(this.board.snake.score);
      $('.high-score').html(this.board.snake.highScore);
      this.render();
    } else {
      $('body').off();
      clearInterval(this.interval);
      this.setupRestart();
    }
  };


})();

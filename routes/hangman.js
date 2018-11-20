$(document).ready(function() {

  //alphabet
  let alphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h',
        'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's',
        't', 'u', 'v', 'w', 'x', 'y', 'z'];

  //categories
  let movies = $(".movies");
  let songs = $(".songs");
  let celebs = $(".celebrities");
  let hero = $(".superheroes");
  let category = $("#categories");

  //standard variables for game (word itself, lives, bool to check if game is over)
  let wordGuesses = [];
  let lives = 10;
  let gameOver = 0;

  //categories with answers
  let lcat = [["casino royale", "django: unchained", "baby driver", "pirates of the carribbean"],
  ["bohemian rhapsody", "we found love", "thriller", "blank space", "live and let die"],
  ["jack nicholson", "selena gomez", "hailee steinfeld", "leonardo dicaprio", "joaquin phoenix", "kiefer sutherland"],
  ["bruce wayne", "black widow", "doctor stephen strange", "captain america", "spiderman", "miles morales",
  "deadpool"]];

  //random text subtitles for win or lose states
  let winText = ["Blimey! You're a real wordsmith, matey!", "Yo ho ho! Good solving!", "Ye did a good job, Seadog!"];
  let loseText = ["ARGGH! You lost the game and your head, buccaneer!", "Shiver me timbers, good trying scallywag!", "Ahh, looks like ye won't be sailing on the Jolly Roger anytime soon!"];

  let counter = 0;

  //SET UP GAME BASED ON CATEGORY, Pick word at random

  //MOVIES
  movies.on('click', function(ev){

        category.css('display', "none");
        mov = lcat[0];
        word = mov[Math.floor(Math.random()*mov.length)];
        word = word.replace(/\s/g, "-");
        console.log(word);
        buttons();
        createWordGame(word);
        updateGame();
        canvas();
        reset();
  });

  //SONGS
  songs.on('click', function(ev){

        category.css('display', "none");
        mov = lcat[1];
        word = mov[Math.floor(Math.random()*mov.length)];
        word = word.replace(/\s/g, "-");
        console.log(word);
        buttons();
        createWordGame(word);
        updateGame();
        canvas();
        reset();
  });

  //FAMOUS PEOPLE
  celebs.on('click', function(ev){

        category.css('display', "none");
        mov = lcat[2];
        word = mov[Math.floor(Math.random()*mov.length)];
        word = word.replace(/\s/g, "-");
        console.log(word);

        buttons();
        createWordGame(word);
        updateGame();
        canvas();
        reset();
  });

  //SUPERHEROES
  hero.on('click', function(ev){

        category.css('display', "none");
        mov = lcat[3];
        word = mov[Math.floor(Math.random()*mov.length)];
        word = word.replace(/\s/g, "-");
        console.log(word);
        buttons();
        createWordGame(word);
        updateGame();
        canvas();
        reset();
  });


  //hold word
  var createWordGame = function (word)
  {
      //word holder
      var wordHolder = document.getElementById('word');
      var pattern = new RegExp(/[~`!#$%\^&*+=\\[\]\\';,/{}|\\":<>\?]/);
      wordHolder.style.display = 'block';

      var n = 0;

      for (var i = 0; i < word.length; i++)
      {
        var el = document.createElement('p');
        el.className = "elemente";
        if (pattern.test(word[i]))
            el.innerHTML = word[i];
        else if (word[i] === "-")
            el.innerHTML = " ";
        else
        {
            el.innerHTML = "_";
            n++
        }
        wordGuesses.push(el);
        wordHolder.appendChild(el);

      }

      //keep track of guesses that succeed with word's length
      wordLength = n;
      console.log("WORD LENGTH = " + wordLength);

  }

  //ALPHABET BUTTONS
  var buttons = function() {

    document.body.style.backgroundColor = "#F0E68C";

      for (var i = 0; i < alphabet.length; i++)
      {
      var alphabetBUTTS = document.getElementById("alphaButtons");
      alphabetBUTTS.style.display = 'block';
      btn = document.createElement("button");
      btn.className = "btn btn-primary alpha";
      btn.innerHTML = alphabet[i];
      alphabetBUTTS.appendChild(btn);
      check();
      }

  }

  //Play Again BUTTON
  var reset = function() {

      var playAgain = document.getElementById("reset");
      playAgain.style.display = 'block';
      resetbtn = document.createElement("button");
      resetbtn.className = "btn btn-primary retry";
      resetbtn.style.backgroundColor = "#DC143C";
      resetbtn.innerHTML = "Reset Game";
      playAgain.appendChild(resetbtn);
      //choose new category and reset game
      resetbtn.onclick = function() {

        //go back to categories
        console.log("reset game");
        category.css('display', "block");
        lives = 10;
        gameOver = 0;

        //RESET EVERYTHING
        $("#gameOver").html("");
        playAgain.style.display = 'none';
        $("button").remove(".alpha");
        $("p").remove(".elemente");
        $("#reset").html("");
        $("#winorlose").html("");
        $("#word").css("display", "none");
        $("#alphaButtons").css("display", "none");
        $("#hangMAN").css("display", "none");
        wordGuesses = [];

        context.clearRect(0, 0, 400, 400);

        //gradient back to white
        document.body.style.backgroundColor = "white";

      };

  }



  //UPDATE GAME GRAPHICS/TEXT
  var updateGame = function() {

      //state no. of lives left
      console.log(lives + " turns left");

      //reset counter
      counter = 0;

  }

  //check if user guesses letter
  var check = function() {
      btn.onclick = function() {
          if (gameOver === 0)
          {
          var ans = this.innerHTML;
          this.setAttribute("disabled", "disabled");
          this.onclick = null;
          for (var i = 0; i < word.length; i++)
          {
            if (word[i] === ans)
            {
                wordGuesses[i].innerHTML = ans;
                counter += 1;
                wordLength -= 1;
            }
          }
          if (counter <= 0)
          {
            lives--;
            drawMan();
          }
          console.log("WORD LENGTH: " + wordLength);

          //check if word is complete, then WINNER WINNER CHICKEN DINNER!
          if (wordLength === 0)
          {
            var winner = document.getElementById("winorlose");
            var gameText = document.getElementById("gameOver");
            gameText.innerHTML = "YOU WIN!";
            winner.innerHTML = winText[Math.floor(Math.random()*winText.length)];
            gameOver = 1;
          }
          //are there no more turns? then, you lost
          else if (wordLength !== 0 && lives === 0)
          {
            for (var i = 0; i < word.length; i++)
            {
              if (word[i] != "-")
                  wordGuesses[i].innerHTML = word[i];
            }
            var loser = document.getElementById("winorlose");
            var gameText = document.getElementById("gameOver");
            gameText.innerHTML = "You Lose...";
            loser.innerHTML = loseText[Math.floor(Math.random()*loseText.length)];
          }
          else
              //otherwise update the player about current game/turns
              updateGame();

        }
      }
  }

  //ACTUAL HANGMAN DRAWING
  var drawMan = function () {
  var drawMe = lives ;
  drawArray[drawMe]();
  }

  //GET CANVAS ELEMENT
  canvas = function() {
      stickfig = document.getElementById("hangMAN");
      stickfig.style.display = "block";
      context = stickfig.getContext('2d');
      context.beginPath();
      context.strokeStyle = "black";
      context.lineWidth = 2;
  }

  //HEAD FOR STICK FIG
  head = function() {
      stickfig = document.getElementById("hangMAN");
      context = stickfig.getContext('2d');
      context.beginPath();
      context.arc(60, 25, 10, 0, Math.PI*2, true);
      context.stroke();
  }

  //DRAW FROM COORDINATES
  draw = function($pathFromx, $pathFromy, $pathTox, $pathToy) {

    context.moveTo($pathFromx, $pathFromy);
    context.lineTo($pathTox, $pathToy);
    context.stroke();
}

//DRAWN FRAMES FOR WHEN USER GETS LETTER WRONG
frame1 = function() {
    draw (0, 125, 100, 125);
  };

  frame2 = function() {
    draw (10, 0, 10, 125);
  };

  frame3 = function() {
    draw (0, 5, 70, 5);
  };

  frame4 = function() {
    draw (60, 5, 60, 15);
  };

  torso = function() {
    draw (60, 36, 60, 70);
  };

  rightArm = function() {
    draw (60, 40, 80, 50);
  };

  leftArm = function() {
    draw (60, 40, 40, 50);
  };

  rightLeg = function() {
    draw (60, 70, 80, 90);
  };

  leftLeg = function() {
    draw (60, 70, 40, 90);
  };

 //ORDER IS BACKWARDS
 drawArray = [rightLeg, leftLeg, rightArm, leftArm,  torso,  head, frame4, frame3, frame2, frame1];

});

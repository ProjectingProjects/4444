$(document).ready(function() {
  //players defined
  let p1 = "X";
  let p2 = "O";
  //whose turn is it?
  let turn = 1;
  //total moves
  let tMoves = 0;

  //bool that game is done
  let gameOver = 0;

  //Points
  let xPt = 0;
  let oPt = 0;

  let ut = $(".unit");
  let winnerContainer = $(".winner");
  let reset = $(".reset");
  let xPoints = $(".Xpoints");
  let oPoints = $(".Opoints");

  xPoints.html("X: " + xPt);
  oPoints.html("O: " + oPt);

  //click on square interaction
  ut.on('click', function(ev){

    if (gameOver == 0)
    {
      if (turn == 1 && event.target.innerHTML != p2 && event.target.innerHTML != p1)
      {
        event.target.innerHTML = p1;
        event.target.style.color = "#C18C45";
        event.target.style.fontFamily = "bradley gratis";
        tMoves++;
        turn--;
      }
      else if (turn == 0 && event.target.innerHTML != p1 && event.target.innerHTML != p2)
      {
        event.target.innerHTML = p2;
        event.target.style.color = "#006994";
        event.target.style.fontFamily = "bradley gratis";
        tMoves++;
        turn++;
      }
  }

    if(winState()) {
      let winner = turn === 1 ?p2 : p1;
      theWinnerIs(winner);
    }

    console.log(tMoves);

  });

  //Reset
  reset.on('click', (e) => {
    var moves = Array.prototype.slice.call($(".unit"));
    moves.map((m) => {
        m.innerHTML = "";
    });
    winnerContainer.html('');
    winnerContainer.css('display', "none");
    turn = 1;
    tMoves = 0;
    gameOver = 0;
});


  //check if win condition exists
  function winState() {
    if (tMoves >= 5) {
      let moves = Array.prototype.slice.call($(".unit"));
      let result = moves.map(function(unit){
        return unit.innerHTML;
      });

      //list of wins
      let winCombos = [
        [0,1,2],
        [3,4,5],
        [6,7,8],
        [0,3,6],
        [1,4,7],
        [2,5,8],
        [0,4,8],
        [2,4,6]
      ];

      return winCombos.find(function(combo){
          if (result[combo[0]] !== "" && result[combo[1]] !== "" && result[combo[2]] !== "" && result[combo[0]] === result[combo[1]] && result[combo[1]] === result[combo[2]]) {
                return true;
            } else {
                return false;
            }
      });
    }
  }

  //State Winner
  function theWinnerIs(person) {
    if (gameOver != 1)
    {
    winnerContainer.css('display', "block");
    reset.css('display', 'block');
    person = person === p1 ? 'X' : 'O';
    winnerContainer.html(person + " Wins!");
    if (person == 'X')
    {
        xPt++;
        xPoints.html("X: " + xPt);
    }
    else
    {
        oPt++;
        oPoints.html("O: " + oPt);
    }

    gameOver = 1;
  }
}

});

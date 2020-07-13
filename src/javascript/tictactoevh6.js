var n;
var playerTurn = false;
var origBoard;
var p1Score = 0;
var p2Score = 0;
var ties = 0;
const Player1 = 'X';
const Player2 = 'O';
var winstreak = [0,0,0,0];
var player1 = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
var player2 = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];

const cells = document.querySelectorAll('.cell');
startGame();

function startGame(){
    document.querySelector(".endgame").style.display = "none";
    origBoard = Array.from(Array(42).keys());
    for(var i =0; i<cells.length; i++){
	cells[i].innerText='';
	cells[i].style.removeProperty('background-color');
	cells[i].addEventListener('click', turnClick, false);
    }
    if(playerTurn)
	n=2;
    else
	n=1;
}

function turnClick(square){
    if(typeof origBoard[square.target.id] == 'number'){
	if(n%2==1){
	    turn(square.target.id, Player1);
	    cells[square.target.id].removeEventListener('click', turnClick, false);
	}
	else{
	    turn(square.target.id, Player2);
	    cells[square.target.id].removeEventListener('click', turnClick, false);
	}
    }
    n++;
}

function turn(squareId, player){
    origBoard[squareId] = player;
    document.getElementById(squareId).innerText = player;
    
    let gameWon = checkWin(origBoard, player);
    if (gameWon) gameOver(gameWon);
}

function checkWin(board, player){
    let gameWon = null;
    var win = winner(convertBoard(origBoard));
    if ((win === 1)||(win === 2))
    {
	gameWon = {player: player};
    }
    if(gameWon == null)
	checkTie();
    return gameWon;
}

function gameOver(gameWon){
    for(var i=0; i<4; i++){
	var l =document.getElementById('tic').rows[Math.floor(winstreak[i]/7)].cells;
	l[winstreak[i]%7].style.backgroundColor = gameWon.player == Player1 ? "blue" : "red";
    }
    for(var i=0; i<cells.length; i++){
	cells[i].removeEventListener('click', turnClick, false);
    }
    if(gameWon.player == Player1){
	p1Score++;
	var x=document.getElementById('leaderboard').rows[1].cells;
	x[0].innerHTML=p1Score;
    }
    else if(gameWon.player == Player2){
	p2Score++;
	var x=document.getElementById('leaderboard').rows[1].cells;
	x[2].innerHTML=p2Score;
    }
    declareWinner(gameWon.player == Player1 ? "Player 1 wins!" : "Player 2 wins!");
}

function declareWinner(who){
    document.querySelector(".endgame").style.display = "block";
    document.querySelector(".endgame .text").innerText = who;
}

function emptySquares(){
    return origBoard.filter(s => typeof s == 'number');
}

function playerMove(b){
    playerTurn=b;
}

function resetLeaderBoard(){
    aiScore = 0;
    huScore = 0;
    ties = 0;
    var x=document.getElementById('leaderboard').rows[1].cells;
    x[2].innerHTML=aiScore;
    var x=document.getElementById('leaderboard').rows[1].cells;
    x[0].innerHTML=huScore;
    var x=document.getElementById('leaderboard').rows[1].cells;
    x[1].innerHTML=ties;
}

function convertBoard(origBoard){
    var newBoard = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
    for(var i=0; i<42; i++){
	if(origBoard[i]==='X'){
	    newBoard[i]=2;
	}
	else if(origBoard[i]==='O'){
	    newBoard[i]=1;
	}
	else
	    newBoard[i]=0;
    }
    return newBoard;
}


function checkTie(){
    if(winner(convertBoard(origBoard))===4){
	
	for(var i = 0; i<cells.length; i++){
	    cells[i].style.backgroundColor = "green";
	    cells[i].removeEventListener('click', turnClick, false);
	}
	declareWinner("Tie!");
	ties++;
	var x=document.getElementById('leaderboard').rows[1].cells;
	x[1].innerText=ties;
	return true;
    }
    return false;
}

function winner(A){
    for(var i=0;i<6;i++){
        for(var j=0;j<=3;j++){
            var u = i*7+j;
            if(A[u]==A[u+1]&&A[u+2]==A[u+3]&&A[u]==A[u+3]&&A[u]!=0){
                winstreak [0] = (u);
                winstreak [1] = (u+1);
                winstreak [2] = (u+2);
                winstreak [3] = (u+3);
                return A[u];
            }
        }
    }
    for(var i=0;i<7;i++){
        for(var j=0;j<=2;j++){
            var u = j*7+i;
            if(A[u]==A[u+7]&&A[u+14]==A[u+21]&&A[u]==A[u+14]&&A[u]!=0){
                winstreak [0] = (u);
                winstreak [1] = (u+7);
                winstreak [2] = (u+14);
                winstreak [3] = (u+21);
                return A[u];
            }
        }
    }
    for(var i=0;i<3;i++){
        for(var j=0;j<4;j++){
            var u = (i*7+j);
            if(A[u+8]==A[u+16]&&A[u]==A[u+24]&&A[u]==A[u+8]&&A[u]!=0){
                winstreak [0] = (u);
                winstreak [1] = (u+8);
                winstreak [2] = (u+16);
                winstreak [3] = (u+24);
                return A[u];
            }
        }
    }
    for(var i=0;i<3;i++){
        for(var j=3;j<7;j++){
            var u = (i*7+j);
            if(A[u]==A[u+6]&&A[u+12]==A[u+18]&&A[u]==A[u+12]&&A[u]!=0){
                winstreak [0] = (u);
                winstreak [1] = (u+6);
                winstreak [2] = (u+12);
                winstreak [3] = (u+18);
                return A[u];
            }
        }
    }
    var k = false;
    for(var i=0;i<42;i++){
        if(A[i]==0){
            k=true;
            break;
        }
    }
    if(!k){
        return 4;
    }
    return 0;
}


function changeTheme(x){
    if(x==1){
	document.body.style.backgroundImage = "url('rovertic.png')";
	var elements = document.querySelectorAll('.cell');
	for (var i = 0; i < elements.length; i++) {
	    elements[i].style.borderColor="white";
	    elements[i].style.color="white";
	}
	document.getElementById("rbutton").style.backgroundColor = "#234723";
	document.getElementById("rbutton").style.color = "white";

	document.getElementById("resetbutton").style.backgroundColor = "#234732";
	document.getElementById("resetbutton").style.color = "white";	

	var t = document.getElementsByClassName("diff");
	for (var i = 0; i <t.length; i++) {
	    t[i].style.backgroundColor="#234723";
	    t[i].style.color="white";
	}
	var f = document.getElementsByClassName("stp");
	for (var i = 0; i <f.length; i++) {
	    f[i].style.backgroundColor="#234723";
	    f[i].style.color="white";
	}
	var s = document.getElementsByClassName("ch");
	for (var i = 0; i <s.length; i++) {
	    s[i].style.backgroundColor="#234723";
	    s[i].style.color="white";
	}
	var m = document.getElementsByClassName("mbutton");
	for (var i = 0; i <m.length; i++) {
	    m[i].style.backgroundColor="#234723";
	    m[i].style.color="white";
	}
	document.getElementById("lboard").style.backgroundColor = "#444444";
	document.getElementById("dboard").style.backgroundColor = "#444444";
    }
    if(x==2){
	document.body.style.backgroundImage = "url('bg2.png')";
	var elements = document.querySelectorAll('.cell');
	for (var i = 0; i < elements.length; i++) {
	    elements[i].style.borderColor="black";
	    elements[i].style.color="black";
	}
	document.getElementById("rbutton").style.backgroundColor = "#222222";
	document.getElementById("rbutton").style.color = "white";
	document.getElementById("resetbutton").style.backgroundColor = "#222222";
	document.getElementById("resetbutton").style.color = "white";
	
	var t = document.getElementsByClassName("diff");
	for (var i = 0; i <t.length; i++) {
	    t[i].style.backgroundColor="#222222";
	    t[i].style.color="white";
	}
	var f = document.getElementsByClassName("stp");
	for (var i = 0; i <f.length; i++) {
	    f[i].style.color="white";
	    f[i].style.backgroundColor="#222222";
	}
	var s = document.getElementsByClassName("ch");
	for (var i = 0; i <s.length; i++) {
	    s[i].style.backgroundColor="#222222";
	    s[i].style.color="white";
	}
	var m = document.getElementsByClassName("mbutton");
	for (var i = 0; i <m.length; i++) {
	    m[i].style.backgroundColor="#222222";
	    m[i].style.color="white";
	}
	document.getElementById("lboard").style.backgroundColor = "#444444";
	document.getElementById("dboard").style.backgroundColor = "#444444";
    }
    
    if(x==3){
	document.body.style.backgroundImage = "url('bg3.png')";
	var elements = document.querySelectorAll('.cell');
	for (var i = 0; i < elements.length; i++) {
	    elements[i].style.borderColor="white";
	    elements[i].style.color="white";
	}
	document.getElementById("rbutton").style.backgroundColor = "#999999";
	document.getElementById("rbutton").style.color = "black";
	document.getElementById("resetbutton").style.backgroundColor = "#999999";
	document.getElementById("resetbutton").style.color = "black";
	
	var t = document.getElementsByClassName("diff");
	for (var i = 0; i <t.length; i++) {
	    t[i].style.backgroundColor="#999999";
	    t[i].style.color="black";
	}
	var f = document.getElementsByClassName("stp");
	for (var i = 0; i <f.length; i++) {
	    f[i].style.backgroundColor="#999999";
	    f[i].style.color="black";
	}
	var s = document.getElementsByClassName("ch");
	for (var i = 0; i <s.length; i++) {
	    s[i].style.backgroundColor="#999999";
	    s[i].style.color="black";
	}
	var m = document.getElementsByClassName("mbutton");
	for (var i = 0; i <m.length; i++) {
	    m[i].style.backgroundColor="#999999";
	    m[i].style.color="black";
	}
	document.getElementById("lboard").style.backgroundColor = "#444444";
	document.getElementById("dboard").style.backgroundColor = "#444444";
    }
}

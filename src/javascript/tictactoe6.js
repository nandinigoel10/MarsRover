var playerTurn=true;
var difficulty=3;
var aiScore = 0;
var test;
var h=0;
var depth=0;
var limit=8;
var huScore = 0;
var ties = 0;
var isWon = false;
const huPlayer = 'O';
const aiPlayer = 'X';
var winstreak = [0,0,0,0];
var player1 = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
var player2 = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
var x = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
var moves = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];

const cells = document.querySelectorAll('.cell');
startGame();
function playerMove(b){
    playerTurn = b;
}

function startNew(){
    h=0;
    isWon=false;
    startGame();
}

function startGame(){
    document.querySelector(".endgame").style.display = "none";
    origBoard = Array.from(Array(42).keys());
    for(var i =0; i<cells.length; i++){
	cells[i].innerText='';
	cells[i].style.removeProperty('background-color');
	cells[i].addEventListener('click', turnClick, false);
    }
    if(!playerTurn){
	turn(bestSpot(), aiPlayer);
    }
}

function turnClick(square){
     for(var i =0; i<cells.length; i++){
	cells[i].style.removeProperty('background-color');
    }
    if(typeof origBoard[square.target.id] == 'number'){
	turn(square.target.id, huPlayer);
	turn(bestSpot(), aiPlayer);
	checkTie();
    }
}

function turn(squareId, player){
    if(!isWon){
    origBoard[squareId] = player;
    document.getElementById(squareId).innerText = player;
    let gameWon = checkWin(origBoard, player);
    if (gameWon) gameOver(gameWon);
    }
}

function checkWin(board, player){
    let gameWon = null;
    var win = winner(convertBoard(origBoard));
    if ((win === 1)||(win === 2))
    {
	gameWon = {player: player};
	isWon=true;
    }    
    return gameWon;
}

function setDiff(d){
    difficulty=d;
}

function gameOver(gameWon){
    for(var i=0; i<4; i++){
	var l =document.getElementById('tic').rows[Math.floor(winstreak[i]/7)].cells;
	l[winstreak[i]%7].style.backgroundColor = gameWon.player == huPlayer ? "blue" : "red";
  }
    for(var i=0; i<cells.length; i++){
	cells[i].removeEventListener('click', turnClick, false);
    }
    if(gameWon.player == huPlayer){
	huScore++;
	var x=document.getElementById('leaderboard').rows[1].cells;
	x[0].innerHTML=huScore;
    }
    else if(gameWon.player == aiPlayer){
	aiScore++;
	var x=document.getElementById('leaderboard').rows[1].cells;
	x[2].innerHTML=aiScore;
    }
    declareWinner(gameWon.player == huPlayer ? "You win!" : "You Lose!");
}

function declareWinner(who){
    document.querySelector(".endgame").style.display = "block";
    document.querySelector(".endgame .text").innerText = who;
}

function emptySquares(){
    return origBoard.filter(s => typeof s == 'number');
}

function recurse(b){
    var y = winner(b);
    if(y==1)
        return 1;
    else if(y==2)
        return -1;
    else if(y==4)
        return 0;
    if(depth>=limit)
        return 0;
    var countx=0;
    var counto=0;
    for(var i=0;i<42;i++){
        if(b[i]==1)
            countx++;
        else if (b[i]==2)
            counto++;
    }
    var player2turn=false;
    var num =  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
    var n=1;
    if(countx>counto){
        player2turn=true;
        n=2;
    }
    var best = run(b);
    var d =  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
    for(var j=0;j<42;j++)
        d[j]=b[j];
    for(var i=0;i<42;i++){
	if(b[i]!=0){
	    num[i]=100;
	}
	else{
	    if(player2turn)
		num[i]=1;
	    else{
		num[i]=-1;
	    }
	}
    }
    for(var i=0;i<best.length;i++){
        if(b[best[i]]==0){
            d[best[i]]=n;
            depth ++;
            num[best[i]]= recurse(d);
            depth--;
            d[best[i]]=0;
        }
    }
    var min = 100;
    var max = -100;
    for(var i=0;i<42;i++){
        if(num[i]<min&&num[i]!=100)
            min = num[i];
        if(num[i]>max&&num[i]!=100)
            max = num[i];
    }
    if(depth==0){
        for(var i=0;i<42;i++){
            if(player2turn)
                player2[i]=num[i];
            else
                player1[i]=num[i];
        }
    }
    if(player2turn)
        return min;
    else
        return max;
}
function convertBoard(origBoard){
    var newBoard =[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
    if(playerTurn){
	var x = 'X';
	var o = 'O';
    }
    else{
	var x = 'O';
	var o = 'X';
    }
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

function findSpot(x){
    var winmove;
    var c=0;
    if(difficulty == 0){
	winmove = 50;
    }
    else if(difficulty == 1){
	winmove = 65;
    }
    else if(difficulty == 2){
	winmove = 80;
    }
    else if(difficulty == 3){
	winmove = 100;
    }
    var e = Math.floor(Math.random()*100);
    if(e<winmove){
	c=1
    }
    if(c===1){
	var u = run(x);
	/*recurse(x);
	console.log(player1);
	console.log(player2);
	console.log(u);
	if(typeof(u)=="number"){
	    return u;
	}
	else {
	    return u[0];
	}*/
	return u;
    }
    else{
	return randomchoice(x);
    }
}


function bestSpot(){
    return findSpot(convertBoard(origBoard));   
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

function randomchoice(b){
    var p=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
    var n=0;
    for(var i=0;i<42;i++){
        if(b[i]==0){
            n++;
        }
    }
    p=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
    var a=0;
    for(var i=0;i<42;i++){
        if(b[i]==0){
            p[a]=i;
            a++;
        }
    }
    n = Math.floor(Math.random()*a);
    return p[n];
}

function run(b){
    var countx=0;
    var counto=0;
    for(var i=0;i<42;i++){
        if(b[i]==1)
            countx++;
        else if (b[i]==2)
            counto++;
    }
    var n1=0;
    var n2=0;
    if(playerTurn){
	if(countx==counto){
            n1=1;
            n2=2;
	}
	else {
            n1=2;
            n2=1;
	}
    }
    else{
	if(countx==counto){
            n1=2;
            n2=1;
	}
	else {
            n1=1;
            n2=2;
	}
    }
    var attacklist = [[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]];
    
    var blocklist = [[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]];
    
    var d=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
    for(var i=0;i<42;i++){
        d[i]=b[i];
    }
    for(var i=0;i<42;i++){
        if(b[i]==0){
            d[i]=n1;
            var c = attack(d,n1);
            var g = block(d,n1);
            attacklist[i] = c;
            blocklist[i] = g;
            d[i]=0;
        }
    }
    for(var i =0;i<42;i++){
        if(b[i]==0){
            if(attacklist[i][3]>0){
                return i;
            }
        }
    }
    var v;
    for(v=0;v<42;v++){
        if(b[v]==0){
            break;
        }
    }
    var m = blocklist[v][3];
    for(var i=(v+1);i<42;i++){
        if(b[i]==0){
            if(blocklist[i][3]>m){
                
                return i;
            }
            else if(blocklist[i][3]<m){
                return v;
            }
        }
    }
    for(var i =0;i<42;i++){
        if(b[i]==0){
            if(attacklist[i][2]>=2){
                return i;
            }
        }
    }
    var attacklistenemy = [[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]];
    test = false;
    for(var i=0;i<42;i++){
        if(b[i]==0){
            d[i]=n2;
            var c = attack(d,n2);
            attacklistenemy[i] = c;
            d[i]=0;
        }
    }
    test = true;
    attacklist = correct(attacklist,b);
    blocklist = correct(blocklist,b);
    var moveValue = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
    for(var i=0;i<42;i++){
        var sum=0;
        if(attacklistenemy[i][2]>=2){
            sum=sum+(attacklistenemy[i][2]*60000);
        }
        sum = sum+(attacklist[i][2]*400000);
        sum = sum+(blocklist[i][2]*1000);
        sum = sum+(attacklist[i][1]*10000);
        sum = sum+(blocklist[i][1]*100);
        sum = sum+(attacklist[i][0]*10);
        sum = sum+(blocklist[i][0]*1);
        moveValue[i] = sum;
    }
    var pos=choose(moveValue);	    
    //var w = bestMoves(moveValue);
    /*for(var i = 0; i<w.length; i++){
	cells[w[i]].style.backgroundColor = "green";
    }*/
    if(pos==null||b[pos]!=0){
	return randomchoice(b);
    }
    return pos;
    //return w;
}
function correct(x,b){
    var a = [[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]];
    
    for(var i=0;i<42;i++){
        for(var j=0;j<4;j++){
            a[i][j] = x[i][j];
        }
    }
    for(var j=0;j<4;j++){
        var min = 1000;
        for(var i=0;i<42;i++){
            if(b[i]==0){
                if(min>x[i][j]){
                    min=x[i][j];
                }
            }
        }
        for(var i=0;i<42;i++){
            if(b[i]==0){
                a[i][j] = x[i][j]-min;
            }
        }
    }
    return a;
}
function choose(x){
    var max=0;
    for(var i=0;i<42;i++){
        if(max<x[i]){
            max=x[i];
        }
    }
    var p =[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
    var sum=0;
    for(var i=0;i<42;i++){
        if(x[i]/max>0.5){
            p[i]=x[i];
        }
        else{
            p[i]=0;
        }
        sum+=p[i];
    }
    var y = Math.floor(Math.random()*sum);
    sum=0;
    var i=0;
    for(i=0;i<42;i++){
        sum+=p[i];
        if(sum>y){
            break;
        }
    }
    //console.log(p);
    return i;
}
function bestMoves(x){
    var max=0;
    for(var i=0;i<42;i++){
        if(max<x[i]){
            max=x[i];
        }
    }
    var p =[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
    var n=0;
    for(var i=0;i<42;i++){
        if(x[i]/max>0.5){
            p[i]=x[i];
        }
        else{
            p[i]=0;
        }
    }
    var t=[0];
    for(var i=0;i<42;i++){
	if(p[i]!=0){
	    t[n]=i;
	    n++;
	}
    }
    return t;
}
function block(A, q){
    var blocks=[0,0,0,0];
    
    for(var i=0;i<4;i++){
        blocks[i]=0;
    }
    for(var i=0;i<6;i++){
        for(var j=0;j<=3;j++){
            var u = i*7+j;
            var isblocked = false;
            for(var k=0;k<4;k++){
                if(A[u+k]==q){
                    isblocked = true;
                    break;
                }
            }
            var h =0;
            if(isblocked){
                for(var k=0;k<4;k++){
                    if(A[u+k]!=q&&A[u+k]!=0){
                        h++;
                    }
                }
            }
            blocks[h]++;
        }
    }
    for(var i=0;i<7;i++){
        for(var j=0;j<=2;j++){
            var u = j*7+i;
            var isblocked = false;
            for(var k=0;k<4;k++){
                if(A[u+(k*7)]==q){
                    isblocked = true;
                    break;
                }
            }
            var h =0;
            if(isblocked){
                for(var k=0;k<4;k++){
                    if(A[u+(k*7)]!=q&&A[u+(k*7)]!=0){
                        h++;
                    }
                }
            }
            blocks[h]++;
        }
    }
    for(var i=0;i<3;i++){
        for(var j=0;j<4;j++){
            var u = (i*7+j);
            var isblocked = false;
            for(var k=0;k<4;k++){
                if(A[u+(k*8)]==q){
                    isblocked = true;
                    break;
                }
            }
            var h =0;
            if(isblocked){
                for(var k=0;k<4;k++){
                    if(A[u+(k*8)]!=q&&A[u+(k*8)]!=0){
                        h++;
                    }
                }
            }
            blocks[h]++;
        }
    }
    for(var i=0;i<3;i++){
        for(var j=3;j<7;j++){
            var u = (i*7+j);
            var isblocked = false;
            for(var k=0;k<4;k++){
                if(A[u+(k*6)]==q){
                    isblocked = true;
                    break;
                }
            }
            var h =0;
            if(isblocked){
                for(var k=0;k<4;k++){
                    if(A[u+(k*6)]!=q&&A[u+(k*6)]!=0){
                        h++;
                    }
                }
            }
            blocks[h]++;
        }
    }
    return blocks;
}
function attack(A,q){
    var attacks = [0,0,0,0];
    for(var i=0;i<4;i++){
        attacks[i]=0;
    }
    for(var i=0;i<6;i++){
        for(var j=0;j<=3;j++){
            var u = i*7+j;
            var isblocked = false;
            for(var k=0;k<4;k++){
                if(A[u+k]!=q&&A[u+k]!=0){
                    isblocked = true;
                    break;
                }
            }
            var h =0;
            if(!isblocked){
                for(var k=0;k<4;k++){
                    if(A[u+k]==q){
                        h++;
                    }
                }
            }
            if(h!=0){
                attacks[h-1]++;
            }
        }
    }
    for(var i=0;i<7;i++){
        for(var j=0;j<=2;j++){
            var u = j*7+i;
            var isblocked = false;
            for(var k=0;k<4;k++){
                if(A[u+(k*7)]!=q&&A[u+(k*7)]!=0){
                    isblocked = true;
                    break;
                }
            }
            var h =0;
            if(!isblocked){
                for(var k=0;k<4;k++){
                    if(A[u+(k*7)]==q){
                        h++;
                    }
                }
            }
            if(h!=0){
                attacks[h-1]++;
            }
        }
    }
    for(var i=0;i<3;i++){
        for(var j=0;j<4;j++){
            var u = (i*7+j);
            var isblocked = false;
            for(var k=0;k<4;k++){
                if(A[u+(k*8)]!=q&&A[u+(k*8)]!=0){
                    isblocked = true;
                    break;
                }
            }
            var h =0;
            if(!isblocked){
                for(var k=0;k<4;k++){
                    if(A[u+(k*8)]==q){
                        h++;
                    }
                }
            }
	    
            if(h!=0){
                attacks[h-1]++;
            }
        }
    }
    for(var i=0;i<3;i++){
        for(var j=3;j<7;j++){
            var u = (i*7+j);
            var isblocked = false;
            for(var k=0;k<4;k++){
                if(A[u+(k*6)]!=q&&A[u+(k*6)]!=0){
                    isblocked = true;
                    break;
                }
            }
            var h =0;
            if(!isblocked){
                for(var k=0;k<4;k++){
                    if(A[u+(k*6)]==q){
                        h++;
                    }
                }
            }
            if(h!=0){
                attacks[h-1]++;
            }
        }
    }
    return attacks;
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

function giveHint(){
    return findSpot(convertBoard(origBoard));  
}

function showHint(){
    if(h<3){
	document.getElementById(giveHint()).style.backgroundColor = "#9ad333";
	h++;
    }
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
	document.getElementById("hint").style.backgroundColor = "#234732";
	document.getElementById("hint").style.color = "white";
	

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
	document.getElementById("hint").style.backgroundColor = "#222222";
	document.getElementById("hint").style.color = "white";
	
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
	document.getElementById("hint").style.backgroundColor = "#999999";
	document.getElementById("hint").style.color = "black";
	
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

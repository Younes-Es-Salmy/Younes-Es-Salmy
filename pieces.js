//Black Pieces
var r = {
    piece : "Rook",
    name : "R",
    img : "Chess_Pieces/B/r.png",
    player : "black",
   pinned : false,
 x:null,
 y:null,
 mvs:new Array(),
    moved : false

}

var n = {
    piece : "Knight",
    name : "N",
    img : "Chess_Pieces/B/n.png",
    player : "black",
   pinned : false,
 x:null,
 y:null,
 mvs:new Array()

}

var b = {
    piece : "Bishop",
    name : "B",
    img : "Chess_Pieces/B/b.png",
    player : "black",
   pinned : false,
 x:null,
 y:null,
 mvs:new Array()
}

var q = {
    piece : "Queen",
    name : "Q",
    img : "Chess_Pieces/B/q.png",
    player : "black",
   pinned : false,
 x:null,
 y:null,
 mvs:new Array()
}

var k = {
    piece : "King",
    name : "K",
    img : "Chess_Pieces/B/k.png",
    player : "black"
}

var p = {
    piece : "Pawn",
    name : "P",
    img : "Chess_Pieces/B/p.png",
    player : "black",
   pinned : false,
 x:null,
 y:null,
 mvs:new Array(),
    enPassant : true
}
//White Pieces
var R = {
    piece : "Rook",
    name : "R",
    img : "Chess_Pieces/W/R.png",
    player : "white",
   pinned : false,
 x:null,
 y:null,
 mvs:new Array(),
    moved : false

}

var N = {
    piece : "Knight",
    name : "N",
    img : "Chess_Pieces/W/N.png",
    player : "white",
   pinned : false,
 x:null,
 y:null,
 mvs:new Array()
}

var B = {
    piece : "Bishop",
    name : "B",
    img : "Chess_Pieces/W/B.png",
    player : "white",
   pinned : false,
 x:null,
 y:null,
 mvs:new Array()
}

var Q = {
    piece : "Queen",
    name : "Q",
    img : "Chess_Pieces/W/Q.png",
    player : "white",
   pinned : false,
 x:null,
 y:null,
 mvs:new Array()
}

var K = {
    piece : "King",
    name : "K",
    img : "Chess_Pieces/W/K.png",
    player : "white",
    moved : false
}

var P = {
    piece : "Pawn",
    name : "P",
    img : "Chess_Pieces/W/P.png",
    player : "white",
   pinned : false,
 x:null,
 y:null,
 mvs:new Array(),
    enPassant : true
}

var e = null;
var Board = new Array(8).fill(null).map(() => (new Array(8)));


Board[7][0] = Object.assign({},R);
Board[7][1] = Object.assign({},N);
Board[7][2] = Object.assign({},B);
Board[7][3] = Object.assign({},Q);
Board[7][4] = Object.assign({},K);
Board[7][5] = Object.assign({},B);
Board[7][6] = Object.assign({},N);
Board[7][7] = Object.assign({},R);

//Board[6][4] = Object.assign({},P);

Board[6] = Board[6].fill(null).map(() => (Object.assign({},P)));


Board[0][0] = Object.assign({},r);
Board[0][1] = Object.assign({},n);
Board[0][2] = Object.assign({},b);
Board[0][3] = Object.assign({},q);
Board[0][4] = Object.assign({},k);
Board[0][5] = Object.assign({},b);
Board[0][6] = Object.assign({},n);
Board[0][7] = Object.assign({},r);

Board[1] = Board[1].fill(null).map(() => (Object.assign({},p)));

//test
//Board[2][4] = Object.assign({},r);
//Board[1][0].pinned = true;
//


var board = document.getElementById("board");

//draw cell
function drawCell(x,y){
	var row = board.querySelectorAll("#board tr")[x];
	var cell = row.querySelectorAll("td")[y];
	//cell.innerHTML = "";
	var imgRev = document.getElementById("cell"+x+y);
	if(imgRev){
		imgRev.parentNode.removeChild(imgRev);
	}
	if(Board[x][y] != null){
	    var img = document.createElement("img");
	    img.className = "piece";
	    img.id = "cell"+x+y;
	    img.src = Board[x][y].img;
	    cell.appendChild(img);
    }
}
//draw board
function drawBoard(){
	
	var gray = true;
	var circles =  document.getElementsByClassName("moveCircle");
	while(circles[0]){
		circles[0].parentNode.removeChild(circles[0]);
	}
	for(var x = 0;x<8;x++){
		var row = board.querySelectorAll("#board tr")[x];
		for(var y = 0;y<8;y++){
			var cell = row.querySelectorAll("td")[y];
			if(gray){
	            cell.style.backgroundColor = "#f1f5e1";
	        }else{
	            cell.style.backgroundColor = "#628a0e";
	        }
	        drawCell(x,y);
	        gray = !gray;
		}
		gray = !gray;
	}

}
//create  board
function createBoard(){
	var boardRef = document.getElementById("board")
	var gray = false;
	for(var x = 0;x<8;x++){
	    var row = boardRef.insertRow(x);
	    for(var y = 0;y<8;y++){
	        var cell = row.insertCell(y);
	        cell.setAttribute("onclick","legalMoves(this)");
	        cell.className = "square";
	        /*if(y == 0 || x == 7){
	        	var cellName = document.createElement("span");
	        	cellName.className = "cellName";
	        	cell.appendChild(cellName);
	        	if(y == 0){
	        		cellName.innerText = 8-x;
	        		cellName.style.top = 5 + "px";
	        		cellName.style.left = 5 + "px";
	        	}if(x == 7){
	        		if(y == 0){
	        			cell.appendChild(cellName.cloneNode(true));
	        		}
	        		cellName.innerText = String.fromCharCode(97+y);
	        		cellName.style.top = cell.offsetHeight - 25 + "px";
	        		cellName.style.left = cell.offsetWidth - 20 + "px";
	        	}
	        	if(gray){
	            	cell.style.color = "#f1f5e1";
		        }else{
		            cell.style.color = "#628a0e";
		        }
	        }*/
	        gray = !gray;
	    }
	    gray = !gray;
	}
}
createBoard();
drawBoard();
//Public Variables
var whiteToPlay = true;
var moves = new Array();//Allowed Moves
var enPassant = {x : null,y : null,p : null};
var selectedPiece = {x : null,y : null,p:null,n:null};
var promotionWhite = [
	Object.assign({},Q),
	Object.assign({},N),
	Object.assign({},R),
	Object.assign({},B)
];
var promotionBlack = [
	Object.assign({},q),
	Object.assign({},n),
	Object.assign({},r),
	Object.assign({},b)
];
var toPromot = false;
var promotionSquare = {x:null,y:null};
var checked = false;
var protectedSquares = new Array();//for king movements
var allowedMoves = new Array();//for stalemate
var castling = false;
var checkAllowedMoves = new Array();
var started = false;

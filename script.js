//Drawing the board
function onBoard(x,y){
	return x >= 0 && x <=7 && y>=0 && y<=7;
}

//return the html object of an given cell by cords
function cellByCords(x, y) {
	var row = board.querySelectorAll("#board tr")[x];
	return row.querySelectorAll("td")[y];
}
//check if there is a piece in the given cords
function cellCheck(x, y) {
	if (Board[x][y] == null)
		return null;
	else
		return Board[x][y].player;
}

function inCam(x,y){
	for(var i = 0;i<checkAllowedMoves.length;i++){
		if(checkAllowedMoves[i].x == x && checkAllowedMoves[i].y == y){
			return true;
		}
	}
	return false;
}

//draw piece legal moves
function drawMoves(x, y) {
	if(!checked || (checked && inCam(x,y)) || selectedPiece.n == "K"){
		moves.push(new Array(2));
		moves[moves.length - 1][0] = x;
		moves[moves.length - 1][1] = y;
		cell = cellByCords(x, y);
		var circle = document.createElement("div");
		cell.appendChild(circle);
		circle.className = "moveCircle";
		circle.style.left = cell.offsetWidth / 2 - circle.offsetWidth / 2 + "px";
		circle.style.top = cell.offsetHeight / 2 - circle.offsetHeight / 2 + "px";
	}
}
//debug
function Check(x,y,color = "red"){
	if(color == "red") return;
	if(color == "gold") return;
	var table = document.getElementById("board");
	var cell = table.querySelectorAll("tr")[x].querySelectorAll("td")[y];
	cell.style.backgroundColor = color;
	cell.style.border = "1px solid black";
}""
//check if he clicked on a cell that he allowed to move to 
function inMoves(x, y) {
	for (var i = 0; i < moves.length; i++) {
		if (moves[i][0] === x && moves[i][1] === y) {
			return true;
		}
	}
	return false;
}

function rotateBoard(){
	var rotate;
	if(whiteToPlay){
		rotate = "rotateZ(0deg)";
	}else{
		rotate = "rotateZ(180deg)";
	}
	document.getElementById("board").style.transform = rotate;
	var squares = document.getElementsByClassName("square");
	var names = document.getElementsByClassName("cellName");
	for(var i = 0;i<squares.length;i++){
		squares.item(i).style.transform = rotate;
	}
	for(var i = 0;i<names.length;i++){
		//names.item(i).innerText = "";
	}
}


//promotion window
function promotWindow(x, y) {
	var Promotion = document.createElement("table");
	var row = board.querySelectorAll("#board tr")[x];
	cell = cellByCords(x, y);
	var gray = cell.style.backgroundColor == "rgb(241, 245, 225)";
	if (x != 0) {
		gray = !gray;
	}
	for (var i = 0; i < 4; i++) {
		var row = Promotion.insertRow(i);
		var cells = row.insertCell(0);
		var img = document.createElement("img");
		if (x == 0) {
			img.src = promotionWhite[i].img;
		} else {
			img.src = promotionBlack[i].img;
		}
		img.className = "piece";
		if (gray) {
			cells.style.backgroundColor = "#f1f5e1";
		} else {
			cells.style.backgroundColor = "#628a0e";
		}
		cells.setAttribute("onclick", "promotionChoice(this)");
		cells.appendChild(img);
		gray = !gray;
	}
	Promotion.style.top = board.offsetTop + (x - 3 * (x != 0)) * cell.offsetHeight + "px";
	Promotion.style.left = board.offsetLeft + y * cell.offsetWidth + "px";
	Promotion.className = "promotion";
	document.getElementsByTagName("body")[0].appendChild(Promotion);
	toPromot = true;
	promotionSquare.x = x;
	promotionSquare.y = y;
}
//put the selected piece on the board after promotion
function promotionChoice(cell) {
	var pos;
	var parent = cell.parentNode;
	for (pos = 0;(parent = parent.previousSibling) != null; pos++);
	//console.log(pos);
	if (whiteToPlay) {
		if(Board[promotionSquare.x][promotionSquare.y] != null){
			var img = document.createElement("img");
			img.src = Board[promotionSquare.x][promotionSquare.y].img;
			document.getElementById("capturedPiecesW").appendChild(img);
		}
		Board[promotionSquare.x][promotionSquare.y] = Object.assign({}, promotionWhite[pos]);
	} else {
		if(Board[promotionSquare.x][promotionSquare.y] != null){
			var img = document.createElement("img");
			img.src = Board[promotionSquare.x][promotionSquare.y].img;
			document.getElementById("capturedPiecesW").appendChild(img);
		}
		Board[promotionSquare.x][promotionSquare.y] = Object.assign({}, promotionBlack[pos]);
	}
	parent = cell.parentNode;
	Board[selectedPiece.x][selectedPiece.y] = null;
	var proWin = document.getElementsByClassName("promotion")[0];
	proWin.parentNode.removeChild(proWin);
	toPromot = false;
	whiteToPlay = !whiteToPlay;
	rotateBoard();
	if(whiteToPlay){
		bTimer.pause();
		wTimer.resume();
	}else{
		bTimer.resume();
		wTimer.pause();
	}
	drawBoard();
	backgroundProc();
}

function pawnLM(x, y,background = false) {
	var wbp = ((Board[x][y].player == "white" && whiteToPlay) || (Board[x][y].player == "black" && !whiteToPlay));
	if(Board[x][y].pinned && wbp && Board[Board[x][y].x][Board[x][y].y].name == "B"){
		return;
	}
	var moveDer;
	var enpCapRow;
	if (Board[x][y].player == "white") {
		moveDer = x - 1; //up the board
		enpCapRow = 3;
	} else {
		moveDer = x + 1; //down the board
		enpCapRow = 4;
	}
	if(background && !wbp){
			if (y > 0) {
				Check(moveDer, y - 1);
				protectedSquares.push({x:moveDer,y:y-1,bx:x,by:y});
			}
			if (y < 7) {
				Check(moveDer, y + 1);
				protectedSquares.push({x:moveDer,y:y+1,bx:x,by:y});
			}
	} else if(!background || (background && wbp)){
		//if the other player piece exists on moveDer,y-1
		if (y > 0 && cellCheck(moveDer, y - 1) != null && cellCheck(moveDer, y - 1) != Board[x][y].player) {
				if(background){
					if(!Board[x][y].pinned || (Board[x][y].pinned && inPin(moveDer, y - 1,x,y))){
						allowedMoves.push({x:moveDer,y:y-1,bx:x,by:y});
						Check(moveDer, y - 1,"gold");
					}
				}else{
					if(!Board[x][y].pinned || (Board[x][y].pinned && inPin(moveDer, y - 1,x,y))){
						drawMoves(moveDer, y - 1);
					}
				}
		}
		//move forward 
		if (cellCheck(moveDer, y) == e) {

				if(background){
					if(!Board[x][y].pinned || (Board[x][y].pinned && inPin(moveDer, y,x,y))){
						allowedMoves.push({x:moveDer,y:y,bx:x,by:y});
						Check(moveDer, y,"gold");
					}
					
				}else{
					if(!Board[x][y].pinned || (Board[x][y].pinned && inPin(moveDer, y,x,y))){
						drawMoves(moveDer, y);
					}
					
				}
			}
			//move forward by 2
			if (Board[x][y].enPassant && cellCheck(moveDer + (moveDer - x), y) == e && cellCheck(moveDer, y) == e) {
				if(background){
					if(!Board[x][y].pinned || (Board[x][y].pinned && inPin(moveDer + (moveDer - x), y,x,y))){
						allowedMoves.push({x:moveDer + (moveDer - x),y:y,bx:x,by:y});
						Check(moveDer + (moveDer - x), y,"gold");
					}
					
				}else{
					if(!Board[x][y].pinned || (Board[x][y].pinned && inPin(moveDer + (moveDer - x), y,x,y))){
						drawMoves(moveDer + (moveDer - x), y);
					}
					
				}
			}
		//if the other player piece exists on moveDer,y+1
		if (y < 7 && cellCheck(moveDer, y + 1) != null && cellCheck(moveDer, y + 1) != Board[x][y].player) {
				if(background){
					if(!Board[x][y].pinned || (Board[x][y].pinned && inPin(moveDer, y + 1,x,y))){
						allowedMoves.push({x:moveDer,y:y+1,bx:x,by:y});
						Check(moveDer, y + 1,"gold");
					}
				}else{
					if(!Board[x][y].pinned || (Board[x][y].pinned && inPin(moveDer, y + 1,x,y))){
						drawMoves(moveDer, y + 1);
					}
				}
			}
		//capture enpassanted
		if (x == enpCapRow && y > 0 && cellCheck(x, y - 1) != null && cellCheck(x, y - 1) != Board[x][y].player && Board[x][y - 1].name == 'P' && Board[x][y - 1].enPassant) {
				if(background){
					if(!Board[x][y].pinned || (Board[x][y].pinned && inPin(moveDer, y - 1,x,y))){
						allowedMoves.push({x:moveDer,y:y-1,bx:x,by:y});
						Check(moveDer, y - 1,"gold");	
					}
				}else{
					if(!Board[x][y].pinned || (Board[x][y].pinned && inPin(moveDer, y - 1,x,y))){
						drawMoves(moveDer, y - 1);	
					}
				}
				
		}
		if (x == enpCapRow && y < 7 && cellCheck(x, y + 1) != null && cellCheck(x, y + 1) != Board[x][y].player && Board[x][y + 1].name == 'P' && Board[x][y + 1].enPassant) {
				if(background){
					if(!Board[x][y].pinned || (Board[x][y].pinned && inPin(moveDer, y + 1,x,y))){
						allowedMoves.push({x:moveDer,y:y+1,bx:x,by:y});
						Check(moveDer, y + 1,"gold");
					}
					
				}else{
					if(!Board[x][y].pinned || (Board[x][y].pinned && inPin(moveDer, y + 1,x,y))){
						drawMoves(moveDer, y + 1);
					}
				}
		}
	}
}

function inPin(x,y,xt,yt){
	for(var i = 0;i<Board[xt][yt].mvs.length;i++){
		if(Board[xt][yt].mvs[i].x == x && Board[xt][yt].mvs[i].y == y){
			return true;
		}
	}
	return false;
}


function bishopLM(x,y,background = false,pinncheck = false){
	var dc = Array(4);
	dc.fill(false);
	var pin = Array(4).fill(null).map(() => ({p:false,x:null,y:null}));
	var i = 1;
	var wbp = ((Board[x][y].player == "white" && whiteToPlay) || (Board[x][y].player == "black" && !whiteToPlay));
	//some real complicated math shit
	while(!dc.every((elm) => elm === true)){
		for(var cell = 0;cell < 4;cell++){
			var xt = x + i * (cell < 2 ? -1 : 1);
			var yt = y + i * (cell%2 == 0 ? -1 : 1);
			if(!dc[cell] && onBoard(xt,yt)){
				if(cellCheck(xt,yt) != null && Board[x][y].player == cellCheck(xt,yt)){
						dc[cell] = true;
				}
				if(!pinncheck){
						if(background && !wbp){
							protectedSquares.push({x:xt,y:yt,bx:x,by:y});
							Check(xt,yt);

						}else if(wbp && background && !dc[cell]){
							if(!Board[x][y].pinned || (Board[x][y].pinned && inPin(xt,yt,x,y))){
								allowedMoves.push({x:xt,y:yt,bx:x,by:y});
								Check(xt,yt,"gold");
							}
						} else if(!dc[cell]){
							if(!Board[x][y].pinned || (Board[x][y].pinned && inPin(xt,yt,x,y))){
								drawMoves(xt, yt);
							}
						}

					if(cellCheck(xt,yt) != null && Board[xt][yt].name != "K"){
						dc[cell] = true;
					}
				}else if(!dc[cell]){
					if(cellCheck(xt,yt) != null && Board[x][y].player != cellCheck(xt,yt) && Board[xt][yt].name != "K" && !pin[cell].p){
						pin[cell].p = true;
						pin[cell].x = xt;
						pin[cell].y = yt;
					}else if(cellCheck(xt,yt) != null && Board[x][y].player != cellCheck(xt,yt) && Board[xt][yt].name == "K" && pin[cell].p){
						Board[pin[cell].x][pin[cell].y].pinned = true;
						Board[pin[cell].x][pin[cell].y].x = x;
						Board[pin[cell].x][pin[cell].y].y = y;
						console.log("pinned(" + pin[cell].x + ", " + pin[cell].y + ") BY("+ x + ", " + y + ")");
						return;
					}else if(cellCheck(xt,yt) != null){
						dc[cell] = true;
					}
				}
				
			}else{
				dc[cell] = true;
			}
		}
		i++;
	}
}

function rookLM(x,y,background = false,pinncheck = false){
	var dc = Array(4);
	var pin = Array(4).fill(null).map(() => ({p:false,x:null,y:null}));
	dc.fill(false);
	var i = 1;
	var wbp = ((Board[x][y].player == "white" && whiteToPlay) || (Board[x][y].player == "black" && !whiteToPlay));
	while(!dc.every((elm) => elm === true)){
		for(var cell = 0;cell < 4;cell++){
			var xt = x + i * (cell < 2 ? -1 : 1) * (cell % 2 == 1);
			var yt = y + i * (cell < 2 ? -1 : 1) * (cell % 2 == 0);
			if(!dc[cell] && onBoard(xt,yt)){
				if(cellCheck(xt,yt) != null && Board[x][y].player == cellCheck(xt,yt)){
						dc[cell] = true;
				}
				if(!pinncheck){
						if(background && !wbp){
							protectedSquares.push({x:xt,y:yt,bx:x,by:y});
							Check(xt,yt);

						}else if(wbp && background && !dc[cell]){
							if(!Board[x][y].pinned || (Board[x][y].pinned && inPin(xt,yt,x,y))){
								allowedMoves.push({x:xt,y:yt,bx:x,by:y});
								Check(xt,yt,"gold");
							}
						} else if(!dc[cell]){
							if(!Board[x][y].pinned || (Board[x][y].pinned && inPin(xt,yt,x,y))){
								drawMoves(xt, yt);
							}
						}

					if(cellCheck(xt,yt) != null && Board[xt][yt].name != "K"){
						dc[cell] = true;
					}
				}else if(!dc[cell]){
					if(cellCheck(xt,yt) != null && Board[x][y].player != cellCheck(xt,yt) && Board[xt][yt].name != "K" && !pin[cell].p){
						pin[cell].p = true;
						pin[cell].x = xt;
						pin[cell].y = yt;
					}else if(cellCheck(xt,yt) != null && Board[x][y].player != cellCheck(xt,yt) && Board[xt][yt].name == "K" && pin[cell].p){
						Board[pin[cell].x][pin[cell].y].pinned = true;
						Board[pin[cell].x][pin[cell].y].x = x;
						Board[pin[cell].x][pin[cell].y].y = y;
						console.log("pinned(" + pin[cell].x + ", " + pin[cell].y + ") BY("+ x + ", " + y + ")");
						return;
					}else if(cellCheck(xt,yt) != null){
						dc[cell] = true;
					}
				}
				
			}else{
				dc[cell] = true;
			}
		}
		i++;
	}
}

function knightLM(x,y,background = false){
	//good fucking luck
	var pos = true;
	var wbp = ((Board[x][y].player == "white" && whiteToPlay) || (Board[x][y].player == "black" && !whiteToPlay));
	if(Board[x][y].pinned && wbp){
		return;
	}
	for(var i = 0,j = 0;i<8;i++,j++,j *= j != 2){
		var xt = x + (1+(i<4?0:1))*(pos ? -1:1);
		var yt = y + (1+(i<4?1:0))*(i%2 == 0?-1:1);
//console.log(xt + ", "+yt);
		if(onBoard(xt,yt)){
			//if(((cellCheck(xt,yt) != null && Board[xt][yt].name != 'K') || cellCheck(xt,yt) == null)){
				if(cellCheck(xt,yt) != null && Board[x][y].player == cellCheck(xt,yt)){
					if(!wbp){
						protectedSquares.push({x:xt,y:yt,bx:x,by:y});
						Check(xt,yt);
					}
					
				}else{
					if(background && !wbp){
						protectedSquares.push({x:xt,y:yt,bx:x,by:y});
						Check(xt,yt);
					}else if(wbp && background){
						allowedMoves.push({x:xt,y:yt,bx:x,by:y});
						Check(xt,yt,"gold");
					}
					else{
						drawMoves(xt, yt);
					}
				}
			//}
		}
		pos = j == 1? !pos : pos;
	}
}


function inPs(x,y){
	var tmp = false;
	for(var i = 0;i<protectedSquares.length;i++){
		if(x == protectedSquares[i].x && y == protectedSquares[i].y){
			if(!tmp){
				tmp = {x:protectedSquares[i].bx,y:protectedSquares[i].by,cb2p:false};
			}else{
				tmp.cb2p = true;
				return tmp;
			}
			
		}
	}
	return tmp;
}
function inAm(x,y){
	var piecesPoss = false; 
	for(var i = 0;i<allowedMoves.length;i++){
		if(allowedMoves[i].x == x && allowedMoves[i].y == y){
			if(!piecesPoss){
				piecesPoss = new Array();
			}
			piecesPoss.push({x:allowedMoves[i].bx,y:allowedMoves[i].by});
		}
	}
	return piecesPoss;
}

function kingLM(x,y,background = false,escapeSquare = false){
	//console.log(allowedMoves);
	var wbp = ((Board[x][y].player == "white" && whiteToPlay) || (Board[x][y].player == "black" && !whiteToPlay));
	for(var xt = -1;xt<2;xt++){
		for(var yt = -1;yt<2;yt++){
			if(!(xt == 0 && yt == 0) && onBoard(x+xt,y+yt)){
				if(background && !wbp){
					protectedSquares.push({x:x+xt,y:y+yt,bx:x,by:y});
					Check(x+xt,y+yt);
				}else if((cellCheck(x + xt,y+yt) != null && Board[x][y].player != cellCheck(x + xt,y+yt)) || cellCheck(x + xt,y+yt) == null){
					if(!inPs(x+xt,y+yt) && background){
						allowedMoves.push({x:x+xt,y:y+yt,bx:x,by:y});
						Check(x+xt,y+yt,"gold");
					}else if (!inPs(x+xt,y+yt)){
						if(escapeSquare){
							return true;
						}else{
							drawMoves(x+xt, y+yt);
						}
					}
				}
				
			}
		}
	}
	//castle
	if(!background && !checked){
		if(!Board[x][y].moved){
			if(Board[x][5] == null && Board[x][6] == null && Board[x][7] != null && Board[x][7].name == "R" && !Board[x][7].moved && !inPs(x,5) && !inPs(x,6)){
				drawMoves(x,6);
			}
			if(Board[x][1] == null && Board[x][2] == null && Board[x][0] != null && Board[x][0].name == "R" && !Board[x][0].moved && !inPs(x,1) && !inPs(x,2)){
				drawMoves(x,2);
			}
		}
	}
}

function CamInAm(){
	for(var i = 0;i<checkAllowedMoves.length;i++){
		for(var j = 0;j<allowedMoves.length;j++){
			if(checkAllowedMoves[i].x == allowedMoves[j].x && checkAllowedMoves[i].y == allowedMoves[j].y){
				return true;
			}
		}
	}
	return false;
}

function backgroundProc(){
	protectedSquares = [];
	allowedMoves = [];
	//used for multireasons
	checkAllowedMoves = [];
	for(var x = 0;x<8;x++){
		for(var y = 0;y<8;y++){
			if(cellCheck(x,y) != null && Board[x][y].name != "K"){
				Board[x][y].pinned = false;
			}
		}
	}
	checked = false;
	var kingPoss = {x:null,y:null};


	function diagonale(x,y,xt,yt){
		var n = Math.abs(x-xt),
		ix = x>xt ? -1 : 1,
		iy = y>yt ? -1 : 1;
		for(var i = 0;i<n;i++){
			checkAllowedMoves.push({x:x + i * ix,y:y + i * iy});
		}
	}
	function horvec(x,y,xt,yt){
		var n = xt == x ? Math.abs(yt - y) : Math.abs(xt - x),
		der = xt == x ? (yt > y ? 1 : - 1) : (xt > x ? 1 : - 1);
		for(var i = 0;i<n;i++){
			checkAllowedMoves.push({
				x:x + (i * der) * (xt != x) ,
				y:y + (i * der) * (yt != y)
			});
		}
	}


	//pin check

	for(var x = 0;x<8;x++){
		for(var y = 0;y<8;y++){
			if(cellCheck(x,y) != null && Board[x][y].name != "K"){
					switch (Board[x][y].name) {
						case 'B':
							bishopLM(x,y,false,true);
							break;
						case 'R':
							rookLM(x,y,false,true);
							break;
						case 'Q':
							bishopLM(x,y,false,true);
							rookLM(x,y,false,true);
							break;
				}
			}
		}
	}

	for(var x = 0;x<8;x++){
		for(var y = 0;y<8;y++){
			if(cellCheck(x,y) != null){
				var wbp = ((Board[x][y].player == "white" && whiteToPlay) || (Board[x][y].player == "black" && !whiteToPlay));
				if(wbp && Board[x][y].name == "K"){
					kingPoss = {x:x,y:y};
				}else{
					if(Board[x][y].name != "K" && Board[x][y].pinned){
						switch (Board[Board[x][y].x][Board[x][y].y].name){
							case 'B':
								diagonale(Board[x][y].x,Board[x][y].y,x,y);
								break;
							case 'R':
								horvec(Board[x][y].x,Board[x][y].y,x,y);
								break;
							case 'Q':
								if(Board[x][y].x == x || Board[x][y].y == y){
									horvec(Board[x][y].x,Board[x][y].y,x,y);
								}else{
									diagonale(Board[x][y].x,Board[x][y].y,x,y);
								}
								break;
						}
						Board[x][y].mvs = checkAllowedMoves;
					}
					selectedPieceFunc(x,y,true);
				}
			}
			checkAllowedMoves = [];
		}
	}
	selectedPieceFunc(kingPoss.x,kingPoss.y,true);
	var tmp = inPs(kingPoss.x,kingPoss.y);
	if(tmp){
		checked = true;
		if(!kingLM(kingPoss.x,kingPoss.y,false,true) && tmp.cb2p){
			document.getElementById("OptionWin").style.visibility = "visible";
			document.getElementById("countDown").style.visibility = "hidden";
			if(whiteToPlay){
				document.getElementById("title").innerText = "Noir a gagné";
started = false;
bTimer.pause();
wTimer.pause();
			}else{
				document.getElementById("title").innerText = "Blanc a gagné";
started = false;
bTimer.pause();
wTimer.pause();
			}
			
			console.log("CheckMate");
		}else if(!tmp.cb2p){
			
			switch (Board[tmp.x][tmp.y].name){
				case 'B':
					diagonale(tmp.x,tmp.y,kingPoss.x,kingPoss.y);
					break;
				case 'R':
					horvec(tmp.x,tmp.y,kingPoss.x,kingPoss.y);
					break;
				case 'Q':
					if(kingPoss.x == tmp.x || kingPoss.y == tmp.y){
						horvec(tmp.x,tmp.y,kingPoss.x,kingPoss.y);
					}else{
						diagonale(tmp.x,tmp.y,kingPoss.x,kingPoss.y);
					}
					break;
				default :
					checkAllowedMoves.push({x:tmp.x,y:tmp.y});
					break;
			}
			if(!kingLM(kingPoss.x,kingPoss.y,false,true) && !CamInAm()){
				document.getElementById("OptionWin").style.visibility = "visible";
				document.getElementById("countDown").style.visibility = "hidden";
				if(whiteToPlay){
					document.getElementById("title").innerText = "Noir a gagné";
started = false;
bTimer.pause();
wTimer.pause();
				}else{
					document.getElementById("title").innerText = "Blanc a gagné";
started = false;
bTimer.pause();
wTimer.pause();
				}
				console.log("CheckMate");
			}
		}

		console.log("king is checked by (" + tmp.x +","+tmp.y+")");
	}else if(allowedMoves.length == 0){
			document.getElementById("OptionWin").style.visibility = "visible";
			document.getElementById("countDown").style.visibility = "hidden";
			document.getElementById("title").innerText = "Dessiner par impasse";
			started = false;
	}
}

function selectedPieceFunc(x,y,bg = false){
			
	switch (Board[x][y].name) {
		case 'P': //Pawn allowed moves
			pawnLM(x, y,bg);
			break;
		case 'B':
			bishopLM(x,y,bg);
			break;
		case 'R':
			rookLM(x,y,bg);
			break;
		case 'Q':
			rookLM(x,y,bg);
			bishopLM(x,y,bg);
			break;
		case 'N':
			knightLM(x,y,bg);
			break;
		case 'K':
			kingLM(x,y,bg);
			break;
	}
}
//start the game
function startTimer(seconds, container, oncomplete) {
    var startTime, timer, obj, ms = seconds*1000,
        display = document.getElementById(container);
    obj = {};
    obj.resume = function() {
        startTime = new Date().getTime();
        timer = setInterval(obj.step,250); // adjust this number to affect granularity
                            // lower numbers are more accurate, but more CPU-expensive
    };
    obj.pause = function() {
        ms = obj.step();
        clearInterval(timer);
    };
    obj.step = function() {
        var now = Math.max(0,ms-(new Date().getTime()-startTime)),
            m = Math.floor(now/60000), s = Math.floor(now/1000)%60;
        s = (s < 10 ? "0" : "")+s;
        display.innerHTML = m+":"+s;
        if( now == 0) {
            clearInterval(timer);
            obj.resume = function() {};
            if( oncomplete) oncomplete();
        }
        return now;
    };
    obj.resume();
    return obj;
}
// start:

function start(){
	started = true;
	var playTime = document.getElementById("timeSelcHours").value * 60 * 60 +  document.getElementById("timeSelcMins").value * 60;
	wTimer = startTimer(playTime, "timeLeftW", function() {
		document.getElementById("OptionWin").style.visibility = "visible";
		document.getElementById("countDown").style.visibility = "hidden";
		document.getElementById("title").innerText = "Noir a gagné";
started = false;
bTimer.pause();
wTimer.pause();
	});
	bTimer = startTimer(playTime, "timeLeftB", function() {
		document.getElementById("OptionWin").style.visibility = "visible";
		document.getElementById("countDown").style.visibility = "hidden"
		document.getElementById("title").innerText = "Blanc a gagné";
started = false;
bTimer.pause();
wTimer.pause();
	});
	bTimer.pause();
	document.getElementById("OptionWin").style.visibility = "hidden";
}
//timer
backgroundProc();
function legalMoves(cell) {
	if(!started){
		return;
	}
	var x = parseInt(cell.offsetTop / cell.offsetHeight, 10),
		y = parseInt(cell.offsetLeft / cell.offsetWidth, 10);
	var drawPos = document.getElementById("pos");
	drawPos.innerText = "(" + x + ", " + y + ")";
	//console.log(Board[x][y].protected);
	if (moves.length > 0 && inMoves(x, y)) { //move piece
		///////////Promotion
		if ((x == 0 && selectedPiece.n == "P" && selectedPiece.p == "white") || (x == 7 && selectedPiece.n == "P" && selectedPiece.p == "black")) {
			promotWindow(x, y);
		} else {

			//castling

			if(selectedPiece.n  == "K" && !Board[selectedPiece.x][selectedPiece.y].moved){
					if(y == 6){
						Board[x][5] = Object.assign({}, Board[x][7]);
						Board[x][7] = null;
					}
					if(y == 2){
						Board[x][3] = Object.assign({}, Board[x][0]);
						Board[x][0] = null;
					}
				Board[selectedPiece.x][selectedPiece.y].moved = true;
			}else if(selectedPiece.n  == "R" && !Board[selectedPiece.x][selectedPiece.y].moved){
				Board[selectedPiece.x][selectedPiece.y].moved = true;
			}
			
			if(Board[x][y] != null){
				var img = document.createElement("img");
				img.src = Board[x][y].img;
				if(whiteToPlay){
					document.getElementById("capturedPiecesW").appendChild(img);
				}else{
					document.getElementById("capturedPiecesB").appendChild(img);
				}
			}
			Board[x][y] = Object.assign({}, Board[selectedPiece.x][selectedPiece.y]);
			Board[selectedPiece.x][selectedPiece.y] = null;
			//change player turn
			whiteToPlay = !whiteToPlay;
			rotateBoard();
			if(whiteToPlay){
				bTimer.pause();
				wTimer.resume();
			}else{
				bTimer.resume();
				wTimer.pause();
			}
		}
		//////////En passant
		if (enPassant.x != null && Board[x][y].name == "P" && ((Board[enPassant.x][enPassant.y].player == "white" && x == enPassant.x + 1 && y == enPassant.y) || (Board[enPassant.x][enPassant.y].player == "black" && x == enPassant.x - 1 && y == enPassant.y))) {
			var img = document.createElement("img");
			img.src = Board[x][y].img;
			if(whiteToPlay){
					document.getElementById("capturedPiecesW").appendChild(img);
				}else{
					document.getElementById("capturedPiecesB").appendChild(img);
				}
			Board[enPassant.x][enPassant.y] = null;
		}
		if (enPassant.x != null && Board[enPassant.x][enPassant.y] != null && Board[enPassant.x][enPassant.y].player == enPassant.p) {
			Board[enPassant.x][enPassant.y].enPassant = false;

		}
		enPassant.x = null;
		enPassant.y = null;
		enPassant.p = null;
		if (Board[x][y] != null && Board[x][y].name == "P" && Board[x][y].enPassant) {
			enPassant.x = x;
			enPassant.y = y;
			enPassant.p = Board[x][y].player;
		}
		//redraw Board
		//window.console.clear();
		backgroundProc();
		drawBoard();
		//clear moves
		moves = [];
	} else {
		moves = [];
		drawBoard();
		backgroundProc();
		//console.log(Board[x][y].pinned);
		//if the selected node is not empty and the selected piece not pinned to the king and it's the player's turn
		if (Board[x][y] != null &&  ((Board[x][y].player == "white" && whiteToPlay) || (Board[x][y].player == "black" && !whiteToPlay)) && !toPromot) {
			//save the selected piece on memory to move it next time this function is called
			selectedPiece.x = x;
			selectedPiece.y = y;
			selectedPiece.p = Board[x][y].player;
			selectedPiece.n = Board[x][y].name;
			
			selectedPieceFunc(x,y);

		} else {
			moves = [];
			if (toPromot) {
				var proWin = document.getElementsByClassName("promotion")[0];
				proWin.parentNode.removeChild(proWin);
				toPromot = false;
			}
			drawBoard();
			backgroundProc();
		}
	}
}
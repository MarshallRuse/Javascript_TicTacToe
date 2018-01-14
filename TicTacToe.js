var players = [];

var Tile = (pos, move) => {

	let position = pos;
	let moveMarker = move;
	const makeMove = (newMark) => {
		moveMarker = newMark;
	}

	const getPosition = () => {
		return position;
	}

	const getMoveMarker = () => {
		return moveMarker;
	}
	return {makeMove, getPosition, getMoveMarker};
}

var GameBoard = (() => {

	var board = {};
	board.positions = new Array(9);
	
	var squares = document.querySelectorAll(".tile");
	addTiles();
	
	function addTiles(){
		for (let i = 0; i < squares.length; i++){
			let tile = Tile(squares[i].getAttribute("data-position-num"), i);
			board.positions[i] = tile;
		}
	}

	const winningState = () => {
		//horizontal wins
		if (board.positions[0].getMoveMarker() === board.positions[1].getMoveMarker() && 
			board.positions[1].getMoveMarker() === board.positions[2].getMoveMarker()){
			console.log("top-horiz");
			return true;
		}
		else if (board.positions[3].getMoveMarker() === board.positions[4].getMoveMarker() && 
			board.positions[4].getMoveMarker() === board.positions[5].getMoveMarker()){
			console.log("mid-horiz");

			return true
		}
		else if (board.positions[6].getMoveMarker() === board.positions[7].getMoveMarker() && 
			board.positions[7].getMoveMarker() === board.positions[8].getMoveMarker()){
						console.log("bottom-horiz");

			return true;
		}
		//vertical wins
		else if (board.positions[0].getMoveMarker() === board.positions[3].getMoveMarker() && 
			board.positions[3].getMoveMarker() === board.positions[6].getMoveMarker()){
						console.log("left-vert");

			return true;
		}
		else if (board.positions[1].getMoveMarker() === board.positions[4].getMoveMarker() && 
			board.positions[4].getMoveMarker() === board.positions[7].getMoveMarker()){
						console.log("mid-vert");

			return true;
		}
		else if (board.positions[2].getMoveMarker() === board.positions[5].getMoveMarker() && 
			board.positions[5].getMoveMarker() === board.positions[8].getMoveMarker()){
						console.log("bottom-vert");

			return true;
		}
		//diagonal wins
		else if (board.positions[0].getMoveMarker() === board.positions[4].getMoveMarker() && 
			board.positions[4].getMoveMarker() === board.positions[8].getMoveMarker()){
						console.log("left-right diag");

			return true;
		}
		else if (board.positions[2].getMoveMarker() === board.positions[4].getMoveMarker() && 
			board.positions[4].getMoveMarker() === board.positions[6].getMoveMarker()){
						console.log("right-left diag");

			return true;
		}
		else {
			return false;
		}

	}

	const isLegalMove = (position) => {
		if (board.positions[position] !== ""){
			return false;
		}
		else {
			return true;
		}

	}

	const makeMove = (position, moveMarker) => {
		if (isLegalMove){
			squares[position].innerHTML = moveMarker;
			console.log(board.positions[position]);
			board.positions[position].makeMove(moveMarker);
			GamePlay.changeTurn();
			return true; //legal move made
		}
		return false; //legal move not made
	}

	const clearBoard = () => {
		for (let i = 0; i < squares.length; i++){
			squares[i].innerHTML = "";
		}
		addTiles();
	}

	return {board, makeMove, winningState, clearBoard};
})();

var Player = (num, name, symbol) => {

	let playerNumber = num;
	let playerName = name;
	let marker = symbol;

	const getName = () => {
		return playerName;
	}

	const getNumber = () => {
		return playerNumber;
	}

	const getMarker = () => {
		return marker;
	}

	return {getName, getNumber, getMarker};
}

var PlayerForm = (() => {

	var symbolChosen = false;

	const decideOtherPlayerSymbol = (num) => {

		let p1SymbolChoice = document.querySelector("#player1Form").querySelectorAll("input[type=radio]");
		let p2SymbolChoice = document.querySelector("#player2Form").querySelectorAll("input[type=radio]");
		if (num == 1 && !symbolChosen){
			if (p1SymbolChoice[0].checked){ // p1 chose X
				p2SymbolChoice[1].checked = true;
				p2SymbolChoice.forEach(function(radio){
					radio.disabled = true;
				});
				symbolChosen = true;
			}
			else{
				p2SymbolChoice[0].checked = true;
				p2SymbolChoice.forEach(function(radio){
					radio.disabled = true;
				});
				symbolChosen = true;
			}
		}
		else if (num == 2 && !symbolChosen){
			if (p2SymbolChoice[0].checked){ // p1 chose X
				p1SymbolChoice[1].checked = true;
				p1SymbolChoice.forEach(function(radio){
					radio.disabled = true;
				});
				symbolChosen = true;
			}
			else{
				p1SymbolChoice[0].checked = true;
				p1SymbolChoice.forEach(function(radio){
					radio.disabled = true;
				});
				symbolChosen = true;
			}
		}

	}


	const revealPlayerCard = (form, name, symbol) => {
		form.style.display = "none";
		var cardId = form.getAttribute("data-player-card-id");
		var card = document.querySelector(cardId);
		var info = card.querySelectorAll("h3");
		console.log(info[0]);
		info[0].innerHTML += name;
		info[1].innerHTML += symbol;
		card.style.display = "block";
	}

	const getPlayerInfo = (form) => {
		var num = form.getAttribute("data-player-num");
		var name = form.querySelector(".playerName").value;
		var symbol = form.querySelector("input[type=radio]:checked").value;

		var player = Player(num, name, symbol);
		decideOtherPlayerSymbol(num);
		revealPlayerCard(form, name, symbol);
		return player;
	}

	return {getPlayerInfo};

})();



var EventListeners = (() => {
	//Player Form 
	var playerForms = document.querySelectorAll(".playerForm");
	for (let i = 0; i < playerForms.length; i++){
		playerForms[i].querySelector(".readyButton").addEventListener("click", function(e){
			e.preventDefault();
			players[i] = PlayerForm.getPlayerInfo(playerForms[i]);
			GamePlay.isReady();
		});
	}


	//Start button
	document.querySelector("#startButton").addEventListener("click", function(e){
		GamePlay.start();
	});

	//Restart button
	document.querySelector("#restartButton").addEventListener("click", function(e){
		GamePlay.restart();
	});

	const gameTileFunctionality = (event) => {
		var pos = event.srcElement.getAttribute("data-position-num");
		GameBoard.makeMove(pos, GamePlay.currentPlayerSymbol());
	}

	const addGameTilesListeners = () => {
			//Game board tiles
		var gameTiles = document.querySelectorAll(".tile");
		for (let i = 0; i < gameTiles.length; i++){
			gameTiles[i].addEventListener("click", gameTileFunctionality);
		}
	}

	const removeGameTilesListeners = () => {
		var gameTiles = document.querySelectorAll(".tile");
		for (let i = 0; i < gameTiles.length; i++){
			gameTiles[i].removeEventListener("click", gameTileFunctionality);
		}
	}

	return {addGameTilesListeners, removeGameTilesListeners};
})();

var GamePlay = (() => {
	var p1Score = 0;
	var p2Score = 0;
	var turnCount = 0; //max 9 turns to win or its a tie

	var isP1Turn;

	const isReady = () => {
		let allReady = false;
		if (players[0] && players[1]){
			allReady = true;
		}

		if (allReady){
			document.querySelector("#startButton").style.visibility = "visible";
		}
	}

	const flipCoin = () => {
		let num = Math.random();
		if (num < 0.5){
			isP1Turn = true
		}
		else {
			isP1Turn = false;
		}
	}


	const currentPlayerSymbol = () => {
		if (isP1Turn){
			return players[0].getMarker();
		}
		else {
			return players[1].getMarker();
		}
	}

	const currentPlayerName = () => {
		if (isP1Turn){
			return players[0].getName();
		}
		else {
			return players[1].getName();
		}
	}


	var changeTurn = () => {
		console.log(GameBoard.winningState());
		if (GameBoard.winningState() || turnCount >= 8){
			stop();
		}
		else{
			turnCount++;

			if (isP1Turn){
				isP1Turn = false;
			}
			else {
				isP1Turn = true;
			}
		}
		displayTurn();
	}

	const displayTurn = () => {
		var turnDisplayHeader = document.querySelector("#turnDisplay").querySelector("h1");
		var turnDisplay = document.querySelector("#turnDisplay").querySelector("h2");

		if (turnCount === 0){
			turnDisplayHeader.innerHTML = "Start!<br>First turn goes to " + currentPlayerName() + ":";	
		}
		else {
			turnDisplayHeader.innerHTML = currentPlayerName() + "'s Turn: ";
		}
		turnDisplay.innerHTML = currentPlayerSymbol();
	}


	const displayWin = (win, playerName) => {
		document.querySelector("#turnDisplay").style.display = "none";
		var winDisplay = document.querySelector("#winDisplay");
		var winMessage = winDisplay.querySelector("h1");
		if (win){
			winMessage.innerHTML = "Congratulations " + playerName + ", you win!";
		}
		else {
			winMessage.innerHTML = "The game was a tie, that sucks :/";
		}
		winDisplay.style.display = "block";
	}

	const updateScore = (isP1) => {
		if (isP1){
			let score = document.querySelector("#player1Card").querySelector(".score");
			score.innerHTML = p1Score;
			score.classList.add("emphasis");
		}
		else {
			let score = document.querySelector("#player2Card").querySelector(".score");
			score.innerHTML = p2Score;
			score.classList.add("emphasis");
		}

	}

	const restart = () => {
		if (GameBoard.winningState()){
			document.querySelector(".emphasis").classList.remove("emphasis");
		}
		GameBoard.clearBoard();
		EventListeners.addGameTilesListeners();
		document.querySelector("#restartButton").style.visibility = "hidden";
		document.querySelector("#winDisplay").style.display = "none";
		document.querySelector("#turnDisplay").style.display = "block";
		turnCount = 0;
		flipCoin();
		displayTurn();

	}

	const start = () => {
		EventListeners.addGameTilesListeners();
		flipCoin(); //random first turn
		displayTurn();
		document.querySelector("#startButton").style.display = "none";
		
	}

	const stop = () => {
		EventListeners.removeGameTilesListeners();
		if (GameBoard.winningState()){
			var playerName;
			if (isP1Turn){
				playerName = players[0].getName();
				p1Score++;
				updateScore(true);
			}
			else {
				playerName = players[1].getName()
				p2Score++;
				updateScore(false);
			}
			displayWin(true, playerName);
		}
		else {
			displayWin(false);
		}
		var restartButton = document.querySelector("#restartButton");
		restartButton.style.visibility = "visible";
		restartButton.style.display = "block";


	}

	return {start, restart, changeTurn, currentPlayerSymbol, isReady};

})();

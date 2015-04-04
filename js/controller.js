angular
	.module('app')
	.controller('TheGame', TheGame);

	TheGame.$inject = ['$firebaseObject'];



	function TheGame($firebaseObject) {
		var self = this;
		self.gamePlay = gamePlay();
		self.setMove = setMove;
		self.getWinner = getWinner;
		self.resetGame = resetGame;
		self.chatPanel = chatPanel;
		self.sendChat = sendChat;
		self.chatOpen;


		
		function gamePlay(){
			var ref = new Firebase('https://tictackyle.firebaseio.com/');
			var gameData = $firebaseObject(ref);
			
			gameData.spaces = [];

			for(var i = 0; i < 9; i++) {
				gameData.spaces.push({move: ''});
			}

			gameData.currentMove = true;
			gameData.announce = "Let's Play!";
			gameData.playerTurn = 'X gets the first move...';
			gameData.scoreX = 0;
			gameData.scoreO = 0;
			gameData.count = 0;
			gameData.playAgain = true;
			gameData.chatNotify = false;
			gameData.chatDisplay = null;


			gameData.$loaded(function(){
				gameData.$save();
			});

			// gameData.$save();
			
			return gameData;
		}



		//////////////////////////////////////////
		/////////SET MOVE AKA THE BRAIN //////////
		//////////////////////////////////////////
		
		

		function setMove(play) {
			
			self.gamePlay.announce = "";
			
			if(!self.getWinner()) { //ONLY ALLOW CLICKS WHEN THERE IS NO WINNER

				if(self.gamePlay.currentMove === true) {
					if(play.move === '') {
						play.move = 'X';
						self.gamePlay.currentMove = false;
						self.gamePlay.playerTurn = 'Your move O';
						self.gamePlay.count++;
						if(self.getWinner(play) === play.move) {
							self.gamePlay.testWin = true;
							self.gamePlay.announce = play.move + ' Wins!!'
							self.gamePlay.playerTurn = '';
							self.gamePlay.playAgain = true;
							self.gamePlay.scoreX++;
						}
						if(self.gamePlay.count === 9 && !self.getWinner()) {
							self.gamePlay.announce = 'A tie... lame.'
							self.gamePlay.playerTurn = 'play again and settle this!';
							self.gamePlay.playAgain = true;
						}
						self.gamePlay.$save();
					}
				} else {
					if(play.move === '') {
						play.move = 'O';
						self.gamePlay.currentMove = true;
						self.gamePlay.playerTurn = 'Your move X';
						self.getWinner(play);
						self.gamePlay.count++;
						if(self.getWinner(play) === play.move) {
							self.gamePlay.announce = play.move + ' Wins!!'
							self.gamePlay.playerTurn = '';
							self.gamePlay.playAgain = true;
							self.gamePlay.scoreO++;	
						}
						self.gamePlay.$save();
					}
				}
			}
		}// end set move


		//////////////////////////////
		/////////TEST WINNER//////////
		//////////////////////////////
		function getWinner(play) {
			var space = self.gamePlay.spaces;
			if(
				space[0].move !== '' && space[0].move === space[1].move && space[1].move === space[2].move ||
				space[3].move !== '' && space[3].move === space[4].move && space[4].move === space[5].move ||
				space[6].move !== '' && space[6].move === space[7].move && space[7].move === space[8].move
				) {
				return play.move;
			} else if(
				space[0].move !== '' && space[0].move === space[3].move && space[3].move === space[6].move ||
				space[1].move !== '' && space[1].move === space[4].move && space[4].move === space[7].move ||
				space[2].move !== '' && space[2].move === space[5].move && space[5].move === space[8].move
				) {
				return play.move;	
			} else if (
				space[0].move !== '' && space[0].move === space[4].move && space[4].move === space[8].move
				) {
				return play.move;	
			} else if (
				space[2].move !== '' && space[2].move === space[4].move && space[4].move === space[6].move
				) {
				return play.move;	
			}

		} // end get winner





		//////////////////////////////
		////////CHAT FEATURE//////////
		//////////////////////////////

		function chatPanel() {
			if(self.chatOpen === true) {
				self.gamePlay.chatNotify = false;
				self.chatOpen = false;
				self.gamePlay.$save();
			} else {
				self.gamePlay.chatNotify = true;
				self.chatOpen = true;
				self.gamePlay.$save();
			}	
		}

		//custom shortcut to reset game
		function sendChat(text) {
			if(self.gamePlay.chatBox !== null) {
				if(self.gamePlay.chatBox === 'clearScore') {
					self.gamePlay.scoreO = 0;
					self.gamePlay.scoreX = 0;
					self.gamePlay.chatBox = null;
					self.gamePlay.$save();
				} else if (self.gamePlay.chatBox === 'clearChat') {
					self.gamePlay.chatDisplay = '';
					self.gamePlay.chatBox = '';
					self.gamePlay.$save();
				} else {
					self.gamePlay.chatDisplay = text + '\n' +  self.gamePlay.chatDisplay;
					self.gamePlay.chatBox = '';
					self.gamePlay.chatNotify = true;
					self.gamePlay.$save();
				}
			}
		}

		function resetGame(arr){
			for(var i = 0; i < arr.length; i++) {
				arr[i].move = '';
			}
			self.gamePlay.announce = "Let's Play!";
			self.gamePlay.playerTurn = 'X gets the first move...';
			self.gamePlay.currentMove = true;
			self.gamePlay.playAgain = false;
			self.gamePlay.count = 0;
			self.gamePlay.$save();
		}

	} // end of controller
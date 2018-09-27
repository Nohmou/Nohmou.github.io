	window.onload = setup;
	var $win = $(window);
	var $lay = $('#layout');
	var baseSize = {
		w: 720,
		h: 500
	}
	var canvas;
	var ctx;
	var plots = [0];
	var pickPower = 1;
	var gems = 0;			//temporarily adjusted for testing!
	var gemNow = 0;
	var activeGems = 0;
	var dirt = 0;				//temporarily adjusted for testing!
	var worms = 0;
	var wormCost = 3;
	var dps = 0;
	var stone = 0;				//temporarily adjusted for testing!
	var crushers = 0;
	var crusherDirtCost = 100;
	var crusherStoneCost = 10;
	var sps = 0;
	var attack = 0;
	var maxHealth = 5;
	var currentHealth = 5;
	var sharpenCost = 5;
	var paused = false;
	var maxPlots = 4;
	var plotWidth = 250; //27.25%
	var plotHeight = 250; //44.5%
	var battlesWon = 0;			//temporarily adjusted for testing!
	var messages = 0;
	var enemies = [];
	var enemyAttack = 0;
	var enemyHealth = 0;
	var numEnemies = 0;
	var experience = 0;
	var inBattle = false;
	var autoFightActive = false;
	var haveAxe = false;
	
	function setup() {
		document.getElementById("dirt1").width = plotWidth;
		document.getElementById("dirt1").height = plotHeight;
		document.getElementById("buy2").width = plotWidth;
		document.getElementById("buy2").height = plotHeight;
		document.getElementById("buy3").width = plotWidth;
		document.getElementById("buy3").height = plotHeight;
		document.getElementById("buy4").width = plotWidth;
		document.getElementById("buy4").height = plotHeight;
		var gemImages = document.getElementsByClassName("gem");
		canvas = document.getElementById("dirt1");
		ctx = canvas.getContext('2d');
		ctx.fillStyle = "#CC0000";
		ctx.fillRect(0, 0, plotWidth, plotHeight);
		ctx.fillStyle = "#000000";
		ctx.font = "20px Arial";
		ctx.fillText("Click Me!", 90, plotHeight / 2);
		for (i = 2; i <= maxPlots; i++) {
			var canvasNum = "buy" + i;
			canvas = document.getElementById(canvasNum);
			ctx = canvas.getContext('2d');
			ctx.font = "20px Arial";
			ctx.fillText("Advance further to unlock", 10, plotHeight / 2);
			ctx.beginPath();
			ctx.moveTo(0, 0);
			ctx.lineTo(plotWidth, plotHeight);
			ctx.stroke();
			ctx.moveTo(0, plotHeight);
			ctx.lineTo(plotWidth, 0);
			ctx.stroke();
		}
	}
	
	function buyPlot(plotNum) {
		if (!paused) {
			if (plotNum == (plots.length + 1)) {
				var canvasNum = "dirt" + plotNum;
				var buyCanvas = "buy" + plotNum;
				if (battlesWon >= (plotNum - 1) * 3) {
					if (document.getElementById(canvasNum).style.display != "inline") {
						plotNum = parseInt(plotNum) - 1;
						if (plotNum < maxPlots) {
							if (gems >= 10) {	
								document.getElementById(canvasNum).style.display = "inline";
								document.getElementById(canvasNum).width = plotWidth;
								document.getElementById(canvasNum).height = plotHeight;
								canvas = document.getElementById(canvasNum);
								ctx = canvas.getContext('2d');
								ctx.fillStyle = "#CC0000";
								ctx.fillRect(0, 0, plotWidth, plotHeight);
								plots[plotNum] = 0;
								gems -= 10;
								document.getElementById("currentGems").innerHTML = gems;
								document.getElementById(buyCanvas).style.display = "none";
							}
						}
					}
				}	
			}
		}
	}
	
	function mine(minePower, gemClick, plotNum){
		if (!paused) {
			if (gemClick) minePower *= pickPower;
			if (dirt + minePower >= 100 && crushers == 0 && worms >= 1) {
				document.getElementById("buyCrusher").style.display = "block";
				document.getElementById("currentStone").style.display = "inline";
				document.getElementById("sps").style.display = "inline";
			}
			if (minePower > 0) {
				var canvasNum = "dirt" + (plotNum + 1);
				canvas = document.getElementById(canvasNum);
				ctx = canvas.getContext('2d');
				gemNow = plots[plotNum];
				if (gemNow < 9 || gemClick == false) {
					dirt += minePower;
					if (dirt % 1 > 0.99 || dirt % 1 < 0.01) dirt = Math.round(dirt);
					if (gemNow < 9) {
						gemNow++;
						plots[plotNum] = gemNow;
						if (gemNow == 9) {
							activeGems++;
							document.getElementById("minigem").style.display = "inline";
							switch(plotNum) {
								case 0:
									document.getElementById("gem1").style.display = "inline";
									break;
								case 1:
									document.getElementById("gem2").style.display = "inline";
									break;
								case 2:
									document.getElementById("gem3").style.display = "inline";
									break;
								case 3: 
									document.getElementById("gem4").style.display = "inline";
									break;
								default: 
									break;
							}
						}
						var grd = ctx.createRadialGradient(plotWidth / 2, plotHeight / 2, 5, plotWidth / 2, plotHeight / 2, 100);
						var color;
						switch (gemNow) {
							case 0: 
								color = "#CC0000";
								break;
							case 1:
								color = "#BB0000";
								grd.addColorStop(0, color);
								break;
							case 2:
								color = "#AA0000";
								grd.addColorStop(0, color);
								break;
							case 3:
								color = "#990000";
								grd.addColorStop(0, color);
								break;
							case 4:
								color = "#880000";
								grd.addColorStop(0, color);
								break;
							case 5: 
								color = "#770000";
								grd.addColorStop(0, color);
								break;
							case 6: 
								color = "#660000";
								grd.addColorStop(0, color);
								break;
							case 7: 
								color = "#550000";
								grd.addColorStop(0, color);
								break;
							case 8:
								color = "#440000";
								grd.addColorStop(0, color);
								break;
							case 9: 
								color = "#330000";
								grd.addColorStop(0, color);
								break;
							default: 
								grd.addColorStop(0, "#000000");
						}
						grd.addColorStop(1, "#CC0000");
						ctx.fillStyle = grd;
						ctx.fillRect(0, 0, plotWidth, plotHeight);
					}
					document.getElementById("currentDirt").innerHTML = dirt;
				} else {
					gems += 1;
					gemNow = 0;
					activeGems--;
					if (activeGems == 0) document.getElementById("minigem").style.display = "none";
					plots[plotNum] = 0;
					switch(plotNum) {
						case 0: 
							document.getElementById("gem1").style.display = "none";
							break;
						case 1: 
							document.getElementById("gem2").style.display = "none";
							break;
						case 2: 
							document.getElementById("gem3").style.display = "none";
							break; 
						case 3: 
							document.getElementById("gem4").style.display = "none";
							break;
						default: 
							break;
					}
					document.getElementById("currentGems").innerHTML = gems;
					ctx.fillStyle = "#CC0000";
					ctx.fillRect(0, 0, plotWidth, plotHeight);
					if (messages == 0) {
						displayMessage(0);
					}
				}
			}
		}
	}

	function crush(crushPower) {
		stone += (crushPower / 10);
		stone = prettify(stone);
		document.getElementById("currentStone").innerHTML = "Stone: " + stone;
		if (stone >= 1 && attack == 0) {
			document.getElementById("attack").style.display = "inline";
			document.getElementById("craft").style.display = "inline";
			if (messages == 3) displayMessage(3);
		}
	}
	
	function sharpen() {
		if (stone >= sharpenCost) {
			stone -= sharpenCost;
			stone = prettify(stone);
			pickPower++;
			attack += 1;
			sharpenCost = sharpenCost + 1;
			document.getElementById("sharpenCost").innerHTML = sharpenCost;
			document.getElementById("currentStone").innerHTML = "Stone: " + stone;
			document.getElementById("dpc").innerHTML = pickPower;
			document.getElementById("attack").innerHTML = "<br>Attack: " + attack;
			document.getElementById("health").innerHTML = currentHealth;
			if (attack >= 3 && messages == 5) {
				document.getElementById("battlesWon").innerHTML = "Battles Won: " + battlesWon;
				document.getElementById("healthText").style.display = "inline";
				document.getElementById("health").style.color = "red";
				document.getElementById("health").style.display = "inline";
				document.getElementById("battlesWon").style.display = "inline";
				document.getElementById("battle").style.display = "inline";
				displayMessage(5);
			}
			if (attack >= 3 && plots.length == 1) {
				for (i = plots.length + 1; i <= maxPlots; i++) {
					var canvasNum = "buy" + i;
					canvas = document.getElementById(canvasNum);
					ctx = canvas.getContext('2d');
					ctx.font = "20px Arial";
					ctx.fillStyle = "#CC0000";
					ctx.fillRect(0, 0, plotWidth, plotHeight);
					ctx.font = "10px Arial";
					ctx.fillStyle = "#000000";
					ctx.fillText("Complete " + (((i - 1) * 3) - battlesWon) + " more battles to unlock", 50, plotHeight / 2);
					ctx.beginPath();
					ctx.moveTo(0, 0);
					ctx.lineTo(plotWidth, plotHeight);
					ctx.stroke();
					ctx.moveTo(0, plotHeight);
					ctx.lineTo(plotWidth, 0);
					ctx.stroke();
				}
			}
			if (attack == 1 && messages == 4) {
				displayMessage(4);
			}
		}
	}
	
	function buyWorm(){
		if (!paused) {
			if (worms == 0) {
				if (gems >= wormCost) {
					worms += 1;
					gems -= wormCost;
					dps = worms;
					document.getElementById("dps").innerHTML = dps;
					document.getElementById("currentGems").innerHTML = gems;
					document.getElementById("numWorms").innerHTML = worms + "";
					wormCost = 10;
					document.getElementById("wormCost").innerHTML = "Next: " + wormCost + " Dirt";
					displayMessage(1);
				}
			} else {
				if (dirt >= wormCost) {
					worms += 1;
					dirt -= wormCost;
					dps = worms;
					document.getElementById("dps").innerHTML = dps;
					document.getElementById("currentDirt").innerHTML = dirt;
					document.getElementById("numWorms").innerHTML = worms + "";
					wormCost = wormCost * 2;
					document.getElementById("wormCost").innerHTML = "Next: " + wormCost + " Dirt";
				}
			}
		}
	}
	
	function buyCrusher() {
		if (!paused) {
			if (crushers == 0) {
				if (gems >= crusherStoneCost) {
					crushers += 1;
					gems -= crusherStoneCost;
					sps = prettify(crushers / 10);
					document.getElementById("sps").innerHTML = "Stone per second: " + sps + "<br>";
					document.getElementById("currentGems").innerHTML = gems;
					document.getElementById("numCrushers").innerHTML = crushers + "";
					crusherStoneCostCost = 0.1;
					document.getElementById("crusherCost").innerHTML = "Next: " + crusherDirtCost + " Dirt<br>" + crusherStoneCost + " Stone<br>";
					displayMessage(2);
				}
			} else {
				if (dirt >= crusherDirtCost && stone >= crusherStoneCost) {
					crushers += 1;
					dirt -= crusherDirtCost;
					stone -= crusherStoneCost;
					stone = prettify(stone);
					sps = prettify(crushers / 10);
					document.getElementById("sps").innerHTML = "Stone per second: " + sps + "<br>";
					document.getElementById("currentDirt").innerHTML = dirt;
					document.getElementById("currentStone").innerHTML = stone;
					document.getElementById("numCrushers").innerHTML = crushers + "";
					crusherDirtCost = crusherDirtCost * 2;
					crusherStoneCost = crusherStoneCost * 2;
					document.getElementById("crusherCost").innerHTML = "Next: " + crusherDirtCost + " Dirt<br>" + crusherStoneCost + " Stone<br>";
				}
			}
		}
	}
	
	//Begin a battle!
	function battle() {
		if (currentHealth >= 1) {
			inBattle = true;
			document.getElementById("startBattle").style.display = "none";
			if (battlesWon <= 20) {
				//Some easy enemies to start.
				enemyHealth = 5;
				enemyAttack = 1;
				numEnemies = 1;
			} else {
				//Placeholder enemies for now.
				enemyHealth = 10;
				enemyAttack = 5;
				numEnemies = 2;
			}
			startFight(enemyHealth, enemyAttack, numEnemies);
			if (!autoFightActive) document.getElementById("attackButton").style.display = "inline";
		} else {
			battleMessage(0, 0);
		}
	}
	
	//Spawns enemies to fight you.
	function startFight(enemyHealth, enemyAttack, numEnemies) {
		enemies = [0];
		for (i = 0; i < numEnemies; i++) {
			enemies[i] = enemyHealth;
			var enemyNum = "enemy" + (i + 1);
			document.getElementById(enemyNum).style.display = "inline";
			document.getElementById(enemyNum).atkValue = enemyAttack;
			document.getElementById(enemyNum).hpValue = enemyHealth;
		}
	}
	
	//Perform a basic attack.
	function performAttack() {
		for (i = 0; i < enemies.length; i++) {
			if (enemies[i] > 0) {
				enemies[i] -= attack;
				battleMessage(1, attack);
				if (enemies[i] <= 0) {
					enemies[i] = 0;
					numEnemies -= 1;
					var enemyNum = "enemy" + (i + 1);
					document.getElementById(enemyNum).style.display = "none";
					battleMessage(2, numEnemies);
					if (numEnemies > 0) {
						currentHealth -= (enemyAttack * numEnemies);
						currentHealth = prettify(currentHealth);
						if (currentHealth < 0) currentHealth = 0;
						document.getElementById("health").style.color = "black";
						document.getElementById("health").innerHTML = currentHealth;
						battleMessage(3, (enemyAttack * numEnemies));
					}
				} else {
					currentHealth -= (enemyAttack * numEnemies);
					currentHealth = prettify(currentHealth);
					if (currentHealth < 0) currentHealth = 0;
					document.getElementById("health").style.color = "black";
					document.getElementById("health").innerHTML = currentHealth;
					battleMessage(3, (enemyAttack * numEnemies));
				}
				break;
			}
		}
		if (currentHealth == 0) {
			inBattle = false;
			for (i = 0; i < enemies.length; i++) {
				var enemyNum = "enemy" + (i + 1);
				document.getElementById(enemyNum).style.display = "none";
			}
			document.getElementById("attackButton").style.display = "none";
			if (!autoFightActive) document.getElementById("startBattle").style.display = "inline";
			battleMessage(4, 0);
		}
		if (numEnemies <= 0) {
			battleWon();
		}
	}
	
	function battleWon() {
		inBattle = false;
		battlesWon += 1;
		gems += enemies.length;
		document.getElementById("currentGems").innerHTML = gems;
		document.getElementById("attackButton").style.display = "none";
		if (!autoFightActive) document.getElementById("startBattle").style.display = "inline";
		battleMessage(5, enemies.length);
		document.getElementById("battlesWon").innerHTML = "Battles Won: " + battlesWon;
		if (battlesWon == 10) {
			battleMessage(6, battlesWon);
			//Make the Shop menu visible.
			document.getElementById("shop").style.display = "inline";
		}
		if (attack >= 1 && plots.length < maxPlots) {
			for (i = plots.length + 1; i <= maxPlots; i++) {
				var canvasNum = "buy" + i;
				canvas = document.getElementById(canvasNum);
				ctx = canvas.getContext('2d');
				ctx.font = "20px Arial";
				ctx.fillStyle = "#CC0000";
				ctx.fillRect(0, 0, plotWidth, plotHeight);
				ctx.fillStyle = "#000000";
				if ((((i - 1) * 3) - battlesWon) == 1)
				{
					ctx.font = "10px Arial";
					ctx.fillText("Complete 1 more battle to unlock", 50, plotHeight / 2);
				}
				else if (battlesWon < ((i - 1) * 3)) {
					ctx.font = "10px Arial";
					ctx.fillText("Complete " + (((i - 1) * 3) - battlesWon) + " more battles to unlock", 50, plotHeight / 2);
				} else {
					ctx.font = "15px Arial";
					ctx.fillText("10 Gems to unlock", 65, plotHeight / 2);
				}
				ctx.beginPath();
				ctx.moveTo(0, 0);
				ctx.lineTo(plotWidth, plotHeight);
				ctx.stroke();
				ctx.moveTo(0, plotHeight);
				ctx.lineTo(plotWidth, 0);
				ctx.stroke();
			}
		}
	}
	
	function autoFight() {
		if (autoFightActive) {
			autoFightActive = false;
			document.getElementById("autoFightActive").innerHTML = "OFF";
			battleMessage(8);
			if (inBattle) {
				document.getElementById("attackButton").style.display = "inline";
			} else {
				document.getElementById("startBattle").style.display = "inline";
			}
		} else {
			autoFightActive = true;
			battleMessage(7);
			document.getElementById("autoFightActive").innerHTML = "ON";
			if (inBattle) {
				document.getElementById("attackButton").style.display = "none";
			} else {
				document.getElementById("startBattle").style.display = "none";
			}
		}
	}
	
	function restoreHP() {
		currentHealth += 0.1;
		currentHealth = prettify(currentHealth);
		if (currentHealth == maxHealth) document.getElementById("health").style.color = "red";
		document.getElementById("health").innerHTML = currentHealth;
	}
	
	function buy(item) {
		switch (item) {
			case -1: 
				shopMessage(-2);
				break;
			case 0: 
				//Buying pick upgrade.
				if (gems >= 50) {
					gems -= 50;
					document.getElementById("currentGems").innerHTML = gems;
					document.getElementById("buyPick").style.display = "none";
					shopMessage(item);
				}
				break;
			case 1: 
				//Buying a Hat.
				if (gems >= 10) {
					gems -= 10;
					document.getElementById("currentGems").innerHTML = gems;
					maxHealth += 10;
					currentHealth += 10;
					document.getElementById("health").innerHTML = currentHealth;
					document.getElementById("buyHat").style.display = "none";
					shopMessage(item);
				}
				break;
			case 2:
				//Buying an Axe.
				if (gems >= 25) {
					gems -= 25;
					document.getElementById("currentGems").innerHTML = gems;
					document.getElementById("buyAxe").style.display = "none";
					document.getElementById("forest").style.display = "inline";
					haveAxe = true;
					shopMessage(item);
				}
				break;
			case 3:
				if (gems >= 500) {
					gems -= 500;
					document.getElementById("currentGems").innerHTML = gems;
					document.getElementById("autoFight").style.display = "inline";
					document.getElementById("buyAutoFight").style.display = "none";
					shopMessage(item);
				}
				break;
			default: 
				shopMessage(-2);
				break;
		}
	}
	
	//Screw Javascript's floats
	function prettify(input) {
		var output = Math.round(input * 1000) / 1000;
		return output;
	}
	
	function shopMessage (message, value) {
		switch (message) {
			case -1: 
				document.getElementById("sLog").innerHTML += "Test Message<br>";
				break;
			case 0: 
				document.getElementById("sLog").innerHTML += "A pick or something? Dunno.";
				break;
			case 1:
				document.getElementById("sLog").innerHTML += "You got a stylish new hat!";
				break;
			case 2:
				document.getElementById("sLog").innerHTML += "Something something.";
				break;
			case 3: 
				document.getElementById("sLog").innerHTML += "Unlocked the Autofight option! You'll find it on the battle screen.";
				break;
			default: 
				document.getElementById("sLog").innerHTML += "Something went wrong, this message is an error message.";
				break;
		}
		document.getElementById("sLog").innerHTML += "<br>";
		document.getElementById("sLog").scrollTop = document.getElementById("sLog").scrollHeight;
	}
	
	function battleMessage (message, value) {
		switch (message) {
			case -1: 
				document.getElementById("bLog").innerHTML += "Test Message";
				break;
			case 0:
				document.getElementById("bLog").innerHTML += "Wait to recover HP";
				break;
			case 1:
				document.getElementById("bLog").innerHTML += "Dealt " + value + " damage!";
				break;
			case 2:
				document.getElementById("bLog").innerHTML += "Enemy defeated!";
				break;
			case 3:
				document.getElementById("bLog").innerHTML += "Took " + value + " damage!";
				break;
			case 4:
				document.getElementById("bLog").innerHTML += "You've been severly injured!<br>";
				break;
			case 5:
				if (value == 1) document.getElementById("bLog").innerHTML += "Victory! Received 1 gem!<br>";
				if (value > 1) document.getElementById("bLog").innerHTML += "Victory! Received " + value + " gems!<br>";
				break;
			case 6:
				document.getElementById("bLog").innerHTML += "Now that you've made the surrounding area a little safer, it looks like an old man has set up shop nearby.<br>";
				break;
			case 7: 
				document.getElementById("bLog").innerHTML += "Autofight on. Battles will automatically begin when your HP is full.";
				break;
			case 8: 
				document.getElementById("bLog").innerHTML += "Autofight off.";
				break;
			default: 
				document.getElementById("bLog").innerHTML += "Something went wrong, this message is an error message.";
				break;
		}
		document.getElementById("bLog").innerHTML += "<br>";
		document.getElementById("bLog").scrollTop = document.getElementById("bLog").scrollHeight;
	}
	
	//Displays the passed message in the Message Log.
	function displayMessage (message) {
		document.getElementById("log").innerHTML += "<br>";
		switch (message) {
			case -1:
				document.getElementById("log").innerHTML += "Test Message";
				break;
			case 0:
				document.getElementById("log").innerHTML += "Your first gem. It's a bit tedius sifting through all this dirt though, perhaps some of the local fauna could help.";
				break;
			case 1: 
				document.getElementById("log").innerHTML += "These will automatically bring gems to the surface, as well as collect the dirt they feed on. You'll still need to collect the gems yourself though.";
				break;
			case 2: 
				document.getElementById("log").innerHTML += "These funny looking beetles will crush rocks into more manageable sizes. There's got to be some uses for the smaller stones.";
				break;
			case 3:
				document.getElementById("log").innerHTML += "Ah yes, you should be able to fashion a sharpening stone with enough material."
				break;
			case 4:
				document.getElementById("log").innerHTML += "This will help you mine faster. Any sharper and you might be able to hurt someone with it...";
				break;
			case 5: 
				document.getElementById("log").innerHTML += "If you manage to clear away some of the aggressive beasts near you, you might even be able to expand your mining area towards the additional plots nearby.";
				break;
			default: 
				document.getElementById("log").innerHTML += "Something went wrong, this message is an error message.";
				break;
		}
		//Tidys up and scrolls if needed.
		document.getElementById("log").innerHTML += "<br>";
		document.getElementById("log").scrollTop = document.getElementById("log").scrollHeight;
		messages++;
	}
	
	//Goes to the Crafting Screen when the Craft button is clicked. 
	function goCraft() {
		//Changes the current screen variable to the Craft Screen.
		var element = document.getElementsByClassName("current");
		element[0].style.display = "none";
		element[0].classList.remove("current");
		element = document.getElementById("craftScreen");
		element.style.display = "inline";
		element.classList.add("current");
		document.getElementById("battleLog").style.display = "none";
		document.getElementById("shopLog").style.display = "none";
		document.getElementById("gameLog").style.display = "inline";
	}
	
	//Goes to the Mine Screen when the Mine button is clicked. 
	function goMine() {
		//Changes the current screen variable to the Mine Screen.
		var element = document.getElementsByClassName("current");
		element[0].style.display = "none";
		element[0].classList.remove("current");
		element = document.getElementById("mainScreen");
		element.style.display = "inline";
		element.classList.add("current");
		document.getElementById("battleLog").style.display = "none";
		document.getElementById("shopLog").style.display = "none";
		document.getElementById("gameLog").style.display = "inline";
	}
	
	//Goes to the Battle Screen when the Battle button is clicked. 
	function goBattle() {
		//Changes the current screen variable to the Battle Screen.
		var element = document.getElementsByClassName("current");
		element[0].style.display = "none";
		element[0].classList.remove("current");
		element = document.getElementById("battleScreen");
		element.style.display = "inline";
		element.classList.add("current");
		document.getElementById("gameLog").style.display = "none";
		document.getElementById("shopLog").style.display = "none";
		document.getElementById("battleLog").style.display = "inline";
		document.getElementById("bLog").scrollTop = document.getElementById("bLog").scrollHeight;
	}
	
	//Goes to the Shop Screen when the Shop button is clicked. 
	function goShop() {
		//Changes the current screen variable to the Shop Screen.
		var element = document.getElementsByClassName("current");
		element[0].style.display = "none";
		element[0].classList.remove("current");
		element = document.getElementById("shopScreen");
		element.style.display = "inline";
		element.classList.add("current");
		document.getElementById("battleLog").style.display = "none";
		document.getElementById("gameLog").style.display = "none";
		document.getElementById("shopLog").style.display = "inline";
	}
	
	function goForest() {
		//Changes the current screen variable to the Forest Screen.
		var element = document.getElementsByClassName("current");
		element[0].style.display = "none";
		element[0].classList.remove("current");
		element = document.getElementById("forestScreen");
		element.style.display = "inline";
		element.classList.add("current");
		document.getElementById("battleLog").style.display = "none";
		document.getElementById("shopLog").style.display = "none";
		document.getElementById("gameLog").style.display = "inline";
	}
	
	function goSettings() {
		//Changes the current screen variable to the Settings Screen.
		var element = document.getElementsByClassName("current");
		element[0].style.display = "none";
		element[0].classList.remove("current");
		element = document.getElementById("settingsScreen");
		element.style.display = "inline";
		element.classList.add("current");		
		document.getElementById("battleLog").style.display = "none";
		document.getElementById("shopLog").style.display = "none";
		document.getElementById("gameLog").style.display = "none";
	}
	
	function goAchievements() {
		//Changes the current screen variable to the Achievements Screen.
		var element = document.getElementsByClassName("current");
		element[0].style.display = "none";
		element[0].classList.remove("current");
		element = document.getElementById("achievementsScreen");
		element.style.display = "inline";
		element.classList.add("current");		
		document.getElementById("battleLog").style.display = "none";
		document.getElementById("shopLog").style.display = "none";
		document.getElementById("gameLog").style.display = "none";		
	}
	
	//Saves the game variables into HTML5 local storage. Need to add all variables. 
	function saveGame() {
		var save = {
			gems: gems,  
			gemNow: gemNow, 
			dirt: dirt, 
			worms: worms, 
			wormCost: wormCost, 
			stone: stone, 
			crushers: crushers, 
			crusherDirtCost: crusherDirtCost, 
			crusherStoneCost: crusherStoneCost, 
			attack: attack
		}
		localStorage.setItem("save", JSON.stringify(save));
	}
	
	//Loads the game from the HTML5 local storage. Need to add try/catch and all variables, as well as ensure the game screen looks right.
	function loadGame() {
		var save = JSON.parse(localStorage.getItem("save"));
		if (typeof save.gems != "undefined") gems = save.gems;
		if (typeof save.gemNow != "undefined") gemNow = save.gemNow;
		if (typeof save.dirt != "undefined") dirt = save.dirt;
		if (typeof save.worms != "undefined") worms = save.worms;
		if (typeof save.wormCost != "undefined") wormCost = save.wormCost;
		if (typeof save.stone != "undefined") stone = save.stone;
		if (typeof save.crushers != "undefined") crushers = save.crushers;
		if (typeof save.crusherDirtCost != "undefined") crusherDirtCost = save.crusherDirtCost;
		if (typeof save.crusherStoneCost != "undefined") crusherStoneCost = save.crusherStoneCost;
		if (typeof save.attack != "undefined") attack = save.attack;
		mine(0, false);
	}
	
	//Deletes the HTML5 local storage. 
	function deleteSave() {
		localStorage.removeItem("save");
	}
	
	//Pauses or unpauses the game when the button it clicked. 
	function pauseGame() {
		if (paused) {
			paused = false;
			document.getElementById("pauseText").style.display = "none";
		} else {
			paused = true;
			document.getElementById("pauseText").style.display = "inline";
		}
	}
	
	//Runs the main game loop every second. This is your passive resource generation.
	window.setInterval(function(){
		if (!paused) {
			if (worms > 0) {
			plots.forEach(myFunction);
			}
			if (crushers > 0) crush(crushers);
			if (currentHealth < maxHealth && !inBattle) restoreHP();
			if (autoFightActive) {
				if (inBattle) {
					performAttack();
				} else {
					if (currentHealth == maxHealth) battle();
				}				
			}
		}
	}, 1000);
	
	//Keyboard shortcuts.
	document.onkeypress = function(e) {
		if (e.which == 109) goMine();
		else if (e.which == 99 && document.getElementById("craft").style.display == "inline") goCraft();
		else if (e.which == 98 && document.getElementById("battle").style.display == "inline") goBattle();
		else if (e.which == 115 && document.getElementById("shop").style.display == "inline") goShop();
		else if (e.which == 102 && document.getElementById("forest").style.display == "inline") goForest();
	}
	
	//Used to loop through the mine function for each mine plot you have.
	function myFunction(value, index, array) {
		mine((worms / plots.length), false, index);
	}
	
	function updateScale() {
		var ww = $win.width();
		var wh = $win.height();
		var newScale = 1;
		//Compare ratios.
		if (ww/wh < baseSize.w / baseSize.h) {
			newScale = ww / baseSize.w;
		} else {
			newScale = wh / baseSize.h;
		}
		$lay.css('transform', 'scale(' + newScale + ',' + newScale + ')');
		//console.log(newScale);
	}
	
	$(window).resize(updateScale);
	
	//add paypal donate button
	//add Google Analytics re: http://dhmstark.co.uk/articles/incrementals-part-2.html
	
	
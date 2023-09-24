#!/usr/bin/env node
const url = "http://127.0.0.1:5000/game"

// Data to export to Table.js
let isInitialized = true;
let deck = []
let playerDeck = []
let playerId = ""
let firstPlayer = ""
let topCard = ""

// Initialize A Game
async function initializeGame(gameType, maxPlayers, gameRule = "Joker") {
    const gameUrl = url + "/initialize_game";
    const gameDetails = {
        game_type : gameType,
        max_players: maxPlayers,
        game_rule: gameRule
    }

    try {
        const response = await fetch (gameUrl, {
            method: "POST",
            headers: {
                "Content-Type" : "application/json"
            },
            body: JSON.stringify(gameDetails)
        });
    
        const gameData = await response.json();
        const gameId = gameData.game_id;
        console.log("Game ID:", gameId);
        isInitialized = true;
        return (gameData)

    } catch (error) {
        console.log("[DEBUG] Error: ", error);
    }
}

// Initialze a player for a game
async function initializePlayer(gameId, name, amount, userId) {
    // Note: When testing this functions, the variable isInitialized was 
    // Relevant, however, it is not anymore since I can pass the gameId as
    // a parameter from the client
    if (isInitialized) {
        if (name && amount){
            const playerUrl = `${url}/${gameId}/initialize_player`
            const playerDetails = {
                player_name: name,
                player_amount: amount,
                user_id : userId
            }

            try {
                const response = await fetch (playerUrl, {
                    method: "POST",
                    headers: {
                        "Content-Type" : "application/json"
                    },
                    body: JSON.stringify(playerDetails)
                });
            

                const playerData = await response.json()
                playerId = playerData.player_id
                playerDeck = playerData.player_deck

                console.log("Player ID: ", playerId)
                console.log("Player Deck: ", playerDeck)
                return (playerData);
            } catch (error) {
                console.log("[DEBUG] Error: ", error);
                return (error)
            }
        } else {
            console.log("[DEBUG] Name and Amount must be defined")
            return("Name and Amount must be defined ")
        }
   } else {
        setTimeout(initializePlayer, 300);
    }
}

// Function to start the game
async function startGame(gameId){
    const startGameUrl = `${url}/${gameId}/start`

    try {
        const response = await fetch(startGameUrl, {
            method: "GET",
            headers: {
                "Content-Type" : "application/json"
            }
        });

        const startGameData = await response.json()
        topCard = startGameData.top_card
        firstPlayer = startGameData.first_player
        deck = startGameData.deck

        console.log("Deck: ", deck)
        console.log("Top Card: ", topCard)
        console.log("First Player is: ", firstPlayer)

        return (startGameData)
    } catch (error) {
        console.log("Error", error)
    }
}

export { startGame, initializePlayer, initializeGame};



// async function main() {
//     await initializeGame("cash_game")
//     await initializePlayer("Maguire", 1000)
//     await initializePlayer("Bambi", 2000)
//     await initializePlayer("Panda", 3000)
//     await startGame()
// }

// main ();

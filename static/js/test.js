#!/usr/bin/env node
import { initializeGame, initializePlayer } from './data_table.js'

const gameInfo = await initializeGame("cash_game")
const playerInfo = await initializePlayer("Oduor", 1000)

if (gameInfo) {
    console.log("Game Id: " + gameInfo.game_id)
} else {
    console.log("Failed to initialize Game")
}

if (playerInfo) {
    console.log("Player ID: ", playerInfo.player_id)
    console.log("Player Deck: ", playerInfo.player_deck)
} else {
    console.log("Failed to initialize Player")
}
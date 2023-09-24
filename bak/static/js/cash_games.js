import { initializeGame, startGame, initializePlayer } from './data_table.js'

// When new button is clicked, initialize a new Game
const newGameBtn = document.getElementById('dev_btn-new-game')

// Play Button to make the user join the requested game
const playButtons = document.querySelectorAll('playBtn')

// Amount Feedback
const amountInput = document.getElementById('amountInput')
const amountFeedback = document.getElementById('amountFeedback')

// Players Input and Feedback
const noOfPlayersInput = document.getElementById('noOfPlayersInput')
const playersFeedback = document.getElementById('playersFeedback')

// Proceed button to table.html
const proceedBtn = document.getElementById('dev_btn-proceed')

// Modal
const modalElement = document.getElementById('modal_new-game-details')
const modalInstance = new bootstrap.Modal(modalElement)

newGameBtn.addEventListener('click', function() {
    let loading = document.createElement('span')
    loading.classList.add('spinner-grow')
    loading.classList.add('spinner-grow-sm')
    loading.style.marginLeft = "15px"
    loading.setAttribute('role', 'status')
    loading.setAttribute('aria-hidden', true)
    newGameBtn.textContent = "Loading"
    newGameBtn.setAttribute('disabled', true)
    newGameBtn.appendChild(loading)



    setTimeout(function () {
        newGameBtn.removeChild(loading)
        newGameBtn.removeAttribute('disabled')
        newGameBtn.textContent = "New Game"

        if (1) {
            // Redirect to Table.html
            // Show modal if game is initialized

            newGameBtn.setAttribute('data-bs-target', "#modal_new-game-details")
            modalInstance.show()
            newGameBtn.removeAttribute('data-bs-target')

        } else {
            const errorToast = createToast('This is an error')
            const toastInstance = new bootstrap.Toast(toastDiv)
            toastInstance.show();
            console.log("NO GAME DATA")
        }
    }, 1000)

})

// Function to create an Error Toast
function createToast(error){
    const toastDiv = document.createElement('div')
    toastDiv.classList.add('position-fixed')
    toastDiv.classList.add('bottom-0')
    toastDiv.classList.add('end-0')
    toastDiv.classList.add('p-3')
    toastDiv.style.zIndex = "11";
    toastDiv.innerHTML = `
        <div id="liveToast" class="toast show" role="alert" aria-live="assertive" aria-atomic="true">
            <div class="toast-header">
            <i class="bi bi-x-circle-fill me-2"></i>
            <strong class="me-auto">${error}</strong>
            <small>Just Now</small>
            <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
            <div class="toast-body">
                Error Initializing Game 
        </div>
    `;
    document.body.appendChild(toastDiv);
    return (toastDiv)
}

// Validate input
function validateAmount(){
    const amount = amountInput.value
    if (amount.length > 0) {
        if (amount < 5) {
            amountInput.classList.add('is-invalid')
            amountFeedback.classList.add('invalid-feedback')
            amountFeedback.textContent = "Above 5/="
            return false;
        } else {
            amountInput.classList.remove('is-invalid')
            amountFeedback.classList.remove('invalid-feedback')
            amountFeedback.textContent = ""
            return true;
        }
    }
}

amountInput.addEventListener('input', validateAmount)

// Vallidate No. of players
function validatePlayers() {
    const numberOfPlayers = noOfPlayersInput.value
    if (numberOfPlayers.length > 0) {
        if (numberOfPlayers > 8) {
            noOfPlayersInput.classList.add('is-invalid')
            playersFeedback.classList.add('invalid-feedback')
            playersFeedback.textContent = "Max of 8"
            return false;
        } else {
            noOfPlayersInput.classList.remove('is-invalid')
            noOfPlayersInput.classList.remove('invalid-feedback')
            playersFeedback.textContent = ""
            return true;
        }
    }
}

noOfPlayersInput.addEventListener('input', validatePlayers);

// Enable proceed button
const buttonCheck = setInterval(() => {
    if (validateAmount() && validatePlayers()) {
    proceedBtn.removeAttribute('disabled')
    clearInterval(buttonCheck)
    } else {
        proceedBtn.setAttribute('disabled', true)
    }
}, 200)

// This function is the function borrowed from table.js for making the joining event to the server
// async function playerJoinGame(gameId, userId) {
//     const gameId = sessionStorage.getItem('gameId')
//     const userId = sessionStorage.getItem('userId')
//     console.log("[CLIENT] Player Join Game has been called")
//     const socket = io();
//     console.log("[CLIENT] Making a socket")
//     const gameDetails = {
//         gameId: gameId,
//         userId: userId
//     }
//     socket.emit('join', gameDetails)
// }



// Attaching an event listner to the play button
const gameTable = document.getElementById('cashGameTable')

gameTable.addEventListener('click', async function(event) {
    // Check if it has a playBtn class
    if (event.target.classList.contains('playBtn')) {
        const gameId = event.target.dataset.gameid
        const userId = event.target.dataset.userid
        const username = event.target.dataset.username
        const amount = event.target.dataset.entryfee

        sessionStorage.setItem('gameId', gameId)
        sessionStorage.setItem('username', username)
        // sessionStorage.setItem('amount', amount)
        sessionStorage.setItem('userId', userId)

        console.log(`[CLIENT] Initializing ${username}  for game: ${gameId} `)

        // Initialize the player
        const initPlayerPromise = initializePlayer(gameId, username, parseInt(amount), userId)
        const initPlayerData = await initPlayerPromise

        const playerId = initPlayerData.player_id
        const playerDeck = initPlayerData.player_deck

        sessionStorage.setItem('playerId', playerId)

        console.log("[CLIENT] Player ID: ", playerId)
        console.log("[CLIENT] Player Deck: ", playerDeck)

        const socket = io();
        console.log("[CLIENT] Making a socket")
        const gameDetails = {
            gameId: gameId,
            userId: userId

        }
        
        // Wrap the socket in a promise
        const joinPromise = new Promise((resolve, reject) => {
            socket.emit('join', gameDetails, () => {
                resolve();
            })
        })

        await joinPromise;

        window.location.href = "/table"

        // const playerDetailsPromise = initializePlayer(gameId, username, amount, userId)
        // const playerDetails = await playerDetailsPromise
        // if (playerDetails) {
        //     const playerId = playerDetails.player_id
        //     const playerDeck = playerDetails.player_deck
        //     console.log(` [CLIENT] Player ID: ${playerId} with Deck: ${playerDeck}`)
            
        // }
        // else {
        //     console.log("[CLIENT] Player could not be initialized")
        // }
    }
})

// Initialize Cash Game
proceedBtn.addEventListener('click', async function() {
    try {
        const maxPlayers = noOfPlayersInput.value
        const initGameDataPromise = initializeGame("cash_game", maxPlayers, "Joker")
        const initGameData = await initGameDataPromise
        
        const gameId = initGameData.game_id
        const username = initGameData.username
        const amount = amountInput.value;
        const userId = initGameData.user_id 

        console.log("[CLIENT] GameData: ", initGameData)
        console.log("[CLIENT] Game ID:", initGameData.game_id)
        console.log("[CLIENT] Username: ", initGameData.username)
        
        // Initialize the player
        const initPlayerPromise = initializePlayer(gameId, username, parseInt(amount), userId)
        const initPlayerData = await initPlayerPromise

        const playerId = initPlayerData.player_id
        const playerDeck = initPlayerData.player_deck

        if (playerId && playerDeck) {
            console.log("[CLIENT] Player ID: ", playerId)
            console.log("[CLIENT] Player Deck: ", playerDeck)
            sessionStorage.setItem('playerId', playerId)
            sessionStorage.setItem('userId', userId)
            sessionStorage.setItem('username', username)

            // Pass necessary values to the session storage
            sessionStorage.setItem('gameId', initGameData.game_id)
            window.location.href = "/table"
            modalInstance.hide()
        } else {
            const errorToast = createToast("Player was not initialized")
            const toastInstance = new bootstrap.Toast(errorToast)
            toastInstance.show();
            console.log("[CLIENT] Player was not initialized")
            modalInstance.hide()
        }

    } catch (error) {
        console.log("[CLIENT] Error Initializing Game: ", error)
    }

})

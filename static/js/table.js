import { startGame, 
    initializePlayer 
    } from './data_table.js';

const serverUrl = "127.0.0.1:5000"

// Call Functions when window loads
window.onload = async function () {
    // const gameId = sessionStorage.getItem('gameId') 
    // const username = sessionStorage.getItem('username') 
    // const amount = sessionStorage.getItem('amount') 
    // const userId = sessionStorage.getItem('userId') 
    // console.log("[CLIENT] Game ID Received: ", gameId)
    // console.log("[CLIENT] Username Received: ", username)
    // console.log("[CLIENT] UserID Received: ", userId)

    // Initialize Player
    // const playerData = await initializePlayer(gameId, username, parseInt(amount), userId)
    // console.log("[CLIENT]", playerData.player_id)
    // console.log("[CLIENT]", playerData.player_deck)

    // // Start the game
    // const startGameData = await startGame(gameId)
    // console.log("[CLIENT] Deck", startGameData.deck)
    // console.log("[CLIENT] Top Card: ", startGameData.top_card)
    // console.log("[CLIENT] First Player: ", startGameData.first_player)

    
    // // Game Deck
    // let thisDeck = startGameData.deck
    // console.log("THIS DECK: ", thisDeck)
    // populatePlayersDeck(playerData.player_deck)
    // populatePickingPile(startGameData.deck)
    // assignTopCard(startGameData.top_card)

}

// function initializePlayerContainer() {
//     const playerId = sessionStorage.getItem('playerId')
//     const playerContainer = document.getElementById(`player-${playerId}-container`)

//     playerContainer.style.display = "block";
//     // playerContainer.classList.add('bottom-container')
// }


// Socket for when the user enters the table
const socket = io();

function handleJoinEvent(playersInfo) {
    console.log("[CLIENT] Player Data Received: ", playersInfo)
    
    for (let [key, value] of Object.entries(playersInfo)) {
        const userId = key
        const playersInfo = value
        const playerId = playersInfo.player_id
        const playerName = playersInfo.player_name
        console.log(`NAME: ${playerName} ID: ${userId}`)

        const main = document.querySelector('.main-container')
        const userInGame = main.getAttribute('data-userid')
        

        if (userId !== userInGame) {
            // Check if container exists
            const isContainerPresent = document.querySelector(`[data-userid="${userId}"]`)
            if (!isContainerPresent){
                const playerContainer = createPlayerContainer(playerId, userId, playerName)
                playerContainer.style.display = 'block';
                playerContainer.classList.add('top-container')

                const mainContainer = document.getElementById(`main-${userInGame}-container`)
                if (mainContainer) {
                    mainContainer.appendChild(playerContainer)
                } else {
                    console.log("[CLIENT] Main Container cannot be found.")
                }

            }
            else {
                console.log("[CLIENT] Container has been found. Not Creating")

            }
        } 
        else {
            console.log("[CLIENT] Not creating container for user: ", userInGame)
        }
    }

}

socket.on('join',handleJoinEvent) 

// This function will fetch players who are alredy in the game for the newly joined user
async function fetchOtherPlayers(gameId) {
    const fetchPlayerUrl = `/game/${gameId}/players`
    const response = await fetch (fetchPlayerUrl, {
        method: 'GET',
        headers: {
            "Content-Type":"application/json"
        }
    })

    const playerDetails = await response.json()
    if (playerDetails) {
        console.log("[CLIENT] Player Details: ", playerDetails)
        const playersInfo = playerDetails.players_info
        console.log("[CLIENT] Players Info: ", playersInfo)

        for (let [key, value] of Object.entries(playersInfo)) {
            const userId = key
            const playerInfo = value
            const playerId = playerInfo.player_id
            const playerName = playerInfo.player_name



            const main = document.querySelector('.main-container')
            const userInGame = main.getAttribute('data-userid')

            if (userId !== userInGame) {
                // Check if container exists
                const isContainerPresent = document.querySelector(`[data-userid="${userId}"]`)
                if (!isContainerPresent){
                    const playerContainer = createPlayerContainer(playerId, userId, playerName)
                    playerContainer.style.display = 'block';
                    playerContainer.classList.add('top-container')

                    const mainContainer = document.getElementById(`main-${userInGame}-container`)
                    if (mainContainer) {
                        mainContainer.appendChild(playerContainer)
                    } else {
                        console.log("[CLIENT] Main Container cannot be found.")
                    }

                }
                else {
                    console.log("[CLIENT] Container has been found. Not Creating")
                }
            } 
            else {
                console.log("[CLIENT] Not creating container for user: ", userInGame)
            }
        }
    } else {
        console.log("No Players Currently")
    }
}

fetchOtherPlayers(sessionStorage.getItem('gameId'))

// Tooltips
var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl)
})

// Function to show tooltip
function showTooltip(dropdownButton) {
    let tooltip = bootstrap.Tooltip.getInstance(dropdownButton);
    tooltip.show();

    if (tooltip) {
        setTimeout(function () {
            tooltip.hide();
        }, 2000); 
    }
}

// // Timer
// var player2timerButton = document.getElementById('player2-timerButton');
// var player2timerValue = document.getElementById('player2-timerValue');

// // Timer Variables
// let seconds = 0;
// let minutes = 0;
// let isRunning = false;
// let timerInterval;

// // Function to update the timer
// function updateTimer() {
//     seconds++;

//     if (seconds >= 60) {
//         seconds = 0;
//         minutes++;
//     }

//     // Format the time as hh:mm
//     let formattedTime = ('0' + minutes).slice(-2) + ':' + ('0' + seconds).slice(-2);
//     player2timerValue.textContent = formattedTime;
// }

// // Function to start the timer
// function startTimer() {
//     console.log("Starting timer");
//     isRunning = true; 
//     timerInterval = setInterval(updateTimer, 1000);
// }

// // Function to stop the timer
// function stopTimer() {
//     console.log("Stopping Timer");
//     isRunning = false;
//     clearInterval(timerInterval);
// }

// // Function to reset the timer
// function resetTimer() {
//     seconds = 0;
//     minutes = 0;
//     player2timerValue.textContent = "00:00"; 
//     console.log("Reseting timer");
// }

// // Event Listener for the timer
// player2timerButton.addEventListener('click', function () {
//     if (isRunning){
//         stopTimer();
//     } else {
//         startTimer();
//     }
// });


// // Resting the timer
// let clickCount = 0;
// player2timerButton.addEventListener('mousedown', function () {
//     clickCount++;

//     if (clickCount === 1){
//         clickTimeout = setTimeout(function () {
//             clickCount = 0;
//         }, 300);
//     } else if (clickCount === 2) {
//         clearTimeout(clickTimeout);
//         clickCount = 0;
//         resetTimer();
//         stopTimer();
//     }
// })



// This function is used to add styles to a deck card and necessary attributes
function addDeckCardStyles(cardDiv, card) {
    cardDiv.style.backgroundImage = `url('{{ url_for('static', filename='assets/deck-cards/v2/') }}${card}.png')`;
    // cardDiv.style.backgroundImage = "url('assets/deck-cards/v2/" + card + ".png')";
    cardDiv.classList.add('deck-card')
    cardDiv.setAttribute('draggable', true);
    cardDiv.setAttribute('id', 'card-' + cardCounter++);
    
    // Drag Listeners
    cardDiv.addEventListener('dragstart', handleCardDragStart);
    cardDiv.addEventListener('dragend', handleCardDragEnd);

    // Touch Listeners
    cardDiv.addEventListener('touchstart', handleTouchStart);
    cardDiv.addEventListener('touchend', handleTouchEnd);
    cardDiv.addEventListener('touchmove', handleTouchMove);
    cardDiv.addEventListener('touchend', handleTouchDrop);

}


// Populate a player's deck
function populatePlayersDeck(playerId, playerDeckDict) {
    console.log("[CLIENT] (PopulatePlayersDeck) Deck Received to populate: ",playerDeckDict)
    // First Get the player Deck
    const playerContainer = document.getElementById(`player-${playerId}-container`)
    const playerDeckContainer = playerContainer.querySelector(`#player-${playerId}-deck`)
    const bottomContainer = document.querySelector('.bottom-container')
    const topContainer = document.querySelector('.top-container')

    if (playerDeckContainer) {
        console.log("[CLIENT] Player Deck Container Found")

        const topContainerId = topContainer.getAttribute('id')
        const bottomContainerId = bottomContainer.getAttribute('id')
        console.log("[CLIENT] Bottom Container ID Found: ", bottomContainerId)
        if (bottomContainerId === `player-${playerId}-container`) {
            console.log("[CLIENT] BottomContainerId = playerContainer. Proceeding to populate deck")
            for (let [key, value] of Object.entries(playerDeckDict)) {
                const cardId = key
                let cardDiv = document.createElement('img')
                let card = value // /static/assets/deck-cards/v2/
                cardDiv.classList.add('deck-card')
                cardDiv.src = `${card}`
                cardDiv.setAttribute('draggable', true);
                cardDiv.setAttribute('id', `${cardId}`);
                
                // Drag Listeners
                cardDiv.addEventListener('dragstart', handleCardDragStart);
                cardDiv.addEventListener('dragend', handleCardDragEnd);

                // Touch Listeners
                cardDiv.addEventListener('touchstart', handleTouchStart);
                cardDiv.addEventListener('touchend', handleTouchEnd);
                cardDiv.addEventListener('touchmove', handleTouchMove);
                cardDiv.addEventListener('touchend', handleTouchDrop);

                playerDeckContainer.appendChild(cardDiv)
                console.log("[CLEINT] Populating Card", card)
            }
        } else if (topContainerId === `player-${playerId}-container`) {
            console.log("[CLIENT] top Container ID Found: ", topContainerId)
            console.log("[CLIENT] TopContainerID == PlayerContainer. Proceedng to populate with back cards")
            const deckLength = Object.keys(playerDeckDict).length
            const backImgUrl = "/static/assets/deck-cards/v2/BACK.png"
            for (let i = 0; i < deckLength; i++) {
                let cardDiv = document.createElement('img')
                cardDiv.src = `${backImgUrl}`
                cardDiv.classList.add('deck-card')
                playerDeckContainer.appendChild(cardDiv)
            }
        }
    } else {
        console.log("[CLIENT] Error Populating Deck. Could not find ID: ", playerId)
    }
}

// Populate the playing pile or picking pile container
let pickingPile = document.querySelector('.playing-pile');
// function populatePickingPile(gameDeck){
//     let zIndex = 0;
//     let deckSize = gameDeck.length;
//     console.log("Remaining Cards in the deck: " + deckSize);
    
//     for (let [key, value] of Object.entries(gameDeck)) {
//         const cardId = key
//         let card = value
//         // let card = gameDeck.pop();
//         let cardDiv = document.createElement('img');
//         let cardDivUrl = "assets/deck-cards/v2/" + card + '.png';
//         cardDiv.src = `${card}`
//         cardDiv.setAttribute('id', `${cardId}`);
//         const topCard = playingCardsContainer.lastElementChild;    
//         if (topCard) {
//             let topCardStyle = getComputedStyle(topCard);
//             let topCardZIndex = parseInt(topCardStyle.getPropertyValue('z-index'));
//             zIndex = topCardZIndex + 1;
//         }
//         cardDiv.style.zIndex = zIndex;
//         pickingPile.appendChild(cardDiv);
//     }
//     console.log("Playing cards have been populated");
//     console.log("[CLIENT] Game Deck:", gameDeck);
// }

function populatePickingPile() {
    let pickingPile = document.querySelector('.picking-pile')

    const cardImg = document.createElement('img')
    cardImg.classList.add('picking-pile-card')
    cardImg.src = '/static/assets/deck-cards/v2/BACK.png'
    pickingPile.appendChild(cardImg)
}

// This function assigns the top card when the game starts
function assignTopCard(topCardDict) {
    const topCardId = Object.keys(topCardDict)[0];
    const topCard = topCardDict[topCardId]

    let communityCardContainer = document.querySelector('.community-container')
    let topCardDiv = document.createElement('img')
    topCardDiv.src = `${topCard}`

    topCardDiv.classList.add('top-card')
    topCardDiv.classList.add('community-card')
    topCardDiv.setAttribute('id', `${topCardId}`)
    // First I remove the card that was alredy present in the ccontainer
    // This is because I'm using a flex box
    const cardToRemove = communityCardContainer.lastElementChild
    if (cardToRemove) {
        communityCardContainer.removeChild(cardToRemove)
    }
    communityCardContainer.appendChild(topCardDiv)
}


// Populate player's deck with (n) number of cards

let cardCounter = 1;
// Function to populate the playingCards Container with Cards stacked on top of each other
let playingCardsContainer = document.querySelector('.playing-pile');
function populatePlayingCards(){
    let zIndex = 0;
    let deckLength = deck.length;
    console.log("Remaining Cards: " + deckLength);
    while (deckLength != 0) {
        let card = deck.pop();
        let cardImg = document.createElement('div');
        cardImg.style.backgroundImage = `url('{{ url_for('static', filename='assets/deck-cards/v2/') }}${card}.png')`;

        cardImgUrl = "assets/deck-cards/v2/" + card + '.png';
        // cardImg.style.backgroundImage = "url('assets/deck-cards/v2/" + card + ".png')";
        cardImg.classList.add('playing-pile-card');
        cardImg.classList.add('deck-card');
        cardImg.setAttribute('id', 'card-' + cardCounter++);
        const topCard = playingCardsContainer.lastElementChild;    
        if (topCard) {
            let topCardStyle = getComputedStyle(topCard);
            let topCardZIndex = parseInt(topCardStyle.getPropertyValue('z-index'));
            zIndex = topCardZIndex + 1;
        }
        cardImg.style.zIndex = zIndex;
        playingCardsContainer.appendChild(cardImg);
        deckLength--;
    }
    console.log("Playing cards have been populated");

    console.log(deck);
}

const communityContainer = document.querySelector('.community-container');
// Function to handle the dragging of the cards
function handleCardDragStart(event) {
    event.dataTransfer.setData('text/plain', event.target.id);
    event.currentTarget.style.opacity = '0.5';
    console.log("Starting Drag");
}

// Function to handle drag end
function handleCardDragEnd(event) {
    event.currentTarget.style.opacity = '1';
    console.log("End of Drag");
}

// Function to handle pile container drag over
function handlePileDragOver(event) {
    event.preventDefault();
    console.log("Handling pile drag over");
}

let currentDraggedCard = null;
// Function to handle touch start
function handleTouchStart(event) {
    currentDraggedCard = event.currentTarget;
    event.currentTarget.style.opacity = '0.5';
    console.log("Starting Touch");
}

// Function to handle touch end
function handleTouchEnd(event) {
    event.currentTarget.style.opacity = '1';
    console.log("End of Touch");
}

// Function to handle touch move
function handleTouchMove(event) {
    event.preventDefault();

    // Make the card visual when moving
    if (currentDraggedCard) {
        const touch = event.touches[0];
        const offsetX = touch.clientX - touch.target.offsetLeft;
        const offsetY = touch.clientY - touch.target.offsetTop;

        currentDraggedCard.style.left = touch.clientX - offsetX + 'px';
        currentDraggedCard.style.top = touch.clientY - offsetY + 'px';
    }

    console.log("Handling touch move");
}

// Function to handle touch drop to the pile container
function handleTouchDrop(event) {
    event.preventDefault();
    if (currentDraggedCard) {
        
        currentDraggedCard.classList.add('community-card')
        let zIndex = 0;
        let leftOffset = 0;
        const topCard = communityContainer.lastElementChild;

        if (topCard) {
            let topCardStyle = getComputedStyle(topCard);
            let topCardZIndex = parseInt(topCardStyle.getPropertyValue('z-index'));
            // let topCardLeftOffset = parseInt(topCardStyle.getPropertyValue('left'));
            // leftOffset = topCardLeftOffset + 10;
            zIndex = topCardZIndex + 1;
        }
        currentDraggedCard.style.zIndex = zIndex.toString();
        // currentDraggedCard.style.left = leftOffset + 'px';
        currentDraggedCard.removeAttribute('draggable');
        currentDraggedCard.removeEventListener('touchstart', handleTouchStart);
        currentDraggedCard.removeEventListener('touchmove', handleTouchMove);
        currentDraggedCard.removeEventListener('touchend', handleTouchEnd);
        communityContainer.appendChild(currentDraggedCard);
        currentDraggedCard.style.opacity = '1';
        currentDraggedCard = null;
    } else {
        console.log("Card not found for touch drop");
    }
}

// Function to get the current player
async function getCurrentPlayer(gameId) {
    const currentPlayerUrl = `/games/${gameId}/current_player` 

    const response = await fetch (currentPlayerUrl, {
        method: "GET", 
        headers: {
            "Content-Type":"application/json"
        }
    })

    const currentPlayerData = await response.json()
    const currentPlayerId = currentPlayerData.current_player
    return (currentPlayerId);
}

// Function to handle card drop on pile container
async function handleCardDrop(event) {
    event.preventDefault();
    let cardId = event.dataTransfer.getData('text/plain'); 
    let card = document.getElementById(cardId);

    if (card) {
        const currentPlayerId = await getCurrentPlayer(sessionStorage.getItem('gameId'))

        const playCardData = {
            gameId: sessionStorage.getItem('gameId'),
            cardId: cardId,
            playerId: currentPlayerId
        }

        socket.emit('play_card', playCardData)
    }

}

function handleCheckValidity(checkValidityData) {
        console.log('[CLIENT] Check Validity Data Recieved:', checkValidityData)
        const isValidMove = checkValidityData.is_valid_move
        const topCardDict = checkValidityData.top_card_dict

        // If Move is valid, append the card to the community cards
        if (isValidMove) {
            // Remove the card from the player's deck
            const playerId = checkValidityData.player_id
            const playerDeck = document.getElementById(`player-${playerId}-deck`)
            const cardToRemoveId = Object.keys(topCardDict)[0]
            const cardToRemove = playerDeck.querySelector(`[id="${cardToRemoveId}"]`)
            if (cardToRemove) {
            playerDeck.removeChild(cardToRemove)
            }

            // Assign the topCard
            assignTopCard(topCardDict)

            // // const playerContainer = document.getElementById(`player-${playerId}-container`)
            // if (playerContainer) {
            //     if (playerContainer.classList.contains('bottom-container') && (playerContainer.classList.contains('top-container'))) {

            //     }
            // }


        } else {
            console.log("[CLIENT] Move is invalid")
        }
}


socket.on('check_validity',handleCheckValidity)

// Handle the demand
function handleDemand(newInstruction) {
    console.log("[CLIENT] Instruction Received: ", newInstruction)

    const playerId = newInstruction.current_player_id
    const instruction = newInstruction.instruction
    const userId = newInstruction.current_player_user_id
    let doubleDemand = true 

    // Get the player container to 'append' the modal
    const playerMainContainer = document.getElementById(`main-${userId}-container`)
    
    if (instruction === "Double Demand") {
        doubleDemand = false 
    }
    const demandModal = createDemandModal(instruction, doubleDemand)
    // document.body.append(demandModal)
    if (playerMainContainer) {
        console.log('[CLIENT] Player Main Container has been found. Proceeding to append the modal')
        // Before appending, check if modal is already present
        const isModalAlreadyPresent = document.getElementById('demandModal')
        if (isModalAlreadyPresent) {
            console.log("[CLIENT] Modal Already Present")
        } else {
            playerMainContainer.append(demandModal)
            var newDemandModal = new bootstrap.Modal(document.getElementById('demandModal'), focus)
            if (newDemandModal) {
                newDemandModal.show()

            } else {
                console.log("[CLIENT] New Demand Modal was not created")
            }

        }
    
    } else {
        console.log('[CLIENT] Player Container not found')
    }
            
}


// Independet code to send the demand
// const rank = document.getElementById('rankSelector').value
// const suitSelector = document.getElementById('suitSelector')
// let suit = suitSelector.value
// let suitText = suitSelector.options[suitSelector.selectedIndex].text
// console.log(`[CLIENT] Suit: ${suit} || Suit Text: ${suitText}`)

// const demand = {
//     gameId: sessionStorage.getItem('gameId'),
//     rank: rank,
//     suit: suitText
// }

// const sendDemandBtn = document.getElementById('sendDemandBtn')
// sendDemandBtn.addEventListener('click', () => {
//     const newDemandModal = document.getElementById('demandModal')
//     newDemandModal.hide()
//     socket.emit('demand', demand)
// })

socket.on('demand', handleDemand)

function createDemandModal(instruction, doubleDemand) {
  // Create the outermost div element
  var modalDiv = document.createElement("div");
  modalDiv.className = "modal fade";
  modalDiv.id = "demandModal";
  modalDiv.tabIndex = "-1";
  modalDiv.setAttribute('data-bs-backdrop', 'static')
  modalDiv.setAttribute('data-bs-keyboard', 'false')
  modalDiv.setAttribute("aria-labelledby", "demandModal");
  modalDiv.setAttribute("aria-hidden", "true");

  // Create the modal dialog div
  var modalDialogDiv = document.createElement("div");
  modalDialogDiv.className = "modal-dialog";

  // Create the modal content div
  var modalContentDiv = document.createElement("div");
  modalContentDiv.className = "modal-content";

  // Create the modal header div
  var modalHeaderDiv = document.createElement("div");
  modalHeaderDiv.className = "modal-header";

  // Create the modal title h5 element
  var modalTitleH5 = document.createElement("h5");
  modalTitleH5.className = "modal-title";
  modalTitleH5.id = "demandModalTitle";
  modalTitleH5.textContent = `${instruction}`;

  // Create the close button
  var closeButton = document.createElement("button");
  closeButton.type = "button";
  closeButton.className = "btn-close";
  closeButton.setAttribute("data-bs-dismiss", "modal");
  closeButton.setAttribute("aria-label", "Close");

  // Append the modal title and close button to the modal header
  modalHeaderDiv.appendChild(modalTitleH5);
  modalHeaderDiv.appendChild(closeButton);

  // Create the modal body div
  var modalBodyDiv = document.createElement("div");
  modalBodyDiv.className = "modal-body";

  // Create the row div
  var rowDiv = document.createElement("div");
  rowDiv.className = "row justify-content-center align-items-center";

  // Create the first column div
  var col1Div = document.createElement("div");
  col1Div.className = "col-6";

  // Create the input group for rank selector
  var rankInputGroup = document.createElement("div");
  rankInputGroup.className = "input-group mb-3";

  // Create the label for rank selector
  var rankLabel = document.createElement("label");
  rankLabel.className = "input-group-text";
  rankLabel.setAttribute("for", "rankSelector");
  rankLabel.textContent = "Rank";

  // Create the rank selector
  var rankSelector = document.createElement("select");
  rankSelector.className = "form-select";
  rankSelector.id = "rankSelector";
  rankSelector.setAttribute('disabled', doubleDemand)

  // Create the rank options
  var rankOptions = [
    { value: "R", text: "Rank", selected: true },
    { value: "A", text: "A" },
    { value: "2", text: "2" },
    { value: "3", text: "3" },
    { value: "4", text: "4" },
    { value: "5", text: "5" },
    { value: "6", text: "6" },
    { value: "7", text: "7" },
    { value: "8", text: "8" },
    { value: "9", text: "9" },
    { value: "10", text: "10" },
    { value: "J", text: "J" },
    { value: "Q", text: "Q" },
    { value: "K", text: "K" }
  ];

  // Create and append the options to the rank selector
  rankOptions.forEach(function(option) {
    var rankOption = document.createElement("option");
    rankOption.value = option.value;
    rankOption.textContent = option.text;
    if (option.selected) {
      rankOption.selected = true;
    }
    rankSelector.appendChild(rankOption);
  });

  // Append the label and rank selector to the input group
  rankInputGroup.appendChild(rankLabel);
  rankInputGroup.appendChild(rankSelector);

  // Append the input group to the first column
  col1Div.appendChild(rankInputGroup);

  // Create the second column div
  var col2Div = document.createElement("div");
  col2Div.className = "col-6";

  // Create the input group for suit selector
  var suitInputGroup = document.createElement("div");
  suitInputGroup.className = "input-group mb-3";

  // Create the label for suit selector
  var suitLabel = document.createElement("label");
  suitLabel.className = "input-group-text";
  suitLabel.setAttribute("for", "suitSelector");
  suitLabel.textContent = "Suit";

  // Create the suit selector
  var suitSelector = document.createElement("select");
  suitSelector.className = "form-select";
  suitSelector.id = "suitSelector";

  // Create the suit options
  var suitOptions = [
    { value: "Suit", text: "Suit", selected: true },
    { value: "H", text: "H" }, // {value: H, text: H, selected: true}
    { value: "C", text: "C" },
    { value: "D", text: "D" },
    { value: "S", text: "S" }
  ];

  // Create and append the options to the suit selector
  suitOptions.forEach(function(option) {
    var suitOption = document.createElement("option");
    suitOption.value = option.value;
    suitOption.textContent = option.text;
    if (option.selected) {
    //   suitOption.setAttribute('selected', 'selected')
      suitOption.selected = true;
    }
    suitSelector.appendChild(suitOption);
  });

  // Append the label and suit selector to the input group
  suitInputGroup.appendChild(suitLabel);
  suitInputGroup.appendChild(suitSelector);

  // Append the input group to the second column
  col2Div.appendChild(suitInputGroup);

  // Append the columns to the row
  rowDiv.appendChild(col1Div);
  rowDiv.appendChild(col2Div);

  // Append the row to the modal body
  modalBodyDiv.appendChild(rowDiv);

  // Create the modal footer div
  var modalFooterDiv = document.createElement("div");
  modalFooterDiv.className = "modal-footer";

  // Create the demand button
  var demandButton = document.createElement("button");
  demandButton.type = "button";
  demandButton.className = "btn btn-danger";
  demandButton.id = "sendDemandBtn"
  demandButton.setAttribute("data-bs-dismiss", "modal");
  demandButton.textContent = "DEMAND";

  // Append the demand button to the modal footer
  modalFooterDiv.appendChild(demandButton);

  // Append the modal header, modal body, and modal footer to the modal content
  modalContentDiv.appendChild(modalHeaderDiv);
  modalContentDiv.appendChild(modalBodyDiv);
  modalContentDiv.appendChild(modalFooterDiv);

  // Append the modal content to the modal dialog
  modalDialogDiv.appendChild(modalContentDiv);

  // Append the modal dialog to the outermost div
  modalDiv.appendChild(modalDialogDiv);

  // Return the created modal structure
  return modalDiv;
}

function handleHonorADemand(A_instruction) {
    console.log("[CLIENT] A_Instruction Received: ", A_instruction)

    const instruction = A_instruction.A_instruction

    // Enter the demand above the table
    const showDemand = document.getElementById('gameDemand')
    showDemand.classList.add('d-block')
    showDemand.removeAttribute('disabled')
    showDemand.textContent = instruction
}

socket.on('honor_A_demand', handleHonorADemand)

// Check if demand has been satisfied to remove instruction
// NOTE: TODO: Check if Demand is satisfied
async function checkDemandSatisfied(){
    const gameId = sessionStorage.getIem('gameId')

    const checkDemandUrl = `/games/${gameId}/check_demand`
    const response = fetch (checkDemandUrl, {
        method: 'GET',
        headers: {
            "Content-Type":"application/json"
        }
    })

    const isDemandSatisfied = await response.json()
    if (isDemandSatisfied) {
        const showDemand = document.getElementById('gameDemand')
        showDemand.setAttribute('disabled', true)
        showDemand.classList.add('d-none')
        showDemand.textContent = ""
    }
}

// Handle the joker instruction. This function just gives out the hint/instruction
function handleJokerInstruction(jokerInstructions) {
    console.log("[CLIENT] Joker Instructions Received: ", jokerInstructions)

    const jokerInstruction = jokerInstructions.instruction
    const showDemand = document.getElementById('gameDemand')
    showDemand.classList.add('d-block')
    showDemand.removeAttribute('disabled')
    showDemand.textContent = jokerInstruction


}
socket.on('joker', handleJokerInstruction)

// Get the top card from the server
async function getTopCard() {
    const gameId = sessionStorage.getItem('gameId')
    const topCardUrl = `/games/${gameId}/top_card`
    const response = await fetch (topCardUrl, {
        method: 'GET',
        headers: {
            "Content-Type":"application/json"
        }
    })

    const topCardData = await response.json()
    if (topCardData) {
        const topCard = topCardData.top_card
        return (topCard)
    }

}

// Event Listener for the pickBtn
const pickBtn = document.getElementById('pickBtn')
const playerId = pickBtn.getAttribute('data-playerid')
pickBtn.addEventListener('click', async () => {
    const pickData = {
        gameId: sessionStorage.getItem('gameId'),
        playerId: playerId
    }

    const topCard = await getTopCard() // 3-C
    const topCardRank = topCard.rank

    if (topCardRank === "JK" || topCardRank === "3" || topCardRank ==="2"  ) {
        const bombDetails = {
            playerId: playerId,
            gameId: sessionStorage.getItem('gameId')
        }
        socket.emit('bomb', bombDetails)
    } else {
        socket.emit('drawCard', pickData)
    }
})

// Handle the honor bomb demand
function handleBombDemand(honorBombDemandDetails){
    console.log("[CLIENT] Honor Bomb Demand Details Received, ", honorBombDemandDetails)

    const playerId = honorBombDemandDetails.player_id
    const userToPickCardsDict = honorBombDemandDetails.user_to_pick_cards_dict

    populatePlayersDeck(playerId, userToPickCardsDict)
}
socket.on('honor_bomb_demand', handleBombDemand)

// Handle the picked card sent by the server
function handlePickedCard(pickedCardDetails){
    console.log("[CLIENT] Picked Card Details Received: ", pickedCardDetails)

    const playerId = pickedCardDetails.player_id
    const pickedCardDict = pickedCardDetails.picked_card_dict

    populatePlayersDeck(playerId, pickedCardDict)
}
socket.on('picked_card', handlePickedCard)

// Add event listener for each card for dragging
let cards = document.querySelectorAll('.deck-card');
cards.forEach(function (card) {
    card.addEventListener('dragstart', handleCardDragStart);
    card.addEventListener('dragend', handleCardDragEnd);
    card.addEventListener('dragover', handlePileDragOver);
    card.addEventListener('drop', handleCardDrop);

    // Touch Listeners
    card.addEventListener('touchstart', handleTouchStart);
    card.addEventListener('touchend', handleTouchEnd);
    card.addEventListener('touchmove', handleTouchMove);
    card.addEventListener('touchend', handleTouchDrop);
});

// Add Event listeners to the pile container for dropping
communityContainer.addEventListener('dragover', handlePileDragOver);
communityContainer.addEventListener('drop', handleCardDrop);
communityContainer.addEventListener('touchmove', handleTouchMove);
communityContainer.addEventListener('touchdrop', handleTouchDrop);


// Draw Card From Pile
// function drawCardFromPile(deck) {
//     const playingCardsContainer = document.querySelector('.playing-pile');
//     let topCard = playingCardsContainer.lastElementChild;
    
//     if (topCard) {
//         topCard.classList.remove('playing-pile-card');
//         topCard.removeAttribute('z-index');
//         topCard.setAttribute('draggable', true);
//         // Event Listeners
//         topCard.addEventListener('dragstart', handleCardDragStart);
//         topCard.addEventListener('dragend', handleCardDragEnd);

//         // Touch Listeners
//         topCard.addEventListener('touchstart', handleTouchStart);
//         topCard.addEventListener('touchend', handleTouchEnd);
//         topCard.addEventListener('touchmove', handleTouchMove);
//         topCard.addEventListener('touchend', handleTouchDrop);
//         playingCardsContainer.removeChild(topCard);
//         console.log("Appending card");
//         deck.appendChild(topCard);
//     } else {
//         console.log("No card left in the pile")
//     }
// }

// // Event Listener for drawing card from pile
// playingCardsContainer.addEventListener('click', function () {
//     drawCardFromPile(player2deck);
// })


// New Create player container function
function createPlayerContainer(playerId, userId, username) {
    const container = document.createElement('div');
    container.classList.add('container-fluid', 'player-container');
    container.setAttribute('data-userid', userId);
    container.setAttribute('id', `player-${playerId}-container`);

    const playerRow = document.createElement('div');
    playerRow.classList.add('row', 'justify-content-center', 'align-items-center');

    const playerCol = document.createElement('div');
    playerCol.classList.add('col-6', 'col-lg-8', 'col-md-8', 'col-sm-8');
    playerCol.setAttribute('id', `player-${playerId}-card`);

    const playerCard = document.createElement('div');
    playerCard.classList.add('card');

    const cardHeader = document.createElement('div');
    cardHeader.classList.add('card-header', 'p-2');

    const cardRow = document.createElement('div');
    cardRow.classList.add('row', 'justify-content-center');

    const nameCol = document.createElement('div');
    nameCol.classList.add('col-lg-4', 'col-md-4', 'col-sm-2', 'text-center');

    const playerName = document.createElement('p');
    playerName.classList.add(`dev_card-player-${playerId}-name`);
    playerName.setAttribute('id', `dev_card-player-${playerId}-name`);
    playerName.textContent = username;

    nameCol.appendChild(playerName);
    cardRow.appendChild(nameCol);

    const buttonCol1 = document.createElement('div');
    buttonCol1.classList.add('col-lg-5', 'col-md-5', 'col-sm-6');

    const buttonGroup1 = document.createElement('div');
    buttonGroup1.classList.add('btn-group');
    buttonGroup1.setAttribute('role', 'group');

    const nextButton = document.createElement('buttion')
    nextButton.classList.add('button', 'btn', 'btn-outline-secondary', 'nextBtn')
    nextButton.setAttribute('id', `player-${playerId}-nextBtn`)
    nextButton.setAttribute('data-playerid', `${playerId}`)
    nextButton.textContent = "NEXT"

    const timerButton = document.createElement('button');
    timerButton.classList.add('button', 'btn', 'btn-outline-secondary', 'timerValue');
    timerButton.setAttribute('id', `player-${playerId}-timerButton`);

    const timerValue = document.createElement('span');
    timerValue.setAttribute('id', `player-${playerId}-timerValue`);
    timerValue.textContent = '00:00';

    timerButton.appendChild(timerValue);

    const kadiButton = document.createElement('button');
    kadiButton.classList.add('btn', 'btn-outline-secondary', 'kadi-btn');
    kadiButton.textContent = 'KADI';

    buttonGroup1.appendChild(nextButton)
    buttonGroup1.appendChild(timerButton);
    buttonGroup1.appendChild(kadiButton);
    buttonCol1.appendChild(buttonGroup1);
    cardRow.appendChild(buttonCol1);

    const buttonCol2 = document.createElement('div');
    buttonCol2.classList.add('col-lg-3', 'col-md-3', 'col-sm-4');

    const buttonGroup2 = document.createElement('div');
    buttonGroup2.classList.add('btn-group');
    buttonGroup2.setAttribute('role', 'group');

    const micButton = document.createElement('button');
    micButton.classList.add('btn', 'btn-outline-secondary');

    const micIcon = document.createElement('i');
    micIcon.classList.add('bi', 'bi-mic-fill');

    micButton.appendChild(micIcon);

    const dotsButton = document.createElement('button');
    dotsButton.classList.add('btn', 'btn-outline-secondary');

    const dotsIcon = document.createElement('i');
    dotsIcon.classList.add('bi', 'bi-three-dots');

    dotsButton.appendChild(dotsIcon);

    buttonGroup2.appendChild(micButton);
    buttonGroup2.appendChild(dotsButton);
    buttonCol2.appendChild(buttonGroup2);
    cardRow.appendChild(buttonCol2);

    cardHeader.appendChild(cardRow);
    playerCard.appendChild(cardHeader);
    playerCol.appendChild(playerCard);
    playerRow.appendChild(playerCol);
    container.appendChild(playerRow);
    const deckRow = document.createElement('div');
    deckRow.classList.add('row', 'justify-content-center');

    const deckCol = document.createElement('div');
    deckCol.classList.add('deck', 'col-6', 'mt-1');
    deckCol.setAttribute('id', `player-${playerId}-deck`);

    deckRow.appendChild(deckCol);
    container.appendChild(deckRow);



    return container;
}

// Function to get other players in the game for the startGameBtn
async function getPlayers(gameId) {
    const fetchPlayersUrl = `/game/${gameId}/players`
    const response = await fetch (fetchPlayersUrl, {
        method: 'GET',
        headers: {
            "Content-Type":"application/json"
        }
    })

    const playerDetails = await response.json()
    if (playerDetails) {
        return playerDetails;
    }
}

// Add Event Listener to the next button
async function addEventListenerToNext(){
    const gameId = sessionStorage.getItem('gameId')
    const playerDetails = await getPlayers(gameId)
    console.log("[CLIENT] Player Details: ", playerDetails)
    const playersInfo = playerDetails.players_info
    console.log("[CLIENT] Players Info: ", playersInfo)

    // Loop through the players and populate their deck with cards
    for (let [key, value] of Object.entries(playersInfo)) {
        const userId = key
        const playerInfo = value
        const playerId = playerInfo.player_id
        
        const nextBtn = document.getElementById(`player-${playerId}-nextBtn`)
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                const check_special_card_details = {
                    gameId: gameId,
                    playerId: playerId
                }
                socket.emit('check_special_card', check_special_card_details)
            })
        }
    }
}

addEventListenerToNext()

// Always check who the current player is and add a green border
// setInterval(() => {
//     socket.emit('whoIsCurrentPlayer', {"gameId":sessionStorage.getItem('gameId')})
// }, 1000)

function handleCurrentPlayer(thisCurrentPlayerDetails) {
    const playerId = thisCurrentPlayerDetails.current_player_id

    // Who is the player with the border
    const playerWithBorder = document.querySelector('.player-active')
    const playerWithBorderId = playerWithBorder.getAttribute('id')

    if (playerWithBorderId != `player-${playerId}-container`) {
        playerWithBorder.classList.remove('player-active')
    } else {
        // Does player already have the player active class
        const isPlayerActive = document.querySector('.player-active')
        if (!isPlayerActive) {
            const playerShouldGetBorder = document.getElementById(`player-${playerId}-container`)
            playerShouldGetBorder.classList.add('player-active')
        } 
        // else {
        //     console.log("[CLIENT] Already has border")
        // }
    }

}

socket.on('thisCurrentPlayer', handleCurrentPlayer)



// Start Game
const startGameBtn = document.getElementById('startGame')
if (startGameBtn) {
    startGameBtn.addEventListener('click', function () {
        // Get the gameId
        const gameId = sessionStorage.getItem('gameId')
        socket.emit('start', gameId)
    })
} else {
    console.log("[CLIENT] No Start Button")
}

async function handleStart(startGameData) {
        // Disable the start Button
        startGameBtn.setAttribute('disabled','true')
        startGameBtn.textContent = "Quit"
        console.log("[CLIENT] (emitStart): Start Game Data Received: ", startGameData)
        // Get the player Details
        const gameId = sessionStorage.getItem('gameId')
        const playerDetails = await getPlayers(gameId)
        console.log("[CLIENT] Player Details: ", playerDetails)
        const playersInfo = playerDetails.players_info
        console.log("[CLIENT] Players Info: ", playersInfo)

        // Loop through the players and populate their deck with cards
        for (let [key, value] of Object.entries(playersInfo)) {
            const userId = key
            const playerInfo = value
            const playerId = playerInfo.player_id
            const playerName = playerInfo.player_name
            const playerDeckDict = playerInfo.player_deck
            const noOfPlayers = playerInfo.no_of_players

            if (noOfPlayers <= 1) {
                console.log("[CLIENT] Cannot Start with only one player")
            } else {
                // Get the player Container's
                // const playerContainer = document.getElementById(`player-${playerId}-container`)
                // const playerDeckContainer = playerContainer.querySelector(`#player-${playerId}-deck`)

                // Populate the deck using the populate function
                populatePlayersDeck(playerId, playerDeckDict)
            }
        }


    // Populate Picking Pile, top card
    const startGameDeck = startGameData.deck
    const topCardDict = startGameData.top_card
    console.log("[CLIENT] Deck", startGameData.deck)
    console.log("[CLIENT] Top Card: ", startGameData.top_card)
    console.log("[CLIENT] First Player: ", startGameData.first_player)

    const firstPlayerCard = document.getElementById(`player-${startGameData.first_player_id}-card`)
    firstPlayerCard.classList.add('player-active')

    populatePickingPile()
    assignTopCard(topCardDict)

}

socket.on('start', handleStart)


// Initialize the kadi button
const nikoKadiBtn = document.getElementById('kadi-btn')
if (nikoKadiBtn) {
    nikoKadiBtn.addEventListener('click', () => {
        const kadiDetails = {
            gameId: sessionStorage.getItem('gameId'),
            playerId: nikoKadiBtn.getAttribute('data-playerid')
        }
        socket.emit('kadi', kadiDetails)
    })
}

// Handle kadi details from the server
function handleKadi(kadiDetails) {
    console.log("[CLIENT] Kadi Details received from server: ", kadiDetails)
    const playerId = kadiDetails.player_id
    const playerName = kadiDetails.player_name

    console.log(`${playerName} is KADI`)
}
socket.on('kadi', handleKadi)
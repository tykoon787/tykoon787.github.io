// Message Feature
const sendButton = document.getElementById('sendButton')
const messageBubbleContainer = document.getElementById('messageBubbleContainer')
const newMessageBtn = document.getElementById('newMessageBtn')
const newMessageModal = document.getElementById('newMessageModal') 
const usernameInput = document.getElementById('usernameInput')

// New Message Modal send button
const newMessageSend = document.getElementById('newMessageSend')

// Autofocus for Modal 
var myModal = document.getElementById('joker-modal')
var myInput = document.getElementById('joker-modal')

// Initiate a connection
const socket = io();

myModal.addEventListener('shown.bs.modal', function () {
  console.log("Error will occure here, fix");
  // myInput.focus()
})


// Get the image and overlay elements
const image = document.querySelector('.dev_modal-card img');
const overlay = document.querySelectorAll('.dev_modal-card .overlay');

// Get the header and buttom elements
const header = document.querySelector('.dev_modal-header');
const button = document.querySelector('.dev_modal-button');

// Add a click event listener to the header and button to remove overlay
header.addEventListener('click', () => {
    image.classList.remove('dev_modal-card');
    overlay.forEach(o => o.classList.remove('d-flex'));
})

button.addEventListener('click', () => {
  image.classList.remove('dev_modal-card');
  overlay.forEach(o => o.classList.remove('d-flex'));
});

// const inboxMessage = document.querySelector('.inboxMessage')
// const inboxMessage = document.getElementById('inboxMessage')

// Opening a single inbox message

// NOTE: The function below is unecessary becasue I add an event listener to the cards when they are created
// const multipleInboxMessages = document.querySelectorAll('.inboxMessage')
// console.log("[CLIENT] Mulitple Inbox Messages: ", multipleInboxMessages)

// multipleInboxMessages.forEach((inboxMessage) => {
//   if (inboxMessage) {
//     inboxMessage.addEventListener('click', function(event){
//     openChatSection(event);
//   });
//   } else {
//     console.log("[CLIENT] Inbox Message not found")
//   }
// })

// This will open the chat section offcanvas
function openChatSection(event) {
  const chatSection = document.getElementById('chatOffcanvas')
  const offCanvas = new bootstrap.Offcanvas(chatSection)

  // Recipients Name
  const recipientName = event.currentTarget.getAttribute('data-recipientname')
  console.log("[CLEINT] Found Recipient's Name: ", recipientName)
  const chatSectionName = document.getElementById('chatSectionName')

  chatSectionName.textContent = recipientName
  offCanvas.show();
}



function createBubble(message, sender) {
  const bubble = document.createElement('div');
  bubble.classList.add('chat-bubble')
  bubble.classList.add(sender === 'sent' ? 'sent' : 'received')
  bubble.textContent = message;
  messageBubbleContainer.appendChild(bubble);
}

// New Message
newMessageBtn.addEventListener('click', function() {
  // var username = usernameInput.value
  // if (username.length > 0) {
  //   console.log("Sendng message to: ", username)
  // }

  // var newMessageModal = new bootstrap.Modal(document.getElementById('newMessageModal'))
  // newMessageModal.hide()
})

// Establish a connection everytime the window is loaded
// document.addEventListener('DOMContentLoaded', function() {

//   // Handle the Send event
//   sendButton.addEventListener('click', function() {
//     const message = document.getElementById('messageInput').value
//     if (message.length > 0) {
//       createBubble(message, 'sent')
//       socket.emit('message', message)
//       document.getElementById('messageInput').value = ''
//     }
    
//   })

// })

newMessageSend.addEventListener('click', function () {
  const recipient = document.getElementById('recipientUsername').value
  const newMessageText = document.getElementById('newMessageText').value

  message = {
    message : newMessageText,
    recipient: recipient
  }
  socket.emit('message', message)


  // Create a message card after a message has been sent
  const messageCard = createMessageCard(recipient, newMessageText)
  const inboxMessagesContainer = document.getElementById('inboxMessages')

  // Add an Event listener to the cards
  messageCard.addEventListener('click', function (event) {
    openChatSection(event)
  })
  inboxMessagesContainer.appendChild(messageCard)

})

socket.on('message', function(message) {
    console.log("[CLIENT] Got Message: ", message)
    // Get the user id
    messageText = message.messageText
    recipient_id = message.recipient_id
    sender = message.sender
    console.log("[CLIENT] Recipient's ID: ", recipient_id)
    
    // Create a card for the recipeint
    const recipientsInbox = document.querySelector(`[data-usersInbox="${recipient_id}"]`)

    if (!recipientsInbox) {
      console.log("[CLIENT] Recipient's Inbox not found")
      return;
    } else {
      // Look for the card that has the name
      const cardPresent = document.querySelector(`[data-recipientname="${sender}"]`)
      if (!cardPresent) {
        console.log("[CLIENT] Card with name not found, proceeding to create one")
        // Create a card for the recipient
        const messageCard = createMessageCard(sender, messageText)
        messageCard.addEventListener('click', function (event) {
          openChatSection(event);
        })
        // Add the card to the user's inbox
        recipientsInbox.appendChild(messageCard)
        
        // Select the recipient's Bubble
        const recipientsBubble = document.querySelector(`[data-userid="${recipient_id}"]`);
        
        // Add the bubble in the card
        if (!recipientsBubble) {
          console.log("[CLIENT] Recipient Not Found")
          return
        } else {
          const bubble = document.createElement('div')
          bubble.classList.add('chat-bubble')
          bubble.classList.add('received')
          bubble.textContent = messageText;
          recipientsBubble.appendChild(bubble);
      }
      }
      else {
        console.log("[CLIENT] Found a card with that name, just adding the bubble")
        // Select the recipient's Bubble
        const recipientsBubble = document.querySelector(`[data-userid="${recipient_id}"]`);

        // Add the bubble in the card
        if (!recipientsBubble) {
          console.log("[CLIENT] Recipient Not Found")
          return
        } else {
          const bubble = document.createElement('div')
          bubble.classList.add('chat-bubble')
          bubble.classList.add('received')
          bubble.textContent = messageText;
          recipientsBubble.appendChild(bubble);

        }
  
        }

    }

})

// Send Button
// Because I have the username, I can send the message to a specific ID
sendButton.addEventListener('click', function () {
  const recipient = document.getElementById('chatSectionName').textContent
  const messageText = document.getElementById('messageInput').value
  console.log("[CLIENT] Sending to recipient:", recipient)

  if (messageText.length > 0) {
    message = {
      message: messageText,
      recipient: recipient
  };
  socket.emit('message', message)
  createBubble(messageText, 'sent')
  document.getElementById('messageInput').value = ''
  }
})

function createMessageCard(recipientName, message) {
  // Main card element
  const card = document.createElement('div')
  card.classList.add('card')
  card.classList.add('mb-3')
  card.setAttribute('data-recipientname', recipientName)
  card.classList.add('inboxMessage')

  // Create the card body
  const cardBody = document.createElement('div')
  cardBody.classList.add('card-body')
  cardBody.classList.add('p-2')

  // Row
  const row = document.createElement('div')
  row.classList.add('row')

  // Create the column for the profile
  const profilePicCol = document.createElement('div')
  profilePicCol.classList.add('col-2')
  profilePicCol.classList.add('jusify-content-center')
  profilePicCol.classList.add('align-items-center')
  profilePicCol.classList.add('pr-1')

  // Profile Picture Element
  const profilePic = document.createElement('img')
  profilePic.src = "static/assets/inbox_avatar.png";
  profilePic.alt = "profilePic"
  profilePic.classList.add('profilePic')

  profilePicCol.appendChild(profilePic)

    // Create the column for the sender's name
  const senderNameCol = document.createElement('div');
  senderNameCol.classList.add('col-10');

  // Create the row for the sender's name and online dot
  const senderNameRow = document.createElement('div');
  senderNameRow.classList.add('row');

  // Create the column for the sender's name
  const senderNameColInner = document.createElement('div');
  senderNameColInner.classList.add('col-11');
  senderNameColInner.id = "sendersName";

  // Create the sender's name heading element
  const senderNameHeading = document.createElement('h6');
  senderNameHeading.classList.add('m-0');
  senderNameHeading.textContent = recipientName;

  // Append the sender's name heading to the column
  senderNameColInner.appendChild(senderNameHeading);

  // Create the column for the online dot
  const onlineDotCol = document.createElement('div');
  onlineDotCol.classList.add('col-1');
  onlineDotCol.classList.add('align-items-center');
  onlineDotCol.classList.add('p-0');

  // Create the online dot image element
  const onlineDotImg = document.createElement('img');
  onlineDotImg.src = "static/assets/onlineDot.png";
  onlineDotImg.width = "10";
  onlineDotImg.alt = "online";

  // Append the online dot image to the column
  onlineDotCol.appendChild(onlineDotImg);

  // Append the sender's name column and online dot column to the row
  senderNameRow.appendChild(senderNameColInner);
  senderNameRow.appendChild(onlineDotCol);

  // Create the horizontal line
  const hr = document.createElement('hr');
  hr.classList.add('mt-1');
  hr.classList.add('mb-2');

  // Create the sender's message paragraph
  const senderMsg = document.createElement('div');
  senderMsg.id = "senderMsg";

  const messageParagraph = document.createElement('p');
  messageParagraph.classList.add('mb-1');
  messageParagraph.textContent = message;

  // Append the message paragraph to the sender's message div
  senderMsg.appendChild(messageParagraph);

  // Append all the elements to their respective parents
  senderNameCol.appendChild(senderNameRow);
  senderNameCol.appendChild(hr);
  senderNameCol.appendChild(senderMsg);

  row.appendChild(profilePicCol);
  row.appendChild(senderNameCol);

  cardBody.appendChild(row);
  card.appendChild(cardBody);

  return card;
}

// Features for the caraousel
const listItem = [
    {
        title: "Ace of Spades",
        describe:
            "When unleashed, it grants the player the right to demand for a Specific Card Rank and Suit. E.g., 4-Hearts (4H)",
        image: "static/assets/carousel/A-Spades.png",
        bgColor: "#000000",
        points: "1000",
        advantage: "10",
        bomb: "No"
    },
    {
        title: "Red Joker",
        describe:
            "The Red Joker is a devil. Unleash this card to make the next player pick 5 cards",
        image: "static/assets/carousel/R-Joker.png",
        bgColor: "#A00d0b",
        points: "500",
        advantage: "9",
        bomb: "Yes"
    },
    {
        title: "Black Joker",
        describe:
            "The Black Joker is a beast. Unleash this card to make the next player pick 5 cards",
        image: "static/assets/carousel/B-Joker4.png",
        bgColor: "#000000",
        points: "500",
        advantage: "9",
        bomb: "Yes"
    },
    {
        title: "A",
        describe:
            "What's a game of cards without Love? Unleash this card and demand a suit",
        image: "static/assets/carousel/A-Hearts.png",
        bgColor: "#A00d0b",
        points: "300",
        advantage: "8",
        bomb: "No"
    },
    {
        title: "Q (Question)",
        describe:
            "The Q Rank is a special Card that represents a Question. When played, the player must follow with an answer or pick",
        image: "static/assets/carousel/Q-Hearts.png",
        bgColor: "#A00d0b",
        points: "30",
        advantage: "4",
        bomb: "No"
    },
    {
        title: "J (Jump)",
        describe:
            "The J Rank is a special card that represents a Jump. When played the palyer can skip the next player",
        image: "static/assets/carousel/J-Clubs.png",
        bgColor: "#A00d0b",
        points: "30",
        advantage: "5",
        bomb: "No"
    },
    {
        title: "K (Kickback)",
        describe:
            "The K Rank is a special card that represents a Kickback. When played the game's direction is reversed and the turn reverts to the previous player",
        image: "static/assets/carousel/K-Hearts.png",
        bgColor: "#A00d0b",
        points: "30",
        advantage: "5",
        bomb: "No"
    },
    {
        title: "3 (Bomb)",
        describe:
            "The 3 Rank when played makes the next player pick 3 cards",
        image: "static/assets/carousel/3-Spades.png",
        bgColor: "#A00d0b",
        points: "75",
        advantage: "8",
        bomb: "Yes"
    },
    {
        title: "2 (Bomb)",
        describe:
            "The 2 Rank when played makes the next player pick 2 cards",
        image: "static/assets/carousel/2-Diamonds.png",
        bgColor: "#A00d0b",
        points: "75",
        advantage: "8",
        bomb: "Yes"
    },
];

const backgroundWrapper = document.querySelector(".carousel-bg-wrapper");
for (let i = 0; i < listItem.length; i++) {
    backgroundWrapper.innerHTML += `
        <img src="${listItem[i].image}" alt="" class="carousel-bg" />
    `;
}

const contentWrapper = document.querySelector(".content-wrapper");
for (let i = 0; i < listItem.length; i++) {
    contentWrapper.innerHTML += `
    <div class="content">
    <h3 class="name" style="--i: 0">${listItem[i].title}</h3>
    <div class="describe" style="--i: 1">
        <p>
            ${listItem[i].describe}
        </p>
    </div>
        <ul class="properties" style="--i: 2">
            <li class="mb-3">
                <span class="icon">
                    <img src="static/assets/carousel/icon/points.png" alt="" />
                </span>
                <span>Points</span>
                <span>${listItem[i].points}</span>
            </li>
            <li class="mb-3">
                <span class="icon">
                    <img src="static/assets/carousel/icon/advantage.png" alt="" />
                </span>
                <span>Advantage</span>
                <span>${listItem[i].advantage}</span>
            </li>
            <li class="mb-3">
                <span class="icon">
                    <img src="static/assets/carousel/icon/explosion.png" alt="" />
                </span>
                <span>Bomb</span>
                <span>${listItem[i].bomb}</span>
            </li>
        </ul>
        <button class="btn btn-primary"style="--i: 3" href="#game-section">Cheza</button>
    </div>
    `;
}

const slide = document.querySelector(".slide-wrapper .slide");
for (let i = 0; i < listItem.length; i++) {
    slide.innerHTML += `
        <div class="item-wrapper">
        <div class="item" style="--bg: ${listItem[i].bgColor}">
            <img src="${listItem[i].image}" alt="" />
        </div>
        </div>
    `;
}

const indicatorNumbers = document.querySelectorAll(
    ".dev_carousel-indicators .number"
);
const contents = document.querySelectorAll(".content");
const items = document.querySelectorAll(".slide .item-wrapper");
const backgrounds = document.querySelectorAll(".carousel-bg");
const prev = document.querySelector(".carousel-control .prev");
const next = document.querySelector(".carousel-control .next");

let currentIndex = 0;
const setActive = (index) => {
    currentIndex = index;
    if (currentIndex == 0) {
        prev.disabled = true;
    } else prev.disabled = false;

    if (currentIndex == items.length - 1) {
        next.disabled = true;
    } else next.disabled = false;

    indicatorNumbers.forEach((number) => {
        number.classList.remove("active");
    });
    indicatorNumbers[currentIndex].classList.add("active");

    contents.forEach((content) => {
        content.classList.remove("active");
    });
    contents[currentIndex].classList.add("active");

    items.forEach((item) => {
        item.classList.remove("active");
    });
    items[currentIndex].classList.add("active");

    backgrounds.forEach((background) => {
        background.classList.remove("active");
    });
    backgrounds[currentIndex].classList.add("active");
};

setActive(currentIndex);

prev.addEventListener("click", () => {
    currentIndex--;
    slide.style = `--i: ${currentIndex}`;
    setActive(currentIndex);
});

next.addEventListener("click", () => {
    currentIndex++;
    slide.style = `--i: ${currentIndex}`;
    setActive(currentIndex);
});

/* Make the carousel move */
setInterval(() => {
    console.log(`Index: ${currentIndex}`)
    if (currentIndex >=0 && currentIndex < 8 ) {
        next.click();
    } else if (currentIndex > 7) {
        while (currentIndex != 0) {
            prev.click();
            currentIndex--;
        }
    }
}, 5000)

/* About Section for meet the team */

/* Loader */
window.onload = () => {
    const loader = document.getElementById('loader')
    loader.classList.remove('loader')
}



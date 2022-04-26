const $createPartyBtn = document.querySelector("#create-party-btn");
const $joinPartyBtn = document.querySelector("#join-party-btn");
const $joinPartyInp = document.querySelector("#join-party");
const $usernameInp = document.querySelector("#username");

// Create request to TCP connection
let socket = new WebSocket("ws://localhost:9090");

let clientID = null,
  partyID = null,
  username = null;

const changeDOM = (partyId, typeNoti, messageNoti, typeChange, aditional) => {
  if (typeof aditional === undefined) {
    aditional = null;
  }
  const event = new CustomEvent("changeDOM", {
    detail: {
      partyId,
      typeNoti,
      messageNoti,
      typeChange,
      aditional,
    },
  });

  document.dispatchEvent(event);
};

// Response from server
socket.onmessage = (message) => {
  const response = JSON.parse(message.data);

  if (response.method === "connect") {
    clientID = response.clientId;
  }
  if (response.method === "create") {
    partyID = response.partyID;
    changeDOM(
      partyID,
      response.message,
      "New party created succesfully",
      response.method
    );
  }
  if (response.method === "join") {
    if (response.message === "no_existing_party") {
      let mesNoti = "The party doesn't exists, try again";
      changeDOM(partyID, "ERROR", mesNoti, response.method);
      return;
    }
    if (response.message === "full_party") {
      let mesNoti = "Full party, try again";
      changeDOM(partyID, "ERROR", mesNoti, response.method);
      return;
    }
    if (response.message === "player_joined") {
      let mesNoti = "A player has joined";
      changeDOM(partyID, "START", mesNoti, response.method);
      return;
    }
    let mesNoti = "Joined succesfully";
    changeDOM(partyID, "OK", mesNoti, response.method);
  }
  if (response.method === "start") {
    partyID = response.partyID;
    let color = response.color;
    let turn = response.turn;
    changeDOM(partyID, "START", "Game started", response.method, {
      color,
      turn,
      username: username,
    });
  }
};

document.addEventListener("DOMContentLoaded", () => {
  document.addEventListener("lose", () => {
    const payload = {
      method: "lose",
      partyId: partyID,
    };
    socket.send(JSON.stringify(payload));
  });
});

// Create party
$createPartyBtn.addEventListener("click", () => {
  const payload = {
    method: "create",
    clientId: clientID,
  };

  socket.send(JSON.stringify(payload));
});

// Join party
$joinPartyBtn.addEventListener("click", () => {
  username = $usernameInp.value;
  if ($joinPartyInp.value === "" || username === "") return;

  partyID = $joinPartyInp.value;
  const payload = {
    method: "join",
    clientId: clientID,
    partyId: partyID,
  };
  socket.send(JSON.stringify(payload));
});

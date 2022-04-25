const $createPartyBtn = document.querySelector("#create-party-btn");
const $joinPartyBtn = document.querySelector("#join-party-btn");
const $joinPartyInp = document.querySelector("#join-party");
const $usernameInp = document.querySelector("#username");

// Create request to TCP connection
let socket = new WebSocket("ws://localhost:9090");

export let clientID = null,
  partyID = null,
  username = null,
  color = null;

const changeDOM = (partyId, typeNoti, messageNoti, typeChange) => {
  const event = new CustomEvent("changeDOM", {
    detail: {
      partyId,
      typeNoti,
      messageNoti,
      typeChange,
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
    color = response.color;
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
    changeDOM(partyID, "START", "Game started", response.method);
  }
};

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
  if ($joinPartyInp.value === "" || $usernameInp.value === "") return;

  partyID = $joinPartyInp.value;
  const payload = {
    method: "join",
    clientId: clientID,
    partyId: partyID,
  };
  socket.send(JSON.stringify(payload));
});

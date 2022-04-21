const $createPartyBtn = document.querySelector("#create-party-btn");
const $joinPartyBtn = document.querySelector("#join-party-btn");
const $joinPartyInp = document.querySelector("#join-party");
const $usernameInp = document.querySelector("#username");

// Create request to TCP connection
export const socket = new WebSocket("ws://localhost:9090");

export let clientID, partyID, username, color;

// Response from server
socket.onmessage = (message) => {
  let response = JSON.parse(message.data);

  // TODO:
  // Manage client errors from server, (show notifications)

  if (response.method === "connect") {
    clientID = response.clientId;
  }
  if (response.method === "create") {
    partyID = response.partyID;
  }
  if (response.method === "join") {
    color = response.color;
  }
  console.log(response);
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
  username = $usernameInp.value;
  partyID = $joinPartyInp.value;

  // TODO:
  // - Require client to enter an username and partyID
  // - Handle error: Create party and click enterPartyBtn to enter party

  // if (username === "" && partyID === "") return;

  const payload = {
    method: "join",
    clientId: clientID,
    partyId: partyID,
  };
  socket.send(JSON.stringify(payload));
});

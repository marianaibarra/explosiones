import {
  username,
  clientID,
  color,
  partyID,
  socket,
} from "../controllers/client.js";

const $partyId = document.querySelector("#party-id");
const $joinPartyBtn = document.querySelector("#join-party-btn");

socket.onmessage = (message) => {
  let response = JSON.parse(message.data);

  // TODO:
  // Manage client errors from server, (show notifications)

  // if (response.method === "connect") {

  // }
  if (response.method === "create") {
    $partyId.innerHTML = partyID;
    $joinPartyBtn.style.display = "flex";
  }
  if (response.method === "join") {
  }
  console.log(response);
};

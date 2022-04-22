import { player } from "./index.js";

const $partyId = document.querySelector("#party-id");
const $joinPartyBtn = document.querySelector("#join-party-btn");
const $notification = document.querySelector("#notification");
const $typeNotification = document.querySelector("#type-of-notication");
const $mesNotification = document.querySelector("#message-notification");
const $enterPartyBtn = document.querySelector("#enter-party-btn");

document.addEventListener("DOMContentLoaded", () => {
  document.addEventListener("changeDOM", (event) => {
    if (event.detail.typeChange === "create") {
      $partyId.innerHTML = event.detail.partyId;
      $enterPartyBtn.style.display = "block";
      showNoti(event.detail);
    }
    if (event.detail.typeChange === "join") {
      showNoti(event.detail);
    }
  });
});

const showNoti = (values) => {
  $notification.style.display = "block";
  $typeNotification.innerHTML = values.typeNoti;
  $mesNotification.innerHTML = values.messageNoti;
  setTimeout(() => {
    $notification.style.display = "none";
  }, 5000);
};

// TODO:
// - Manage client errors from server, (show notifications)
// - Handle error: Create party and click enterPartyBtn to enter party

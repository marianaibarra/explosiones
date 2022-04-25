import { player } from "./index.js";

const $partyId = document.querySelector("#party-id");
// const $joinPartyBtn = document.querySelector("#join-party-btn");
const $notification = document.querySelector("#notification");
const $typeNotification = document.querySelector("#type-of-notication");
const $mesNotification = document.querySelector("#message-notification");
const $joinPartyInp = document.querySelector("#join-party");
const $ui = document.querySelector("#ui");
const $waitPlayers = document.querySelector("#wait-players");

const normalInfo = 5000,
  waitInfo = 300000;
let waitTimeOut = null;

document.addEventListener("DOMContentLoaded", () => {
  document.addEventListener("changeDOM", (event) => {
    if (event.detail.typeChange === "create") {
      $partyId.innerHTML = event.detail.partyId;
      $joinPartyInp.value = event.detail.partyId;

      showNoti(event.detail, normalInfo);
    }
    if (event.detail.typeChange === "join") {
      if (event.detail.typeNoti === "OK") {
        $ui.style.display = "none";
        $waitPlayers.style.display = "flex";
        waitTimeOut = setTimeout(waitUI, waitInfo);
      }

      showNoti(event.detail, normalInfo);
    }
    if (event.detail.typeChange === "start") {
      startGame();
    }
  });
});

const startGame = () => {
  clearTimeout(waitTimeOut);
  let downto = 6;
  let counter = setInterval(() => {
    $waitPlayers.innerHTML = --downto;
    if (downto === 0) {
      clearInterval(counter);
    }
  }, 1000);
};

const waitUI = () => {
  $ui.style.display = "flex";
  $waitPlayers.style.display = "none";
  let values = {
    typeNoti: "INFO",
    messageNoti: "Empty party, try again",
  };
  showNoti(values, normalInfo);
};

const showNoti = (values, timeOut) => {
  $notification.style.display = "block";
  $typeNotification.innerHTML = values.typeNoti;
  $mesNotification.innerHTML = values.messageNoti;
  setTimeout(() => {
    $notification.style.display = "none";
  }, timeOut);
};

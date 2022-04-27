const $partyId = document.querySelector("#party-id");
const $notification = document.querySelector("#notification");
const $typeNotification = document.querySelector("#type-of-notication");
const $mesNotification = document.querySelector("#message-notification");
const $joinPartyInp = document.querySelector("#join-party");
const $ui = document.querySelector("#ui");
const $waitPlayers = document.querySelector("#wait-players");

const normalInfo = 5000,
  waitInfo = 300000;

let waitTimeOut = null,
  currentPlayer = 0,
  maxPlayers = 1,
  partyId,
  username,
  color,
  turn;

const startCanvas = (username, color, turn, partyId) => {
  const event = new CustomEvent("start", {
    detail: {
      username,
      color,
      partyId,
      turn,
    },
  });

  document.dispatchEvent(event);
};

document.addEventListener("DOMContentLoaded", () => {
  document.addEventListener("changeDOM", (event) => {
    if (event.detail.typeChange === "create") {
      partyId = event.detail.aditional.partyId;

      $partyId.innerHTML = partyId;
      $joinPartyInp.value = partyId;

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
      username = event.detail.aditional.username;
      color = event.detail.aditional.color;
      (turn = event.detail.aditional.turn),
        startGame(true, username, color, turn, event.detail.aditional.partyId);
    }
    if (event.detail.typeChange === "lose") {
      console.log("switch turns");
      console.log(username, color, turn, event.detail.partyId);
      console.log("current turn ", currentPlayer);
      currentPlayer = event.detail.aditional.turn;
      console.log(currentPlayer);
      startGame(false, username, color, turn, event.detail.partyId);
    }
  });
});

const startGame = (isWait, username, color, turn, aditional) => {
  if (typeof aditional === undefined) {
    aditional = null;
  }
  if (isWait) {
    clearTimeout(waitTimeOut);
  }
  let downto = 6;
  let counter = setInterval(() => {
    $waitPlayers.innerHTML = --downto;
    if (downto === 0) {
      clearInterval(counter);

      if (turn === currentPlayer) {
        startCanvas(username, color, turn, aditional);
        $waitPlayers.style.display = "none";
      } else {
        $waitPlayers.innerHTML = "Please wait for your turn";
      }
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

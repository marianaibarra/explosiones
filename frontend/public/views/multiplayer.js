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
  partyId;

const startCanvas = (username, color, partyId) => {
  const event = new CustomEvent("start", {
    detail: {
      username,
      color,
      partyId,
    },
  });

  document.dispatchEvent(event);
};

document.addEventListener("DOMContentLoaded", () => {
  document.addEventListener("lose", (event) => {
    currentPlayer === 0 ? 1 : 0;
    // startGame();
  });
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
      startGame(
        event.detail.aditional.username,
        event.detail.aditional.color,
        event.detail.aditional.turn,
        event.detail.aditional.partyId
      );
    }
  });
});

const startGame = (username, color, turn, aditional) => {
  if (typeof aditional === undefined) {
    aditional = null;
  }
  clearTimeout(waitTimeOut);
  let downto = 6;
  let counter = setInterval(() => {
    $waitPlayers.innerHTML = --downto;
    if (downto === 0) {
      clearInterval(counter);

      if (turn === currentPlayer) {
        startCanvas(username, color, aditional);
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

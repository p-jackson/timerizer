const STOPPED_STATE = "STOP";
const COUNTDOWN_STATE = "COUNTDOWN";
const WORK_STATE = "WORK";
const REST_STATE = "REST";

let rafHandle = null;
let endTime = null;
let state = STOPPED_STATE;
let doDoubleWork = false;
let doDoubleRest = false;

const clockButton = document.querySelector(".Clock");
const clockText = document.querySelector(".Clock-text");
const clockTime = document.querySelector(".Clock-time");
const workInput = document.querySelector("#workTimer input");
const restInput = document.querySelector("#restTimer input");
const workButton = document.querySelector("#workTimer button");
const restButton = document.querySelector("#restTimer button");

const setDoubleRest = doDouble => {
  doDoubleRest = doDouble;
  restButton.setAttribute("aria-pressed", doDouble.toString());
};

const setDoubleWork = doDouble => {
  doDoubleWork = doDouble;
  workButton.setAttribute("aria-pressed", doDouble.toString());
};

const render = () => {
  clockText.textContent = getTimerText(state);
  const ms = (endTime - Date.now()) / 1000;
  if (ms > 0) {
    clockTime.textContent = ms.toFixed(2);
  } else if (state === COUNTDOWN_STATE) {
    const secondsToGo = parseInt(workInput.value, 10);
    endTime = Date.now() + secondsToGo * 1000;
    state = WORK_STATE;
    clockTime.textContent = "0.00";
  } else if (
    (state === REST_STATE && !doDoubleRest) ||
    (state === WORK_STATE && doDoubleWork)
  ) {
    if (state === WORK_STATE && doDoubleWork) setDoubleWork(false);
    const secondsToGo = parseInt(workInput.value, 10);
    endTime = Date.now() + secondsToGo * 1000;
    state = WORK_STATE;
    clockTime.textContent = "0.00";
  } else if (
    (state === WORK_STATE && !doDoubleWork) ||
    (state === REST_STATE && doDoubleRest)
  ) {
    if (state === REST_STATE && doDoubleRest) setDoubleRest(false);
    const secondsToGo = parseInt(restInput.value, 10);
    endTime = Date.now() + secondsToGo * 1000;
    state = REST_STATE;
    clockTime.textContent = "0.00";
  }
  rafHandle = requestAnimationFrame(render);
};

const getTimerText = state => {
  switch (state) {
    case REST_STATE:
      return "Rest!";
    case WORK_STATE:
      return "Work!";
    case COUNTDOWN_STATE:
      return "Prepare!";
    case STOPPED_STATE:
      return "Ready?";
  }
};

const run = () => {
  workButton.addEventListener("click", () => {
    setDoubleWork(!doDoubleWork);
  });

  restButton.addEventListener("click", () => {
    setDoubleRest(!doDoubleRest);
  });

  clockButton.addEventListener("click", function() {
    if (state === STOPPED_STATE) {
      state = COUNTDOWN_STATE;
      const secondsToGo = 5;
      endTime = Date.now() + secondsToGo * 1000;
      rafHandle = requestAnimationFrame(render);
    } else {
      state = STOPPED_STATE;
      cancelAnimationFrame(rafHandle);
      rafHandle = null;
      endTime = null;
      clockText.textContent = "Ready?";
      clockTime.textContent = "0.00";
    }
  });
};

(function() {
  run();
})();

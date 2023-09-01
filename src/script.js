import { months, form, containerWorkouts, inputType, inputDistance, inputDuration, inputCadence, inputElevation } from "./utils/constant.js";

/* ---------------------------------------------------------------------------------------------- */
/*                                        Global variables                                        */
/* ---------------------------------------------------------------------------------------------- */
let map;
let mapEvent;

const sucessfulCallback = (position) => {
  const { latitude } = position.coords;
  const { longitude } = position.coords;
  console.log(`https://www.google.com/maps/@${latitude},${longitude}`);
  const coords = [latitude, longitude];
  let map = L.map("map").setView(coords, 13);

  L.tileLayer("https://tile.openstreetmap.fr/hot/{z}/{x}/{y}.png", {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);

  map.on("click", (mapE) => {
    mapEvent = mapE;
    form.classList.remove("hidden");
    inputDistance.focus();
  });
};

const handleError = () => {
  console.log("error");
};

form.addEventListener("submit", (evt) => {
  evt.preventDefault();
  inputDuration.value = inputDistance.value = inputCadence.value = inputElevation.value = "";

  const { lat, lng } = mapEvent.latlng;
  L.marker([lat, lng])
    .addTo(map)
    .bindPopup(
      L.popup({
        maxWidth: 250,
        minWidth: 100,
        autoClose: false,
        closeOnClick: false,
        className: "running-popup",
      })
    )
    .setPopupContent("Workout")
    .openPopup();
});

inputType.addEventListener("change", () => {
  inputElevation.closest(".form__row").classList.toggle("form__row--hidden");
  inputCadence.closest(".form__row").classList.toggle("form__row--hidden");
});

// Checking if user allowed for geolocation
if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(sucessfulCallback, handleError);
}

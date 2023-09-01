import { months, form, containerWorkouts, inputType, inputDistance, inputDuration, inputCadence, inputElevation } from "../utils/constant.js";

const sucessfulCallback = (position) => {
  const { latitude } = position.coords;
  const { longitude } = position.coords;
  console.log(`https://www.google.com/maps/@${latitude},${longitude}`);
  const coords = [latitude, longitude];
  let map = L.map("map").setView(coords, 13);

  L.tileLayer("https://tile.openstreetmap.fr/hot/{z}/{x}/{y}.png", {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);

  map.on("click", (mapEvent) => {
    console.log(mapEvent);
    const { lat, lng } = mapEvent.latlng;
    L.marker([lat, lng]).addTo(map).bindPopup(L.popup({})).openPopup();
  });
};

const handleError = () => {
  console.log("error");
};

if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(sucessfulCallback, handleError);
}

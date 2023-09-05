import { months, form, containerWorkouts, inputType, inputDistance, inputDuration, inputCadence, inputElevation } from "./utils/constant.js";

class Workout {
  constructor(coords, distance, duration) {
    this._coords = coords; // array of coordinates
    this._distance = distance; // in Km
    this._duration = duration; // in min
    this.date = new Date();
    this._id = Math.trunc(Math.random() * 100);
  }
}

class Running extends Workout {
  type = "running";
  constructor(coords, distance, duration, cadence) {
    super(coords, distance, duration);
    this.cadence = cadence;
    this.calcPace();
  }

  calcPace() {
    // min/km
    this.pace = this._duration / this._distance;
    return this.pace;
  }
}

class Cycling extends Workout {
  type = "cycling";
  constructor(coords, distance, duration, evelationGain) {
    super(coords, distance, duration);
    this.evelationGain = evelationGain;
    this.calcSpeed();
  }
  calcSpeed() {
    this.speed = this._distance / (this._duration / 60);
    return this.speed;
  }
}

const run1 = new Running([39, -12], 5.2, 24, 178);
const cycle1 = new Cycling([39, -12], 27, 95, 523);
console.log(run1, cycle1);

// App Architecture
class App {
  constructor() {
    this._map;
    this._mapEvent;
    this._workouts = [];
    this._getPosition();
    form.addEventListener("submit", this._newWorkout.bind(this));
    inputType.addEventListener("change", this._toggleElevationField);
  }

  _getPosition() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(this._loadMap.bind(this), this._handleLoadMapError);
    }
  }

  _loadMap(position) {
    const { latitude } = position.coords;
    const { longitude } = position.coords;
    console.log(`https://www.google.com/maps/@${latitude},${longitude}`);

    const coords = [latitude, longitude];
    this._map = L.map("map").setView(coords, 13);

    L.tileLayer("https://tile.openstreetmap.fr/hot/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this._map);

    this._map.on("click", this._showForm.bind(this));
  }

  _handleLoadMapError() {
    console.log("Unable to load map");
  }

  _showForm(mapE) {
    this._mapEvent = mapE;
    form.classList.remove("hidden");
    inputDistance.focus();
  }

  _toggleElevationField() {
    inputElevation.closest(".form__row").classList.toggle("form__row--hidden");
    inputCadence.closest(".form__row").classList.toggle("form__row--hidden");
  }

  _newWorkout(evt) {
    const validInputs = (...inputs) => inputs.every((input) => Number.isFinite(input));
    const checkForPositive = (...inputs) => inputs.every((input) => input > 0);

    evt.preventDefault();
    const type = inputType.value;
    const distance = +inputDistance.value;
    const duration = +inputDuration.value;
    const { lat, lng } = this._mapEvent.latlng;
    let workout;

    if (type === "running") {
      const cadence = +inputCadence.value;
      if (!validInputs(distance, duration, cadence) || !checkForPositive(distance, duration, cadence)) return alert("Inputs have to be positive numbers");
      workout = new Running([lat, lng], distance, duration, cadence);
    }

    if (type === "cycling") {
      const elevation = +inputElevation.value;
      if (!validInputs(distance, duration, elevation) || !checkForPositive(distance, duration)) return alert("Inputs have to be positive numbers");
      workout = new Cycling([lat, lng], distance, duration, elevation);
    }

    // Add new object to workout array
    this._workouts.push(workout);

    // Render workout on map as a marker
    this.renderWorkoutMarker(workout);

    // clear input fields
    inputDuration.value = inputDistance.value = inputCadence.value = inputElevation.value = "";
  }

  renderWorkoutMarker(workout) {
    L.marker(workout._coords)
      .addTo(this._map)
      .bindPopup(
        L.popup({
          maxWidth: 250,
          minWidth: 100,
          autoClose: false,
          closeOnClick: false,
          className: `${workout.type}-popup`,
        })
      )
      .setPopupContent("")
      .openPopup();
  }
}

const app = new App();

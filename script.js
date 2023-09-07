// import { container } from "webpack";
import { months, form, containerWorkouts, inputType, inputDistance, inputDuration, inputCadence, inputElevation } from "./utils/constant.js";

class Workout {
  constructor(coords, distance, duration) {
    this.coords = coords; // array of coordinates
    this.distance = distance; // in Km
    this.duration = duration; // in min
    this.date = new Date();
    this._id = Math.trunc(Math.random() * 100);
    this.clicks = 0;
  }

  _setDescription() {
    this.description = `${this.type[0].toUpperCase()}${this.type.slice(1)} on ${months[this.date.getMonth()]} ${this.date.getDate()}`;
  }

  click() {
    this.clicks++;
  }
}

class Running extends Workout {
  type = "running";
  constructor(coords, distance, duration, cadence) {
    super(coords, distance, duration);
    this.cadence = cadence;
    this.calcPace();
    this._setDescription();
  }

  calcPace() {
    // min/km
    this.pace = this.duration / this.distance;
    return this.pace;
  }
}

class Cycling extends Workout {
  type = "cycling";
  constructor(coords, distance, duration, evelationGain) {
    super(coords, distance, duration);
    this.evelationGain = evelationGain;
    this.calcSpeed();
    this._setDescription();
  }
  calcSpeed() {
    this.speed = this.distance / (this.duration / 60);
    return this.speed;
  }
}

// App Architecture
class App {
  constructor() {
    this._map;
    this._mapEvent;
    this._workouts = [];
    this._mapZoomLevel = 13;
    this._getLocalStorage();
    this._getPosition();
    form.addEventListener("submit", this._newWorkout.bind(this));
    inputType.addEventListener("change", this._toggleElevationField);
    containerWorkouts.addEventListener("click", this._moveToPopup.bind(this));
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
    this._map = L.map("map").setView(coords, this._mapZoomLevel);

    L.tileLayer("https://tile.openstreetmap.fr/hot/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this._map);

    this._map.on("click", this._showWorkoutForm.bind(this));

    this._workouts.forEach((workout) => {
      this._renderWorkoutMarker(workout);
    });
  }

  _handleLoadMapError() {
    console.log("Unable to load map");
  }

  _showWorkoutForm(mapE) {
    this._mapEvent = mapE;
    form.classList.remove("hidden");
    inputDistance.focus();
  }

  _hideWorkoutForm() {
    inputDuration.value = inputDistance.value = inputCadence.value = inputElevation.value = "";

    form.style.display = "none";
    form.classList.add("hidden");
    setTimeout(() => (form.style.display = "grid"), 1000);
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
    this._renderWorkoutMarker(workout);

    // render workout on page
    this._renderWorkout(workout);

    // clear input fields
    this._hideWorkoutForm();

    this._setLocalStorage();
  }

  _renderWorkoutMarker(workout) {
    L.marker(workout.coords)
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
      .setPopupContent(`${workout.type === "running" ? "🏃‍♂️" : "🚴‍♀️"} ${workout.description}`)
      .openPopup();
  }

  _renderWorkout(workout) {
    let html = `
    <li class="workout workout--${workout.type}" data-id="${workout._id}">
    <h2 class="workout__title">${workout.description}</h2>
    <div class="workout__details">
      <span class="workout__icon">${workout.type === "running" ? "🏃‍♂️" : "🚴‍♀️"}</span>
      <span class="workout__value">${workout.distance}</span>
      <span class="workout__unit">km</span>
    </div>
    <div class="workout__details">
      <span class="workout__icon">⏱</span>
      <span class="workout__value">${workout.duration}</span>
      <span class="workout__unit">min</span>
    </div>`;

    if (workout.type === "running") {
      html += `
      <div class="workout__details">
        <span class="workout__icon">⚡️</span>
        <span class="workout__value">${workout.pace.toFixed(1)}</span>
        <span class="workout__unit">min/km</span>
      </div>
    <div class="workout__details">
        <span class="workout__icon">🦶🏼</span>
        <span class="workout__value">${workout.cadence}</span>
        <span class="workout__unit">spm</span>
    </div>`;
    }
    if (workout.type === "cycling") {
      html += `
      <div class="workout__details">
        <span class="workout__icon">⚡️</span>
        <span class="workout__value">${workout.speed.toFixed(1)}</span>
        <span class="workout__unit">km/h</span>
      </div>
      <div class="workout__details">
        <span class="workout__icon">⛰</span>
        <span class="workout__value">${workout.elevationGain}</span>
        <span class="workout__unit">m</span>
      </div>
      `;
    }
    form.insertAdjacentHTML("afterend", html);
  }
  _moveToPopup(evt) {
    if (!this._map) return;
    const workoutEl = evt.target.closest(".workout");
    if (!workoutEl) return;
    const workout = this._workouts.find((workout) => workout.id === workoutEl.dataset._id);
    this._map.setView(workout.coords, this._mapZoomLevel, { animate: true, pan: { duration: 1 } });
  }

  _setLocalStorage() {
    localStorage.setItem("workouts", JSON.stringify(this._workouts));
  }

  _getLocalStorage() {
    const data = JSON.parse(localStorage.getItem("workouts"));
    if (!data) return;
    this._workouts = data;
    this._workouts.forEach((workout) => {
      this._renderWorkout(workout);
    });
  }

  reset() {
    localStorage.removeItem("workouts");
    location.reload();
  }
}

const app = new App();

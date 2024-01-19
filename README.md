# Map My Workout App (Frontend)

## Overview

- Intro - About the project
- Description of the Project
- Links
- Copyright
- Plans for Improvement

### Intro - About the project

The Map My Workout web-application functions as an interactive map allowing the user to map-out workouts in their current location. This application is targeted specifically towards individuals who cycle or run, as opposed to other types of workouts. The user is able to select the location where their workout took place and record their statistics. The interface will then create a point of reference on the map with their workout. The user's left side of the screen will show case all workouts in their history.

### Description of the Project

This application enables user interaction with an external JavaScript library, namely Leaflet.js. Upon clicking a location within the interactive map, a new workout is added to the history on the left side. This functionality allows users to input details about the workout, and a pin is simultaneously added to the map. The entire application is constructed using HTML, CSS, and JavaScript, with a significant reliance on Leaflet.js for map-related functionalities.

### Links

The [live](https://workout-app-marlon-nunez.netlify.app/) project is hosted on Netlify.
The Leaflet.js Library can be found [here](https://leafletjs.com/)

### Copyright

The project concept, design and starter code (HTML & CSS) were created by Jonas Schmedtmann ([twitter/x](accouhttps://twitter.com/jonasschmedtman?lang=en)). Jonas Schmedtmann is the copyright owner of this concept. The JavaScript portion of this project was written by Marlon Nunez when following along 10 hours of video in the [The Complete JavaScript Course 2023: From Zero to Expert](https://www.udemy.com/course/the-complete-javascript-course/) course from Udemy.

### Plans for Improvement

1. Add additional workout options:
   Currently, the application is tailored specifically for cycling and running. The aim is to broaden the scope of this application to encompass a wide range of possible workouts.
   Furthermore, for workouts involving movement, there is a plan to introduce a feature that will enable users to add both a starting point and an ending point, creating a trace of their workout on the map. This enhancement will enhance the versatility of the application, accommodating various types of physical activities.

2. Edit existing workouts with ease:
   Allow users to effortlessly modify previously created workout entries.

3. Remove a specific workout from the records:
   Provide users with the ability to delete a workout from both the map and the list of recorded exercises.

4. Delete all stored workouts at once:
   Implement a one-click solution to delete all stored workouts simultaneously, offering users a convenient way to clear their workout history.

5. Arrange workouts based on specific criteria (e.g., distance):
   Introduce a sorting function to organize workouts based on specific criteria such as distance, allowing users to customize the view of their workout records.

6. Enhance error and confirmation messages for a more authentic user experience:
   Elevate the user experience by improving error and confirmation messages, ensuring users receive meaningful feedback based on their interactions.

7. Center the map to display all recorded workouts:
   Enable users to dynamically center the map, adjusting the view to display all recorded workouts in a given area. The current static view limits the visibility of all workouts simultaneously.

8. Showcase weather data corresponding to the workout time and location:
   Integrate a feature to capture and display weather data corresponding to the workout time and location. Users can input workout time and conditions, catering to those who prefer specific weather conditions for their exercise routines.

9. Add a backend
   Add a backend component to allow for users to create an account and save their workouts to a database to create historic overview

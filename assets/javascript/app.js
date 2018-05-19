
        // input ID's: #trainNameInput, #destinationInput, #trainTimeInput, #frequencyInput

var config = {
    apiKey: "AIzaSyBTXjLEK2jIcYDuPGLYwMR3-lkOAj5Nuls",
    authDomain: "train-time-fe0eb.firebaseapp.com",
    databaseURL: "https://train-time-fe0eb.firebaseio.com",
    projectId: "train-time-fe0eb",
    storageBucket: "",
    messagingSenderId: "219768034060"
};
firebase.initializeApp(config);

// for referencing the database
var database = firebase.database();

// listens for submit button and then gathers inputs from user
$("#submit-train").on("click", function(event) {
    event.preventDefault();
    var trainName = $("#trainNameInput").val().trim();
    console.log("Train name: " + trainName);
    var destination = $("#destinationInput").val().trim();
    console.log("The destination is: " + destination);
    var firstStopTime = $("#trainTimeInput").val().trim();
    console.log("The first train arrives at: " + firstStopTime);
    var frequency = $("#frequencyInput").val().trim();
    console.log("It runs every " + frequency + " minutes.");

// creates new local object from those inputs
var newTrain = {
    name: trainName,
    destination: destination,
    firstTime: firstStopTime,
    frequency: frequency,
    dateAdded: firebase.database.ServerValue.TIMESTAMP
};

// appends object to database
    database.ref().push(newTrain);

    //check the data in console
    console.log(newTrain.name);
    console.log(newTrain.destination);
    console.log(newTrain.firstTime);
    console.log(newTrain.frequency);

// clear out the input fields
    $("#trainNameInput").val("");
    $("#destinationInput").val("");
    $("#trainTimeInput").val("");
    $("#frequencyInput").val("");
});

// waits for a new train to be added, then grabs a current snapshot of the database
database.ref().on("child_added", function(childSnapshot) {
    console.log(childSnapshot.val());

// store individual train data in variables
    var trainName = childSnapshot.val().name;
    var destination = childSnapshot.val().destination;
    var firstStopTime = childSnapshot.val().firstTime;
    var frequency = childSnapshot.val().frequency;

    //check the data in console
    console.log(trainName);
    console.log(destination);
    console.log(firstStopTime);
    console.log(frequency);

    var firstTimeFormatted = moment(firstStopTime, "HH:mm").subtract(1, "years");
    console.log(firstTimeFormatted);

    //grabs current time from user's system
    var currentTime = moment();
    console.log("the current time is: " + moment(currentTime).format("HH:mm"));

    //determines the difference in minutes from current time to first stop by train
    var diffTime = moment().diff(moment(firstTimeFormatted), "minutes");
    console.log("The difference in time is: " + diffTime);

    //grabs the remainder left after dividing the difference in time from the frequency of stops
    var tRemainder = diffTime % frequency;
    console.log(tRemainder);

    //subtracts the remainder from the frequency of stops to determine how many minutes are left
    var minutesLeft = frequency - tRemainder;
    console.log("Minutes left until the train is here: " + minutesLeft + "minutes");

    //determines exact time next train will arrive and formats it 
    var nextTrain = moment().add(minutesLeft, "minutes").format("h:mm A");
    console.log("Arriving at: " + nextTrain);

    //displays all train data from formulas
    $("#trainTable > tbody").append("<tr><td>" + trainName + "</td><td>" + destination + "</td><td class='text-center'>" +
    frequency + "</td><td class='text-center'>" + nextTrain + "</td><td class='text-center'>" + minutesLeft + "</td></tr>");
});


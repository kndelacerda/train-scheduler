  // // Initialize Firebase
  // var config = {
  //   apiKey: "AIzaSyCCL7Lhx6gQRAjta7nX1s3vFe13WP9Yrfo",
  //   authDomain: "train-scheduler-90db0.firebaseapp.com",
  //   databaseURL: "https://train-scheduler-90db0.firebaseio.com",
  //   projectId: "train-scheduler-90db0",
  //   storageBucket: "train-scheduler-90db0.appspot.com",
  //   messagingSenderId: "532166450800"
  // };
  // firebase.initializeApp(config);
var url="https://train-scheduler-90db0.firebaseio.com/";
var dataRef= new Firebase(url);
var keyHolder='';
var getKey='';
var name='';
var destination='';
var timeInput='';
var frequency='';
var nxtTrain='';
var nxtTrainFormat='';
var minutesAway='';
var timeInputConverted='';
var currentTime='';
var diffTime='';
var tRemainder='';
var minsRemaining='';


// Prepares the DOM
$(document).ready(function() {
  //Logic to add trains to the schedule
  $("#add-train").on("click", function() {
    name=$('#name-input').val().trim();
    destination=$('#destination-input').val().trim();
    timeInput=$('#time-input').val().trim();
    frequency=$('#frequency-input').val().trim();
    timeInputConverted=moment(timeInput, "hh:mm").subtract(1, "years");
    currentTime=moment();
    diffTime=moment().diff(moment(timeInputConverted), "minutes");
    tRemainder=diffTime % frequency;
    minsRemaining=frequency - tRemainder;
    nxtTrain = moment().add(minsRemaining, "minutes");
    nxtTrainFormat=moment(nxtTrain).format("hh:mm");

    //Push Details
    keyHolder = dataRef.push({
      name: name,
      destination: destination,
      timeInput: timeInput,
      frequency: frequency,
      nxtTrainFormat: nxtTrainFormat,
      minsRemaining: minsRemaining,
    });

    $('#name-input').val('');
    $('#destination-input').val('');
    $('#time-input').val('');
    $('#frequency-input').val('');

    return false;
  });

  dataRef.on("child_added", function(childSnapshot) {
    //Adds items to the well
    $('.train-table').append("<tr class='table-row' id=" + "'" + childSnapshot.key() + "'" + ">" +
    "<td class='col-xs-3'>" + childSnapshot.val().name +
    "</td>" +
    "<td class='col-xs-2'>" + childSnapshot.val().destination +
    "</td>" +
    "<td class='col-xs-2'>" + childSnapshot.val().frequency +
    "</td>" +
    "<td clas='col-xs-2'>" + childSnapshot.val().nxtTrainFormat +
    "</td>" +
    "<td class='col-xs-2'>" + childSnapshot.val().minsRemaining +
    "</td>" +
    "<td class='col-xs-1'>" + "<input type='submit' value='remove train' class='remove-train btn btn-primary btn-sm'" +
    "</tr>");
  },
  $("body").on("click", ".remove-train", function(){
    $(this).closest('tr').remove();
    getKey=$(this).parent().parent().attr('id');
    dataRef.child(getKey).remove();
  });
});

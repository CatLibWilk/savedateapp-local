// Get references to page elements
var $submitBtn = $("#startSubmit");
var $messageBody = $("#startMessage");
// var loggedInUserId = 1; //"1" is just a testing placeholder, in production will come from the login process
var messageList = [];

$(document).ready(() => {
  refreshMessages();
});

// The API object contains methods for each kind of request we'll make
var API = {
  createMessage: function(message) {
    console.log(message);
    return $.ajax({
      headers: {
        "Content-Type": "application/json"
      },
      type: "POST",
      url: "api/messages",
      data: JSON.stringify(message)
    });
  },
  getMessages: function() {
    return $.ajax({
      url: "api/messages/",
      type: "GET"
    });
  },
  deleteMessage: function(id) {
    return $.ajax({
      url: "api/messages/" + id,
      type: "DELETE"
    });
  },
  updateMessage: function(id, messageUpdate) {
    return $.ajax({
      headers: {
        "Content-Type": "application/json"
      },
      type: "PUT",
      url: "api/update/" + id,
      data: JSON.stringify(messageUpdate)
    });
  },
  getHistory: function() {
    return $.ajax({
      url: "api/history/",
      type: "GET"
    });
  },
  profile: function() {
    return $.ajax({
      url: "user/",
      type: "GET"
    });
  }
};

// handleFormSubmit is called whenever we submit a new example
// Save the new example to the db and refresh the list
var handleFormSubmit = function(event) {
  event.preventDefault();

  if ($messageBody.val().trim() != "") {
    var newMessageBody = $messageBody.val().trim();
  } else {
    alertify.alert("Please enter a message to be sent").set('frameless', true);
  }
  var newSendTime = $("#sendTime").val();
  var message = {
    body: newMessageBody,
    sendTime: newSendTime
  };

  if (!(message.body && message.sendTime)) {
    alertify.alert("You must enter a message and valid time!").set('frameless', true);
    return;
  }

  API.createMessage(message).then(function() {
    refreshMessages();
  });

  $messageBody.val("");
  $("#startTime").val("");
  $("#startDate").val("");
};

var refreshMessages = function() {
  API.getMessages().then(function(data) {
    if (data.length === 0) {
      var $messages = function() {
        var $h2 = $("<h2>").text(
          `Looks like you don't have any messages to be sent. Why not add one now?`
        );

        return $h2;
      };
    } else {
      var $messages = data.map(function(message) {
        var $a = $("<a>")
          .text(
            `${message.body} to be sent at: ${moment(
              message.sendTime,
              "YYYY-MM-DD HH:mm Z"
            )}`
          )
          .attr("href", "/example/" + message.id);

        var $li = $("<li>")
          .attr({
            class: "list-group-item",
            "data-id": message.id
          })
          .append($a);

        var $delButton = $("<button>")
          .addClass("btn btn-danger float-right delete")
          .text("Delete");

        var $updButton = $("<button>")
          .addClass("btn btn-success mr-2 float-right update")
          .text("Edit");

        $li.append($delButton, $updButton);

        return $li;
      });
    }
    $("#message-list").empty();
    $("#message-list").append($messages);
  });
};

// Add event listeners to the submit and delete buttons
$submitBtn.on("click", handleFormSubmit);

$("#message-list").on("click", ".delete", function(e) {
  e.preventDefault();
  var deleteId = $(this)
    .closest("li")
    .attr("data-id");

  API.deleteMessage(deleteId).then(returned => {
    refreshMessages();
  });
});

//event listeners for update function

$("#message-list").on("click", ".update", function(e) {
  e.preventDefault();
  $("#updateDiv").modal({ show: true });
  var updateId = $(this)
    .closest("li")
    .attr("data-id");

  $("#update-submit").on("click", function(e) {
    e.preventDefault();

    var message = {
      body: $("#update-input")
        .val()
        .trim()
    };

    API.updateMessage(updateId, message)
      .then(function() {
        refreshMessages();
      })
      .then(() => {
        let fade = new Promise((res, rej) => {
          res($("#updateDiv").fadeOut(450));
        });

        fade.then(() => {
          function closeModal() {
            $("#updateDiv").modal("hide");
          }

          setTimeout(closeModal, 400);
        });
      });
  });
});

//close model on clicking x button//

$("#modal-close").on("click", e => {
  let fade = new Promise((res, rej) => {
    res($("#updateDiv").fadeOut(450));
  });

  fade.then(() => {
    function closeModal() {
      $("#updateDiv").modal("hide");
    }

    setTimeout(closeModal, 400);
  });
});

//code for when we have history implemented//
var loadHistory = function() {
  API.getHistory().then(response => {
    var $history = response.map(message => {
      var $a = $("<a>")
        .text(`${message.body} originally sent at: ${message.sendTime}`)
        .attr("href", "/example/" + message.id);

      var $li = $("<li>")
        .attr({
          class: "list-group-item",
          "data-id": message.id
        })
        .append($a);

      var $delButton = $("<button>")
        .addClass("btn btn-danger float-right jizz")
        .text("ｘ");

      $li.append($delButton);

      return $li;
    });
  });
};
flatpickr("#sendTime", {
  altInput: true,
  enableTime: true,
  minDate: new Date(),
  minuteIncrement: 5
});

///eventListener for profile button click
$("#profile-btn").on("click", e => {
  // e.preventDefault();
  API.profile();
});

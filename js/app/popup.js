var myApp = angular.module("my-app", []);

myApp.controller("PopupCtrl", ['$scope', '$http', function($scope, $http){
   console.log("Controller Initialized");

   $scope.selectedText = "";
   $scope.neutralStyle = {};
   $scope.score = "";
   $scope.magnitude = "";

   $scope.positiveWidth = {'width': 0 + "px"};
   $scope.positivePercentage = "";

   $scope.negativeWidth = {'width': 0 + "px"};
   $scope.negativePercentage = "";

   // Get Background Page to get selectedText from it's scope
   let bgPage = chrome.extension.getBackgroundPage();
   let selectedText = bgPage.selectedText;
   $scope.selectedText = selectedText;
   console.log("selectedText: " + selectedText);

   if(selectedText.length > 0) {
     $http({
          url: 'https://language.googleapis.com/v1/documents:analyzeSentiment?key=YOUR_API_KEY',
          method: "POST",
          data: {
            "encodingType": "UTF8",
            "document": {
              "type": "PLAIN_TEXT",
              "content": selectedText
            }
          }
      })
      .then(function(response) {
        // success
        console.log("success in getting reponse from Sentiment Analysis API");
        console.log("response: " + JSON.stringify(response));
        $scope.score = response.data.documentSentiment.score;
        $scope.magnitude = response.data.documentSentiment.magnitude;
        updateSentimentAnalyzer();
      },
      function(response) { // optional
        // failed
        console.log("failure in getting response from Sentiment Analysis API");
      });
   }

   function updateSentimentAnalyzer() {
    let percentage = Math.abs($scope.score) * 100;
    if($scope.score > 0) {
      // Positive
      $scope.positiveWidth = {'width': percentage + "%"};
      $scope.positivePercentage = percentage;
    }else if($scope.score < 0) {
      // Negative
      $scope.negativeWidth = {'width': percentage + "%"};
      $scope.negativePercentage = percentage;
    }else {
      // Neutral
      $scope.positiveWidth = {'width': "5px"};
      $scope.negativeWidth = {'width': "5px"};
      $scope.neutralStyle = {'font-weight':"bold"};
    }
   }

  }
]);

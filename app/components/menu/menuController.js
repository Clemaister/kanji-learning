app.controller("menuController", function($scope, $http, $location, userInfo){
    
    $scope.loading=true;
    $scope.readings=[];
    $scope.knownReadings=0;
    $scope.knownWritings=0;
    $scope.learntKanjis=0;
    $scope.rank='';
    $scope.rankName='';
    $scope.progression=(localStorage.progression) ? JSON.parse(localStorage.progression) : userInfo.getProgression();
    
    $scope.getProgression = function(){
        
        $scope.progression.forEach(function(reading){
            if(reading.value>=3){
                if(reading.type=="reading") $scope.knownReadings++;
                else if(reading.type=="writing") $scope.knownWritings++;
            } 
        });
        $scope.learntKanjis=$scope.knownReadings+$scope.knownWritings;
        if($scope.learntKanjis>=2000) $scope.rank='god';
        else if($scope.learntKanjis>=1000) $scope.rank='master';
        else if($scope.learntKanjis>=500) $scope.rank='intermediate';
        else if($scope.learntKanjis>=300) $scope.rank='studious';
        else if($scope.learntKanjis>=100) $scope.rank='apprentice';
        else $scope.rank='beginner';
        $scope.rankName= $scope.rank.charAt(0).toUpperCase() + $scope.rank.slice(1);
        $scope.initOdometer();
        $scope.loading=false;
    }
    
    $http.get("api/get-readings.php").success(function(readings, status, headers, config){
        $scope.readings=readings;
        $scope.getProgression();
    });
    
    $scope.goTo = function(location){
        $location.path(location);   
    }
    
    $scope.initOdometer = function(){
        window.odometerOptions = {
          auto: true, // Don't automatically initialize everything with class 'odometer'
          selector: '.learnt-kanji', // Change the selector used to automatically find things to be animated
          format: 'd', // Change how digit groups are formatted, and how many digits are shown after the decimal point
          duration: 3000, // Change how long the javascript expects the CSS animation to take
          theme: 'default', // Specify the theme (if you have more than one theme css file on the page)
          animation: 'count' // Count is a simpler animation method which just increments the value,
                             // use it when you're looking for something more subtle.
        };

        var knownReadings = document.querySelector('.known-readings');
        var knownWritings = document.querySelector('.known-writings');

        od = new Odometer({
          el: knownReadings,
          value: 000000
        });
        od = new Odometer({
          el: knownWritings,
          value: 000000
        });
        knownReadings.innerHTML = $scope.knownReadings;
        knownWritings.innerHTML = $scope.knownWritings;
    }
    
    
    
});
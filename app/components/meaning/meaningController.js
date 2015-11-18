app.controller("meaningController", function($scope, $http, $location, $timeout, userInfo){
	
    $scope.loading=true;
    $scope.settings = ($.isEmptyObject(userInfo.getPickedExercice())) ? JSON.parse(localStorage.pickedExercice) : userInfo.getPickedExercice();
    $scope.readings=[];
    $scope.favorites=userInfo.getFavorites();
    $scope.incorrects=[];
    $scope.corrects=[];
    $scope.correct=false;
    $scope.correctAnswer="";
    $scope.currentReading=0;
    $scope.currentQuestion=1;
    $scope.totalQuestions=0;
    $scope.retest=[];
    $scope.retestID=0;
    $scope.percentage=0;
    $scope.nbReadings=0;
    $scope.user={answer: ""};
    $scope.possibleAnswers=[];
    $scope.allReadings=[];
    
    $scope.init = function(){
        
        switch($scope.settings.mode){
            case 'normal': 
                $scope.currentReading=Math.floor((Math.random() * $scope.readings.length-1)+1);
                $scope.totalQuestions=$scope.settings.nbQuestions;
                $scope.readings.forEach(function(reading){reading.done=false;});
                if($scope.settings.nbQuestions==0 || $scope.readings.length < $scope.settings.nbQuestions){
                    $scope.totalQuestions=$scope.readings.length;
                }
                break;
            case 'retest':
                $scope.initRetest();
                $scope.currentReading=$scope.retest[$scope.retestID];
                $scope.totalQuestions=$scope.settings.nbQuestions;
                break;
                
        }
        $scope.generatePossibleAnswers();
        $scope.readings[$scope.currentReading].done=true;
        $scope.loading=false;
    }
    
    $scope.initRetest = function(){
        
        $scope.settings.retest.forEach(function(retestName){
            var found=false;
            var i=0;
            while(!found && i<$scope.readings.length){
                if($scope.readings[i].name==retestName) found=true;
                else i++;
            }
            $scope.retest.push(i);
        });
        
    }
    
    $scope.generatePossibleAnswers = function(){
        
        $scope.possibleAnswers=[];
        $scope.allReadings.forEach(function(reading){reading.done=false;});
        for(var i=0; i<3; i++){
            var random = Math.floor((Math.random() * $scope.allReadings.length-1)+1);
            if($scope.allReadings[random].done==false && $scope.allReadings[random].meaning!=$scope.readings[$scope.currentReading].meaning){
                $scope.possibleAnswers.push($scope.allReadings[random].meaning);
                $scope.allReadings[random].done=true;
            }
        }
        $scope.possibleAnswers.splice(Math.floor((Math.random() * $scope.possibleAnswers.length-1)+1), 0, $scope.readings[$scope.currentReading].meaning);
    }
    
    $scope.checkAnswer = function(meaning){
        
        $scope.correctAnswer = $scope.readings[$scope.currentReading].meaning;
        $scope.user.answer=meaning;
        $scope.correct=($scope.user.answer==$scope.correctAnswer);
        if(!$scope.correct){
            $scope.incorrects.push($scope.readings[$scope.currentReading].name);
        }else{
            $scope.corrects.push($scope.readings[$scope.currentReading].name);
        }
        $scope.displayAnswer=true;
        
        $timeout(function(){
            $scope.next();
        }, 1000);
    
    }
    
    $scope.isUserAnswer = function(answer){
        return answer==$scope.user.answer;
    }
	
	$scope.next = function(){
        if($scope.currentQuestion!=$scope.totalQuestions){
            $scope.generateNewQuestion();
        }else{
            if($scope.corrects.length!=0) $scope.percentage = (($scope.corrects.length*100)/$scope.totalQuestions).toFixed(2);
            var results={
                corrects:$scope.corrects,
                incorrects:$scope.incorrects, 
                totalQuestions:$scope.totalQuestions,
                percentage:$scope.percentage
            };
            userInfo.setResults(results);
            localStorage.results=JSON.stringify(results);
            $location.path('results');
        }
    }
    
    $scope.generateNewQuestion = function(){
        
        switch($scope.settings.mode){
            case 'normal':
                var tries=-1;
                do{
                    $scope.currentReading=Math.floor((Math.random() * $scope.readings.length-1)+1);
                    tries++;
                }while($scope.readings[$scope.currentReading].done);
                break;
            case 'retest':
                $scope.retestID++;
                $scope.currentReading=$scope.retest[$scope.retestID];
                break;
        }
        $scope.generatePossibleAnswers();
        $scope.readings[$scope.currentReading].done=true;
        $scope.currentQuestion++;
        $scope.displayAnswer=false;
        $scope.user.answer="";
    } 
    
    if($scope.settings.category=="-1"){
        $scope.readings=$scope.favorites;
        $http.get("api/get-readings.php").success(function(readings, status, headers, config){
            $scope.allReadings=readings;
            $scope.init();
        });
    }
    else{
        $http.get("api/get-readings.php?category="+$scope.settings.category).success(function(readings, status, headers, config){
            $scope.readings=readings;
            $http.get("api/get-readings.php").success(function(readings, status, headers, config){
                $scope.allReadings=readings;
                $scope.init();
            });
        });
    }
    
});


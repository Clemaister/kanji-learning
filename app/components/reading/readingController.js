app.controller("readingController", function($scope, $http, $location, userInfo){
	
    $scope.loading=true;
    $scope.settings = ($.isEmptyObject(userInfo.getPickedExercice())) ? JSON.parse(localStorage.pickedExercice) : userInfo.getPickedExercice();
    $scope.readings=[];
    $scope.favorites=userInfo.getFavorites();
	$scope.currentKanji=0;
    $scope.incorrects=[];
    $scope.corrects=[];
    $scope.correct=false;
    $scope.currentReading=0;
    $scope.currentQuestion=1;
    $scope.totalQuestions=0;
    $scope.retest=[];
    $scope.retestID=0;
    $scope.percentage=0;
    $scope.nbReadings=0;
    $scope.user={answer: ""}
    
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
        })
    }
    
    $scope.verify = function(e){
        if(e && e.keyCode==13){
            if($scope.displayAnswer){
                $scope.next();
            }else{
                $scope.checkAnswer();
            }
        }
        else if(!e){
            $scope.displayAnswer=true;
            $scope.checkAnswer();
        }
    }
    
    $scope.checkAnswer = function(){

        $scope.correct=($scope.user.answer==$scope.readings[$scope.currentReading].hiragana);
        if(!$scope.correct){
            $scope.incorrects.push($scope.readings[$scope.currentReading].name);
        }else{
            $scope.corrects.push($scope.readings[$scope.currentReading].name);
        }
        $scope.displayAnswer=true;
    
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
        $scope.readings[$scope.currentReading].done=true;
        $scope.currentQuestion++;
        $scope.displayAnswer=false;
        $scope.user.answer="";
    } 
    
    if($scope.settings.category=="-1"){
        $scope.readings=$scope.favorites;
        $scope.init();
    }
    else{
        $http.get("api/get-readings.php?category="+$scope.settings.category).success(function(readings, status, headers, config){
            $scope.readings=readings;
            $scope.init();
        });
    }
    
});


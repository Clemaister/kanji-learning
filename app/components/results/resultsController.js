app.controller("resultsController", function($scope, $location, userInfo){
    
    $scope.results = ($.isEmptyObject(userInfo.getResults())) ? JSON.parse(localStorage.results) : userInfo.getResults();
    $scope.previousChoice = ($.isEmptyObject(userInfo.getPickedExercice())) ? JSON.parse(localStorage.pickedExercice) : userInfo.getPickedExercice();
    $scope.nbQuestions = ($.isEmptyObject(userInfo.getNbQuestions())) ? localStorage.nbQuestions : userInfo.getNbQuestions();
    $scope.progression = (localStorage.progression) ? JSON.parse(localStorage.progression) : userInfo.getProgression();
    $scope.kanjis=[];
    
    $scope.updateProgression = function(){
            
        $scope.results.corrects.forEach(function(correct){
            var found=false;
            var i=0;
            while(!found && i<$scope.progression.length){
                if($scope.progression[i].type==$scope.previousChoice.type && $scope.progression[i].name==correct) found=true;
                else i++;
            }
            if(found){
                $scope.progression[i].value++;
                $scope.kanjis.push($scope.progression[i]);
            } 
            else{
                $scope.progression.push({type:$scope.previousChoice.type, name:correct, value:1});
                $scope.kanjis.push($scope.progression[$scope.progression.length-1]);
            } 
            
        });
        
        $scope.results.incorrects.forEach(function(incorrect){
            var found=false;
            var i=0;
            while(!found && i<$scope.progression.length){
                if($scope.progression[i].type==$scope.previousChoice.type && $scope.progression[i].name==incorrect) found=true;
                else i++;
            }
            if(found){
                if($scope.progression[i].value!=0) $scope.progression[i].value--;
                $scope.kanjis.push($scope.progression[i]);
            }
            else{
                $scope.kanjis.push({name:incorrect, value:0});
            }
        });
        userInfo.setProgression($scope.progression);
        localStorage.progression=JSON.stringify($scope.progression);
        
    }
    
    $scope.retryFailedKanjis = function(){
        var pickedExercice = {
            type:$scope.previousChoice.type,
            category:$scope.previousChoice.category,
            nbQuestions:$scope.results.incorrects.length,
            mode:'retest',
            retest:$scope.results.incorrects
        };
        userInfo.setPickedExercice(pickedExercice);
        localStorage.pickedExercice=JSON.stringify(pickedExercice);
        $location.path(pickedExercice.type);
    }
    
    $scope.retry = function(){
        var pickedExercice = {
            type:$scope.previousChoice.type,
            category:$scope.previousChoice.category,
            nbQuestions:$scope.nbQuestions,
            mode:'normal',
            retest:[]
        };
        userInfo.setPickedExercice(pickedExercice);
        localStorage.pickedExercice=JSON.stringify(pickedExercice);
        $location.path(pickedExercice.type);
    }
    
    $scope.back = function(){
        $location.path('picker');
    }
    
    $scope.updateProgression();
    
});
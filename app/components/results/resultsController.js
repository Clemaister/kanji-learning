app.controller("resultsController", function($scope, $http, $location, userInfo){
    
    $scope.results = ($.isEmptyObject(userInfo.getResults())) ? JSON.parse(localStorage.results) : userInfo.getResults();
    $scope.previousChoice = ($.isEmptyObject(userInfo.getPickedExercice())) ? JSON.parse(localStorage.pickedExercice) : userInfo.getPickedExercice();
    $scope.nbQuestions = ($.isEmptyObject(userInfo.getNbQuestions())) ? localStorage.nbQuestions : userInfo.getNbQuestions();
    $scope.progression = (localStorage.progression) ? JSON.parse(localStorage.progression) : [];
    $scope.kanjis=[];
    
    $scope.calculateProgression = function(){
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
                $scope.kanjis.push({type:$scope.previousChoice.type, name:incorrect, value:0});
            }
        });
        
    }
    
    $scope.updateProgression = function(){
        
        localStorage.progression=JSON.stringify($scope.progression);
        if($scope.session.status==200){
            $scope.loading=true;
            $http({
                method:'POST',
                url:"api/user/update_progression", 
                data:$.param({user:$scope.session, progression:$scope.kanjis}),
                headers: {"Content-Type":"application/x-www-form-urlencoded"}
            }).success(function(response){
                $scope.loading=false;
            }).error(function(){
                alert('An error occured. Please check your network connection.');
                $scope.loading=false;
            });
        }
        
    }
    
    $scope.retryFailedKanjis = function(){
        var pickedExercice = {
            type:$scope.previousChoice.type,
            system:$scope.previousChoice.system,
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
            system:$scope.previousChoice.system,
            category:$scope.previousChoice.category,
            nbQuestions:$scope.nbQuestions,
            mode:'normal',
            retest:[]
        };
        userInfo.setPickedExercice(pickedExercice);
        localStorage.pickedExercice=JSON.stringify(pickedExercice);
        $location.path(pickedExercice.type);
    }
    
    $scope.goTo = function(location){
        $location.path(location);
    }
        
    $http.get("api/user/session_data").success(function(sessionData){
        $scope.session=sessionData;
        if($scope.session.status==200){
            $http.get("api/user/get_progression/"+$scope.session.user_id).success(function(progression){
                console.log(progression)
                $scope.progression=progression;
                $scope.calculateProgression();
                $scope.updateProgression();
            });
        }
        else{
            $scope.calculateProgression();
            $scope.updateProgression();
        }
        
    });
    
});
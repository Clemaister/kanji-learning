app.controller("resultsController", function($scope, $location, userInfo){
    
    $scope.results = ($.isEmptyObject(userInfo.getResults())) ? JSON.parse(localStorage.results) : userInfo.getResults();
    $scope.previousChoice = ($.isEmptyObject(userInfo.getPickedExercice())) ? JSON.parse(localStorage.pickedExercice) : userInfo.getPickedExercice();
    $scope.nbQuestions = ($.isEmptyObject(userInfo.getNbQuestions())) ? localStorage.nbQuestions : userInfo.getNbQuestions();
    
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
    
});
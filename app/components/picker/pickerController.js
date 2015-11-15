app.controller("pickerController", function($scope, $http, $location, userInfo){
    
    $scope.loading=true;
    $scope.categories=[];
    $scope.favorites=userInfo.getFavorites();
    $scope.nbQuestions=[5, 10, 20, 50, 100, 0];
    
    $scope.types=[{
        id: 'reading',
        desc: 'Basic reading'
    },{
        id: 'writing',
        desc: 'Basic writing'
    }];
    
    $scope.systems=[{
        id: 'hiragana',
        desc: 'Hiragana'
    },{
        id: 'romaji',
        desc: 'Romaji'
    }];
        
    $scope.userChoice={
        type:'reading',
        system:'hiragana',
        category:'0',
        nbQuestions:0
    }

    $http.get("api/get-categories.php").success(function(categories, status, headers, config){
        $scope.categories=categories;
        if($scope.favorites.length!=0){
            $scope.categories.push({id:-1, desc:'★'});
            $scope.userChoice.category=-1
        }
        $scope.categories.push({id:0, desc:'All'});
        $scope.loading=false;
    });
    
    $scope.startExercice = function(){
        var pickedExercice = {
            type:$scope.userChoice.type,
            system:$scope.userChoice.system,
            category:$scope.userChoice.category, 
            nbQuestions:parseInt($scope.userChoice.nbQuestions),
            mode:'normal',
            retest:[]
        };
        userInfo.setPickedExercice(pickedExercice);
        userInfo.setNbQuestions(pickedExercice.nbQuestions);
        localStorage.pickedExercice=JSON.stringify(pickedExercice);
        localStorage.nbQuestions=pickedExercice.nbQuestions;
        $location.path($scope.userChoice.type);
    }
});
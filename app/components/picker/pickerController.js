app.controller("pickerController", function($scope, $http, $location, userInfo){
    
    $scope.loading=true;
    $scope.categories=[];
    $scope.favorites = (localStorage.favorites) ? JSON.parse(localStorage.favorites) : [];
    $scope.nbQuestions=[5, 10, 20, 50, 100, 0];
    
    $scope.types=[{
        id: 'reading',
        desc: 'Basic reading'
    },{
        id: 'writing',
        desc: 'Basic writing'
    },{
        id: 'meaning',
        desc: 'English meaning'
    }];
    
    $scope.systems=[{
        id: 'hiragana',
        desc: 'Hiragana mode'
    },{
        id: 'romaji',
        desc: 'Romaji mode'
    }];
        
    $scope.userChoice={
        type:'reading',
        system:'hiragana',
        category:'0',
        nbQuestions:0
    }
    
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
    
    $scope.init = function(){
        $http.get("api/categories/get_all").success(function(categories){
            $scope.categories=categories;
            if($scope.favorites.length!=0){
                $scope.categories.push({id:-1, desc:'Favorites', code:'fav'});
                $scope.userChoice.category=-1
            }
            $scope.categories.push({id:0, desc:'All'});
            $scope.loading=false;
        });
    }
    
    $http.get("api/user/session_data").success(function(sessionData){
        $scope.session=sessionData;
        if($scope.session.status==200){
            $http.get("api/user/get_fav/"+$scope.session.user_id).success(function(favorites){
                $scope.favorites=favorites;
                $scope.init();
            });
        }
        else{
            $scope.init();
        }
    });
});
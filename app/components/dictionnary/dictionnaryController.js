app.controller("dictionnaryController", function($scope, $http, $location, userInfo){
    
    $scope.loading=true;
    $scope.kanjis=[];
    $scope.userFav=userInfo.getFavorites();
    $scope.favOnly=false;
    
    $http.get("api/get-kanjis.php").success(function(kanjis, status, headers, config){
        $scope.kanjis=kanjis;
        $scope.loading=false;
    });
    
    $scope.setStarClass = function(kanjiIndex, readingIndex){ 
        var starClass="fa-star-o";
        $scope.kanjis[kanjiIndex].readings[readingIndex].favorite=false;
        if(localStorage.favorites){
            var favorites=JSON.parse(localStorage.favorites);
            favorites.forEach(function(favorite){
                if(favorite.name==$scope.kanjis[kanjiIndex].readings[readingIndex].name){
                    starClass="fa-star";
                    $scope.kanjis[kanjiIndex].readings[readingIndex].favorite=true;
                }
            });
        }else{
            if(userInfo.isInFavorites($scope.kanjis[kanjiIndex].readings[readingIndex])){
                starClass="fa-star";
                $scope.kanjis[kanjiIndex].readings[readingIndex].favorite=true;
            }
        }
        return starClass;
    }
    
    $scope.toggleFavorite = function(kanjiIndex, readingIndex){
        userInfo.toggleFavorite($scope.kanjis[kanjiIndex].readings[readingIndex]);
    }

});
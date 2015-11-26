app.controller("dictionnaryController", function($scope, $http, $location, userInfo){
    
    $scope.loading=true;
    $scope.kanjis=[];
    $scope.favOnly=false;
    $scope.session;
    $scope.favorites = (localStorage.favorites) ? JSON.parse(localStorage.favorites) : [];
    
    $scope.checkHide = function(kanjiIndex){
        var hide=false;
        var containsFav=false;
        var i=0;
        while(!containsFav && i<$scope.kanjis[kanjiIndex].readings.length){
            if($scope.kanjis[kanjiIndex].readings[i].favorite) containsFav=true;
            else i++;
        }
        if($scope.favOnly && !containsFav) hide=true;
        return hide;
        
    }
    
    $scope.setStarClass = function(kanjiIndex, readingIndex){ 
        
        var starClass="fa-star-o";
        $scope.kanjis[kanjiIndex].readings[readingIndex].favorite=false;

        $scope.favorites.forEach(function(favorite){
            if(favorite.name==$scope.kanjis[kanjiIndex].readings[readingIndex].name){
                starClass="fa-star";
                $scope.kanjis[kanjiIndex].readings[readingIndex].favorite=true;
            }
        });
    
        return starClass;
    }
    
    $scope.toggleFavorite = function(kanjiIndex, readingIndex){
        
        var favorite = $scope.kanjis[kanjiIndex].readings[readingIndex];
        
        var found=false;
        var i=0;
        while(!found && i<$scope.favorites.length){
            if($scope.favorites[i].name==favorite.name) found=true;
            else i++;
        }
        
        if(found){
            $scope.favorites.splice(i, 1);
            if($scope.session.status==200){
                $http({
                    method:'POST',
                    url:"api/user/remove_fav", 
                    data:$.param({user:$scope.session, reading_id:favorite.id}),
                    headers: {"Content-Type":"application/x-www-form-urlencoded"}
                });
            }
        }
        else{
            $scope.favorites.push(favorite);
            if($scope.session.status==200){
                $http({
                    method:'POST',
                    url:"api/user/add_fav", 
                    data:$.param({user:$scope.session, reading_id:favorite.id}),
                    headers: {"Content-Type":"application/x-www-form-urlencoded"}
                });
            }
        }
        
        if($scope.session.status==400) localStorage.favorites=JSON.stringify($scope.favorites);
            
    }
    
    $http.get("api/kanjis/get_all").success(function(kanjis){
        $scope.kanjis=kanjis;
        $scope.loading=false;
    });

    $http.get("api/user/session_data").success(function(sessionData){
        $scope.session=sessionData;
        if($scope.session.status==200){
            $http.get("api/user/get_fav/"+$scope.session.user_id).success(function(favorites){
                $scope.favorites=favorites;
            });
        }
    });

});
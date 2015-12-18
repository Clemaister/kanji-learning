app.controller("dictionnaryController", function($scope, $http, $location, userInfo){
    
    $scope.loading=true;
    $scope.kanjis=[];
    $scope.favOnly=false;
    $scope.session;
    $scope.details=false;
    $scope.currentKanji=0;
    $scope.currentReading=0;
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
    
    $scope.toggleFavorite = function($event, kanjiIndex, readingIndex){
        
        $event.stopPropagation();
        var favoriteChose = $scope.kanjis[kanjiIndex].readings[readingIndex];
        
        var i=0;
        var found=false;
        while(!found && i<$scope.favorites.length){
            if($scope.favorites[i].name==favoriteChose.name) found=true;
            else i++;
        }
        
        if(found){
            var favoriteToDelete=$scope.favorites[i];
            $scope.favorites.splice($scope.favorites.indexOf($scope.favorites[i]), 1);
            if($scope.session.status==200){
                $http({
                    method:'POST',
                    url:"api/user/remove_fav", 
                    data:$.param({user:$scope.session, reading_id:favoriteToDelete.id}),
                    headers: {"Content-Type":"application/x-www-form-urlencoded"}
                });
            }
        }
        else{
            $scope.favorites.push(favoriteChose);
            if($scope.session.status==200){
                $http({
                    method:'POST',
                    url:"api/user/add_fav", 
                    data:$.param({user:$scope.session, reading_id:favoriteChose.id}),
                    headers: {"Content-Type":"application/x-www-form-urlencoded"}
                });
            }
        }
        
        if($scope.session.status==400) localStorage.favorites=JSON.stringify($scope.favorites);
            
    }
    
    $scope.hideDetails = function(){
        $scope.details=false;
    }
    
    $scope.search = function(filteredReadings){
        $scope.displayedReadings.push(filteredReadings);
    }
    
    $scope.showDetails = function(kanjiID, readingID){
        $scope.currentKanji=kanjiID;
        $scope.currentReading=readingID;
        $scope.details=true;
    }

    $scope.prev = function($event){
        
        $event.stopPropagation();
        if($scope.currentReading!=0) $scope.currentReading--;
        else{
            var prevName = $scope.filteredKanjis[$scope.currentKanji].filteredReadings[$scope.currentReading].name;
            $scope.currentKanji--;
            $scope.currentReading=$scope.filteredKanjis[$scope.currentKanji].filteredReadings.length-1;
            if($scope.filteredKanjis[$scope.currentKanji].filteredReadings[$scope.currentReading].name==prevName){
                $scope.prev($event);
            }
        }
        
    }
    
    $scope.hidePrev = function(){
        return (
            ($scope.currentKanji==0 && $scope.currentReading==0) ||
            (
                $scope.currentKanji==1 && $scope.currentReading==0 && 
                $scope.filteredKanjis[$scope.currentKanji].filteredReadings[$scope.currentReading].name == 
                $scope.filteredKanjis[0].filteredReadings[$scope.filteredKanjis[0].filteredReadings.length-1].name
            )
        );
    }
    
    $scope.next = function($event){
        
        $event.stopPropagation();
        if($scope.currentReading!=$scope.filteredKanjis[$scope.currentKanji].filteredReadings.length-1) $scope.currentReading++;
        else{
            var prevName = $scope.filteredKanjis[$scope.currentKanji].filteredReadings[$scope.currentReading].name;
            $scope.currentKanji++;
            $scope.currentReading=0;
            if($scope.filteredKanjis[$scope.currentKanji].filteredReadings[$scope.currentReading].name==prevName){
                $scope.next($event);
            }
        }

    }
    
    $scope.hideNext = function(){
        return (
            (
                $scope.currentKanji==$scope.filteredKanjis.length-1 && 
                $scope.currentReading==$scope.filteredKanjis[$scope.currentKanji].filteredReadings.length-1
            ) 
            ||
            (
                $scope.currentKanji==$scope.filteredKanjis.length-2 && 
                $scope.currentReading==$scope.filteredKanjis[$scope.currentKanji].filteredReadings.length-1 && 
                $scope.filteredKanjis[$scope.currentKanji].filteredReadings[$scope.currentReading].name == 
                $scope.filteredKanjis[$scope.currentKanji+1].filteredReadings[0].name
            )
        );
    }
    
    $scope.stopProp = function($event){
        $event.stopPropagation();
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
                console.log($scope.favorites)
            });
        }
    });

});
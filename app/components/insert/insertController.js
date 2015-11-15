app.controller("insertController", ['$scope', '$http', function($scope, $http){
	
    $scope.categories=[];
    $scope.searchName='';
    $scope.editing=false;
    $scope.readings=[{name:'', hiragana:'', romaji:'', categories:[]}];
    
    $http.get("api/get-categories.php").success(function(categories, status, headers, config){
        $scope.categories=categories;
        $scope.readings[0].categories.push($scope.categories[0].id);
    });
    
    $scope.addReading = function(){
        $scope.readings.push({name:'', hiragana:'', romaji:'', categories:[$scope.categories[0].id]});
    }
    
    $scope.addCategory = function(index){
        $scope.readings[index].categories.push($scope.categories[0].id);
    }
    
    $scope.edit = function(){
        $http.get("api/get-readings.php?reading_name="+$scope.searchName).success(function(readings, status, headers, config){

            if(readings.length==0){
                alert('Not found');
            }
            else{
                $scope.readings=readings;
                $scope.editing=true;
            }
        });
    }
    
    $scope.submit = function(){
        
        $http({
            method:'POST',
            url:"api/insert-kanji.php", 
            data:$.param({readings:$scope.readings, editing:$scope.editing}),
            headers: {"Content-Type":"application/x-www-form-urlencoded"}
        }).success(function(response){
            console.log(response);
            $scope.readings=[{name:'', hiragana:'', romaji:'', categories:[$scope.categories[0].id]}];
            if($scope.editing) $scope.editing=false;
        });

    }
}]);


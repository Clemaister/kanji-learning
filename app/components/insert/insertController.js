app.controller("insertController", function($scope, $http, $location){
	
    $scope.categories=[];
    $scope.search={name:''};
    $scope.editing=false;
    $scope.readings=[{name:'', hiragana:'', romaji:'', meaning:'', example:'', categories:[]}];
    $scope.session;
    $scope.loading=true;
    
    $http.get("api/categories/get_all/").success(function(categories, status, headers, config){
        $scope.categories=categories;
        $scope.readings[0].categories.push($scope.categories[0].id);
    });
    
    $scope.addReading = function(){
        $scope.readings.push({name:'', hiragana:'', romaji:'', meaning:'', example:'', categories:[$scope.categories[0].id]});
    }
    
    $scope.addCategory = function(index){
        $scope.readings[index].categories.push($scope.categories[0].id);
    }
    
    $scope.edit = function(){
        $http.get("api/readings/search/"+$scope.search.name).success(function(readings){
            if(readings.length==0){
                alert('Not found');
            }
            else{
                readings.forEach(function(reading){
                    var formatedCategories=[];
                    reading.categories.forEach(function(category){
                        formatedCategories.push(category.id);
                    });
                    reading.categories=formatedCategories;
                });
                $scope.readings=readings;
                $scope.editing=true;
            }
        });
    }
    
    $scope.submit = function(){
        
        $http({
            method:'POST',
            url:"api/kanjis/insert/", 
            data:$.param({readings:$scope.readings, editing:$scope.editing}),
            headers: {"Content-Type":"application/x-www-form-urlencoded"}
        }).success(function(alreadyExists){
            if(alreadyExists.length!=0){
                alreadyExists.forEach(function(name){alert(name+' already exists !');});
            }
            else{
                $scope.readings=[{name:'', hiragana:'', romaji:'', meaning:'', example:'', categories:[$scope.categories[0].id]}];
            }
            if($scope.editing) $scope.editing=false;
        });

    }
    
    $http.get("api/user/session_data").success(function(sessionData){
        $scope.session=sessionData;
        if($scope.session.user_id!=1){
            $location.path("/");
        }
        else{
            $scope.loading=false;
        }
    });
    
});


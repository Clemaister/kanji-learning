app.controller("loginController", function($scope, $http, $location, $timeout, userInfo){
    
    $scope.loading=false;
    $scope.showError=false;
    
    $scope.user={
        email:'',
        password:''
    }
    
    $scope.submit = function(){
        
        $scope.loading=true;
        $http({
            method:'POST',
            url:"api/user/connect", 
            data:$.param({user:$scope.user}),
            headers: {"Content-Type":"application/x-www-form-urlencoded"}
        }).success(function(response){
            if(response==200) $location.path('/');
            else{
                $scope.showError=true;
                $timeout(function(){
                    $scope.showError=false;
                }, 2000);
            }
            $scope.loading=false;
        }).error(function(){
            alert('An error occured. Please check your network connection.');
            $scope.loading=false;
        });
        
    }
    
});

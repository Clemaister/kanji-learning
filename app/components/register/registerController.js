app.controller("registerController", function($scope, $http, $location, $timeout, userInfo){
    
    $scope.validForm=false;
    $scope.loading=false;
    $scope.showError=false;
    $scope.progression = (localStorage.progression) ? JSON.parse(localStorage.progression) : [];
    $scope.favorites = (localStorage.favorites) ? JSON.parse(localStorage.favorites) : [];
    
    $scope.user={
        email:{
            value:'', 
            regex:/^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/g, 
            message:'Standart format for email adress',
            valid:false,
            confirm:{value:'', message:'', valid:false}
        },
        username:{
            value:'', 
            regex:/^[A-z0-9_-]{3,10}$/g, 
            message:'From 3 to 10 alphanumeric characters',
            valid:false
        },
        password:{
            value:'', 
            regex:/^[A-z0-9_-]{3,16}$/g, 
            message:'From 3 to 16 alphanumeric characters',
            valid:false,
            confirm:{value:'', message:'', valid:false}
        }
    }
    
    $scope.checkInput = function(){

        $scope.user.email.valid = ($scope.user.email.value && $scope.user.email.value.match($scope.user.email.regex));
        $scope.user.email.confirm.valid = ($scope.user.email.value && $scope.user.email.confirm.value==$scope.user.email.value);
        $scope.user.username.valid = ($scope.user.username.value && $scope.user.username.value.match($scope.user.username.regex));
        $scope.user.password.valid = ($scope.user.password.value && $scope.user.password.value.match($scope.user.password.regex));
        $scope.user.password.confirm.valid = ($scope.user.password.value && $scope.user.password.confirm.value==$scope.user.password.value);
        $scope.checkForm();
        
    }
    
    $scope.checkForm = function(){
        $scope.validForm = ($scope.user.email.valid && $scope.user.email.confirm.valid && $scope.user.username.valid && $scope.user.password.valid && $scope.user.password.confirm.valid);
    }
    
    $scope.submit = function(){
        
        $scope.loading=true;
        $http({
            method:'POST',
            url:"api/user/create", 
            data:$.param({user:$scope.user, progression:$scope.progression, favorites:$scope.favorites}),
            headers: {"Content-Type":"application/x-www-form-urlencoded"}
        }).success(function(response){
            if(response==200){
                $location.path('/'); 
            }
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

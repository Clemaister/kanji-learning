app.controller("menuController", function($scope, $http, $location){
    
    $scope.goTo = function(location){
        $location.path(location);   
    }
    
});
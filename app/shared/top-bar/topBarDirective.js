app.directive('ngTopBar', function($location, $http) {
  return {
    restrict: 'A',
    scope: {
        withBack: '@',
        title: '@',
        loginInfo: '@'
    },
    link: function($scope, $elem, $attrs) {
        
        $scope.session = {status:400, username:''};
        
        $http.get("api/user/session_data").success(function(sessionData, status, headers, config){
            $scope.session=sessionData;
        });
        
        $scope.back = function(){
            $location.path($scope.withBack);
        }
        
        $scope.logout = function(){
            $http.get("api/user/logout").success(function(status, status, headers, config){
                $location.path("/");
            });
        }
    },
    templateUrl: 'app/shared/top-bar/topBarView.html'
  }
});

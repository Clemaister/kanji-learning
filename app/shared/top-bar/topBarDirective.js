app.directive('ngTopBar', function($location) {
  return {
    restrict: 'A',
    scope: {
        withBack: '@',
        title: '@'
    },
    link: function($scope, $elem, $attrs) {
        $scope.back = function(){
            $location.path($scope.withBack);
        }
    },
    templateUrl: 'app/shared/top-bar/topBarView.html'
  }
});

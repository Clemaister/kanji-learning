app.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider){
    
    $routeProvider
    // route for the reading exercice page
    
    .when('/', {
        templateUrl : 'app/components/menu/menuView.html',
        controller  : 'menuController'
    })
    
    .when('/menu', {
        templateUrl : 'app/components/menu/menuView.html',
        controller  : 'menuController'
    })
    
    .when('/dictionnary', {
        templateUrl : 'app/components/dictionnary/dictionnaryView.html',
        controller  : 'dictionnaryController'
    })
    
    .when('/picker', {
        templateUrl : 'app/components/picker/pickerView.html',
        controller  : 'pickerController'
    })
    
    .when('/reading', {
        templateUrl : 'app/components/reading/readingView.html',
        controller  : 'readingController'
    })
    
    .when('/writing', {
        templateUrl : 'app/components/writing/writingView.html',
        controller  : 'writingController'
    })
    
    .when('/results', {
        templateUrl : 'app/components/results/resultsView.html',
        controller  : 'resultsController'
    })

    .when('/insert', {
        templateUrl : 'app/components/insert/insertView.html',
        controller  : 'insertController'
    })
    
    .otherwise({redirectTo: '/'});
    
    $locationProvider.html5Mode(true);
    
}]);
app.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider){
    
    $routeProvider
    // route for the reading exercice page
    
    .when('/', {
        templateUrl : 'app/components/menu/menuView.html',
        controller  : 'menuController'
    })
    
    .when('/register', {
        templateUrl : 'app/components/register/registerView.html',
        controller  : 'registerController'
    })
    
    .when('/login', {
        templateUrl : 'app/components/login/loginView.html',
        controller  : 'loginController'
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
    
    .when('/meaning', {
        templateUrl : 'app/components/meaning/meaningView.html',
        controller  : 'meaningController'
    })
    
    .when('/statistics', {
        templateUrl : 'app/components/statistics/statisticsView.html',
        controller  : 'statisticsController'
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
app.controller("statisticsController", function($scope, $http, $location, userInfo){
    
    $scope.progression = (localStorage.progression) ? JSON.parse(localStorage.progression) : [];
    
    $scope.formatProgression = function(){
        
        var formatedProgression=[];
        $scope.progression.forEach(function(kanji){
            var found=false;
            var i=0;
            while(!found && i<formatedProgression.length){
                if(formatedProgression[i].name==kanji.name) found=true;
                else i++;
            }
            
            if(found){
                if(kanji.type=="reading") formatedProgression[i].readingVal=kanji.value;
                else if(kanji.type=="writing") formatedProgression[i].writingVal=kanji.value;
                else if(kanji.type=="meaning") formatedProgression[i].meaningVal=kanji.value;
            }
            else{
                if(kanji.type=="reading") formatedProgression.push({name:kanji.name, readingVal:kanji.value, writingVal:0, meaningVal:0});
                else if(kanji.type=="writing") formatedProgression.push({name:kanji.name, readingVal:0, writingVal:kanji.value, meaningVal:0});   
                else if(kanji.type=="meaning") formatedProgression.push({name:kanji.name, readingVal:0, writingVal:0, meaningVal:kanji.value});   
            }
        });
        
        $scope.progression = formatedProgression;
        
    }
    
    $http.get("api/user/session_data").success(function(sessionData){
        $scope.session=sessionData;
        if($scope.session.status==200){
            $http.get("api/user/get_progression/"+$scope.session.user_id).success(function(progression, status, headers, config){
                $scope.progression=progression;
                $scope.formatProgression();
            });
        }
        else $scope.formatProgression();
        
    });
    
});
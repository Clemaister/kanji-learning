app.controller("writingController", function($scope, $http, $location, userInfo){
	
    $scope.loading=true;
    $scope.settings = ($.isEmptyObject(userInfo.getPickedExercice())) ? JSON.parse(localStorage.pickedExercice) : userInfo.getPickedExercice();
    $scope.kanjis=[];
    $scope.readings=[];
    $scope.favorites=userInfo.getFavorites();
    $scope.displayAnswer=false;
    $scope.incorrects=[];
    $scope.corrects=[];
    $scope.correct=false;
    $scope.currentReading=0;
    $scope.currentQuestion=1;
    $scope.totalQuestions=0;
    $scope.retest=[];
    $scope.retestID=0;
    $scope.percentage=0;
    $scope.nbReadings=0;
    $scope.user={answer: ""}

    $scope.canvas = document.getElementsByTagName("canvas")[0];
    $scope.ctx = $scope.canvas.getContext("2d");
    $scope.ctx.canvas.width = $($scope.canvas).width();
    $scope.ctx.canvas.height = $($scope.canvas).height();
    
    $scope.startTimer=true;
    $scope.date;
    
    $scope.strokes=[];
    $scope.stroke;
    $scope.xArray;
    $scope.yArray;
    $scope.msArray;
    
    $scope.init = function(){
        switch($scope.settings.mode){
            case 'normal': 
                $scope.currentReading=Math.floor((Math.random() * $scope.readings.length-1)+1);
                $scope.totalQuestions=$scope.settings.nbQuestions;
                $scope.readings.forEach(function(reading){reading.done=false;});
                if($scope.settings.nbQuestions==0 || $scope.readings.length < $scope.settings.nbQuestions){
                    $scope.totalQuestions=$scope.readings.length;
                }
                break;
            case 'retest':
                $scope.retest=$scope.settings.retest;
                $scope.currentReading=$scope.retest[$scope.retestID];
                $scope.totalQuestions=$scope.settings.nbQuestions;
                break;
                
        }
        $scope.readings[$scope.currentReading].done=true;
        $scope.loading=false;
        
        $($scope.canvas).bind("touchstart", function(e){$scope.startDrawing(e.originalEvent.touches[0].pageX, e.originalEvent.touches[0].pageY); return false;});
        $($scope.canvas).bind("touchmove", function(e){$scope.draw(e.originalEvent.touches[0].pageX, e.originalEvent.touches[0].pageY);});
        $($scope.canvas).bind("touchend", function(e){$scope.finishedDrawing();});
    }
    
    $scope.verify = function(e){
        if(e && e.keyCode==13){
            if($scope.displayAnswer){
                $scope.next();
            }else{
                $scope.checkAnswer();
            }
        }
        else if(!e){
            $scope.displayAnswer=true;
            $scope.checkAnswer();
        }
    }
    
    $scope.startDrawing = function(eX, eY){
        $scope.stroke=[];
        var canvasX = eX-$scope.canvas.offsetLeft;
        var canvasY = eY-$scope.canvas.offsetTop;
        $scope.drawing = true;
        $scope.ctx.strokeStyle = "#4b4b4b";
        $scope.ctx.lineWidth = 5;
        $scope.ctx.beginPath();
        $scope.ctx.moveTo(canvasX, canvasY);
        if($scope.startTimer){
            $scope.date = new Date();
            $scope.startTimer=false;
        }
        var d = new Date();
        $scope.xArray=[];
        $scope.yArray=[];
        $scope.msArray=[];
        $scope.xArray.push(canvasX);
        $scope.yArray.push(canvasY);
        $scope.msArray.push(d.getTime()-$scope.date.getTime());
    }
    
    $scope.draw = function(eX, eY){
        var canvasX = eX-$scope.canvas.offsetLeft;
        var canvasY = eY-$scope.canvas.offsetTop;
        if($scope.drawing){
            if(canvasX>=0 && canvasX<=$scope.ctx.canvas.width && canvasY>=0 && canvasY<=$scope.ctx.canvas.height){
                var d = new Date();
                $scope.ctx.lineTo(canvasX, canvasY);
                $scope.ctx.stroke();
                $scope.xArray.push(canvasX);
                $scope.yArray.push(canvasY);
                $scope.msArray.push(d.getTime()-$scope.date.getTime());
            }
            else{
                $scope.finishedDrawing();
            }
        }
    }
    
    $scope.finishedDrawing = function(){
        $scope.drawing=false;
        $scope.ctx.stroke();
        $scope.stroke.push($scope.xArray, $scope.yArray, $scope.msArray);
        $scope.strokes.push($scope.stroke);
        $scope.identifyKanji();
    }
    
    $scope.clear = function(){
        $scope.stroke = [];
        $scope.strokes = [];
        $scope.ctx.clearRect(0, 0, $scope.ctx.canvas.width, $scope.ctx.canvas.height);
    }
    
    $scope.identifyKanji = function(){
        
        var dataToSend = { 
            api_level: "537.36",
            app_version: 0.4,
            device: window.navigator.userAgent,
            input_type: 0,
            options: "enable_pre_space",
            requests: [{
                writing_guide: {writing_area_width: $scope.canvas.width, writing_area_height: $scope.canvas.height},
                max_completions: 0,
                max_num_results: 1,
                pre_context: "",
                ink: $scope.strokes
            }]
        };
        
        $.ajax({
            method: "POST",
            url: "https://inputtools.google.com/request?itc=ja-t-i0-handwrit&app=translate",
            contentType: "application/json",
            dataType: "json",
            data: window.JSON.stringify(dataToSend),
            success:function(response){
                $scope.user.answer= (response[1][0][1][0]) ? response[1][0][1][0] : false;
            }
        });

    }
    
    $scope.checkAnswer = function(){
        $scope.correct=($scope.user.answer==$scope.readings[$scope.currentReading].name);
        if(!$scope.correct){
            $scope.incorrects.push($scope.currentReading);
        }else{
            $scope.corrects.push($scope.currentReading);
        }
        $scope.displayAnswer=true;
    }
	
	$scope.next = function(){
        if($scope.currentQuestion!=$scope.totalQuestions){
            $scope.generateNewQuestion();
        }else{
            if($scope.corrects.length!=0) $scope.percentage = (($scope.corrects.length*100)/$scope.totalQuestions).toFixed(2);
            var results={
                corrects:$scope.corrects,
                incorrects:$scope.incorrects, 
                totalQuestions:$scope.totalQuestions,
                percentage:$scope.percentage
            };
            userInfo.setResults(results);
            localStorage.results=JSON.stringify(results);
            $location.path('results');
        }
    }
    
    $scope.generateNewQuestion = function(){
        
        $scope.clear();
        switch($scope.settings.mode){
            case 'normal':
                var tries=-1;
                do{
                    $scope.currentReading=Math.floor((Math.random() * $scope.readings.length-1)+1);
                    tries++;
                }while($scope.readings[$scope.currentReading].done);
                break;
            case 'retest':
                $scope.retestID++;
                $scope.currentReading=$scope.retest[$scope.retestID];
                break;
        }
        $scope.readings[$scope.currentReading].done=true;
        $scope.currentQuestion++;
        $scope.displayAnswer=false;
        $scope.user.answer="";
        $scope.drawnKanji=[];
    }  
    
    $scope.parseReadings = function(){
        $scope.kanjis.forEach(function(kanji){
           $scope.readings = $scope.readings.concat(kanji.readings);
        });
    }
    
    if($scope.settings.category=="-1"){
        $scope.readings=$scope.favorites;
        $scope.init();
    }
    else{
        $http.get("api/get-kanjis.php?category="+$scope.settings.category).success(function(kanjis, status, headers, config){
            $scope.kanjis=kanjis;
            $scope.parseReadings();
            $scope.init();
        });
    }
    
});


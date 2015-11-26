app.factory('userInfo', function(){
   
    var _pickedExercice = {};
    var _results = {};
    var _nbQuestions = 0;
    var _learntKanjis = (localStorage.learntKanjis) ? JSON.parse(localStorage.learntKanjis) : 0;

    function setNbQuestions(nbQuestions){
        _nbQuestions=nbQuestions;    
    }
    
    function getNbQuestions(){
        return _nbQuestions;
    }
    
    function setPickedExercice(pickedExercice){
        _pickedExercice=pickedExercice;
    }
    
    function getPickedExercice(){
        return _pickedExercice;
    }
    
    function setResults(results){
        _results=results;
    }
    
    function getResults(){
        return _results;
    }
    
    function incLearntKanjis(){
        _learntKanjis++;
        localStorage.learntKanjis=_learntKanjis;
    }
    
    function decLearntKanjis(){
        _learntKanjis--;
        localStorage.learntKanjis=_learntKanjis;
    }
    
    function getLearntKanjis(){
        return _learntKanjis;
    }
    
    return {
        setNbQuestions: setNbQuestions,
        getNbQuestions: getNbQuestions,
        setPickedExercice: setPickedExercice,
        getPickedExercice: getPickedExercice,
        setResults: setResults,
        getResults: getResults,
        incLearntKanjis: incLearntKanjis,
        decLearntKanjis: decLearntKanjis,
        getLearntKanjis: getLearntKanjis
    }
    
});
app.factory('userInfo', function(){
   
    var _pickedExercice = {};
    var _results = {};
    var _nbQuestions = 0;
    var _learntKanjis = (localStorage.learntKanjis) ? JSON.parse(localStorage.learntKanjis) : 0;
    var _favorites = (localStorage.favorites) ? JSON.parse(localStorage.favorites) : [];
    var _progression = (localStorage.progression) ? JSON.parse(localStorage.progression) : [];
    
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
    
    function getFavorites(){
        return _favorites;
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
    
    function toggleFavorite(favorite){
        var index=-1;
        for(var i=0; i<_favorites.length; i++){ 
            if(_favorites[i].name==favorite.name){
                index=i;
                break;
            }
        }
        (index > -1) ? _favorites.splice(index, 1) : _favorites.push(favorite);
        localStorage.favorites=JSON.stringify(_favorites);
    }
    
    function isInFavorites(favorite){
        var found=false;
        _favorites.forEach(function(kanji){
            if(kanji.name==favorite.name) found=true;
        });
        return found;
    }
    
    function getProgression(){
        return _progression;
    }
    
    function setProgression(progression){
        _progression=progression;
    }
    
    return {
        setNbQuestions: setNbQuestions,
        getNbQuestions: getNbQuestions,
        setPickedExercice: setPickedExercice,
        getPickedExercice: getPickedExercice,
        setResults: setResults,
        getResults: getResults,
        toggleFavorite: toggleFavorite,
        getFavorites: getFavorites,
        isInFavorites: isInFavorites,
        incLearntKanjis: incLearntKanjis,
        decLearntKanjis: decLearntKanjis,
        getLearntKanjis: getLearntKanjis,
        getProgression: getProgression,
        setProgression: setProgression
    }
    
});
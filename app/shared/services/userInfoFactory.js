app.factory('userInfo', function(){
   
    var _pickedExercice = {};
    var _results = {};
    var _nbQuestions = 0;
    var _favorites = (localStorage.favorites) ? JSON.parse(localStorage.favorites) : [];
    
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
    
    return {
        setNbQuestions: setNbQuestions,
        getNbQuestions: getNbQuestions,
        setPickedExercice: setPickedExercice,
        getPickedExercice: getPickedExercice,
        setResults: setResults,
        getResults: getResults,
        toggleFavorite: toggleFavorite,
        getFavorites: getFavorites,
        isInFavorites: isInFavorites
    }
    
});
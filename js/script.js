var genBtn = document.querySelector("#generate");
var characterSheet = document.querySelector("#new-character");
var charName = document.querySelector("#character-name");



var getDndName = function() {
    charName.textContent = "";
    var apiURL = "https://api.fungenerators.com/name/generate?category=shakespearean&limit=500&variation=any"

    fetch(apiURL)
    .then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {
                var characterNames = data.contents.names;
                charName.textContent = "Your character is " + characterNames   
            });
            // if nothing comes back, use local storage 
        } else {
            console.log("No names found");
        }
    })
    .catch(function(error) {
        console.log("Unable to connect to name generator");
    });
}

/**
 * Randomly assigns a class. 
 */
var getClass = function() {
    var apiUrl = "https://www.dnd5eapi.co/api/classes";

    fetch(apiUrl)
    .then(function(response) {
        return response.json();
    })
    .then(function(response) {
        $("#char-class").text((response.results[Math.floor(Math.random() * response.results.length)].name));
    })
    .catch(function(error) {
        console.log("Unable to reach class data");
    });
}

genBtn.addEventListener("click", getDndName);
genBtn.addEventListener("click", getClass);
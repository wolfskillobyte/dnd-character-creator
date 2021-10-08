var genBtn = document.querySelector("#generate");
var characterSheet = document.querySelector("#new-character");
var charName = document.querySelector("#character-name")



var getDndName = function() {
    charName.textContent = ""
    var apiURL = "https://api.fungenerators.com/name/generate?category=shakespearean&limit=50&variation=any"

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

genBtn.addEventListener("click", getDndName);


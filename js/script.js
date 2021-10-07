var genBtn = document.querySelector("#generate");
var characterSheet = document.querySelector("#new-character");


var getDndName = function() {
    var apiURL = "https://api.fungenerators.com/name/generate?category=shakespearean"

    fetch(apiURL)
    .then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {
                var characterNames = data.contents.names;
                var namesEl = document.createElement("p")
                namesEl.textContent = "Your character is " + characterNames[0]
                characterSheet.appendChild(namesEl)
                    
            });
        } else {
            console.log("No names found");
        }
    })
    .catch(function(error) {
        console.log("Unable to connect to name generator");
    });
}

genBtn.addEventListener("click", getDndName());


var genBtn = document.querySelector("#generate");
var characterSheet = document.querySelector("#new-character");
var charName = document.querySelector("#character-name");
var savedChars = [];
var getNameComplete = false; var getClassComplete = false;
var getRaceComplete = false; var getAlignmentComplete = false;

/**
 * Assigns a random DnD name to the character. Will draw from the API if
 * no names are present in localstorage, and place the drawn array into 
 * localstorage. If there are names there, it'll just use those. This 
 * should minimize database calls.
 */
var getDndName = function() {
    var characterNames;
    var apiURL = "https://api.fungenerators.com/name/generate?category=shakespearean&limit=500&variation=any";
    
    charName.textContent = "";

    if (!localStorage.getItem("names")) { //checks to see if the name array is already in localstorage
        console.log("Names not found in localstorage; calling database");

        fetch(apiURL)
        .then(function (response) {
            if (response.ok) {
                response.json().then(function (data) {
                    characterNames = data.contents.names;
                    charName.textContent = "Your character is " 
                    + characterNames[Math.floor(Math.random() * characterNames.length)];

                    localStorage.setItem("names", JSON.stringify(characterNames));
                });
            } else {
                console.log("No names found");
            }
        })
        .catch(function(error) {
            console.log("Unable to connect to name generator");
        })
        .finally(function() {
            console.log("get dnd name complete");
        });
    }
    else {
        console.log("Names found in localstorage; drawing from there");

        characterNames = JSON.parse(localStorage.getItem("names"));
        charName.textContent = "Your character is " 
        + characterNames[Math.floor(Math.random() * characterNames.length)];
        console.log("getDndName complete");
        getNameComplete = true;
    }
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
        changeImg();
    })
    .catch(function(error) {
        console.log("Unable to reach class data");
    })
    .finally(function() {
        console.log("getClass complete");
        getClassComplete = true;
    });
}

// Concatenizes the "src" with the randomly generated class
function changeImg() {
    document.getElementById("character-img").src = "assets/images/" + document.getElementById("char-class").innerText + ".jpg"
};

/**
 * Randomly assigns a race. 
 */
 var getRace = function() {
    var apiUrl = "https://www.dnd5eapi.co/api/races";

    fetch(apiUrl)
    .then(function(response) {
        return response.json();
    })
    .then(function(response) {
        $("#char-race").text((response.results[Math.floor(Math.random() * response.results.length)].name));
    })
    .catch(function(error) {
        console.log("Unable to reach race data");
    })
    .finally(function() {
        console.log("getRace complete");
        getRaceComplete = true;
    });
}

/**
 * Randomly assigns an alignment. 
 */
 var getAlignment = function() {
    var apiUrl = "https://www.dnd5eapi.co/api/alignments";

    fetch(apiUrl)
    .then(function(response) {
        return response.json();
    })
    .then(function(response) {
        $("#char-align").text((response.results[Math.floor(Math.random() * response.results.length)].name));
    })
    .catch(function(error) {
        console.log("Unable to reach alignment data");
    })
    .finally(function() {
        console.log("getAlignment complete");
        getAlignmentComplete = true;
    });
}

function saveChar() {
    console.log("saveChar activated");
}

/**
 * Will find a saved character in localstorage and display it
 */
function getSavedChar() {
    console.log("getSavedChar activated");
}

genBtn.addEventListener("click", function() {
    var saveCheck;

    getDndName();
    getClass();
    getRace();
    getAlignment();

    saveCheck = setInterval(function() {
        if (getNameComplete && getRaceComplete && getClassComplete && getAlignmentComplete) {
            saveChar();
            getNameComplete = false; getRaceComplete = false; getClassComplete = false; getAlignmentComplete = false;
            clearInterval(saveCheck);
        }
        else {
            console.log("page not ready yet");
        }
    }, 1000);
});
$("#get-saved-char").click(getSavedChar);
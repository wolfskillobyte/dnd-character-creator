var genBtn = document.querySelector("#generate");
var characterSheet = document.querySelector("#new-character");
var charName = document.querySelector("#character-name");
var charSaveLimit = 3; //this will determine how many characters can be saved at once
var savedChars = [];
var dropDownOptions = document.querySelector("#saved-chars").children;

/**
 * Exists only to call getDndName(), which will call getClass(),
 * which will call getRace()... until all the gets are activated.
 * By doing all these calls from inside the fetch statements, it
 * is now guaranteed that each will occur in order, and by hiding the
 * Save Character button at the beginning of this process, and revealing
 * it at the end, we can guarantee no wonkiness from oddly timed
 * saving. However, this is an extremely inelegant and volatile 
 * solution that's difficult to work with. I want something better,
 * but I don't know how. 
 */
function getNewCharacter() {
    getDndName();
}

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
    $("#save-char").attr("class", "hide");

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
            getClass();
        });
    }
    else {
        console.log("Names found in localstorage; drawing from there");

        characterNames = JSON.parse(localStorage.getItem("names"));
        charName.textContent = "Your character is " 
        + characterNames[Math.floor(Math.random() * characterNames.length)];
        console.log("getDndName complete");
        getClass();
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
        getRace();
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
        getAlignment();
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
        changeImg();
        $("#save-char").attr("class", "");
    });
}

/**
 * Called at the beginning of every app run to set the 
 * savedChars[] array and set the dropDownMenu[] array
 * to match
 */
function setFromStorage() {
    savedChars = JSON.parse(localStorage.getItem("savedChars"));

    if (savedChars) {
        for (var i = 0; i < savedChars.length; i++) {
            var optionEl = document.createElement("option");
            optionEl.textContent = savedChars[i].name;
            optionEl.value = savedChars[i].name;
            $("#saved-chars").append(optionEl);
        }
    }
    else {
        //this done to make sure savedChars is read as
        //an array later, as failing to do so may
        //cause an infinite loop and those are bad
        savedChars = []; 
    }
}

/**
 * Saves a character as an object in the savedChars[] array,
 * and updates localstorage with the new object and updates
 * dropDownOptions (the dropdown menu array) with the new name 
 */
function saveChar() {
    console.log("saveChar activated");

    if (savedChars) {
        //adds a character, as the save limit has not been reached
        if (savedChars.length < charSaveLimit) {
            savedChars.push(
                {
                    name: $("#character-name").text().replace("Your character is ", ""),
                    class: $("#char-class").text(),
                    race: $("#char-race").text(),
                    alignment: $("#char-align").text()
                }
            );
        }
        //overwrites a character, as the save limit has been reached
        else {
            for (var i = 0; i < savedChars.length - 1; i++) {
                savedChars[i] = savedChars[i+1];
            }
            savedChars[savedChars.length - 1] = {
                name: $("#character-name").text().replace("Your character is ", ""),
                class: $("#char-class").text(),
                race: $("#char-race").text(),
                alignment: $("#char-align").text()
            };
        }
        
        updateStorage();
        updateDropDown();
    }
    else { //this bug is program breaking, so will send an alert rather than a console log
        alert("savedChars array unreadable");
    }
}

/**
 * Updates localstorage with the current list of saved characters
 */
function updateStorage() {
    localStorage.setItem("savedChars", JSON.stringify(savedChars));
}

/**
 * Updates the dropdown menu containing the names of the saved characters.
 */
function updateDropDown() {
    //appends a new option to the dropdown menu if its length isn't as big as 
    //the number of saved characters, because this means a new character
    //has been added to the list of saved ones
    if (dropDownOptions.length < savedChars.length) { 
        var optionEl = document.createElement("option");
        optionEl.textContent = savedChars[dropDownOptions.length].name;
        optionEl.value = savedChars[dropDownOptions.length].name;
        $("#saved-chars").append(optionEl);
        dropDownOptions = document.querySelector("#saved-chars").children;
    }
    //renames the options on the dropdown menu if they match saveChars's current
    //length, as that means a saved character was overwritten with a new one,
    //rather than a new one being added
    else {
        for (var i = 0; i < dropDownOptions.length - 1; i++) {
            dropDownOptions[i].value = dropDownOptions[i+1].value;
            dropDownOptions[i].textContent = dropDownOptions[i+1].textContent;
        }
        dropDownOptions[dropDownOptions.length - 1].textContent = savedChars[savedChars.length - 1].name;
        dropDownOptions[dropDownOptions.length - 1].value = savedChars[savedChars.length - 1].name;
    }
}

/**
 * Will find a saved character in localstorage and display it
 */
function getSavedChar() {
    console.log("getSavedChar activated");

    for (var i = 0; i < savedChars.length; i++) {
        if ($("#saved-chars option:selected").val() == savedChars[i].name) {
            var char = savedChars[i];

            $("#character-name").text("Your character is " + char.name);
            $("#char-class").text(char.class);
            $("#char-race").text(char.race);
            $("#char-align").text(char.alignment);
            changeImg();
        }
    }
}

setFromStorage(); //needs to run every time program begins

genBtn.addEventListener("click", function() {
    getNewCharacter();
});
$("#get-saved-char").click(getSavedChar);
$("#save-char").click(function() {
    saveChar();
});
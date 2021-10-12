var genBtn = document.querySelector("#generate");
var characterSheet = document.querySelector("#new-character");
var charName = document.querySelector("#character-name");
var charSaveLimit = 3; //this will determine how many characters can be saved at once
var savedChars = [];
var dropDownOptions = document.querySelector("#saved-chars").children;

/**
 * Creates a new character. Avoids pesky async problems by... just
 * being async. 
 */
async function getNewCharacter() {
    var requests = [];

    //API calls for race, class, and alignment are put into an array
    //note that API calls at this point will still be in the form
    //of a Promise and will therefore not have the information yet
    requests.push(getTrait("races"));
    requests.push(getTrait("classes"));
    requests.push(getTrait("alignments"));

    //checks to see if localstorage has names, calls either the API
    //call function or the setNameFromLocal function
    if (localStorage.getItem("names")) {
        setNameFromLocal();
    }
    else {
        requests.push(getNameFromApi());
    }

    //this Promise.all() function uses the await keyword to
    //take the promises and WAIT until they have all been
    //resolved into proper, usable information, and then
    //sticks them into a new array
    var resolves = await Promise.all(requests).catch(console.error);
    setTrait("#char-race", resolves[0]);
    setTrait("#char-class", resolves[1]);
    setTrait("#char-align", resolves[2]);
    if (!localStorage.getItem("names")) {
        setNameFromApi(resolves[3]);
    }

    //we can now safely call changeImg() 
    //as the class information will surely be there
    changeImg();
}

/**
 * Sets the character's name from the localstorage
 */
function setNameFromLocal() {
    console.log("Names found in localstorage; drawing from there");

    characterNames = JSON.parse(localStorage.getItem("names"));
    charName.textContent = "Your character is " 
        + characterNames[Math.floor(Math.random() * characterNames.length)];
    console.log("setNameFromLocal() complete");
}

/**
 * Returns a promise that will eventually contain a long
 * list of names
 */
function getNameFromApi() {
    console.log("Names not found in localstorage; calling database");
    var apiUrl = "https://api.fungenerators.com/name/generate?category=shakespearean&limit=500&variation=any";
    
    return new Promise(function(resolve, reject) {
        fetch(apiUrl)
        .then(function(response) {
            return resolve(response.json())
        })
        .catch(reject);
    });
}

/**
 * Receives a resolve promise containing an array of names,
 * and then randomly picks one for the character, and THEN
 * sends that list to localstorage to minimize database calls 
 */
function setNameFromApi(resolves) {
    var characterNames;

    characterNames = resolves.contents.names;
    charName.textContent = "Your character is " 
    + characterNames[Math.floor(Math.random() * characterNames.length)];

    localStorage.setItem("names", JSON.stringify(characterNames));
}

// Concatenizes the "src" with the randomly generated class
function changeImg() {
    var characterClass = document.getElementById("char-class").innerText

    if (characterClass == "Barbarian" || characterClass == "Fighter" || characterClass == "Rogue" || characterClass == "Paladin"){
        document.getElementById("character-img").src = "assets/images/" + document.getElementById("char-race").innerText + "/sword.jpg"
    }

    else if (characterClass == "Sorcerer" || characterClass == "Druid" || characterClass == "Wizard" || characterClass == "Warlock" || characterClass == "Cleric" || characterClass == "Monk") {
        document.getElementById("character-img").src = "assets/images/" + document.getElementById("char-race").innerText + "/staff.jpg"
    }

    else if (characterClass == "Ranger") {
        document.getElementById("character-img").src = "assets/images/" + document.getElementById("char-race").innerText + "/ranger.jpg"
    }

    else{
        document.getElementById("character-img").src = "assets/images/" + document.getElementById("char-race").innerText + "/bard.jpg"
    }
};

/**
 * Returns a PROMISE for a trait that must be passed in
 * via argument. Note that a Promise is not yet usable
 * information and will need to be Resolved before it
 * can be used (see getNewCharacter() for an example)
 */
 var getTrait = function(trait) {
    var apiUrl = "https://www.dnd5eapi.co/api/" + trait; //<- trait must be in plural form
    return new Promise(function(resolve, reject) {
        fetch(apiUrl)
        .then(function(response) {
            return resolve(response.json())
        })
        .catch(reject);
    });
}

/**
 * Receives an ID for the text object we want to change,
 * and a resolved promise that tells us what to change the
 * ID'd object into
 * 
 * traitQueryString example: "#char-race"
 */
function setTrait(traitQueryString, promiseResolved) {
    var traitName = (promiseResolved.results[Math.floor(Math.random() * promiseResolved.results.length)].name);
    $(traitQueryString).text(traitName);
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

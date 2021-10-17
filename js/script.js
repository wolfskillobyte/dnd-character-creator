var genBtn = document.querySelector("#generate");
var characterSheet = document.querySelector("#new-character");
var charName = document.querySelector("#character-name");
var charSaveLimit = 3; //this will determine how many characters can be saved at once
var savedChars = [];
var dropDownOptions = document.querySelector("#saved-chars").children;

var charID = 0;
var subCards = document.getElementById("sub-cards")

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
    var characterRace = document.getElementById("char-race").innerText.toLowerCase()

    if (characterClass == "Barbarian" || characterClass == "Fighter" || characterClass == "Paladin"){
        document.getElementById("character-img").src = "assets/images/" + characterRace + "/sword.jpg"
    }
    
    else if (characterClass == "Sorcerer" || characterClass == "Druid" || characterClass == "Wizard") {
        document.getElementById("character-img").src = "assets/images/" + characterRace + "/staff.jpg"
    }

    else if (characterClass == "Monk") {
        document.getElementById("character-img").src = "assets/images/" + characterRace + "/monk.jpg"
    }

    else if (characterClass == "Rogue") {
        document.getElementById("character-img").src = "assets/images/" + characterRace + "/rogue.jpg"
    }

    else if (characterClass == "Warlock") {
        document.getElementById("character-img").src = "assets/images/" + characterRace + "/warlock.jpg"
    }

    else if (characterClass == "Cleric") {
        document.getElementById("character-img").src = "assets/images/" + characterRace + "/cleric.jpg"
    }

    else if (characterClass == "Ranger") {
        document.getElementById("character-img").src = "assets/images/" + characterRace + "/ranger.jpg"
    }

    else{
        document.getElementById("character-img").src = "assets/images/" + characterRace + "/bard.jpg"
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
    charID = JSON.parse(localStorage.getItem("charID"));

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
    if (!charID) {
        charID = 0;
    }
}

/**
 * Saves a character as an object in the savedChars[] array,
 * and updates localstorage with the new object and updates
 * the dropdown menu with the new name 
 */
function saveChar() {
    console.log("saveChar activated");
    var character = {
        name: $("#character-name").text().replace("Your character is ", ""),
        class: $("#char-class").text(),
        race: $("#char-race").text(),
        alignment: $("#char-align").text(),
        id: charID
    }
    if ($("#char-class").text() != "" && savedChars) {
        if (!saveDupeCheck()) {
            //adds a character, as the save limit has not been reached
            if (savedChars.length < charSaveLimit) {
                savedChars.push(character);
                updateStorage();
                updateDropDown();
                alert("Your character has been saved!");
            }
            //overwrites a character, as the save limit has been reached
            else {
                displayOverwriteMenu();
            }
        }
        else {
            UIkit.notification({
                message: 'This character is already saved',
                pos: 'top-center',
                timeout: 5000
            });
        }
    }
    else { //will also occur if savedChars is somehow not instantiated to an array, which probably won't happen
        UIkit.notification({
            message: 'There is no character to save!',
            pos: 'top-center',
            timeout: 5000
        });
    }
}

/**
 * 
 */
function displayOverwriteMenu() {
    $("#save-buttons").html("");
    $("#char-save-select").attr("class", ""); //removes the .hide class to display the menu

    for (var i = 0; i < savedChars.length; i++) {
        var charBtn = document.createElement("button");
        charBtn.textContent = savedChars[i].name;
        charBtn.className = "char-save-select-button";
        $("#save-buttons").append(charBtn);
    }
    var charBtn = document.createElement("button");
        charBtn.textContent = "Cancel";
        charBtn.className = "char-save-select-button";
        $("#save-buttons").append(charBtn);
}

/**
 * Can only be used when displayOverwriteMenu() has been activated,
 * which will make buttons that activate this function appear onscreen.
 * It overwrites a character by searching the savedChars[] array via name,
 * and does nothing if the name is "Cancel," which will be the case if
 * the user hits the Cancel button
 */
function overwriteCharacter(charName) {
    $("#char-save-select").attr("class", "hide");
    if (charName === "Cancel") {
        return;
    }
    for (var i = 0; i < savedChars.length; i++) {
        if (savedChars[i].name == charName) {
            savedChars[i] = {
                name: $("#character-name").text().replace("Your character is ", ""),
                class: $("#char-class").text(),
                race: $("#char-race").text(),
                alignment: $("#char-align").text(),
                id: charID
            }
            break;
        }
    }
    updateStorage();
    updateDropDown();
    UIkit.notification({
        message: 'Character successfully overwritten!',
        pos: 'top-center',
        timeout: 5000
    });
}

/**
 * Returns TRUE if there IS a duplicate character
 * in one of the saved character slots, and FALSE
 * if there isn't
 */
function saveDupeCheck() {
    for (var i = 0; i < savedChars.length; i++) {
        if (savedChars[i].name == $("#character-name").text().replace("Your character is ", "")
        && savedChars[i].class == $("#char-class").text()
        && savedChars[i].race == $("#char-race").text()
        && savedChars[i].alignment == $("#char-align").text()) {
            return true;
        }
    }
    return false;
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
    $("#saved-chars").html("");
    for (var i = 0; i < savedChars.length; i++) {
        var optionEl = document.createElement("option");
        optionEl.textContent = savedChars[i].name;
        optionEl.value = savedChars[i].name;
        $("#saved-chars").append(optionEl);
    }
}

/**
 * Will find a saved character in savedChars[] and display it
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

// toggle dropdown menu to load character
function toggleDropdown() {
    var loadDropdown = document.getElementById("load-character")
    if (loadDropdown.style.display !== "none") {
        loadDropdown.style.display = "none";
    } else {
        loadDropdown.style.display = "block";
    }
}

setFromStorage(); //needs to run every time program begins

genBtn.addEventListener("click", function() {
    getNewCharacter();
    $("#sub-cards").removeClass("hide")
});

$("#get-saved-char").click(getSavedChar);
$("#save-char").click(function() {
    saveChar();
});
$("#save-buttons").on("click", ".char-save-select-button", function() {
    overwriteCharacter(this.textContent);
});

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


// names array in case something goes wrong
// var names = [Cicero Coriolanus,George Montague,Marcellus Gobbo,Tamora Fitzwalter,Vernon Cimber,Adriano La Pucelle,Silvius Quince,Philemon Cimber,Bassanio Percy,Cymbeline Denny,Hortensio Williams,Demetrius Ligarius,Octavius Cromwell,Laurence Andronicus,Dromio Ferdinand,Pisanio Gobbo,Menelaus Guildford,Gremio Herbert,Abram Glendower,Voltimand Herbert,Feste Wolsey,Nestor Faulconbridge,Benvolio Ferdinand,Tybalt Rivers,Dumaine Lepidus,Balthazar Gunner,Escanes Capulet,Virgilia Court,Lychorida Brook,Emilia Bullen,Fleance Catling,Saturninus Macduff,Othello Soundpost,Rosencrantz Lena,Proculeius Rivers,Messala Starveling,Emilia Iden,Agamemnon Williams,Anne Page Tyrrell,Antenor Agrippa,Frederick Horner,Timon Iden,Berri Nightwork,Camillo Macbeth,Helenus Stafford,Bassanio Percy,Solanio Montague,Cordelia Montgomery,Barnardo Cade,Rosencrantz Denny,Frederick LeBeau,Philostrate Rugby,Grumio Coleville,Decius Campeius,Eros Campeius,Cato Bullen,Cleopatra Velutus,Edward Horner,Thomas Flute,Costard Martext,Rambures Bona,Antonio Page,Aruiragus Hastings,Thaliard Agrippa,Antipholus Fitzwalter,Titania Campeius,Simonides Guildford,Achilles Gurney,Grumio Carlisle,Philip Ratcliffe,Alice Lartius,Alonso Cassius,Corin Antony,Luciana Macbeth,Clachas Quince,Bassanio Macbeth,Gratiano Cimber,Abram Catling,Grumio Tearsheet,Lucius Cimber,Diana Scroop,Junius Sly,Peter Vaughan,Ophelia Bardolph,Luce Soundpost,Lysimachus Seacoal,Leonato Urswick,Timandra Ferdinand,Junius Urswick,Polixenes Ferdinand,Cleon Mowbray,Davy Pompeius,Dumaine Aufidius,Oliver Stafford,Duncan Seacoal,Morgan Nightwork,Biondello Blunt,Menas Soundpost,Hugh Topas,Bassett Pandulph,Falstaff Abergavenny,Menas Gurney,Ceres Cromwell,Osric Bona,Justice Stanley,Katharina Saye,Francisca Vaux,Anne Page Rebeck,Audrey Velutus,Claudius Cromwell,Fleance Saye,Borachio Seacoal,Thurio Rugby,Rambures Lena,Caius Lucius,Charles Scroop,Alonso Lucius,Phrynia Macduff,Tybalt Ratcliffe,Phrynia Williams,Hector Cade,Regan Flute,Viola Brutus,Jupiter Percy,Francis Leonantus,Bartholomew Cimber,Helen Stafford,Mardian Bigot,Douglas Gunner,Helenus Horner,Ross Carlisle,Iachima Erpingham,Lavinia Bourchier,Proculeius Ratcliffe,Hector Flute,Olivier Gough,Jamy Lucy,Bianca Falstaff,Balthazar Starveling,Feste Ratcliffe,Guiderius Stanley,Lodovico Ligarius,Philo Vaux,Usher Erpingham,Alcibiades Glendower,Hortensio Mowbray,Simonides Mortimer,Seyton Minola,Hermia Bardolph,George Erpinham,Innogen Macduff,Antiochus Catling,Cupid Stafford,Cato Sandys,Adrian Lovell,Court Horner,Patience Montague,Polixenes Antony,Camillo Lovell,Dumaine Lucy,Lorenzo Grey,Strato Iden,Achilles Glendower,Hortensius Mowbray,Cato Iden,Benedick Herbert,Cranmer Topas,Tranio Ratcliffe,Chatillon DeBoys,Montano Topas,Trinculo Cassio,Siward Lartius,Michael Velutus,Luciana Catling,Hubert Bona,Brandon Belch,Portia Mortimer,Virgilia Urswick,Alexas Falstaff,Dorcas Erpinham,Morgan Rugby,Peter Rebeck,Lavinia Guildford,Proteus Cranmer,Escalus Whitmore,Cleon Pandulph,Benedick Cromwell,Sebastian LeFer,Curio Ford,Elizabeth Catling,Bona Grey,Antenor Fastolfe,Hymen Gough,Caliban Lena,Emmanuel Nightwork,Melun Leonantus,Alonso Aguecheek,Verges Gunner,Polixenes Minola,Durdanius Rivers,Brandon Ligarius,Panthino Snout,Ceres Tearsheet,Hermia Talbot,Griffith Montague,Lincoln Gurney,Bianca Macbeth,Strato Hastings,Lychorida Evans,Othello Bourchier,Helenus Bigot,Cleopatra Court,Rambures Campeius,Julius Lepidus,Titus Andronicus,Adam Iden,Aliena Montgomery,Innogen Vernon,Melun Coriolanus,Calphurnia Cimber,Davy Mowbray,Aragon Tyrrell,Antigonus Fitzwalter,Morgan Brook,Diomedes Grey,Aeneas Leonantus,Volumnia Cimber,Hermia Quince,Seleucus Falstaff,Antiochus Vaughan,Alexander Gough,Helenus Abergavenny,Brandon La Pucelle,Patience Cranmer,Davy Mortimer,Chatillon Stafford,Aruiragus Brook,Desdemona Coleville,Aragon Bourchier,Beatrice Cade,Cressida Mowbray,Antonio Cranmer,Agamemnon Denny,Cloten Faulconbridge,Davy Vaux,Margery Herbert,Violenta Sandys,Olivia Pandulph,Robin Herbert,Cleopatra Vernon,Fluellen Cranmer,Arthur Mortimer,Andrew Gunner,Timon Cimber,Viola Lucy,Calpurnia Gobbo,Ariel Northumberland,Lodovico Carlisle,Hermione Fitzwalter,Bassanio Tearsheet,Polixenes Grey,Thaisa LeBeau,Cloten LeBeau,Caphis Denny,Panthino Antony,Beatrice Vaux,Robert Williams,Seyton Lartius,Pucelle Percy,Rosencrantz Court,Launcelot Slender,Abram Fitzwalter,Angus Starveling,Percy Berkeley,Escanes Erpinham,Amiens Cimber,Shallow Herbert,Lucetta Ferdinand,Toby Bardolph,Juliet Evans,Malcolm Stanley,Orlando Whitmore,Stephano Cranmer,Caithness Saye,Achilles Sandys,Oberon Bottom,Adrian Court,Malvolio Seacoal,Abraham Saye,John Vernon,Edmund Aguecheek,Apemantus Rebeck,Cupid Guildford,Achilles Topas,Curtis Bates,Mercutio Bardolph,Montano Cassio,Ophelia Cassio,Egeon Iden,Dumaine Vaughan,Jessica Ford,Pucelle Abergavenny,Ophelia Lucius,Cesario Aguecheek,Usher Gurney,Cromwell Minola,Maria Keepdown,Abraham Northumberland,Thomas Cassius,Gregory Berkeley,Barnardine Iden,Claudio Evans,Othello Gower,Marcade Lartius,Bates Keepdown,Cromwell Brutus,Francisco Gower,Phebe LeBeau,Tamora Keepdown,Escanes Leonantus,Nell Talbot,Helenus Lena,Antigonus LeFer,Trinculo Catling,Decius Mowbray,Bartholomew DeArmado,Thurio Lena,Simonides Agrippa,Morgan Mowbray,Audrey Gurney,Duncan Coriolanus,Andromache Talbot,Escalus Ferdinand,Froth Cranmer,Proculeius Ferdinand,Adrian Denny,Bartholomew Oatcake,Rosaline Page,Mercutio Gough,Olivier Cimber,Morton Whitmore,Egeon Lovell,Davy Lucius,Alice Coriolanus,Desdemona Percy,Junius Glendower,Iago Lena,Lucius Agrippa,Antiochus Erpinham,Autolucus Catling,Aegeon Cassius,Mercutio Brutus,Polixenes Bottom,Siward Oatcake,Helicanus Scroop,Mardian Coriolanus,Tybalt Scroop,Proteus Stanley,Oliver Page,Simonides Gower,Cordelia Erpingham,Charles Iden,Tamora Sly,Constance Mortimer,John Horner,Guiderius Sandys,Luciana Leonantus,Trinculo Slender,Aruiragus Soundpost,Arthur Montgomery,Floritzel Hastings,Theseus Mortimer,Marina Minola,Banquo Evans,Cupid Hastings,Seleucus Hastings,Olivia Iden,Alarbus Court,Ursula Lovell,Phoebe Falstaff,Leonato Tearsheet,Robin Erpinham,Nathaniel Lucius,Cato Lucius,Verges Macduff,Ferdinand Erpingham,Lucio Mortimer,Ursula Snout,Apemantus Brook,Launcelot Cade,Davy LeFer,Thomas Gower,Longaville Aufidius,Capulet Capulet,Aruiragus Faulconbridge,Morton Hastings,Thaisa Soundpost,Cymbeline Glendower,Maria Vernon,Lysander Carlisle,Douglas Williams,Philostrate Gurney,Isabel Poins,Derby DeArmado,Ford Iden,Claudio Bourchier,Osric Leonantus,Ophelia Abergavenny,Dromio Guildford,Virgilia Macduff,Court DeBoys,Thidias Starveling,Demetrius Gough,Alarbus Fastolfe,Morton Catling,Cato Horner,Adam Tearsheet,Caliban Court,Adrian Gunner,Philotus Agrippa,Cassio Antony,Bassanius Cassio,Robert Lepidus,Thaliard Lena,Voltimand Snout,Horatio Fitzwalter,Andrew Bourchier,Valentine Blunt,Charmian Talbot,Messala Topas,Dromio Flute,Iachima Capulet,Abram Coleville,Egeon Urswick,Lysimachus Page,Cleon Sandys,Jupiter Court,Iago Ford,Angus Lucy,Hortensius Cromwell,Mamillius Cromwell,Banquo Tearsheet,Cranmer Ford,Durdanius Williams,Flavius Oatcake,Perdita Velutus,Calpurnia LeBeau,Flavius Ford,Escanes Lucy,Polonius Lepidus,Amiens Guildford,Hymen Agrippa,Caesar Ferdinand,Silvia Stafford,Robin Stanley,Olivia Bardolph,Margaret Lovell,Joseph Blunt,Margaret Urswick,Ulysses Rugby,Sempronius Iden,Francisco Rivers,Jaques Pompeius,John Whitmore,Shallow Gurney,Philemon Rugby,Stephano Pandulph,Anne Page Berkeley,Pindarus Stafford,Archidamus Iden,Jaquenetta Montgomery,Cordelia Thump,Virgilia Quince,Donalbain Bardolph,Amiens La Pucelle,Fluellen Cimber,Shylock Gunner,Luce Evans,Laertes Aguecheek,Phoebe Thump,Ariel Seacoal,Calphurnia Sandys,Margery Vaughan,Agamemnon Scroop,Arthur Topas,Philemon Ford,Brabantio Lepidus,Dion Montgomery,Charmian Vaux,Polonius Vaughan,Voltimand Pompeius,Philemon Grey,Lennox Glendower,Joseph Erpingham,Autolucus Campeius,Ajax Gough,Julia Rugby,Antenor Court,Caithness Velutus,Moth Leonantus]
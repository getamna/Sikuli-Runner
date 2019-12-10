/*
REQUIRE: image compare library

CLI -> --ide (opens the sikuli IDE),  --config
*/

const fs = require('fs');
const PNG = require('pngjs').PNG;
const pixelmatch = require('pixelmatch');
const mvdir = require('mvdir');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;


const { spawnSync, execSync } = require('child_process');
let { createDirectoryIfNotExists, writeObjectToFileIfNotExists, doesFileExist } = require('./utils')

let startHTML = fs.readFileSync("input.html").toString();
const domDocument = new JSDOM(startHTML, window.document);
domDocument.append(generateHTMLHeader("Test"));
domDocument.append(generateHTMLTable("Browser"));
domDocument.getElementById("Browser-table").appendChild(generateHTMLTableRow(testDirectoryList));

let inputHTML = dom.serialize();

console.log(inputHTML);
return;
let opts = require('opts');


let options = [
    {
        short: 'c',
        long: 'config',
        description: 'the path to the sikuli config file with order of the tests to run',
        value: true, // default false
        required: false, // default false
    }, // ... followed by more options
    {
        short: 'd',
        long: 'directory',
        description: 'path to the sikuli definitions',
        value: true, // default false
        required: false, // default false
    }, // ... followed by more options
    {
        short: 'i',
        long: 'init',
        description: 'create a folder with an empty config and sikuli screenshot',
        value: true, // default false
        required: false, // default false
    }, // ... followed by more options
    {
        short: 'b',
        long: 'baseline',
        description: 'directs all of the outputs to an expected baseline folder',
        value: false, // default false
        required: false, // default false
    }, // ... followed by more options
];



opts.parse(options, true);

let initLocation = opts.get('init');
if (initLocation) {
    createDirectoryAndAddFiles(initLocation);
    console.log("Created a folder and supporting tests for Sikuli Runner")
    return;
}

async function createDirectoryAndAddFiles(initLocation) {

    createDirectoryIfNotExists(initLocation)

    let screenShotFolder = initLocation + "//screenshot.sikuli";
    createDirectoryIfNotExists(screenShotFolder)

    let configFilePath = initLocation + "//sikuli.json";
    writeObjectToFileIfNotExists(configFilePath, []);

    await mvdir('./screenshot.sikuli', screenShotFolder, { copy: true });

    return;
}

// Check if Java exists on the machine - or throw an error!
let checkJavaCommand = spawnSync('java', ['-version']);

if (checkJavaCommand.status == (null || undefined)) {
    console.log("Verify that Java is installed you are able to reach it from your local command line. Exiting.")
    return;
}

let providedTestsDirectory = opts.get('directory');
let testsDirectory = providedTestsDirectory || "./";


let testDirectoryList = fs.readdirSync(testsDirectory);

if (testDirectoryList.indexOf("screenshot.sikuli") == -1) {
    console.log("Please initialize a Sikuli Instance here. Must have screenshot.sikuli")
    return;
}

// Get all of the Sikuli Folders in a specified directory and add to array []
let listOfTestsToRun = testDirectoryList.filter(item => (item.includes(".sikuli") && item != "screenshot.sikuli"))

console.log(listOfTestsToRun);

let configLocation = opts.get('config');
let runnerConfig = [];
if (configLocation) {
    let fileData = fs.readFileSync(configLocation);
    runnerConfig = JSON.parse(fileData.toString());
}
console.log(listOfTestsToRun);
let orderedListOfTestsToRun = [];

// As per the config file - reorder the array to reflect the right index order (Swap)
for (let key of runnerConfig) {

    let doesTestExist = listOfTestsToRun.indexOf(key.name + ".sikuli");
    if (doesTestExist != -1) {
        orderedListOfTestsToRun.push(key);
        listOfTestsToRun.splice(doesTestExist, 1);
    }
}

for (let remaining of listOfTestsToRun) {
    orderedListOfTestsToRun.push({
        name: remaining.split(".sikuli")[0]
    })
}


console.log(orderedListOfTestsToRun);

let currentExecutingIndex = 1;
// Create an output directory called "Outputs/{Sikuli Testpassname}"
for (let directory of orderedListOfTestsToRun) {
    console.log(`Now running ${currentExecutingIndex} of ${orderedListOfTestsToRun.length} Sikuli tests`);

    //create 
    createDirectoryIfNotExists(testsDirectory + "/output");
    createDirectoryIfNotExists(testsDirectory + "/output/" + directory.name);


    // update screenshot.py to reflect the output directory [OK]

    try {
        let runSikuliFromCMD = execSync(`java -jar sikulix-2.0.1.jar -r ${testsDirectory}/${directory.name}.sikuli  -c`);
        console.log(runSikuliFromCMD.toString());
    } catch (err) {
        console.log("Sikuli Execution failed for testpass:  " + directory.name)
        console.log(" ");
        console.log("\t" + err.stdout.toString());
    }

    //if these images for the baseline
    if (opts.get('baseline')) {
        //use mvdir copy to a new directory called baseline...
        createDirectoryIfNotExists("expected");
        mvdir(testsDirectory + "/output", testsDirectory + "/expected", { copy: true });
    }


    //Check if an expected output lists exist
    if (!fs.existsSync(testsDirectory + "/output/" + directory.name)) {
        console.log(`SKIPPING TEST PASS ${directory.name}: An expected output does not exist for this testpass. Will Skip`)
    }

    // For each Testpass output -> check if an expected output folder exists with images
    if (fs.existsSync(testsDirectory + "/output/" + directory.name)) {
        //let generatedHeader = generateHTMLHeader(directory.name);
        domDocument.append(generateHTMLHeader);

        //iterate through all of the output images

        //if exists -> run the img compare algo and use the config tolerance value or 100

        // Append HTML Table Rows Page that Displays Each Testpass Image Outputs with the Match Score


        //Add to Global Results Object
    }



    currentExecutingIndex++;
}






//TO-DO: Add Pass Rate
function generateHTMLHeader(testpass) {
    let header = `<div>
    <h3>${testpass}</h3>
  </div>`
    return header;
}

function generateHTMLTable(testpass) {

    let htmlTable = `<div style="display:flex;justify-content: center;">
<table height="100%" border="1" id="${testpass}-table">
  <tr>
    <td>
      <p class="data-cell"><b>Testcase</b></p>
    </td>

    <td>
      <p class="data-cell"><b>Expected</b></p>
    </td>

    <td>
      <p class="data-cell"><b>Output</b></p>
    </td>
    <td>
      <p class="data-cell"><b>% Match</b></p>
    </td>
  </tr>
  </table>
  `

    return htmlTable;
}

//TO-DO: Add Pass Rate
function generateHTMLTableRow(testsDirectory, testpassName) {

    let tableRow =
        `<tr>
    <td>
      <p class="data-cell">${testpassName}</p>
    </td>

    <td>
      <div class="table-image">
        <img
          class="mask-image"
          src="${testsDirectory}+"/expected/"+${testpassName}"
          style="width:550px;height:310px;"
          alt="description here"
        />
      </div>
    </td>
    <td>
      <div class="table-image">
        <img
          class="mask-image"
          src="${testsDirectory}+"/output/"+${testpassName}"
          style="width:550px;height:310px;"
          alt="description here"
        />
      </div>
    </td>

    <td>
      <p class="data-cell">90%</p>
    </td>
  </tr>`

    return tableRow;
}


// npm run test: "sikulijs sikuli-tests <--ide> <--config> --output" 

/*
{
    "setup":
        input.png - 90% - PASS
        init.png - 60% - FAIL

    "hard":
        input.png - 90% - PASS
        init.png - 60% - FAIL
}
*/


// how do you know how things fare in a dynamic environment where the time between loads can vary? Such as streaming.
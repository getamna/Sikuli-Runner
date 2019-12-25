#!/usr/bin/env node

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
const alert = require('alert-node')

const { spawnSync, execSync } = require('child_process');
let { createDirectoryIfNotExists, writeObjectToFileIfNotExists, readDirSortedByTime } = require('./utils')
console.log(createDirectoryAndAddFiles);
let startHTML = fs.readFileSync(__dirname + "/input.html").toString();
const dom = new JSDOM(startHTML)
let domDocument = dom.window.document;
let opts = require('opts');
let globalResults = []


let options = [
  {
    short: 's',
    long: 'sikuli',
    description: 'path to the sikulix jar',
    value: true,
    required: false,
  },
  {
    short: 'c',
    long: 'config',
    description: 'the path to the sikuli config file with order of the tests to run',
    value: true, // default false
    required: false, // default false
  },
  {
    short: 'd',
    long: 'directory',
    description: 'path to the sikuli definitions',
    value: true, // default false
    required: false, // default false
  },
  {
    short: 'i',
    long: 'init',
    description: 'create a folder with an empty config and sikuli screenshot',
    value: true, // default false
    required: false, // default false
  },
  {
    short: 'b',
    long: 'baseline',
    description: 'directs all of the outputs to an expected baseline folder',
    value: false, // default false
    required: false, // default false
  },
  {
    short: 'o',
    long: 'output',
    description: 'recalculates image comparison values without rerunning the testpasses',
    value: false, // default false
    required: false, // default false
  }
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

  await mvdir(__dirname + '/screenshot.sikuli', screenShotFolder, { copy: true });

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
  console.log("Directory does not have screenshot.sikuli. Try the --init command to make a directory")
  return;
}


//if these images for the baseline
if (!opts.get('baseline') && !fs.existsSync(testsDirectory + "/expected/")) {
  console.log('There are no baseline screenshots for this test run. Please rerun with --baseline option enabled');
  return;
}


// Get all of the Sikuli Folders in a specified directory and add to array []
let listOfTestsToRun = testDirectoryList.filter(item => (item.includes(".sikuli") && item != "screenshot.sikuli"))

if (listOfTestsToRun.length == 0) {
  console.log("Did not find any Sikuli Tests to run. Have you read the docs")
}

let configLocation = providedTestsDirectory + "/sikuli.json"
let runnerConfig = {};
if (configLocation) {
  if (fs.existsSync(configLocation)) {
    //file exists
    let fileData = fs.readFileSync(configLocation);
    runnerConfig = JSON.parse(fileData.toString());
  }
}

console.log(`Found ${listOfTestsToRun.length} to run`);
let orderedListOfTestsToRun = [];


// As per the config file - reorder the array to reflect the right index order (Swap)
for (let key of (runnerConfig.tests || [])) {

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


console.log(`Will run them in this order: ${JSON.stringify(orderedListOfTestsToRun)}`);

let currentExecutingIndex = 1;
// Create an output directory called "Outputs/{Sikuli Testpassname}"
for (let directory of orderedListOfTestsToRun) {


  //create 
  createDirectoryIfNotExists(testsDirectory + "/output");
  createDirectoryIfNotExists(testsDirectory + "/output/" + directory.name);


  // update screenshot.py to reflect the output directory [OK]

  //if these images for the baseline
  if (!opts.get('output')) {
    try {
      console.log(`Now running ${currentExecutingIndex} of ${orderedListOfTestsToRun.length} Sikuli tests`);

      //Check Sikuli Source Directory Here
      let sikuliPath = opts.get('sikuli');
      if (!sikuliPath) {
        console.log("No path to the Sikuli jar was given - cannot run test passes. Please pass in a path to sikuli jar using the -s option. Exiting.")
        return;
      }

      let runSikuliFromCMD = execSync(`java -jar ${sikuliPath} -r ${testsDirectory}/${directory.name}.sikuli  -c`);
      console.log(runSikuliFromCMD.toString());
    } catch (err) {
      console.log("Sikuli Execution failed for testpass:  " + directory.name)
      console.log(" ");
      console.log("\t" + err.stdout.toString());
      continue;
    }
  }

  //if these images for the baseline
  if (opts.get('baseline')) {
    console.log("Generating Baseline Screenshots ... \n")
    //use mvdir copy to a new directory called baseline...
    createDirectoryIfNotExists(testsDirectory + "/expected");
    mvdir(testsDirectory + "/output", testsDirectory + "/expected", { copy: true });
    console.log("Baseline images created. Rerun with -o option to perform image comparison")
  } else {

    // For each Testpass output -> check if an expected output folder exists with images
    if (fs.existsSync(testsDirectory + "/output/" + directory.name)) {

      //let generatedHeader = generateHTMLHeader(directory.name);
      domDocument.querySelector("body").insertAdjacentHTML('beforeend', generateHTMLHeader(directory.name, directory.logs));
      domDocument.querySelector("body").insertAdjacentHTML('beforeend', generateHTMLTable(directory.name));

      //iterate through all of the output images
      let outputImageList = readDirSortedByTime(testsDirectory + "/output/" + directory.name);
      outputImageList = outputImageList.filter(item => item.name.includes(".png"));

      /**image {name, time} */
      for (let image of outputImageList) {
        //To-DO: Run any Diagnostic Scripts and capture as logs
        const img1 = PNG.sync.read(fs.readFileSync(image.fullPath));
        const img2 = PNG.sync.read(fs.readFileSync(image.fullPath.replace("output", "expected")));

        createDirectoryIfNotExists(testsDirectory + "/diff/");
        createDirectoryIfNotExists(testsDirectory + "/diff/" + directory.name);

        const { width, height } = img1;

        createDirectoryIfNotExists("expected");
        const diff = new PNG({ width, height });

        let tolerance = 0;
        if ("globals" in runnerConfig) {
          tolerance = runnerConfig.globals.tolerance || tolerance;
        }
        if ("tolerance" in directory) {
          tolerance = directory.tolerance;
        }

        let diffs = pixelmatch(img1.data, img2.data, diff.data, width, height, { threshold: 0.1 });
        let error = Math.round(100 * 100 * diffs / (width * height)) / 100;
        let passed = error >= tolerance ? false : true;

        fs.writeFileSync(testsDirectory + "/diff/" + directory.name + '/' + image.name, PNG.sync.write(diff));


        // Append HTML Table Rows Page that Displays Each Testpass Image Outputs with the Match Score
        domDocument.getElementById(`${directory.name}-table`).insertAdjacentHTML('beforeend', generateHTMLTableRow(directory.name, image.name, { passed, error }));

        //Add to Global Results Object
        globalResults.push({ testpass: directory.name, test: image.name, passed, error });
      }


    }

  }

  currentExecutingIndex++;
}

let outputHTML = dom.serialize();
let outputsLocation = providedTestsDirectory + "/output.html"

fs.writeFileSync(outputsLocation, outputHTML);
console.log(`Wrote a Test Outputs file: ${!providedTestsDirectory.startsWith("/") ? __dirname + "/" : ""}${outputsLocation}`)
alert('All tests completed! Please check the output html.')

console.log(JSON.stringify(globalResults));



function generateHTMLHeader(testpass, logLink) {
  let header = `<div style="display: flex;align-items: center;justify-content: space-between;width: 100px;">
    <h3>${testpass}</h3>
    <p><a href="${logLink}" style="color:white;"> logs </a> </p>
  </div>`
  return header;
}

function generateHTMLTable(testpass) {

  let htmlTable = `<div style="display:flex;">
<table height="100%" border="1" id="${testpass}-table">
  <tr>
    <td>
      <p class="data-cell"><b>Testcase</b></p>
    </td>
    <td>
      <p class="data-cell"><b>Output</b></p>
    </td>
    <td>
      <p class="data-cell"><b>Expected</b></p>
    </td>
    <td>
    <p class="data-cell"><b>Image Diff</b></p>
    </td>
    <td>
      <p class="data-cell"><b>% Error</b></p>
    </td>
  </tr>
  </table>
  `

  return htmlTable;
}

function generateHTMLTableRow(testpassName, fileName, testPassDetails) {
  let testName = fileName.split(".")[0];
  let tableRow =
    `<tr>
    <td>
      <p class="data-cell">${testName}</p>
    </td>
    <td>
    <div class="table-image">
      <img
        class="mask-image"
        src="./output/${testpassName}/${fileName}"
        style="width:550px;height:310px;"
        alt="actual image here"
      />
    </div>
  </td>
    <td>
      <div class="table-image">
        <img
          class="mask-image"
          src="./expected/${testpassName}/${fileName}"
          style="width:550px;height:310px;"
          alt="expected image here"
        />
      </div>
    </td>
   
    <td>
    <div class="table-image">
      <img
        class="mask-image"
        src="./diff/${testpassName}/${fileName}"
        style="width:550px;height:310px;"
        alt="diff image here"
      />
    </div>
  </td>
    <td>
      <p class="data-cell ${testPassDetails.passed ? "" : "text-failed"} ">${testPassDetails.passed ? "Passed" : "Failed"}</p>
      <p class="data-cell">(${testPassDetails.error})</p>
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
# Sikuli-Runner

Visual Test Framework using Sikuli and Node for End to End Testing. Outputs are provided as a formatted HTML that shows your existing output images next to your baseline images.

### Prerequisites

- Make sure all [Sikuli Prequisites](http://sikulix.com/quickstart/) are met (Java, GUI OS, Etc.) 
- Will take over your computer as it performs the actions and tests as defined
- Still a works in progress. Runs locally on your computer


### Usage

##### Save Baseline screenshots

```
node main.js --d ./examples --baseline
```

##### Save Normal Screenshots
```
node main.js --d ./examples 
```

You can change the order in which tests execute by editing the order of tests in `sikuli.json` - which is the configuration. Else tests are executed the way they are read. To write your own tests keep reading.

### Writing Tests

1. Create Sikuli Sripts using the Sikuli IDE. You can clone this repo and open the sikuli jar-file. If it's your first time with Sikuli - use this [tutorial](http://doc.sikuli.org/tutorials/sliders/sliders.html) to get familiar with the language. Make sure to save your scripts in the provided `.sikuli` format

2. In your Sikuli Script add the two lines at the start:

```python
import screenshot
testpassName = "<the name of your testpass>"
```
The screenshot module will be available during runtime

3. Everytime you need to take a screenshot call the `screenshot.save` method with the testpass name and image name

```python
screenshot.save(testpassName,"dragBrowser.png")
```

4. Point Sikuli Runner to the containing directory of your sikuli scripts and run them. You can add a sikuli.json in this directory to modify the execution order

```
node main.js --d ./examples --baseline
node main.js --d ./examples 
```


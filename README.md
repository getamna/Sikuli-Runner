# Sikuli-Runner

Visual Test Framework using Sikuli and Node for End to End Testing. Outputs are provided as a formatted HTML that shows your existing output images next to your baseline images. This is still a works in progress - and image compare needs to added.

Watch the [demo video](https://github.com/rlingineni/Sikuli-Runner/blob/master/sikuli-runner-demo.mov) for help.

Interested in a hosted version? Upvote this [issue](https://github.com/rlingineni/Sikuli-Runner/issues).

### Prerequisites

- Make sure all [Sikuli Prequisites](http://sikulix.com/quickstart/) are met (Java, GUI based OS, Etc.) 
- Will take over your computer as it performs the actions and tests as defined
- Runs locally on your computer. There is a few seconds of delay between running testpasses

### Usage

##### Save Baseline screenshots
Run sikuli-runner against your tests directory

```
node main.js -d "examples" --baseline
```

##### Save Normal Screenshots
```
node main.js -d "examples" 
```

You can change the order in which tests execute by editing the order of tests by having a `sikuli.json` - which defines the order of testpass execution and additional config options. 

Here is an [example](https://github.com/rlingineni/Sikuli-Runner/blob/master/example/sikuli.json). 

To write your own tests keep reading.

### Writing Tests

1. Create Sikuli Sripts using the Sikuli IDE. You can clone this repo and open the sikuli jar-file. If it's your first time with Sikuli - use this [tutorial](http://doc.sikuli.org/tutorials/sliders/sliders.html) to get familiar with it. Make sure to save your scripts in the provided `.sikuli` format


2. Copy the screenshot.sikuli folder to your tests directory that contains all of your .sikuli directories


3. In your Sikuli Script add the two lines at the start:

```python
import screenshot
testpassName = "<the name of your testpass>"
```

4. Everytime you need to take a screenshot call the `screenshot.save` method with the testpass name and image name

```python
screenshot.save(testpassName,"dragRect.png")
```

5. Point Sikuli Runner to the containing directory of your sikuli scripts and run them. You can add a sikuli.json in this directory to modify the execution order

```
node main.js -d "./example" --baseline
node main.js -d ./examples 
```


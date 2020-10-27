# Sikuli-Runner

Visual Test Framework using Sikuli and Node for End to End Testing. Super useful for non-browser related work or full on interaction testing. Outputs are provided as a [formatted HTML](https://htmlpreview.github.io/?https://github.com/rlingineni/Sikuli-Runner/blob/master/example/output.html) table that shows your existing output images next to your baseline images. This is still a works in progress -  image compare needs to added.

You can read about [Sikuli](http://sikulix.com/#home1) here.

Watch the [demo video](https://github.com/rlingineni/Sikuli-Runner/blob/master/sikuli-runner-demo.mov) to see how it in action.

Interested in a hosted version? Upvote this [issue](https://github.com/rlingineni/Sikuli-Runner/issues).

### Things to know

- Make sure all [Sikuli Prequisites](http://sikulix.com/quickstart/) are met (Java, GUI based OS, Etc.) 
- Sikuli will take over your computer as it performs the tests
- Runs locally on your computer. There is a few seconds of delay between running testpasses

### Usage

##### Save Baseline screenshots
Run sikuli-runner against your tests directory

```
sikuli-runner -d "example" --baseline
```

##### Save Normal Screenshots
```
sikuli-runner -d "example" 
```

You can change the order in which tests execute by editing the order of tests by having a `sikuli.json` - which defines the order of testpass execution and additional config options. Here is an [example config](https://github.com/rlingineni/Sikuli-Runner/blob/master/example/sikuli.json). 

To write your own tests keep reading.

### Writing Tests

1. Create Sikuli Sripts using the Sikuli IDE. You can clone this repo and open the sikuli jar-file. If it's your first time with Sikuli - use this [tutorial](http://doc.sikuli.org/tutorials/sliders/sliders.html) to get familiar with it. Make sure to save your scripts in the provided `.sikuli` format


2. Intialize a Sikuli Runner Directory - this will add the screenshot library and empty sikuli.json file
```
sikuli-runner --init "directoryname"
```

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
node main.js -d "example" --baseline
node main.js -d "example"
```

## To-Do
- [X] Add an Image Compare Library to give a certain Match % and say Pass/Fail
- [ ] Ability to run custom javascript scripts during a testpass (e.g. go get the diagnostic logs at that point in time)
- [ ] Create tests for sikuli runner
- [ ] Build a landing page website

![alt text](https://github.com/rlingineni/Sikuli-Runner/blob/master/logo.png)

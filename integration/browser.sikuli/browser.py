import screenshot
testpassName = "browser"

screenshot.save(testpassName,'init.png')
exit();
# Check Canvas Rendering
click("1575357463901.png")

mainBrowser = find("1575357492128.png")
click(mainBrowser)

# Check Browser Element Drag and Drop
dragDrop(mainBrowser,Location(mainBrowser.x + 100, mainBrowser.y + 100)) #drag it around

screenshot.save('init.png')




#[Screenshot Here as Init]


#Visit a New Url
searchBar = find("1575358059138.png")
click(searchBar)
type("https://web.archive.org/web/20131001231045/https://www.bloomberg.com/" + Key.ENTER)
dragDrop(mainBrowser,Location(mainBrowser.x - 50, mainBrowser.y + 100)) #drag it around as it's loading
wait(2)

#[Screenshot Here as Second Tab]

click(searchBar)
type("https://news.ycombinator.com" + Key.ENTER)
wait(1)
ycombinator = find("1575359360440.png")
wait(1)
#[Screenshot Here as Third Tab]


# Drag a Tab and make a new Browser Element
dragDrop(ycombinator,Location(ycombinator.x + 500, ycombinator.y - 150)) 

wait(2)

#[Screenshot Here as Drag And Create New Browser]
draggedTab = find("1575527747812.png")
# Check that Browser Swap Works as Expected
doubleClick(draggedTab)
#[Screenshot Here that browser was swapped]



#[Screenshot Here with Swap]


canvasCorner = find(Pattern("1575520889022.png").targetOffset(0,17))

keyDown(Key.ALT)
dragDrop(canvasCorner,Location(canvasCorner.x, canvasCorner.y+300))
keyUp()


wait(1)
openNewBrowser = find("1575522532518.png")

click(openNewBrowser)
click(canvasCorner)

#Check Resizing

wait(1)
newBrowser = find(Pattern("1575526037586.png").similar(0.80))
click(newBrowser)

wait(1)
browserCorner = find("1575526137842.png")
dragDrop(browserCorner,Location(browserCorner.x - 50, browserCorner.y + 100)) 

# Refresh the View and Check if it Persists




# Drag a Tab from One Browser to Another













import screenshot
testpassName = "setup"


doubleClick("1575361507867.png")

# Remove the Old Blank Space

rightClick(Pattern("1575361629349.png").targetOffset(60,0))

click("1575364277546.png")

wait(.5)

# Add the New Testing Space

click("1575361558347.png")

wait(1)

click("1575361583079.png")

type("Amna Blank Space")

click("1575364077581.png")

click ("1575361996543.png")

click("1575364533176.png")

keyDown(Key.CMD) 
type("R") 
keyUp(Key.CMD) 


#[Screenshot Here as Init]
screenshot.save(testpassName,'canvasInitialize.png')

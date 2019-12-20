import screenshot
testpassName = "canvas"

"1576805215057.png"
redRect = find("1576804205820.png")
click(redRect)

dragDrop(redRect, Location(redRect.x + 300, redRect.y - 10))

screenshot.save(testpassName,"dragRect.png")

wait(1)
redRectCorner = find("1576804578737.png")
dragDrop(redRectCorner, Location(redRectCorner.x - 100, redRectCorner.y - 50))

screenshot.save(testpassName,"resizeRedRect.png")

wait(1)
click("1576805190468.png")
greenRectCorner = find("1576805227473.png")
dragDrop(greenRectCorner, Location(greenRectCorner.x - 100, greenRectCorner.y - 200))

screenshot.save(testpassName,"resizeGreenRect.png")
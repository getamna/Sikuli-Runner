from sikuli.Sikuli import *
import shutil;

def save(filename):
  regionImage = capture(Region(0,45,1278,673))
  shutil.move(regionImage, os.path.join(r'/Users/ravitejalingineni/Documents/Projects/Sikuli-Runner/output/', filename))
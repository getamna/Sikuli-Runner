from sikuli.Sikuli import *
import shutil;
from inspect import getsourcefile
from os.path import abspath

def save(testpass,filename):
  regionImage = capture(Region(0,45,1278,673))
  shutil.move(regionImage, os.path.join(getOutputDirName(testpass), filename))

def getOutputDirName(testpass):
  workingDirectory = os.path.dirname(os.path.realpath(__file__))
  splitByDirectoryList = workingDirectory.split("/")
  currentRunningDirectory = splitByDirectoryList[:len(splitByDirectoryList)-1]
  outputDelimeter = "/"
  outputDir = outputDelimeter.join(currentRunningDirectory)
  
  #testpassName = splitByDirectoryList[-1].split(".")[0]
  #print testpassName

  return outputDir+"/output/"+testpass
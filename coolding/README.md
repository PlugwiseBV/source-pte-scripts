[![Plugwise](https://www.plugwise.com/skin/frontend/base/default/images/plugwise-logo.png)](https://www.plugwise.com)

### Coolding plugin

This Coolding plugin serves as a bridge between the Coolding and the SED's (Sleeping End Devices, such as the Switch, Scan ans Sense) using Source as main controller.

## Install

First download and install Plugwise Source. Then make sure the customer (in this case you) has enabled/bought the following licenses: 'Event Scripting' and 'Web Server'.

To compile this project, you will need to install 'NSIS Unicode'.

After compiling, you can run install.exe.

## To Compile

Download and install Nsis 2.46.5 Unicode. See: https://code.google.com/p/unsis/downloads/list

Then download this project.

Open the program 'makensisw.exe' (for me it's located: in C:\Program Files\NSIS\makensisw.exe).

Inside my project there is a file named 'compile.nsis', drag this file to the recently opened program 'makensisw'.

This will compile the project and install.exe will be updated!
# em-dash-display

Data was gathered by Romain Florentz on May 4, 2025.

## Setup Project:

1. Creating Virtual Environment:
Ctrl+Alt+S to open Settings
--> Project
--> Project Interpreter
--> select the gear symbol next to "Project Interpreter"
--> Add...
--> "Virtualenv Environment
--> New environment
--> OK
2. Install required packages:
open requirements.txt
--> click on "Install requirements" from bar on the top
Alternatively, you can install the requirements individually from the Project Interpreter menu (select "+")
3. Set Working Directory:
in order to load data on the server, you might need to set your Working Directory on PyCharm, otherwise you might get
the error "No such file or directory" when attemping to load data.
To do that, open Run
--> Edit Configurations...
set your Working Directory to the root directory (i.e. where "app.py" and the "static" folder are located)


## Files:

* app.py: Flask server
* templates/index.html: our single HTML page, including the main JavaScript code
* static/js/: folder where your JavaScript files should go
* static/data/: folder where your data should go
* static/styles/style.css: CSS styles

## Additional info:

Project heavily inspired by https://github.com/v4nn4/em-dash-conspiracy
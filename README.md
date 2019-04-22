# Regression by Eye

A replication of a research experiment for a university course. 

We implemented a web page that shows test data to a participant and then gathers the participant's responses in a CSV file for further external processing. The web page allows to:

- run a demo mode, to explain the procedure of the experiment to participants
- import Touchstone 2 trial sequence definitions as CSV file
- run the actual experiment according to the Touchstone 2 trial sequence (including 4 random validation images)
- gather the participants experiment data as a CSV file


## Run the (Demo) Experiment

Follow these steps to get the experiment web page up and running:

- Download the latest experiment release from Github (https://github.com/gujan6/RegressionByEye/releases)
- Extract the archive file
- Open the `<extracted-zip-folder>/RegressionByEye` folder
- Open the `index.html` file with Google's Chrome browser (The web page is optimized for Chrome).
- To start a demo run:
    - choose `Demo` in the participant selection box in the left menu panel
    - press `Start Experiment`
    - let the participant go through the demo sequence (including one validation image)
- To run an actual experiment:
    - Import the Touchstone2 trial sequence CSV (there is a predefined file in `<extracted-zip-folder>/RegressionByEye/touchstone_import/Experiment.csv`)
        - To generate a new trial sequence CSV follow the instructions in chapter `Generate a Touchstone 2 Trial Sequence`
    - choose the participant number in the participant selection box in the left menu panel
    - press `Start Experiment`
    - let the participant go through the full trial sequence (including 4 validation images)
- The experiment results are downloaded as CSV automatically at the end of a run


## Generate a Touchstone 2 Trial Sequence CSV

- Import our Experiment definition as workspace into Touchstone 2 (The workspace XML lies at `<extracted-zip-folder>/RegressionByEye/touchstone_import/Touchstone_RegByEye.xml`) 
- The Touchstone workspace holds two experiment design
- Download both trial tables as CSV files (use the `Export Trial Table` button).
- Merge both exported trial tables into one
    - The simplest way is to copy the `f` column of the `Rand. Function` design into the `RegressionByEye` design file. 
- The merged file is ready for import by our web page.

## Generate new Test and Validation Images

The experiment release package comes with the needed test and validation images. Should you still need to generate new images, use the  `<extracted-zip-folder>/QuantHCI/QuantHCI.pde` file. 
To run the PDE file:

- use the `Processing` editor (https://processing.org/download/)
- and add the Apache Commons Math (commons-math3-3.6.1) dependancy to the editor

The images will be saved in the  `<extracted-zip-folder>/QuantHCI/Experiment` respectively in the  `<extracted-zip-folder>/QuantHCI/Validation`folder.






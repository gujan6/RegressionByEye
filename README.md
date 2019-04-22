# Regression by Eye

A replication of a research experiment for a university course. 

We implemented a web page that shows test data to a participant and than gathers the participants responses in a csv file for further external processing. The web page allows to:

- run a demo mode, to explain the procedure of the experiment to particpants
- import Touchstone 2 trial sequence definitions as csv file
- run the actual experiment according to the Touchstone 2 trial sequence (including 4 random validation images)
- gather the participants experiment data as a csv file


## Run the (Demo) Experiment

Follow these steps to get the experiment web page up and running:

- Download the latest experiment release from Github (https://github.com/gujan6/RegressionByEye/releases)
- Extract the archive file
- Open the `<extracted-zip-folder>/RegressionByEye` folder
- Open the `index.html` file with Google's Chrome browser (The wep page is optimized for Chrome).
- To start a demo run
    - choose `Demo` in the participant selection box in the left menu panel
    - press `Start Experiment`
    - let the participant go through the demo squence (including one validation image)
- To run an actual experiment
    - Import the Touchstone2 trial sequnece csv (there is a predefined file in `<extracted-zip-folder>/RegressionByEye/touchstone_import/Experiment.csv`)
        - To generate a new trial sequence csv follow the instructions in chapter `Generate a Touchstone 2 Trial Sequence`
    - choose the participant number in the participant selection box in the left menu panel
    - press `Start Experiment`
    - let the participant go through the full trial squence (including 4 validation images)
- The results of the run are downloaded as csv automatically at the end


## Generate a Touchstone 2 Trial Sequence
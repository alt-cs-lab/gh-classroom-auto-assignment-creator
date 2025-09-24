# GitHub Classroom Auto Assignment Creator

This script is intended to read in an excel file and auto-create assignments in GitHub classroom

# Quick Install
1. Install and enable the [Tampermonkey](https://www.tampermonkey.net/) browser extension
2. Install the script by clicking this link: [gh-auto-create-assignments.js](https://github.com/alt-cs-lab/gh-classroom-auto-assignment-creator/raw/refs/heads/main/gh-auto-create-assignments.user.js)

# Instructions
1. The "Load Assignments" button will open a csv file that contains the information about the assignments you want to create. Currently, it accepts information in this format: `Number,Name,Assignment,Name,Repo,Template,Added`. For example "1,Lab 1 - First Lab,Lab 1 Assignment,repo-org-name/repo-name,FALSE". Assignments that have Added as TRUE will be skipped. You will need to refresh the page once a new CSV file has been loaded.
2. The "Export Assignments" button will download the current state of assignment creation (i.e. the Added column will be updated with true/false if that assignment has been created)
3. The "Auto Fill" button will fill in all information on the current page using the loaded assignment data.
4. The "Auto Fill and SUBMIT" button does the same as the auto fill, except that it will submit the form  (i.e. auto-click the continue button)
5. Checking "AUTO MODE" and then refreshing the page will auto fill and submit on each page of assignment creation. 
    - If all assignments are created or it generates an error, you need to manually check the AUTO MODE box again to stop it. There is a brief 1.5 second pause between actions to allow for this.
6. Once the assignment has been fully created, it will redirect you back to the assignment creation page (rather than the default landing page of the new assignment that was created). This is to speed up the process of creating assignments and to allow AUTO MODE to keep going.

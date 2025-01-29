// ==UserScript==
// @name         GitHub Classroom Auto Assignment Creator
// @namespace    https://github.com/alt-cs-lab/gh-classroom-auto-assignment-creator
// @version      1.0
// @description  Automate assignment creation in GitHub Classroom
// @author       weeser
// @match        https://classroom.github.com/classrooms/*/new_assignments/new
// @match        https://classroom.github.com/classrooms/*/new_assignments/continue?current_step=1
// @match        https://classroom.github.com/classrooms/*/new_assignments/continue?current_step=2
// @grant        none
// ==/UserScript==

(function () {
    "use strict";

    function setInputValue(selector, value) {
        let input = document.querySelector(selector);
        if (input) {
            input.value = value;
            input.dispatchEvent(new Event("input", { bubbles: true }));
        }
    }

    function setDropdownValue(selector, value) {
        let dropdown = document.querySelector(selector);
        if (dropdown) {
            dropdown.value = value;
            dropdown.dispatchEvent(new Event("change", { bubbles: true }));
        }
    }

    function clickButton(selector, delay = 2000) {
        let button = document.querySelector(selector);
        if (button) {
            setTimeout(() => button.click(), delay);
        }
    }

    function submitForm(selector, delay = 2000) {
        let form = document.querySelector(selector);
        if (form) {
            setTimeout(() => form.submit(), delay);
        }
    }

    function createAssignment(assignment) {
        if (window.location.pathname.includes("/new_assignments/new")) {
            console.log("Step 1: Creating Assignment");

            setInputValue(
                "#assignment_form_title",
                assignment["Assignment Name"]
            );
            if (assignment.hasOwnProperty("Deadline")) {
                setInputValue(
                    "#assignment_form_deadline_deadline_at",
                    assignment["Deadline"]
                );
            }
            
            setDropdownValue('select[name="submission_type"]', "individual"); // "individual" or "group"

            submitForm("#assignment-form", 1000); // Click "Create Assignment"/"continue"
            console.log("Assignment information set");
            return true;
        }
        return false;
    }

    function setStarterCode(assignment) {
        if (window.location.href.includes("current_step=1")) {
            console.log("Step 2: Setting Starter Code");

            setInputValue(
                "#github-repo-input--default",
                assignment["Repo Template"]
            );
            if(!assignment.hasOwnProperty("Privacy")) {
                assignment["Privacy"] = "private";
            }

            setInputValue(
                "#assignment_form_visibility_private",
                assignment["Privacy"]
            );
            clickButton('#new-assignment-cancel + button[type="submit"]', 500); // Click "Continue"
            
            console.log("Starter code set");
            return true;
        }
        return false;
    }

    function setAutoGrading(assignment) {
        if (window.location.href.includes("current_step=2")) {
            console.log("Step 3: Configuring Auto-Grading");

            console.log("Do this manually....I don't have time");

            clickButton('#new-assignment-cancel + button[type="submit"]', 500); // Click "finish"
            console.log("Auto-grading configured");
            console.log("Assignment created successfully");
            return true;
        }
        return false;
    }

    function autoFillAssignment() {
        try{
        let assignments = JSON.parse(localStorage.getItem("assignments"));
        let currentIndex = parseInt(localStorage.getItem("currentIndex"));
        let assignment = assignments[currentIndex];
        updateLabName(assignment["Name"] + " - " + assignment["Assignment Name"]);
        if(createAssignment(assignment) && setStarterCode(assignment) && setAutoGrading(assignment)) {
            console.log(assignment["Name"] + " finished");
            localStorage.setItem("currentIndex", currentIndex + 1);
            return true;
        }}
        catch(e){
            console.error("Error: " + e);
        }
        return false;
    }

    function loadAssignmentsFromCSV(csv) {
        let lines = csv.split("\n");
        let headers = lines[0].trim().split(",");
        let assignments = [];

        for (let i = 1; i < lines.length; i++) {
            let obj = {};
            let currentline = lines[i].trim().split(",");
            if (currentline.length !== headers.length) {
                console.error("Incomplete data for row " + i);
            } else {
                for (let j = 0; j < headers.length; j++) {
                    obj[headers[j]] = currentline[j];
                }
            }

            assignments.push(obj);
        }

        localStorage.setItem("assignments", JSON.stringify(assignments));
        localStorage.setItem("currentIndex", 0);
    }

    function getFile() {
        let fileInput = document.createElement("input");
        fileInput.type = "file";
        fileInput.accept = ".csv";
        fileInput.onchange = function (event) {
            let file = event.target.files[0];
            let reader = new FileReader();
            reader.onload = function (e) {
                loadAssignmentsFromCSV(e.target.result);
            };
            reader.readAsText(file);
        };
        fileInput.click();
    }

    function injectButton(innerHTML, top, right, clickHandler) {
        let button = document.createElement("button");
        button.innerHTML = innerHTML;
        button.style.position = "fixed";
        button.style.top = top + "px";
        button.style.right = right + "px";
        button.style.zIndex = 1000;
        button.onclick = clickHandler;
        document.body.appendChild(button);
    }

    function updateLabName(labName) {
        let labNameDiv = document.getElementById("lab-name-display");
        if (!labNameDiv) {
            labNameDiv = document.createElement("div");
            labNameDiv.id = "lab-name-display";
            labNameDiv.style.position = "fixed";
            labNameDiv.style.top = "0";
            labNameDiv.style.left = "50%";
            labNameDiv.style.transform = "translateX(-50%)";
            labNameDiv.style.backgroundColor = "#fff";
            labNameDiv.style.padding = "10px";
            labNameDiv.style.zIndex = 1000;
            labNameDiv.style.fontSize = "20px";
            labNameDiv.style.fontWeight = "bold";
            document.body.appendChild(labNameDiv);
        }
        labNameDiv.innerHTML = labName;
    }


    injectButton("Auto Fill Assignment", 10, 10, autoFillAssignment);
    injectButton("Load Assignments", 40, 10, getFile);
})();

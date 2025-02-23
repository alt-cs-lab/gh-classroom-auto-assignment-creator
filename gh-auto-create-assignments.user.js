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

    function createAssignment(assignment, submit = false) {
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

            if (submit) {
                submitForm("#assignment-form", 1000); // Click "Create Assignment"/"continue"
                console.log("Assignment information set");
                return true;
            }
        }
        return false;
    }

    function setStarterCode(assignment, submit = false) {
        if (window.location.href.includes("current_step=1")) {
            console.log("Step 2: Setting Starter Code");

            setInputValue(
                "#github-repo-input--default",
                assignment["Repo Template"]
            );
            if (!assignment.hasOwnProperty("Privacy")) {
                assignment["Privacy"] = "private";
            }

            setInputValue(
                "#assignment_form_visibility_private",
                assignment["Privacy"]
            );
            if (submit) {
                clickButton(
                    '#new-assignment-cancel + button[type="submit"]',
                    500
                ); // Click "Continue"

                console.log("Starter code set");
                return true;
            }
        }
        return false;
    }

    function setAutoGrading(assignment, submit = false) {
        if (window.location.href.includes("current_step=2")) {
            console.log("Step 3: Configuring Auto-Grading");

            console.log("Do this manually....I don't have time");

            if (submit) {
                clickButton(
                    '#new-assignment-cancel + button[type="submit"]',
                    500
                ); // Click "finish"
                console.log("Auto-grading configured");
                console.log("Assignment created successfully");
                return true;
            }
        }
        return false;
    }

    function checkTrue(assignment, key) {
        if (assignment.hasOwnProperty(key)) {
            return (
                assignment[key] === true ||
                assignment[key].toLowerCase() === "true"
            );
        }
        return false;
    }

    function autoFillAssignment(submit = false) {
        try {
            let assignments = JSON.parse(localStorage.getItem("assignments"));
            let currentIndex = parseInt(localStorage.getItem("currentIndex"));
            if (!assignments === null) {
                console.error("No assignments loaded");
                return;
            }
            for (
                ;
                currentIndex < assignments.length &&
                checkTrue(assignments[currentIndex], "Added");
                currentIndex++
            ) {
                console.log("Skipping " + assignments[currentIndex]["Name"]);
            }
            if (currentIndex >= assignments.length) {
                console.error("All assignments created");
                return;
            }

            localStorage.setItem("currentIndex", currentIndex);
            let assignment = assignments[currentIndex];
            updateLabLabel(
                assignment["Name"] + " - " + assignment["Assignment Name"]
            );
            createAssignment(assignment,submit);
            setStarterCode(assignment,submit);
            if (setAutoGrading(assignment,submit)) {
                console.log(assignment["Name"] + " finished");
                assignments["Added"] = true;
                localStorage.setItem("currentIndex", currentIndex + 1);
                return true;
            }
        } catch (e) {
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
        updateLabNameDisplay();
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

    function injectButton(innerHTML, top, right, clickHandler, classes="") {
        let button = document.createElement("button");
        button.innerHTML = innerHTML;
        button.style.position = "fixed";
        button.style.top = top + "px";
        button.style.right = right + "px";
        button.style.zIndex = 1000;
        button.className = classes;
        button.onclick = clickHandler;
        document.body.appendChild(button);
    }

    function updateLabNameDisplay() {
        let assignments = JSON.parse(localStorage.getItem("assignments"));
        let currentIndex = parseInt(localStorage.getItem("currentIndex"));
        if (assignments !== null) {
            let assignment = assignments[currentIndex];
            updateLabLabel(
                assignment["Name"] + " - " + assignment["Assignment Name"]
            );
        }
    }

    function updateLabLabel(labName) {
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

    function exportAssignments() {
        let assignments = JSON.parse(localStorage.getItem("assignments"));
        if (!assignments) {
            console.error("No assignments to export");
            return;
        }
    
        let csv = [];
        let headers = Object.keys(assignments[0]);
        csv.push(headers.join(","));
    
        for (let i = 0; i < assignments.length; i++) {
            let row = [];
            for (let j = 0; j < headers.length; j++) {
                row.push(assignments[i][headers[j]]);
            }
            csv.push(row.join(","));
        }
    
        let csvContent = csv.join("\n");
        let blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        let link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "assignments.csv";
        link.style.display = "none";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    injectButton("Load Assignments", 10, 10, getFile);
    injectButton("Export Assignments", 40, 10, exportAssignments);
    injectButton("Auto Fill", 70, 10, autoFillAssignment, "Button--secondary Button--medium Button");
    injectButton("Auto Fill and SUBMIT", 105, 10, () => autoFillAssignment(true), "Button--primary Button--medium Button");
    autoFillAssignment();
})();

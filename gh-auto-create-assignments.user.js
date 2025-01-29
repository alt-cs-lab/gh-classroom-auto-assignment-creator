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

            setInputValue('#assignment_form_title', assignment["Assignment Name"]);
            setInputValue('#assignment_form_deadline_deadline_at', assignment["Deadline"]);            
            setDropdownValue('select[name="submission_type"]', "individual"); // "individual" or "group"

            submitForm('#assignment-form', 1000); // Click "Create Assignment"/"continue"
        }
    }

    function setStarterCode(assignment) {
        if (window.location.href.includes("current_step=1")) {
            console.log("Step 2: Setting Starter Code");

            setInputValue('#github-repo-input--default', assignment["Starter Code"]);
            setInputValue('#assignment_form_visibility_private', assignment["Privacy"]);
            clickButton('#new-assignment-cancel + button[type="submit"]', 500); // Click "Continue"
        }
    }

    function setAutoGrading(assignment) {
        if (window.location.href.includes("current_step=2")) {
            console.log("Step 3: Configuring Auto-Grading");

            console.log("Do this manually....I don't have time");

            clickButton('#new-assignment-cancel + button[type="submit"]', 500); // Click "finish"
        }
    }

	function autoFillAssignment() {
		let assignment = {
			"Assignment Name": "Assignment 1",
			"Privacy": "private",
			"Type": "individual",
			"Deadline": "2021-12-31T23:59:59Z",
			"Starter Code": "ksu-cis300-spring-2025/lab-3-model-solution-weeser"
		};
		createAssignment(assignment);
        console.log("Assignment created");
		 setStarterCode(assignment);
        console.log("Starter code set");
		setAutoGrading(assignment);
        console.log("Auto-grading configured");            
	}

    function loadAssignmentsFromCSV(csv) {
        let lines = csv.split("\n");
        let headers = lines[0].split(",");
        let assignments = [];

        for (let i = 1; i < lines.length; i++) {
            let obj = {};
            let currentline = lines[i].split(",");

            for (let j = 0; j < headers.length; j++) {
                obj[headers[j].trim()] = currentline[j].trim();
            }

            assignments.push(obj);
        }

        localStorage.setItem("assignments", JSON.stringify(assignments));
        localStorage.setItem("currentIndex", 0);
    }

    function getFile () {
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
        button.style.right = right +"px";
        button.style.zIndex = 1000;
        button.onclick = clickHandler;
        document.body.appendChild(button);
    }
    injectButton("Auto Fill Assignment", 10, 10, autoFillAssignment);
    injectButton("Load Assignments", 40, 10, getFile);
})();

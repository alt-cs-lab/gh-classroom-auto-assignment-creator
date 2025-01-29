// ==UserScript==
// @name         GitHub Classroom Auto Assignment Creator
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Automate assignment creation in GitHub Classroom
// @author       You
// @match        https://classroom.github.com/classrooms/*/new_assignments/new
// @match        https://classroom.github.com/classrooms/*/new_assignments/continue?current_step=1
// @match        https://classroom.github.com/classrooms/*/new_assignments/continue?current_step=2
// @grant        none
// @downloadURL  https://github.com/alt-cs-lab/gh-classroom-auto-assignment-creator/raw/main/gh-auto-create-assignments.js
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

    function createAssignment(assignment) {
        if (window.location.pathname.includes("/assignments/new")) {
            console.log("Step 1: Creating Assignment");

            setInputValue('input[name="title"]', assignment["Assignment Name"]);
            setDropdownValue('select[name="repository_privacy"]', assignment["Privacy"]); // "public" or "private"
            setDropdownValue('select[name="submission_type"]', assignment["Type"]); // "individual" or "group"
            setInputValue('input[name="deadline"]', assignment["Deadline"]);

            clickButton('button[type="submit"]'); // Click "Create Assignment"
        }
    }

    function setStarterCode(assignment) {
        if (window.location.href.includes("current_step=1")) {
            console.log("Step 2: Setting Starter Code");

            setInputValue('input[name="starter_code_repo"]', assignment["Starter Code"]);
            clickButton('button[type="submit"]'); // Click "Next"
        }
    }

    function setAutoGrading(assignment) {
        if (window.location.href.includes("current_step=2")) {
            console.log("Step 3: Configuring Auto-Grading");

            if (assignment["Enable AutoGrading"] === "yes") {
                let toggle = document.querySelector('input[type="checkbox"][name="autograding_enabled"]');
                if (toggle && !toggle.checked) {
                    toggle.click(); // Enable auto-grading
                }
            }

            clickButton('button[type="submit"]'); // Click "Finish"
        }
    }

	function autoFillAssignment() {
		let assignment = {
			"Assignment Name": "Assignment 1",
			"Privacy": "private",
			"Type": "individual",
			"Deadline": "2021-12-31T23:59:59Z",
			"Starter Code": ""
		};
		createAssignment(assignment);
		// setStarterCode(assignment);
		// setAutoGrading(assignment);
	}

    // Run the function after page loads
    window.addEventListener("load", autoFillAssignment);
})();

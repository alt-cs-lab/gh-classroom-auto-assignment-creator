// ==UserScript==
// @name         GitHub Classroom Auto Assignment Creator
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Automate assignment creation in GitHub Classroom
// @author       You
// @match        https://classroom.github.com/classrooms/*/assignments/new
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    function setInputValue(selector, value) {
        let input = document.querySelector(selector);
        if (input) {
            input.value = value;
            input.dispatchEvent(new Event('input', { bubbles: true }));
        }
    }

    function setDropdownValue(selector, value) {
        let dropdown = document.querySelector(selector);
        if (dropdown) {
            dropdown.value = value;
            dropdown.dispatchEvent(new Event('change', { bubbles: true }));
        }
    }

    function autoFillAssignment() {
        setInputValue('input[name="title"]', "My Automated Assignment");
        setDropdownValue('select[name="repository_privacy"]', "private"); // "public" or "private"
        setDropdownValue('select[name="submission_type"]', "individual"); // "individual" or "group"
        setInputValue('input[name="deadline"]', "2025-02-15T23:59"); // Adjust deadline

        // Click "Create Assignment" Button
        let createButton = document.querySelector('button[type="submit"]');
        if (createButton) {
            setTimeout(() => createButton.click(), 2000); // Delay to ensure fields are filled
        }
    }

    // Run the function after page loads
    window.addEventListener('load', autoFillAssignment);
})();

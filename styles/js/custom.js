/* eslint-disable no-undef */
window.bootstrap = require('bootstrap/dist/js/bootstrap.bundle.js')
// Popper
const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))

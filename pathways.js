/**
 * pathways.js - STYLING MODE
 * This version forces both Member and Guest paths to stay visible 
 * so you can finish the design.
 */

function forceShowEverything() {
    console.log("Styling Mode Active: Showing all pathways.");

    const allPathways = document.querySelectorAll('.pathway-guest, .pathway-member');

    allPathways.forEach(el => {
        // If it's the diary circle, use flex. Otherwise, use block.
        if (el.classList.contains('diary-wrapper')) {
            el.style.display = 'flex';
        } else {
            el.style.display = 'block';
        }
        
        // Optional: Add a red border during styling so you see the containers
        // el.style.outline = "1px dashed red"; 
    });
}

// Run it immediately and don't let anything else hide them
document.addEventListener('DOMContentLoaded', forceShowEverything);
window.addEventListener('load', forceShowEverything);
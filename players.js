//imports list of all players
import { player_array } from "./player_list.js";

let currentSort = 'nameAsc'; // Track the current sorting state for toggling

// Populate the year select dropdowns (startYear and endYear)
function populateYearOptions() {
    const yearRange = 1969;
    const currentYear = 2025; // Hardcoded for the full range of data
    const startYearSelect = document.getElementById('startYear');
    const endYearSelect = document.getElementById('endYear');

    // Clear existing options
    startYearSelect.innerHTML = "";
    endYearSelect.innerHTML = "";

    for (let year = yearRange; year <= currentYear; year++) {
        let optionStart = document.createElement('option');
        optionStart.value = year;
        optionStart.textContent = year;
        startYearSelect.appendChild(optionStart);

        let optionEnd = document.createElement('option');
        optionEnd.value = year;
        optionEnd.textContent = year;
        endYearSelect.appendChild(optionEnd);
    }

    // Set defaults
    startYearSelect.value = "1969";
    endYearSelect.value = "2025";
}

// Render players based on the current filter and sort settings
function renderPlayers(filteredPlayers) {
    const playersList = document.getElementById('playersList');
    playersList.innerHTML = ''; // Clear previous player list

    filteredPlayers.forEach(player => {
        const li = document.createElement('li');
        li.classList.add('player');
        li.textContent = `${player.firstName} ${player.lastName} (${player.years.join(', ')}) - Position(s): ${player.positions.join(', ')}`;
        playersList.appendChild(li);
    });
}

// Function to filter players based on search input, selected year range, and position
function filterPlayers() {
    const searchTerm = document.getElementById('searchBar').value.toLowerCase();
    const startYear = parseInt(document.getElementById('startYear').value) || 1969;
    const endYear = parseInt(document.getElementById('endYear').value) || 2025;
    const selectedPosition = document.getElementById('positionFilter').value;

    let filteredPlayers = player_array.filter(player => {
        const matchesSearch = `${player.firstName} ${player.lastName}`.toLowerCase().includes(searchTerm);
        const matchesYear = player.years.some(year => year >= startYear && year <= endYear);
        const matchesPosition = selectedPosition === "" || 
            (selectedPosition === "OF" 
                ? player.positions.some(pos => ["LF", "CF", "RF", "OF"].includes(pos)) 
                : selectedPosition === "P"
                    ? player.positions.some(pos => ["SP", "RP", "P"].includes(pos))
                    : player.positions.includes(selectedPosition));

        return matchesSearch && matchesYear && matchesPosition;
    });

    // Sort players according to the current sorting method
    if (currentSort === 'nameAsc') {
        filteredPlayers.sort((a, b) => a.lastName.localeCompare(b.lastName)); // Sort by last name A-Z
    } else if (currentSort === 'nameDesc') {
        filteredPlayers.sort((a, b) => b.lastName.localeCompare(a.lastName)); // Sort by last name Z-A
    } else if (currentSort === 'yearAsc') {
        filteredPlayers.sort((a, b) => Math.min(...a.years) - Math.min(...b.years)); // Sort by first year ascending
    } else if (currentSort === 'yearDesc') {
        filteredPlayers.sort((a, b) => Math.min(...b.years) - Math.min(...a.years)); // Sort by first year descending
    }

    renderPlayers(filteredPlayers); // Render the filtered and sorted players
}

// Function to toggle sorting players by name (A-Z or Z-A)
function sortPlayersByName() {
    currentSort = (currentSort === 'nameAsc') ? 'nameDesc' : 'nameAsc'; // Toggle sort order
    filterPlayers(); // Re-filter with the updated sorting option
}

// Function to toggle sorting players by first year (ascending or descending)
function sortPlayersByYear() {
    currentSort = (currentSort === 'yearAsc') ? 'yearDesc' : 'yearAsc'; // Toggle sort order
    filterPlayers(); // Re-filter with the updated sorting option
}

// Function to reset all filters and search bar
function resetFilters() {
    console.log("Reset button clicked"); // Debugging: Check if this runs

    // Reset search input
    document.getElementById('searchBar').value = '';

    // Reset dropdown selections
    const startYearSelect = document.getElementById('startYear');
    const endYearSelect = document.getElementById('endYear');
    const positionFilterSelect = document.getElementById('positionFilter');

    if (startYearSelect && endYearSelect && positionFilterSelect) {
        startYearSelect.value = startYearSelect.options[0].value; // Reset to first option
        endYearSelect.value = endYearSelect.options[endYearSelect.options.length - 1].value; // Reset to last option
        positionFilterSelect.value = ""; // Reset position filter
    } else {
        console.error("Dropdown elements not found!");
    }

    // Reset sorting order and explicitly sort by last name A-Z
    currentSort = 'nameAsc';
    let sortedPlayers = player_array.slice().sort((a, b) => a.lastName.localeCompare(b.lastName));

    // Re-render the player list with default sorting
    renderPlayers(sortedPlayers);
}


document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM fully loaded and parsed");

    // Get elements
    const searchBar = document.getElementById("searchBar");
    const startYear = document.getElementById("startYear");
    const endYear = document.getElementById("endYear");
    const positionFilter = document.getElementById("positionFilter");
    const sortName = document.getElementById("sortName");
    const sortYear = document.getElementById("sortYear");
    const resetFiltersButton = document.getElementById("resetFilters");

    if (!searchBar || !startYear || !endYear || !positionFilter || !sortName || !sortYear || !resetFiltersButton) {
        console.error("One or more elements not found!");
        return;
    }

    populateYearOptions();
    renderPlayers(player_array);

    // Attach event listeners instead of using inline onchange
    searchBar.addEventListener("input", filterPlayers);
    startYear.addEventListener("change", filterPlayers);
    endYear.addEventListener("change", filterPlayers);
    positionFilter.addEventListener("change", filterPlayers);
    sortName.addEventListener("click", sortPlayersByName);
    sortYear.addEventListener("click", sortPlayersByYear);
    resetFiltersButton.addEventListener("click", resetFilters);
});

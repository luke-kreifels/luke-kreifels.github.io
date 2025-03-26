//import player list
import { player_array } from "./player_list.js";

let currentSort = 'nameAsc'; 

// Populate year dropdowns
function populateYearOptions() {
    const yearRange = 1969;
    const currentYear = 2025;
    const startYearSelect = document.getElementById('startYear');
    const endYearSelect = document.getElementById('endYear');

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

    startYearSelect.value = "1969";
    endYearSelect.value = "2025";
}

// Render players based on the current filter
function renderPlayers(filteredPlayers) {
    const playersList = document.getElementById('playersList');
    const playerCount = document.getElementById('playerCount');
    playersList.innerHTML = ''; 

    playerCount.textContent = `Players Listed: ${filteredPlayers.length}`;

    filteredPlayers.forEach(player => {
        const li = document.createElement('li');
        li.classList.add('player');
        
        const a = document.createElement('a');
        a.href = player.page ? player.page : 'page_not_made.html';
        a.textContent = `${player.firstName} ${player.lastName} (${player.years.join(', ')}) - Position(s): ${player.positions.join(', ')}`;

        li.appendChild(a);
        
        playersList.appendChild(li);
    });
}


// Function to filter players
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

    if (currentSort === 'nameAsc') {
        filteredPlayers.sort((a, b) => a.lastName.localeCompare(b.lastName)); // Sort A-Z
    } else if (currentSort === 'nameDesc') {
        filteredPlayers.sort((a, b) => b.lastName.localeCompare(a.lastName)); // Sort Z-A
    } else if (currentSort === 'yearAsc') {
        filteredPlayers.sort((a, b) => Math.min(...a.years) - Math.min(...b.years)); // Sort first year ascending
    } else if (currentSort === 'yearDesc') {
        filteredPlayers.sort((a, b) => Math.min(...b.years) - Math.min(...a.years)); // Sort first year descending
    }

    renderPlayers(filteredPlayers);
}

function sortPlayersByName() {
    currentSort = (currentSort === 'nameAsc') ? 'nameDesc' : 'nameAsc';
    filterPlayers();
}

function sortPlayersByYear() {
    currentSort = (currentSort === 'yearAsc') ? 'yearDesc' : 'yearAsc';
    filterPlayers();
}

function resetFilters() {
    console.log("Reset button clicked");

    document.getElementById('searchBar').value = '';

    const startYearSelect = document.getElementById('startYear');
    const endYearSelect = document.getElementById('endYear');
    const positionFilterSelect = document.getElementById('positionFilter');

    if (startYearSelect && endYearSelect && positionFilterSelect) {
        startYearSelect.value = startYearSelect.options[0].value;
        endYearSelect.value = endYearSelect.options[endYearSelect.options.length - 1].value;
        positionFilterSelect.value = "";
    } else {
        console.error("Dropdown elements not found!");
    }

    currentSort = 'nameAsc';
    let sortedPlayers = player_array.slice().sort((a, b) => a.lastName.localeCompare(b.lastName));

    renderPlayers(sortedPlayers);
}


document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM fully loaded and parsed");

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

    searchBar.addEventListener("input", filterPlayers);
    startYear.addEventListener("change", filterPlayers);
    endYear.addEventListener("change", filterPlayers);
    positionFilter.addEventListener("change", filterPlayers);
    sortName.addEventListener("click", sortPlayersByName);
    sortYear.addEventListener("click", sortPlayersByYear);
    resetFiltersButton.addEventListener("click", resetFilters);
});

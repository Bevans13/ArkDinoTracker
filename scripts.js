// Function to fetch and populate species
async function fetchSpecies() {
    try {
        const response = await fetch('species.json');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const speciesList = await response.json();

        // Populate species dropdown and filter
        const speciesDropdown = document.getElementById('dinoSpecies');
        const speciesFilter = document.getElementById('speciesFilter');

        speciesList.forEach(species => {
            const option = document.createElement('option');
            option.value = species.name;
            option.textContent = species.name;
            speciesDropdown.appendChild(option);

            const filterOption = document.createElement('option');
            filterOption.value = species.name;
            filterOption.textContent = species.name;
            speciesFilter.appendChild(filterOption);
        });
    } catch (error) {
        console.error('Failed to fetch species:', error);
    }
}

// Function to display the dinosaur list
function displayDinoList() {
    const selectedSpecies = document.getElementById('speciesFilter').value;
    const dinoList = JSON.parse(localStorage.getItem('dinoList')) || [];
    const dinoTableBody = document.getElementById('dinoTable').getElementsByTagName('tbody')[0];
    dinoTableBody.innerHTML = ''; // Clear previous table rows

    const filteredList = selectedSpecies === 'all' ? dinoList : dinoList.filter(dino => dino.species === selectedSpecies);

    // Find the highest values in each column (except mutation)
    let maxValues = {
        level: 0, health: 0, stamina: 0, oxygen: 0, food: 0, weight: 0, melee: 0
    };
    filteredList.forEach(dino => {
        Object.keys(maxValues).forEach(key => {
            if (parseInt(dino[key]) > maxValues[key]) {
                maxValues[key] = parseInt(dino[key]);
            }
        });
    });

    // Sort the filteredList based on the current sort state
    if (currentSort.column) {
        filteredList.sort((a, b) => {
            const dir = currentSort.direction === 'asc' ? 1 : -1;
            const aValue = parseFloat(a[currentSort.column]);
            const bValue = parseFloat(b[currentSort.column]);
            return (aValue > bValue ? dir : -dir) || (aValue < bValue ? -dir : 0);
        });
    }

    // Update sort arrows
    ['Gender', 'Level', 'Health', 'Stamina', 'Oxygen', 'Food', 'Weight', 'Melee'].forEach(col => {
        document.getElementById(`arrow${col}`).innerHTML = '';
        if (currentSort.column === col.toLowerCase()) {
            document.getElementById(`arrow${col}`).innerHTML = currentSort.direction === 'asc' ? '&#x2191;' : '&#x2193;';
        }
    });

    // Populate the table with the filtered and sorted list
    filteredList.forEach(function(dino, index) {
        const row = dinoTableBody.insertRow();
        row.insertCell(0).textContent = dino.name;
        row.insertCell(1).textContent = dino.species;
        row.insertCell(2).textContent = dino.gender;
        row.insertCell(3).textContent = dino.level;
        row.insertCell(4).textContent = dino.health;
        row.insertCell(5).textContent = dino.stamina;
        row.insertCell(6).textContent = dino.oxygen;
        row.insertCell(7).textContent = dino.food;
        row.insertCell(8).textContent = dino.weight;
        row.insertCell(9).textContent = dino.melee;
        row.insertCell(10).textContent = dino.mutation;

        // Highlight the cells with the highest values (except mutation)
        ['level', 'health', 'stamina', 'oxygen', 'food', 'weight', 'melee'].forEach((key, i) => {
            if (parseInt(dino[key]) === maxValues[key]) {
                row.cells[i + 3].classList.add('highlight');
            }
        });

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Dead';
        deleteButton.className = 'delete';  // Add the delete class for styling
        deleteButton.onclick = function() {
            deleteDino(index);
        };
        row.insertCell(11).appendChild(deleteButton);
    });
}

// Function to update parent options
function updateParentOptions() {
    const dinoList = JSON.parse(localStorage.getItem('dinoList')) || [];
    const selectedSpecies = document.getElementById('speciesFilter').value;

    // Filter the dinoList by the currently selected species
    const filteredDinoList = selectedSpecies === 'all' ? dinoList : dinoList.filter(dino => dino.species === selectedSpecies);

    // Populate parent selection dropdowns
    const parent1Dropdown = document.getElementById('parent1');
    const parent2Dropdown = document.getElementById('parent2');
    parent1Dropdown.innerHTML = '';
    parent2Dropdown.innerHTML = '';
    filteredDinoList.forEach(dino => {
        const option1 = document.createElement('option');
        option1.value = dino.name;
        option1.textContent = dino.name;
        parent1Dropdown.appendChild(option1);

        const option2 = document.createElement('option');
        option2.value = dino.name;
        option2.textContent = dino.name;
        parent2Dropdown.appendChild(option2);
    });
}

// Event listener for the close button in the mating section
document.getElementById('closeMatingSection').addEventListener('click', function() {
    document.getElementById('matingSection').style.display = 'none';
});

// Event listener for the Add Dinosaur button
document.getElementById('addDinoButton').addEventListener('click', function() {
    const form = document.getElementById('dinoForm');
    const dinoListSection = document.getElementById('dinoListSection');
    form.style.display = form.style.display === 'none' ? 'block' : 'none';
    dinoListSection.style.display = 'none'; // Hide Dino List
});

// Event listener for the Dinosaur List button
document.getElementById('toggleDinoListButton').addEventListener('click', function() {
    const dinoListSection = document.getElementById('dinoListSection');
    const form = document.getElementById('dinoForm');
    dinoListSection.style.display = dinoListSection.style.display === 'none' ? 'block' : 'none';
    form.style.display = 'none'; // Hide Add Dino Form
});

// Event listener for the Mate Dinosaurs button
document.getElementById('mateButton').addEventListener('click', function() {
    updateParentOptions();
    document.getElementById('matingSection').style.display = 'block';
});

// Event listener for the species filter change
document.getElementById('speciesFilter').addEventListener('change', function() {
    updateParentOptions();
    displayDinoList();
});

// Event listener for the Dino Form submission
document.getElementById('dinoForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const dinoStats = {
        name: document.getElementById('dinoName').value,
        species: document.getElementById('dinoSpecies').value,
        gender: document.getElementById('dinoGender').value,
        level: document.getElementById('dinoLevel').value,
        health: document.getElementById('dinoHealth').value,
        stamina: document.getElementById('dinoStamina').value,
        oxygen: document.getElementById('dinoOxygen').value,
        food: document.getElementById('dinoFood').value,
        weight: document.getElementById('dinoWeight').value,
        melee: document.getElementById('dinoMelee').value,
        mutation: document.getElementById('dinoMutation').value || 0
    };
    let dinoList = JSON.parse(localStorage.getItem('dinoList')) || [];
    dinoList.push(dinoStats);
    localStorage.setItem('dinoList', JSON.stringify(dinoList));
    displayDinoList();
    document.getElementById('dinoForm').reset();
    document.getElementById('dinoForm').style.display = 'none';
});

// Event listener for the Mating Form submission
document.getElementById('matingForm').addEventListener('submit', function(event) {
    event.preventDefault();

    // Get selected parents from the dropdowns
    const parent1Name = document.getElementById('parent1').value;
    const parent2Name = document.getElementById('parent2').value;
    const dinoList = JSON.parse(localStorage.getItem('dinoList')) || [];

    // Find the parent dinos in the list
    const parent1 = dinoList.find(dino => dino.name === parent1Name);
    const parent2 = dinoList.find(dino => dino.name === parent2Name);

    if (parent1 && parent2) {
        // Create the offspring dino with averaged stats
        const offspring = {
            name: `${parent1.name}-${parent2.name} Jr.`,
            species: parent1.species,  // Assuming same species for simplicity
            gender: Math.random() > 0.5 ? 'Male' : 'Female',
            level: Math.floor((parseInt(parent1.level) + parseInt(parent2.level)) / 2),
            health: Math.floor((parseInt(parent1.health) + parseInt(parent2.health)) / 2),
            stamina: Math.floor((parseInt(parent1.stamina) + parseInt(parent2.stamina)) / 2),
            oxygen: Math.floor((parseInt(parent1.oxygen) + parseInt(parent2.oxygen)) / 2),
            food: Math.floor((parseInt(parent1.food) + parseInt(parent2.food)) / 2),
            weight: Math.floor((parseInt(parent1.weight) + parseInt(parent2.weight)) / 2),
            melee: Math.floor((parseInt(parent1.melee) + parseInt(parent2.melee)) / 2),
            mutation: Math.floor((parseInt(parent1.mutation) + parseInt(parent2.mutation)) / 2)
        };

        // Add the offspring to the dino list and update localStorage
        dinoList.push(offspring);
        localStorage.setItem('dinoList', JSON.stringify(dinoList));

        // Refresh the dinosaur list display
        displayDinoList();

        // Reset the mating form and hide the mating section
        document.getElementById('matingForm').reset();
        document.getElementById('matingSection').style.display = 'none';
    }
});


// Event listener for Add Dinosaur Button
document.getElementById('addDinoButton').addEventListener('click', function() {
    const form = document.getElementById('dinoForm');
    const dinoListSection = document.getElementById('dinoListSection');
    form.style.display = form.style.display === 'none' ? 'block' : 'none';
    dinoListSection.style.display = 'none'; // Hide Dino List
});

// Event listener for Dino Form Submission
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

// Event listener for Dinosaur List button
document.getElementById('toggleDinoListButton').addEventListener('click', function() {
    const dinoListSection = document.getElementById('dinoListSection');
    const form = document.getElementById('dinoForm');
    dinoListSection.style.display = dinoListSection.style.display === 'none' ? 'block' : 'none';
    form.style.display = 'none'; // Hide Add Dino Form
});

// Event listener for species filter change
document.getElementById('speciesFilter').addEventListener('change', function() {
    updateParentOptions();
    displayDinoList();
});

// Update species dropdowns on page load
document.addEventListener('DOMContentLoaded', function() {
    fetchSpecies();
    displayDinoList();
});

// Populate species dropdown and filter on page load
async function fetchSpecies() {
    try {
        const response = await fetch('species.json');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const speciesList = await response.json();
        console.log('Species List:', speciesList); // Add this line to check the fetched data

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

// Function to update parent options
function updateParentOptions() {
    const dinoList = JSON.parse(localStorage.getItem('dinoList')) || [];
    const selectedSpecies = document.getElementById('speciesFilter').value;

    const filteredDinoList = selectedSpecies === 'all' ? dinoList : dinoList.filter(dino => dino.species === selectedSpecies);

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

// Function to display the dinosaur list
function displayDinoList() {
    const selectedSpecies = document.getElementById('speciesFilter').value;
    const dinoList = JSON.parse(localStorage.getItem('dinoList')) || [];
    console.log('Dino List:', dinoList); // Add this line to check local storage data
    const dinoTableBody = document.getElementById('dinoTable').getElementsByTagName('tbody')[0];
    dinoTableBody.innerHTML = ''; // Clear previous table rows

    const filteredList = selectedSpecies === 'all' ? dinoList : dinoList.filter(dino => dino.species === selectedSpecies);

    filteredList.forEach(function(dino, index) {
        console.log('Adding dino:', dino); //log each dino being added
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

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Dead';
        deleteButton.className = 'delete';  // Add the delete class for styling
        deleteButton.onclick = function() {
            deleteDino(index);
        };
        row.insertCell(11).appendChild(deleteButton);
    });
}

// Function to delete a dinosaur from the list
function deleteDino(index) {
    let dinoList = JSON.parse(localStorage.getItem('dinoList')) || [];
    dinoList.splice(index, 1);
    localStorage.setItem('dinoList', JSON.stringify(dinoList));
    displayDinoList();
}

// Event listener for the Mate Dinosaurs button
document.getElementById('mateButton').addEventListener('click', function() {
    const matingSection = document.getElementById('matingSection');
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

    // Get selected parents
    const parent1Name = parent1Dropdown.value;
    const parent2Name = parent2Dropdown.value;
    const parent1 = dinoList.find(dino => dino.name === parent1Name);
    const parent2 = dinoList.find(dino => dino.name === parent2Name);

    if (parent1 && parent2) {
        // Populate stat dropdowns with actual values
        const updateStatDropdown = (dropdownId, stat) => {
            const dropdown = document.getElementById(dropdownId);
            dropdown.innerHTML = '';

            const option1 = document.createElement('option');
            option1.value = 'parent1';
            option1.textContent = `Parent 1: ${parent1[stat]}`;
            dropdown.appendChild(option1);

            const option2 = document.createElement('option');
            option2.value = 'parent2';
            option2.textContent = `Parent 2: ${parent2[stat]}`;
            dropdown.appendChild(option2);
        };

        updateStatDropdowns(); //Initial update
    }

    matingSection.style.display = 'block';
});

// Event listener for the close button in the mating section
document.getElementById('closeMatingSection').addEventListener('click', function() {
    document.getElementById('matingSection').style.display = 'none';
});

// Event listener for mating form submission
document.getElementById('matingForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const parent1Name = document.getElementById('parent1').value;
    const parent2Name = document.getElementById('parent2').value;
    const offspringName = document.getElementById('offspringName').value;
    const offspringGender = document.getElementById('offspringGender').value;
    const dinoList = JSON.parse(localStorage.getItem('dinoList')) || [];

    const parent1 = dinoList.find(dino => dino.name === parent1Name);
    const parent2 = dinoList.find(dino => dino.name === parent2Name);

    if (parent1 && parent2) {
        const getInheritedStat = (stat, parent1Value, parent2Value) => {
            return stat === 'parent1' ? parent1Value : parent2Value;
        };

        const offspring = {
            name: offspringName,
            species: parent1.species,
            gender: offspringGender,
            level: Math.floor((parseInt(parent1.level) + parseInt(parent2.level)) / 2),
            health: getInheritedStat(document.getElementById('healthParent').value, parseInt(parent1.health), parseInt(parent2.health)),
            stamina: getInheritedStat(document.getElementById('staminaParent').value, parseInt(parent1.stamina), parseInt(parent2.stamina)),
            oxygen: getInheritedStat(document.getElementById('oxygenParent').value, parseInt(parent1.oxygen), parseInt(parent2.oxygen)),
            food: getInheritedStat(document.getElementById('foodParent').value, parseInt(parent1.food), parseInt(parent2.food)),
            weight: getInheritedStat(document.getElementById('weightParent').value, parseInt(parent1.weight), parseInt(parent2.weight)),
            melee: getInheritedStat(document.getElementById('meleeParent').value, parseInt(parent1.melee), parseInt(parent2.melee)),
            mutation: Math.floor((parseInt(parent1.mutation) + parseInt(parent2.mutation)) / 2)
        };

        dinoList.push(offspring);
        localStorage.setItem('dinoList', JSON.stringify(dinoList));
        displayDinoList();
        document.getElementById('matingForm').reset();
        document.getElementById('matingSection').style.display = 'none';
    }
});

function updateStatDropdowns() {
    const dinoList = JSON.parse(localStorage.getItem('dinoList')) || [];

    const parent1Name = document.getElementById('parent1').value;
    const parent2Name = document.getElementById('parent2').value;

    const parent1 = dinoList.find(dino => dino.name === parent1Name);
    const parent2 = dinoList.find(dino => dino.name === parent2Name);

    if (parent1 && parent2) {
        const updateStatDropdown = (dropdownId, stat) => {
            const dropdown = document.getElementById(dropdownId);
            dropdown.innerHTML = '';

            const option1 = document.createElement('option');
            option1.value = 'parent1';
            option1.textContent = `Parent 1: ${parent1[stat]}`;
            dropdown.appendChild(option1);

            const option2 = document.createElement('option');
            option2.value = 'parent2';
            option2.textContent = `Parent 2: ${parent2[stat]}`;
            dropdown.appendChild(option2);
        };

        updateStatDropdown('healthParent', 'health');
        updateStatDropdown('staminaParent', 'stamina');
        updateStatDropdown('oxygenParent', 'oxygen');
        updateStatDropdown('foodParent', 'food');
        updateStatDropdown('weightParent', 'weight');
        updateStatDropdown('meleeParent', 'melee');

    }
}

document.getElementById('parent1').addEventListener('change', updateStatDropdowns);
document.getElementById('parent2').addEventListener('change', updateStatDropdowns);


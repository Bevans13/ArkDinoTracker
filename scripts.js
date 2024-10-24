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
    const dinoList = JSON.parse(localStorage.getItem('dinoList')) || [];
    const dinoTableBody = document.getElementById('dinoTable').getElementsByTagName('tbody')[0];
    dinoTableBody.innerHTML = ''; // Clear previous table rows

    dinoList.forEach(function(dino, index) {
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

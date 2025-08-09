const usersContainer = document.getElementById("usersContainer");
const searchInput = document.getElementById("searchInput");
const cityFilter = document.getElementById("cityFilter");
const companyFilter = document.getElementById("companyFilter");
const darkModeToggle = document.getElementById("darkModeToggle");
const statusMessage = document.getElementById("statusMessage");

let allUsers = [];

// Fetch Users
async function fetchUsers() {
  try {
    statusMessage.innerHTML = "Loading...";
    const response = await fetch("https://jsonplaceholder.typicode.com/users");
    const users = await response.json();
    allUsers = users;
    populateFilters(data);
    displayUsers(users);
    statusMessage.innerHTML = "";
  } catch (error) {
    statusMessage.innerHTML = "Error loading users!";
  }
}

// Display Users
function displayUsers(users) {
  card = "";

  for (let i = 0; i < users.length; i++) {
    const user = users[i];

    // const card = document.createElement("div");
    // card.className = "bg-white p-4 rounded shadow";

    card += `
    <div class="bg-White p-4 rounded shadow-2xl">
      <h2 class="text-xl font-bold">${user.name}</h2>
      <p>Email: ${user.email}</p>
      <p>Company: ${user.company.name}</p>
      <p>City: ${user.address.city}</p>
      <button class="viewMoreBtn mt-2 px-3 py-1 bg-blue-500 text-white rounded">View More</button>
      <div class="extraInfo hidden mt-2">
        <p>Phone: ${user.phone}</p>
        <p>Website: ${user.website}</p>
        <p>Username: ${user.username}</p>
      </div>
    </div>
    `;

    usersContainer.innerHTML = card;
  }

  // addViewMoreListeners();
}

// View More Toggle
function addViewMoreListeners() {
  const buttons = document.getElementsByClassName("viewMoreBtn");
  for (let i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener("click", function () {
      const extraInfo = this.nextElementSibling;
      extraInfo.classList.toggle("hidden");
      this.textContent = extraInfo.classList.contains("hidden")
        ? "View More"
        : "View Less";
    });
  }
}

// Populate Filters
function populateFilters(users) {
  const cities = [];
  const companies = [];

  for (let i = 0; i < users.length; i++) {
    if (!cities.includes(users[i].address.city))
      cities.push(users[i].address.city);
    if (!companies.includes(users[i].company.name))
      companies.push(users[i].company.name);
  }

  for (let i = 0; i < cities.length; i++) {
    const option = document.createElement("option");
    option.value = cities[i];
    option.textContent = cities[i];
    cityFilter.appendChild(option);
  }

  for (let i = 0; i < companies.length; i++) {
    const option = document.createElement("option");
    option.value = companies[i];
    option.textContent = companies[i];
    companyFilter.appendChild(option);
  }
}

// Apply Filters and Search
function applyFilters() {
  const searchTerm = searchInput.value.toLowerCase();
  const selectedCity = cityFilter.value;
  const selectedCompany = companyFilter.value;

  const filtered = [];
  for (let i = 0; i < allUsers.length; i++) {
    const user = allUsers[i];
    if (
      (user.name.toLowerCase().includes(searchTerm) ||
        user.username.toLowerCase().includes(searchTerm)) &&
      (selectedCity === "" || user.address.city === selectedCity) &&
      (selectedCompany === "" || user.company.name === selectedCompany)
    ) {
      filtered.push(user);
    }
  }
  displayUsers(filtered);
}

// Event Listeners
searchInput.addEventListener("input", applyFilters);
cityFilter.addEventListener("change", applyFilters);
companyFilter.addEventListener("change", applyFilters);

darkModeToggle.addEventListener("click", () => {
  document.body.classList.toggle("bg-gray-900");
  document.body.classList.toggle("text-white");
});

// Start
fetchUsers();

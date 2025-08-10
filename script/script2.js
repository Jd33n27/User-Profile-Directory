const container = document.getElementById("user-grid");
const statusMessage = document.getElementById("statusMessage");
const searchInput = document.getElementById("searchInput");
const cityFilter = document.getElementById("cityFilter");
const companyFilter = document.getElementById("companyFilter");
const darkModeToggle = document.getElementById("darkModeToggle");
const body = document.getElementById("body");

let allUsers = [];

// Fetch users with async/await
async function getUsers() {
  try {
    showStatus("Loading users...", "text-yellow-300");
    const res = await fetch("https://jsonplaceholder.typicode.com/users");
    if (!res.ok) throw new Error("Failed to fetch users");
    const users = await res.json();
    allUsers = users;
    populateFilters(users);
    showUsers(users);
    showStatus(""); // clear message
  } catch (err) {
    showStatus("❌ Failed to load users. Try again later.", "text-red-400");
    console.error(err);
  }
}

// Show status message
function showStatus(message, classes = "") {
  statusMessage.textContent = message;
  statusMessage.className = `text-center mt-4 ${classes}`;
}

// Display users
function showUsers(users) {
  if (users.length === 0) {
    container.innerHTML = `<p class="text-center text-gray-300">No users found.</p>`;
    return;
  }

  container.innerHTML = users
    .map(
      (user) => `
    <div class="bg-White text-black p-4 rounded-2xl mb-3 shadow-lg transition hover:scale-105" data-city="${user.address.city}" data-company="${user.company.name}">
      <h2 class="font-bold text-lg">${user.name}</h2>
      <p><strong>Username:</strong> ${user.username}</p>
      <p><strong>Email:</strong> ${user.email}</p>
      <p><strong>City:</strong> ${user.address.city}</p>
      <p><strong>Company:</strong> ${user.company.name}</p>
    </div>
  `
    )
    .join("");
}

// Populate dropdown filters
function populateFilters(users) {
  const cities = [...new Set(users.map((u) => u.address.city))];
  const companies = [...new Set(users.map((u) => u.company.name))];

  cities.forEach((city) => {
    cityFilter.innerHTML += `<option value="${city}">${city}</option>`;
  });
  companies.forEach((company) => {
    companyFilter.innerHTML += `<option value="${company}">${company}</option>`;
  });
}

// Filter and search combined
function applyFilters() {
  const searchTerm = searchInput.value.toLowerCase();
  const selectedCity = cityFilter.value;
  const selectedCompany = companyFilter.value;

  const filtered = allUsers.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm) ||
      user.username.toLowerCase().includes(searchTerm);
    const matchesCity =
      selectedCity === "all" || user.address.city === selectedCity;
    const matchesCompany =
      selectedCompany === "all" || user.company.name === selectedCompany;
    return matchesSearch && matchesCity && matchesCompany;
  });

  showUsers(filtered);
}

// Event listeners
searchInput.addEventListener("input", applyFilters);
cityFilter.addEventListener("change", applyFilters);
companyFilter.addEventListener("change", applyFilters);

// Dark mode toggle
darkModeToggle.addEventListener("click", () => {
  body.classList.toggle("bg-gray-900");
  body.classList.toggle("text-white");
});

// Load users on page start
getUsers();

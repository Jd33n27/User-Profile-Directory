// DOM refs
const searchInput = document.getElementById("searchInput");
const cityFilter = document.getElementById("cityFilter");
const companyFilter = document.getElementById("companyFilter");
// const loadingEl = document.getElementById("loading");
const errorEl = document.getElementById("error");
const usersContainer = document.getElementById("usersContainer");
const darkToggle = document.getElementById("darkModeToggle");

let usersData = []; // full data from API

// Show / hide helpers
// function showLoading(show) {
//   if (!loadingEl) return;
//   if (show) loadingEl.classList.remove("hidden");
//   else loadingEl.classList.add("hidden");
// }
// function showError(message) {
//   if (!errorEl) return;
//   if (message) {
//     errorEl.textContent = message;
//     errorEl.classList.remove("hidden");
//   } else {
//     errorEl.textContent = "";
//     errorEl.classList.add("hidden");
//   }
// }

// Fetch users from API
async function fetchUsers() {
  showError("");
  showLoading(true);
  try {
    const res = await fetch("https://jsonplaceholder.typicode.com/users");
    if (!res.ok) throw new Error("Network response was not ok");
    const data = await res.json();
    usersData = data;
    populateFilters(usersData);
    applyFilters(); // display initial list
  } catch (err) {
    console.error(err);
    showError("Failed to load users. Check console for details.");
    usersContainer.innerHTML = ""; // clear any previous content
  } //finally {
  //   showLoading(false);
  // }
}

// Populate city & company <select> controls (no duplicates)
function populateFilters(users) {
  // Clear existing options and add default placeholders
  if (cityFilter) {
    cityFilter.innerHTML = "";
    const opt = document.createElement("option");
    opt.value = "";
    opt.textContent = "Filter by City";
    cityFilter.appendChild(opt);
  }

  if (companyFilter) {
    companyFilter.innerHTML = "";
    const opt2 = document.createElement("option");
    opt2.value = "";
    opt2.textContent = "Filter by Company";
    companyFilter.appendChild(opt2);
  }

  // Use Sets to gather uniques
  const cities = new Set();
  const companies = new Set();
  for (let i = 0; i < users.length; i++) {
    const u = users[i];
    if (u && u.address && u.address.city) cities.add(u.address.city);
    if (u && u.company && u.company.name) companies.add(u.company.name);
  }

  // Append options (simple for..of loop)
  if (cityFilter) {
    for (const c of cities) {
      const opt = document.createElement("option");
      opt.value = c;
      opt.textContent = c;
      cityFilter.appendChild(opt);
    }
  }

  if (companyFilter) {
    for (const c of companies) {
      const opt = document.createElement("option");
      opt.value = c;
      opt.textContent = c;
      companyFilter.appendChild(opt);
    }
  }
}

// Build and show user cards (simple DOM creation)
function displayUsers(users) {
  if (!usersContainer) return;

  usersContainer.innerHTML = ""; // clear

  if (!users || users.length === 0) {
    const p = document.createElement("p");
    p.className = "text-center text-gray-600";
    p.textContent = "No users found.";
    usersContainer.appendChild(p);
    return;
  }

  for (let i = 0; i < users.length; i++) {
    const u = users[i];

    // card wrapper
    const card = document.createElement("div");
    // Keep styling minimal so your Tailwind takes effect in HTML
    card.className =
      "bg-white p-4 rounded-2xl mb-3 shadow transition hover:shadow-lg";

    // card content (you can tweak classes to match your design)
    card.innerHTML = `
      <div class="flex items-start gap-3">
        <div class="avatar bg-gray-200 rounded-full w-12 h-12 flex items-center justify-center">
          <!-- simple icon -->
          <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M5.121 17.804A9 9 0 1118.879 6.196 9 9 0 015.12 17.804z"/>
          </svg>
        </div>
        <div class="grow">
          <div class="user-name font-semibold text-lg">${escapeHtml(
            u.name
          )}</div>
          <div class="text-sm text-gray-600"><strong>Email:</strong> ${escapeHtml(
            u.email
          )}</div>
          <div class="text-sm text-gray-600"><strong>Company:</strong> ${escapeHtml(
            u.company.name
          )}</div>
          <div class="text-sm text-gray-600"><strong>City:</strong> ${escapeHtml(
            u.address.city
          )}</div>
          <div class="mt-3">
            <button class="view-more-btn w-28 text-black border p-2 rounded-2xl cursor-pointer font-bold hover:bg-gray-100">View More</button>
          </div>
          <div class="extra-info hidden mt-3 text-sm">
            <div><strong>Phone:</strong> ${escapeHtml(u.phone)}</div>
            <div><strong>Website:</strong> ${escapeHtml(u.website)}</div>
            <div><strong>Username:</strong> ${escapeHtml(u.username)}</div>
          </div>
        </div>
      </div>
    `;

    // Add View More toggle using direct DOM refs (no delegation needed)
    const viewBtn = card.querySelector(".view-more-btn");
    const extraDiv = card.querySelector(".extra-info");
    if (viewBtn && extraDiv) {
      viewBtn.addEventListener("click", function () {
        if (extraDiv.classList.contains("hidden")) {
          extraDiv.classList.remove("hidden");
          viewBtn.textContent = "View Less";
        } else {
          extraDiv.classList.add("hidden");
          viewBtn.textContent = "View More";
        }
      });
    }

    usersContainer.appendChild(card);
  }
}

// Escape HTML to avoid accidental injection if you test with other data
function escapeHtml(str) {
  if (typeof str !== "string") return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// Filter logic (search + selects)
function applyFilters() {
  const searchTerm =
    searchInput && searchInput.value
      ? searchInput.value.trim().toLowerCase()
      : "";
  const selectedCity = cityFilter ? cityFilter.value : "";
  const selectedCompany = companyFilter ? companyFilter.value : "";

  const result = [];
  for (let i = 0; i < usersData.length; i++) {
    const u = usersData[i];
    // match search (name or username)
    const name = (u.name || "").toLowerCase();
    const username = (u.username || "").toLowerCase();
    const matchesSearch =
      searchTerm === "" ||
      name.indexOf(searchTerm) !== -1 ||
      username.indexOf(searchTerm) !== -1;

    // match city/company
    const cityMatch =
      selectedCity === "" || (u.address && u.address.city === selectedCity);
    const companyMatch =
      selectedCompany === "" ||
      (u.company && u.company.name === selectedCompany);

    if (matchesSearch && cityMatch && companyMatch) {
      result.push(u);
    }
  }

  displayUsers(result);
}

// Dark mode toggle (adds 'dark' to <html> so Tailwind dark: classes work if configured)
if (darkToggle) {
  darkToggle.addEventListener("click", function () {
    document.documentElement.classList.toggle("dark");
  });
}

// Events
if (searchInput) searchInput.addEventListener("input", applyFilters);
if (cityFilter) cityFilter.addEventListener("change", applyFilters);
if (companyFilter) companyFilter.addEventListener("change", applyFilters);

// Initial load
fetchUsers();

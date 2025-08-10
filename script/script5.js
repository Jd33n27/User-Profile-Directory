const userContainer = document.getElementById("userContainer");
const viewMoreBtn = document.getElementById("viewMoreBtn");
const filterButtons = document.querySelectorAll(".filter-btn");
let users = [];
let displayedCount = 0;
const perPage = 6;
let currentGender = "all";

// Fetch users from API
async function fetchUsers() {
  const res = await fetch("https://randomuser.me/api/?results=30");
  const data = await res.json();
  users = data.results;
  renderUsers();
}

function renderUsers(reset = true) {
  if (reset) {
    userContainer.innerHTML = "";
    displayedCount = 0;
  }

  const filtered = users.filter((user) => {
    return currentGender === "all" || user.gender === currentGender;
  });

  const slice = filtered.slice(displayedCount, displayedCount + perPage);

  slice.forEach((user) => {
    const card = document.createElement("div");
    card.className =
      "bg-white dark:bg-gray-800 rounded-lg shadow p-4 text-center";
    card.innerHTML = `
      <img src="${user.picture.large}" alt="${user.name.first}" class="mx-auto rounded-full w-24 h-24">
      <h2 class="mt-3 font-semibold">${user.name.first} ${user.name.last}</h2>
      <p class="text-sm text-gray-600 dark:text-gray-300">${user.email}</p>
      <p class="text-sm text-gray-500 dark:text-gray-400 capitalize">${user.gender}</p>
    `;
    userContainer.appendChild(card);
  });

  displayedCount += slice.length;

  if (displayedCount < filtered.length) {
    viewMoreBtn.classList.remove("hidden");
  } else {
    viewMoreBtn.classList.add("hidden");
  }
}

// Filter button clicks
filterButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    currentGender = btn.dataset.gender;
    renderUsers(true);
  });
});

// View More button click
viewMoreBtn.addEventListener("click", () => {
  renderUsers(false);
});

// Dark mode toggle
document
  .getElementById("darkModeToggle")
  .addEventListener("click", function () {
    document.documentElement.classList.toggle("dark");
    localStorage.setItem(
      "theme",
      document.documentElement.classList.contains("dark") ? "dark" : "light"
    );
  });

// Load saved theme
if (localStorage.getItem("theme") === "dark") {
  document.documentElement.classList.add("dark");
}

// Initial load
fetchUsers();

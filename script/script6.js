// script4.js
// Works with your original HTML IDs/classes:
// #searchInput, #filter-area, .filter-btn (All button is present in HTML),
// #user-grid, #darkModeToggle

const API_URL = "https://jsonplaceholder.typicode.com/users";

const searchInput = document.getElementById("searchInput");
const filterArea = document.getElementById("filter-area");
const userGrid = document.getElementById("user-grid");
const darkModeToggle = document.getElementById("darkModeToggle");

let allUsers = []; // full data from API
let currentFilterType = "all"; // 'all' | 'city' | 'company'
let currentFilterValue = ""; // value for the filter

// ---------- UTIL: simple HTML escape ----------
function escapeHtml(str) {
  if (!str && str !== 0) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// ---------- show loading / error inline inside grid ----------
function showLoading() {
  userGrid.innerHTML =
    '<p class="text-center text-lg text-White/80">Loading users…</p>';
}
function showError(message) {
  userGrid.innerHTML = `<p class="text-center text-lg text-red-400">${escapeHtml(
    message
  )}</p>`;
}

// ---------- fetch users ----------
async function fetchUsers() {
  showLoading();
  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error("Network response was not ok");
    const data = await res.json();

    // store
    allUsers = data;

    // render filters (buttons) and initial cards
    buildFilterButtons(allUsers);
    applyFiltersAndSearch(); // will render initial list
  } catch (err) {
    console.error(err);
    showError("Failed to load users — check console for details.");
  }
}

// ---------- build filter buttons (cities first, then companies) ----------
function buildFilterButtons(users) {
  // clear existing (except keep the 'All' button if present)
  // we'll keep the first All button (data-filter-type="all") and remove any other dynamically-added children
  const existingAll = filterArea.querySelector('[data-filter-type="all"]');
  filterArea.innerHTML = "";
  if (existingAll) filterArea.appendChild(existingAll);

  // gather uniques using plain loops
  const citiesSet = {};
  const companiesSet = {};

  for (let i = 0; i < users.length; i++) {
    const u = users[i];
    if (u && u.address && u.address.city) {
      citiesSet[u.address.city] = true;
    }
    if (u && u.company && u.company.name) {
      companiesSet[u.company.name] = true;
    }
  }

  // create city buttons
  for (const city in citiesSet) {
    if (!citiesSet.hasOwnProperty(city)) continue;
    const btn = document.createElement("button");
    btn.className =
      "filter-btn py-2 px-4 bg-ButtonBg text-White text-sm rounded-3xl cursor-pointer whitespace-nowrap transition-all duration-300 ease-in-out hover:translate-y-[-2px] hover:bg-Button-Hover";
    btn.setAttribute("data-filter-type", "city");
    btn.setAttribute("data-filter-value", city);
    btn.textContent = city;
    filterArea.appendChild(btn);
  }

  // small separator (visual) - optional: we won't change styling, we just keep whitespace
  // create company buttons
  for (const comp in companiesSet) {
    if (!companiesSet.hasOwnProperty(comp)) continue;
    const btn = document.createElement("button");
    btn.className =
      "filter-btn py-2 px-4 bg-ButtonBg text-White text-sm rounded-3xl cursor-pointer whitespace-nowrap transition-all duration-300 ease-in-out hover:translate-y-[-2px] hover:bg-Button-Hover";
    btn.setAttribute("data-filter-type", "company");
    btn.setAttribute("data-filter-value", comp);
    btn.textContent = comp;
    filterArea.appendChild(btn);
  }

  // attach click listeners to all current filter buttons
  attachFilterButtonListeners();
}

// ---------- attach listener to filter buttons ----------
function attachFilterButtonListeners() {
  const buttons = filterArea.querySelectorAll(".filter-btn");
  for (let i = 0; i < buttons.length; i++) {
    const btn = buttons[i];
    btn.removeEventListener("click", filterBtnHandler); // safe-remove
    btn.addEventListener("click", filterBtnHandler);
  }
}

function filterBtnHandler(e) {
  const btn = e.currentTarget;
  const fType = btn.getAttribute("data-filter-type") || "all";
  const fValue = btn.getAttribute("data-filter-value") || "";

  // update UI active state: remove 'active' from all then add to clicked (keeps your classes)
  const allBtns = filterArea.querySelectorAll(".filter-btn");
  for (let j = 0; j < allBtns.length; j++) {
    allBtns[j].classList.remove("active"); // your CSS likely has .active; we remove it first
  }
  btn.classList.add("active");

  // update state
  currentFilterType = fType;
  currentFilterValue = fValue;

  applyFiltersAndSearch();
}

// ---------- apply search + filter on allUsers (no .map, simple loop) ----------
function applyFiltersAndSearch() {
  const term =
    searchInput && searchInput.value
      ? searchInput.value.trim().toLowerCase()
      : "";

  const result = [];
  for (let i = 0; i < allUsers.length; i++) {
    const u = allUsers[i];

    // search match: name or username
    const name = (u.name || "").toLowerCase();
    const username = (u.username || "").toLowerCase();
    const matchesSearch =
      term === "" || name.indexOf(term) !== -1 || username.indexOf(term) !== -1;

    // filter match
    let matchesFilter = true;
    if (currentFilterType === "city" && currentFilterValue) {
      matchesFilter = u.address && u.address.city === currentFilterValue;
    } else if (currentFilterType === "company" && currentFilterValue) {
      matchesFilter = u.company && u.company.name === currentFilterValue;
    } else if (currentFilterType === "all") {
      matchesFilter = true;
    }

    if (matchesSearch && matchesFilter) {
      result.push(u);
    }
  }

  renderUsers(result);
}

// ---------- renderUsers: builds the same card markup style you used previously ----------
function renderUsers(users) {
  // if empty -> show message
  if (!users || users.length === 0) {
    userGrid.innerHTML =
      '<p class="text-center text-White/70">No matching users found.</p>';
    return;
  }

  // build html using string concat (like your earlier version)
  let html = "";

  for (let i = 0; i < users.length; i++) {
    const user = users[i];

    // keep same data attributes you used before so your CSS / existing logic remains compatible
    const dept = escapeHtml((user.company && user.company.name) || "");
    const city = escapeHtml((user.address && user.address.city) || "");

    html += ` <div
      class="user-card-mobile mx-auto bg-White backdrop-blur-lg p-4 rounded-2xl mb-3.5 flex items-center gap-3.5 transition-all duration-300 ease-in-out hover:translate-x-1.5 md:flex-col md:p-6 md:rounded-[20px] md:border-Button-Bg md:border md:hover:translate-y-[-5px] md:w-xs"
      data-department="${dept}"
      data-city="${city}"
    >
      <!-- Profile Icon -->
      <div
        class="avatar bg-linear-to-tr from-ProfileColor1 to-ProfileColor2 rounded-full text-dark-card md:mx-auto"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.0" stroke="currentColor" class="size-14 md:size-20">
          <path stroke-linecap="round" stroke-linejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/>
        </svg>
      </div>
      <div class="grow">
        <div class="user-name font-semibold mb-1.5 text-User-name md:text-2xl">
          ${escapeHtml(user.name)}
        </div>
        <div class="user-title text-sm mb-2">
          <strong class="font-bold"> Email: </strong> ${escapeHtml(user.email)}
        </div>
        <div class="user-title text-sm mb-2">
          <strong class="font-bold"> Company: </strong> ${escapeHtml(
            (user.company && user.company.name) || ""
          )}
        </div>
        <div class="flex text-sm">
          <button class="w-24 text-black border p-2 rounded-2xl cursor-pointer font-bold hover:bg-Gray view-more-btn" data-target="details-${
            user.id
          }">
            View More
          </button>
        </div>

        <div id="details-${
          user.id
        }" class="user-contact flex gap-4 text-sm flex-col md:gap-1 font-Montserrat hidden mt-3">
          <div class="contact-item flex items-center gap-1.5">
            <strong class="font-bold"> Phone: </strong> ${escapeHtml(
              user.phone
            )}
          </div>
          <div class="contact-item flex items-center gap-1.5">
            <strong class="font-bold"> Website: </strong> ${escapeHtml(
              user.website
            )}
          </div>
          <div class="contact-item flex items-center gap-1.5">
            <strong class="font-bold"> City: </strong> ${escapeHtml(
              (user.address && user.address.city) || ""
            )}
          </div>
          <div class="contact-item flex items-center gap-1.5">
            <strong class="font-bold"> Username: </strong> ${escapeHtml(
              user.username
            )}
          </div>
        </div>
      </div>
    </div>`;
  }

  userGrid.innerHTML = html;

  // add view-more listeners (simple loop)
  const viewButtons = userGrid.querySelectorAll(".view-more-btn");
  for (let i = 0; i < viewButtons.length; i++) {
    const btn = viewButtons[i];
    btn.removeEventListener("click", onViewMoreClick); // safe-remove
    btn.addEventListener("click", onViewMoreClick);
  }
}

function onViewMoreClick(e) {
  const btn = e.currentTarget;
  const targetId = btn.getAttribute("data-target");
  const details = document.getElementById(targetId);
  if (!details) return;
  if (details.classList.contains("hidden")) {
    details.classList.remove("hidden");
    btn.textContent = "View Less";
  } else {
    details.classList.add("hidden");
    btn.textContent = "View More";
  }
}

// ---------- search input ----------
if (searchInput) {
  searchInput.addEventListener("input", function () {
    applyFiltersAndSearch();
  });
}

// ---------- dark mode setup ----------
if (darkModeToggle) {
  // apply saved preference on load
  const saved = localStorage.getItem("theme");
  if (saved === "dark") {
    document.documentElement.classList.add("dark");
  }

  darkModeToggle.addEventListener("click", function () {
    document.documentElement.classList.toggle("dark");
    const isDark = document.documentElement.classList.contains("dark");
    localStorage.setItem("theme", isDark ? "dark" : "light");

    // update aria pressed
    darkModeToggle.setAttribute("aria-pressed", isDark ? "true" : "false");
  });
}

// ---------- start ----------
fetchUsers();

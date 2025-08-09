// script.js
// Works with the exact HTML above:
// IDs: #searchInput, #filterName, #filterCity, #darkModeToggle, #user-grid

(function () {
  const API = "https://jsonplaceholder.typicode.com/users";

  // DOM refs
  const searchInput = document.getElementById("searchInput");
  const filterNameBtn = document.getElementById("filterName");
  const filterCityBtn = document.getElementById("filterCity");
  const darkModeToggle = document.getElementById("darkModeToggle");
  const userGrid = document.getElementById("user-grid");
  const darkIcon = document.getElementById("darkIcon");

  // state
  let users = []; // full data
  let activeMode = "name"; // 'name' or 'city' (default name)

  // --- Utilities ---
  function escapeHtml(str) {
    if (typeof str !== "string") return "";
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function showLoading() {
    userGrid.innerHTML = `
      <div class="py-10 text-center">
        <span class="inline-block animate-pulse text-White/80">Loading users…</span>
      </div>`;
  }

  function showError(message) {
    userGrid.innerHTML = `
      <div class="py-10 text-center">
        <span class="text-red-400">${escapeHtml(message)}</span>
      </div>`;
  }

  // --- Fetch users ---
  async function fetchUsers() {
    showLoading();
    try {
      const res = await fetch(API);
      if (!res.ok) throw new Error("Network error while fetching users.");
      const data = await res.json();
      users = data;
      renderUsers(users); // initial render
    } catch (err) {
      console.error(err);
      showError("Failed to load users. Check console for details.");
    }
  }

  // --- Render users (build card markup using your original classes) ---
  function renderUsers(list) {
    if (!list || list.length === 0) {
      userGrid.innerHTML =
        '<p class="text-center text-White/70 py-10">No users found.</p>';
      return;
    }

    // build html via concatenation (keeps your markup identical)
    let html = "";
    for (let i = 0; i < list.length; i++) {
      const u = list[i];

      // keep same attributes/classes as your original cards
      const dept = escapeHtml((u.company && u.company.name) || "");
      const city = escapeHtml((u.address && u.address.city) || "");

      html += ` <div
        class="user-card-mobile mx-auto bg-White backdrop-blur-lg p-4 rounded-2xl mb-3.5 flex items-center gap-3.5 transition-all duration-300 ease-in-out hover:translate-x-1.5 md:flex-col md:p-6 md:rounded-[20px] md:border-Button-Bg md:border md:hover:translate-y-[-5px] md:w-xs"
        data-department="${dept}"
        data-city="${city}"
      >
        <!-- Profile Icon -->
        <div class="avatar bg-linear-to-tr from-ProfileColor1 to-ProfileColor2 rounded-full text-dark-card md:mx-auto">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.0" stroke="currentColor" class="size-14 md:size-20">
            <path stroke-linecap="round" stroke-linejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/>
          </svg>
        </div>

        <div class="grow">
          <div class="user-name font-semibold mb-1.5 text-User-name md:text-2xl">
            ${escapeHtml(u.name)}
          </div>

          <div class="user-title text-sm mb-2">
            <strong class="font-bold"> Email: </strong> ${escapeHtml(u.email)}
          </div>

          <div class="user-title text-sm mb-2">
            <strong class="font-bold"> Company: </strong> ${escapeHtml(
              (u.company && u.company.name) || ""
            )}
          </div>

          <div class="flex text-sm">
            <button class="w-24 text-black border p-2 rounded-2xl cursor-pointer font-bold hover:bg-Gray view-more-btn" data-target="details-${
              u.id
            }">
              View More
            </button>
          </div>

          <div id="details-${
            u.id
          }" class="user-contact flex gap-4 text-sm flex-col md:gap-1 font-Montserrat hidden mt-3">
            <div class="contact-item flex items-center gap-1.5">
              <strong class="font-bold"> Phone: </strong> ${escapeHtml(u.phone)}
            </div>
            <div class="contact-item flex items-center gap-1.5">
              <strong class="font-bold"> Website: </strong> ${escapeHtml(
                u.website
              )}
            </div>
            <div class="contact-item flex items-center gap-1.5">
              <strong class="font-bold"> City: </strong> ${city}
            </div>
            <div class="contact-item flex items-center gap-1.5">
              <strong class="font-bold"> Username: </strong> ${escapeHtml(
                u.username
              )}
            </div>
          </div>
        </div>
      </div>`;
    }

    userGrid.innerHTML = html;

    // attach view-more listeners
    const viewBtns = userGrid.querySelectorAll(".view-more-btn");
    for (let i = 0; i < viewBtns.length; i++) {
      const btn = viewBtns[i];
      btn.removeEventListener("click", onViewMoreClick);
      btn.addEventListener("click", onViewMoreClick);
    }
  }

  function onViewMoreClick(e) {
    const btn = e.currentTarget;
    const target = btn.getAttribute("data-target");
    const details = document.getElementById(target);
    if (!details) return;
    if (details.classList.contains("hidden")) {
      details.classList.remove("hidden");
      btn.textContent = "View Less";
    } else {
      details.classList.add("hidden");
      btn.textContent = "View More";
    }
  }

  // --- Filtering (Name vs City) ---
  function applySearchFilter() {
    const q = (searchInput.value || "").trim().toLowerCase();

    // result collection
    const out = [];
    for (let i = 0; i < users.length; i++) {
      const u = users[i];
      if (!u) continue;

      if (activeMode === "name") {
        const name = (u.name || "").toLowerCase();
        const username = (u.username || "").toLowerCase();
        if (q === "" || name.indexOf(q) !== -1 || username.indexOf(q) !== -1) {
          out.push(u);
        }
      } else if (activeMode === "city") {
        const city = ((u.address && u.address.city) || "").toLowerCase();
        if (q === "" || city.indexOf(q) !== -1) {
          out.push(u);
        }
      } else {
        // fallback: show all
        out.push(u);
      }
    }

    renderUsers(out);
  }

  // --- Button active handling ---
  function setActiveMode(mode) {
    activeMode = mode === "city" ? "city" : "name";

    // update button visual states: highlighted color in light/dark
    if (activeMode === "name") {
      filterNameBtn.classList.add("active-mode");
      filterCityBtn.classList.remove("active-mode");
    } else {
      filterCityBtn.classList.add("active-mode");
      filterNameBtn.classList.remove("active-mode");
    }

    // run filter on mode change
    applySearchFilter();
  }

  // small helper to add nice active-mode classes via Tailwind-compatible classes
  // we add a CSS class name 'active-mode' to buttons in markup; ensure it exists via inline styles below
  // but we will also set classes directly so it works even without extra CSS
  (function ensureActiveModeStyling() {
    // add inline-tailwind-ish classes for visual highlight
    const activeClass =
      "bg-amber-300 text-black dark:bg-amber-500 dark:text-black";
    // apply initial style for the default active button (Name is default)
    if (filterNameBtn) filterNameBtn.classList.add(...activeClass.split(" "));
  })();

  // --- Dark mode toggle (top-right) ---
  (function setupDarkMode() {
    // Apply saved preference
    const saved = localStorage.getItem("theme");
    if (saved === "dark") {
      document.documentElement.classList.add("dark");
      if (darkIcon) darkIcon.textContent = "☀️";
      if (darkModeToggle) darkModeToggle.setAttribute("aria-pressed", "true");
    }

    if (darkModeToggle) {
      darkModeToggle.addEventListener("click", function () {
        const isDark = document.documentElement.classList.toggle("dark");
        localStorage.setItem("theme", isDark ? "dark" : "light");
        if (darkIcon) darkIcon.textContent = isDark ? "☀️" : "🌙";
        darkModeToggle.setAttribute("aria-pressed", isDark ? "true" : "false");
      });
    }
  })();

  // --- Events ---
  if (filterNameBtn) {
    filterNameBtn.addEventListener("click", function () {
      setActiveMode("name");
    });
  }
  if (filterCityBtn) {
    filterCityBtn.addEventListener("click", function () {
      setActiveMode("city");
    });
  }

  if (searchInput) {
    searchInput.addEventListener("input", function () {
      applySearchFilter();
    });
  }

  // --- start ---
  fetchUsers();
})();

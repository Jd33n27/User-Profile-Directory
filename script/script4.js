// Get references to all necessary elements
var searchInput = document.getElementById("searchInput");
var filterButtons = document.getElementsByClassName("filter-btn");
var mobileCards = document.getElementsByClassName("user-card-mobile");

// Get the container where we'll put user cards
const container = document.getElementById("user-grid");
var currentFilter = "all";

// Api URL
const apiUrl = "https://jsonplaceholder.typicode.com/users";

// Function to get users from the API
async function getUsers() {
  try {
    const response = await fetch(apiUrl);
    const userData = await response.json();
    const users = userData;
    showUsers(users);
  } catch (error) {
    const showError = error.toString();
    container.innerHTML = `<div class="mx-auto text-xl font-semibold text-center">${showError}</div>`;
  }
}

// Function to display users on the page
function showUsers(users) {
  let html = ""; // Empty string to build HTML

  // Loop through each user
  for (let i = 0; i < users.length; i++) {
    const user = users[i];

    html += ` <div
          class="user-card-mobile mx-auto bg-White backdrop-blur-lg p-4 rounded-2xl mb-3.5 flex items-center gap-3.5 transition-all duration-300 ease-in-out hover:translate-x-1.5 md:flex-col md:p-6 md:rounded-[20px] md:border-Button-Bg md:border md:hover:translate-y-[-5px] md:w-xs"
          data-department="${user.company.name}"
        >
          <!-- Profile Icon -->
          <div
            class="avatar bg-linear-to-tr from-ProfileColor1 to-ProfileColor2 rounded-full text-dark-card md:mx-auto"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.0"
              stroke="currentColor"
              class="size-14 md:size-20"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
              />
            </svg>
          </div>
          <div id="user-info" class="grow">
            <div
              class="user-name font-semibold mb-1.5 text-User-name md:text-2xl"
            >
              ${user.name}
            </div>
            <div class="user-title text-sm mb-2">
              <strong class="font-bold"> Email: </strong> ${user.email}
            </div>
            <div
              class="user-title text-sm mb-2"
            >
              <strong class="font-bold"> Company: </strong> ${user.company.name}
            </div>
            <div
              class="user-title text-sm mb-2"
            >
              <strong class="font-bold"> City: </strong> ${user.address.city}
            </div>
            <div class="flex text-sm">
              <button class="w-24 text-black border p-2 rounded-2xl cursor-pointer font-bold hover:bg-Gray" onclick="toggleDetails('details-${user.id}')">
                View More
              </button>
            </div>


            <div id="details-${user.id}"
              class="user-contact gap-4 text-sm flex-col md:gap-1 font-Montserrat hidden"
            >
              <div class="contact-item flex items-center gap-1.5">
                <strong class="font-bold"> Phone: </strong> ${user.phone}
              </div>
              <div class="contact-item flex items-center gap-1.5">
                <strong class="font-bold"> Website: </strong> ${user.website}
              </div>
            </div>
          </div>
        </div>`;
  }

  container.innerHTML = html; // Put all HTML on the page
}

// Function to toggle details visibility
function toggleDetails(id) {
  const section = document.getElementById(id);
  section.classList.toggle("flex");
  section.classList.toggle("hidden");
}

function toggleTheme() {
  const themeButton = document.getElementById("theme-button");
  themeButton.classList.toggle("active");
}
// Start getting users when page loads
getUsers();

// Function to filter users
function filterUsers(searchTerm, filter) {
  var allCards = [];

  for (var j = 0; j < mobileCards.length; j++) {
    allCards.push(mobileCards[j]);
  }

  // Loop through each card and decide whether to show or hide
  for (var k = 0; k < allCards.length; k++) {
    var card = allCards[k];
    var name = card.querySelector(".user-name").textContent.toLowerCase();
    var title = card.querySelector(".user-title").textContent.toLowerCase();
    var department = card.getAttribute("data-department");

    var matchesSearch =
      name.indexOf(searchTerm) !== -1 || title.indexOf(searchTerm) !== -1;
    var matchesFilter = filter === "all" || department === filter;

    if (matchesSearch && matchesFilter) {
      if (card.classList.contains("user-card-mobile")) {
        card.style.display = "flex";
      } else {
        card.style.display = "block";
      }
    } else {
      card.style.display = "none";
    }
  }
}

// Event listener for the search input
searchInput.addEventListener("input", function (event) {
  var searchTerm = event.target.value.toLowerCase();
  filterUsers(searchTerm, currentFilter);
});

// Event listeners for each filter button
for (var i = 0; i < filterButtons.length; i++) {
  filterButtons[i].addEventListener("click", function () {
    // Remove active class from all buttons
    for (var j = 0; j < filterButtons.length; j++) {
      filterButtons[j].classList.remove("active");
    }

    // Add active class to clicked button
    this.classList.add("active");

    // Set current filter
    currentFilter = this.getAttribute("data-filter");

    // // Get current search value
    // var searchTerm = searchInput.value.toLowerCase();

    // // Filter again
    // filterUsers(searchTerm, currentFilter);
  });
}

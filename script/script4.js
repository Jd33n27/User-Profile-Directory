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
    users = userData;
    showUsers(users);
  } catch (error) {
    // Displaying Error to user
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
          data-filter="${user.company.name}"
        >
          <!-- Profile Icon -->
          <div id="avatar"
            class="bg-linear-to-tr from-ProfileColor1 to-ProfileColor2 rounded-full text-dark-card md:mx-auto"
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
  const body = document.body;
  const avatars = document.getElementById("avatar");

  const themeButton = document.getElementById("theme-button");
  themeButton.classList.toggle("active");
  if (body.classList.contains("from-GradientBlue" || "to-GradientPurple")) {
    // To Change body to Dark Theme
    body.classList.remove("from-GradientBlue", "to-GradientPurple");
    body.classList.add(
      "from-darkmode-gradient-1",
      "from-0%",
      "via-darkmode-gradient-2",
      "via-50%",
      "to-darkmode-gradient-3",
      "to-100%"
    );

    // To Change search bar to dark theme
    searchInput.classList.remove("bg-Button");
    searchInput.classList.add(
      "bg-search-darkmode",
      "border-2",
      "border-search-border-darkmode",
      "placeholder:text-search-border-darkmode"
    );

    for (let i = 0; i < avatars.length; i++) {
      const avatar = avatars[i];
      // To Change avatar to dark theme
      avatar.classList.remove("from-ProfileColor1", "to-ProfileColor2");
      avatar.classList.add(
        "from-Profile-darkmode-Color1",
        "to-Profile-darkmode-Color2"
      );
      console.log(avatars);
    }
    console.log(avatars);

    // To change content of button to Light Mode
    themeButton.textContent = "Light Theme";
  } else {
    // To Change Theme of Body to Light Theme
    body.classList.add("from-GradientBlue", "to-GradientPurple");
    body.classList.remove(
      "from-darkmode-gradient-1",
      "from-0%",
      "via-darkmode-gradient-2",
      "via-50%",
      "to-darkmode-gradient-3",
      "to-100%"
    );

    // To Change search bar to light theme
    searchInput.classList.add("bg-Button");
    searchInput.classList.remove(
      "bg-search-darkmode",
      "border-2",
      "border-search-border-darkmode",
      "placeholder:text-search-border-darkmode"
    );

    for (let i = 0; i < avatars.length; i++) {
      const avatar = avatars[i];
      // To Change avatar to light theme
      avatar.classList.add("from-ProfileColor1", "to-ProfileColor2");
      avatar.classList.remove(
        "from-Profile-darkmode-Color1",
        "to-Profile-darkmode-Color2"
      );
      console.log(avatars);
    }
    console.log(avatars);
    // To change content of button to Dark Mode
    themeButton.textContent = "Dark Theme";
  }
}

// Function to handle fiter button clicks
for (let btn of filterButtons) {
  btn.addEventListener("click", function () {
    for (let b of filterButtons) {
      b.classList.remove("active");
    }

    this.classList.add("active");
    currentFilter = this.getAttribute("data-filter").toLowerCase();

    searchUsers();
  });
}

function searchUsers() {
  const query = searchInput.value.toLowerCase();
  let filtererdUsers = users.filter((user) => {
    if (currentFilter === "name") {
      return user.name.toLowerCase().includes(query);
    } else if (currentFilter === "company") {
      return user.company.name.toLowerCase().includes(query);
    } else if (currentFilter === "city") {
      return user.address.city.toLowerCase().includes(query);
    }
    return true;
  });

  showUsers(filtererdUsers);
}

searchInput.addEventListener("input", searchUsers);

// Start getting users when page loads
getUsers();

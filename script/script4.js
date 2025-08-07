// const searchInput = document.getElementById("searchInput");
// const filterBtns = document.querySelectorAll(".filter-btn");
// const desktopCards = document.querySelectorAll(".user-card-desktop");
// const mobileCards = document.querySelectorAll(".user-card-mobile");
// let currentFilter = "all";

// // Search functionality
// searchInput.addEventListener("input", (e) => {
//   const searchTerm = e.target.value.toLowerCase();
//   filterUsers(searchTerm, currentFilter);
// });

// // Filter functionality
// filterBtns.forEach((btn) => {
//   btn.addEventListener("click", () => {
//     filterBtns.forEach((b) => b.classList.remove("active"));
//     btn.classList.add("active");
//     currentFilter = btn.dataset.filter;
//     const searchTerm = searchInput.value.toLowerCase();
//     filterUsers(searchTerm, currentFilter);
//   });
// });

// function filterUsers(searchTerm, filter) {
//   const allCards = [...desktopCards, ...mobileCards];

//   allCards.forEach((card) => {
//     const name = card.querySelector(".user-name").textContent.toLowerCase();
//     const title = card.querySelector(".user-title").textContent.toLowerCase();
//     const department = card.dataset.department;

//     const matchesSearch =
//       name.includes(searchTerm) || title.includes(searchTerm);
//     const matchesFilter = filter === "all" || department === filter;

//     if (matchesSearch && matchesFilter) {
//       card.style.display = "block";
//       if (card.classList.contains("user-card-mobile")) {
//         card.style.display = "flex";
//       }
//     } else {
//       card.style.display = "none";
//     }
//   });
// }

// // Add hover animations
// const allCards = [...desktopCards, ...mobileCards];
// allCards.forEach((card) => {
//   card.addEventListener("mouseenter", () => {
//     card.style.transform = card.classList.contains("user-card-desktop")
//       ? "translateY(-5px) scale(1.02)"
//       : "translateX(8px)";
//   });

//   card.addEventListener("mouseleave", () => {
//     card.style.transform = "none";
//   });
// });

// // Smooth scroll animations
// const observerOptions = {
//   threshold: 0.1,
//   rootMargin: "0px 0px -50px 0px",
// };

// const observer = new IntersectionObserver((entries) => {
//   entries.forEach((entry) => {
//     if (entry.isIntersecting) {
//       entry.target.style.opacity = "1";
//       entry.target.style.transform = "translateY(0)";
//     }
//   });
// }, observerOptions);

// allCards.forEach((card) => {
//   card.style.opacity = "0";
//   card.style.transform = "translateY(20px)";
//   card.style.transition = "opacity 0.6s ease, transform 0.6s ease";
//   observer.observe(card);
// });

// Get references to all necessary elements
var searchInput = document.getElementById("searchInput");
var filterButtons = document.getElementsByClassName("filter-btn");
var desktopCards = document.getElementsByClassName("user-card-desktop");
var mobileCards = document.getElementsByClassName("user-card-mobile");
var currentFilter = "all";

// Function to filter users
function filterUsers(searchTerm, filter) {
  var allCards = [];

  // Combine desktop and mobile cards into one array
  for (var i = 0; i < desktopCards.length; i++) {
    allCards.push(desktopCards[i]);
  }

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

    // Get current search value
    var searchTerm = searchInput.value.toLowerCase();

    // Filter again
    filterUsers(searchTerm, currentFilter);
  });
}

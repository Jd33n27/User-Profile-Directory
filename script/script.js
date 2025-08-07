// Get the container where we'll put user cards
const container = document.getElementById("user-grid");

// Function to get users from the internet
function getUsers() {
  fetch("https://jsonplaceholder.typicode.com/users")
    .then((response) => response.json()) // Convert to JavaScript
    .then((users) => showUsers(users)) // Show the users
    .catch((error) => {
      // Log error to console as string
      console.log("Error fetching users: " + error.toString());
      container.innerHTML =
        '<p class="text-red-400 text-center text-lg">Something went wrong! Check console for details.</p>';
    });
}

// Function to display users on the page
function showUsers(users) {
  let html = ""; // Empty string to build HTML

  // Loop through each user
  for (let i = 0; i < users.length; i++) {
    const user = users[i];

    html += `
                    <div class="bg-dark-card border-2 border-gold p-5 m-4 rounded-lg shadow-lg">
                        <h3 class="text-gold text-2xl mb-3 font-bold">${user.name}</h3>
                        <p class="my-2 text-gray-200"><strong>Email:</strong> ${user.email}</p>
                        <p class="my-2 text-gray-200"><strong>Company:</strong> ${user.company.name}</p>
                        <p class="my-2 text-gray-200"><strong>City:</strong> ${user.address.city}</p>
                        
                        <button class="bg-gold text-black border-none py-2 px-4 rounded cursor-pointer mt-4 font-bold hover:bg-yellow-300" onclick="toggleDetails('details-${user.id}')">
                            View More
                        </button>
                        
                        <div id="details-${user.id}" class="mt-4 pt-4 border-t border-gold hidden">
                            <p class="my-2 text-gray-200"><strong>Phone:</strong> ${user.phone}</p>
                            <p class="my-2 text-gray-200"><strong>Website:</strong> ${user.website}</p>
                        </div>
                    </div>
                `;
  }

  container.innerHTML = html; // Put all HTML on the page
}

// Function to toggle details visibility
function toggleDetails(id) {
  const section = document.getElementById(id);
  section.classList.toggle("hidden");
}

// Start getting users when page loads
getUsers();

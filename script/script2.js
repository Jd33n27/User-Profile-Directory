// const userGrid = document.getElementById("user-grid");

// async function fetchUsers() {
//   try {
//     const response = await fetch("https://jsonplaceholder.typicode.com/users");
//     // if (!response.ok) throw new Error("Failed to fetch users");

//     const users = await response.json();
//     displayUsers(users);
//   } catch (error) {
//     userGrid.innerHTML = `<p class="text-red-500 text-center">Error: ${error.message}</p>`;
//   }
// }



// function toggleDetails(id) {
//   const section = document.getElementById(id);
//   section.classList.toggle("hidden");
// }

// fetchUsers();

// // function displayUsers(users) {
// //   userGrid.innerHTML = users
// //     .map((user) => {
// //       return `
// //       <div class="bg-white p-6 rounded-lg shadow-md">
// //         <h2 class="text-xl font-semibold mb-2">${user.name}</h2>
// //         <p><strong>Email:</strong> ${user.email}</p>
// //         <p><strong>Company:</strong> ${user.company.name}</p>
// //         <p><strong>City:</strong> ${user.address.city}</p>

// //         <button onclick="toggleDetails('details-${user.id}')" class="mt-4 text-blue-600 hover:underline">
// //           View More
// //         </button>

// //         <div id="details-${user.id}" class="hidden mt-2">
// //           <p><strong>Phone:</strong> ${user.phone}</p>
// //           <p><strong>Website:</strong> ${user.website}</p>
// //         </div>
// //       </div>
// //     `;
// //     })
// //     .join("");
// // }



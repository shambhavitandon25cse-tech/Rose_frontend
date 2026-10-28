console.log("Rose website JavaScript is connected!");
// Select the Continue as Guest button
const guestButton = document.getElementById("guestButton");

// Handle the button click
if (guestButton) {
    guestButton.addEventListener("click", function () {
        window.location.href = "products.html";
    });
}
// ===================================
// PRODUCT SEARCH
// ===================================

// Select the search input
const searchInput = document.querySelector(".search-input");

// Select all product cards
const productCards = document.querySelectorAll(".card");

// Select the product count text
const productCount = document.querySelector(".section-heading span");

// Run this code only on pages containing the search bar
if (searchInput) {

    searchInput.addEventListener("input", function () {

        // Get the text entered by the user
        const searchText = searchInput.value.toLowerCase().trim();

        // Count matching products
        let visibleCount = 0;

        // Check every product card
        productCards.forEach(function (card) {

            const productText = card.textContent.toLowerCase();

            // Check whether the product matches the search
            if (productText.includes(searchText)) {

                card.style.display = "";
                visibleCount++;

            } else {

                card.style.display = "none";

            }

        });

        // Update the number of displayed products
        if (productCount) {
            productCount.textContent = visibleCount + " products";
        }

    });

}
// ===================================
// PRODUCT SORTING
// ===================================

const sortSelect = document.querySelector(".sort-value");
const productGrid = document.querySelector(".grid");

if (sortSelect && productGrid) {

    // Remember the original order of the products
    const originalCards = Array.from(
        productGrid.querySelectorAll(".card")
    );

    sortSelect.addEventListener("change", function () {

        // Create a fresh array of the current product cards
        const cards = Array.from(
            productGrid.querySelectorAll(".card")
        );

        // Sort the products
        cards.sort(function (a, b) {

            if (sortSelect.value === "price-asc" ||
                sortSelect.value === "price-desc") {

                const priceA = Number(
                    a.querySelector(".p-price").textContent
                        .replace(/[^\d.]/g, "")
                );

                const priceB = Number(
                    b.querySelector(".p-price").textContent
                        .replace(/[^\d.]/g, "")
                );

                if (sortSelect.value === "price-asc") {
                    return priceA - priceB;
                }

                return priceB - priceA;
            }

            if (sortSelect.value === "rating-desc") {

                const ratingA = parseFloat(
                    a.querySelector(".p-rating").textContent
                );

                const ratingB = parseFloat(
                    b.querySelector(".p-rating").textContent
                );

                return ratingB - ratingA;
            }

            // Restore original order when Featured is selected
            return (
                originalCards.indexOf(a) -
                originalCards.indexOf(b)
            );
        });

        // Update the product grid
        cards.forEach(function (card) {
            productGrid.appendChild(card);
        });

    });

}
// Save button interaction
const saveButtons = document.querySelectorAll(".heart");

saveButtons.forEach(function (button) {
    button.addEventListener("click", function () {
        if (button.textContent.trim() === "Save") {
            button.textContent = "Saved";
        } else {
            button.textContent = "Save";
        }
    });
});
// Login form validation
// LOGIN FORM VALIDATION AND JSON DOWNLOAD

const loginForm = document.getElementById("loginForm");

if (loginForm) {
    loginForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value;

        // Check for empty fields
        if (email === "" || password.trim() === "") {
            alert("Please fill in all fields.");
            return;
        }

        // Validate email format
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailPattern.test(email)) {
            alert("Please enter a valid email address.");
            return;
        }

        // Prepare login submission data
        const loginData = {
            email: email,
            submittedAt: new Date().toISOString()
        };

        // Convert data to JSON
        const jsonData = JSON.stringify(loginData, null, 4);

        // Create downloadable JSON file
        const blob = new Blob([jsonData], {
            type: "application/json"
        });

        const url = URL.createObjectURL(blob);
        const downloadLink = document.createElement("a");

        downloadLink.href = url;
        downloadLink.download = "login_submission.json";

        document.body.appendChild(downloadLink);
        downloadLink.click();

        document.body.removeChild(downloadLink);
        URL.revokeObjectURL(url);

        // Display success message
        alert("Login form submitted successfully! Your JSON file has been downloaded.");

        // Clear the form
        loginForm.reset();
    });
}

// CONTACT FORM VALIDATION

// CONTACT FORM VALIDATION AND JSON DOWNLOAD

const contactForm = document.getElementById("contactForm");

if (contactForm) {
    contactForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const name = contactForm.querySelector('[name="name"]');
        const email = contactForm.querySelector('[name="email"]');
        const message = contactForm.querySelector('[name="message"]');
        const formMessage = document.getElementById("formMessage");

        // Get the submitted values
        const nameValue = name.value.trim();
        const emailValue = email.value.trim();
        const messageValue = message.value.trim();

        // Validate empty fields
        if (!nameValue || !emailValue || !messageValue) {
            formMessage.textContent = "Please fill in all the fields.";
            formMessage.style.color = "red";
            return;
        }

        // Validate email format
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailPattern.test(emailValue)) {
            formMessage.textContent = "Please enter a valid email address.";
            formMessage.style.color = "red";
            return;
        }

        // Create an object containing the submitted data
        const contactData = {
            name: nameValue,
            email: emailValue,
            message: messageValue,
            submittedAt: new Date().toISOString()
        };

        // Convert the object into JSON
        const jsonData = JSON.stringify(contactData, null, 4);

        // Create a downloadable JSON file
        const blob = new Blob([jsonData], {
            type: "application/json"
        });

        const url = URL.createObjectURL(blob);
        const downloadLink = document.createElement("a");

        downloadLink.href = url;
        downloadLink.download = "contact_submission.json";

        document.body.appendChild(downloadLink);
        downloadLink.click();

        document.body.removeChild(downloadLink);
        URL.revokeObjectURL(url);

        // Display success message
        formMessage.textContent =
            "Your message has been submitted successfully! Your JSON file has been downloaded.";

        formMessage.style.color = "green";

        // Reset the form
        contactForm.reset();
    });
}
// ========================================
// PRODUCT FILTERS AND USER NEEDS
// ========================================

document.addEventListener("DOMContentLoaded", function () {

    const filterButtons = document.querySelectorAll(
        ".sidebar .pill[data-filter-group]"
    );

    const productCards = document.querySelectorAll(".grid .card");
    const productCount = document.querySelector(".section-heading span");
    const heading = document.querySelector(".section-heading h1");
    const clearButton = document.getElementById("clearFilters");

    // Store the selected filters
    const selectedFilters = {
        category: "skincare",
        skin: "",
        concern: ""
    };

    function filterProducts() {

        let visibleCount = 0;

        productCards.forEach(function (card) {

            const category = card.dataset.category || "";
            const skinTypes = (card.dataset.skin || "").split(" ");
            const concerns = (card.dataset.concern || "").split(" ");

            const matchesCategory =
                !selectedFilters.category ||
                category === selectedFilters.category;

            const matchesSkin =
                !selectedFilters.skin ||
                skinTypes.includes(selectedFilters.skin);

            const matchesConcern =
                !selectedFilters.concern ||
                concerns.includes(selectedFilters.concern);

            const matchesAll =
                matchesCategory && matchesSkin && matchesConcern;

            card.style.display = matchesAll ? "" : "none";

            if (matchesAll) {
                visibleCount++;
            }
        });

        // Update product count
        if (productCount) {
            productCount.textContent =
                visibleCount + (visibleCount === 1 ? " product" : " products");
        }

        // Update heading
        if (heading) {
            const categoryName = selectedFilters.category
                ? selectedFilters.category.charAt(0).toUpperCase() +
                  selectedFilters.category.slice(1)
                : "All Products";

            heading.textContent = categoryName;
        }
    }

    // Handle filter button clicks
    filterButtons.forEach(function (button) {

        button.addEventListener("click", function () {

            const group = button.dataset.filterGroup;
            const value = button.dataset.filterValue;

            // Category: select one category at a time
            if (group === "category") {

                selectedFilters.category = value;

                filterButtons.forEach(function (item) {
                    if (item.dataset.filterGroup === "category") {
                        item.classList.toggle("active", item === button);
                    }
                });

            } else {

                // Skin type and concern: toggle selection
                if (selectedFilters[group] === value) {
                    selectedFilters[group] = "";
                    button.classList.remove("active");
                } else {

                    selectedFilters[group] = value;

                    filterButtons.forEach(function (item) {
                        if (item.dataset.filterGroup === group) {
                            item.classList.toggle("active", item === button);
                        }
                    });
                }
            }

            filterProducts();
        });
    });

    // Clear all filters
    if (clearButton) {

        clearButton.addEventListener("click", function () {

            selectedFilters.category = "";
            selectedFilters.skin = "";
            selectedFilters.concern = "";

            filterButtons.forEach(function (button) {
                button.classList.remove("active");
            });

            filterProducts();
        });
    }

    // Apply the default category filter
    filterProducts();

});

    // Mobile menu toggle
    const menuBtn = document.getElementById("menu-media-queries");
    const navMenu = document.querySelector("nav.nav");
    if (menuBtn && navMenu) {
        menuBtn.addEventListener("click", () => {
            navMenu.classList.toggle("active");
        });
    }

    const navLinks = document.querySelectorAll("a[data-view]");
    navLinks.forEach((link) => {
        link.addEventListener("click", (e) => {
            e.preventDefault();
            const view = link.getAttribute("data-view");
            const targetElement = document.getElementById(view);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: "smooth" });
            }
        });
    });

    let listings = [];
    let currentData = []; // Holds filtered data
    let currentPage = 1;
    const listingsPerPage = 5;

    // convert a price string to a number, using Regex
    function parsePrice(priceString) {
        return Number(priceString.replace(/[^0-9.-]+/g, ""));
    }

    function renderListings(listingsData) {
        const container = document.getElementById("listings-container");

        while (container.firstChild) {
            container.removeChild(container.firstChild);
        }

        const start = (currentPage - 1) * listingsPerPage;
        const end = start + listingsPerPage;
        const currentListings = listingsData.slice(start, end);

        // Create and append listing cards
        currentListings.forEach((listing) => {
            const listingCard = document.createElement("div");
            listingCard.className = "listing-card";

            const gallery = document.createElement("div");
            gallery.className = "listing-gallery";
            const image = document.createElement("img");
            image.src = listing.images[0];
            image.alt = listing.title;
            gallery.appendChild(image);

            const details = document.createElement("div");
            details.className = "listing-details";

            const title = document.createElement("h3");
            title.textContent = listing.title;
            details.appendChild(title);

            const salePrice = document.createElement("p");
            salePrice.textContent = "Sale: " + listing.sale.price;
            details.appendChild(salePrice);

            const rentPrice = document.createElement("p");
            rentPrice.textContent = "Rent: " + listing.rent.price;
            details.appendChild(rentPrice);

            // Extra details container (It is hidden with CSS)
            const extraDetails = document.createElement("div");
            extraDetails.className = "extra-details";

            const size = document.createElement("p");
            size.textContent = "Size: " + listing.size;
            extraDetails.appendChild(size);

            const locationEl = document.createElement("p");
            locationEl.textContent = "Location: " + listing.location;
            extraDetails.appendChild(locationEl);

            const amenities = document.createElement("p");
            amenities.textContent =
                "Amenities: " + listing.amenities.join(", ");
            extraDetails.appendChild(amenities);

            details.appendChild(extraDetails);

            // "Show more..."
            const toggleLink = document.createElement("a");
            toggleLink.href = "#";
            toggleLink.className = "toggle-details";
            toggleLink.textContent = "Show more...";
            details.appendChild(toggleLink);

            toggleLink.addEventListener("click", function (e) {
                e.preventDefault();
                extraDetails.classList.toggle("visible");
                toggleLink.textContent = extraDetails.classList.contains(
                    "visible"
                )
                    ? "Show less..."
                    : "Show more...";
            });

            listingCard.appendChild(gallery);
            listingCard.appendChild(details);
            container.appendChild(listingCard);
        });

        // Update pagination info
        document.getElementById("page-info").textContent =
            "Page " + currentPage;

        // Show Previous and Next buttons
        const prevBtn = document.getElementById("prev-page");
        const nextBtn = document.getElementById("next-page");
        if (listingsData.length > listingsPerPage) {
            prevBtn.style.display = "inline-block";
            nextBtn.style.display = "inline-block";
        } else {
            prevBtn.style.display = "none";
            nextBtn.style.display = "none";
        }
    }

    // Fetch data from the local JSON file
    fetch("./data/properties.json")
        .then((response) => response.json())
        .then((data) => {
            listings = data;
            currentData = data;
            renderListings(currentData);
        })
        .catch((error) => {
            console.error("Error fetching properties:", error);
        });

    // Search functionality
    document.getElementById("search-btn").addEventListener("click", () => {
        const searchInput = document.getElementById("listing-search");
        const query = searchInput.value.toLowerCase();
        const filteredListings = listings.filter(
            (listing) =>
                listing.title.toLowerCase().includes(query) ||
                listing.location.toLowerCase().includes(query)
        );
        currentPage = 1; // Reset to first page on new search
        currentData = filteredListings;
        renderListings(currentData);
        searchInput.value = "";

        const pageInfo = document.getElementById("page-info");
        const clearSearchButton = document.getElementById("clear-search");
        if (pageInfo) pageInfo.classList.add("hidden");
        if (clearSearchButton)
            clearSearchButton.classList.remove("hidden-clear-btn");
    });

    // Clear search button event listener
    document.getElementById("clear-search").addEventListener("click", () => {
        currentPage = 1;
        currentData = listings;
        renderListings(currentData);
        const pageInfo = document.getElementById("page-info");
        const clearSearchButton = document.getElementById("clear-search");
        if (pageInfo) pageInfo.classList.remove("hidden");
        if (clearSearchButton)
            clearSearchButton.classList.add("hidden-clear-btn");
        document.getElementById("listing-search").value = "";

        const listingsHeader = document.querySelector(".listings-header");
        if (listingsHeader) {
            listingsHeader.scrollIntoView({
                behavior: "smooth",
                block: "start",
            });
        }
    });

    // Pagination controls
    document.getElementById("prev-page").addEventListener("click", () => {
        if (currentPage > 1) {
            currentPage--;
            renderListings(currentData);
        }
    });

    document.getElementById("next-page").addEventListener("click", () => {
        if (currentPage * listingsPerPage < currentData.length) {
            currentPage++;
            renderListings(currentData);
        }
    });

    // Sort functionality: sort the currentData based on the selected option
    document
        .getElementById("sort-select")
        .addEventListener("change", function () {
            const sortValue = this.value;
            let sortedData = [...currentData];
            if (sortValue === "neighborhood") {
                sortedData.sort((a, b) =>
                    a.neighborhood.localeCompare(b.neighborhood)
                );
            } else if (sortValue === "price-sale") {
                sortedData.sort(
                    (a, b) =>
                        parsePrice(a.sale.price) - parsePrice(b.sale.price)
                );
            } else if (sortValue === "price-rent") {
                sortedData.sort(
                    (a, b) =>
                        parsePrice(a.rent.price) - parsePrice(b.rent.price)
                );
            }
            currentData = sortedData;
            renderListings(currentData);
        });

    // contact form
    const contactForm = document.getElementById("contactForm");
    if (contactForm) {
        contactForm.addEventListener("submit", function (e) {
            e.preventDefault();
            alert("Message sent");
            contactForm.reset();
        });
    }

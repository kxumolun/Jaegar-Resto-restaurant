import { dishes } from "./dishes.js";

let selectedCategory = "hot-dish"; // default category
let selectedType = "";             // will be set from first dropdown
let searchQuery = "";


// ----------------- Dynamic Categories -----------------
const categories = document.querySelectorAll(".choose-bar-list-item");
categories.forEach((category) => {
  category.addEventListener("click", function () {
    categories.forEach((el) => el.classList.remove("active"));
    this.classList.add("active");

    selectedCategory = this.id;
    filterAndRender();
  });
});

// ----------------- Dropdowns -----------------
const selectDropdownButton = document.getElementById("selectDropdownButton");
const selectDropdownContent = document.getElementById("selectDropdownContent");
const selectedValueSpan = document.getElementById("selectedValue");
const hiddenSelectValueInput = document.getElementById("hiddenSelectValue");
const selectOptions = selectDropdownContent.querySelectorAll(".select-option");
const typeOptions = document.querySelectorAll(".cart-dish-type div");

function toggleDropdown(content) {
  content.classList.toggle("show");
}

selectDropdownButton.addEventListener("click", () =>
  toggleDropdown(selectDropdownContent)
);

function updateActiveOption() {
  const value = hiddenSelectValueInput.value;
  typeOptions.forEach((o) => {
    o.classList.toggle("active", o.dataset.value === value);
  });
}

// Handle dropdown clicks
selectOptions.forEach((option) => {
  option.addEventListener("click", function (event) {
    event.preventDefault();
    const value = this.dataset.value;
    const text = this.textContent;

    selectedValueSpan.textContent = text;
    hiddenSelectValueInput.value = value;
    selectedType = value;

    updateActiveOption();
    filterAndRender();
    selectDropdownContent.classList.remove("show");
  });
});

// Handle type option clicks
typeOptions.forEach((o) => {
  o.addEventListener("click", () => {
    const value = o.dataset.value;
    const opt = [...selectOptions].find((s) => s.dataset.value === value);
    if (opt) {
      selectedValueSpan.textContent = opt.textContent;
      hiddenSelectValueInput.value = value;
      selectedType = value;
      updateActiveOption();
      filterAndRender();
    }
  });
});

// Close dropdown on outside click
window.addEventListener("click", function (event) {
  if (
    !selectDropdownButton.contains(event.target) &&
    selectDropdownContent.classList.contains("show")
  ) {
    selectDropdownContent.classList.remove("show");
  }
});

// Close dropdown on ESC
window.addEventListener("keydown", function (event) {
  if (
    event.key === "Escape" &&
    selectDropdownContent.classList.contains("show")
  ) {
    selectDropdownContent.classList.remove("show");
  }
});

// ----------------- Render Function -----------------
const cardsContainer = document.querySelector(".dish-cards-list");

function renderDishes(filtered) {
  cardsContainer.innerHTML = "";

  if (filtered.length === 0) {
    const message = document.createElement("span");
    message.classList.add("message-cards-dish-list");
    message.textContent = "No matches found :)";
    cardsContainer.appendChild(message);
    return;
  }

  filtered.forEach((dish) => {
    const li = document.createElement("li");
    li.className = "dish-card-item flex";

    li.innerHTML = `
      <div class="dish-image-div flex">
        <img src="assets/${dish.imagePath}.png" alt="${dish.name}">
      </div>
      <h2>${dish.name}</h2>
      <h3>$ ${dish.price}</h3>
      <p>${dish.bowlsAvailable} Bowls available</p>
      <button class="universal-btn cards-btn" data-name="${dish.name}">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none"
              xmlns="http://www.w3.org/2000/svg">
              <path d="M10 1V10M10 19V10M10 10H19M10 10H1" stroke="#fff" stroke-width="1.8"
              stroke-linecap="round" stroke-linejoin="round" />
          </svg>
            Add to cart
      </button>
    `;
    cardsContainer.appendChild(li);
  });
}

// ----------------- Filtering Logic -----------------
function filterAndRender() {
  let filtered = dishes;

  if (selectedCategory && selectedCategory !== "all") {
    filtered = filtered.filter((dish) =>
      dish.category.includes(selectedCategory)
    );
  }

  if (selectedType && selectedType !== "all") {
    filtered = filtered.filter((dish) => dish.type === selectedType);
  }

  if (searchQuery) {
    filtered = filtered.filter((dish) =>
      dish.name.toLowerCase().includes(searchQuery)
    );
  }

  renderDishes(filtered);
}

// ----------------- Search -----------------
function searchDish(text) {
  searchQuery = text.toLowerCase().trim();
  filterAndRender();
}

// ----------------- Default Render -----------------
document.getElementById("hot-dish").classList.add("active");

// set default type to first dropdown option
const firstOption = selectOptions[0];
selectedType = firstOption.dataset.value;
hiddenSelectValueInput.value = selectedType;
selectedValueSpan.textContent = firstOption.textContent;
updateActiveOption();

// now filter and render
filterAndRender();

// ----------------- Cart -----------------
let cart = [];
const cartList = document.querySelector(".dish-in-cart-list");
const subTotalSpan = document.querySelector(".subTotalspan");

cardsContainer.addEventListener("click", function (e) {
  if (e.target.closest(".cards-btn")) {
    const button = e.target.closest(".cards-btn");
    const dishName = button.getAttribute("data-name");
    const dish = dishes.find((d) => d.name === dishName);
    addToCart(dish);
  }
});

function addToCart(dish) {
  let existing = cart.find((item) => item.name === dish.name);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ ...dish, qty: 1 });
  }
  renderCart();
}

function renderCart() {
  cartList.innerHTML = "";
  let subtotal = 0;

  cart.forEach((item) => {
    const li = document.createElement("li");
    li.className = "dish-in-cart-list-item flex";

    const totalPrice = (item.price * item.qty).toFixed(2);
    subtotal += parseFloat(totalPrice);

    li.innerHTML = `
      <div class="flex dish-in-cart-list-item-header">
        <div class="flex dish-in-cart-list-item-header-inner">
          <div class="flex dish-in-cart-list-item-header-inner-left">
            <div class="dish-in-cart-image-div">
              <img src="assets/${item.imagePath}.png" alt="${item.name}">
            </div>
            <div class="flex col">
              <h2>${item.name}</h2>
              <h3>$ ${item.price}</h3>
            </div>
          </div>
          <span class="dish-in-cart-count-span flex">${item.qty}</span>
        </div>
        <span class="dish-in-cart-total-price">$ ${totalPrice}</span>
      </div>
      <div class="flex dish-in-cart-list-item-footer">
        <input type="text" class="dish-in-cart-input universal-input" placeholder="Order Note...">
        <button class="dish-in-cart-delete-btn" data-name="${item.name}">
          <svg width="18" height="20" viewBox="0 0 18 20" fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <path d="M15.8789 6.71882L15.9784 6.72017C16.3475 6.75069 16.6304 7.05716 16.65 7.42605L16.6405 7.63174L16.326 11.483L15.9961 15.2414C15.9263 15.9917 15.8638 16.6245 15.8099 17.1227C15.6225 18.8588 14.4955 19.9323 12.7966 19.9641C10.1494 20.013 7.60477 20.0125 5.13373 19.9591C3.48398 19.9244 2.37366 18.8393 2.18955 17.1297L2.0623 15.8702L1.83994 13.427L1.61216 10.7461L1.35172 7.52788C1.31935 7.11498 1.61951 6.75335 2.02215 6.72016C2.39123 6.68973 2.7183 6.94584 2.79519 7.30677L2.82511 7.60173L3.06966 10.6187L3.33669 13.7459C3.45646 15.0996 3.56034 16.1952 3.64346 16.9648C3.74838 17.939 4.26138 18.4404 5.16411 18.4593C7.61585 18.5124 10.1415 18.5129 12.7701 18.4643C13.7277 18.4464 14.2488 17.9499 14.356 16.9574L14.4827 15.7046C14.5198 15.3185 14.5594 14.8923 14.6013 14.4293L14.8686 11.3538L15.1906 7.4075C15.2204 7.02902 15.5192 6.7389 15.8789 6.71882ZM0.73139 4.98918C0.327455 4.98918 0 4.65338 0 4.23916C0 3.85945 0.275153 3.54564 0.632145 3.49597L0.73139 3.48913H3.91772C4.29636 3.48913 4.62785 3.23928 4.74642 2.87929L4.77543 2.76813L5.02304 1.50533C5.24111 0.668966 5.9492 0.0734931 6.779 0.00633149L6.93592 0H11.0639C11.9075 0 12.6523 0.546275 12.9391 1.39039L12.9874 1.55209L13.2243 2.76783C13.2987 3.14872 13.6025 3.4332 13.9701 3.48177L14.0821 3.48913H17.2686C17.6725 3.48913 18 3.82493 18 4.23916C18 4.61887 17.7248 4.93267 17.3679 4.98234L17.2686 4.98918H0.73139Z"
            fill="#fff" />
          </svg>
        </button>
      </div>
    `;
    cartList.appendChild(li);
  });

  subTotalSpan.textContent = `$ ${subtotal.toFixed(2)}`;
}

// Delete from cart
cartList.addEventListener("click", function (e) {
  if (e.target.closest(".dish-in-cart-delete-btn")) {
    const dishName = e.target
      .closest(".dish-in-cart-delete-btn")
      .getAttribute("data-name");
    cart = cart.filter((item) => item.name !== dishName);
    renderCart();
  }
});


const nav = document.querySelector(".navigation");
const items = nav.querySelectorAll("ul li");
const indicator = nav.querySelector(".indicator");


function moveIndicator(activeLi) {
  const liTop = activeLi.offsetTop; // exact top in pixels
  indicator.style.transform = `translateY(${liTop - 35}px)`;
  console.log(liTop)
}

items.forEach((li, index) => {
  li.addEventListener("click", () => {
    // remove active class from all
    items.forEach(el => el.classList.remove("active"));

    if (index === 0) {
      items[1].classList.add("active")
      li.classList.remove("active");
    } else {
      // all other items
      li.classList.add("active");
      moveIndicator(li);
    }
  });
});


// Optional: keep position when resizing
window.addEventListener("resize", () => {
  const active = nav.querySelector("ul li.active");
  if (active) moveIndicator(active);
});


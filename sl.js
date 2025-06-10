const wrapper = document.querySelector(".wrapper");
const carousel1 = document.querySelector(".carousel1");
const firstCardWidth = carousel1.querySelector(".card").offsetWidth;
const arrowBtns = document.querySelectorAll(".wrapper i");
const carousel1Childrens = [...carousel1.children];

let isDragging = false,
    isAutoPlay = true,
    startX, startScrollLeft, timeoutId;

// Get the number of cards that can fit in the carousel1 at once
let cardPerView = Math.round(carousel1.offsetWidth / firstCardWidth);

// Insert copies of the last few cards to beginning of carousel1 for infinite scrolling
carousel1Childrens.slice(-cardPerView).reverse().forEach(card => {
    carousel1.insertAdjacentHTML("afterbegin", card.outerHTML);
});

// Insert copies of the first few cards to end of carousel1 for infinite scrolling
carousel1Childrens.slice(0, cardPerView).forEach(card => {
    carousel1.insertAdjacentHTML("beforeend", card.outerHTML);
});

// Scroll the carousel1 at appropriate postition to hide first few duplicate cards on Firefox
carousel1.classList.add("no-transition");
carousel1.scrollLeft = carousel1.offsetWidth;
carousel1.classList.remove("no-transition");

// Add event listeners for the arrow buttons to scroll the carousel1 left and right
arrowBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        carousel1.scrollLeft += btn.id == "left" ? -firstCardWidth : firstCardWidth;
    });
});

const dragStart = (e) => {
    isDragging = true;
    carousel1.classList.add("dragging");
    // Records the initial cursor and scroll position of the carousel1
    startX = e.pageX;
    startScrollLeft = carousel1.scrollLeft;
}

const dragging = (e) => {
    if (!isDragging) return; // if isDragging is false return from here
    // Updates the scroll position of the carousel1 based on the cursor movement
    carousel1.scrollLeft = startScrollLeft - (e.pageX - startX);
}

const dragStop = () => {
    isDragging = false;
    carousel1.classList.remove("dragging");
}

const infiniteScroll = () => {
    // If the carousel1 is at the beginning, scroll to the end
    if (carousel1.scrollLeft === 0) {
        carousel1.classList.add("no-transition");
        carousel1.scrollLeft = carousel1.scrollWidth - (2 * carousel1.offsetWidth);
        carousel1.classList.remove("no-transition");
    }
    // If the carousel1 is at the end, scroll to the beginning
    else if (Math.ceil(carousel1.scrollLeft) === carousel1.scrollWidth - carousel1.offsetWidth) {
        carousel1.classList.add("no-transition");
        carousel1.scrollLeft = carousel1.offsetWidth;
        carousel1.classList.remove("no-transition");
    }

    // Clear existing timeout & start autoplay if mouse is not hovering over carousel1
    clearTimeout(timeoutId);
    if (!wrapper.matches(":hover")) autoPlay();
}

const autoPlay = () => {
    if (window.innerWidth < 800 || !isAutoPlay) return; // Return if window is smaller than 800 or isAutoPlay is false
    // Autoplay the carousel1 after every 2500 ms
    timeoutId = setTimeout(() => carousel1.scrollLeft += firstCardWidth, 2500);
}
autoPlay();

carousel1.addEventListener("mousedown", dragStart);
carousel1.addEventListener("mousemove", dragging);
document.addEventListener("mouseup", dragStop);
carousel1.addEventListener("scroll", infiniteScroll);
wrapper.addEventListener("mouseenter", () => clearTimeout(timeoutId));
wrapper.addEventListener("mouseleave", autoPlay);
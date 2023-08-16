const modal = document.getElementById("modal");
const modalShow = document.getElementById("show-modal");
const modalClose = document.getElementById("close-modal");
const bookmarkForm = document.getElementById("bookmark-form");
const websiteNameEl = document.getElementById("website-name");
const websiteURLEl = document.getElementById("website-url");
const bookmarksContainer = document.getElementById("bookmarks-container");

let bookmarks = {};

//*Show Modal, focus on input

function showModal() {
    modal.classList.add("show-modal");
    websiteNameEl.focus();
}

//* Close Modal
function closeModal() {
    modal.classList.remove("show-modal");
}

//*Reset Form
function resetForm() {
    bookmarkForm.reset();
}

function validateForm(nameValue, urlValue) {
    const expression =
        /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/gi;
    const regex = new RegExp(expression);
    if (!nameValue || !urlValue) {
        alert("Please provide a name and url");
        return false;
    }
    if (!urlValue.match(regex)) {
        alert("Please provide a valid web address");
        return false;
    }
    return true;
}

//* Build Bookmarks DOM
function buildBookmarks() {
    // Remove all bookmark elements
    bookmarksContainer.textContent = "";
    // Build items
    Object.keys(bookmarks).forEach((id) => {
        const { name, url } = bookmarks[id];
        // Item
        const item = document.createElement("div");
        item.classList.add("item");
        // Close Icon
        const closeIcon = document.createElement("i");
        closeIcon.classList.add("fas", "fa-times");
        closeIcon.setAttribute("title", "Delete Bookmark");
        closeIcon.setAttribute("onclick", `deleteBookmark('${id}')`);
        // Favicon / Link Container
        const linkInfo = document.createElement("div");
        linkInfo.classList.add("name");
        const favicon = document.createElement("img");
        favicon.setAttribute(
            "src",
            `https://s2.googleusercontent.com/s2/favicons?domain=${url}`
        );
        favicon.setAttribute("alt", "Favicon");
        // Link
        const link = document.createElement("a");
        link.setAttribute("href", `${url}`);
        link.setAttribute("target", "_blank");
        link.textContent = name;
        // Append to Bookmarks Container
        linkInfo.append(favicon, link);
        item.append(closeIcon, linkInfo);
        bookmarksContainer.appendChild(item);
    });
}

//* Fetch Bookmarks from Local Storage
function fetchBookmarks() {
    if (localStorage.getItem("bookmarks")) {
        bookmarks = JSON.parse(localStorage.getItem("bookmarks"));
    } else {
        //Create bookmarks array in local storage
        const id = "https://www.google.com";
        (bookmarks[id] = {
            name: "Google",
            url: "https://www.google.com",
        }),
            localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
    }
    buildBookmarks();
}

//* Delete Bookmark

function deleteBookmark(id) {
    if (bookmarks[id]) {
        delete bookmarks[id];
    }
    // Update bookmarks array in local storage; re-populate DOM
    localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
    fetchBookmarks();
}

//* Add Bookmark
function storeBookmark(e) {
    e.preventDefault();
    const nameValue = websiteNameEl.value;
    let urlValue = websiteURLEl.value;
    if (!urlValue.includes("http://", "https://")) {
        urlValue = `https://${urlValue}`;
    }
    if (!validateForm(nameValue, urlValue)) {
        return false;
    }
    const bookmark = {
        name: nameValue,
        url: urlValue,
    };
    bookmarks.push(bookmark);
    localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
    fetchBookmarks();
    bookmarkForm.reset();
    websiteNameEl.focus();
}

//* Modal Event Listener
modalShow.addEventListener("click", showModal);
modalClose.addEventListener("click", closeModal);
//Close modal on outside click event
window.addEventListener("click", (e) => {
    e.target === modal ? closeModal() : false;
});

//* Event Listener
bookmarkForm.addEventListener("submit", storeBookmark);

//! On load, Fetch Bookmarks
fetchBookmarks();

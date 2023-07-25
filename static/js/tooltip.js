
let profile_container = document.querySelector(".profile-container")
let tooltip = document.querySelector(".tooltip-menu")
let tooltip_content = document.querySelector(".tooltip-menu-content")

console.log(tooltip)

profile_container.addEventListener("mouseenter", display_tooltip);
tooltip.addEventListener("mouseenter", display_tooltip);
profile_container.addEventListener("mouseleave", hide_tooltip);
tooltip.addEventListener("mouseleave", hide_tooltip);

function display_tooltip() {
    tooltip.style.display = "flex"
    anime.remove(tooltip_content);
    anime({
        targets: tooltip_content,
        height: "80px"
    });
}

function hide_tooltip() {
    anime.remove(tooltip_content);
    anime({
        targets: tooltip_content,
        height: "0px",
    });
    tooltip.style.display = "none"
}
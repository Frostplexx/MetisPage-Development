//on scroll
window.onscroll = function() {scrollFunction()};
function scrollFunction() {
    if (document.body.scrollTop > 300 || document.documentElement.scrollTop > 300) {
        document.getElementById("scroll-indicator-div").style.opacity = "0";
    } else {
        document.getElementById("scroll-indicator-div").style.opacity = ".7";
    }
}

document.getElementById("start").onclick = function() {scrollToSection()};
function scrollToSection() {
    document.getElementById("get-started-section").scrollIntoView({behavior: "smooth"});
}

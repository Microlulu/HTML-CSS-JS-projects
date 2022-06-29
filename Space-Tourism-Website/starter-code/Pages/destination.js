var planetNames = ["Moon", "Mars", "Europa", "Titan"];
var planetDescription = ["See our planet as you’ve never seen it before. A perfect relaxing trip away to help regain perspective and come back refreshed. While you’re there, take in some history by visiting the Luna 2 and Apollo 11 landing sites.",
    "Don’t forget to pack your hiking boots. You’ll need them to tackle Olympus Mons, the tallest planetary mountain in our solar system. It’s two and a half times the size of Everest!",
    "The smallest of the four Galilean moons orbiting Jupiter, Europa is a winter lover’s dream. With an icy surface, it’s perfect for a bit of ice skating, curling, hockey, or simple relaxation in your snug wintery cabin.",
    "The only moon known to have a dense atmosphere other than Earth, Titan is a home away from home (just a few hundred degrees colder!). As a bonus, you get striking views of the Rings of Saturn."];


var planetDistances = ["384,400 km", "225 mil. km", "628 mil. km", "1.6 bil. km"];
var planetTime = ["3 days", "9 months", "3 years", "7 years"];
var planetImagePaths = ["../assets/destination/image-moon.png",
    "../assets/destination/image-mars.png",
    "../assets/destination/image-europa.png",
    "../assets/destination/image-titan.png",];

function showPlanetInfo(clickedNavbarItem) {

    addActiveClass(clickedNavbarItem);

    var navbarText = clickedNavbarItem.innerHTML;
    var planetIndex = -1;


    if (navbarText == "Moon") {
        planetIndex = 0;
    }

    else if (navbarText == "Mars") {
        planetIndex = 1;
    }
    else if (navbarText == "Europa") {
        planetIndex = 2;
    }
    else if (navbarText == "Titan") {
        planetIndex = 3;
    }

    document.getElementById("planet-name").innerHTML = planetNames[planetIndex];
    document.getElementById("planet-img").src = planetImagePaths[planetIndex];
    document.getElementById("planet-distance").innerHTML = planetDistances[planetIndex];
    document.getElementById("planet-travel-time").innerHTML = planetTime[planetIndex];
    document.getElementById("planet-desc").innerHTML = planetDescription[planetIndex];
}


function addActiveClass(element) {

    var allNavbarItems = document.getElementsByClassName("planet-nav-item");
    if (allNavbarItems[0].classList.contains("active")) {
        allNavbarItems[0].classList.remove("active")
    }
    if (allNavbarItems[1].classList.contains("active")) {
        allNavbarItems[1].classList.remove("active")
    }
    if (allNavbarItems[2].classList.contains("active")) {
        allNavbarItems[2].classList.remove("active")
    }
    if (allNavbarItems[3].classList.contains("active")) {
        allNavbarItems[3].classList.remove("active")
    }

    element.classList.add("active");

}
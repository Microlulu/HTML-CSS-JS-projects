var technologyTitles = ["Launch vehicle", "Space capsule", "Spaceport"];
var technologyInfos = ["A launch vehicle or carrier rocket is a rocket-propelled vehicle used to carry a payload from Earth's surface to space, usually to Earth orbit or beyond. Our WEB-X carrier rocket is the most powerful in operation. Standing 150 metres tall, it's quite an awe-inspiring sight on the launch pad!",
    "A space capsule is an often-crewed spacecraft that uses a blunt-body reentry capsule to reenter the Earth's atmosphere without wings. Our capsule is where you'll spend your time during the flight. It includes a space gym, cinema, and plenty of other activities to keep you entertained.",
    "A spaceport or cosmodrome is a site for launching (or receiving) spacecraft, by analogy to the seaport for ships or airport for aircraft. Based in the famous Cape Canaveral, our spaceport is ideally situated to take advantage of the Earth’s rotation for launch."];
var technologyImages = ["../assets/technology/image-launch-vehicle-portrait.jpg",
    "../assets/technology/image-space-capsule-portrait.jpg",
    "../assets/technology/image-spaceport-portrait.jpg"];


function showTechnologyElement(TheElementCliked) {

    var clickedNumberText = TheElementCliked.innerHTML;
    var technologyIndex = -1;

    if (clickedNumberText == "1") {
        technologyIndex = 0;
    }
    if (clickedNumberText == "2") {
        technologyIndex = 1;
    }
    if (clickedNumberText == "3") {
        technologyIndex = 2;
    }

    document.getElementById("technology-title").innerHTML = technologyTitles[technologyIndex];
    document.getElementById("technology-info").innerHTML = technologyInfos[technologyIndex];
    document.getElementById("technology-img").src = technologyImages[technologyIndex];
    setActiveTechDot(TheElementCliked);
}

function setActiveTechDot(element) {

    var alltechdots = document.getElementsByClassName("nav-number");
    if (alltechdots[0].classList.contains("techdot")) {
        alltechdots[0].classList.remove("techdot")
    }
    if (alltechdots[1].classList.contains("techdot")) {
        alltechdots[1].classList.remove("techdot")
    }
    if (alltechdots[2].classList.contains("techdot")) {
        alltechdots[2].classList.remove("techdot")
    }

    element.classList.add("techdot");

}
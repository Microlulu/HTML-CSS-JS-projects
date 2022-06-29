var crewJobTitle = ["Commander", "Mission Specialist", "Pilot", "Flight Engineer"];
var crewMemberName = ["Douglas Hurley", "Mark Shuttleworth", "Victor Glover", "Anousheh Ansari"];
var crewInfo = ["  Douglas Gerald Hurley is an American engineer, former Marine Corps pilot and former NASA astronaut. He launched into space for the third time as commander of Crew Dragon Demo-2.",
    "Mark Richard Shuttleworth is the founder and CEO of Canonical, the company behind the Linux-based Ubuntu operating system. Shuttleworth became the first South African to travel to space as a space tourist.",
    "Pilot on the first operational flight of the SpaceX Crew Dragon to the International Space Station. Glover is a commander in the U.S. Navy where he pilots an F/A-18.He was a crew member of Expedition 64, and served as a station systems flight engineer.",
    "Anousheh Ansari is an Iranian American engineer and co-founder of Prodea Systems. Ansari was the fourth self-funded space tourist, the first self-funded woman to fly to the ISS, and the first Iranian in space."];

var crewImagePath = ["../assets/crew/image-douglas-hurley.png",
    "../assets/crew/image-mark-shuttleworth.png",
    "../assets/crew/image-victor-glover.png",
    "../assets/crew/image-anousheh-ansari.png",
];

function showCrewMemberInfo(TheClickedDot) {
    var dotId = TheClickedDot.id;
    var crewMemberIndex = -1;
    if (dotId == "dot-one") {
        crewMemberIndex = 0;
    }
    if (dotId == "dot-two") {
        crewMemberIndex = 1;
    }
    if (dotId == "dot-three") {
        crewMemberIndex = 2;
    }
    if (dotId == "dot-four") {
        crewMemberIndex = 3;
    }

    document.getElementById("job-title").innerHTML = crewJobTitle[crewMemberIndex];
    document.getElementById("member-name").innerHTML = crewMemberName[crewMemberIndex];
    document.getElementById("member-info").innerHTML = crewInfo[crewMemberIndex];
    document.getElementById("crew-pic").src = crewImagePath[crewMemberIndex];
    setActiveCrewdot(TheClickedDot);
}

function setActiveCrewdot(element) {

    var alldots = document.getElementsByClassName("dot");
    if (alldots[0].classList.contains("active")) {
        alldots[0].classList.remove("active")
    }
    if (alldots[1].classList.contains("active")) {
        alldots[1].classList.remove("active")
    }
    if (alldots[2].classList.contains("active")) {
        alldots[2].classList.remove("active")
    }
    if (alldots[3].classList.contains("active")) {
        alldots[3].classList.remove("active")
    }

    element.classList.add("active");

}
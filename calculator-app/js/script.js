
function setTheme(theme) {
    document.body.setAttribute('data-theme', theme)
}
document.getElementById("slider").oninput = function () {
    const val = document.getElementById("slider").value
    setTheme(val)
};

let currentCalc = ["0"]
getLastIndex = function () {
    return currentCalc[currentCalc.length - 1].toString();
}
setLastIndex = function (value) {
    currentCalc[currentCalc.length - 1] = value;
}
const operatorList = ["*", "/", "+", "-"]


function input(value) {
    if (operatorList.includes(getLastIndex())) {
        currentCalc.push(value);
    } else if (getLastIndex() === "0") {
        setLastIndex(value)
    } else if (value === "." && getLastIndex().includes(".")) {
        return;
    } else {
        setLastIndex(getLastIndex()+value)
    }
    render();
}

function operator(value) {
    if (operatorList.includes(getLastIndex())) {
        setLastIndex(value)
    }
    else {
        currentCalc.push(value)
    }
    render();
}

function calc() {

    if (operatorList.includes(getLastIndex())) {
        currentCalc.pop();
    }
    currentCalc = [new Function('return ' + currentCalc.join(""))()];
    render();
}

function reset() {
    currentCalc = ["0"]
    render();
}

function del() {
    if (operatorList.includes(getLastIndex())) {
        currentCalc.pop();
    } else {
       setLastIndex(getLastIndex().substring(0, (getLastIndex().length - 1)));
    }
    render();
}

function render() {
    if (operatorList.includes(getLastIndex())) {
        document.getElementById("screen").innerText = getLastIndex()
    }else if(getLastIndex().charAt(getLastIndex().length-1) === "."){
        if(getLastIndex() ==="."){
            document.getElementById("screen").innerText = ".0"
        }else{
            document.getElementById("screen").innerText = "." + Number(getLastIndex()).toLocaleString("en");
        }
    }
    else if(getLastIndex().charAt(0) === "-"){
        document.getElementById("screen").innerText = (Number(getLastIndex())*-1).toLocaleString("en")+"-";
    }
    else {
        document.getElementById("screen").innerText = Number(getLastIndex()).toLocaleString("en");
    }
}
render();
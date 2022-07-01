// Get the modal
var modal = document.getElementById("myModal");

// Get the image and insert it inside the modal - use its "alt" text as a caption
var modalImg = document.getElementById("img01");
var captionText = document.getElementById("caption");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks on <span> (x), close the modal
span.onclick = function () {
  modal.style.display = "none";
};

function showGalleryImage(imageClicked) {
  modal.style.display = "block";
  var orLength = imageClicked.src.length;
  var newLength = orLength - 7;
  var newSrc = imageClicked.src.substring(0, newLength - 1);
  modalImg.src = newSrc + "/1024/768";
  captionText.innerHTML = imageClicked.alt;
}

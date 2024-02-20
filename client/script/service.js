function toggleCard(serviceId) {
    var card = document.getElementById(serviceId + "-card");
    if (card.style.display === "none") {
        card.style.display = "block";
    } else {
        card.style.display = "none";
    }
}

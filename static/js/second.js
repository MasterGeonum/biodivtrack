window.addEventListener('scroll', function() {
    var headerHeight = document.querySelector('header').offsetHeight;
    var scrollThreshold = headerHeight * 0.5; // Calcul du seuil de défilement (20% du header)
    var banniere = document.querySelector('.banniere');

    if (window.scrollY > scrollThreshold) {
        banniere.style.top = '0';
    } else {
        banniere.style.top = '100px';
    }
});

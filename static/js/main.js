
// AJOUT MAP ET FOND
//ajout d'une map, centrer la vue et définir le niveau de zoom à 2
var map = L.map('map').setView([32.70071229751592, 0.35003724529096686], 2);

// Ajouter un fond de carte OpenStreetMap par défaut, et l'ajouter à la carte
var osmDefaultLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});
osmDefaultLayer.addTo(map);

// Ajouter plusieurs fonds de carte :

// Ajouter un fond de carte ESRI vue sattelite
var Esri_WorldImagery = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', { 
  attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye,' + 
  'Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community' });

// Ajouter un fond de carte OpenStreetMap alternative
var osmAlternativeLayer = L.tileLayer('https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors'
});

// Ajouter un fond de carte Stadia Alidade Smooth
var Stadia_AlidadeSmooth = L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png', {
  attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>'
});

// Ajouter un fon de carte OSM dark
var Stadia_AlidadeSmoothDark = L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.{ext}', {
	attribution: '&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps' + 
  '</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy;' +  
  '<a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
	ext: 'png'
});

// Créer un groupe de gestion des couches et y ajouter les différents fonds de carte crées précédemment
var baseLayers = {
  "OSM Default Layer":osmDefaultLayer,
  "ESRI World Imagery": Esri_WorldImagery,
  "OSM Alternative": osmAlternativeLayer,
  "Stadia Alidade Smooth": Stadia_AlidadeSmooth,
  "Dark Layer": Stadia_AlidadeSmoothDark
};

// Ajouter le groupe de contrôle des couches à la carte
L.control.layers(baseLayers).addTo(map);

//AJOUT ECHELLE
L.control.scale({ imperial: false, metric: true }).addTo(map);



// AJOUT DES CARTES DE CHALEUR (concentration des points) à plusieurs niveau de zoom
// Ajouter le raster sous forme de tuiles à la carte
var Heatmapraster1 = L.tileLayer('data/data1/{z}/{x}/{y}.png', {
  zIndex : 22
});
map.addLayer(Heatmapraster1);

var Heatmapraster2 = L.tileLayer('data/data2/{z}/{x}/{y}.png', {
  zIndex : 22
});
map.addLayer(Heatmapraster2);

var Heatmapraster3 = L.tileLayer('data/data3/{z}/{x}/{y}.png', {
  zIndex : 22
});
map.addLayer(Heatmapraster3);

var Heatmapraster4 = L.tileLayer('data/data4/{z}/{x}/{y}.png', {
  zIndex : 22
});
map.addLayer(Heatmapraster4);

var Heatmapraster5 = L.tileLayer('data/data5/{z}/{x}/{y}.png', {
  zIndex : 22
});
map.addLayer(Heatmapraster5);




// CREATION DE STYLES
// Créer un style par défaut pour les points
const stylepardefaut = (feature, latlng) => {
  return {
      fillColor: '#7454bd', // Couleur du cercle
      color: 'white', // Couleur du trait
      weight: 0.3, // Epaisseur du trait
      opacity: 1, // Opacité du trait
      fillOpacity: 1, // Opacité de remplissage du cercle
      radius: 5 // Rayon du cercle
  };  
};


// Définir la fonction de style pour les parcs
function styleParcs(feature, latlng) {
  const categoryColorsparc = { // Définir les différentes classes
    '1': '#3C721A',
    '2': '#77D33E', 
    '3': '#ED91C7', 
    '4': '#DB248F', 
  };
  const category = feature.properties.statutparc; //Préciser le champ sur lequelle les classes s'appliquent, à chaque fois, le champ précisé trouve son nom dans apiplante.py
  const color = categoryColorsparc[category] || '#BEBABA'; // Utiliser la couleur définie dans categoryColors, ou gris par défaut
  return  {
    fillColor: color, // la couleur de remplissage est la constante 'color' qui est définie par les catégories de couleurs et le champ à appliquer
    weight: 0.3, // Epaisseur du trait
    opacity: 1, // Opacité du trait
    fillOpacity: 1, // Opacité de remplissage du cercle
    radius: 5 // Rayon du cercle
  };  
}  


// Définir la fonction de style pour les espèces en danger, meme logique que pour les parcs
function styleDanger(feature, latlng) {
  const categoryColorsicun = {
    'Danger Critique': '#E22019',
    'En Danger': '#E87027',
    'Quasi menacee': '#E8D327',
    'Preoccupation moindre': '#79E827',
  };
  const category1 = feature.properties.iucn;
  const color = categoryColorsicun[category1] || '#726B6B'; 
  return {
    fillColor: color,
    weight: 0.7, 
    opacity: 1, 
    fillOpacity: 1, 
    radius: 5 
  };  
}  


// Définir la fonction style pour la distance au fleuve
// Pour avoir des classes, on défini les différentes classes et les couleurs correspondantes
function getColor(distance_fleuve) {
  return distance_fleuve > 260000 ? '#AEE6F5' :
  distance_fleuve > 23962    ? '#78D5EF' :
  distance_fleuve > 11347     ? '#42C5E9' :
  distance_fleuve > 5778   ? '#19ACD5' :
  distance_fleuve > 2462   ? '#13809F' :
  distance_fleuve > 785 ? '#0F6B84' :
  distance_fleuve >= 0 ? '#0C5569' :
                      '#726B6B';
};
// Définir la fonction de style pour distance au fleuve
function styleFleuve(feature, latlng) {
  const category2 = feature.properties.distfleuve
  const color = getColor(category2); // Utiliser la fonction getColor pour obtenir la couleur en fonction de la distance
  return {
    fillColor: color,
    weight: 0.3, 
    opacity: 1, 
    fillOpacity: 1,
    radius: 5 
  };  
}




// AJOUT DES COUCHES ET DES MENUS DEROULANTS
// AJOUT DES VILLES A LA CARTE via un fetch
fetch('/geojson') // URL qui récupère toutes les villes
    .then(response => response.json())
    .then(dataville => {
        console.log(dataville);
        // Ajouter la couche de contours des villes à la carte
        cityLayer = L.geoJson(dataville,{
          style:{
            fillColor: 'grey',
            color: 'blue',
            weight: 1,
            opacity:1,
            fillOpacity: 0.1
          },
        });
        // fonction pour que les villes n'apparaissent qu'à un certain niveau de zoom
        map.on('zoomend', function() {
          if (map.getZoom() >= 4) {
            if (!map.hasLayer(cityLayer)) {
              map.addLayer(cityLayer);
            }
          } else {
            if (map.hasLayer(cityLayer)) {
              map.removeLayer(cityLayer);
            }
          }
        });
        cityLayer.bringToBack();
      })
    .catch(error => {
        console.error('Error fetching contour ville:', error);
    });



//FILTRE VILLE
// Fonction pour récupérer la liste des villes depuis le serveur et l'afficher dans la zone de filtrage
function getListeVille() {
  fetch('/listeville') //URL qui envoie les villes sous forme de liste
      .then(response => response.json())
      .then(datalisteville => {
          const select = document.getElementById('searchInput'); //le select prend la valeur de search input (donc une ville)
          console.log(datalisteville);
          datalisteville.forEach(ville => {
              // on crée un élément option dans le select des villes
              const opt = document.createElement('option') //pour chaque élément de la liste, creation d'une balise <option>
              // pour chaque <option> tu lui affectes un value="un nom de ville"
              opt.setAttribute("value", ville) 
              opt.textContent = ville 
              // toutes les options sont ajoutées dans le select
              select.appendChild(opt) 
          });
      })
      .catch(error => console.error('Erreur lors de la récupération de la liste des villes :', error));
}

//FILTRE ESPECE
// Fonction pour récupérer la liste des espèces depuis le serveur et l'afficher dans la zone de filtrage
function getListeEspece() {
  fetch('/listeSpecie')
      .then(response => response.json())
      .then(datalisteespece => {
        const select = document.getElementById('searchInputSpecies'); //le select prend la valeur de search input (donc une espèce)
        console.log(datalisteespece);
          datalisteespece.forEach(specie => {
            const opt1 = document.createElement('option') //pour chaque élément de la liste, tu crées une <option>
            // pour chaque <option> tu lui affectes un value="un nom d'espèce"
            opt1.setAttribute("value", specie) 
            opt1.textContent = specie
            select.appendChild(opt1) //toutes les options sont ajoutées dans le select
          });
        })
        .catch(error => console.error('Erreur lors de la récupération de la liste des espèces :', error));
  }

//ENVOI D'UN FORMULAIRE POUR INTERROGER LE SERVEUR
// Sélection des champs de formulaire
var input1 = document.getElementById("searchInput");
var input2 = document.getElementById("searchInputSpecies");

// Ajout d'un écouteur d'événements pour détecter les changements dans les champs
input1.addEventListener("input", function() {
    console.log('Changement détecté dans le champ de recherche de la ville');
    submitForm();
});
input2.addEventListener("input", function() {
    console.log('Changement détecté dans le champ de recherche de l\'espèce');
    submitForm();
});

//Récupérer la valeur séléctionnée
function submitForm() {
  var ville = document.getElementById('searchInput').value;
  var espece = document.getElementById('searchInputSpecies').value;
  console.log('Ville sélectionnée :', ville);
  console.log('Espèce sélectionnée :', espece);
  showDataOnMap(ville, espece);
}

var currentpoint = null;
var pointsLayer = null;
// Fonction pour afficher les données sur la carte en fonction des filtres sélectionnés
function showDataOnMap(ville, espece) {
  // Préparer les données à envoyer dans la requête
  var formData = new FormData();
  formData.append('searchInput', ville); //quand une <option> est sélectionnée, récupération de la valeur
  formData.append('searchInputSpecies', espece);

  // Configurer les options de la requête
  var requestOptions = {
      method: 'POST',
      body: formData
  };

  // Effectuer la requête POST vers la route sur server
  fetch('/requetedouble', requestOptions)
      .then(response => response.json())
      .then(data => {
          console.log('Données GeoJSON reçues : ', data);
          //si la liste renvoyée est vide : affiche un message d'alerte
          if (data.length == 0) {alert("L'espèce sélectionnée ne se trouve pas dans cette ville.")} 

          // Supprimer la couche précédente de points de la carte
          if (currentpoint) {
              map.removeLayer(currentpoint);
          }

          // Ajouter la nouvelle couche GeoJSON à la carte
          pointsLayer = L.geoJSON(data, {
            pointToLayer: function (feature, latlng) {
              var marker = L.circleMarker(latlng);  
              // popup sur les points
              marker.bindPopup(
                  "<b>Phylum :</b> " +
                    feature.properties.phylum +
                  "<br><b>Classe :</b> " +
                    feature.properties.class+
                    "<br><b>Ordre :</b> " +
                    feature.properties.order +
                    "<br><b>Famille :</b> " +
                    feature.properties.family +
                    "<br><b>Genre :</b> " +
                    feature.properties.genus +
                    "<br><b>Espèce :</b> " +
                    feature.properties.species+
                    "<br><b>Photo :</b> <img src='" + 
                    feature.properties.lien + "' style='max-width: 100px; max-height: 100px;'>"
                    
                    );
                    
                    return marker;
                  },
                  style:stylepardefaut
          }).addTo(map); // Ajouter à la carte


          // Mettre à jour les points sélectionnés
          currentpoint = pointsLayer;
          console.log(pointsLayer.getBounds())
          // Ajuster le zoom pour s'adapter à la nouvelle couche GeoJSON
          map.fitBounds(pointsLayer.getBounds());
          pointsLayer.bringToFront();

          // Ajouter les fonctions pour tous les graphiques (définies plus bas)
          updateBarChartstat(pointsLayer);
          updateIndicators(pointsLayer);
          updatePieChart(pointsLayer);
          updateDistanceBarChart(pointsLayer);
          updateBarChartstat(pointsLayer);
          // Ajouter la fonction pour changer les styles en fonction des onglets (défini plus bas)
          changePointsStyleBasedOnTab(pointsLayer);
      })
      .catch(error => console.error('Erreur lors de la récupération des données géographiques :', error));
}

// Appel des fonctions de récupération des listes au chargement de la page
window.onload = function() {
  getListeVille();
  getListeEspece();
};


// Pour que la banière reste en haut
window.addEventListener('scroll', function() {
  var headerHeight = document.querySelector('header').offsetHeight;
  var scrollThreshold = headerHeight * 0.2; // Calcul du seuil de défilement (20% du header)
  var banniere = document.querySelector('.banniere');
  if (window.scrollY > scrollThreshold) {
      banniere.style.top = '0';
  } else {
      banniere.style.top = '100px';
  }
});


// DEFINITION DE TOUTES LES FONCTIONNALITÉS DES ONGLETS
// changer la position de l'échelle, la monter si la box fleuve monte aussi (pour éviter qu'elle soit masquée par la box)
function adjustScalePosition(boxName) {
  var scaleDiv = document.querySelector('.leaflet-control-scale');
  if (boxName === 'fleuve') {
    scaleDiv.style.bottom = '170px';
  } else {
    scaleDiv.style.bottom = '30px'; // Retour à la position par défaut
  }
}

// changer la position des sources, de la meme manière que l'échelle
function adjustSourcesPosition(boxName) {
  var scaleDiv = document.querySelector('.leaflet-control-attribution');
  if (boxName === 'indicateurs') {
    scaleDiv.style.bottom = '170px';
  } else {
    scaleDiv.style.bottom = '30px'; // Retour à la position par défaut
  }
}

// Fonction pour restaurer la position des box si elles ne sont pas cliquées
// permet d'avoir une seule box en haut à la fois
function resetOtherBoxPositions(clickedBox) {
  var allBoxes = document.querySelectorAll('.box');
  allBoxes.forEach(function(box) {
    if (box !== clickedBox && box.classList.contains('enlarge')) {
      box.classList.remove('enlarge');
    }
  });
}

// Définir une fonction pour changer le style de la couche de points en fonction de l'onglet sélectionné
// on choisi le nom de la box (définie dans le html) et on défini un des styles crées plus haut
function changePointsStyleBasedOnTab(boxName) {
  if (boxName === 'agrements') {
    pointsLayer.setStyle(styleParcs);
  } else if (boxName === 'statut') {
    pointsLayer.setStyle(styleDanger);
  } else if (boxName === 'fleuve') {
    pointsLayer.setStyle(styleFleuve);
    // si aucun des 3 onglets avec les graphiques n'est sélectionné, on remet le style par défaut :
  } else {
    pointsLayer.setStyle(stylepardefaut);
  }
  console.log("changePointsStyleBasedOnTab")
}

// par défaut on met tous les onglets vides, cela permet de masquer le graphique (canva dans le html)
document.addEventListener("DOMContentLoaded", function() {
  var canvases = document.querySelectorAll("canvas");
  canvases.forEach(function(canvas) {
    canvas.style.display = "none";
  });
});

// inversement, si l'onglet est cliqué, fonction pour afficher le contenu de l'onglet (le canva)
function showContent(elementId) {
  var element = document.getElementById(elementId);
  if (element) {
    element.style.display = "block";
  }
}

// Fonction pour masquer à nouveau le contenu de l'onglet (canva) si un autre onglet est sélectionné
function hideContent(elementId) {
  var element = document.getElementById(elementId);
  if (element) {
    element.style.display = "none";
  }
}

// définir la fonction qui est appelée dans le html, permet de réunir toutes les fonctions des onglets définies
// précedemment
function toggleBox(boxName) {
  var box = document.querySelector('.' + boxName);
  var canvas = box.querySelector('canvas');
  var allBoxes = document.querySelectorAll('.box');

  // Si la boîte est déjà agrandie, réduisez-la et masquez le graphique
  if (box.classList.contains('enlarge')) {
    box.classList.remove('enlarge');
    hideContent(canvas.id);
    adjustScalePosition(); // Réinitialiser la position de l'échelle
    adjustSourcesPosition(); // Réinitialiser la position des sources
    changePointsStyleBasedOnTab(); // Changer le stye 
  } else {
    // Sinon, masquez le graphique de toutes les autres boîtes et affichez celui de la boîte actuelle
    allBoxes.forEach(function(otherBox) {
      var otherCanvas = otherBox.querySelector('canvas');
      if (otherBox !== box && otherBox.classList.contains('enlarge')) {
        otherBox.classList.remove('enlarge');
        hideContent(otherCanvas.id);
      }
    });
    // Affichez le graphique de la boîte actuelle et agrandissez-la
    showContent(canvas.id);
    box.classList.add('enlarge');
    adjustScalePosition(boxName);
    adjustSourcesPosition(boxName);
    changePointsStyleBasedOnTab(boxName);
    changePointsStyleAndCanvas(boxName);
  }
}


// CREATION DES GRAPHIQUES

// CREER LE DIAGRAMME EN CAMEMBERT
// Définir l'objet Utils avec une propriété CHART_COLORS, on défini les classes du graphique
var Utils = {
  CHART_COLORS: {
      "Danger Critique": "#E22019",
      "En Danger": "#E87027",
      "Quasi menace": "#E8D327",
      "Preoccupation moindre": "#79E827",
      null: "#7E7777",
  },
};

// Initialiser la configuration du pie chart
var config = {
  type: "pie",
  data: {
      labels: [],
      datasets: [{
          data: [],
          backgroundColor: Object.values(Utils.CHART_COLORS),
          borderWidth: 0,
      }, ],
  },
  options: {
      responsive: false,
      plugins: {
          legend: {
              labels: {
                  color: 'white',
                  font: {
                      size: 11
                  }
              },
              position: "right",
              boxWidth: 10
          },
          title: {
              display: true,
              color: 'white',
              text: "Diagramme circulaire de la répartion des statuts IUCN",
          },
          pie: {
              position: "left"
          }
      },
  },
};

// Fonction pour mettre à jour le diagramme en camembert en fonction des points affichés sur la carte
function updatePieChart(pointsLayer) {
  // Initialiser le compteur des occurrences de chaque catégorie IUCN
  const occurrences = {
    "Danger Critique": 0,
    "En Danger": 0,
    "Quasi menace": 0,
    "Preoccupation moindre": 0,
    null: 0,
  };

  // Parcourir les points de pointsLayer (couche fetch chargée plus haut) et mettre à jour les occurrences
  pointsLayer.eachLayer(layer => {
    const iucnValue = layer.feature.properties.iucn; //on va chercher le nom du champ 
    if (occurrences.hasOwnProperty(iucnValue)) {
      occurrences[iucnValue]++;
    }
  });

  // Mettre à jour les données du graphique avec les nouvelles occurrences
  config.data.labels = Object.keys(occurrences);
  config.data.datasets[0].data = Object.values(occurrences);

  // Mettre à jour le graphique
  myPieChart.update();
}

// Créer le graphique circulaire initial
var ctx = document.getElementById("myPieChart").getContext("2d");
var myPieChart = new Chart(ctx, config);

// Écouter les événements de clic sur les espèces et mettre à jour le graphique
document.addEventListener("DOMContentLoaded", function() {
  // Récupérer l'élément input avec l'ID "searchInputSpecies"
  var inputSpecies = document.getElementById("searchInputSpecies");
  // Attacher un écouteur d'événements à l'événement "input" sur cet élément
  inputSpecies.addEventListener("input", function(event) {
    // Logique à exécuter lorsque le contenu de l'input change
    var inputValue = event.target.value;
    console.log("Contenu de l'input :", inputValue);
    // Appeler la fonction de filtrage ou effectuer d'autres actions en fonction de la valeur de l'input
  });
});

// Fonction pour afficher l'image du diagramme en camembert
function afficherImagePie() {
  var img = new Image();
  img.onload = function() {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.drawImage(img, 0, 0, ctx.canvas.width, ctx.canvas.height);
  };
  img.src = 'img/Pie_Chart_IUCN.png'; // Assurez-vous de spécifier le bon chemin vers l'image
}

// Appeler la fonction pour afficher l'image dès que la page est chargée
window.addEventListener('load', function() {
  afficherImagePie();
});



// DIAGRAMME FLEUVE
// Définir la configuration du diagramme en barres
var configDistance = {
  type: "bar",
  data: {
    // Definition de la légende
    labels: [
      "0-785m",
      "785-2462m",
      "2462-5778m",
      "5778-11347m",
      "11347-23962m",
      "23962-260000m",
    ],
    datasets: [ //Définir les classes 
      {
        label: "Nombre d'occurrences",
        data: Array(6).fill(0), // Initialiser les données à zéro
        backgroundColor: [
          // Definition des couleurs du graphique
          "#0C5569",
          "#0F6B84",
          "#13809F",
          "#19ACD5",
          "#42C5E9",
          "#78D5EF",
        ],
        borderWidth: 0,
      },
    ],
  },
  options: 
  {
    responsive: false,
    plugins: {
      legend: {
        display: true,
        position: "right",
        labels: {
          font: {
              fontColor: 'white',
               size: 10, // Taille de police plus petite
            },
        color: 'white',
        ticks: {
          display: false,
          color : 'white'},
          boxWidth: 20,
          boxHeight: 20,
          padding: 15,
          usePointStyle: true,
          generateLabels: function (chart) {
            const data = chart.data;
            if (data.labels.length && data.datasets.length) {
              return data.labels.map(function (label, i) {
                const color = data.datasets[0].backgroundColor[i];
                return {
                  text: label,
                  fillStyle: color,
                  fontColor: 'white',
                  strokeStyle: color,
                  lineWidth: 1,
                  hidden: false,
                  index: i,
                };
              });
            }
            return [];
          },
        },
      },
    },
    scales: {
      x: {
        legend:{
          label:{
            color:'white',
          }
        },
        grid: {
          display: true,
          color: 'white',
          lineWidth:0.2
        },
        ticks: {
          display: false,

          fontColor : 'white'
        },
        title: {
          display: true,
          text: "Distance au fleuve le plus proche",
          padding: { top: 20, bottom: 10 },
          color: 'white',
          font: {
            size: 11,
          },
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          display: true,
          color:'white',
          lineWidth:0.2

        },
        title: {
          display: true,
          text: "Nombre d'occurrences",
          padding: { top: 20, bottom: 10 },
          color: 'white',
          font: {
            size: 11,
            color: 'white'
          },
        },
        ticks: {
          color: 'white', // Couleur des étiquettes de l'axe y en blanc
        },
      },
    },
    layout: {
        padding: {
          left: 0, // Réduire la marge à gauche
        },
      },
    barWidth: 0, // Déplacer barWidth ici
    layout: {
      padding: {
        bottom: 0, // Réduire la marge en bas
        left: 0,
        right: 0
      },
    },
  },
};

// Créer le graphique en barres initial
var ctxDistance = document.getElementById("myBarChartDistance").getContext("2d");
var myBarChartDistance = new Chart(ctxDistance, configDistance);

// Fonction pour mettre à jour le diagramme en barres de la distance au fleuve en fonction des points affichés sur la carte
function updateDistanceBarChart(pointsLayer) {
  // Initialiser le compteur des distances au fleuve
  const distances = {
    "0-785m": 0,
    "785-2462m": 0,
    "2462-5778m": 0,
    "5778-11347m": 0,
    "11347-23962m": 0,
    "23962-260000m": 0,
  };

  // Parcourir les points et mettre à jour les distances
  pointsLayer.eachLayer(layer => {
    const distanceValue = layer.feature.properties.distfleuve; //Préciser le champ de style
    if (distanceValue >= 0 && distanceValue < 785) {
      distances["0-785m"]++;
    } else if (distanceValue >= 785 && distanceValue < 2462) {
      distances["785-2462m"]++;
    } else if (distanceValue >= 2462 && distanceValue < 5778) {
      distances["2462-5778m"]++;
    } else if (distanceValue >= 5778 && distanceValue < 11347) {
      distances["5778-11347m"]++;
    } else if (distanceValue >= 11347 && distanceValue < 23962) {
      distances["11347-23962m"]++;
    } else if (distanceValue >= 23962 && distanceValue < 260000) {
      distances["23962-260000m"]++;
    }
  });

  // Mettre à jour les données du graphique avec les nouvelles distances
  configDistance.data.labels = Object.keys(distances);
  configDistance.data.datasets[0].data = Object.values(distances);

  // Mettre à jour le graphique
  myBarChartDistance.update();
}


// Fonction pour afficher l'image du diagramme en barres de la distance au fleuve
function afficherImageDistanceBar() {
  var img = new Image();
  img.onload = function() {
    ctxDistance.clearRect(0, 0, ctxDistance.canvas.width, ctxDistance.canvas.height);
    ctxDistance.drawImage(img, 0, 0, ctxDistance.canvas.width, ctxDistance.canvas.height);
  };
  img.src = 'img/fleuves.PNG'; // Assurez-vous de spécifier le bon chemin vers l'image
}

// Appeler la fonction pour afficher l'image dès que la page est chargée
window.addEventListener('load', function() {
  afficherImageDistanceBar();
});


// Configuration du diagramme en barres d'agréments
var configAgrement = {
  type: "bar",
  data: {
    labels: [
      // Definition de la légende
      "Parc et envahissante",
      "Parc et non envahissante",
      "Hors parc et envahissante",
      "Hors parc et non envahissante",
    ],
    datasets: [
      {
        label: "Nombre d'occurrences",
        data: Array(4).fill(0),
        // Definition des couleurs du graphique
        backgroundColor: ["#3C721A", "#77D33E", "#ED91C7", "#DB248F"],
        borderWidth: 1,
        barPercentage: 1,
        categoryPercentage: 1,
      },
    ],
  },
  options: {
    responsive: false,
    scales: {
      x: {
        grid: {
          display: false,
          color: 'white'
        },
        ticks: {
          display: false,
          color: 'white'
        },
        title: {
          display: true,
          text: "Statuts d'agréments et d'envahissant",
          padding: { top: 20, bottom: 20 },
          color: 'white',
          font: {
            size: 11,
          },
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          display: true,
          color: 'white',
          lineWidth: 0.2
        },
        title: {
          display: true,
          text: "Nombre d'occurrences",
          padding: { top: 20, bottom: 10 },
          color: 'white',
          font: {
            size: 11,
          },
        },
        ticks: {
          color: 'white'
        },
      },
    },
    plugins: {
      legend: {
        display: true,
        position: "right",
        align: "start",
        labels: {
          boxWidth: 10,
          boxHeight: 10,
          padding: 15,
          usePointStyle: true,
          color: 'white',
          font: {
            size: 10,
          },
          generateLabels: function (chart) {
            const data = chart.data;
            if (data.labels.length && data.datasets.length) {
              return data.labels.map(function (label, i) {
                const color = data.datasets[0].backgroundColor[i];
                const lines = label.split('\n');

                return {
                  text: label,
                  fillStyle: color,
                  strokeStyle: color,
                  lineWidth: 1,
                  hidden: false,
                  index: i,
                  fontColor:'white',
                };
              });
            }
            return [];
          },
        },
        maxWidth: 100, // spécifiez la largeur maximale de la légende

      },
    },
  },
};

// Créer le graphique en barres initial
var ctxAgrement = document.getElementById("myBarChartAgrement").getContext("2d");
var myBarChartAgrement = new Chart(ctxAgrement, configAgrement);

// Fonction pour mettre à jour le graphique en fonction des points affichés sur la carte
function updateBarChartstat(pointsLayer) {
  // Initialiser le compteur des agréments
  const agrements = {
    "Parc et envahissante": 0,
    "Parc et non envahissante": 0,
    "Hors parc et envahissante": 0,
    "Hors parc et non envahissante": 0,
  };

  // Parcourir les points et mettre à jour les agréments
  pointsLayer.eachLayer(layer => {
    const statutparcValue = layer.feature.properties.statutparc; // Préciser le champ à utiliser
    if(statutparcValue===1){
      agrements["Parc et envahissante"]++;
    }else if (statutparcValue===2){
      agrements["Parc et non envahissante"]++;
    }else if (statutparcValue===3){
      agrements["Hors parc et envahissante"]++;
    }else if (statutparcValue===4){
      agrements["Hors parc et non envahissante"]++;
    }
  });

  // Mettre à jour les données du graphique avec les nouveaux agréments
  configAgrement.data.labels = Object.keys(agrements);
  configAgrement.data.datasets[0].data = Object.values(agrements);

  // Mettre à jour le graphique
  myBarChartAgrement.update();
}

// Fonction pour afficher l'image
function afficherImageAgr() {
  var img = new Image();
  img.onload = function() {
    ctxAgrement.clearRect(0, 0, ctxAgrement.canvas.width, ctxAgrement.canvas.height);
    ctxAgrement.drawImage(img, 0, 0, ctxAgrement.canvas.width, ctxAgrement.canvas.height);
  };
  img.src = 'img/Bar_Chart_Agrement_Parc.png';
}

// Appeler la fonction pour afficher l'image dès que la page est chargée
window.addEventListener('load', function() {
  afficherImageAgr();
});

// Écouter l'événement de zoom de la carte
map.on('zoomend', function() {
  var zoomLevel = map.getZoom();

  // Vérifier si le niveau de zoom est entre 1 et 6
  if (zoomLevel >= 1 && zoomLevel <= 6) {
    // Mettre à jour le graphique
    updateBarChartstat(pointsLayer);
  }
});



// Onglet indicateurs

// Fonction pour mettre à jour les indicateurs en fonction des propriétés de pointsLayer
function updateIndicators(pointsLayer) {
  // Récupérer la référence vers le canvas des indicateurs
  var indicateursCanvas = document.getElementById('indicateursCanvas');
  var ctx = indicateursCanvas.getContext('2d');

  // Fonction pour dessiner le contenu de pointsLayer dans le canvas
  function dessinerContenu() {
    // Effacer le contenu précédent du canvas
    ctx.clearRect(0, 0, indicateursCanvas.width, indicateursCanvas.height);

    // Vérifier si pointsLayer est vide
    if (pointsLayer && pointsLayer.getLayers().length > 0) {
      // Récupérer les propriétés du premier point
      var firstPointProperties = pointsLayer.getLayers()[0].feature.properties;
      // Dessiner le contenu dans le canvas
      ctx.font = "14px system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif";
      ctx.fillStyle = 'white';
      // Ici on choisi le texte, et le champ à afficher
      ctx.fillText('Pour la ville sélectionnée :', 10, 20);
      ctx.fillText('Nombre d\'espèces : ' + firstPointProperties.nbespece, 10, 40);
      ctx.fillText('Top espèce : ' + firstPointProperties.topespece, 10, 60);
      ctx.fillText('Nombre d\'espèces ayant une occurrence : ' + firstPointProperties.especerare, 10, 80);
    } else {
      // Si pointsLayer est vide, afficher un message
      ctx.font = "14px system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif";
      ctx.fillStyle = 'white';
      ctx.fillText('Aucun point sélectionné.', 10, 20);
    }
  }

  // Appeler la fonction pour dessiner le contenu
  dessinerContenu();
}

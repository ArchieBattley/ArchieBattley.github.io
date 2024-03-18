// Disables Zoom on Mobile

// Prevent double tap zoom
document.addEventListener('DOMContentLoaded', function() {
    var lastTouchEnd = 0;
    document.addEventListener('touchend', function(event) {
        var now = (new Date()).getTime();
        if (now - lastTouchEnd <= 300) {
            event.preventDefault();
        }
        lastTouchEnd = now;
    }, false);
}, false);

// Prevent pinch to zoom
document.addEventListener('gesturestart', function (e) {
    e.preventDefault();
});

document.addEventListener('gesturestart', function(e) {
    e.preventDefault();
    // special hack to prevent zoom-to-tabs gesture in safari
    document.body.style.zoom = 0.99;
});

document.addEventListener('gesturechange', function(e) {
    e.preventDefault();
    // special hack to prevent zoom-to-tabs gesture in safari
    document.body.style.zoom = 0.99;
});

document.addEventListener('gestureend', function(e) {
    e.preventDefault();
    // special hack to prevent zoom-to-tabs gesture in safari
    document.body.style.zoom = 0.99;
});

// CONFIGURATOR 

// Get the model viewer element
const modelViewer = document.querySelector('model-viewer');

// Skybox Functionality

 // Array of skybox image URLs
 const skyboxImages = [
  "https://archiebattley.com/kingsley/img/hdri/eveningfield.jpg",
  "https://archiebattley.com/kingsley/img/hdri/mountainlake.jpg",
  "https://archiebattley.com/kingsley/img/hdri/university.jpg",
  "https://archiebattley.com/kingsley/img/hdri/dirtroad.jpg",
  "https://archiebattley.com/kingsley/img/hdri/eveningroad.jpg",
  // Add more skybox image URLs here...
];

// Function to choose a random skybox image URL
function getRandomSkyboxImage() {
  return skyboxImages[Math.floor(Math.random() * skyboxImages.length)];
}

// Set a random skybox image on page load
modelViewer.skyboxImage = getRandomSkyboxImage();

// Skybox Functionality End


// Enables Configurator Functionality
const modelViewerColor = document.querySelector("model-viewer#configurator");


// Function to generate a random color
function getRandomColor() {
    const colors = ['#005b6d', '#8A210C', '#4B6413', '#3E4428', '#dddbbf', '#D17E27', '#442719', '#a1987e']; // Add more colors as needed
    return colors[Math.floor(Math.random() * colors.length)];
  }

  // Function to apply a random color to the model
  function randomizeColor() {
    const modelViewerColor = document.getElementById('configurator');
    const randomColor = getRandomColor();
    const material = modelViewerColor.model.materials[0];
    material.pbrMetallicRoughness.setBaseColorFactor(randomColor);
  }

  // Wait for a short delay after the page has loaded, then apply a random color
  window.addEventListener('load', () => {
    setTimeout(randomizeColor, 725); // Adjust the delay as needed
  });

// Body Color Selector
document.querySelector('#color-controls').addEventListener('click', (event) => {
  const colorString = event.target.dataset.color;
  const material = modelViewerColor.model.materials[0]; // added the index of the material that I see in the editor page
  material.pbrMetallicRoughness.setBaseColorFactor(colorString);
});

// Wheel Color Selector
document.querySelector('#color-controls2').addEventListener('click', (event) => {
  const colorString = event.target.dataset.color;
  const materialIndices = [9, 10]; // Add indices of materials you want to update
  materialIndices.forEach(index => {
    const material = modelViewerColor.model.materials[index];
    if (material) {
      material.pbrMetallicRoughness.setBaseColorFactor(colorString);
    }
  });
});
    
// Bumper Color Selector
document.querySelector('#color-controls3').addEventListener('click', (event) => {
  const colorString = event.target.dataset.color;
  const material = modelViewerColor.model.materials[5]; // added the index of the material that I see in the editor page
  material.pbrMetallicRoughness.setBaseColorFactor(colorString);
});

// Options

const mvTextures = document.querySelector("model-viewer#configurator");
const wheel1Button = document.querySelector("#wheel1Button");
const wheel2Button = document.querySelector("#wheel2Button");

mvTextures.addEventListener("model-visibility", initializeMaterialManipulation);

function initializeMaterialManipulation() {
  function updateMaterial(material, alpha, isOpaque) {
    material.setAlphaMode(isOpaque ? "OPAQUE" : "MASK"); // Use MASK alpha mode for alpha clipping
    const pbr = material.pbrMetallicRoughness;
    const baseColor = pbr.baseColorFactor;
    baseColor[3] = alpha; // Set alpha directly without adjusting for opaque
    pbr.setBaseColorFactor(baseColor);
    material.alphaCutoff = 0.5; // Set the alpha cutoff threshold (adjust as needed)
  }

  wheel1Button.addEventListener("click", () => {
    const Wheel1 = mvTextures.model.getMaterialByName("Wheel1");
    const Wheel2 = mvTextures.model.getMaterialByName("Wheel2");
    // Update materials instantly without animations
    updateMaterial(Wheel1, 1, true);
    updateMaterial(Wheel2, 0, false);
  });

  wheel2Button.addEventListener("click", () => {
    const Wheel1 = mvTextures.model.getMaterialByName("Wheel1");
    const Wheel2 = mvTextures.model.getMaterialByName("Wheel2");
    // Update materials instantly without animations
    updateMaterial(Wheel1, 0, false);
    updateMaterial(Wheel2, 1, true);
  });
}

// Options End
    

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

// Enables Color Picker Functionality
const modelViewerColor = document.querySelector("model-viewer#color");

// Function to generate a random color
function getRandomColor() {
    const colors = ['#005b6d', '#8A210C', '#4B6413', '#3E4428', '#dddbbf', '#D17E27', '#442719', '#a1987e']; // Add more colors as needed
    return colors[Math.floor(Math.random() * colors.length)];
  }

  // Function to apply a random color to the model
  function randomizeColor() {
    const modelViewerColor = document.getElementById('color');
    const randomColor = getRandomColor();
    const material = modelViewerColor.model.materials[0];
    material.pbrMetallicRoughness.setBaseColorFactor(randomColor);
  }

  // Wait for a short delay after the page has loaded, then apply a random color
  window.addEventListener('load', () => {
    setTimeout(randomizeColor, 500); // Adjust the delay as needed
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
  const material = modelViewerColor.model.materials[10]; // added the index of the material that I see in the editor page
  material.pbrMetallicRoughness.setBaseColorFactor(colorString);
});
    
// Bumper Color Selector
document.querySelector('#color-controls3').addEventListener('click', (event) => {
  const colorString = event.target.dataset.color;
  const material = modelViewerColor.model.materials[5]; // added the index of the material that I see in the editor page
  material.pbrMetallicRoughness.setBaseColorFactor(colorString);
});

    

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

// Get the button element
const changeSkyboxButton = document.getElementById('changeSkyboxButton');

// Index to track the current skybox image
let currentSkyboxIndex = 0;

// Add click event listener to the button
changeSkyboxButton.addEventListener('click', function() {
  // Cycle to the next skybox image
  currentSkyboxIndex = (currentSkyboxIndex + 1) % skyboxImages.length;
  // Set the next skybox image
  modelViewer.skyboxImage = skyboxImages[currentSkyboxIndex];
});

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

/// BODY COLOR SELECTION ///

// Random Color Selection on Load
document.addEventListener("DOMContentLoaded", function() {
  const colorControls = document.getElementById('color-controls');
  const buttons = colorControls.querySelectorAll('.btn');

  // Function to simulate a click event on a button
  function simulateButtonClick(button) {
    const event = new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
      view: window
    });
    button.dispatchEvent(event);
  }

  // Function to add "active" class to a random button and simulate click
  function activateRandomButton() {
    const randomIndex = Math.floor(Math.random() * buttons.length);
    const randomButton = buttons[randomIndex];
    randomButton.classList.add("active");
    simulateButtonClick(randomButton);
  }

  // Delay activation of a random button by 800ms
  setTimeout(activateRandomButton, 800);
});

// BODY COLORS
// Function to apply base color factor to the model
function applyBaseColorFactor(color) {
  const material = modelViewerColor.model.materials[0]; // or whichever material you want to apply the color to
  material.pbrMetallicRoughness.setBaseColorFactor(color);
}

// Body Color Selector
document.querySelector('#color-controls').addEventListener('click', (event) => {
  const colorString = event.target.dataset.color;
  const material = modelViewerColor.model.materials[0]; // added the index of the material that I see in the editor page
  material.pbrMetallicRoughness.setBaseColorFactor(colorString);
});

document.addEventListener("DOMContentLoaded", function() {
  const colorControls = document.getElementById('color-controls');

  // Function to add "active" class to clicked button and remove from siblings
  function setActiveButton(button) {
    const siblings = Array.from(colorControls.querySelectorAll(".btn"));
    siblings.forEach(sibling => {
      if (sibling !== button) {
        sibling.classList.remove("active");
      }
    });
    button.classList.add("active");
  }

  // Event listeners for all buttons inside #color-controls
  colorControls.querySelectorAll('.btn').forEach(button => {
    button.addEventListener("click", function(event) {
      setActiveButton(button);
      const color = button.getAttribute("data-color");
      applyBaseColorFactor(color); // Call the function to apply base color factor here if needed
      event.stopPropagation(); // Prevent click event from bubbling up
    });
  });
});

// CAMERA ANIMATIONS

// Define the annotationClicked function to handle hotspot clicks
const annotationClicked = (hotspot) => {
  // Extract the dataset attributes from the hotspot
  let dataset = hotspot.dataset;
  
  // Get the model viewer element by its ID
  const modelViewer = document.querySelector("#configurator");

  // Store the original interpolation decay value
  const originalInterpolationDecay = modelViewer.interpolationDecay;

  // Set a temporary interpolation decay for the hotspot animation
  modelViewer.interpolationDecay = 300; // Adjust this value as needed for hotspot animations

  // Set the camera target and orbit based on the hotspot's dataset attributes
  modelViewer.cameraTarget = dataset.target;
  modelViewer.cameraOrbit = dataset.orbit;

  // Reset the interpolation decay to its original value after the animation
  setTimeout(() => {
    modelViewer.interpolationDecay = originalInterpolationDecay;
  }, 1000); // Adjust the delay as needed
}

// Find all the hotspot container divs and attach click event listeners to them
document.querySelectorAll('[slot^="hotspot-"]').forEach((hotspotContainer) => {
  hotspotContainer.addEventListener('click', (event) => {
    // Check if the clicked target is not inside the collapse element
    if (!event.target.closest('.collapse')) {
      annotationClicked(hotspotContainer);
    }
  });
});

// CAMERA ANIMATIONS

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

// Selection Buttons
document.addEventListener("DOMContentLoaded", function() {
  const wheel1Button = document.getElementById("wheel1Button");
  const wheel2Button = document.getElementById("wheel2Button");

  // Function to add "active" class to clicked button and remove from siblings
  function setActiveButton(button) {
    button.classList.add("active");
    const siblings = Array.from(button.parentNode.parentNode.querySelectorAll("button"));
    siblings.forEach(sibling => {
      if (sibling !== button) {
        sibling.classList.remove("active");
      }
    });
  }

  // Event listener for wheel1Button
  wheel1Button.addEventListener("click", function(event) {
    setActiveButton(wheel1Button);
    event.stopPropagation(); // Prevent click event from bubbling up
  });

  // Event listener for wheel2Button
  wheel2Button.addEventListener("click", function(event) {
    setActiveButton(wheel2Button);
    event.stopPropagation(); // Prevent click event from bubbling up
  });

  // Event listener to keep active class on the button when clicking outside buttons
  document.body.addEventListener("click", function(event) {
    if (!event.target.closest("#wheel1Button, #wheel2Button")) {
      const activeButton = document.querySelector("#wheel1Button.active, #wheel2Button.active");
      if (activeButton) {
        setActiveButton(activeButton);
      }
    }
  });
});
//Selection Buttons End

// Options End


// SCREENSHOTS
// Get the button element
const takeScreenshotButton = document.getElementById('takeScreenshotButton');

// Add click event listener to the button
takeScreenshotButton.addEventListener('click', function() {
    // Get the model viewer element by its ID
    const modelViewer = document.getElementById('configurator');
    
    // Create a canvas element to draw the model viewer content
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    // Set canvas dimensions to match the model viewer
    canvas.width = modelViewer.clientWidth;
    canvas.height = modelViewer.clientHeight;

    // Create an image element to render the model viewer onto the canvas
    const image = new Image();

    // Convert the model viewer to a data URL
    const dataUrl = modelViewer.toDataURL();

    // Set the image source to the data URL
    image.src = dataUrl;

    // Once the image has loaded, draw it onto the canvas
    image.onload = function() {
        context.drawImage(image, 0, 0, canvas.width, canvas.height);

        // Convert the canvas to a blob
        canvas.toBlob(function(blob) {
            if (blob) {
                // Create a download link for the blob
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = 'screenshot.png';
                document.body.appendChild(link);

                // Click the download link to trigger the download
                link.click();

                // Cleanup: remove the download link and revoke the blob URL
                document.body.removeChild(link);
                URL.revokeObjectURL(url);
            } else {
                console.error('Failed to capture screenshot');
            }
        });
    };
});
// SCREENSHOTS END
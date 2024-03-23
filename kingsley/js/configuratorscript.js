// PINCH TO ZOOM HACKS

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

// PINCH TO ZOOM HACKS

    // Get the navbar toggler button and the icon inside it
    const navbarToggler = document.getElementById('navbarToggler');
    const toggleIcon = document.getElementById('toggleIcon');

    // Add an event listener for the toggle button click
    navbarToggler.addEventListener('click', () => {
      // Toggle the rotate-180 class on the toggle icon
      toggleIcon.classList.toggle('rotate-180');
    });

// CONFIGURATOR 

// Get the model viewer element
const modelViewer = document.querySelector('model-viewer');

// Skybox Functionality

// Function to handle button click to toggle active state and change icon
const handleToggleButton = () => {
  const button = document.getElementById('skyboxToggleButton');
  
  // Add event listener to the button
  button.addEventListener('click', () => {
    // Toggle the 'active' class on the button
    button.classList.toggle('active');
    
    // Check if the button is active
    if (button.classList.contains('active')) {
      // If active, change the button icon to the 'x' icon
      button.classList.remove('fa-mountain-sun');
      button.classList.add('fa-times');
    } else {
      // If inactive, change the button icon back to the original icon
      button.classList.remove('fa-times');
      button.classList.add('fa-mountain-sun');
    }
  });
}

// Call the function to handle the button click
handleToggleButton();

  // Variable to store the current skybox image URL
let currentSkyboxImageUrl = null;

// Function to set the skybox image dynamically with query parameters
function setSkyboxImage(imageUrl) {
  // Generate a unique timestamp using Date.now()
  const timestamp = Date.now();

  // Append the timestamp as a query parameter to the image URL
  const urlWithTimestamp = `${imageUrl}?timestamp=${timestamp}`;

  // Cleanup previous skybox image from memory
  cleanupPreviousSkybox();

  // Store the current skybox image URL
  currentSkyboxImageUrl = urlWithTimestamp;

  // Set the skybox image with the updated URL
  const modelViewer = document.querySelector("#configurator"); // Assuming this is your model-viewer element
  modelViewer.setAttribute('skybox-image', urlWithTimestamp);
}

// Function to cleanup the previous skybox image from memory
function cleanupPreviousSkybox() {
  if (currentSkyboxImageUrl) {
    URL.revokeObjectURL(currentSkyboxImageUrl);
    currentSkyboxImageUrl = null;
  }
}

// Function to choose a random skybox image URL
function getRandomSkyboxImage() {
  const skyboxImages = [
    "https://archiebattley.com/kingsley/img/hdri/eveningfield.jpg",
    "https://archiebattley.com/kingsley/img/hdri/mountainlake.jpg",
    "https://archiebattley.com/kingsley/img/hdri/university.jpg",
    "https://archiebattley.com/kingsley/img/hdri/dirtroad.jpg",
    "https://archiebattley.com/kingsley/img/hdri/eveningroad.jpg",
    // Add more skybox image URLs here...
  ];
  return skyboxImages[Math.floor(Math.random() * skyboxImages.length)];
}

// Set a random skybox image on page load
setSkyboxImage(getRandomSkyboxImage());

// Skybox Functionality End


// Define the functions for camera animations
const setCameraFromDataset = (hotspotSlot) => {
  // Find the corresponding hotspot container div based on slot
  const hotspotContainer = document.querySelector(`[slot="hotspot-${hotspotSlot}"]`);
  
  if (hotspotContainer) {
    // Extract the dataset attributes from the hotspot
    const dataset = hotspotContainer.dataset;
    
    // Get the model viewer element by its ID
    const modelViewer = document.querySelector("#configurator");

    // Set the camera target and orbit based on the hotspot's dataset attributes
    modelViewer.cameraTarget = dataset.target;
    modelViewer.cameraOrbit = dataset.orbit;
  }
}

const resetCamera = () => {
  const modelViewer = document.querySelector("#configurator");
  modelViewer.cameraTarget = "0m 1.5m 0m";
  modelViewer.cameraOrbit = "-40deg 85deg 20m";
}

// Function to handle button clicks for camera animations
const handleButtonClick = (button) => {
  button.addEventListener('click', () => {
    // Toggle the 'active' class on the clicked button
    button.classList.toggle('active');
    
    // Check if the button is active after toggling
    if (button.classList.contains('active')) {
      // If active, set camera target and orbit based on the dataset attributes of the corresponding hotspot
      const hotspotSlot = button.parentElement.getAttribute('slot').replace('hotspot-', '');
      setCameraFromDataset(hotspotSlot);
      
      // Change the button icon to the close icon
      button.classList.toggle('fa-x');
    } else {
      // If inactive, reset camera to default settings
      resetCamera();
      
      // Change the button icon back to its original state
      button.classList.toggle('fa-x');
    }
  });
}

// Find all the buttons with the class 'btn-icons' and attach event listeners
document.querySelectorAll('.btn-icons').forEach(handleButtonClick);

// Here, integrate your other JavaScript elements targeting #configurator
// Ensure that they don't interfere with the camera animations section.


// Enables Configurator
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

  // Delay activation of a random button by 1000ms
  setTimeout(activateRandomButton, 1000);
});

// BODY COLORS //

// Function to apply base color factor to the model
function applyBaseColorFactor(color) {
  const material = modelViewerColor.model.materials[0]; // or whichever material you want to apply the color to
  material.pbrMetallicRoughness.setBaseColorFactor(color);
}

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

  // Event listener for the color picker button
  const colorPickerButton = document.getElementById('colorpickerbutton');
  colorPickerButton.addEventListener('click', function(event) {
    setActiveButton(colorPickerButton);
  });

  // Event listeners for all buttons inside #color-controls
  colorControls.querySelectorAll('.btn').forEach(button => {
    button.addEventListener("click", function(event) {
      setActiveButton(button);
      const color = button.getAttribute("data-color");
      applyBaseColorFactor(color); // Call the function to apply base color factor here if needed
      colorPickerButton.classList.remove("active"); // Deactivate color picker button
      event.stopPropagation(); // Prevent click event from bubbling up
    });
  });
});

document.querySelector('#colorPicker').addEventListener('input', (event) => {
  const colorString = event.target.value;
  const material = modelViewerColor.model.materials[0];
  material.pbrMetallicRoughness.setBaseColorFactor(hexToRGB(colorString));
});

function hexToRGB(hex) {
  // Remove # if present
  hex = hex.replace(/^#/, '');
  
  // Convert to RGB
  const bigint = parseInt(hex, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  
  return [r / 255, g / 255, b / 255];
}

// Wheel Color Selector
document.querySelector('#color-controls2').addEventListener('click', (event) => {
  if (event.target.classList.contains('btn')) { // Check if the clicked element is a button
    const colorString = event.target.dataset.color;
    const materialIndices = [10, 11, 12, 13]; // Add indices of materials you want to update
    materialIndices.forEach(index => {
      const material = modelViewerColor.model.materials[index];
      if (material) {
        material.pbrMetallicRoughness.setBaseColorFactor(colorString);
      }
    });
  }
});

// Wheel Additional Color Matched Selector 



// Wheel Additional Color Matched Selector End
    
// Bumper Color Selector
document.querySelector('#color-controls3').addEventListener('click', (event) => {
  if (event.target.classList.contains('btn')) { // Check if the clicked element is a button
    const colorString = event.target.dataset.color;
    const material = modelViewerColor.model.materials[5]; // added the index of the material that I see in the editor page
    material.pbrMetallicRoughness.setBaseColorFactor(colorString);
  }
});

// Options

const mvTextures = document.querySelector("model-viewer#configurator");
const wheel1Button = document.querySelector("#wheel1Button");
const wheel2Button = document.querySelector("#wheel2Button");
const wheel3Button = document.querySelector("#wheel3Button"); // Add wheel3Button
const wheel4Button = document.querySelector("#wheel4Button"); // Add wheel4Button

mvTextures.addEventListener("model-visibility", initializeMaterialManipulation);

function initializeMaterialManipulation() {
  function updateMaterial(material, alpha, isOpaque) {
    material.setAlphaMode(isOpaque ? "OPAQUE" : "MASK");
    const pbr = material.pbrMetallicRoughness;
    const baseColor = pbr.baseColorFactor;
    baseColor[3] = alpha;
    pbr.setBaseColorFactor(baseColor);
    material.alphaCutoff = 0.5;
  }

  wheel1Button.addEventListener("click", () => {
    const Wheel1 = mvTextures.model.getMaterialByName("Wheel1");
    const Wheel2 = mvTextures.model.getMaterialByName("Wheel2");
    const Wheel3 = mvTextures.model.getMaterialByName("Wheel3");
    const Wheel4 = mvTextures.model.getMaterialByName("Wheel4");
    updateMaterial(Wheel1, 1, true);
    updateMaterial(Wheel2, 0, false);
    updateMaterial(Wheel3, 0, false);
    updateMaterial(Wheel4, 0, false);
  });

  wheel2Button.addEventListener("click", () => {
    const Wheel1 = mvTextures.model.getMaterialByName("Wheel1");
    const Wheel2 = mvTextures.model.getMaterialByName("Wheel2");
    const Wheel3 = mvTextures.model.getMaterialByName("Wheel3");
    const Wheel4 = mvTextures.model.getMaterialByName("Wheel4");
    updateMaterial(Wheel1, 0, false);
    updateMaterial(Wheel2, 1, true);
    updateMaterial(Wheel3, 0, false);
    updateMaterial(Wheel4, 0, false);
  });

  wheel3Button.addEventListener("click", () => {
    const Wheel1 = mvTextures.model.getMaterialByName("Wheel1");
    const Wheel2 = mvTextures.model.getMaterialByName("Wheel2");
    const Wheel3 = mvTextures.model.getMaterialByName("Wheel3");
    const Wheel4 = mvTextures.model.getMaterialByName("Wheel4");
    updateMaterial(Wheel1, 0, false);
    updateMaterial(Wheel2, 0, false);
    updateMaterial(Wheel3, 1, true);
    updateMaterial(Wheel4, 0, false);
  });

  wheel4Button.addEventListener("click", () => {
    const Wheel1 = mvTextures.model.getMaterialByName("Wheel1");
    const Wheel2 = mvTextures.model.getMaterialByName("Wheel2");
    const Wheel3 = mvTextures.model.getMaterialByName("Wheel3");
    const Wheel4 = mvTextures.model.getMaterialByName("Wheel4");
    updateMaterial(Wheel1, 0, false);
    updateMaterial(Wheel2, 0, false);
    updateMaterial(Wheel3, 0, false);
    updateMaterial(Wheel4, 1, true);
  });
}

// Selection Buttons
document.addEventListener("DOMContentLoaded", function() {
  const wheel1Button = document.getElementById("wheel1Button");
  const wheel2Button = document.getElementById("wheel2Button");
  const wheel3Button = document.getElementById("wheel3Button");
  const wheel4Button = document.getElementById("wheel4Button");

  function setActiveButton(button) {
    button.classList.add("active");
    const siblings = Array.from(button.parentNode.parentNode.querySelectorAll("button"));
    siblings.forEach(sibling => {
      if (sibling !== button) {
        sibling.classList.remove("active");
      }
    });
  }

  wheel1Button.addEventListener("click", function(event) {
    setActiveButton(wheel1Button);
    event.stopPropagation(); // Prevent click event from bubbling up
  });

  wheel2Button.addEventListener("click", function(event) {
    setActiveButton(wheel2Button);
    event.stopPropagation(); // Prevent click event from bubbling up
  });

  wheel3Button.addEventListener("click", function(event) {
    setActiveButton(wheel3Button);
    event.stopPropagation(); // Prevent click event from bubbling up
  });

  wheel4Button.addEventListener("click", function(event) {
    setActiveButton(wheel4Button);
    event.stopPropagation(); // Prevent click event from bubbling up
  });

  document.body.addEventListener("click", function(event) {
    if (!event.target.closest("#wheel1Button, #wheel2Button, #wheel3Button, #wheel4Button")) {
      const activeButton = document.querySelector("#wheel1Button.active, #wheel2Button.active, #wheel3Button.active, #wheel4Button.active");
      if (activeButton) {
        setActiveButton(activeButton);
      }
    }
  });
});
//Selection Buttons End

//Random Wheel Selection on Load
document.addEventListener("DOMContentLoaded", function() {
  const wheelControls = document.getElementById('wheel-controls');
  const wheelButtons = wheelControls.querySelectorAll('button');

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
    const randomIndex = Math.floor(Math.random() * wheelButtons.length);
    const randomButton = wheelButtons[randomIndex];
    randomButton.classList.add("active");
    simulateButtonClick(randomButton); // Click the random button after selecting it
  }

  // Delay activation of a random button by 1800ms
  setTimeout(activateRandomButton, 1800);
});

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

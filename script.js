
// Enables Color Picker Functionality
const modelViewerColor = document.querySelector("model-viewer#color");

// Body Color Selector
document.querySelector('#color-controls').addEventListener('click', (event) => {
  const colorString = event.target.dataset.color;
  const material = modelViewerColor.model.materials[8]; // added the index of the material that I see in the editor page
  material.pbrMetallicRoughness.setBaseColorFactor(colorString);
});

// Wheel Color Selector
document.querySelector('#color-controls2').addEventListener('click', (event) => {
  const colorString = event.target.dataset.color;
  const material = modelViewerColor.model.materials[5]; // added the index of the material that I see in the editor page
  material.pbrMetallicRoughness.setBaseColorFactor(colorString);
});
    

    

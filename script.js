// Handles loading the events for <model-viewer>'s slotted progress bar
const onProgress = (event) => {
  const progressBar = event.target.querySelector('.progress-bar');
  const updatingBar = event.target.querySelector('.update-bar');
  updatingBar.style.width = `${event.detail.totalProgress * 100}%`;
  if (event.detail.totalProgress === 1) {
    progressBar.classList.add('hide');
  } else {
    progressBar.classList.remove('hide');
    if (event.detail.totalProgress === 0) {
      event.target.querySelector('.center-pre-prompt').classList.add('hide');
    }
  }
};
document.querySelector('model-viewer').addEventListener('progress', onProgress);

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
  const material = modelViewerColor.model.materials[26]; // added the index of the material that I see in the editor page
  material.pbrMetallicRoughness.setBaseColorFactor(colorString);
});
    

    

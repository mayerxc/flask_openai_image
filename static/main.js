const loadingDiv = document.querySelector('[data-loading]');
const inputElement = document.querySelector('[data-input]');
const sizeElement = document.querySelector('[data-size]');
const errorElement = document.querySelector('[data-error]');
const messageElement = document.querySelector('[data-message]');
const imageElement = document.querySelector('[data-image]');

loadingDiv.style.visibility = 'hidden';

function showSpinner() {
  loadingDiv.style.visibility = 'visible';
}

function hideSpinner() {
  loadingDiv.style.visibility = 'hidden';
}

async function makeImage(e) {
  e.preventDefault();
  showSpinner();
  const prompt = inputElement.value;
  const size = sizeElement.value;
  const data = { prompt, size };
  const headers = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  };
  try {
    const response = await fetch('/make_image', headers);
    const responseJson = await response.json();
    const { url, error } = responseJson;
    if (error) {
      // display error on page for user if they typed something inappropriate
      errorElement.textContent = error;
      imageElement.src = '';
      messageElement.textContent = prompt;
    } else {
      errorElement.textContent = '';
      imageElement.src = url;
      messageElement.textContent = prompt;
    }
  } catch (err) {
    console.error('error', err);
    errorElement.textContent = err;
    imageElement.src = '';
    messageElement.textContent = prompt;
  }

  inputElement.value = '';
  hideSpinner();
}

document.querySelector('[data-button]').addEventListener('click', makeImage);

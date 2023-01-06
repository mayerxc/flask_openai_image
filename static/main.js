const loadingDiv = document.querySelector('.loading');
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
  const prompt = document.querySelector('input').value;
  const size = '512x512';
  const data = { prompt, size, n: 1 };
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
      document.querySelector('.error-msg').textContent = error;
      document.querySelector('#image').src = '';
      document.querySelector('#message').textContent = prompt;
    } else {
      document.querySelector('.error-msg').textContent = '';
      document.querySelector('#image').src = url;
      document.querySelector('#message').textContent = prompt;
    }
  } catch (err) {
    console.error('error', err);
    document.querySelector('.error-msg').textContent = err;
    document.querySelector('#image').src = '';
    document.querySelector('#message').textContent = prompt;
  }

  document.querySelector('input').value = '';
  hideSpinner();
}

document.querySelector('button').addEventListener('click', makeImage);

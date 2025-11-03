// Google OAuth for Task List - Per-User Authentication

const GOOGLE_AUTH_CONFIG = {
  clientId: 'YOUR_GOOGLE_CLIENT_ID_HERE.apps.googleusercontent.com',
  apiKey: 'YOUR_API_KEY_HERE',
  discoveryDocs: ['https://sheets.googleapis.com/$discovery/rest?version=v4'],
  scopes: 'https://www.googleapis.com/auth/spreadsheets'
};

let gapiInited = false;
let gisInited = false;
let tokenClient;
let accessToken = null;

// Load Google API
function gapiLoaded() {
  gapi.load('client', initializeGapiClient);
}

async function initializeGapiClient() {
  await gapi.client.init({
    apiKey: GOOGLE_AUTH_CONFIG.apiKey,
    discoveryDocs: GOOGLE_AUTH_CONFIG.discoveryDocs,
  });
  gapiInited = true;
  maybeEnableButtons();
}

// Load Google Identity Services
function gisLoaded() {
  tokenClient = google.accounts.oauth2.initTokenClient({
    client_id: GOOGLE_AUTH_CONFIG.clientId,
    scope: GOOGLE_AUTH_CONFIG.scopes,
    callback: '', // defined later
  });
  gisInited = true;
  maybeEnableButtons();
}

function maybeEnableButtons() {
  if (gapiInited && gisInited) {
    document.getElementById('authorize-btn')?.removeAttribute('disabled');
  }
}

// Handle authorization
function handleAuthClick() {
  tokenClient.callback = async (resp) => {
    if (resp.error !== undefined) {
      throw (resp);
    }
    accessToken = gapi.client.getToken();
    document.getElementById('signout-btn')?.removeAttribute('disabled');
    document.getElementById('authorize-btn')?.setAttribute('disabled', 'disabled');
    // Enable save/load buttons
    document.getElementById('save-tasks-btn')?.removeAttribute('disabled');
    document.getElementById('load-tasks-btn')?.removeAttribute('disabled');
  };

  if (gapi.client.getToken() === null) {
    // Prompt the user to select a Google Account and ask for consent to share their data
    tokenClient.requestAccessToken({prompt: 'consent'});
  } else {
    // Skip display of account chooser and consent dialog for an existing session.
    tokenClient.requestAccessToken({prompt: ''});
  }
}

// Handle sign out
function handleSignoutClick() {
  const token = gapi.client.getToken();
  if (token !== null) {
    google.accounts.oauth2.revoke(token.access_token);
    gapi.client.setToken('');
    accessToken = null;
    document.getElementById('authorize-btn')?.removeAttribute('disabled');
    document.getElementById('signout-btn')?.setAttribute('disabled', 'disabled');
    // Disable save/load buttons
    document.getElementById('save-tasks-btn')?.setAttribute('disabled', 'disabled');
    document.getElementById('load-tasks-btn')?.setAttribute('disabled', 'disabled');
  }
}

// Save to user's Google Sheets
async function saveToUserGoogleSheets(data) {
  if (!accessToken) {
    throw new Error('Not authenticated');
  }

  try {
    // Get or create the spreadsheet
    const spreadsheetId = await getOrCreateSpreadsheet();
    
    // Update the sheet
    const response = await gapi.client.sheets.spreadsheets.values.update({
      spreadsheetId: spreadsheetId,
      range: 'Tasks!A1',
      valueInputOption: 'RAW',
      resource: {
        values: [[JSON.stringify(data)]]
      }
    });
    
    return response;
  } catch (error) {
    console.error('Error saving to Google Sheets:', error);
    throw error;
  }
}

// Load from user's Google Sheets
async function loadFromUserGoogleSheets() {
  if (!accessToken) {
    throw new Error('Not authenticated');
  }

  try {
    const spreadsheetId = await getOrCreateSpreadsheet();
    
    const response = await gapi.client.sheets.spreadsheets.values.get({
      spreadsheetId: spreadsheetId,
      range: 'Tasks!A1',
    });

    const data = response.result.values?.[0]?.[0];
    if (!data) {
      return { sections: [] };
    }
    
    return JSON.parse(data);
  } catch (error) {
    console.error('Error loading from Google Sheets:', error);
    throw error;
  }
}

// Get or create the Task List spreadsheet
async function getOrCreateSpreadsheet() {
  const SPREADSHEET_NAME = 'My Task List';
  
  // Check if spreadsheet already exists (stored in localStorage)
  let spreadsheetId = localStorage.getItem('taskListSpreadsheetId');
  
  if (spreadsheetId) {
    try {
      // Verify it still exists
      await gapi.client.sheets.spreadsheets.get({
        spreadsheetId: spreadsheetId
      });
      return spreadsheetId;
    } catch (error) {
      // Spreadsheet doesn't exist, create a new one
      localStorage.removeItem('taskListSpreadsheetId');
    }
  }
  
  // Create new spreadsheet
  const response = await gapi.client.sheets.spreadsheets.create({
    properties: {
      title: SPREADSHEET_NAME
    },
    sheets: [{
      properties: {
        title: 'Tasks'
      }
    }]
  });
  
  spreadsheetId = response.result.spreadsheetId;
  localStorage.setItem('taskListSpreadsheetId', spreadsheetId);
  
  return spreadsheetId;
}

// Check if user is authenticated
function isAuthenticated() {
  return accessToken !== null && gapi.client.getToken() !== null;
}

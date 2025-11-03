# Google OAuth Setup - Per-User Authentication

This guide explains how to set up Google Sign-In so each user can save tasks to their own Google Sheet.

## When to Use This Approach

✅ Multiple users, each with their own private task list  
✅ Users need to authenticate with their Google account  
✅ Each user gets their own Google Sheet automatically created  

## Step 1: Create Google Cloud Project & Get Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Click "Enable APIs and Services"
4. Search for and enable **Google Sheets API**

### Get API Key:
1. Go to **Credentials** (left sidebar)
2. Click **Create Credentials → API Key**
3. Copy the API key
4. Click **Edit API Key** → **API restrictions** → Select **Google Sheets API**
5. Save

### Get OAuth Client ID:
1. Still in **Credentials**, click **Create Credentials → OAuth client ID**
2. If prompted, configure the OAuth consent screen:
   - User Type: **External**
   - App name: "Task List"
   - User support email: your email
   - Developer contact: your email
   - Scopes: Add **../auth/spreadsheets**
   - Test users: Add your email (and any other users)
   - Save and continue
3. Create OAuth client ID:
   - Application type: **Web application**
   - Name: "Task List Web Client"
   - Authorized JavaScript origins:
     - `http://localhost:5501` (for testing)
     - `https://archiebattley.github.io` (for production)
   - Click **Create**
4. Copy the **Client ID** (looks like: `xxxxx.apps.googleusercontent.com`)

## Step 2: Update Configuration

Edit `js/google-auth.js` and update:

```javascript
const GOOGLE_AUTH_CONFIG = {
  clientId: 'YOUR_CLIENT_ID_HERE.apps.googleusercontent.com',
  apiKey: 'YOUR_API_KEY_HERE',
  discoveryDocs: ['https://sheets.googleapis.com/$discovery/rest?version=v4'],
  scopes: 'https://www.googleapis.com/auth/spreadsheets'
};
```

## Step 3: Update tasks.html

Add these scripts to the `<head>` section:

```html
<!-- Google API -->
<script src="https://apis.google.com/js/api.js" onload="gapiLoaded()"></script>
<script src="https://accounts.google.com/gsi/client" onload="gisLoaded()"></script>
<script src="/js/google-auth.js"></script>
```

Add Sign In / Sign Out buttons to your header (before the Save/Load buttons):

```html
<button id="authorize-btn" class="save-load-btn" disabled>Sign In with Google</button>
<button id="signout-btn" class="save-load-btn" disabled style="display:none;">Sign Out</button>
```

## Step 4: Update tasks.js

Replace the save/load functions to use the OAuth version:

```javascript
// In the Save button onclick:
document.getElementById('save-tasks-btn').onclick = async () => {
  if (!isAuthenticated()) {
    alert('Please sign in with Google first');
    return;
  }
  
  const data = domToJson();
  
  try {
    const savingMsg = showMessage('Saving to Google Sheets...');
    await saveToUserGoogleSheets(data);
    savingMsg.textContent = 'Tasks saved to your Google Sheet!';
    savingMsg.style.background = 'var(--green)';
    setTimeout(() => savingMsg.remove(), 1800);
  } catch (error) {
    alert('Failed to save: ' + error.message);
  }
};

// In the Load button onclick:
document.getElementById('load-tasks-btn').onclick = async () => {
  if (!isAuthenticated()) {
    alert('Please sign in with Google first');
    return;
  }
  
  try {
    const loadingMsg = showMessage('Loading from Google Sheets...');
    const data = await loadFromUserGoogleSheets();
    renderTasks(data);
    loadingMsg.textContent = 'Tasks loaded!';
    loadingMsg.style.background = 'var(--green)';
    setTimeout(() => loadingMsg.remove(), 1800);
  } catch (error) {
    alert('Failed to load: ' + error.message);
  }
};

// Setup authorize buttons
document.getElementById('authorize-btn').onclick = handleAuthClick;
document.getElementById('signout-btn').onclick = handleSignoutClick;

// Initially disable save/load until signed in
document.getElementById('save-tasks-btn').setAttribute('disabled', 'disabled');
document.getElementById('load-tasks-btn').setAttribute('disabled', 'disabled');
```

## How It Works

1. User clicks "Sign In with Google"
2. Google OAuth popup asks for permission to access Google Sheets
3. User grants permission
4. App creates a new Google Sheet called "My Task List" in user's Google Drive
5. Save/Load buttons become enabled
6. Each user's tasks are stored in their own Google Sheet

## Benefits vs Shared Sheet

✅ Each user has complete privacy  
✅ No Apps Script deployment needed  
✅ Users can open their sheet directly in Google Sheets  
✅ Works offline with localStorage fallback  

## Simpler Alternative

If you don't need per-user authentication, change your Apps Script deployment to:
- **Execute as**: Me
- **Who has access**: Anyone

Then use the JSONP approach already configured in `tasks.js`. This is much simpler but all users share one sheet.

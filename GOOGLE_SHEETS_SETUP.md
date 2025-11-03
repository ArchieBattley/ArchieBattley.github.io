# Google Sheets Integration Setup Guide

This guide will help you integrate your Task List with Google Sheets so tasks are automatically saved and loaded from the cloud.

## Step 1: Create a Google Sheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new blank spreadsheet
3. Name it something like "Task List Database"
4. Copy the Sheet ID from the URL:
   ```
   https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID_HERE/edit
   ```

## Step 2: Create a Google Apps Script

1. In your Google Sheet, go to **Extensions → Apps Script**
2. Delete any existing code and paste the following:

```javascript
// Google Apps Script to handle Task List data with JSONP support

function doGet(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Tasks');
  const callback = e.parameter.callback;
  
  let output;
  
  if (!sheet) {
    output = {
      data: { sections: [] }
    };
  } else {
    const data = sheet.getRange('A1').getValue();
    
    if (!data) {
      output = {
        data: { sections: [] }
      };
    } else {
      output = {
        data: JSON.parse(data)
      };
    }
  }
  
  // Support JSONP for CORS
  if (callback) {
    return ContentService.createTextOutput(callback + '(' + JSON.stringify(output) + ')')
      .setMimeType(ContentService.MimeType.JAVASCRIPT);
  }
  
  return ContentService.createTextOutput(JSON.stringify(output))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  try {
    const requestData = JSON.parse(e.postData.contents);
    let sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Tasks');
    
    if (!sheet) {
      // Create the Tasks sheet if it doesn't exist
      sheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet('Tasks');
    }
    
    sheet.getRange('A1').setValue(JSON.stringify(requestData.data));
    
    // Also save a backup with timestamp in column B
    const timestamp = new Date().toISOString();
    sheet.getRange('B1').setValue(timestamp);
    
    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      timestamp: timestamp
    })).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}
```

3. Click **Save** (💾 icon)
4. Name the project something like "Task List API"

## IMPORTANT: You Must Redeploy!

After updating the code, you need to create a **NEW deployment**:

1. Click **Deploy → Manage deployments**
2. Click the **pencil icon** (✏️) next to your existing deployment
3. Under "Version", click **New version**
4. Add a description like "Added JSONP support for CORS"
5. Click **Deploy**
6. The Web App URL will be the same, but it will now use the new code

OR create a completely new deployment:

1. Click **Deploy → New deployment**
2. Follow the same steps as before
3. Use the new Web App URL

## Step 3: Deploy as Web App

1. Click **Deploy → New deployment**
2. Click the gear icon ⚙️ next to "Select type"
3. Choose **Web app**
4. Configure:
   - **Description**: "Task List API v1"
   - **Execute as**: Me
   - **Who has access**: Anyone (or "Anyone with the link" if you prefer)
5. Click **Deploy**
6. Click **Authorize access**
7. Choose your Google account
8. Click **Advanced** → **Go to [Your Project Name] (unsafe)**
9. Click **Allow**
10. **Copy the Web App URL** - it should look like:
    ```
    https://script.google.com/macros/s/XXXXX/exec
    ```

## Step 4: Configure Your Task List

1. Open `js/tasks.js` in your code editor
2. Find the `GOOGLE_SHEETS_CONFIG` section at the top:

```javascript
const GOOGLE_SHEETS_CONFIG = {
  sheetId: 'YOUR_GOOGLE_SHEET_ID_HERE',
  webAppUrl: 'YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE'
};
```

3. Replace:
   - `YOUR_GOOGLE_SHEET_ID_HERE` with your Sheet ID from Step 1
   - `YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE` with your Web App URL from Step 3

4. Save the file

## Step 5: Test It!

1. Open your `tasks.html` in a browser
2. Create some tasks
3. Click **Save Tasks** - it should save to Google Sheets
4. Refresh the page
5. Click **Load Tasks** - it should load from Google Sheets

## Troubleshooting

### "Failed to save to Google Sheets"
- Check that you copied the Web App URL correctly
- Make sure you deployed as "Anyone" can access
- Check the Google Apps Script logs: Script Editor → Executions

### "Failed to load from Google Sheets"
- Make sure you've saved at least once first
- Check that the "Tasks" sheet exists in your spreadsheet
- Verify the Web App URL is correct

### CORS Errors
- The script uses `mode: 'no-cors'` for saving which is normal
- Loading uses the public Web App URL which should work without CORS issues

## Advanced: Auto-Load on Page Load

To automatically load tasks when the page opens, uncomment this line at the bottom of `tasks.js`:

```javascript
// Auto-load on first visit
const data = await loadFromGoogleSheets();
if (data) renderTasks(data);
```

## Privacy & Security

- Your tasks are stored in YOUR Google Sheet
- Only people with the Web App URL can access the data
- You can change "Who has access" to restrict access
- Consider using OAuth for better security if needed

## Backup

The system automatically falls back to local JSON download if Google Sheets fails, so you'll never lose your data!

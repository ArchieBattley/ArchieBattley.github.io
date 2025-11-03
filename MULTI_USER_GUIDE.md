# Multi-User Task Lists - Quick Guide

## What Changed

Your task list app now supports multiple named task lists in the same Google Sheet! Perfect for sharing with multiple people.

## How It Works

### For Users:

1. **Save Tasks**: 
   - Click "Save Tasks"
   - Enter a name for your list (e.g., "John's Tasks", "Marketing Team", "Personal")
   - Your tasks are saved to Google Sheets with that name

2. **Load Tasks**:
   - Click "Load Tasks"
   - See a list of all saved task lists
   - Click on any list to load it

3. **Multiple People**:
   - Share the URL with anyone
   - Each person can create their own named list
   - Everyone can see and load each other's lists (or keep them private with unique names)

### Google Sheet Structure:

The "Tasks" sheet now has columns:
- **Column A**: List Name (e.g., "John's Tasks")
- **Column B**: Task Data (JSON)
- **Column C**: Last Modified (timestamp)

Each row is a different task list!

## Setup Required

**IMPORTANT**: You need to update your Google Apps Script!

1. Go to your Google Apps Script (Extensions → Apps Script)
2. Replace ALL the code with the new code from `GOOGLE_SHEETS_SETUP.md`
3. Click Save
4. Deploy → Manage deployments → Edit (pencil icon) → New version
5. Deploy

The new script supports:
- Saving multiple named lists
- Loading a specific list by name
- Getting a list of all saved lists

## Features

✅ Multiple named task lists in one Google Sheet  
✅ Beautiful modal dialogs for save/load  
✅ Shows last modified date for each list  
✅ Remembers your last loaded list  
✅ Updates page title with current list name  
✅ No authentication required - anyone can use it  

## Example Use Cases

1. **Personal Use**: "Work Tasks", "Home Projects", "Shopping"
2. **Team Use**: "Team A", "Team B", "Shared Tasks"
3. **Multi-Person**: "Alice", "Bob", "Charlie" - everyone has their own
4. **Project-Based**: "Project X", "Project Y", "Backlog"

## Privacy Note

Since there's no authentication, anyone with the URL can:
- See all saved list names
- Load any list
- Save/overwrite any list

If you need privacy:
- Use unique/obscure list names
- Or follow the OAuth guide in `GOOGLE_OAUTH_SETUP.md` for per-user authentication

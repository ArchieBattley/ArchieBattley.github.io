// Wired2Fire Task List – Prioritised (JavaScript extracted)

// Google Sheets Configuration
const GOOGLE_SHEETS_CONFIG = {
  // Replace with your actual Google Sheet ID from the URL
  // URL format: https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID/edit
  sheetId: '1AdNWF6lnSWquXMop9MYDDI4h-4NXT5HzISFg8MVHeT0',
  // Replace with your Google Apps Script Web App URL
  webAppUrl: 'https://script.google.com/macros/s/AKfycby9s4_CtlxXWkI_aiyhQhgvthlq2K8FHh2LnP1IVuVz-szYhtY86QocE3y4ma1gSEtwZw/exec'
};

// Save tasks to Google Sheets with a name
async function saveToGoogleSheets(data, listName) {
  try {
    const response = await fetch(GOOGLE_SHEETS_CONFIG.webAppUrl, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: listName,
        data: data
      })
    });
    return true;
  } catch (error) {
    console.error('Error saving to Google Sheets:', error);
    throw error;
  }
}

// Load a specific task list from Google Sheets
async function loadFromGoogleSheets(listName) {
  return new Promise((resolve, reject) => {
    const callbackName = 'googleSheetsCallback_' + Date.now();
    const script = document.createElement('script');
    const timeout = setTimeout(() => {
      cleanup();
      reject(new Error('Request timeout'));
    }, 10000);
    
    function cleanup() {
      clearTimeout(timeout);
      delete window[callbackName];
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    }
    
    window[callbackName] = function(response) {
      cleanup();
      resolve(response.data);
    };
    
    script.onerror = function() {
      cleanup();
      reject(new Error('Script load error'));
    };
    
    script.src = `${GOOGLE_SHEETS_CONFIG.webAppUrl}?action=load&name=${encodeURIComponent(listName)}&callback=${callbackName}`;
    document.head.appendChild(script);
  });
}

// Get list of all saved task lists
async function getTaskLists() {
  return new Promise((resolve, reject) => {
    const callbackName = 'googleSheetsCallback_' + Date.now();
    const script = document.createElement('script');
    const timeout = setTimeout(() => {
      cleanup();
      reject(new Error('Request timeout'));
    }, 10000);
    
    function cleanup() {
      clearTimeout(timeout);
      delete window[callbackName];
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    }
    
    window[callbackName] = function(response) {
      cleanup();
      resolve(response.lists || []);
    };
    
    script.onerror = function() {
      cleanup();
      reject(new Error('Script load error'));
    };
    
    script.src = `${GOOGLE_SHEETS_CONFIG.webAppUrl}?action=list&callback=${callbackName}`;
    document.head.appendChild(script);
  });
}

// Show a custom confirm modal overlay (global scope)
function showConfirmModal({ message, onConfirm }) {
  if (document.getElementById('custom-confirm-modal')) return;
  const overlay = document.createElement('div');
  overlay.id = 'custom-confirm-modal';
  overlay.innerHTML = `
    <div class="modal-content text-center custom-modal-box">
      <button type="button" id="close-confirm-modal" aria-label="Close" class="btn btn-link custom-modal-close"><i class='fa-solid fa-xmark'></i></button>
      <h2 class="fw-semibold text-center text-light custom-modal-h2">${message}</h2>
      <div class="custom-modal-btnrow">
        <button type="button" class="btn btn-secondary custom-modal-btn" id="cancel-confirm-modal">Cancel</button>
        <button type="button" class="btn btn-danger custom-modal-btn" id="ok-confirm-modal">Delete</button>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);
  overlay.querySelector('#close-confirm-modal').onclick = () => overlay.remove();
  overlay.querySelector('#cancel-confirm-modal').onclick = () => overlay.remove();
  overlay.querySelector('#ok-confirm-modal').onclick = () => {
    overlay.remove();
    if (typeof onConfirm === 'function') onConfirm();
  };
}

// Utility: fetch JSON file
async function fetchTasksJson() {
  try {
    const res = await fetch('tasks.json');
    if (!res.ok) throw new Error('Failed to load tasks.json');
    return await res.json();
  } catch (e) {
    alert('Could not load tasks.json: ' + e.message);
    return null;
  }
}

// Utility: download JSON file
function downloadJson(obj, filename) {
  const blob = new Blob([JSON.stringify(obj, null, 2)], {type: 'application/json'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 100);
}

// Render tasks from JSON data
function renderTasks(data) {
  const container = document.getElementById('task-sections');
  container.innerHTML = '';
  if (!data || !data.sections) return;
  const titleMap = {
    'Top Priority': 'Top',
    'High Priority': 'High',
    'Next Priority': 'Medium',
    "Nick's Tasks (Ad Campaigns)": 'Low',
    'Additional / Support Tasks': 'Low',
    'Ongoing (Personal Tasks)': 'Ongoing',
    'Ongoing': 'Ongoing',
    'Low': 'Low',
    'Medium': 'Medium',
    'High': 'High',
    'Top': 'Top'
  };
  data.sections.forEach((section, idx) => {
    const sectionEl = createSectionElement({
      color: section.color,
      title: titleMap[section.title] || section.title,
      badge: section.badge || '',
      tasks: section.tasks || []
    });
    container.appendChild(sectionEl);
  });
  initSectionDragAndDrop();
}

// Helper to create a section element with all event listeners
function createSectionElement(section) {
  const sectionEl = document.createElement('section');
  sectionEl.className = 'section';
  sectionEl.draggable = true;
  sectionEl.style.cursor = 'grab';
  sectionEl.innerHTML = `
    <div class="head d-flex align-items-center justify-content-between gap-3">
      <div class="title d-flex align-items-center gap-2 fw-bold fs-5">
        <span class="dot" style="background:var(--${section.color})"></span>
        <span>${section.title}</span>
      </div>
      <div class="d-flex align-items-center gap-2">
  <span class="badge d-inline-flex align-items-center gap-2" contenteditable="true" spellcheck="false" style="outline:none;min-width:40px;">${section.badge}</span>
        <button class="delete-section btn btn-link text-danger fs-3 p-0 ms-2" title="Delete Section"><i class="fa-solid fa-xmark"></i></button>
      </div>
    </div>
    <div class="content"></div>
  `;
  sectionEl.querySelector('.delete-section').onclick = function() {
    showConfirmModal({
      message: 'Delete this section and all its tasks?',
      onConfirm: () => sectionEl.remove()
    });
  };
  const content = sectionEl.querySelector('.content');
  (section.tasks || []).forEach(task => {
    const taskEl = createTaskElement(task);
    content.appendChild(taskEl);
  });
  // Add task button
  const addTaskBtn = document.createElement('button');
  addTaskBtn.className = 'add-task';
  addTaskBtn.textContent = '+ Add Task';
  addTaskBtn.onclick = () => {
    const taskEl = createTaskElement({ title: '', items: [{ text: '', checked: false }] });
    content.appendChild(taskEl);
    taskEl.querySelector('.checklist [contenteditable]').focus();
  };
  content.appendChild(addTaskBtn);
  return sectionEl;
}

// Helper to create a task element with all event listeners
function createTaskElement(task) {
  const taskEl = document.createElement('div');
  taskEl.className = 'task';
  taskEl.innerHTML = `
    <div class="card mb-3 bg-panel border-0 shadow-sm">
      <div class="card-body pb-4">
        <div class="d-flex align-items-center gap-2 mb-2 w-100 overflow-hidden">
          <h2 contenteditable="true" placeholder="New Task Title"
            class="task-title-content fs-5 lh-sm fw-bold flex-grow-1 text-truncate mb-0"
            style="outline:none;min-width:0;word-break:break-word;">
            ${task.title || ''}
          </h2>
          <button class="delete-task btn btn-link text-danger ms-2 p-0 flex-shrink-0" type="button" title="Delete Task" style="font-size:1.5em;line-height:1;"><i class="fa-solid fa-xmark"></i></button>
        </div>
        <ul class="checklist"></ul>
      </div>
    </div>
  `;
  const checklist = taskEl.querySelector('.checklist');
  (task.items || []).forEach(item => {
    const li = document.createElement('li');
    li.draggable = true;
    li.className = 'd-flex align-items-center gap-2 position-relative';
    li.innerHTML = `
      <input type="checkbox" class="form-check-input mt-0" ${item.checked ? 'checked' : ''}>
      <div contenteditable="true" class="flex-grow-1">${item.text || ''}</div>
      <button class="delete-item btn btn-link text-danger p-0 ms-2 flex-shrink-0" style="font-size:1.2em;"><i class="fa-solid fa-xmark"></i></button>
    `;
    li.querySelector('.delete-item').onclick = function() { li.remove(); };
    checklist.appendChild(li);
  });
  // Add item button
  const addItemBtn = document.createElement('button');
  addItemBtn.className = 'add-item btn btn-outline-secondary w-100 mt-2';
  addItemBtn.textContent = '+ Add Item';
  addItemBtn.onclick = () => {
    const li = document.createElement('li');
    li.draggable = true;
    li.className = 'd-flex align-items-center gap-2 position-relative';
    li.innerHTML = `
      <input type="checkbox" class="form-check-input mt-0">
      <div contenteditable="true" class="flex-grow-1" placeholder="New item"></div>
      <button class="delete-item btn btn-link text-danger p-0 ms-2 flex-shrink-0" style="font-size:1.2em;"><i class='fa-solid fa-xmark'></i></button>
    `;
    li.querySelector('.delete-item').onclick = function() { li.remove(); };
    checklist.appendChild(li);
    li.querySelector('[contenteditable]').focus();
  };
  taskEl.appendChild(addItemBtn);
  // Add delete event for task (button to right of title)
  const deleteTaskBtn = taskEl.querySelector('.delete-task');
  if (deleteTaskBtn) {
    deleteTaskBtn.onclick = function() {
      showConfirmModal({
        message: 'Delete this task?',
        onConfirm: () => taskEl.remove()
      });
    };
  }
  // Add delete event for all initial checklist items
  taskEl.querySelectorAll('.delete-item').forEach(btn => {
    btn.onclick = function() { btn.parentElement.remove(); };
  });
  return taskEl;
}

// Drag and drop for sections with recategorisation (works for both loaded and new sections)
function initSectionDragAndDrop() {
  const container = document.getElementById('task-sections');
  const priorities = [
    { title: 'Top', color: 'red' },
    { title: 'High', color: 'orange' },
    { title: 'Medium', color: 'yellow' },
    { title: 'Low', color: 'green' },
    { title: 'Ongoing', color: 'blue' }
  ];
  let draggingSection = null;
  Array.from(container.querySelectorAll('.section')).forEach(sectionEl => {
    sectionEl.draggable = true;
    sectionEl.addEventListener('dragstart', (e) => {
      draggingSection = sectionEl;
      sectionEl.classList.add('dragging');
    });
    sectionEl.addEventListener('dragend', (e) => {
      sectionEl.classList.remove('dragging');
      draggingSection = null;
      // After drop, recategorise all sections by new order
      const allSections = Array.from(container.children).filter(n => n.classList.contains('section'));
      allSections.forEach((sec, idx) => {
        const p = priorities[idx] || priorities[priorities.length-1];
        // Update title and color
        const titleSpan = sec.querySelector('.title span:last-child');
        const dotSpans = sec.querySelectorAll('.dot');
        titleSpan.textContent = p.title;
        dotSpans.forEach(dot => { dot.style.background = `var(--${p.color})`; });
      });
    });
    sectionEl.addEventListener('dragover', (e) => {
      e.preventDefault();
    });
    sectionEl.addEventListener('drop', (e) => {
      e.preventDefault();
      if (draggingSection && draggingSection !== sectionEl) {
        container.insertBefore(draggingSection, sectionEl);
      }
    });
  });
}

// Convert DOM to JSON
function domToJson() {
  const sections = [];
  document.querySelectorAll('#task-sections > .section').forEach(sectionEl => {
    const color = sectionEl.querySelector('.dot').style.background.match(/var\(--([\w]+)\)/)?.[1] || 'red';
    const title = sectionEl.querySelector('.title span:last-child').textContent.trim();
    // Only get the badge text after the dot
    const badgeEl = sectionEl.querySelector('.badge');
    let badge = '';
    if (badgeEl) {
      // Remove the dot span's text from the badge
      const badgeNodes = Array.from(badgeEl.childNodes);
      badge = badgeNodes.filter(n => n.nodeType === 3).map(n => n.textContent).join('').trim();
      // If badge is empty, fallback to full text
      if (!badge) badge = badgeEl.textContent.trim();
    }
    const tasks = [];
    sectionEl.querySelectorAll('.content > .task').forEach(taskEl => {
      const taskTitle = taskEl.querySelector('h2').textContent.trim();
      const items = [];
      taskEl.querySelectorAll('.checklist li').forEach(li => {
        items.push({
          text: li.querySelector('[contenteditable]').textContent.trim(),
          checked: li.querySelector('input[type="checkbox"]').checked
        });
      });
      tasks.push({ title: taskTitle, items });
    });
    sections.push({ color, title, badge, tasks });
  });
  return { sections };
}

document.addEventListener('DOMContentLoaded', async () => {
  // Store current list name
  let currentListName = localStorage.getItem('currentTaskListName') || '';
  
  // Auto-save to localStorage
  let autoSaveTimeout;
  function autoSaveToLocalStorage() {
    clearTimeout(autoSaveTimeout);
    autoSaveTimeout = setTimeout(() => {
      const data = domToJson();
      localStorage.setItem('cachedTaskList', JSON.stringify(data));
      localStorage.setItem('cachedTaskListTime', new Date().toISOString());
      console.log('Auto-saved to cache');
    }, 1000); // Save 1 second after changes stop
  }
  
  // Set up mutation observer to detect changes
  function setupAutoSave() {
    const container = document.getElementById('task-sections');
    if (!container) return;
    
    const observer = new MutationObserver(() => {
      autoSaveToLocalStorage();
    });
    
    observer.observe(container, {
      childList: true,
      subtree: true,
      characterData: true,
      attributes: true
    });
    
    // Also save on input events for contenteditable elements
    container.addEventListener('input', autoSaveToLocalStorage);
    container.addEventListener('change', autoSaveToLocalStorage);
  }
  
  // Restore cached list on load
  function restoreCachedList() {
    const cachedData = localStorage.getItem('cachedTaskList');
    const cachedTime = localStorage.getItem('cachedTaskListTime');
    
    if (cachedData) {
      try {
        const data = JSON.parse(cachedData);
        renderTasks(data);
        setupAutoSave();
        
        if (currentListName) {
          updatePageTitle(currentListName);
        }
        
        // Show a subtle notification
        if (cachedTime) {
          const timeAgo = new Date(cachedTime);
          const msg = showMessage(`Restored from ${timeAgo.toLocaleString()}`, 'var(--panel)');
          setTimeout(() => msg.remove(), 2000);
        }
      } catch (e) {
        console.error('Failed to restore cached list:', e);
      }
    }
  }

  // Load tasks from Google Sheets - show list selector
  document.getElementById('load-tasks-btn').onclick = async () => {
    try {
      // Fetch list of all task lists
      const lists = await getTaskLists();
      
      // Show modal with list selection
      showLoadListModal(lists, async (selectedName) => {
        try {
          const loadingMsg = showMessage('Loading from Google Sheets...');
          const data = await loadFromGoogleSheets(selectedName);
          renderTasks(data);
          currentListName = selectedName;
          localStorage.setItem('currentTaskListName', selectedName);
          updatePageTitle(selectedName);
          setupAutoSave(); // Enable auto-save after loading
          
          loadingMsg.textContent = `Loaded "${selectedName}"!`;
          loadingMsg.style.background = 'var(--green)';
          setTimeout(() => loadingMsg.remove(), 1800);
        } catch (error) {
          alert('Failed to load: ' + error.message);
        }
      });
    } catch (error) {
      alert('Failed to fetch task lists: ' + error.message);
    }
  };

  // Load tasks from local JSON file
  document.getElementById('load-file-btn').onclick = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json,application/json';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (evt) => {
        try {
          const data = JSON.parse(evt.target.result);
          console.log('Loaded JSON:', data);
          try {
            renderTasks(data);
            setupAutoSave(); // Enable auto-save after loading from file
            const msg = showMessage('Tasks loaded from file!', 'var(--green)');
            setTimeout(() => msg.remove(), 1800);
          } catch (renderErr) {
            console.error('Error in renderTasks:', renderErr);
            alert('Error rendering tasks: ' + renderErr.message);
            return;
          }
        } catch (err) {
          console.error('Invalid JSON:', err);
          alert('Invalid JSON file.');
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  // Save tasks to Google Sheets - prompt for name
  document.getElementById('save-tasks-btn').onclick = async () => {
    const data = domToJson();
    
    // Show modal to get/confirm list name
    showSaveListModal(currentListName, async (listName) => {
      try {
        const savingMsg = showMessage('Saving to Google Sheets...');
        await saveToGoogleSheets(data, listName);
        currentListName = listName;
        localStorage.setItem('currentTaskListName', listName);
        updatePageTitle(listName);
        
        savingMsg.textContent = `Saved as "${listName}"!`;
        savingMsg.style.background = 'var(--green)';
        setTimeout(() => savingMsg.remove(), 1800);
      } catch (error) {
        alert('Failed to save to Google Sheets. Downloading local backup instead...');
        downloadJson(data, 'tasks.json');
        const msg = showMessage('Tasks exported as tasks.json');
        setTimeout(() => msg.remove(), 1800);
      }
    });
  };
  
  // Restore cached list on page load
  restoreCachedList();
  
  // Add section button handler (always works, appends to #task-sections)
  document.getElementById('add-section-btn').onclick = () => {
    // Show custom modal overlay for Add Section
    if (document.getElementById('add-section-modal')) return; // Prevent multiple modals
    const overlay = document.createElement('div');
    overlay.id = 'add-section-modal';
    overlay.style.position = 'fixed';
    overlay.style.top = 0;
    overlay.style.left = 0;
    overlay.style.width = '100vw';
    overlay.style.height = '100vh';
    overlay.style.background = 'rgba(0,0,0,0.45)';
    overlay.style.display = 'flex';
    overlay.style.alignItems = 'center';
    overlay.style.justifyContent = 'center';
    overlay.style.zIndex = 10000;
    overlay.innerHTML = `
      <div style="background:var(--panel);border-radius:22px;box-shadow:0 12px 48px #000b,0 1.5px 8px #0002;padding:38px 32px 28px;min-width:340px;max-width:95vw;position:relative;">
  <button type="button" id="close-add-section-modal" aria-label="Close" style="position:absolute;top:18px;right:18px;background:none;border:none;font-size:2rem;line-height:1;color:var(--muted);cursor:pointer;transition:color 0.2s;"><i class='fa-solid fa-xmark'></i></button>
        <h2 style="font-size:1.5em;font-weight:800;margin-bottom:22px;color:var(--text);letter-spacing:-1px;">Add Section</h2>
        <form id="add-section-form" autocomplete="off">
          <div class="mb-3">
            <label for="section-priority" class="form-label" style="font-weight:600;">Priority</label>
            <select id="section-priority" class="form-select" style="font-size:1.1em;padding:10px 12px;border-radius:8px;" required>
              <option value="Top" data-color="red" data-badge="Immediate">Top</option>
              <option value="High" data-color="orange" data-badge="Time-sensitive">High</option>
              <option value="Medium" data-color="yellow" data-badge="Important">Medium</option>
              <option value="Low" data-color="green" data-badge="Backlog">Low</option>
              <option value="Ongoing" data-color="blue" data-badge="Continuous">Ongoing</option>
            </select>
          </div>
          <div class="mb-3">
            <label for="section-badge" class="form-label" style="font-weight:600;">Classification/Badge</label>
            <input id="section-badge" class="form-control" type="text" style="font-size:1.1em;padding:10px 12px;border-radius:8px;" placeholder="e.g. Immediate, Time-sensitive" />
          </div>
          <div style="display:flex;gap:14px;justify-content:flex-end;margin-top:18px;">
            <button type="button" class="btn btn-secondary" id="cancel-add-section" style="padding:8px 20px;border-radius:8px;font-weight:600;">Cancel</button>
            <button type="submit" class="btn btn-primary" style="background:var(--accent);border:none;padding:8px 22px;border-radius:8px;font-weight:700;">Add Section</button>
          </div>
        </form>
      </div>
    `;
    document.body.appendChild(overlay);
    // Close modal on X button
    overlay.querySelector('#close-add-section-modal').onclick = () => overlay.remove();
    // Set default badge based on priority
    const prioSelect = overlay.querySelector('#section-priority');
    const badgeInput = overlay.querySelector('#section-badge');
    function updateBadge() {
      const opt = prioSelect.selectedOptions[0];
      badgeInput.value = opt.getAttribute('data-badge');
    }
    prioSelect.addEventListener('change', updateBadge);
    updateBadge();
    // Cancel button
    overlay.querySelector('#cancel-add-section').onclick = () => {
      overlay.remove();
    };
    // Form submit
    overlay.querySelector('#add-section-form').onsubmit = (e) => {
      e.preventDefault();
      const prio = prioSelect.value;
      const color = prioSelect.selectedOptions[0].getAttribute('data-color');
      const badge = badgeInput.value.trim() || prioSelect.selectedOptions[0].getAttribute('data-badge');
      const sectionEl = createSectionElement({
        color,
        title: prio,
        badge,
        tasks: []
      });
      const container = document.getElementById('task-sections');
      // Find the last section with the same priority (title)
      let insertAfter = null;
      const sections = Array.from(container.querySelectorAll('.section'));
      for (let i = sections.length - 1; i >= 0; i--) {
        const s = sections[i];
        const sTitle = s.querySelector('.title span:last-child')?.textContent.trim();
        if (sTitle === prio) {
          insertAfter = s;
          break;
        }
      }
      if (insertAfter && insertAfter.nextSibling) {
        container.insertBefore(sectionEl, insertAfter.nextSibling);
      } else if (insertAfter) {
        container.appendChild(sectionEl);
      } else {
        // No section of this priority, insert at the end
        container.appendChild(sectionEl);
      }
      initSectionDragAndDrop();
      overlay.remove();
    };
  };
  // Auto-load on first visit (optional: comment out if you want manual load only)
  // const data = await fetchTasksJson();
  // if (data) renderTasks(data);
});

// Helper: Show a message toast
function showMessage(text, bgColor = 'var(--panel)') {
  const msg = document.createElement('div');
  msg.textContent = text;
  msg.style.position = 'fixed';
  msg.style.bottom = '32px';
  msg.style.right = '32px';
  msg.style.background = bgColor;
  msg.style.color = bgColor === 'var(--panel)' ? 'var(--text)' : '#fff';
  msg.style.padding = '14px 28px';
  msg.style.borderRadius = '12px';
  msg.style.boxShadow = '0 4px 16px #0007';
  msg.style.fontWeight = '700';
  msg.style.fontSize = '1.1em';
  msg.style.zIndex = 20000;
  document.body.appendChild(msg);
  return msg;
}

// Helper: Update page title with current list name
function updatePageTitle(listName) {
  const titleEl = document.querySelector('h1');
  if (titleEl && listName) {
    const baseText = titleEl.innerHTML.split('<span')[0];
    titleEl.innerHTML = `${baseText}<span style="font-size:0.7em;font-weight:400;opacity:0.7;"> – ${listName}</span>`;
  }
}

// Helper: Show save list modal
function showSaveListModal(defaultName, onSave) {
  if (document.getElementById('save-list-modal')) return;
  
  const overlay = document.createElement('div');
  overlay.id = 'save-list-modal';
  overlay.style.position = 'fixed';
  overlay.style.top = 0;
  overlay.style.left = 0;
  overlay.style.width = '100vw';
  overlay.style.height = '100vh';
  overlay.style.background = 'rgba(0,0,0,0.45)';
  overlay.style.display = 'flex';
  overlay.style.alignItems = 'center';
  overlay.style.justifyContent = 'center';
  overlay.style.zIndex = 10000;
  
  overlay.innerHTML = `
    <div class="custom-modal-box">
      <button type="button" id="close-save-modal" class="custom-modal-close"><i class="fa-solid fa-xmark"></i></button>
      <h2 class="custom-modal-h2">Save Task List</h2>
      <form id="save-list-form" autocomplete="off">
        <div class="mb-3">
          <label for="list-name-input" class="form-label" style="font-weight:600;color:var(--text);">List Name</label>
          <input id="list-name-input" class="form-control" type="text" value="${defaultName || ''}" placeholder="e.g., My Tasks, Work Items, Personal" required style="background:var(--panel-2);color:var(--text);border:1px solid var(--border);font-size:1.1em;padding:10px 12px;border-radius:8px;" />
          <small style="color:var(--muted);display:block;margin-top:6px;">This name will identify your task list in Google Sheets</small>
        </div>
        <div class="custom-modal-btnrow">
          <button type="button" class="btn btn-secondary custom-modal-btn" id="cancel-save">Cancel</button>
          <button type="submit" class="btn btn-primary custom-modal-btn" style="background:var(--green);border-color:var(--green);">Save</button>
        </div>
      </form>
    </div>
  `;
  
  document.body.appendChild(overlay);
  
  const input = overlay.querySelector('#list-name-input');
  input.focus();
  input.select();
  
  overlay.querySelector('#close-save-modal').onclick = () => overlay.remove();
  overlay.querySelector('#cancel-save').onclick = () => overlay.remove();
  
  overlay.querySelector('#save-list-form').onsubmit = (e) => {
    e.preventDefault();
    const listName = input.value.trim();
    if (listName) {
      overlay.remove();
      onSave(listName);
    }
  };
}

// Helper: Show load list modal
function showLoadListModal(lists, onLoad) {
  if (document.getElementById('load-list-modal')) return;
  
  const overlay = document.createElement('div');
  overlay.id = 'load-list-modal';
  overlay.style.position = 'fixed';
  overlay.style.top = 0;
  overlay.style.left = 0;
  overlay.style.width = '100vw';
  overlay.style.height = '100vh';
  overlay.style.background = 'rgba(0,0,0,0.45)';
  overlay.style.display = 'flex';
  overlay.style.alignItems = 'center';
  overlay.style.justifyContent = 'center';
  overlay.style.zIndex = 10000;
  
  let listsHTML = '';
  if (lists.length === 0) {
    listsHTML = '<p style="color:var(--muted);text-align:center;padding:20px;">No saved task lists found.<br>Create one by clicking Save Tasks!</p>';
  } else {
    listsHTML = '<div style="max-height:400px;overflow-y:auto;">';
    lists.forEach(list => {
      const date = list.timestamp ? new Date(list.timestamp).toLocaleString() : 'Unknown';
      listsHTML += `
        <button type="button" class="list-item-btn" data-name="${list.name}" style="width:100%;text-align:left;background:var(--panel-2);border:1px solid var(--border);padding:14px 18px;border-radius:8px;margin-bottom:10px;cursor:pointer;transition:all 0.2s;color:var(--text);">
          <div style="font-weight:700;font-size:1.1em;margin-bottom:4px;">${list.name}</div>
          <div style="font-size:0.85em;color:var(--muted);">Last modified: ${date}</div>
        </button>
      `;
    });
    listsHTML += '</div>';
  }
  
  overlay.innerHTML = `
    <div class="custom-modal-box" style="min-width:500px;max-width:600px;">
      <button type="button" id="close-load-modal" class="custom-modal-close"><i class="fa-solid fa-xmark"></i></button>
      <h2 class="custom-modal-h2">Load Task List</h2>
      ${listsHTML}
      <div class="custom-modal-btnrow" style="margin-top:20px;">
        <button type="button" class="btn btn-secondary custom-modal-btn" id="cancel-load">Cancel</button>
      </div>
    </div>
  `;
  
  document.body.appendChild(overlay);
  
  overlay.querySelector('#close-load-modal').onclick = () => overlay.remove();
  overlay.querySelector('#cancel-load').onclick = () => overlay.remove();
  
  // Add hover effect and click handlers
  overlay.querySelectorAll('.list-item-btn').forEach(btn => {
    btn.onmouseover = () => {
      btn.style.background = 'var(--hover-bg)';
      btn.style.borderColor = 'var(--accent)';
    };
    btn.onmouseout = () => {
      btn.style.background = 'var(--panel-2)';
      btn.style.borderColor = 'var(--border)';
    };
    btn.onclick = () => {
      const name = btn.getAttribute('data-name');
      overlay.remove();
      onLoad(name);
    };
  });
}

// Add Ctrl+S keyboard shortcut to save
document.addEventListener('keydown', (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key === 's') {
    e.preventDefault(); // Prevent browser's default save dialog
    document.getElementById('save-tasks-btn').click();
  }
});

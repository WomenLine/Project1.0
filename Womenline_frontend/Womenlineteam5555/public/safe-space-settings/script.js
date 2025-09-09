// Safe Space Settings JavaScript
class SafeSpaceSettings {
  constructor() {
    this.settings = this.loadSettings();
    this.blockedUsers = this.loadBlockedUsers();
    this.initializeEventListeners();
    this.applySettings();
    this.updateBlockedUsersList();
  }

  loadSettings() {
    const defaultSettings = {
      comfortMode: false,
      safetyFilters: true,
      anonymousMode: false,
      privateMode: false,
      restrictedChat: false,
      hideOnlineStatus: false,
      darkMode: false,
      reducedMotion: false,
      panicMode: false
    };
    const saved = localStorage.getItem('safeSpaceSettings');
    return saved ? { ...defaultSettings, ...JSON.parse(saved) } : defaultSettings;
  }

  loadBlockedUsers() {
    const saved = localStorage.getItem('blockedUsers');
    return saved ? JSON.parse(saved) : [];
  }

  saveSettings() {
    localStorage.setItem('safeSpaceSettings', JSON.stringify(this.settings));
    localStorage.setItem('blockedUsers', JSON.stringify(this.blockedUsers));
    this.showStatus('Settings saved successfully!', 'success');
  }

  initializeEventListeners() {
    const toggles = [
      'comfortToggle', 'safetyFiltersToggle', 'anonymousToggle',
      'privateToggle', 'restrictedToggle', 'hideOnlineToggle',
      'darkModeToggle', 'reducedMotionToggle', 'panicModeToggle'
    ];

    toggles.forEach(toggleId => {
      const element = document.getElementById(toggleId);
      if (element) {
        element.addEventListener('change', (e) => this.handleToggleChange(toggleId, e.target.checked));
      }
    });

    const blockInput = document.getElementById('blockUserInput');
    if (blockInput) {
      blockInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          this.blockUser();
        }
      });
    }

    const emergencyBtn = document.getElementById('emergencyContactBtn');
    if (emergencyBtn) {
      emergencyBtn.addEventListener('click', () => this.setEmergencyContact());
    }
  }

  handleToggleChange(toggleId, checked) {
    const settingKey = toggleId.replace('Toggle', '').replace(/([A-Z])/g, (match, letter) => letter.toLowerCase());

    const keyMap = {
      'comfort': 'comfortMode',
      'safetyfilters': 'safetyFilters',
      'anonymous': 'anonymousMode',
      'private': 'privateMode',
      'restricted': 'restrictedChat',
      'hideonline': 'hideOnlineStatus',
      'darkmode': 'darkMode',
      'reducedmotion': 'reducedMotion',
      'panicmode': 'panicMode'
    };

    const actualKey = keyMap[settingKey] || settingKey;
    this.settings[actualKey] = checked;
    this.applySetting(actualKey, checked);

    if (actualKey === 'panicMode' && checked) {
      this.activatePanicMode();
    }
  }

  applySetting(key, value) {
    switch (key) {
      case 'darkMode':
        document.body.classList.toggle('dark-mode', value);
        break;
      case 'reducedMotion':
        document.body.classList.toggle('reduced-motion', value);
        break;
      case 'comfortMode':
        document.body.classList.toggle('comfort-mode', value);
        break;
      case 'privateMode':
        document.body.classList.toggle('private-mode', value);
        break;
    }
  }

  applySettings() {
    Object.keys(this.settings).forEach(key => {
      const toggleId = this.getToggleId(key);
      const element = document.getElementById(toggleId);
      if (element) {
        element.checked = this.settings[key];
      }
      this.applySetting(key, this.settings[key]);
    });
  }

  getToggleId(key) {
    const keyMap = {
      'comfortMode': 'comfortToggle',
      'safetyFilters': 'safetyFiltersToggle',
      'anonymousMode': 'anonymousToggle',
      'privateMode': 'privateToggle',
      'restrictedChat': 'restrictedToggle',
      'hideOnlineStatus': 'hideOnlineToggle',
      'darkMode': 'darkModeToggle',
      'reducedMotion': 'reducedMotionToggle',
      'panicMode': 'panicModeToggle'
    };
    return keyMap[key] || key + 'Toggle';
  }

  blockUser() {
    const username = document.getElementById('blockUserInput').value.trim();
    if (!username) {
      this.showStatus('Please enter a valid username.', 'error');
      return;
    }
    if (this.blockedUsers.includes(username.toLowerCase())) {
      this.showStatus(`User "${username}" is already blocked.`, 'warning');
      return;
    }
    this.blockedUsers.push(username.toLowerCase());
    this.updateBlockedUsersList();
    document.getElementById('blockUserInput').value = '';
    this.showStatus(`User "${username}" has been blocked.`, 'success');
  }

  unblockUser(username) {
    const index = this.blockedUsers.indexOf(username.toLowerCase());
    if (index > -1) {
      this.blockedUsers.splice(index, 1);
      this.updateBlockedUsersList();
      this.showStatus(`User "${username}" has been unblocked.`, 'success');
    }
  }

  updateBlockedUsersList() {
    const list = document.getElementById('blockedUsersList');
    if (!list) return;
    list.innerHTML = '';
    if (this.blockedUsers.length === 0) {
      list.innerHTML = '<li class="no-blocked-users">No blocked users</li>';
      return;
    }
    this.blockedUsers.forEach(username => {
      const li = document.createElement('li');
      li.className = 'blocked-user-item';
      li.innerHTML = `
        <span class="username">${username}</span>
        <button onclick="safeSpace.unblockUser('${username}')" class="unblock-btn">Unblock</button>
      `;
      list.appendChild(li);
    });
  }

  activatePanicMode() {
    this.settings.privateMode = true;
    this.settings.restrictedChat = true;
    this.settings.hideOnlineStatus = true;
    this.settings.anonymousMode = true;
    this.applySettings();
    this.showStatus('🚨 Panic Mode Activated - Maximum privacy enabled', 'panic');
    this.clearRecentActivity();
  }

  clearRecentActivity() {
    console.log('Clearing recent activity...');
  }

  setEmergencyContact() {
    const contact = prompt('Enter emergency contact (email or phone):');
    if (contact) {
      localStorage.setItem('emergencyContact', contact);
      this.showStatus('Emergency contact saved successfully!', 'success');
    }
  }

  showStatus(message, type = 'info') {
    const statusElement = document.getElementById('statusMessage');
    if (!statusElement) return;
    statusElement.textContent = message;
    statusElement.className = `status-message ${type}`;
    setTimeout(() => {
      statusElement.textContent = '';
      statusElement.className = 'status-message';
    }, 3000);
  }

  resetSettings() {
    if (confirm('Are you sure you want to reset all settings to default?')) {
      localStorage.removeItem('safeSpaceSettings');
      localStorage.removeItem('blockedUsers');
      this.settings = this.loadSettings();
      this.blockedUsers = this.loadBlockedUsers();
      this.applySettings();
      this.updateBlockedUsersList();
      this.showStatus('Settings reset to default values.', 'success');
    }
  }
}

function blockUser() { safeSpace.blockUser(); }
function saveSettings() { safeSpace.saveSettings(); }
function resetSettings() { safeSpace.resetSettings(); }

document.addEventListener('DOMContentLoaded', () => { window.safeSpace = new SafeSpaceSettings(); });

document.addEventListener('keydown', (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key === 's') {
    e.preventDefault();
    saveSettings();
  }
  if (e.key === 'Escape' && e.shiftKey) {
    const panicToggle = document.getElementById('panicModeToggle');
    if (panicToggle && !panicToggle.checked) {
      panicToggle.checked = true;
      safeSpace.handleToggleChange('panicModeToggle', true);
    }
  }
});

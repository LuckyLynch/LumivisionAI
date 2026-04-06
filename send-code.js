// ============================================================
// send-code.js — Auth Modal Logic (Login & Signup with EmailJS)
// ============================================================

const EMAILJS_PUBLIC_KEY  = "hHqWe6Sd5AoArHRNs";
const EMAILJS_SERVICE_ID  = "service_sd8z01p";
const EMAILJS_TEMPLATE_ID = "template_0bm7td3";

emailjs.init(EMAILJS_PUBLIC_KEY);

function generateCode() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}
let activeCode = "";

function sendCode(email) {
    activeCode = generateCode();
    return emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
        email: email,
        passcode: activeCode,
    });
}

function startCooldown(btn, seconds) {
    btn.disabled = true;
    let remaining = seconds;
    btn.textContent = `Resend in ${remaining}s`;
    const interval = setInterval(() => {
        remaining--;
        btn.textContent = remaining > 0 ? `Resend in ${remaining}s` : "Resend Code";
        if (remaining <= 0) { clearInterval(interval); btn.disabled = false; }
    }, 1000);
}

// ── localStorage helpers ──
function getAccounts() {
    return JSON.parse(localStorage.getItem('lv_accounts') || '{}');
}
function saveAccount(email, password) {
    const accounts = getAccounts();
    const displayName = (email && email.includes('@')) ? email.split('@')[0] : (email || 'User');
    accounts[email] = {
        password,
        displayName,
        avatar: null,
        createdAt: Date.now(),
        prefs: { emailNotif: false, genNotif: true, saveImages: true, watermark: false }
    };
    localStorage.setItem('lv_accounts', JSON.stringify(accounts));
}
function accountExists(email) { return !!getAccounts()[email]; }
function getAccount(email) { return getAccounts()[email] || null; }
function updateAccount(email, fields) {
    const accounts = getAccounts();
    if (accounts[email]) {
        accounts[email] = { ...accounts[email], ...fields };
        localStorage.setItem('lv_accounts', JSON.stringify(accounts));
    }
}
function setLoggedIn(email) {
    localStorage.setItem('lv_user', email);
    updateNavUI(email);
}
function getLoggedInUser() { return localStorage.getItem('lv_user'); }
function logout() {
    localStorage.removeItem('lv_user');
    updateNavUI(null);
    closeProfilePopup();
}

// ── Generated images ──
function getGeneratedImages() {
    return JSON.parse(localStorage.getItem('lv_generated') || '[]');
}

// ── Avatar HTML ──
function getAvatarHTML(email, size = 36) {
    const account = email ? getAccount(email) : null;
    if (account && account.avatar) {
        return `<img src="${account.avatar}" style="width:${size}px;height:${size}px;border-radius:50%;object-fit:cover;border:2px solid var(--color-primary);flex-shrink:0;">`;
    }
    const name = (account && account.displayName) ? account.displayName : (email || 'U');
    const initial = (name[0] || 'U').toUpperCase(); // ← safe fallback
    const colors = ['#4cc9f0','#f72585','#7209b7','#3a0ca3','#4361ee'];
    const color = colors[initial.charCodeAt(0) % colors.length];
    return `<div style="width:${size}px;height:${size}px;border-radius:50%;background:${color};display:flex;align-items:center;justify-content:center;font-weight:bold;font-size:${Math.floor(size*0.4)}px;color:#fff;border:2px solid var(--color-primary);flex-shrink:0;">${initial}</div>`;
}

// ── Profile popup ──
function closeProfilePopup() {
    const popup = document.getElementById('lv-profile-popup');
    if (popup) { popup.classList.remove('lv-popup-visible'); setTimeout(() => popup.remove(), 200); }
}

function openProfilePopup() {
    closeProfilePopup();
    const email = getLoggedInUser();
    if (!email) return;
    const account = getAccount(email);
    const displayName = account ? account.displayName : email.split('@')[0];

    const popup = document.createElement('div');
    popup.id = 'lv-profile-popup';
    popup.innerHTML = `
        <div class="lv-profile-header">
            ${getAvatarHTML(email, 50)}
            <div class="lv-profile-info">
                <div class="lv-profile-name">${displayName}</div>
                <div class="lv-profile-email">${email}</div>
            </div>
        </div>
        <div class="lv-profile-divider"></div>
        <ul class="lv-profile-menu">
            <li id="lv-menu-genimages"><i class="fas fa-images"></i> Generated Images</li>
            <li id="lv-menu-editprofile"><i class="fas fa-user-edit"></i> Edit Profile</li>
            <li id="lv-menu-settings"><i class="fas fa-cog"></i> Settings</li>
            <div class="lv-profile-divider"></div>
            <li id="lv-menu-logout" class="lv-logout-item"><i class="fas fa-sign-out-alt"></i> Log Out</li>
        </ul>
    `;
    document.body.appendChild(popup);

    const btn = document.getElementById('lv-nav-avatar');
    if (btn) {
        const rect = btn.getBoundingClientRect();
        popup.style.top   = (rect.bottom + 8) + 'px';
        popup.style.right = (window.innerWidth - rect.right) + 'px';
    }

    requestAnimationFrame(() => popup.classList.add('lv-popup-visible'));

    document.getElementById('lv-menu-genimages').addEventListener('click', () => { closeProfilePopup(); openGeneratedImagesModal(); });
    document.getElementById('lv-menu-editprofile').addEventListener('click', () => { closeProfilePopup(); openEditProfileModal(); });
    document.getElementById('lv-menu-settings').addEventListener('click', () => { closeProfilePopup(); openSettingsModal(); });
    document.getElementById('lv-menu-logout').addEventListener('click', () => logout());

    setTimeout(() => {
        document.addEventListener('click', function handler(e) {
            const popup = document.getElementById('lv-profile-popup');
            const avatarBtn = document.getElementById('lv-nav-avatar');
            if (popup && !popup.contains(e.target) && avatarBtn && !avatarBtn.contains(e.target)) {
                closeProfilePopup();
                document.removeEventListener('click', handler);
            }
        });
    }, 100);
}

// ── Nav UI ──
function updateNavUI(email) {
    const loginBtn = document.getElementById('openLoginBtn');
    const oldWrapper = document.getElementById('lv-nav-avatar');
    if (oldWrapper) oldWrapper.remove();

    if (email) {
        const account = getAccount(email);
        const displayName = (account && account.displayName) ? account.displayName : (email ? email.split('@')[0] : 'User');

        const wrapper = document.createElement('div');
        wrapper.id = 'lv-nav-avatar';
        wrapper.className = 'lv-nav-user';
        wrapper.innerHTML = `${getAvatarHTML(email, 32)}<span class="lv-nav-name">${displayName}</span><i class="fas fa-chevron-down" style="font-size:0.7em;color:var(--color-subtle-text);"></i>`;
        wrapper.addEventListener('click', (e) => {
            e.stopPropagation();
            const popup = document.getElementById('lv-profile-popup');
            if (popup) closeProfilePopup(); else openProfilePopup();
        });

if (loginBtn) {
    loginBtn.style.display = 'none';
    loginBtn.parentNode.appendChild(wrapper); // appends to end = rightmost
}
    } else {
        if (loginBtn) {
            loginBtn.style.display = '';
            loginBtn.textContent = 'Login / Signup';
            loginBtn.onclick = null;
        }
    }
}

// ── Modal builder ──
function createModal(id, title, bodyHTML) {
    const existing = document.getElementById(id);
    if (existing) existing.remove();

    const modal = document.createElement('div');
    modal.id = id;
    modal.className = 'modal';
    modal.style.cssText = 'z-index:5000;visibility:visible;opacity:0;transition:opacity 0.3s;';
    modal.innerHTML = `
        <div class="modal-content" style="max-width:480px;max-height:85vh;overflow-y:auto;">
            <span class="close-btn" id="${id}-close">&times;</span>
            <h2 style="text-align:center;margin-bottom:20px;color:var(--color-primary);">${title}</h2>
            ${bodyHTML}
        </div>
    `;
    document.body.appendChild(modal);
    requestAnimationFrame(() => modal.style.opacity = '1');

    function closeThis() {
        modal.style.opacity = '0';
        setTimeout(() => { if (modal.parentNode) modal.remove(); }, 300);
    }

    document.getElementById(`${id}-close`).addEventListener('click', closeThis);
    modal.addEventListener('click', (e) => { if (e.target === modal) closeThis(); });
    return modal;
}

// ── Generated Images Modal ──
function openGeneratedImagesModal() {
    const images = getGeneratedImages();
    let bodyHTML = '';

    if (images.length === 0) {
        bodyHTML = `
        <div style="text-align:center;padding:40px 20px;color:var(--color-subtle-text);">
            <i class="fas fa-image" style="font-size:3em;margin-bottom:15px;display:block;opacity:0.3;"></i>
            <p style="font-size:1em;margin-bottom:8px;">No generated images yet.</p>
            <p style="font-size:0.85em;">Images you generate will appear here automatically.</p>
        </div>`;
    } else {
        bodyHTML = `
        <p style="text-align:center;color:var(--color-subtle-text);font-size:0.85em;margin-bottom:16px;">${images.length} image${images.length !== 1 ? 's' : ''} in history</p>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
${images.map((img, i) => `
    <div style="position:relative;border-radius:8px;overflow:hidden;border:1px solid var(--color-border);background:var(--color-card-bg);">
        <button class="lv-gen-remove-btn" data-index="${i}" title="Remove"
            style="position:absolute;top:6px;right:6px;z-index:10;width:22px;height:22px;border-radius:50%;background:rgba(0,0,0,0.65);border:none;color:#fff;font-size:0.75em;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:background 0.2s;"
            onmouseover="this.style.background='var(--color-secondary)'"
            onmouseout="this.style.background='rgba(0,0,0,0.65)'">✕</button>
        <img src="${img.url}" alt="${img.prompt}" style="width:100%;height:120px;object-fit:cover;display:block;" onerror="this.parentElement.style.display='none'">
        <div style="padding:8px;">
            <div style="font-size:0.75em;color:var(--color-text);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;" title="${img.prompt}">${img.prompt}</div>
            <div style="font-size:0.7em;color:var(--color-subtle-text);margin-top:3px;">${img.date}</div>
        </div>
    </div>
`).join('')}
        </div>`;
    }

    createModal('lv-genimages-modal', '🖼️ Generated Images', bodyHTML);

    // Wait for modal to render then attach listeners
setTimeout(() => {
    document.querySelectorAll('.lv-gen-remove-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const index = parseInt(btn.dataset.index);
            const images = JSON.parse(localStorage.getItem('lv_generated') || '[]');
            images.splice(index, 1);
            localStorage.setItem('lv_generated', JSON.stringify(images));

            // Re-render inside the existing modal without closing it
            const modalContent = document.querySelector('#lv-genimages-modal .modal-content');
            if (!modalContent) return;

            if (images.length === 0) {
                // Show empty state
                const grid = modalContent.querySelector('div[style*="grid"]');
                const count = modalContent.querySelector('p');
                if (grid) grid.remove();
                if (count) count.remove();
                const empty = document.createElement('div');
                empty.style.cssText = 'text-align:center;padding:40px 20px;color:var(--color-subtle-text);';
                empty.innerHTML = `<i class="fas fa-image" style="font-size:3em;margin-bottom:15px;display:block;opacity:0.3;"></i><p>No generated images yet.</p>`;
                modalContent.appendChild(empty);
                return;
            }

            // Update count
            const countEl = modalContent.querySelector('p');
            if (countEl) countEl.textContent = `${images.length} image${images.length !== 1 ? 's' : ''} in history`;

            // Remove the card from DOM directly
            const card = btn.closest('div[data-index], div[style*="position:relative"]');
            if (card) {
                card.style.transition = 'opacity 0.2s, transform 0.2s';
                card.style.opacity = '0';
                card.style.transform = 'scale(0.9)';
                setTimeout(() => {
                    card.remove();
                    // Re-index remaining remove buttons
                    const remaining = modalContent.querySelectorAll('.lv-gen-remove-btn');
                    remaining.forEach((b, newI) => { b.dataset.index = newI; });
                }, 200);
            }
        });
    });
}, 100);
}

// ── Edit Profile Modal ──
function openEditProfileModal() {
    const email   = getLoggedInUser();
    const account = getAccount(email);
    const displayName = account ? account.displayName : '';
    const avatar = account ? account.avatar : null;
    let newAvatarBase64 = avatar;

    const bodyHTML = `
        <div style="text-align:center;margin-bottom:24px;">
            <div id="lv-avatar-preview" style="margin:0 auto 10px;width:88px;height:88px;border-radius:50%;overflow:hidden;border:3px solid var(--color-primary);display:flex;align-items:center;justify-content:center;background:var(--color-card-bg);cursor:pointer;position:relative;">
                ${avatar
                    ? `<img src="${avatar}" style="width:100%;height:100%;object-fit:cover;">`
                    : `<span style="font-size:2.2em;font-weight:bold;color:var(--color-primary);">${(displayName[0]||email[0]||'?').toUpperCase()}</span>`
                }
                <div style="position:absolute;bottom:0;left:0;right:0;background:rgba(0,0,0,0.55);font-size:0.62em;color:#fff;text-align:center;padding:4px;letter-spacing:0.05em;">CHANGE</div>
            </div>
            <input type="file" id="lv-avatar-input" accept="image/*" style="display:none;">
            <p style="font-size:0.78em;color:var(--color-subtle-text);">Click avatar to upload a photo</p>
        </div>

        <div style="margin-bottom:14px;">
            <label style="font-size:0.8em;font-weight:600;color:var(--color-subtle-text);text-transform:uppercase;letter-spacing:0.06em;display:block;margin-bottom:6px;">Display Name</label>
            <input type="text" id="lv-edit-name" value="${displayName}" placeholder="Your display name"
                style="width:100%;padding:10px 12px;border:1px solid var(--color-border);background:var(--color-card-bg);color:var(--color-text);border-radius:6px;font-size:0.95em;outline:none;transition:border-color 0.2s;"
                onfocus="this.style.borderColor='var(--color-primary)'" onblur="this.style.borderColor='var(--color-border)'">
        </div>

        <div style="margin-bottom:22px;">
            <label style="font-size:0.8em;font-weight:600;color:var(--color-subtle-text);text-transform:uppercase;letter-spacing:0.06em;display:block;margin-bottom:6px;">Email</label>
            <input type="text" value="${email}" disabled
                style="width:100%;padding:10px 12px;border:1px solid var(--color-border);background:rgba(255,255,255,0.03);color:var(--color-subtle-text);border-radius:6px;font-size:0.95em;cursor:not-allowed;">
        </div>

        <button id="lv-save-profile-btn" class="cta-button" style="width:100%;">Save Changes</button>
    `;

    createModal('lv-editprofile-modal', '✏️ Edit Profile', bodyHTML);

    document.getElementById('lv-avatar-preview').addEventListener('click', () => {
        document.getElementById('lv-avatar-input').click();
    });

    document.getElementById('lv-avatar-input').addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => {
            newAvatarBase64 = ev.target.result;
            document.getElementById('lv-avatar-preview').innerHTML =
                `<img src="${newAvatarBase64}" style="width:100%;height:100%;object-fit:cover;">
                 <div style="position:absolute;bottom:0;left:0;right:0;background:rgba(0,0,0,0.55);font-size:0.62em;color:#fff;text-align:center;padding:4px;letter-spacing:0.05em;">CHANGE</div>`;
        };
        reader.readAsDataURL(file);
    });

    document.getElementById('lv-save-profile-btn').addEventListener('click', () => {
        const newName = document.getElementById('lv-edit-name').value.trim();
        if (!newName) { showCustomAlert("Missing Name", "Please enter a display name."); return; }
        updateAccount(email, { displayName: newName, avatar: newAvatarBase64 });
        updateNavUI(email);
        const m = document.getElementById('lv-editprofile-modal');
        if (m) { m.style.opacity = '0'; setTimeout(() => m.remove(), 300); }
        showCustomAlert("Profile Updated", "Your profile has been saved.");
    });
}

// ── Settings Modal ──
function openSettingsModal() {
    const email   = getLoggedInUser();
    const account = getAccount(email);
    const prefs   = (account && account.prefs) ? account.prefs : {};

    const toggle = (id, checked) => `
        <label class="lv-toggle">
            <input type="checkbox" id="${id}" ${checked ? 'checked' : ''}>
            <span class="lv-toggle-slider"></span>
        </label>`;

    const bodyHTML = `
        <div class="lv-settings-section">
            <h4><i class="fas fa-bell"></i> Notifications</h4>
            <div class="lv-setting-row">
                <div><div class="lv-setting-label">Email Notifications</div><div class="lv-setting-desc">Receive updates about new features</div></div>
                ${toggle('pref-email-notif', prefs.emailNotif)}
            </div>
            <div class="lv-setting-row">
                <div><div class="lv-setting-label">Generation Alerts</div><div class="lv-setting-desc">Notify when your image is ready</div></div>
                ${toggle('pref-gen-notif', prefs.genNotif)}
            </div>
        </div>

        <div class="lv-settings-section">
            <h4><i class="fas fa-sliders-h"></i> Preferences</h4>
            <div class="lv-setting-row">
                <div><div class="lv-setting-label">Auto-Save Images</div><div class="lv-setting-desc">Save all generated images to history</div></div>
                ${toggle('pref-save-images', prefs.saveImages !== false)}
            </div>
            <div class="lv-setting-row">
                <div><div class="lv-setting-label">Show Watermark</div><div class="lv-setting-desc">Show LumivisionAI watermark on images</div></div>
                ${toggle('pref-watermark', prefs.watermark)}
            </div>
        </div>

        <div class="lv-settings-section">
            <h4><i class="fas fa-shield-alt"></i> Account</h4>
            <div class="lv-setting-row">
                <div><div class="lv-setting-label">Change Password</div><div class="lv-setting-desc">Update your account password</div></div>
                <button id="lv-change-pwd-btn" class="lv-setting-btn">Change</button>
            </div>
            <div id="lv-change-pwd-form" style="display:none;margin-top:10px;padding:12px;background:var(--color-card-bg);border-radius:8px;border:1px solid var(--color-border);">
                <input type="password" id="lv-new-pwd" placeholder="New password (min 6 chars)"
                    style="width:100%;padding:9px 12px;border:1px solid var(--color-border);background:var(--color-bg);color:var(--color-text);border-radius:6px;margin-bottom:8px;font-size:0.9em;outline:none;">
                <button id="lv-save-pwd-btn" class="cta-button" style="width:100%;padding:9px;">Save Password</button>
            </div>
            <div class="lv-setting-row" style="margin-top:8px;">
                <div><div class="lv-setting-label" style="color:var(--color-secondary);">Delete Account</div><div class="lv-setting-desc">Permanently remove your account and data</div></div>
                <button id="lv-delete-acc-btn" class="lv-setting-btn" style="border-color:var(--color-secondary);color:var(--color-secondary);">Delete</button>
            </div>
        </div>

        <button id="lv-save-settings-btn" class="cta-button" style="width:100%;margin-top:6px;">Save Settings</button>
    `;

    createModal('lv-settings-modal', '⚙️ Settings', bodyHTML);

    document.getElementById('lv-change-pwd-btn').addEventListener('click', () => {
        const form = document.getElementById('lv-change-pwd-form');
        form.style.display = form.style.display === 'none' ? 'block' : 'none';
    });

    document.getElementById('lv-save-pwd-btn').addEventListener('click', () => {
        const newPwd = document.getElementById('lv-new-pwd').value;
        if (newPwd.length < 6) { showCustomAlert("Too Short", "Password must be at least 6 characters."); return; }
        updateAccount(email, { password: newPwd });
        document.getElementById('lv-change-pwd-form').style.display = 'none';
        showCustomAlert("Password Updated", "Your password has been changed successfully.");
    });

    document.getElementById('lv-delete-acc-btn').addEventListener('click', () => {
        if (confirm("Permanently delete your account? This cannot be undone.")) {
            const accounts = getAccounts();
            delete accounts[email];
            localStorage.setItem('lv_accounts', JSON.stringify(accounts));
            localStorage.removeItem('lv_generated');
            logout();
            const m = document.getElementById('lv-settings-modal');
            if (m) { m.style.opacity = '0'; setTimeout(() => m.remove(), 300); }
            showCustomAlert("Account Deleted", "Your account has been permanently deleted.");
        }
    });

    document.getElementById('lv-save-settings-btn').addEventListener('click', () => {
        updateAccount(email, {
            prefs: {
                emailNotif : document.getElementById('pref-email-notif').checked,
                genNotif   : document.getElementById('pref-gen-notif').checked,
                saveImages : document.getElementById('pref-save-images').checked,
                watermark  : document.getElementById('pref-watermark').checked,
            }
        });
        const m = document.getElementById('lv-settings-modal');
        if (m) { m.style.opacity = '0'; setTimeout(() => m.remove(), 300); }
        showCustomAlert("Settings Saved", "Your preferences have been updated.");
    });
}

// ── DOM Ready ──
document.addEventListener("DOMContentLoaded", () => {

    const loginModal      = document.getElementById("loginModal");
    const modalTitle      = document.getElementById("modalTitle");
    const modalSubtitle   = document.getElementById("modalSubtitle");
    const switchLink      = document.getElementById("switchtoSignup");
    const switchLabel     = document.getElementById("switchLabel");

    const loginStep1         = document.getElementById("loginStep1");
    const loginStep2         = document.getElementById("loginStep2");
    const loginEmailInput    = document.getElementById("loginEmailInput");
    const loginEmailDisplay  = document.getElementById("loginEmailDisplay");
    const loginSendCodeBtn   = document.getElementById("loginSendCodeBtn");
    const loginCodeInput     = document.getElementById("loginCodeInput");
    const loginVerifyBtn     = document.getElementById("loginVerifyBtn");
    const loginResendBtn     = document.getElementById("loginResendBtn");

    const signupStep1         = document.getElementById("signupStep1");
    const signupStep2         = document.getElementById("signupStep2");
    const signupEmailInput    = document.getElementById("signupEmailInput");
    const signupPasswordInput = document.getElementById("signupPasswordInput");
    const signupEmailDisplay  = document.getElementById("signupEmailDisplay");
    const signupSendCodeBtn   = document.getElementById("signupSendCodeBtn");
    const signupCodeInput     = document.getElementById("signupCodeInput");
    const signupVerifyBtn     = document.getElementById("signupVerifyBtn");
    const signupResendBtn     = document.getElementById("signupResendBtn");

    let isSignupMode = false;

    function resetModal() {
        [loginStep1, loginStep2, signupStep1, signupStep2].forEach(el => { if (el) el.style.display = "none"; });
        [loginEmailInput, loginCodeInput, signupEmailInput, signupPasswordInput, signupCodeInput].forEach(el => { if (el) el.value = ""; });
        activeCode = "";
    }

    window.showLoginMode = function () {
        isSignupMode = false;
        resetModal();
        if (loginStep1) loginStep1.style.display = "block";
        if (modalTitle) modalTitle.textContent = "Login";
        if (modalSubtitle) modalSubtitle.textContent = "Enter your email to receive a verification code.";
        if (switchLabel) switchLabel.textContent = "Don't have an account?";
        if (switchLink) switchLink.textContent = "Sign Up";
    };

    function showSignupMode() {
        isSignupMode = true;
        resetModal();
        if (signupStep1) signupStep1.style.display = "block";
        if (modalTitle) modalTitle.textContent = "Sign Up";
        if (modalSubtitle) modalSubtitle.textContent = "Create your LumivisionAI account.";
        if (switchLabel) switchLabel.textContent = "Already have an account?";
        if (switchLink) switchLink.textContent = "Login";
    }

    function closeLoginModal() {
        if (loginModal) { loginModal.style.visibility = "hidden"; loginModal.style.opacity = "0"; }
        resetModal();
        showLoginMode();
    }

    const openLoginBtn = document.getElementById("openLoginBtn");
    if (openLoginBtn) {
        openLoginBtn.addEventListener("click", () => {
            if (getLoggedInUser()) return;
            showLoginMode();
            if (loginModal) { loginModal.style.visibility = "visible"; loginModal.style.opacity = "1"; }
        });
    }

    if (switchLink) switchLink.addEventListener("click", (e) => { e.preventDefault(); isSignupMode ? showLoginMode() : showSignupMode(); });

    document.querySelectorAll(".close-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            const target = document.getElementById(btn.dataset.modalId);
            if (target) { target.style.visibility = "hidden"; target.style.opacity = "0"; }
            if (btn.dataset.modalId === "loginModal") closeLoginModal();
        });
    });

    // LOGIN: Send Code
    if (loginSendCodeBtn) {
        loginSendCodeBtn.addEventListener("click", async () => {
            const email = loginEmailInput.value.trim();
            if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { showCustomAlert("Invalid Email", "Please enter a valid email address."); return; }
            if (!accountExists(email)) { showCustomAlert("No Account Found", "No account found. Please sign up first."); return; }
            loginSendCodeBtn.disabled = true;
            loginSendCodeBtn.textContent = "Sending...";
            try {
                await sendCode(email);
                if (loginEmailDisplay) loginEmailDisplay.textContent = email;
                if (loginStep1) loginStep1.style.display = "none";
                if (loginStep2) loginStep2.style.display = "block";
                if (loginCodeInput) loginCodeInput.focus();
            } catch (err) {
                console.error(err);
                showCustomAlert("Send Failed", "Could not send code. Please try again.");
                loginSendCodeBtn.disabled = false;
                loginSendCodeBtn.textContent = "Send Verification Code";
            }
        });
    }

    // LOGIN: Verify
    if (loginVerifyBtn) {
        loginVerifyBtn.addEventListener("click", () => {
            const entered = loginCodeInput ? loginCodeInput.value.trim() : '';
            if (!entered) { showCustomAlert("Missing Code", "Please enter the verification code."); return; }
            if (entered !== activeCode) {
                showCustomAlert("Wrong Code", "Incorrect code. Please try again.");
                if (loginCodeInput) { loginCodeInput.value = ""; loginCodeInput.focus(); }
                return;
            }
            const email = loginEmailDisplay ? loginEmailDisplay.textContent : '';
            setLoggedIn(email);
            closeLoginModal();
            const account = getAccount(email);
            showCustomAlert("Welcome Back!", `Logged in as ${account ? account.displayName : email} 👋`);
        });
    }

    // LOGIN: Resend
    if (loginResendBtn) {
        loginResendBtn.addEventListener("click", async () => {
            const email = loginEmailDisplay ? loginEmailDisplay.textContent : '';
            startCooldown(loginResendBtn, 30);
            try { await sendCode(email); showCustomAlert("Code Resent", `New code sent to ${email}.`); }
            catch { showCustomAlert("Resend Failed", "Could not resend. Try again shortly."); }
        });
    }

    // SIGNUP: Send Code
    if (signupSendCodeBtn) {
        signupSendCodeBtn.addEventListener("click", async () => {
            const email    = signupEmailInput ? signupEmailInput.value.trim() : '';
            const password = signupPasswordInput ? signupPasswordInput.value : '';
            if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { showCustomAlert("Invalid Email", "Please enter a valid email address."); return; }
            if (password.length < 6) { showCustomAlert("Weak Password", "Password must be at least 6 characters."); return; }
            if (accountExists(email)) { showCustomAlert("Already Registered", "This email is already registered. Please login instead."); return; }
            signupSendCodeBtn.disabled = true;
            signupSendCodeBtn.textContent = "Sending...";
            try {
                await sendCode(email);
                if (signupEmailDisplay) signupEmailDisplay.textContent = email;
                if (signupStep1) signupStep1.style.display = "none";
                if (signupStep2) signupStep2.style.display = "block";
                if (signupCodeInput) signupCodeInput.focus();
            } catch (err) {
                console.error(err);
                showCustomAlert("Send Failed", "Could not send code. Please try again.");
                signupSendCodeBtn.disabled = false;
                signupSendCodeBtn.textContent = "Send Verification Code";
            }
        });
    }

    // SIGNUP: Verify
    if (signupVerifyBtn) {
    signupVerifyBtn.addEventListener("click", () => {
        const entered = signupCodeInput ? signupCodeInput.value.trim() : '';
        if (!entered) { showCustomAlert("Missing Code", "Please enter the verification code."); return; }
        if (entered !== activeCode) {
            showCustomAlert("Wrong Code", "Incorrect code. Please try again.");
            if (signupCodeInput) { signupCodeInput.value = ""; signupCodeInput.focus(); }
            return;
        }

        // Get email directly from the input, not the display element
        const email    = signupEmailInput ? signupEmailInput.value.trim() : 
                         (signupEmailDisplay ? signupEmailDisplay.textContent.trim() : '');
        const password = signupPasswordInput ? signupPasswordInput.value : '';

        if (!email) { showCustomAlert("Error", "Could not retrieve email. Please try again."); return; }

        saveAccount(email, password);
        setLoggedIn(email);
        closeLoginModal();
        const account = getAccount(email);
        const name = account ? account.displayName : email.split('@')[0];
        showCustomAlert("Welcome to LumivisionAI! 🎉", `Account created for ${name}. Start generating!`);
    });
}

    // SIGNUP: Resend
    if (signupResendBtn) {
        signupResendBtn.addEventListener("click", async () => {
            const email = signupEmailDisplay ? signupEmailDisplay.textContent : '';
            startCooldown(signupResendBtn, 30);
            try { await sendCode(email); showCustomAlert("Code Resent", `New code sent to ${email}.`); }
            catch { showCustomAlert("Resend Failed", "Could not resend. Try again shortly."); }
        });
    }

    // Init
    const existingUser = getLoggedInUser();
    if (existingUser) updateNavUI(existingUser);
    else showLoginMode();
});
/* ══════════════════════════════════════════════════════════════
   AUTH.JS — Firebase Authentication & User Profile Manager
   CampusPlay Platform
   ══════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  // Global Auth State
  window.CampusPlayAuth = {
    user: null,
    userProfile: null,
    
    // Auth Modal DOM injection
    init() {
      this.injectModal();
      this.bindHeaderButtons();
      this.initFirebaseObserver();
    },

    // Listen to Firebase Auth state
    initFirebaseObserver() {
      const checkAuth = () => {
        if (typeof firebase !== 'undefined' && firebase.auth) {
          firebase.auth().onAuthStateChanged((user) => {
            this.user = user;
            if (user) {
              this.onUserSignedIn(user);
            } else {
              this.onUserSignedOut();
            }
            this.updateHeaderProfileBadge();
          });
        } else {
          // Retry if firebase script is still loading
          setTimeout(checkAuth, 150);
        }
      };
      checkAuth();
    },

    // Injects Auth & Profile Modal into document.body
    injectModal() {
      if (document.getElementById('cp-auth-modal-root')) return;

      const modalHtml = `
      <div id="cp-auth-modal-root" class="cp-auth-overlay" style="display:none;" role="dialog" aria-modal="true">
        <div class="cp-auth-card">
          <button type="button" class="cp-auth-close" id="cp-auth-close-btn" aria-label="Close">&times;</button>
          
          <!-- LOGGED OUT VIEW: SIGN IN / SIGN UP -->
          <div id="cp-auth-guest-view">
            <div class="cp-auth-header">
              <div class="cp-auth-logo-badge">🚀 CampusPlay</div>
              <h2 class="cp-auth-title" id="cp-auth-title">Welcome Back</h2>
              <p class="cp-auth-sub" id="cp-auth-sub">Sign in to track your assessment scores & performance analytics</p>
            </div>

            <!-- Tab Switcher -->
            <div class="cp-auth-tabs">
              <button type="button" class="cp-auth-tab active" id="cp-tab-signin">Sign In</button>
              <button type="button" class="cp-auth-tab" id="cp-tab-signup">Create Account</button>
            </div>

            <!-- Alert Message -->
            <div id="cp-auth-alert" class="cp-auth-alert" style="display:none;"></div>

            <!-- Google Quick Auth -->
            <button type="button" class="cp-auth-btn-google" id="cp-btn-google">
              <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.616z" fill="#4285F4"/>
                <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
                <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
                <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
              </svg>
              <span>Continue with Google</span>
            </button>

            <div class="cp-auth-divider"><span>or with email</span></div>

            <!-- Email Form -->
            <form id="cp-auth-form">
              <div class="cp-auth-group" id="cp-group-name" style="display:none;">
                <label class="cp-auth-label" for="cp-input-name">Full Name</label>
                <input type="text" id="cp-input-name" class="cp-auth-input" placeholder="e.g. Priyanshu Sharma" autocomplete="name" />
              </div>

              <div class="cp-auth-group">
                <label class="cp-auth-label" for="cp-input-email">Email Address</label>
                <input type="email" id="cp-input-email" class="cp-auth-input" placeholder="name@domain.com" required autocomplete="email" />
              </div>

              <div class="cp-auth-group">
                <div class="cp-auth-label-row">
                  <label class="cp-auth-label" for="cp-input-password">Password</label>
                  <a href="#" id="cp-link-forgot" class="cp-auth-link">Forgot?</a>
                </div>
                <input type="password" id="cp-input-password" class="cp-auth-input" placeholder="••••••••" required autocomplete="current-password" />
              </div>

              <button type="submit" class="cp-auth-submit-btn" id="cp-btn-submit">
                <span>Sign In</span> →
              </button>
            </form>
          </div>

          <!-- LOGGED IN VIEW: USER PROFILE DRAWER -->
          <div id="cp-auth-user-view" style="display:none;">
            <div class="cp-profile-header">
              <div class="cp-profile-avatar-large" id="cp-profile-avatar-large">U</div>
              <h3 class="cp-profile-name" id="cp-profile-name">User Name</h3>
              <p class="cp-profile-email" id="cp-profile-email">user@domain.com</p>
              <span class="cp-profile-badge">✔ Verified Candidate Account</span>
            </div>

            <div class="cp-profile-stats">
              <div class="cp-profile-stat-box">
                <span class="cp-profile-stat-label">Candidate ID</span>
                <span class="cp-profile-stat-val" id="cp-profile-cid">CP-1234</span>
              </div>
              <div class="cp-profile-stat-box">
                <span class="cp-profile-stat-label">Account Type</span>
                <span class="cp-profile-stat-val" style="color:var(--emerald, #10b981);">Student Pro</span>
              </div>
            </div>

            <div class="cp-profile-section">
              <label class="cp-auth-label" for="cp-input-candidate-id">Update Candidate ID / Identifier</label>
              <div style="display:flex; gap:8px; margin-top:4px;">
                <input type="text" id="cp-input-candidate-id" class="cp-auth-input" style="flex:1;" placeholder="CP-XXXX" />
                <button type="button" id="cp-btn-save-cid" class="cp-auth-small-btn">Save</button>
              </div>
            </div>

            <div class="cp-profile-actions">
              <a href="games.html" class="cp-auth-outline-btn">🎮 Practice Suite</a>
              <a href="mock-test.html" class="cp-auth-outline-btn">🧪 Mock Tests</a>
              <button type="button" class="cp-auth-logout-btn" id="cp-btn-logout">
                🚪 Sign Out
              </button>
            </div>
          </div>

        </div>
      </div>
      `;

      const wrapper = document.createElement('div');
      wrapper.innerHTML = modalHtml;
      document.body.appendChild(wrapper.firstElementChild);

      this.bindModalEvents();
    },

    bindHeaderButtons() {
      // Find all profile trigger buttons on header navbar
      document.querySelectorAll('.lnav-profile-btn, #btn-header-profile').forEach((btn) => {
        btn.onclick = (e) => {
          e.preventDefault();
          this.openModal();
        };
      });
    },

    bindModalEvents() {
      const modal = document.getElementById('cp-auth-modal-root');
      const closeBtn = document.getElementById('cp-auth-close-btn');
      const tabSignIn = document.getElementById('cp-tab-signin');
      const tabSignUp = document.getElementById('cp-tab-signup');
      const form = document.getElementById('cp-auth-form');
      const googleBtn = document.getElementById('cp-btn-google');
      const logoutBtn = document.getElementById('cp-btn-logout');
      const forgotLink = document.getElementById('cp-link-forgot');
      const saveCidBtn = document.getElementById('cp-btn-save-cid');

      let currentMode = 'signin'; // 'signin' | 'signup'

      const setMode = (mode) => {
        currentMode = mode;
        this.clearAlert();
        if (mode === 'signin') {
          tabSignIn.classList.add('active');
          tabSignUp.classList.remove('active');
          document.getElementById('cp-auth-title').textContent = 'Welcome Back';
          document.getElementById('cp-auth-sub').textContent = 'Sign in to track your assessment scores & performance analytics';
          document.getElementById('cp-group-name').style.display = 'none';
          document.getElementById('cp-btn-submit').querySelector('span').textContent = 'Sign In';
        } else {
          tabSignUp.classList.add('active');
          tabSignIn.classList.remove('active');
          document.getElementById('cp-auth-title').textContent = 'Create Free Account';
          document.getElementById('cp-auth-sub').textContent = 'Join 2,000+ candidates practicing for top employer assessments';
          document.getElementById('cp-group-name').style.display = 'block';
          document.getElementById('cp-btn-submit').querySelector('span').textContent = 'Create Account';
        }
      };

      tabSignIn.onclick = () => setMode('signin');
      tabSignUp.onclick = () => setMode('signup');

      closeBtn.onclick = () => this.closeModal();

      modal.onclick = (e) => {
        if (e.target === modal) this.closeModal();
      };

      // Form Submission
      form.onsubmit = async (e) => {
        e.preventDefault();
        this.clearAlert();

        const email = document.getElementById('cp-input-email').value.trim();
        const password = document.getElementById('cp-input-password').value;
        const name = document.getElementById('cp-input-name').value.trim();

        if (!email || !password) {
          this.showAlert('Please fill in both email and password.', 'error');
          return;
        }

        const submitBtn = document.getElementById('cp-btn-submit');
        submitBtn.disabled = true;
        submitBtn.style.opacity = '0.7';

        try {
          if (currentMode === 'signup') {
            const credential = await firebase.auth().createUserWithEmailAndPassword(email, password);
            if (name && credential.user) {
              await credential.user.updateProfile({ displayName: name });
            }
            this.showAlert('Account created successfully! Logging you in...', 'success');
            setTimeout(() => this.closeModal(), 1200);
          } else {
            await firebase.auth().signInWithEmailAndPassword(email, password);
            this.showAlert('Signed in successfully!', 'success');
            setTimeout(() => this.closeModal(), 800);
          }
        } catch (err) {
          console.error("Auth error:", err);
          this.showAlert(err.message || 'Authentication failed. Please check credentials.', 'error');
        } finally {
          submitBtn.disabled = false;
          submitBtn.style.opacity = '1';
        }
      };

      // Google Sign-In
      googleBtn.onclick = async () => {
        this.clearAlert();
        try {
          const provider = new firebase.auth.GoogleAuthProvider();
          await firebase.auth().signInWithPopup(provider);
          this.showAlert('Signed in with Google!', 'success');
          setTimeout(() => this.closeModal(), 800);
        } catch (err) {
          console.error("Google Auth Error:", err);
          if (err.code === 'auth/unauthorized-domain' || (err.message && err.message.includes('unauthorized-domain'))) {
            this.showAlert('Domain Authorization Required: campusplay.in must be added to Authorized Domains in Firebase Console. You can also sign in below using Email & Password.', 'error');
          } else {
            this.showAlert(err.message || 'Google sign-in failed. Ensure popups are allowed.', 'error');
          }
        }
      };

      // Forgot Password
      forgotLink.onclick = async (e) => {
        e.preventDefault();
        const email = document.getElementById('cp-input-email').value.trim();
        if (!email) {
          this.showAlert('Enter your email address above, then click Forgot Password again.', 'error');
          return;
        }
        try {
          await firebase.auth().sendPasswordResetEmail(email);
          this.showAlert(`Password reset email sent to ${email}. Check your inbox!`, 'success');
        } catch (err) {
          this.showAlert(err.message || 'Failed to send password reset email.', 'error');
        }
      };

      // Logout
      logoutBtn.onclick = async () => {
        try {
          await firebase.auth().signOut();
          this.showAlert('Signed out.', 'success');
          this.closeModal();
        } catch (err) {
          console.error(err);
        }
      };

      // Save Candidate ID
      saveCidBtn.onclick = async () => {
        const newCid = document.getElementById('cp-input-candidate-id').value.trim();
        if (!newCid) return;
        localStorage.setItem('ciq_candidate_id', newCid);
        document.getElementById('cp-profile-cid').textContent = newCid;

        // If logged in & Firestore ready, sync to user profile doc
        if (this.user && typeof db !== 'undefined' && db) {
          try {
            await db.collection('users').doc(this.user.uid).set({
              candidateId: newCid,
              updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            }, { merge: true });
          } catch (e) {
            console.warn("Firestore user sync error:", e);
          }
        }
        alert('Candidate ID updated to: ' + newCid);
      };
    },

    openModal() {
      const modal = document.getElementById('cp-auth-modal-root');
      if (modal) {
        modal.style.display = 'flex';
        this.clearAlert();
        this.updateModalViews();
      }
    },

    closeModal() {
      const modal = document.getElementById('cp-auth-modal-root');
      if (modal) modal.style.display = 'none';
    },

    onUserSignedIn(user) {
      const guestView = document.getElementById('cp-auth-guest-view');
      const userView = document.getElementById('cp-auth-user-view');

      if (guestView) guestView.style.display = 'none';
      if (userView) userView.style.display = 'block';

      const name = user.displayName || user.email.split('@')[0];
      const email = user.email;
      const initial = (name.charAt(0) || 'U').toUpperCase();

      document.getElementById('cp-profile-name').textContent = name;
      document.getElementById('cp-profile-email').textContent = email;

      const avatarLarge = document.getElementById('cp-profile-avatar-large');
      if (user.photoURL) {
        avatarLarge.innerHTML = `<img src="${user.photoURL}" alt="${name}" style="width:100%;height:100%;border-radius:50%;object-fit:cover;"/>`;
      } else {
        avatarLarge.textContent = initial;
      }

      // Sync Candidate ID
      let cid = localStorage.getItem('ciq_candidate_id') || ('CP-' + user.uid.substr(0, 6).toUpperCase());
      localStorage.setItem('ciq_candidate_id', cid);
      document.getElementById('cp-profile-cid').textContent = cid;
      document.getElementById('cp-input-candidate-id').value = cid;

      // Sync to Firestore user doc if ready
      if (typeof db !== 'undefined' && db) {
        db.collection('users').doc(user.uid).set({
          uid: user.uid,
          email: user.email,
          displayName: name,
          candidateId: cid,
          lastLoginAt: firebase.firestore.FieldValue.serverTimestamp()
        }, { merge: true }).catch(err => console.warn("User doc sync warn:", err));
      }
    },

    onUserSignedOut() {
      const guestView = document.getElementById('cp-auth-guest-view');
      const userView = document.getElementById('cp-auth-user-view');

      if (guestView) guestView.style.display = 'block';
      if (userView) userView.style.display = 'none';
    },

    updateModalViews() {
      if (this.user) {
        this.onUserSignedIn(this.user);
      } else {
        this.onUserSignedOut();
      }
    },

    updateHeaderProfileBadge() {
      const badges = document.querySelectorAll('.lnav-profile-btn');
      badges.forEach(btn => {
        if (this.user) {
          const name = this.user.displayName || this.user.email.split('@')[0];
          const firstName = name.split(' ')[0];
          const initial = (firstName.charAt(0) || 'U').toUpperCase();
          if (this.user.photoURL) {
            btn.innerHTML = `<img src="${this.user.photoURL}" class="lnav-avatar-img" alt="Profile"/><span style="font-weight:700;">${firstName}</span><span class="lnav-online-dot"></span>`;
          } else {
            btn.innerHTML = `<span class="lnav-avatar-text">${initial}</span><span style="font-weight:700;">${firstName}</span><span class="lnav-online-dot"></span>`;
          }
          btn.title = `Profile: ${name}`;
          btn.classList.add('logged-in');
        } else {
          btn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg><span>Sign In</span>`;
          btn.title = `Sign In / Profile`;
          btn.classList.remove('logged-in');
        }
      });
    },

    showAlert(msg, type = 'error') {
      const alertBox = document.getElementById('cp-auth-alert');
      if (!alertBox) return;
      alertBox.textContent = msg;
      alertBox.className = `cp-auth-alert ${type}`;
      alertBox.style.display = 'block';
    },

    clearAlert() {
      const alertBox = document.getElementById('cp-auth-alert');
      if (alertBox) {
        alertBox.style.display = 'none';
        alertBox.textContent = '';
      }
    }
  };

  // Auto initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => window.CampusPlayAuth.init());
  } else {
    window.CampusPlayAuth.init();
  }
})();

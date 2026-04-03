/* ============= auth.js — Authentication & Session (Multi-Role) ============= */
(function () {
    const USERS_KEY = 'lh_users';
    const SESSION_KEY = 'lh_session';

    function getUsers() { return JSON.parse(localStorage.getItem(USERS_KEY) || '[]'); }
    function saveUsers(u) { localStorage.setItem(USERS_KEY, JSON.stringify(u)); }

    function getCurrentUser() {
        const id = localStorage.getItem(SESSION_KEY);
        if (!id) return null;
        return getUsers().find(u => u.id === id) || null;
    }
    function setSession(id) { localStorage.setItem(SESSION_KEY, id); }
    function clearSession() { localStorage.removeItem(SESSION_KEY); }

    /* ---- Seed default accounts on first load ---- */
    function seedAccounts() {
        const users = getUsers();
        const adminExists = users.find(u => u.role === 'admin');
        const corpExists = users.find(u => u.role === 'corporate');
        let changed = false;
        if (!adminExists) {
            users.push({
                id: 'admin_001',
                name: 'Edulera Admin',
                email: 'admin@Edulera.com',
                password: 'Admin123!',
                role: 'admin',
                createdAt: new Date().toISOString()
            });
            changed = true;
        }
        if (!corpExists) {
            users.push({
                id: 'corp_001',
                name: 'TechCorp Training',
                email: 'company@techcorp.com',
                password: 'Company123!',
                role: 'corporate',
                companyName: 'TechCorp Inc.',
                createdAt: new Date().toISOString()
            });
            changed = true;
        }
        if (changed) saveUsers(users);
    }

    function register(data) {
        const users = getUsers();
        if (users.find(u => u.email.toLowerCase() === data.email.toLowerCase())) {
            return { ok: false, msg: 'This email address is already registered.' };
        }
        const user = {
            id: 'u_' + Date.now() + Math.random().toString(36).slice(2, 8),
            name: data.name.trim(),
            email: data.email.trim().toLowerCase(),
            password: data.password,
            role: 'user',
            interests: data.interests || [],
            bio: '',
            createdAt: new Date().toISOString()
        };
        users.push(user);
        saveUsers(users);
        setSession(user.id);
        return { ok: true, user };
    }

    function login(email, password, expectedRole) {
        const users = getUsers();
        const user = users.find(u => u.email === email.trim().toLowerCase() && u.password === password);
        if (!user) return { ok: false, msg: 'Incorrect email or password.' };
        if (expectedRole && user.role !== expectedRole) {
            const roleNames = { user: 'User', corporate: 'Corporate', admin: 'Admin' };
            return { ok: false, msg: `This account has the "${roleNames[user.role]}" role. Please select the correct tab.` };
        }
        setSession(user.id);
        return { ok: true, user };
    }

    function logout() {
        clearSession();
        window.location.href = 'index.html';
    }

    function updateUser(fields) {
        const users = getUsers();
        const idx = users.findIndex(u => u.id === localStorage.getItem(SESSION_KEY));
        if (idx === -1) return false;
        Object.assign(users[idx], fields);
        saveUsers(users);
        return true;
    }

    function requireAuth() {
        if (!getCurrentUser()) {
            window.location.href = 'login.html?redirect=' + encodeURIComponent(window.location.href);
        }
    }

    function requireRole(role) {
        const user = getCurrentUser();
        if (!user) {
            window.location.href = 'login.html';
            return;
        }
        if (user.role !== role) {
            // Redirect to appropriate panel
            const redirectMap = { admin: 'admin.html', corporate: 'corporate.html', user: 'index.html' };
            window.location.href = redirectMap[user.role] || 'index.html';
        }
    }

    function avatarColor(name) {
        const colors = [
            'linear-gradient(135deg,#4263eb,#5c7cfa)',
            'linear-gradient(135deg,#3b82f6,#06b6d4)',
            'linear-gradient(135deg,#10b981,#34d399)',
            'linear-gradient(135deg,#f59e0b,#ef4444)',
            'linear-gradient(135deg,#8b5cf6,#6366f1)',
        ];
        let n = 0; for (const c of (name || 'A')) n += c.charCodeAt(0);
        return colors[n % colors.length];
    }

    function initNavbar() {
        const user = getCurrentUser();
        const guestNav = document.getElementById('nav-guest');
        const userNav = document.getElementById('nav-user');
        const avatarEl = document.getElementById('nav-avatar-text');
        const avatarWrap = document.getElementById('nav-avatar-wrap');
        const dropdownEl = document.getElementById('nav-dropdown');
        const logoutBtn = document.getElementById('nav-logout');

        if (user) {
            if (guestNav) guestNav.classList.add('hidden');
            if (userNav) userNav.classList.remove('hidden');
            if (avatarEl) avatarEl.textContent = (user.name || 'U')[0].toUpperCase();
            if (avatarWrap) avatarWrap.style.background = avatarColor(user.name);
        } else {
            if (guestNav) guestNav.classList.remove('hidden');
            if (userNav) userNav.classList.add('hidden');
        }

        if (avatarWrap && dropdownEl) {
            avatarWrap.addEventListener('click', e => {
                e.stopPropagation();
                dropdownEl.classList.toggle('open');
            });
            document.addEventListener('click', () => dropdownEl.classList.remove('open'));
        }

        if (logoutBtn) logoutBtn.addEventListener('click', logout);

        // hamburger
        const ham = document.getElementById('hamburger');
        const navLinks = document.getElementById('navbar-links');
        if (ham && navLinks) {
            ham.addEventListener('click', () => navLinks.classList.toggle('open'));
        }
    }

    // Initialize seed accounts
    seedAccounts();

    window.LHAuth = { register, login, logout, getCurrentUser, updateUser, requireAuth, requireRole, avatarColor, initNavbar, getUsers };
})();

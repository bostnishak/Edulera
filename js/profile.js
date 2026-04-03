/* ============= profile.js — User Profile Page ============= */
(function () {
    document.addEventListener('DOMContentLoaded', function () {
        LHAuth.initNavbar();
        LHAuth.requireAuth();
        let user = LHAuth.getCurrentUser();

        // Avatar color from name
        function avatarColor(name) {
            const colors = [
                'linear-gradient(135deg,#6c2bff,#ec4899)',
                'linear-gradient(135deg,#10b981,#3b82f6)',
                'linear-gradient(135deg,#f59e0b,#ef4444)',
                'linear-gradient(135deg,#06b6d4,#6c2bff)',
                'linear-gradient(135deg,#ec4899,#f59e0b)',
            ];
            const idx = (name || 'U').charCodeAt(0) % colors.length;
            return colors[idx];
        }

        function renderSidebar() {
            user = LHAuth.getCurrentUser();
            const letter = (user.name || 'U')[0].toUpperCase();
            const bigAvatar = document.getElementById('profile-avatar-big');
            if (bigAvatar) { bigAvatar.style.background = avatarColor(user.name); }
            setText('profile-avatar-letter', letter);
            setText('profile-display-name', user.name || 'User');
            setText('profile-display-email', user.email || '');

            // Interest chips
            const chipsEl = document.getElementById('profile-interests-chips');
            if (chipsEl) {
                const interests = user.interests || [];
                chipsEl.innerHTML = interests.length
                    ? interests.map(i => `<span class="profile-interest-badge">${i}</span>`).join('')
                    : '<span style="font-size:.8rem;color:var(--text-muted)">No interests added</span>';
            }

            // Stats
            const enrollments = LHData.getEnrollments(user.id);
            const certs = LHData.getCerts(user.id);
            let completedLessons = 0;
            enrollments.forEach(cid => {
                const prog = LHData.getProgress(user.id, cid);
                completedLessons += prog.completedLessons.length;
            });
            setText('stat-courses', enrollments.length);
            setText('stat-certs', certs.length);
            setText('stat-completed', completedLessons);
        }

        function renderOverview() {
            const enrolledIds = LHData.getEnrollments(user.id);
            const certs = LHData.getCerts(user.id);

            // Courses preview (max 3)
            const overviewCourses = document.getElementById('overview-courses-list');
            if (overviewCourses) {
                if (!enrolledIds.length) {
                    overviewCourses.innerHTML = `<div style="text-align:center;padding:28px;color:var(--text-muted)">
                        <i class="fas fa-book-open" style="font-size:2rem;margin-bottom:10px;display:block;opacity:.4"></i>
                        You have no enrolled courses yet. <a href="catalog.html" style="color:var(--accent)">Explore courses</a></div>`;
                } else {
                    overviewCourses.innerHTML = enrolledIds.slice(0, 3).map(cid => {
                        const c = LHData.getCourse(cid); if (!c) return '';
                        const prog = LHData.getProgress(user.id, cid);
                        const pct = Math.round((prog.completedLessons.length / c.lessons.length) * 100);
                        return `<div class="enrolled-course-row" onclick="location.href='player.html?id=${cid}'">
                            <div class="enrolled-thumb" style="background:${c.gradient}">${c.emoji}</div>
                            <div class="enrolled-info">
                                <div class="enrolled-title">${c.title}</div>
                                <div class="enrolled-progress-row">
                                    <div style="flex:1;height:5px;background:var(--bg-secondary);border-radius:99px;overflow:hidden">
                                        <div style="height:100%;background:var(--accent);border-radius:99px;width:${pct}%"></div>
                                    </div>
                                    <span class="enrolled-pct">${pct}%</span>
                                </div>
                            </div>
                            <a href="player.html?id=${cid}" class="btn btn-primary btn-sm" onclick="event.stopPropagation()"><i class="fas fa-play"></i></a>
                        </div>`;
                    }).join('');
                }
            }

            // Certs preview (max 3)
            const overviewCerts = document.getElementById('overview-certs-list');
            if (overviewCerts) {
                if (!certs.length) {
                    overviewCerts.innerHTML = `<div style="text-align:center;padding:28px;color:var(--text-muted)">
                        <i class="fas fa-certificate" style="font-size:2rem;margin-bottom:10px;display:block;opacity:.4"></i>
                        You have no certificates yet. Complete a course!</div>`;
                } else {
                    overviewCerts.innerHTML = certs.slice(0, 3).map(cert => certRowHTML(cert)).join('');
                }
            }
        }

        function renderMyCourses() {
            const enrolledIds = LHData.getEnrollments(user.id);
            const listEl = document.getElementById('my-courses-list');
            if (!listEl) return;
            if (!enrolledIds.length) {
                listEl.innerHTML = `<div class="settings-section" style="text-align:center;padding:40px">
                    <i class="fas fa-book-open" style="font-size:2.5rem;margin-bottom:12px;display:block;opacity:.3;color:var(--text-muted)"></i>
                    <h3 style="margin-bottom:8px;color:var(--text-secondary)">No enrolled courses</h3>
                    <p style="color:var(--text-muted);margin-bottom:20px">Purchase your first course to start learning.</p>
                    <a href="catalog.html" class="btn btn-primary"><i class="fas fa-search"></i> Browse Courses</a></div>`;
                return;
            }
            listEl.innerHTML = enrolledIds.map(cid => {
                const c = LHData.getCourse(cid); if (!c) return '';
                const prog = LHData.getProgress(user.id, cid);
                const pct = Math.round((prog.completedLessons.length / c.lessons.length) * 100);
                const allDone = prog.completedLessons.length === c.lessons.length;
                return `<div class="settings-section" style="padding:20px">
                    <div class="enrolled-course-row" style="cursor:default;background:none;padding:0;margin-bottom:16px" >
                        <div class="enrolled-thumb" style="background:${c.gradient};width:72px;height:56px;font-size:1.6rem">${c.emoji}</div>
                        <div class="enrolled-info">
                            <div class="enrolled-title" style="font-size:1rem">${c.title}</div>
                            <div style="font-size:.82rem;color:var(--text-muted);margin-bottom:6px"><i class="fas fa-user-tie" style="margin-right:4px"></i>${c.instructor} &nbsp;•&nbsp; <span class="badge badge-${prog.quizPassed ? 'success' : 'accent'}">${prog.quizPassed ? 'Quiz Passed' : allDone ? 'Lessons Done' : 'In Progress'}</span></div>
                            <div style="display:flex;align-items:center;gap:8px">
                                <div style="flex:1;height:6px;background:var(--bg-secondary);border-radius:99px;overflow:hidden">
                                    <div style="height:100%;background:var(--accent);border-radius:99px;width:${pct}%"></div>
                                </div>
                                <span style="font-size:.78rem;color:var(--accent);font-weight:700">${pct}%</span>
                                <span style="font-size:.75rem;color:var(--text-muted)">${prog.completedLessons.length}/${c.lessons.length} lessons</span>
                            </div>
                        </div>
                    </div>
                    <div style="display:flex;gap:8px;flex-wrap:wrap">
                        <a href="player.html?id=${cid}" class="btn btn-primary btn-sm"><i class="fas fa-play"></i> ${allDone ? 'Watch Again' : 'Continue'}</a>
                        ${allDone ? `<a href="quiz.html?id=${cid}" class="btn btn-outline btn-sm"><i class="fas fa-pencil-alt"></i> Take Quiz</a>` : ''}
                    </div>
                </div>`;
            }).join('');
        }

        function certRowHTML(cert) {
            const isAchiev = cert.type === 'achievement';
            return `<div class="cert-row" onclick="location.href='certificate.html?id=${cert.id}'">
                <div class="cert-row-icon ${isAchiev ? 'cert-achievement-icon' : 'cert-participation-icon'}">${isAchiev ? '🏆' : '📜'}</div>
                <div class="cert-row-info">
                    <div class="cert-row-type" style="color:${isAchiev ? '#f59e0b' : 'var(--accent)'}">${isAchiev ? 'Certificate of Achievement' : 'Certificate of Completion'}</div>
                    <div class="cert-row-course">${cert.courseName}</div>
                    <div class="cert-row-date">${new Date(cert.date).toLocaleDateString('en-US')}${cert.score ? ` • ${cert.score}%` : ''}</div>
                </div>
                <a href="certificate.html?id=${cert.id}" class="btn btn-outline btn-sm" onclick="event.stopPropagation()"><i class="fas fa-eye"></i> View</a>
            </div>`;
        }

        function renderMyCerts() {
            const certs = LHData.getCerts(user.id);
            const listEl = document.getElementById('my-certs-list');
            if (!listEl) return;
            if (!certs.length) {
                listEl.innerHTML = `<div class="settings-section" style="text-align:center;padding:40px">
                    <div style="font-size:3rem;margin-bottom:12px">🏆</div>
                    <h3 style="margin-bottom:8px;color:var(--text-secondary)">No certificates yet</h3>
                    <p style="color:var(--text-muted);margin-bottom:20px">Complete courses and pass quizzes to earn certificates!</p>
                    <a href="catalog.html" class="btn btn-primary"><i class="fas fa-rocket"></i> Get Started</a></div>`;
                return;
            }
            listEl.innerHTML = certs.map(cert => `<div class="settings-section" style="padding:16px">${certRowHTML(cert)}</div>`).join('');
        }

        function renderEditProfile() {
            const nameInput = document.getElementById('edit-name');
            const emailInput = document.getElementById('edit-email');
            const bioInput = document.getElementById('edit-bio');
            const jobInput = document.getElementById('edit-job');
            if (nameInput) nameInput.value = user.name || '';
            if (emailInput) emailInput.value = user.email || '';
            if (bioInput) bioInput.value = user.bio || '';
            if (jobInput) jobInput.value = user.job || '';

            // Interest checkboxes
            const intCont = document.getElementById('interest-checkboxes');
            if (intCont) {
                const cats = LHData.CATEGORIES;
                intCont.innerHTML = cats.map(cat => {
                    const checked = (user.interests || []).includes(cat);
                    return `<label style="display:flex;align-items:center;gap:8px;padding:10px 16px;border:2px solid ${checked ? 'var(--accent)' : 'var(--border)'};border-radius:var(--radius-lg);cursor:pointer;transition:all .2s;background:${checked ? 'var(--accent-soft)' : 'var(--bg-secondary)'}">
                        <input type="checkbox" value="${cat}" ${checked ? 'checked' : ''} style="display:none">
                        <span>${cat}</span></label>`;
                }).join('');
                intCont.querySelectorAll('label').forEach(label => {
                    label.addEventListener('click', () => {
                        const cb = label.querySelector('input');
                        cb.checked = !cb.checked;
                        label.style.borderColor = cb.checked ? 'var(--accent)' : 'var(--border)';
                        label.style.background = cb.checked ? 'var(--accent-soft)' : 'var(--bg-secondary)';
                    });
                });
            }
        }

        // Tab switching
        document.querySelectorAll('.sidebar-nav-link[data-tab]').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.sidebar-nav-link').forEach(b => b.classList.remove('active'));
                document.querySelectorAll('.profile-tab').forEach(t => t.classList.remove('active'));
                btn.classList.add('active');
                const tabEl = document.getElementById('tab-' + btn.dataset.tab);
                if (tabEl) tabEl.classList.add('active');
                // Render on demand
                if (btn.dataset.tab === 'courses') renderMyCourses();
                else if (btn.dataset.tab === 'certs') renderMyCerts();
                else if (btn.dataset.tab === 'edit') renderEditProfile();
            });
        });

        // Save profile form
        const editForm = document.getElementById('edit-profile-form');
        if (editForm) {
            editForm.addEventListener('submit', e => {
                e.preventDefault();
                const name = (document.getElementById('edit-name').value || '').trim();
                const bio = (document.getElementById('edit-bio').value || '').trim();
                const job = (document.getElementById('edit-job').value || '').trim();
                const errName = document.getElementById('err-edit-name');
                if (!name) { if (errName) errName.textContent = 'Name cannot be empty'; return; }
                if (errName) errName.textContent = '';
                LHAuth.updateUser({ name, bio, job });
                user = LHAuth.getCurrentUser();
                renderSidebar();
                LHData.toast('Profile updated! ✅', 'success');
            });
        }

        // Save interests
        const saveIntBtn = document.getElementById('btn-save-interests');
        if (saveIntBtn) {
            saveIntBtn.addEventListener('click', () => {
                const interests = [...document.querySelectorAll('#interest-checkboxes input:checked')].map(cb => cb.value);
                LHAuth.updateUser({ interests });
                user = LHAuth.getCurrentUser();
                renderSidebar();
                LHData.toast('Interests updated! ✅', 'success');
            });
        }

        // Change password
        const pwForm = document.getElementById('change-password-form');
        if (pwForm) {
            pwForm.addEventListener('submit', e => {
                e.preventDefault();
                const curr = (document.getElementById('current-password').value || '').trim();
                const newPw = (document.getElementById('new-password').value || '').trim();
                const confPw = (document.getElementById('confirm-new-password').value || '').trim();
                const errCurr = document.getElementById('err-current-password');
                const errNew = document.getElementById('err-new-password');
                const errConf = document.getElementById('err-confirm-new-password');
                [errCurr, errNew, errConf].forEach(e => { if (e) e.textContent = ''; });
                if (!curr || curr !== user.password) { if (errCurr) errCurr.textContent = 'Current password is incorrect'; return; }
                if (newPw.length < 6) { if (errNew) errNew.textContent = 'Password must be at least 6 characters'; return; }
                if (newPw !== confPw) { if (errConf) errConf.textContent = 'Passwords do not match'; return; }
                LHAuth.updateUser({ password: newPw });
                LHData.toast('Password changed! 🔑', 'success');
                pwForm.reset();
            });
        }

        // Theme buttons
        const themeBtns = {
            light: document.getElementById('theme-light-btn'),
            dark: document.getElementById('theme-dark-btn'),
            system: document.getElementById('theme-system-btn'),
        };
        function updateThemeBtns() {
            const curr = localStorage.getItem('lh_theme') || 'dark';
            Object.keys(themeBtns).forEach(k => {
                if (themeBtns[k]) {
                    themeBtns[k].style.background = curr === k ? 'var(--accent)' : '';
                    themeBtns[k].style.color = curr === k ? '#fff' : '';
                    themeBtns[k].style.borderColor = curr === k ? 'var(--accent)' : '';
                }
            });
        }
        if (themeBtns.light) themeBtns.light.addEventListener('click', () => { LHTheme.setTheme('light'); updateThemeBtns(); });
        if (themeBtns.dark) themeBtns.dark.addEventListener('click', () => { LHTheme.setTheme('dark'); updateThemeBtns(); });
        if (themeBtns.system) themeBtns.system.addEventListener('click', () => { LHTheme.setTheme('system'); updateThemeBtns(); });
        updateThemeBtns();

        // Logout buttons
        ['logout-btn-sidebar', 'logout-btn-main'].forEach(id => {
            const btn = document.getElementById(id);
            if (btn) btn.addEventListener('click', () => { LHAuth.logout(); location.href = 'index.html'; });
        });

        // Check URL hash for direct tab navigation
        const hash = location.hash.replace('#', '');
        if (hash) {
            const tabBtn = document.querySelector(`.sidebar-nav-link[data-tab="${hash}"]`);
            if (tabBtn) tabBtn.click();
        }

        function setText(id, val) { const el = document.getElementById(id); if (el) el.textContent = val; }

        // Initial render
        renderSidebar();
        renderOverview();
    });
})();

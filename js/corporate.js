/* ============= corporate.js — Corporate Panel Logic ============= */
(function () {
    'use strict';

    let currentUser = null;
    let draftData = {}; // in-memory draft
    let quizQuestions = [];
    let certGradient = 'linear-gradient(135deg,#4263eb,#3b82f6)';
    let pendingContentId = null; // id of draft being worked on

    function init() {
        LHAuth.requireRole('corporate');
        currentUser = LHAuth.getCurrentUser();

        // User info in sidebar
        const userInfoEl = document.getElementById('corp-user-info');
        if (userInfoEl) {
            userInfoEl.innerHTML = `
                <div class="panel-avatar" style="background:${LHAuth.avatarColor(currentUser.name)}">${currentUser.name[0].toUpperCase()}</div>
                <div>
                    <div style="font-weight:600;font-size:.875rem">${currentUser.name}</div>
                    <div style="font-size:.75rem;opacity:.6">Corporate Account</div>
                </div>
            `;
        }

        document.getElementById('corp-logout').addEventListener('click', LHAuth.logout);

        // Sidebar navigation
        document.querySelectorAll('.panel-nav-item').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.panel-nav-item').forEach(b => b.classList.remove('active'));
                document.querySelectorAll('.panel-section').forEach(s => s.classList.remove('active'));
                btn.classList.add('active');
                const sec = document.getElementById('section-' + btn.dataset.section);
                if (sec) sec.classList.add('active');
                if (btn.dataset.section === 'dashboard') renderDashboard();
                if (btn.dataset.section === 'quiz') populateQuizCourseSelect();
                if (btn.dataset.section === 'certificate') populateCertCourseSelect();
                if (btn.dataset.section === 'contents') renderContents();
            });
        });

        // Sidebar toggle mobile
        const toggle = document.getElementById('sidebar-toggle');
        const sidebar = document.getElementById('panel-sidebar');
        if (toggle) toggle.addEventListener('click', () => sidebar.classList.toggle('open'));

        // Upload form
        setupUploadForm();
        setupQuizBuilder();
        setupCertificate();
        setupContents();
        renderDashboard();
    }

    /* ---- DASHBOARD ---- */
    function renderDashboard() {
        const all = LHData.getPendingContent().filter(c => c.corporateId === currentUser.id);
        const pending = all.filter(c => c.status === 'pending').length;
        const approved = all.filter(c => c.status === 'approved').length;
        const rejected = all.filter(c => c.status === 'rejected').length;

        const statsEl = document.getElementById('corp-stats');
        if (statsEl) {
            statsEl.innerHTML = `
                <div class="panel-stat-card">
                    <div class="panel-stat-icon" style="background:var(--info-soft);color:var(--info)"><i class="fas fa-upload"></i></div>
                    <div class="panel-stat-val">${all.length}</div>
                    <div class="panel-stat-label">Total Submissions</div>
                </div>
                <div class="panel-stat-card">
                    <div class="panel-stat-icon" style="background:var(--warning-soft);color:var(--warning)"><i class="fas fa-clock"></i></div>
                    <div class="panel-stat-val">${pending}</div>
                    <div class="panel-stat-label">Awaiting Approval</div>
                </div>
                <div class="panel-stat-card">
                    <div class="panel-stat-icon" style="background:var(--success-soft);color:var(--success)"><i class="fas fa-check-circle"></i></div>
                    <div class="panel-stat-val">${approved}</div>
                    <div class="panel-stat-label">Approved</div>
                </div>
                <div class="panel-stat-card">
                    <div class="panel-stat-icon" style="background:var(--danger-soft);color:var(--danger)"><i class="fas fa-times-circle"></i></div>
                    <div class="panel-stat-val">${rejected}</div>
                    <div class="panel-stat-label">Rejected</div>
                </div>
            `;
        }

        const recentEl = document.getElementById('corp-recent-list');
        if (recentEl) {
            const recent = [...all].sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt)).slice(0, 5);
            if (recent.length === 0) {
                recentEl.innerHTML = '<p class="text-muted" style="color:var(--text-muted)">No content submitted yet.</p>';
            } else {
                recentEl.innerHTML = recent.map(c => `
                    <div class="content-row">
                        <span class="content-row-emoji">${c.emoji || '🎓'}</span>
                        <div class="content-row-info">
                            <div class="content-row-title">${c.title}</div>
                            <div class="content-row-meta">${c.category} • ${fmtDate(c.submittedAt)}</div>
                        </div>
                        ${statusBadge(c.status)}
                    </div>
                `).join('');
            }
        }
    }

    /* ---- UPLOAD FORM ---- */
    function setupUploadForm() {
        const form = document.getElementById('upload-form');
        if (!form) return;

        // Simulate upload progress on URL input
        const urlInput = document.getElementById('up-video-url');
        const zone = document.getElementById('upload-zone');
        if (urlInput) {
            urlInput.addEventListener('input', () => {
                if (urlInput.value.length > 10) {
                    simulateUpload();
                }
            });
        }

        // Drag & drop visual feedback
        if (zone) {
            zone.addEventListener('dragover', e => { e.preventDefault(); zone.classList.add('drag-over'); });
            zone.addEventListener('dragleave', () => zone.classList.remove('drag-over'));
            zone.addEventListener('drop', e => {
                e.preventDefault();
                zone.classList.remove('drag-over');
                const files = e.dataTransfer.files;
                if (files.length > 0) {
                    LHData.toast(`Uploading "${files[0].name}"... (simulation)`, 'info');
                    simulateUpload();
                }
            });
        }

        form.addEventListener('submit', e => {
            e.preventDefault();
            saveDraft();
            LHData.toast('Draft saved!', 'success');
        });

        document.getElementById('submit-for-review-btn').addEventListener('click', () => {
            saveDraft();
            if (!draftData.title || !draftData.category) {
                LHData.toast('Please fill in at least the title and category fields.', 'error');
                return;
            }
            const content = LHData.submitContent({
                ...draftData,
                quiz: quizQuestions,
                corporateId: currentUser.id,
                corporateName: currentUser.companyName || currentUser.name,
            });
            LHData.toast('Your content has been submitted for admin approval! ✅', 'success');
            pendingContentId = content.id;
            // Reset draft
            draftData = {};
            form.reset();
            quizQuestions = [];
            // Switch to contents tab
            setTimeout(() => {
                document.querySelector('[data-section="contents"]').click();
            }, 1200);
        });
    }

    function saveDraft() {
        const lessons = (document.getElementById('up-lessons').value || '').split('\n')
            .filter(l => l.trim())
            .map((l, i) => {
                const parts = l.split('|');
                return { id: 'l' + (i + 1), title: parts[0].trim(), duration: '—', videoUrl: (parts[1] || '').trim() };
            });
        const whatLearn = (document.getElementById('up-what-learn').value || '').split('\n').map(l => l.trim()).filter(Boolean);
        draftData = {
            title: document.getElementById('up-title').value.trim(),
            category: document.getElementById('up-category').value,
            price: parseFloat(document.getElementById('up-price').value) || 0,
            oldPrice: parseFloat(document.getElementById('up-old-price').value) || 0,
            description: document.getElementById('up-description').value.trim(),
            whatLearn,
            lessons,
            videoUrl: document.getElementById('up-video-url').value.trim(),
            emoji: document.getElementById('up-emoji').value.trim() || '🎓',
        };
    }

    function simulateUpload() {
        const progressWrap = document.getElementById('upload-progress');
        const progressBar = document.getElementById('upload-progress-bar');
        if (!progressWrap || !progressBar) return;
        progressWrap.classList.remove('hidden');
        progressBar.style.width = '0%';
        let pct = 0;
        const iv = setInterval(() => {
            pct += Math.random() * 15;
            if (pct >= 100) { pct = 100; clearInterval(iv); LHData.toast('Video link saved!', 'success'); }
            progressBar.style.width = pct + '%';
        }, 200);
    }

    /* ---- QUIZ BUILDER ---- */
    function setupQuizBuilder() {
        const addBtn = document.getElementById('add-question-btn');
        if (addBtn) addBtn.addEventListener('click', addQuestion);
        const saveBtn = document.getElementById('save-quiz-btn');
        if (saveBtn) saveBtn.addEventListener('click', saveQuiz);
    }

    function populateQuizCourseSelect() {
        const sel = document.getElementById('quiz-course-select');
        if (!sel) return;
        const myCourses = LHData.getPendingContent().filter(c => c.corporateId === currentUser.id);
        sel.innerHTML = '<option value="">— Select a course —</option>' + myCourses.map(c => `<option value="${c.id}">${c.title}</option>`).join('');
    }

    function addQuestion() {
        const container = document.getElementById('quiz-questions-list');
        if (!container) return;
        const idx = quizQuestions.length;
        quizQuestions.push({ q: '', type: 'mc', opts: ['', '', '', ''], ans: 0 });

        const el = document.createElement('div');
        el.className = 'quiz-question-card';
        el.dataset.idx = idx;
        el.innerHTML = `
            <div class="quiz-q-header">
                <span class="quiz-q-num">Question ${idx + 1}</span>
                <div class="flex gap-2">
                    <select class="form-input quiz-type-sel" style="width:160px">
                        <option value="mc">Multiple Choice</option>
                        <option value="tf">True / False</option>
                        <option value="fill">Fill in the Blank</option>
                    </select>
                    <button class="btn btn-ghost btn-sm quiz-del-btn" title="Delete Question"><i class="fas fa-trash" style="color:var(--danger)"></i></button>
                </div>
            </div>
            <input type="text" class="form-input mt-3 quiz-q-text" placeholder="Enter question text...">
            <div class="quiz-options mt-3">
                ${[0, 1, 2, 3].map(i => `
                    <div class="quiz-opt-row">
                        <input type="radio" name="ans_${idx}" value="${i}"> 
                        <input type="text" class="form-input quiz-opt-input" placeholder="Option ${String.fromCharCode(65 + i)}">
                    </div>
                `).join('')}
            </div>
        `;
        container.appendChild(el);

        // Delete button
        el.querySelector('.quiz-del-btn').addEventListener('click', () => {
            el.remove();
            quizQuestions.splice(idx, 1);
            // Renumber
            document.querySelectorAll('.quiz-question-card').forEach((c, i) => {
                c.querySelector('.quiz-q-num').textContent = 'Question ' + (i + 1);
            });
        });

        // Type change
        el.querySelector('.quiz-type-sel').addEventListener('change', function () {
            const type = this.value;
            const optsEl = el.querySelector('.quiz-options');
            if (type === 'tf') {
                optsEl.innerHTML = `
                    <div class="quiz-opt-row"><input type="radio" name="ans_${idx}" value="true"> <span>True</span></div>
                    <div class="quiz-opt-row"><input type="radio" name="ans_${idx}" value="false"> <span>False</span></div>
                `;
            } else if (type === 'fill') {
                optsEl.innerHTML = `<input type="text" class="form-input quiz-fill-ans" placeholder="Correct answer...">`;
            } else {
                optsEl.innerHTML = [0, 1, 2, 3].map(i => `
                    <div class="quiz-opt-row">
                        <input type="radio" name="ans_${idx}" value="${i}"> 
                        <input type="text" class="form-input quiz-opt-input" placeholder="Option ${String.fromCharCode(65 + i)}">
                    </div>
                `).join('');
            }
        });
    }

    function saveQuiz() {
        const courseId = document.getElementById('quiz-course-select').value;
        if (!courseId) { LHData.toast('Please select a course.', 'error'); return; }
        // Collect questions
        const cards = document.querySelectorAll('.quiz-question-card');
        const questions = [];
        cards.forEach(card => {
            const type = card.querySelector('.quiz-type-sel').value;
            const q = card.querySelector('.quiz-q-text').value.trim();
            if (!q) return;
            if (type === 'mc') {
                const opts = [...card.querySelectorAll('.quiz-opt-input')].map(i => i.value.trim());
                const ansEl = card.querySelector('input[type=radio]:checked');
                questions.push({ q, type: 'mc', opts, ans: ansEl ? parseInt(ansEl.value) : 0 });
            } else if (type === 'tf') {
                const ansEl = card.querySelector('input[type=radio]:checked');
                questions.push({ q, type: 'tf', ans: ansEl ? ansEl.value === 'true' : true });
            } else {
                const ans = card.querySelector('.quiz-fill-ans')?.value.trim() || '';
                questions.push({ q, type: 'fill', ans });
            }
        });
        // Save to pending content
        const all = LHData.getPendingContent();
        const item = all.find(c => c.id === courseId);
        if (item) {
            item.quiz = questions;
            localStorage.setItem('lh_pending_content', JSON.stringify(all));
            LHData.toast(`${questions.length} questions saved!`, 'success');
        } else {
            quizQuestions = questions;
            LHData.toast('Questions added to draft. Save the course first.', 'info');
        }
    }

    /* ---- CERTIFICATE ---- */
    function setupCertificate() {
        document.querySelectorAll('.cert-theme-option').forEach(opt => {
            opt.addEventListener('click', () => {
                document.querySelectorAll('.cert-theme-option').forEach(o => o.classList.remove('active'));
                opt.classList.add('active');
                certGradient = opt.dataset.gradient;
            });
        });

        const saveBtn = document.getElementById('save-cert-btn');
        if (saveBtn) saveBtn.addEventListener('click', () => {
            LHData.toast('Certificate settings saved!', 'success');
        });
    }

    function populateCertCourseSelect() {
        const sel = document.getElementById('cert-course-select');
        if (!sel) return;
        const myCourses = LHData.getPendingContent().filter(c => c.corporateId === currentUser.id);
        sel.innerHTML = '<option value="">— Select a course —</option>' + myCourses.map(c => `<option value="${c.id}">${c.title}</option>`).join('');
    }

    /* ---- CONTENTS ---- */
    function setupContents() {
        const refreshBtn = document.getElementById('contents-refresh-btn');
        if (refreshBtn) refreshBtn.addEventListener('click', renderContents);
        const filterSel = document.getElementById('contents-filter-status');
        if (filterSel) filterSel.addEventListener('change', renderContents);
    }

    function renderContents() {
        const statusFilter = document.getElementById('contents-filter-status')?.value || '';
        let items = LHData.getPendingContent().filter(c => c.corporateId === currentUser.id);
        if (statusFilter) items = items.filter(c => c.status === statusFilter);
        items.sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));

        const container = document.getElementById('contents-list');
        if (!container) return;
        if (items.length === 0) {
            container.innerHTML = `<div class="empty-state"><i class="fas fa-inbox"></i><p>No content matches this filter.</p></div>`;
            return;
        }
        container.innerHTML = items.map(item => `
            <div class="content-item-card">
                <div class="content-item-thumb" style="background:${item.gradient || 'linear-gradient(135deg,#4263eb,#3b82f6)'}">
                    <span class="content-item-emoji">${item.emoji || '🎓'}</span>
                </div>
                <div class="content-item-body">
                    <div class="content-item-title">${item.title}</div>
                    <div class="content-item-meta">
                        <span><i class="fas fa-tag"></i> ${item.category}</span>
                        <span><i class="fas fa-book"></i> ${(item.lessons || []).length} lessons</span>
                        <span><i class="fas fa-question-circle"></i> ${(item.quiz || []).length} questions</span>
                        <span><i class="fas fa-calendar"></i> ${fmtDate(item.submittedAt)}</span>
                    </div>
                    ${item.status === 'rejected' && item.rejectReason ? `<div class="reject-reason-box"><i class="fas fa-exclamation-triangle"></i> <strong>Rejection Reason:</strong> ${item.rejectReason}</div>` : ''}
                </div>
                <div class="content-item-status">
                    ${statusBadge(item.status)}
                </div>
            </div>
        `).join('');
    }

    /* ---- HELPERS ---- */
    function statusBadge(status) {
        const map = {
            pending: '<span class="status-badge pending"><i class="fas fa-clock"></i> Pending</span>',
            approved: '<span class="status-badge approved"><i class="fas fa-check-circle"></i> Approved</span>',
            rejected: '<span class="status-badge rejected"><i class="fas fa-times-circle"></i> Rejected</span>',
        };
        return map[status] || '';
    }

    function fmtDate(iso) {
        if (!iso) return '—';
        return new Date(iso).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' });
    }

    document.addEventListener('DOMContentLoaded', init);
})();

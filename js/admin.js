/* ============= admin.js — Admin Panel Logic ============= */
(function () {
    'use strict';

    let currentUser = null;
    let rejectTargetId = null;
    let editedCourses = {}; // track seed-course overrides in memory too

    function init() {
        LHAuth.requireRole('admin');
        currentUser = LHAuth.getCurrentUser();

        const userInfoEl = document.getElementById('admin-user-info');
        if (userInfoEl) {
            userInfoEl.innerHTML = `
                <div class="panel-avatar" style="background:linear-gradient(135deg,#ef4444,#f59e0b)">${currentUser.name[0].toUpperCase()}</div>
                <div>
                    <div style="font-weight:600;font-size:.875rem">${currentUser.name}</div>
                    <div style="font-size:.75rem;opacity:.6">Administrator</div>
                </div>
            `;
        }

        document.getElementById('admin-logout').addEventListener('click', LHAuth.logout);

        // Sidebar navigation
        document.querySelectorAll('.panel-nav-item').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.panel-nav-item').forEach(b => b.classList.remove('active'));
                document.querySelectorAll('.panel-section').forEach(s => s.classList.remove('active'));
                btn.classList.add('active');
                const sec = document.getElementById('section-' + btn.dataset.section);
                if (sec) sec.classList.add('active');
                if (btn.dataset.section === 'dashboard') renderDashboard();
                if (btn.dataset.section === 'approval') renderApproval();
                if (btn.dataset.section === 'courses') renderCourses();
                if (btn.dataset.section === 'users') renderUsers();
            });
        });

        // Sidebar toggle mobile
        const toggle = document.getElementById('sidebar-toggle');
        const sidebar = document.getElementById('panel-sidebar');
        if (toggle) toggle.addEventListener('click', () => sidebar.classList.toggle('open'));

        // Approval filters
        document.getElementById('apply-filters-btn').addEventListener('click', renderApproval);
        document.getElementById('clear-filters-btn').addEventListener('click', () => {
            document.getElementById('filter-status').value = '';
            document.getElementById('filter-category').value = '';
            document.getElementById('filter-company').value = '';
            renderApproval();
        });

        // Course search/filter
        document.getElementById('course-search').addEventListener('input', renderCourses);
        document.getElementById('course-cat-filter').addEventListener('change', renderCourses);
        document.getElementById('courses-refresh-btn').addEventListener('click', renderCourses);

        // User search
        document.getElementById('user-search').addEventListener('input', renderUsers);
        document.getElementById('user-role-filter').addEventListener('change', renderUsers);

        // Edit modal
        document.getElementById('modal-close-btn').addEventListener('click', closeEditModal);
        document.getElementById('modal-cancel-btn').addEventListener('click', closeEditModal);
        document.getElementById('edit-course-form').addEventListener('submit', submitEditCourse);
        document.getElementById('edit-modal').addEventListener('click', e => { if (e.target === e.currentTarget) closeEditModal(); });

        // Reject modal
        document.getElementById('reject-modal-close').addEventListener('click', closeRejectModal);
        document.getElementById('reject-cancel-btn').addEventListener('click', closeRejectModal);
        document.getElementById('reject-confirm-btn').addEventListener('click', confirmReject);
        document.getElementById('reject-modal').addEventListener('click', e => { if (e.target === e.currentTarget) closeRejectModal(); });

        renderDashboard();
        updatePendingBadge();
    }

    function updatePendingBadge() {
        const count = LHData.getPendingContent({ status: 'pending' }).length;
        const badge = document.getElementById('pending-badge');
        if (badge) { badge.textContent = count; badge.style.display = count > 0 ? '' : 'none'; }
    }

    /* ---- DASHBOARD ---- */
    function renderDashboard() {
        const allContent = LHData.getPendingContent();
        const pending = allContent.filter(c => c.status === 'pending').length;
        const approved = allContent.filter(c => c.status === 'approved').length;
        const allCourses = LHData.getAllCourses();
        const allUsers = LHAuth.getUsers();

        const statsEl = document.getElementById('admin-stats');
        if (statsEl) {
            statsEl.innerHTML = `
                <div class="panel-stat-card">
                    <div class="panel-stat-icon" style="background:var(--info-soft);color:var(--info)"><i class="fas fa-book"></i></div>
                    <div class="panel-stat-val">${allCourses.length}</div>
                    <div class="panel-stat-label">Total Courses</div>
                </div>
                <div class="panel-stat-card">
                    <div class="panel-stat-icon" style="background:var(--warning-soft);color:var(--warning)"><i class="fas fa-clock"></i></div>
                    <div class="panel-stat-val">${pending}</div>
                    <div class="panel-stat-label">Awaiting Approval</div>
                </div>
                <div class="panel-stat-card">
                    <div class="panel-stat-icon" style="background:var(--success-soft);color:var(--success)"><i class="fas fa-check-circle"></i></div>
                    <div class="panel-stat-val">${approved}</div>
                    <div class="panel-stat-label">Approved Content</div>
                </div>
                <div class="panel-stat-card">
                    <div class="panel-stat-icon" style="background:var(--accent-soft);color:var(--accent-500)"><i class="fas fa-users"></i></div>
                    <div class="panel-stat-val">${allUsers.length}</div>
                    <div class="panel-stat-label">Registered Users</div>
                </div>
            `;
        }

        // Pending preview
        const previewEl = document.getElementById('admin-pending-preview');
        if (previewEl) {
            const pend = LHData.getPendingContent({ status: 'pending' }).slice(0, 3);
            if (pend.length === 0) {
                previewEl.innerHTML = '<p style="color:var(--text-muted);font-size:.875rem">No pending content.</p>';
            } else {
                previewEl.innerHTML = pend.map(c => `
                    <div class="content-row">
                        <span class="content-row-emoji">${c.emoji || '🎓'}</span>
                        <div class="content-row-info">
                            <div class="content-row-title">${c.title}</div>
                            <div class="content-row-meta">${c.corporateName} • ${c.category}</div>
                        </div>
                        <span class="status-badge pending" style="white-space:nowrap"><i class="fas fa-clock"></i> Pending</span>
                    </div>
                `).join('');
            }
        }

        // Summary
        const sumEl = document.getElementById('admin-summary');
        if (sumEl) {
            const corporates = allUsers.filter(u => u.role === 'corporate').length;
            const users = allUsers.filter(u => u.role === 'user').length;
            sumEl.innerHTML = `
                <div class="summary-row"><span>User count</span><strong>${users}</strong></div>
                <div class="summary-row"><span>Corporate accounts</span><strong>${corporates}</strong></div>
                <div class="summary-row"><span>Total submissions</span><strong>${allContent.length}</strong></div>
                <div class="summary-row"><span>Approved content</span><strong>${approved}</strong></div>
                <div class="summary-row"><span>Total courses</span><strong>${allCourses.length}</strong></div>
            `;
        }
    }

    /* ---- APPROVAL QUEUE ---- */
    function renderApproval() {
        const filter = {
            status: document.getElementById('filter-status').value || undefined,
            category: document.getElementById('filter-category').value || undefined,
            corporateName: document.getElementById('filter-company').value || undefined,
        };
        // Clean undefined
        Object.keys(filter).forEach(k => filter[k] === undefined && delete filter[k]);

        let items = LHData.getPendingContent(Object.keys(filter).length ? filter : null);
        items = [...items].sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));

        const container = document.getElementById('approval-list');
        if (!container) return;
        if (items.length === 0) {
            container.innerHTML = `<div class="empty-state"><i class="fas fa-check-double" style="color:var(--success)"></i><p>No content matches the filter.</p></div>`;
            return;
        }

        container.innerHTML = items.map(item => `
            <div class="approval-card" data-id="${item.id}">
                <div class="approval-card-thumb" style="background:${item.gradient || 'linear-gradient(135deg,#6c2bff,#3b82f6)'}">
                    <span>${item.emoji || '🎓'}</span>
                </div>
                <div class="approval-card-body">
                    <div class="approval-card-header">
                        <div>
                            <div class="approval-card-title">${item.title}</div>
                            <div class="approval-card-meta">
                                <span><i class="fas fa-building"></i> ${item.corporateName}</span>
                                <span><i class="fas fa-tag"></i> ${item.category}</span>
                                <span><i class="fas fa-book"></i> ${(item.lessons || []).length} lessons</span>
                                <span><i class="fas fa-question-circle"></i> ${(item.quiz || []).length} quiz questions</span>
                                <span><i class="fas fa-calendar"></i> ${fmtDate(item.submittedAt)}</span>
                            </div>
                        </div>
                        ${statusBadge(item.status)}
                    </div>
                    ${item.description ? `<p class="approval-card-desc">${item.description.slice(0, 150)}${item.description.length > 150 ? '...' : ''}</p>` : ''}
                    ${item.status === 'rejected' && item.rejectReason ? `<div class="reject-reason-box"><i class="fas fa-exclamation-triangle"></i> <strong>Rejection Reason:</strong> ${item.rejectReason}</div>` : ''}
                    ${item.status === 'pending' ? `
                        <div class="approval-actions flex gap-3 mt-4">
                            <button class="btn btn-success btn-sm approve-btn" data-id="${item.id}"><i class="fas fa-check"></i> Approve</button>
                             <button class="btn btn-danger btn-sm reject-btn" data-id="${item.id}"><i class="fas fa-times"></i> Reject</button>
                        </div>
                    ` : ''}
                </div>
            </div>
        `).join('');

        // Bind buttons
        container.querySelectorAll('.approve-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.dataset.id;
                LHData.approveContent(id);
                LHData.toast('Content approved! Added to the catalog. ✅', 'success');
                updatePendingBadge();
                renderApproval();
            });
        });
        container.querySelectorAll('.reject-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                rejectTargetId = btn.dataset.id;
                document.getElementById('reject-reason').value = '';
                document.getElementById('reject-modal').classList.remove('hidden');
            });
        });
    }

    function confirmReject() {
        if (!rejectTargetId) return;
        const reason = document.getElementById('reject-reason').value.trim();
        LHData.rejectContent(rejectTargetId, reason);
        LHData.toast('Content rejected.', 'warning');
        rejectTargetId = null;
        closeRejectModal();
        updatePendingBadge();
        renderApproval();
    }

    function closeRejectModal() {
        document.getElementById('reject-modal').classList.add('hidden');
        rejectTargetId = null;
    }

    /* ---- MANAGE COURSES ---- */
    function renderCourses() {
        const searchQ = (document.getElementById('course-search').value || '').toLowerCase();
        const catFilter = document.getElementById('course-cat-filter').value;

        let courses = LHData.getAllCourses();
        // Apply any stored edits for seed courses
        const edited = JSON.parse(localStorage.getItem('lh_edited_courses') || '{}');
        courses = courses.map(c => edited[c.id] ? { ...c, ...edited[c.id] } : c);
        // Apply deletions
        const deleted = JSON.parse(localStorage.getItem('lh_deleted_courses') || '[]');
        courses = courses.filter(c => !deleted.includes(c.id));

        if (searchQ) courses = courses.filter(c => c.title.toLowerCase().includes(searchQ) || c.instructor.toLowerCase().includes(searchQ));
        if (catFilter) courses = courses.filter(c => c.category === catFilter);

        const tbody = document.getElementById('courses-tbody');
        if (!tbody) return;
        if (courses.length === 0) {
            tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;padding:40px;color:var(--text-muted)">No courses found.</td></tr>`;
            return;
        }
        tbody.innerHTML = courses.map(c => `
            <tr>
                <td>
                    <div class="table-course-cell">
                        <div class="table-course-thumb" style="background:${c.gradient || 'linear-gradient(135deg,#6c2bff,#3b82f6)'}">${c.emoji || '🎓'}</div>
                        <div>
                            <div class="table-course-title">${c.title}</div>
                            <div class="table-course-sub">${c.lessons ? c.lessons.length : 0} lessons</div>
                        </div>
                    </div>
                </td>
                <td><span class="badge badge-outline">${c.category}</span></td>
                <td style="color:var(--text-secondary)">${c.instructor}</td>
                <td style="font-weight:600">$${c.price}</td>
                <td>${c.isCorporate ? '<span class="status-badge approved" style="font-size:.7rem">Corporate</span>' : '<span class="badge badge-accent" style="font-size:.7rem">Platform</span>'}</td>
                <td style="text-align:right">
                    <div class="flex gap-2" style="justify-content:flex-end">
                        <button class="btn btn-outline btn-sm edit-course-btn" data-id="${c.id}" title="Edit"><i class="fas fa-edit"></i></button>
                         <button class="btn btn-sm btn-danger-soft delete-course-btn" data-id="${c.id}" title="Delete"><i class="fas fa-trash"></i></button>
                    </div>
                </td>
            </tr>
        `).join('');

        tbody.querySelectorAll('.edit-course-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.dataset.id;
                openEditModal(id, courses);
            });
        });

        tbody.querySelectorAll('.delete-course-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.dataset.id;
                const course = courses.find(c => c.id === id);
                if (confirm(`Are you sure you want to delete the course "${course?.title}"?`)) {
                    LHData.deleteCourse(id);
                    LHData.toast('Course deleted.', 'success');
                    renderCourses();
                    renderDashboard();
                }
            });
        });
    }

    function openEditModal(id, courses) {
        const course = courses.find(c => c.id === id);
        if (!course) return;
        document.getElementById('edit-course-id').value = id;
        document.getElementById('edit-title').value = course.title;
        document.getElementById('edit-category').value = course.category;
        document.getElementById('edit-price').value = course.price;
        document.getElementById('edit-instructor').value = course.instructor;
        document.getElementById('edit-description').value = course.description || '';
        document.getElementById('edit-modal').classList.remove('hidden');
    }

    function closeEditModal() {
        document.getElementById('edit-modal').classList.add('hidden');
    }

    function submitEditCourse(e) {
        e.preventDefault();
        const id = document.getElementById('edit-course-id').value;
        const fields = {
            title: document.getElementById('edit-title').value.trim(),
            category: document.getElementById('edit-category').value,
            price: parseFloat(document.getElementById('edit-price').value) || 0,
            instructor: document.getElementById('edit-instructor').value.trim(),
            description: document.getElementById('edit-description').value.trim(),
        };
        LHData.updateCourse(id, fields);
        LHData.toast('Course updated!', 'success');
        closeEditModal();
        renderCourses();
    }

    /* ---- USERS ---- */
    function renderUsers() {
        const search = (document.getElementById('user-search').value || '').toLowerCase();
        const roleFilter = document.getElementById('user-role-filter').value;

        let users = LHAuth.getUsers();
        if (search) users = users.filter(u => (u.name || '').toLowerCase().includes(search) || (u.email || '').toLowerCase().includes(search));
        if (roleFilter) users = users.filter(u => u.role === roleFilter);

        const tbody = document.getElementById('users-tbody');
        if (!tbody) return;
        if (users.length === 0) {
            tbody.innerHTML = `<tr><td colspan="4" style="text-align:center;padding:40px;color:var(--text-muted)">No users found.</td></tr>`;
            return;
        }
        tbody.innerHTML = users.map(u => `
            <tr>
                <td>
                    <div class="flex gap-3 items-center">
                        <div class="panel-avatar" style="background:${LHAuth.avatarColor(u.name)};width:36px;height:36px;font-size:.875rem;flex-shrink:0">${(u.name || 'U')[0].toUpperCase()}</div>
                        <div style="font-weight:600">${u.name || '—'}</div>
                    </div>
                </td>
                <td style="color:var(--text-secondary)">${u.email}</td>
                <td>${roleBadge(u.role || 'user')}</td>
                <td style="color:var(--text-muted)">${u.createdAt ? fmtDate(u.createdAt) : '—'}</td>
            </tr>
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

    function roleBadge(role) {
        const map = {
        user: '<span class="badge" style="background:var(--accent-soft);color:var(--accent-500)">User</span>',
            corporate: '<span class="badge" style="background:var(--success-soft);color:var(--success)">Corporate</span>',
            admin: '<span class="badge" style="background:var(--danger-soft);color:var(--danger)">Admin</span>',
        };
        return map[role] || role;
    }

    function fmtDate(iso) {
        if (!iso) return '—';
        return new Date(iso).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' });
    }

    document.addEventListener('DOMContentLoaded', init);
})();

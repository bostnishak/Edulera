/* course-detail.js */
(function () {
    document.addEventListener('DOMContentLoaded', function () {
        LHAuth.initNavbar();
        const user = LHAuth.getCurrentUser();
        const params = new URLSearchParams(location.search);
        const courseId = params.get('id');
        const course = LHData.getCourse(courseId);
        if (!course) { location.href = 'catalog.html'; return; }

        // Fill detail hero
        const thumbEl = LHData.qs('detail-thumb');
        if (thumbEl) { thumbEl.style.background = course.gradient; thumbEl.textContent = course.emoji; thumbEl.style.fontSize = '5rem'; thumbEl.style.display = 'flex'; thumbEl.style.alignItems = 'center'; thumbEl.style.justifyContent = 'center'; }
        setText('detail-title', course.title);
        setText('detail-cat', course.category);
        setText('detail-instructor', course.instructor);
        setText('detail-desc', course.description);
        setText('detail-price', '$' + course.price);
        setText('detail-old-price', '$' + course.oldPrice);
        setText('detail-students', course.students.toLocaleString('en') + ' students');
        setText('detail-lessons-count', course.lessons.length + ' lessons');
        const starsEl = LHData.qs('detail-stars');
        if (starsEl) starsEl.innerHTML = `<span class="stars">${LHData.starHTML(course.rating)}</span> <span class="rating-val">${course.rating}</span> <span class="rating-count">(${course.ratingCount.toLocaleString('en')} ratings)</span>`;

        // What you'll learn
        const wlEl = LHData.qs('what-learn-list');
        if (wlEl) wlEl.innerHTML = course.whatLearn.map(w => `<li><i class="fas fa-check-circle"></i>${w}</li>`).join('');

        // Curriculum
        const enrolled = user && LHData.isEnrolled(user.id, courseId);
        const currEl = LHData.qs('curriculum-list');
        if (currEl) {
            currEl.innerHTML = course.lessons.map((l, i) => {
                const locked = !enrolled && i > 0;
                return `<div class="lesson-row${locked ? ' locked' : ''}">
          <span class="lesson-num">${i + 1}</span>
          <span class="lesson-title">${l.title}</span>
          <span class="lesson-duration">${l.duration}</span>
          ${locked ? '<i class="fas fa-lock lesson-lock"></i>' : '<i class="fas fa-play-circle lesson-lock" style="color:var(--accent-400)"></i>'}
        </div>`;
            }).join('');
        }

        // CTA button
        const buyBtn = LHData.qs('buy-btn');
        const goBtn = LHData.qs('go-btn');
        if (enrolled) {
            if (buyBtn) buyBtn.classList.add('hidden');
            if (goBtn) { goBtn.classList.remove('hidden'); goBtn.onclick = () => location.href = `player.html?id=${courseId}`; }
        } else {
            if (buyBtn) buyBtn.onclick = () => {
                if (!user) { location.href = `login.html?redirect=${encodeURIComponent(location.href)}`; return; }
                location.href = `checkout.html?id=${courseId}`;
            };
            if (goBtn) goBtn.classList.add('hidden');
        }

        function setText(id, val) { const el = LHData.qs(id); if (el) el.textContent = val; }
    });
})();

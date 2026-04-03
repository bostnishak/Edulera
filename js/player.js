/* ============= player.js — Course Lesson Player ============= */
(function () {
    document.addEventListener('DOMContentLoaded', function () {
        LHAuth.initNavbar();
        LHAuth.requireAuth();
        const user = LHAuth.getCurrentUser();
        const params = new URLSearchParams(location.search);
        const courseId = params.get('id');
        const course = LHData.getCourse(courseId);
        if (!course || !LHData.isEnrolled(user.id, courseId)) { location.href = 'catalog.html'; return; }

        let progress = LHData.getProgress(user.id, courseId);
        let currentLessonIdx = parseInt(params.get('lesson') || '0') || 0;
        if (currentLessonIdx >= course.lessons.length) currentLessonIdx = 0;

        // Set course name in navbar
        const courseNameEl = document.getElementById('player-course-name');
        if (courseNameEl) courseNameEl.textContent = course.title;

        // Lesson content descriptions (mock)
        const lessonDescs = [
            'In this lesson, you will learn the fundamentals of the topic and gain familiarity with key concepts.',
            'We put theory into practice and reinforce it with real-world examples.',
            'Advanced topics and best practices are covered in this lesson.',
            'You will apply what you have learned step by step throughout the project development process.',
            'We explore debugging techniques and optimization methods.',
            'In this lesson, we review what was covered and plan the next steps.',
            'We work through exercises based on real-world scenarios.',
            'You will test everything learned throughout the course with a comprehensive project.',
        ];

        function renderSidebar() {
            const list = document.getElementById('lesson-list');
            if (!list) return;
            const total = course.lessons.length;
            const done = progress.completedLessons.length;
            const pct = total > 0 ? Math.round((done / total) * 100) : 0;

            // Update progress in sidebar
            const pb = document.getElementById('sidebar-progress-bar');
            const pt = document.getElementById('sidebar-progress-text');
            const pp = document.getElementById('sidebar-progress-pct');
            if (pb) pb.style.width = pct + '%';
            if (pt) pt.textContent = `${done}/${total}`;
            if (pp) pp.textContent = `${pct}% Complete`;

            const stTitle = document.getElementById('sidebar-course-title');
            if (stTitle) stTitle.textContent = course.title;

            list.innerHTML = course.lessons.map((l, i) => {
                const isDone = progress.completedLessons.includes(l.id);
                const isActive = i === currentLessonIdx;
                return `<div class="lesson-item${isActive ? ' active' : ''}${isDone ? ' completed' : ''}" onclick="LHPlayer.goTo(${i})">
                    <div class="lesson-num">${isDone ? '<i class="fas fa-check" style="font-size:.65rem"></i>' : (i + 1)}</div>
                    <div class="lesson-info">
                        <div class="lesson-name">${l.title}</div>
                        <div class="lesson-duration"><i class="fas fa-clock" style="opacity:.6;margin-right:3px"></i>${l.duration}</div>
                    </div>
                    ${isDone ? '<i class="fas fa-check-circle" style="color:var(--success);font-size:.8rem;flex-shrink:0"></i>' : ''}
                </div>`;
            }).join('');

            // Show quiz/cert buttons when all done
            const allDone = done === total;
            const quizBtn = document.getElementById('btn-go-quiz');
            const certBtn = document.getElementById('btn-part-cert');
            if (quizBtn) quizBtn.style.display = allDone ? '' : 'none';
            if (certBtn) certBtn.style.display = allDone ? '' : 'none';
        }

        function renderLesson() {
            const lesson = course.lessons[currentLessonIdx];
            const desc = lessonDescs[currentLessonIdx % lessonDescs.length];

            // Main content
            setText('lesson-title', lesson.title);
            setText('lesson-desc', `Lesson ${currentLessonIdx + 1} of the ${course.title} course: ${lesson.title}. ${desc}`);
            setText('bc-title', course.title);
            setText('bc-lesson', lesson.title);
            setText('video-title-overlay', lesson.title);
            setText('video-duration-overlay', lesson.duration);

            const badge = document.getElementById('lesson-number-badge');
            if (badge) badge.textContent = `Lesson ${currentLessonIdx + 1} / ${course.lessons.length}`;

            // Complete button
            const completeBtn = document.getElementById('btn-complete');
            const isDone = progress.completedLessons.includes(lesson.id);
            if (completeBtn) {
                if (isDone) {
                    completeBtn.innerHTML = '<i class="fas fa-check-circle"></i> Completed';
                    completeBtn.style.background = 'var(--success)';
                    completeBtn.style.borderColor = 'var(--success)';
                } else {
                    completeBtn.innerHTML = '<i class="fas fa-check"></i> Mark as Complete';
                    completeBtn.style.background = '';
                    completeBtn.style.borderColor = '';
                }
            }

            // Nav buttons
            const prevBtn = document.getElementById('btn-prev');
            const nextBtn = document.getElementById('btn-next');
            if (prevBtn) prevBtn.disabled = currentLessonIdx === 0;
            if (nextBtn) {
                if (currentLessonIdx === course.lessons.length - 1) {
                    nextBtn.innerHTML = 'Go to Quiz <i class="fas fa-arrow-right"></i>';
                } else {
                    nextBtn.innerHTML = 'Next Lesson <i class="fas fa-arrow-right"></i>';
                }
            }

            // Video fake play
            const vp = document.getElementById('video-progress');
            if (vp) { vp.style.width = '0%'; }
        }

        // Complete button
        const completeBtn = document.getElementById('btn-complete');
        if (completeBtn) {
            completeBtn.addEventListener('click', () => {
                const lesson = course.lessons[currentLessonIdx];
                if (!progress.completedLessons.includes(lesson.id)) {
                    progress.completedLessons.push(lesson.id);
                    LHData.saveProgress(user.id, courseId, progress);
                    LHData.toast('Lesson completed! 🎉', 'success');
                    // Participation cert when all done
                    if (progress.completedLessons.length === course.lessons.length && !progress.certEarned) {
                        LHData.addCert({
                            userId: user.id, courseId,
                            userName: user.name, courseName: course.title,
                            instructorName: course.instructor,
                            type: 'participation'
                        });
                        progress.certEarned = true;
                        LHData.saveProgress(user.id, courseId, progress);
                        LHData.toast('🎓 Your Completion Certificate is ready! You can view it under Profile > My Certificates.', 'success');
                    }
                }
                renderSidebar();
                renderLesson();
            });
        }

        // Prev / Next
        const prevBtn = document.getElementById('btn-prev');
        const nextBtn = document.getElementById('btn-next');
        if (prevBtn) prevBtn.addEventListener('click', () => {
            if (currentLessonIdx > 0) { currentLessonIdx--; refresh(); }
        });
        if (nextBtn) nextBtn.addEventListener('click', () => {
            if (currentLessonIdx < course.lessons.length - 1) { currentLessonIdx++; refresh(); }
            else { location.href = `quiz.html?id=${courseId}`; }
        });

        // Quiz button in sidebar
        const quizBtn = document.getElementById('btn-go-quiz');
        if (quizBtn) quizBtn.addEventListener('click', () => location.href = `quiz.html?id=${courseId}`);

        // Participation cert button in sidebar
        const partCertBtn = document.getElementById('btn-part-cert');
        if (partCertBtn) partCertBtn.addEventListener('click', () => {
            const certs = LHData.getCerts(user.id);
            const cert = certs.find(c => c.courseId === courseId && c.type === 'participation');
            if (cert) location.href = `certificate.html?id=${cert.id}`;
            else LHData.toast('Complete all lessons to earn your Completion Certificate.', 'info');
        });

        // Video fake play animation
        const playBtn = document.getElementById('video-play-btn');
        if (playBtn) {
            playBtn.addEventListener('click', () => {
                playBtn.innerHTML = '<i class="fas fa-pause"></i>';
                const vp = document.getElementById('video-progress');
                let pct = 0;
                const interval = setInterval(() => {
                    pct += 0.5;
                    if (vp) vp.style.width = pct + '%';
                    if (pct >= 100) {
                        clearInterval(interval);
                        playBtn.innerHTML = '<i class="fas fa-redo"></i>';
                    }
                }, 100);
            });
        }

        function refresh() { renderSidebar(); renderLesson(); }
        function setText(id, val) { const el = document.getElementById(id); if (el) el.textContent = val; }

        refresh();
        window.LHPlayer = { goTo: (i) => { currentLessonIdx = i; refresh(); } };
    });
})();

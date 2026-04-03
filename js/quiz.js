/* ============= quiz.js — Quiz Engine ============= */
(function () {
    document.addEventListener('DOMContentLoaded', function () {
        LHAuth.initNavbar();
        LHAuth.requireAuth();
        const user = LHAuth.getCurrentUser();
        const params = new URLSearchParams(location.search);
        const courseId = params.get('id');
        const course = LHData.getCourse(courseId);
        if (!course || !LHData.isEnrolled(user.id, courseId)) { location.href = 'catalog.html'; return; }

        const questions = course.quiz;
        let answers = new Array(questions.length).fill(null);
        let timerSec = 15 * 60;
        let timerInterval = null;
        let finished = false;

        // Set course name
        const courseNameEl = document.getElementById('quiz-course-name');
        if (courseNameEl) courseNameEl.textContent = course.title;

        // Set intro info
        const introTitle = document.getElementById('intro-title');
        const introDesc = document.getElementById('intro-desc');
        if (introTitle) introTitle.textContent = course.title + ' — Course Quiz';
        if (introDesc) introDesc.textContent = `This quiz consists of ${questions.length} questions. You need at least 70% correct answers to pass. You have 15 minutes.`;

        // Start button
        const startBtn = document.getElementById('btn-start-quiz');
        if (startBtn) startBtn.addEventListener('click', startQuiz);

        function startQuiz() {
            document.getElementById('quiz-intro').style.display = 'none';
            document.getElementById('quiz-active').style.display = 'block';
            buildQuestions();
            startTimer();
        }

        function buildQuestions() {
            const container = document.getElementById('questions-container');
            if (!container) return;
            container.innerHTML = questions.map((q, qi) => {
                let optionsHTML = '';
                const letters = ['A', 'B', 'C', 'D', 'E'];
                if (q.type === 'mc') {
                    optionsHTML = `<div class="options-list">${q.opts.map((opt, oi) => `
                        <button class="option-btn" data-qi="${qi}" data-oi="${oi}" onclick="LHQuiz.select(${qi},${oi})">
                            <span class="option-letter">${letters[oi]}</span>
                            <span>${opt}</span>
                        </button>`).join('')}</div>`;
                } else if (q.type === 'tf') {
                    optionsHTML = `<div class="options-list tf-options">${[['True', true], ['False', false]].map(([label, val], i) => `
                        <button class="option-btn" data-qi="${qi}" data-tf="${val}" onclick="LHQuiz.selectTF(${qi},${val})">
                            <span class="option-letter">${i === 0 ? 'T' : 'F'}</span>
                            <span>${label}</span>
                        </button>`).join('')}</div>`;
                } else if (q.type === 'fill') {
                    optionsHTML = `<input class="fill-input" data-qi="${qi}" type="text" placeholder="Type your answer..." oninput="LHQuiz.fill(${qi},this.value)">`;
                }
                return `<div class="question-card" id="qcard-${qi}">
                    <div class="question-num">Question ${qi + 1} / ${questions.length} &nbsp;•&nbsp; ${q.type === 'mc' ? 'Multiple Choice' : q.type === 'tf' ? 'True / False' : 'Fill in the Blank'}</div>
                    <div class="question-text">${q.q}</div>
                    ${optionsHTML}
                </div>`;
            }).join('');

            // Answer count listener
            updateAnsweredCount();
        }

        function updateAnsweredCount() {
            const answered = answers.filter(a => a !== null).length;
            const el = document.getElementById('answered-count');
            if (el) el.textContent = answered;
            const pb = document.getElementById('quiz-progress-bar');
            if (pb) pb.style.width = (answered / questions.length * 100) + '%';

            const warnEl = document.getElementById('submit-warning');
            const unanswered = questions.length - answered;
            if (warnEl) {
                if (unanswered > 0) warnEl.textContent = `${unanswered} question(s) unanswered. Submit anyway?`;
                else warnEl.textContent = 'All questions answered. You can submit the quiz.';
            }
        }

        function startTimer() {
            const display = document.getElementById('timer-display');
            const timerWrap = document.getElementById('quiz-timer');
            timerInterval = setInterval(() => {
                if (finished) return;
                timerSec--;
                const min = String(Math.floor(timerSec / 60)).padStart(2, '0');
                const sec = String(timerSec % 60).padStart(2, '0');
                if (display) display.textContent = `${min}:${sec}`;
                if (timerWrap) {
                    timerWrap.className = 'quiz-timer';
                    if (timerSec < 300) timerWrap.classList.add('warning');
                    if (timerSec < 60) timerWrap.classList.add('danger');
                }
                if (timerSec <= 0) { clearInterval(timerInterval); submitQuiz(); }
            }, 1000);
        }

        function submitQuiz() {
            if (finished) return;
            finished = true;
            clearInterval(timerInterval);

            let correct = 0, empty = 0;
            questions.forEach((q, i) => {
                const a = answers[i];
                if (a === null) { empty++; return; }
                if (q.type === 'mc' && a === q.ans) correct++;
                else if (q.type === 'tf' && a === q.ans) correct++;
                else if (q.type === 'fill' && typeof a === 'string' && a.toLowerCase().trim() === String(q.ans).toLowerCase().trim()) correct++;
            });

            const wrong = questions.length - correct - empty;
            const score = Math.round((correct / questions.length) * 100);
            const passed = score >= 70;

            // Save progress
            const progress = LHData.getProgress(user.id, courseId);
            progress.quizPassed = passed;
            progress.quizScore = score;
            LHData.saveProgress(user.id, courseId, progress);

            if (passed) {
                LHData.addCert({
                    userId: user.id, courseId,
                    userName: user.name, courseName: course.title,
                    instructorName: course.instructor,
                    type: 'achievement', score
                });
            }

            showResult(score, correct, wrong, empty, passed);
        }

        function showResult(score, correct, wrong, empty, passed) {
            document.getElementById('quiz-active').style.display = 'none';
            const resultEl = document.getElementById('quiz-result');
            if (resultEl) resultEl.style.display = 'block';

            // Fill result
            const iconEl = document.getElementById('result-icon');
            const headEl = document.getElementById('result-headline');
            const subEl = document.getElementById('result-sub');
            const scoreEl = document.getElementById('result-score-display');
            const detailEl = document.getElementById('result-score-detail');

            if (passed) {
                if (iconEl) iconEl.textContent = '🏆';
                if (headEl) headEl.textContent = 'Congratulations!';
                if (subEl) subEl.textContent = 'You passed the quiz. Your Achievement Certificate is ready!';
                if (scoreEl) { scoreEl.textContent = score + '%'; scoreEl.className = 'result-score result-pass'; }
                const banner = document.getElementById('cert-earned-banner');
                if (banner) banner.style.display = '';
            } else {
                if (iconEl) iconEl.textContent = '😔';
                if (headEl) headEl.textContent = 'Quiz Failed';
                if (subEl) subEl.textContent = 'The passing score is 70%. Try again!';
                if (scoreEl) { scoreEl.textContent = score + '%'; scoreEl.className = 'result-score result-fail'; }
            }

            if (detailEl) detailEl.textContent = `${correct} correct, ${wrong} wrong, ${empty} unanswered — ${questions.length} questions`;

            const correctEl = document.getElementById('res-correct');
            const wrongEl = document.getElementById('res-wrong');
            const emptyEl = document.getElementById('res-empty');
            if (correctEl) correctEl.textContent = correct;
            if (wrongEl) wrongEl.textContent = wrong;
            if (emptyEl) emptyEl.textContent = empty;

            // Buttons
            const certBtn = document.getElementById('btn-view-cert');
            const retakeBtn = document.getElementById('btn-retake');
            const backBtn = document.getElementById('btn-back-course');
            if (backBtn) backBtn.href = `player.html?id=${courseId}`;

            if (passed && certBtn) {
                certBtn.style.display = '';
                certBtn.addEventListener('click', () => {
                    const certs = LHData.getCerts(user.id);
                    const cert = certs.find(c => c.courseId === courseId && c.type === 'achievement');
                    if (cert) location.href = `certificate.html?id=${cert.id}`;
                });
            }
            if (!passed && retakeBtn) {
                retakeBtn.style.display = '';
                retakeBtn.addEventListener('click', () => location.reload());
            }
        }

        // Submit button
        const submitBtn = document.getElementById('btn-submit-quiz');
        if (submitBtn) submitBtn.addEventListener('click', submitQuiz);

        window.LHQuiz = {
            select: (qi, oi) => {
                answers[qi] = oi;
                // Update UI
                document.querySelectorAll(`.option-btn[data-qi="${qi}"]`).forEach(btn => {
                    btn.classList.remove('selected');
                    if (parseInt(btn.dataset.oi) === oi) btn.classList.add('selected');
                });
                const card = document.getElementById(`qcard-${qi}`);
                if (card) card.classList.add('answered');
                updateAnsweredCount();
            },
            selectTF: (qi, val) => {
                answers[qi] = val === true || val === 'true';
                document.querySelectorAll(`.option-btn[data-qi="${qi}"]`).forEach(btn => {
                    btn.classList.remove('selected');
                    const btnVal = btn.dataset.tf === 'true';
                    if (btnVal === answers[qi]) btn.classList.add('selected');
                });
                const card = document.getElementById(`qcard-${qi}`);
                if (card) card.classList.add('answered');
                updateAnsweredCount();
            },
            fill: (qi, val) => {
                answers[qi] = val || null;
                const card = document.getElementById(`qcard-${qi}`);
                if (card) card.classList.toggle('answered', !!val);
                updateAnsweredCount();
            }
        };
    });
})();

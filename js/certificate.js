/* ============= certificate.js — Certificate Viewer ============= */
(function () {
    document.addEventListener('DOMContentLoaded', function () {
        LHAuth.initNavbar();
        const params = new URLSearchParams(location.search);
        const certId = params.get('id');
        const cert = LHData.getCert(certId);
        if (!cert) { location.href = 'profile.html'; return; }

        const isAchiev = cert.type === 'achievement';

        // Type and headline
        setText('cert-type-display', isAchiev ? 'Certificate of Achievement' : 'Certificate of Completion');
        setText('cert-student-name', cert.userName || 'Participant');
        setText('cert-course-name', cert.courseName || '');
        setText('cert-instructor', cert.instructorName ? `Instructor: ${cert.instructorName}` : '');

        const completionText = document.getElementById('cert-completion-text');
        if (completionText) {
            if (isAchiev) {
                completionText.textContent = 'has successfully completed the following course and achieved a passing score on the assessment, and is hereby awarded this Certificate of Achievement.';
            } else {
                completionText.textContent = 'has fully completed the following course and is hereby awarded this Certificate of Completion.';
            }
        }

        // Score (only for achievement)
        const scoreArea = document.getElementById('cert-score-area');
        const scoreText = document.getElementById('cert-score-text');
        if (isAchiev && cert.score) {
            if (scoreArea) scoreArea.style.display = '';
            if (scoreText) scoreText.textContent = `Quiz Score: ${cert.score}%`;
        } else {
            if (scoreArea) scoreArea.style.display = 'none';
        }

        // Achievement mark
        const achievMark = document.getElementById('cert-achievement-mark');
        if (achievMark) achievMark.style.display = isAchiev ? '' : 'none';

        // Instructor signature
        const sigName = document.getElementById('cert-sig-name');
        if (sigName) sigName.textContent = cert.instructorName || 'Edulera Instructor';

        // Date
        const dateEl = document.getElementById('cert-date-display');
        if (dateEl && cert.date) {
            dateEl.textContent = new Date(cert.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
        }

        // Certificate ID
        const idEl = document.getElementById('cert-id-display');
        if (idEl) idEl.textContent = cert.id ? cert.id.replace('cert_', 'LH-').toUpperCase() : 'LH-000000';

        // Share button
        const shareBtn = document.getElementById('btn-share-cert');
        if (shareBtn) {
            shareBtn.addEventListener('click', () => {
                if (navigator.share) {
                    navigator.share({ title: 'My Edulera Certificate', text: `I completed the ${cert.courseName} course and received my certificate!`, url: location.href });
                } else {
                    navigator.clipboard.writeText(location.href).then(() => LHData.toast('Certificate link copied to clipboard!', 'success'));
                }
            });
        }

        function setText(id, val) { const el = document.getElementById(id); if (el) el.textContent = val; }
    });
})();

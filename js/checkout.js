/* checkout.js */
(function () {
    document.addEventListener('DOMContentLoaded', function () {
        LHAuth.initNavbar();
        LHAuth.requireAuth();
        const user = LHAuth.getCurrentUser();
        const params = new URLSearchParams(location.search);
        const courseId = params.get('id');
        const course = LHData.getCourse(courseId);
        if (!course) { location.href = 'catalog.html'; return; }

        // Breadcrumb
        setText('bc-course', course.title);

        // Order summary
        setText('order-title', course.title);
        setText('order-instructor', course.instructor);
        setText('order-meta', `${course.lessons.length} lessons • ${course.category}`);
        setText('order-price', '$' + course.price);
        setText('order-old-price', '$' + course.oldPrice);
        const discount = course.oldPrice - course.price;
        setText('order-discount', '-$' + discount);

        const thumbEl = document.getElementById('order-thumb');
        if (thumbEl) { thumbEl.style.background = course.gradient; thumbEl.textContent = course.emoji; }

        // Card input formatting
        const cardInput = document.getElementById('card-number');
        if (cardInput) {
            cardInput.addEventListener('input', e => {
                let v = e.target.value.replace(/\D/g, '').slice(0, 16);
                e.target.value = v.replace(/(.{4})/g, '$1 ').trim();
            });
        }
        const expiryInput = document.getElementById('card-expiry');
        if (expiryInput) {
            expiryInput.addEventListener('input', e => {
                let v = e.target.value.replace(/\D/g, '').slice(0, 4);
                if (v.length >= 3) v = v.slice(0, 2) + '/' + v.slice(2);
                e.target.value = v;
            });
        }
        const cvvInput = document.getElementById('card-cvv');
        if (cvvInput) {
            cvvInput.addEventListener('input', e => {
                e.target.value = e.target.value.replace(/\D/g, '').slice(0, 4);
            });
        }

        const form = document.getElementById('checkout-form');
        if (form) {
            form.addEventListener('submit', e => {
                e.preventDefault();
                // Validate
                const name = (document.getElementById('card-name').value || '').trim();
                const card = cardInput ? cardInput.value.replace(/\s/g, '') : '';
                const expiry = expiryInput ? expiryInput.value : '';
                const cvv = cvvInput ? cvvInput.value : '';
                let valid = true;

                const errName = document.getElementById('err-card-name');
                const errCard = document.getElementById('err-card-number');
                const errExpiry = document.getElementById('err-card-expiry');
                const errCvv = document.getElementById('err-card-cvv');
                [errName, errCard, errExpiry, errCvv].forEach(e => { if (e) e.textContent = ''; });

                if (!name) { if (errName) errName.textContent = 'Enter cardholder name'; valid = false; }
                if (card.length < 16) { if (errCard) errCard.textContent = 'Enter a valid card number'; valid = false; }
                if (expiry.length < 5) { if (errExpiry) errExpiry.textContent = 'Enter expiry date (MM/YY)'; valid = false; }
                if (cvv.length < 3) { if (errCvv) errCvv.textContent = 'Enter CVV code'; valid = false; }
                if (!valid) return;

                // Process payment
                const btn = document.getElementById('pay-btn');
                const btnText = document.getElementById('pay-btn-text');
                if (btn) btn.disabled = true;
                if (btnText) { btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...'; }

                setTimeout(() => {
                    LHData.enroll(user.id, courseId);
                    // Show success modal
                    const modal = document.getElementById('success-modal');
                    if (modal) modal.classList.remove('hidden');
                    LHData.toast('Payment successful! 🎉', 'success');

                    const goCourseBtn = document.getElementById('go-to-course-btn');
                    if (goCourseBtn) {
                        goCourseBtn.addEventListener('click', () => location.href = `player.html?id=${courseId}`);
                    }
                }, 1800);
            });
        }

        function setText(id, val) { const el = document.getElementById(id); if (el) el.textContent = val; }
    });
})();

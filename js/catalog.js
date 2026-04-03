/* catalog.js */
(function () {
    document.addEventListener('DOMContentLoaded', function () {
        LHAuth.initNavbar();
        const user = LHAuth.getCurrentUser();
        const courses = LHData.getAllCourses();

        let filtered = [...courses];
        let selectedCategory = 'all';
        let maxPrice = 500;
        let sortBy = 'popular';
        let searchQuery = '';

        function courseCardHTML(c) {
            const enrolled = user && LHData.isEnrolled(user.id, c.id);
            return `<div class="card course-card" onclick="location.href='course-detail.html?id=${c.id}'" style="cursor:pointer">
        <div class="course-card-thumb">
          <div class="course-card-thumb-grad" style="background:${c.gradient}">${c.emoji}</div>
          <span class="course-card-badge">${c.category}</span>
          ${enrolled ? '<span class="course-card-badge" style="left:auto;right:12px;background:var(--success)">Enrolled</span>' : ''}
        </div>
        <div class="course-card-body">
          <div class="course-card-cat">${c.category}</div>
          <div class="course-card-title">${c.title}</div>
          <div class="course-card-instructor"><i class="fas fa-user-tie" style="margin-right:4px;opacity:.6"></i>${c.instructor}</div>
          <div class="rating-row mt-2">
            <span class="stars">${LHData.starHTML(c.rating)}</span>
            <span class="rating-val">${c.rating}</span>
            <span class="rating-count">(${c.ratingCount.toLocaleString('en')})</span>
          </div>
          <div class="course-card-footer">
            <div class="course-card-price">
              <span class="old-price">$${c.oldPrice}</span>
              $${c.price}
            </div>
            <div class="badge badge-accent"><i class="fas fa-book"></i> ${c.lessons.length} lessons</div>
          </div>
        </div>
      </div>`;
        }

        function render() {
            let list = [...courses];
            if (selectedCategory !== 'all') list = list.filter(c => c.category === selectedCategory);
            if (searchQuery) list = list.filter(c => c.title.toLowerCase().includes(searchQuery) || c.instructor.toLowerCase().includes(searchQuery) || c.category.toLowerCase().includes(searchQuery));
            list = list.filter(c => c.price <= maxPrice);
            if (sortBy === 'price-low') list.sort((a, b) => a.price - b.price);
            else if (sortBy === 'price-high') list.sort((a, b) => b.price - a.price);
            else if (sortBy === 'rating') list.sort((a, b) => b.rating - a.rating);
            else list.sort((a, b) => b.students - a.students);
            filtered = list;
            const grid = LHData.qs('courses-grid');
            const count = LHData.qs('courses-count');
            if (count) count.textContent = list.length + ' courses found';
            if (grid) {
                if (list.length === 0) {
                    grid.innerHTML = `<div class="empty-state" style="grid-column:1/-1"><div class="empty-state-icon">🔍</div><h3>No courses found</h3><p>Try a different search or filter.</p></div>`;
                } else {
                    grid.innerHTML = list.map(courseCardHTML).join('');
                }
            }
            // update filter button active states
            document.querySelectorAll('.filter-btn[data-cat]').forEach(btn => {
                btn.classList.toggle('active', btn.dataset.cat === selectedCategory);
            });
        }

        // Search
        const searchInput = LHData.qs('search-input');
        if (searchInput) {
            searchInput.addEventListener('input', e => {
                searchQuery = e.target.value.toLowerCase().trim();
                render();
            });
        }

        // Category filters
        document.querySelectorAll('.filter-btn[data-cat]').forEach(btn => {
            btn.addEventListener('click', () => {
                selectedCategory = btn.dataset.cat;
                render();
            });
        });

        // Price slider
        const priceSlider = LHData.qs('price-slider');
        const priceVal = LHData.qs('price-val');
        if (priceSlider) {
            priceSlider.addEventListener('input', () => {
                maxPrice = parseInt(priceSlider.value);
                if (priceVal) priceVal.textContent = '$' + maxPrice;
                render();
            });
        }

        // Sort
        const sortSelect = LHData.qs('sort-select');
        if (sortSelect) {
            sortSelect.addEventListener('change', () => {
                sortBy = sortSelect.value;
                render();
            });
        }

        // Recommendations chip
        const recSection = LHData.qs('rec-section');
        if (recSection && user && user.interests && user.interests.length) {
            recSection.classList.remove('hidden');
        }

        render();
    });
})();

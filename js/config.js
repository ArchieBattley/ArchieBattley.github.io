// AESTHETICS TAB


// CASE SELECTION     
document.addEventListener('DOMContentLoaded', function() {
    const controls = document.getElementById('case-selection-controls');
    const title = document.getElementById('case-selection-title');
    const summaryTitle = document.getElementById('summary-case');
    const summaryImg = document.getElementById('summary-case-img');

    controls.addEventListener('click', function(e) {
        const btn = e.target.closest('button[data-name]');
        if (!btn) return;

        // Remove active from all buttons
        controls.querySelectorAll('button[data-name]').forEach(b => b.classList.remove('active'));
        // Add active to clicked button
        btn.classList.add('active');
        // Update title text
        const name = btn.getAttribute('data-name');
        title.textContent = name;
        // Update summary title
        if (summaryTitle) summaryTitle.textContent = name;
        // Update summary image
        const imgSrc = btn.getAttribute('data-image');
        if (summaryImg && imgSrc) summaryImg.src = imgSrc;
    });
});


 // Simple pagination for 12 cases, 8 per page
                                    document.addEventListener('DOMContentLoaded', function() {
                                        const controls = document.getElementById('case-selection-controls');
                                        const cases = Array.from(controls.querySelectorAll('.col'));
                                        const pageBtns = document.querySelectorAll('.pagination .page-link');
                                        const prevBtn = document.getElementById('case-prev');
                                        const nextBtn = document.getElementById('case-next');
                                        let currentPage = 1;
                                        const perPage = 8;
                                        const totalPages = Math.ceil(cases.length / perPage);

                                        function showPage(page) {
                                            cases.forEach((el, i) => {
                                                el.style.display = (i >= (page-1)*perPage && i < page*perPage) ? '' : 'none';
                                            });
                                            pageBtns.forEach((btn, idx) => {
                                                btn.parentElement.classList.toggle('active', idx === page);
                                            });
                                            prevBtn.classList.toggle('disabled', page === 1);
                                            nextBtn.classList.toggle('disabled', page === totalPages);
                                        }

                                        pageBtns.forEach((btn, idx) => {
                                            btn.addEventListener('click', function() {
                                                if (idx === 0) return; // skip prev
                                                if (idx === totalPages+1) return; // skip next
                                                currentPage = idx;
                                                showPage(currentPage);
                                            });
                                        });
                                        prevBtn.querySelector('button').addEventListener('click', function() {
                                            if (currentPage > 1) {
                                                currentPage--;
                                                showPage(currentPage);
                                            }
                                        });
                                        nextBtn.querySelector('button').addEventListener('click', function() {
                                            if (currentPage < totalPages) {
                                                currentPage++;
                                                showPage(currentPage);
                                            }
                                        });
                                        showPage(currentPage);
                                    });



                // COOLER SELECTION
                document.addEventListener('DOMContentLoaded', function() {
                    const controls = document.getElementById('cooler-selection-controls');
                    const title = document.getElementById('cooler-selection-title');
                    const summaryTitle = document.getElementById('summary-cooler');

                    controls.addEventListener('click', function(e) {
                        const btn = e.target.closest('button[data-name]');
                        if (!btn) return;

                        controls.querySelectorAll('button[data-name]').forEach(b => b.classList.remove('active'));
                        btn.classList.add('active');
                        title.textContent = btn.getAttribute('data-name');
                        if (summaryTitle) summaryTitle.textContent = btn.getAttribute('data-name');
                    });
                });

                // FAN SELECTION
                document.addEventListener('DOMContentLoaded', function() {
                    const controls = document.getElementById('fan-selection-controls');
                    const title = document.getElementById('fan-selection-title');
                    const summaryTitle = document.getElementById('summary-fans');

                    controls.addEventListener('click', function(e) {
                        const btn = e.target.closest('button[data-name]');
                        if (!btn) return;

                        controls.querySelectorAll('button[data-name]').forEach(b => b.classList.remove('active'));
                        btn.classList.add('active');
                        const name = btn.getAttribute('data-name');
                        title.textContent = name;
                        if (summaryTitle) summaryTitle.textContent = name;
                    });
                });
 
                // CABLE SELECTION
                document.addEventListener('DOMContentLoaded', function() {
                    const controls = document.getElementById('cable-selection-controls');
                    const title = document.getElementById('cable-selection-title');
                    const summaryTitle = document.getElementById('summary-cable');

                    controls.addEventListener('click', function(e) {
                        const btn = e.target.closest('button[data-name]');
                        if (!btn) return;

                        controls.querySelectorAll('button[data-name]').forEach(b => b.classList.remove('active'));
                        btn.classList.add('active');
                        const name = btn.getAttribute('data-name');
                        title.textContent = name;
                        if (summaryTitle) summaryTitle.textContent = name;
                    });
                });
 

// PERFORMANCE TAB      

// PROCESSOR SELECTION
document.addEventListener('DOMContentLoaded', function() {
    const controls = document.getElementById('processor-selection-controls');
    const title = document.getElementById('processor-selection-title');
    const summaryTitle = document.getElementById('summary-processor');

    controls.addEventListener('click', function(e) {
        const btn = e.target.closest('button[data-name]');
        if (!btn) return;

        controls.querySelectorAll('button[data-name]').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const name = btn.getAttribute('data-name');
        title.textContent = name;
        if (summaryTitle) summaryTitle.textContent = name;
    });
});
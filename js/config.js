// CASE SELECTION     
     document.addEventListener('DOMContentLoaded', function() {
                    const controls = document.getElementById('case-selection-controls');
                    const title = document.getElementById('case-selection-title');

                    controls.addEventListener('click', function(e) {
                        const btn = e.target.closest('button[data-name]');
                        if (!btn) return;

                        // Remove active from all buttons
                        controls.querySelectorAll('button[data-name]').forEach(b => b.classList.remove('active'));
                        // Add active to clicked button
                        btn.classList.add('active');
                        // Update title text
                        title.textContent = btn.getAttribute('data-name');
                    });
                });

                // COOLER SELECTION
                document.addEventListener('DOMContentLoaded', function() {
                    const controls = document.getElementById('cooler-selection-controls');
                    const title = document.getElementById('cooler-selection-title');

                    controls.addEventListener('click', function(e) {
                        const btn = e.target.closest('button[data-name]');
                        if (!btn) return;

                        controls.querySelectorAll('button[data-name]').forEach(b => b.classList.remove('active'));
                        btn.classList.add('active');
                        title.textContent = btn.getAttribute('data-name');
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
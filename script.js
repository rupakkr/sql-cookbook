document.addEventListener('DOMContentLoaded', () => {
    let allData = [];
    let currentCategory = 'all';
    let searchQuery = '';

    const searchInput = document.getElementById('search-input');
    const filterPills = document.getElementById('filter-pills');
    const cookbookGrid = document.getElementById('cookbook-grid');
    const topicCount = document.getElementById('topic-count');
    const snippetCount = document.getElementById('snippet-count');

    // Fetch and Load Data
    const loadData = async () => {
        try {
            const response = await fetch('snippets.json');
            allData = await response.json();
            renderFilters();
            renderGrid();
            updateStats();
        } catch (error) {
            console.error('Error loading data:', error);
            cookbookGrid.innerHTML = '<p class="error">Error loading snippets. Please check snippets.json.</p>';
        }
    };

    // Render Filters
    const renderFilters = () => {
        const categories = [...new Set(allData.map(item => item.category))];
        categories.sort();
        
        // Add dynamic categories to pills
        categories.forEach(category => {
            const pill = document.createElement('button');
            pill.className = 'filter-pill';
            pill.dataset.category = category;
            pill.textContent = category;
            filterPills.appendChild(pill);
        });

        // Add event listeners for filters
        filterPills.addEventListener('click', (e) => {
            if (e.target.classList.contains('filter-pill')) {
                document.querySelectorAll('.filter-pill').forEach(p => p.classList.remove('active'));
                e.target.classList.add('active');
                currentCategory = e.target.dataset.category;
                renderGrid();
            }
        });
    };

    // Render Grid
    const renderGrid = () => {
        const filteredData = allData.filter(item => {
            const matchesCategory = currentCategory === 'all' || item.category === currentCategory;
            const matchesSearch = item.title.toLowerCase().includes(searchQuery) || 
                                 item.description.toLowerCase().includes(searchQuery) ||
                                 item.snippets.some(s => s.code.toLowerCase().includes(searchQuery));
            return matchesCategory && matchesSearch;
        });

        cookbookGrid.innerHTML = '';
        
        if (filteredData.length === 0) {
            cookbookGrid.innerHTML = '<div class="no-results">No snippets found matching your search.</div>';
            return;
        }

        filteredData.forEach(item => {
            const card = document.createElement('div');
            card.className = 'card';
            card.innerHTML = `
                <div class="card-header">
                    <h3 class="card-title">${item.title}</h3>
                    <span class="card-category">${item.category}</span>
                </div>
                <p class="card-description">${item.description}</p>
                <div class="snippet-group">
                    ${item.snippets.map(snippet => `
                        <div class="snippet-item">
                            <div class="snippet-content">
                                ${snippet.label ? `<span class="snippet-label">${snippet.label}</span>` : ''}
                                <code class="snippet-code">${escapeHtml(snippet.code)}</code>
                            </div>
                            <button class="copy-button" title="Copy to clipboard">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
                            </button>
                        </div>
                    `).join('')}
                </div>
            `;
            cookbookGrid.appendChild(card);
        });

        // Re-attach copy listeners
        attachCopyListeners();
    };

    // Update Statistics
    const updateStats = () => {
        topicCount.textContent = allData.length;
        snippetCount.textContent = allData.reduce((acc, item) => acc + item.snippets.length, 0);
    };

    // Copy to Clipboard
    const attachCopyListeners = () => {
        document.querySelectorAll('.copy-button').forEach(btn => {
            btn.onclick = (e) => {
                const codeElement = btn.parentElement.querySelector('.snippet-code');
                const code = codeElement.textContent;
                
                navigator.clipboard.writeText(code).then(() => {
                    const originalIcon = btn.innerHTML;
                    btn.classList.add('copied');
                    btn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4ade80" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>';
                    
                    setTimeout(() => {
                        btn.classList.remove('copied');
                        btn.innerHTML = originalIcon;
                    }, 2000);
                });
            };
        });
    };

    // Helper for HTML escaping
    const escapeHtml = (unsafe) => {
        return unsafe
             .replace(/&/g, "&amp;")
             .replace(/</g, "&lt;")
             .replace(/>/g, "&gt;")
             .replace(/"/g, "&quot;")
             .replace(/'/g, "&#039;");
    };

    // Search input listener
    searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value.toLowerCase();
        renderGrid();
    });

    // Initial Load
    loadData();
});

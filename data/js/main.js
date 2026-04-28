
let API_URL = "https://text2team-api-news-world.hf.space/api/news";

if (navigator.language.includes('vi')) {
    API_URL = "https://text2team-api-news-vi.hf.space/api/news";
}

// Theme Management Logic với SVG Icons
const themeBtn = document.getElementById('theme-toggle');
const iconSun = document.getElementById('icon-sun');
const iconMoon = document.getElementById('icon-moon');

function updateThemeIcons(isLight) {
    if (isLight) {
        iconSun.style.display = 'none';
        iconMoon.style.display = 'block';
    } else {
        iconSun.style.display = 'block';
        iconMoon.style.display = 'none';
    }
}

if (localStorage.getItem('theme') === 'light') {
    document.body.classList.add('light-mode');
    updateThemeIcons(true);
}

themeBtn.onclick = () => {
    document.body.classList.toggle('light-mode');
    const isLight = document.body.classList.contains('light-mode');
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
    updateThemeIcons(isLight);
};

const arrowSvg = document.getElementById('arrow-svg-template').innerHTML;

async function loadNews() {
    try {
        const res = await fetch(API_URL);
        const json = await res.json();

        if (json.status !== "success") throw new Error("API failed");

        document.getElementById('loading-state').style.display = 'none';
        document.getElementById('content-loaded').style.display = 'block';

        const news = json.data;
        if (!news || news.length === 0) throw new Error("No news found");

        news.sort((a, b) => {
            const timeA = new Date(a.published).getTime() || 0;
            const timeB = new Date(b.published).getTime() || 0;
            return timeB - timeA;
        });

        // Ticker
        const ticker = document.getElementById('news-ticker');
        if (ticker) {
            ticker.innerHTML = news.slice(0, 8).map(item => `<div class="ticker__item">${item.title} - <i>${item.source}</i></div>`).join('');
            ticker.innerHTML += ticker.innerHTML;
        }

        // Hero Section
        const top = news[0];
        document.getElementById('hero-news').innerHTML = `
                    <a href="${top.link}" target="_blank" rel="nofollow noopener" class="hero-card">
                        ${top.image ? `<img src="${top.image}" alt="${top.title || 'Text2 News'}" loading="lazy">` : ''}
                        ${arrowSvg}
                        <div class="hero-content">
                            <span class="trending-badge"><span class="pulse-dot" style="width:6px;height:6px;margin-right:6px;"></span> TIÊU ĐIỂM</span>
                            <h2>${top.title}</h2>
                            <div class="meta">
                                <span>${top.source}</span>
                                <span class="dot"></span>
                                <span>${formatDate(top.published)}</span>
                            </div>
                        </div>
                    </a>
                `;

        // Sidebar
        const sidebarHtml = news.slice(1, 6).map((item, index) => `
                    <a href="${item.link}" target="_blank" rel="nofollow noopener" class="sidebar-card" style="animation-delay: ${index * 0.08}s">
                        <img src="${item.image || 'https://images.unsplash.com/photo-1585829365234-78d9b89ad945?q=80&w=200&h=140&auto=format&fit=crop'}" 
                             alt="${item.title}" loading="lazy">
                        ${arrowSvg}
                        <div class="list-content">
                            <h3>${item.title}</h3>
                            <div class="meta">
                                <span>${item.source}</span>
                                <span class="dot"></span>
                                <span>${formatDate(item.published)}</span>
                            </div>
                        </div>
                    </a>
                `).join('');
        document.getElementById('news-sidebar').innerHTML = sidebarHtml;

        // Main Grid
        const gridHtml = news.slice(6, 14).map((item, index) => `
                    <a href="${item.link}" target="_blank" rel="nofollow noopener" class="glass-card grid-card" style="animation-delay: ${(index * 0.08) + 0.2}s">
                        <img src="${item.image || 'https://images.unsplash.com/photo-1585829365234-78d9b89ad945?q=80&w=200&h=140&auto=format&fit=crop'}" 
                             alt="${item.title}" loading="lazy">
                        ${arrowSvg}
                        <div class="list-content">
                            <h3>${item.title}</h3>
                            <div class="meta">
                                <span>${item.source}</span>
                                <span class="dot"></span>
                                <span>${formatDate(item.published)}</span>
                            </div>
                        </div>
                    </a>
                `).join('');
        document.getElementById('news-grid').innerHTML = gridHtml;

        // Footer Grid
        if (news.length > 14) {
            document.getElementById('more-news-container').style.display = 'block';
            const footerGridHtml = news.slice(14).map((item, index) => `
                        <a href="${item.link}" target="_blank" rel="nofollow noopener" class="glass-card grid-card" style="animation-delay: ${(index * 0.05) + 0.4}s">
                            <img src="${item.image || 'https://images.unsplash.com/photo-1585829365234-78d9b89ad945?q=80&w=200&h=140&auto=format&fit=crop'}" 
                                 alt="${item.title}" loading="lazy">
                            ${arrowSvg}
                            <div class="list-content">
                                <h3>${item.title}</h3>
                                <div class="meta">
                                    <span>${item.source}</span>
                                    <span class="dot"></span>
                                    <span>${formatDate(item.published)}</span>
                                </div>
                            </div>
                        </a>
                    `).join('');
            document.getElementById('news-footer-grid').innerHTML = footerGridHtml;
        }

        simulateLiveUpdates();

    } catch (e) {
        console.error("News Load Error:", e);
        document.getElementById('loading-state').style.display = 'none';
        const ticker = document.getElementById('news-ticker');
        if (ticker) {
            ticker.innerHTML = `<div class="ticker__item" style="color:#e60000; font-weight: bold;">⚠️ Lỗi: Hiện không thể kết nối tới máy chủ API. Vui lòng thử lại sau.</div>`;
        }
    }
}

function simulateLiveUpdates() {
    setInterval(() => {
        const statusBar = document.querySelector('.live-status-bar');
        if (statusBar) {
            statusBar.classList.add('updating');
            setTimeout(() => statusBar.classList.remove('updating'), 800);

            const times = document.querySelectorAll('.meta span:last-child');
            if (times.length > 2) {
                const randomTime = times[Math.floor(Math.random() * times.length)];
                if (randomTime && randomTime.innerText.includes('trước')) {
                    const card = randomTime.closest('a');
                    if (card) {
                        card.style.transition = 'border-color 0.4s ease';
                        const oldBorder = card.style.borderColor;
                        card.style.borderColor = '#e60000';
                        setTimeout(() => { card.style.borderColor = oldBorder || ''; }, 800);
                    }
                }
            }
        }
    }, 15000);
}

function formatDate(dateStr) {
    try {
        const date = new Date(dateStr);
        if (isNaN(date)) return dateStr;
        return date.toLocaleDateString('vi-VN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    } catch {
        return dateStr;
    }
}

loadNews();
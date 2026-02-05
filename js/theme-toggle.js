// Theme Toggle Functionality

function initializeThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    
    if (!themeToggle) return;

    // Set initial theme icon
    updateThemeIcon();

    // Toggle theme on click
    themeToggle.addEventListener('click', toggleTheme);
}

function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme') || 'light';
    const next = current === 'light' ? 'dark' : 'light';
    
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    updateThemeIcon();
    analytics.log('theme_changed', { from: current, to: next });
}

function updateThemeIcon() {
    const theme = document.documentElement.getAttribute('data-theme') || 'light';
    const themeToggle = document.getElementById('themeToggle');
    
    if (themeToggle) {
        themeToggle.textContent = theme === 'light' ? '🌙' : '☀️';
    }
}

// Initialize on page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeThemeToggle);
} else {
    initializeThemeToggle();
}

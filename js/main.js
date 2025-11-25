// Mobile menu toggle
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const navLinks = document.querySelector('.nav-links');

if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        mobileMenuBtn.classList.toggle('active');
    });
}

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));

        if (target) {
            // Close mobile menu if open
            navLinks.classList.remove('active');
            mobileMenuBtn.classList.remove('active');

            // Smooth scroll to target
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Download button functionality
function handleDownload(e) {
    e.preventDefault();

    // Get the latest release from GitHub
    const repoUrl = 'https://github.com/pugwash2/amazon-ads-editor';
    const releaseUrl = `${repoUrl}/releases/latest`;

    // Show download starting message
    const btn = e.currentTarget;
    const originalText = btn.innerHTML;
    btn.innerHTML = '<span class="btn-icon">⏳</span> Preparing download...';
    btn.style.pointerEvents = 'none';

    // Open releases page in new tab
    window.open(releaseUrl, '_blank');

    // Reset button after 2 seconds
    setTimeout(() => {
        btn.innerHTML = originalText;
        btn.style.pointerEvents = 'auto';
    }, 2000);
}

// Attach download handlers to all download buttons
document.querySelectorAll('.download-btn, a[href="#download"].btn-primary, a[href="#download"].btn-large').forEach(btn => {
    // Check if this is actually a download button (not just a link to the download section)
    if (btn.classList.contains('download-btn') || btn.textContent.includes('Download')) {
        btn.addEventListener('click', handleDownload);
    }
});

// Navbar background on scroll
let lastScroll = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }

    lastScroll = currentScroll;
});

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe feature cards, steps, and use cases for animations
document.querySelectorAll('.feature-card, .step, .use-case, .pricing-card').forEach(el => {
    observer.observe(el);
});

// GitHub stats fetching (optional - shows real star count)
async function updateGitHubStats() {
    try {
        const response = await fetch('https://api.github.com/repos/pugwash2/amazon-ads-editor');
        const data = await response.json();

        if (data.stargazers_count) {
            const starBtn = document.querySelector('a[href*="github"]');
            if (starBtn && starBtn.textContent.includes('Star')) {
                starBtn.innerHTML = `<span class="btn-icon">⭐</span> Star on GitHub (${data.stargazers_count})`;
            }
        }
    } catch (error) {
        console.log('Could not fetch GitHub stats:', error);
    }
}

// Update stats on page load
updateGitHubStats();

// Easter egg: Konami code
let konamiCode = [];
const konamiPattern = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

document.addEventListener('keydown', (e) => {
    konamiCode.push(e.key);
    konamiCode = konamiCode.slice(-10);

    if (konamiCode.join(',') === konamiPattern.join(',')) {
        document.body.style.animation = 'rainbow 2s linear infinite';
        setTimeout(() => {
            document.body.style.animation = '';
        }, 3000);
    }
});

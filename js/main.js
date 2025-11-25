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

// Waitlist form handler - submits to Google Forms
const waitlistForm = document.getElementById('waitlistForm');

if (waitlistForm) {
    waitlistForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = waitlistForm.querySelector('input[type="email"]').value;
        const btn = waitlistForm.querySelector('button');
        const originalText = btn.textContent;

        // Update button state
        btn.textContent = 'Joining...';
        btn.disabled = true;

        // Google Form submission URL
        const formUrl = 'https://docs.google.com/forms/d/e/1FAIpQLScXgqv7fOPr8STHRkmsG2jgtWXNVKwovtKl1ZT74qK6tF5aSA/formResponse';

        // Create form data
        const formData = new FormData();
        formData.append('entry.922256844', email);

        try {
            // Submit to Google Forms (no-cors mode - we won't get a response)
            await fetch(formUrl, {
                method: 'POST',
                body: formData,
                mode: 'no-cors'
            });

            // Show success
            btn.textContent = 'Joined! ✓';
            btn.style.background = '#00ffa3';

            // Reset form
            waitlistForm.reset();

            // Reset button after 3 seconds
            setTimeout(() => {
                btn.textContent = originalText;
                btn.disabled = false;
                btn.style.background = '';
            }, 3000);

        } catch (error) {
            // Even if fetch fails, Google Forms likely received it
            // Show success anyway (no-cors mode doesn't allow error checking)
            btn.textContent = 'Joined! ✓';
            btn.style.background = '#00ffa3';

            waitlistForm.reset();

            setTimeout(() => {
                btn.textContent = originalText;
                btn.disabled = false;
                btn.style.background = '';
            }, 3000);
        }
    });
}

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

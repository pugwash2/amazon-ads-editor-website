/**
 * Guide Page JavaScript
 * - Populates sidebar navigation from page sections
 * - Highlights active section on scroll
 * - Smooth scrolling for sidebar links
 */

document.addEventListener('DOMContentLoaded', () => {
    const sidebarLinks = document.getElementById('sidebarLinks');
    const sections = document.querySelectorAll('.guide-section');

    if (!sidebarLinks) return;

    // Build sidebar links from sections
    sections.forEach(section => {
        const id = section.id;
        const h2 = section.querySelector('h2');

        if (id && h2) {
            const li = document.createElement('li');
            const a = document.createElement('a');
            a.href = `#${id}`;
            a.textContent = h2.textContent;
            a.dataset.section = id;
            li.appendChild(a);
            sidebarLinks.appendChild(li);
        }
    });

    // Smooth scroll for sidebar links
    sidebarLinks.addEventListener('click', (e) => {
        if (e.target.tagName === 'A') {
            e.preventDefault();
            const targetId = e.target.getAttribute('href').slice(1);
            const targetSection = document.getElementById(targetId);

            if (targetSection) {
                const headerOffset = 80;
                const elementPosition = targetSection.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });

                // Update URL without triggering scroll
                history.pushState(null, null, `#${targetId}`);
            }
        }
    });

    // Highlight active section on scroll
    const observerOptions = {
        root: null,
        rootMargin: '-100px 0px -66%',
        threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Remove active class from all links
                sidebarLinks.querySelectorAll('a').forEach(a => {
                    a.classList.remove('active');
                });

                // Add active class to current section's link
                const activeLink = sidebarLinks.querySelector(`a[data-section="${entry.target.id}"]`);
                if (activeLink) {
                    activeLink.classList.add('active');
                }
            }
        });
    }, observerOptions);

    // Observe all sections
    sections.forEach(section => {
        if (section.id) {
            observer.observe(section);
        }
    });

    // Handle initial hash in URL
    if (window.location.hash) {
        const targetId = window.location.hash.slice(1);
        const targetSection = document.getElementById(targetId);

        if (targetSection) {
            setTimeout(() => {
                const headerOffset = 80;
                const elementPosition = targetSection.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }, 100);
        }
    }

    // Smooth scroll for TOC links
    const tocLinks = document.querySelectorAll('.toc-list a');
    tocLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').slice(1);
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });

                history.pushState(null, null, `#${targetId}`);
            }
        });
    });
});

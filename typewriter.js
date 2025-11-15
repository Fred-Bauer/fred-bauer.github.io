// Typewriter Animation on Scroll
document.addEventListener('DOMContentLoaded', function() {
    const typewriterSections = document.querySelectorAll('.typewriter');

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const section = entry.target;
            if (section.dataset.typed === '1') {
                obs.unobserve(section);
                return;
            }

            section.classList.add('typing');

            // 1) Gather paragraphs; CSS will keep them hidden initially when .js is present
            const paragraphs = section.querySelectorAll('p, .date');

            // 2) Type only headings (h1, h2) sequentially
            const headings = section.querySelectorAll('h1, h2');
            let cumulative = 0;
            const speedByTag = { H1: 75, H2: 50 };
            const gap = 20; 

            headings.forEach(h => {
                cumulative += typeTextFixed(h, speedByTag[h.tagName] || 10, cumulative) + gap;
            });

            // 3) After headings typed, reveal paragraphs (small additional delay)
            const paragraphRevealDelay = 20; // ms
            setTimeout(() => {
                paragraphs.forEach(p => (p.style.opacity = '1'));
            }, cumulative + paragraphRevealDelay);

            section.dataset.typed = '1';
            obs.unobserve(section);
        });
    }, { threshold: 0.2, rootMargin: '0px 0px -80px 0px' });

    typewriterSections.forEach(sec => observer.observe(sec));

    // Types text with a fixed per-character speed (no acceleration)
    function typeTextFixed(el, speed = 35, initialDelay = 0) {
        const text = el.textContent;
        if (!text || el.dataset.typedHeading === '1') return 0;

        el.textContent = '';
        let time = initialDelay;
        for (let i = 0; i < text.length; i++) {
            const ch = text[i];
            setTimeout(() => el.append(ch), time);
            time += speed;
        }
        el.dataset.typedHeading = '1';
        return text.length * speed;
    }
});

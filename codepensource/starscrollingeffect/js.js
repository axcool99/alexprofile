        // 1. LENIS INITIALIZATION
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            smooth: true,
        });

        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);

        // 2. STARS ANIMATION LOGIC
        (function () {
            let container = document.getElementById('star-container');
            // If valid but empty (or just created), we populate it
            container.innerHTML = '';

            const count = 80;
            const stars = [];

            for (let i = 0; i < count; i++) {
                const s = document.createElement('div');
                s.className = 'star';

                // Random Initial Positions
                const x = Math.random() * 100;
                const y = Math.random() * 100; // 0-100%

                // 30% chance to be completely static (distant stars)
                const isStatic = Math.random() < 0.3;
                const z = isStatic ? 0 : 0.2 + Math.random() * 0.6; // Speed factor (depth)
                const size = isStatic ? 1 + Math.random() : 1 + Math.random() * 2; // Static stars smaller

                s.style.left = x + '%';
                s.style.top = y + '%';
                s.style.width = size + 'px';
                s.style.height = size + 'px';

                // Add twinkle variation
                s.style.setProperty('--duration', (2 + Math.random() * 4) + 's');
                s.style.animationDelay = (Math.random() * 5) + 's';

                container.appendChild(s);
                stars.push({ el: s, initialY: y, speed: z });
            }

            // Sync with Lenis Scroll
            lenis.on('scroll', ({ scroll, velocity }) => {
                // Determine stretch based on speed
                // velocity is usually pixels per frame/tick
                const stretch = Math.max(1, Math.min(1 + Math.abs(velocity) * 0.15, 4));

                stars.forEach(star => {
                    // Static stars don't move or stretch
                    if (star.speed === 0) {
                        star.el.style.transform = 'scaleY(1)';
                        return;
                    }

                    // Calculate infinite position
                    // We move stars UP (subtracting scroll) to simulate falling/moving forward
                    // Factor 0.05 controls the base "speed" of the universe relative to px scroll
                    let pos = (star.initialY - (scroll * star.speed * 0.05)) % 100;
                    if (pos < 0) pos += 100; // Handle wrapping

                    star.el.style.top = pos + '%';
                    // Apply stretch only on Z-axis (height) for warp effect
                    star.el.style.transform = `scaleY(${stretch})`;
                });
            });
        })();
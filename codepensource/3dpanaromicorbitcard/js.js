const carousel = document.getElementById('carousel');
const viewport = document.getElementById('viewport');

const rawData = [
    { title: "High-Performance Magento Hosting Solutions", date: "MAR 24, 2026", desc: "Optimized server stacks for industrial-scale e-commerce traffic." },
    { title: "Automated Scaling with StoreFrame Labs", date: "MAR 22, 2026", desc: "Predictive resource management for enterprise infrastructure." },
    { title: "Minimalist UI: The Future of Dashboard Design", date: "MAR 20, 2026", desc: "Applying Swiss-style precision to complex technical interfaces." },
    { title: "Advanced Security Layers for Magento Stores", date: "MAR 18, 2026", desc: "Zero-trust architecture protecting global transaction nodes." }
];

const data = [...rawData, ...rawData, ...rawData]; 
const cardCount = data.length;
const radius = 650; 

let currentRotation = 0;
let velocity = 0; 
let isDragging = false;
let lastX = 0;
let scrollSpeed = 0.15; // Drag sensitivity

// 1. Generate Cards
data.forEach((item, i) => {
    const card = document.createElement('div');
    card.className = 'news-card';
    const angle = (i * 360) / cardCount;
    card.style.transform = `rotateY(${angle}deg) translateZ(${radius}px) rotateY(180deg)`;
    
    card.innerHTML = `
        <img class="card-img" src="https://picsum.photos/seed/${i + 42}/400/300" alt="img">
        <div class="card-meta"><span class="card-dot"></span>NEWS • ${item.date}</div>
        <h3>${item.title}</h3>
        <p>${item.desc}</p>
    `;
    carousel.appendChild(card);
});

// 2. The Physics Engine
function animate() {
    if (!isDragging) {
        // Apply momentum
        currentRotation += velocity;
        
        // Friction: The closer to 1.0, the longer the spin. 0.95 is a natural stop.
        velocity *= 0.95; 

        // Idle drift: slow rotation when not being interacted with
        if (Math.abs(velocity) < 0.01) {
            currentRotation -= 0.05; 
        }
    }
    
    // Maintain vertical and horizontal centering during rotation
    carousel.style.transform = `translate(-50%, -50%) rotateY(${currentRotation}deg)`;
    requestAnimationFrame(animate);
}

// 3. Interaction Handlers
const onStart = (e) => {
    isDragging = true;
    lastX = e.pageX || (e.touches ? e.touches[0].pageX : 0);
    velocity = 0; // Kill momentum when grabbed
};

const onMove = (e) => {
    if (!isDragging) return;
    if (e.touches) e.preventDefault(); // Stop mobile "bounce"
    
    const x = e.pageX || (e.touches ? e.touches[0].pageX : 0);
    const deltaX = x - lastX;
    
    // Direct rotation mapping
    currentRotation += deltaX * scrollSpeed;
    
    // Capture velocity for inertia release
    velocity = deltaX * scrollSpeed;
    
    lastX = x;
};

const onEnd = () => {
    isDragging = false;
};

// 4. Robust Event Binding
viewport.addEventListener('mousedown', onStart);
window.addEventListener('mousemove', onMove);
window.addEventListener('mouseup', onEnd);

viewport.addEventListener('touchstart', onStart, { passive: false });
window.addEventListener('touchmove', onMove, { passive: false });
window.addEventListener('touchend', onEnd);

// Wheel Support (Optional)
window.addEventListener('wheel', (e) => {
    if (e.target.closest('#viewport')) {
        velocity += e.deltaY * 0.01;
    }
}, { passive: true });

animate();
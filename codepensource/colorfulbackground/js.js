        import * as THREE from 'three';
        import GUI from 'lil-gui';

        // --- Application State & Variables ---
        let camera, scene, renderer;
        let uniforms;
        let clock = new THREE.Clock();
        let currentPixelRatio = Math.min(window.devicePixelRatio || 1, 1);

        // --- Shader Implementation ---
        const fragmentShader = `
            uniform vec3 iResolution;
            uniform float iTime;
            
            // Exposed GUI parameters
            uniform float uEvolutionSpeed;
            uniform float uGlowIntensity;
            uniform float uMaxIterations;
            uniform vec4 uColorPhase;
            uniform float uTunnelSize;
            uniform float uStepSize;
            uniform float uFractalScale;
            uniform float uFogDensity;

            void main() {
                // Fragment coordinates
                vec2 I = gl_FragCoord.xy;
                
                // Output color initialization
                vec4 O = vec4(0.0);
                
                // Variables for raymarching and distance
                float z = 0.0;
                float d = 0.0;
                // Removed forward movement, using time for evolution only
                float time = iTime * uEvolutionSpeed;

                // Main raymarching loop
                for (float i = 0.0; i < 200.0; i++) {
                    // Break loop based on GUI parameter (Optimization)
                    if (i >= uMaxIterations) break;

                    // Calculate ray direction (No flight, stationary camera)
                    vec3 p = z * normalize(vec3(I * 2.0, 0.0) - vec3(iResolution.x, iResolution.y, iResolution.y));
                    
                    // Fractal noise accumulation
                    d = 1.0;
                    for (int j = 0; j < 6; j++) {
                        if (d >= 9.0) break;
                        // Time added here creates internal nebula evolution
                        p += cos(p.yzx * d * uFractalScale + z * 0.2 + time) / d;
                        d /= 0.7;
                    }

                    // Calculate distance. Base step size increased for performance
                    d = uStepSize + 0.1 * abs(uTunnelSize - length(p.xy));
                    z += d;

                    // Accumulate color
                    float fog = uFogDensity / d;
                    O += (cos(z + uColorPhase) + 1.0) * fog / uGlowIntensity;
                }

                // Output final color
                gl_FragColor = O;
            }
        `;

        const vertexShader = `
            void main() {
                gl_Position = vec4(position, 1.0);
            }
        `;

        // --- Initialization ---
        function init() {
            // Setup Scene and Camera (Orthographic for full-screen quad)
            scene = new THREE.Scene();
            camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

            // Setup WebGL Renderer
            renderer = new THREE.WebGLRenderer({ antialias: false });
            renderer.setSize(window.innerWidth, window.innerHeight);
            // Use dynamic pixel ratio for performance control
            renderer.setPixelRatio(currentPixelRatio);
            document.body.appendChild(renderer.domElement);

            // Define Shader Uniforms
            uniforms = {
                iTime: { value: 0 },
                iResolution: { value: new THREE.Vector3(window.innerWidth * currentPixelRatio, window.innerHeight * currentPixelRatio, 1) },
                // New default parameters
                uEvolutionSpeed: { value: 0.3 },
                uGlowIntensity: { value: 2600.0 },
                uMaxIterations: { value: 53.0 },
                uColorPhase: { value: new THREE.Vector4(6.3, 7.0, 3.6, 3.0) },
                uTunnelSize: { value: 2.1 },
                uStepSize: { value: 0.045 },
                uFractalScale: { value: 0.7 },
                uFogDensity: { value: 2.0 }
            };

            // Create Full-screen Quad Material
            const material = new THREE.ShaderMaterial({
                fragmentShader: fragmentShader,
                vertexShader: vertexShader,
                uniforms: uniforms,
                depthWrite: false,
                depthTest: false
            });

            // Create Geometry and Add to Scene
            const geometry = new THREE.PlaneGeometry(2, 2);
            const mesh = new THREE.Mesh(geometry, material);
            scene.add(mesh);

            // Setup lil-gui
            setupGUI();

            // Handle Window Resize
            window.addEventListener('resize', onWindowResize, false);
        }

        // --- lil-gui Setup ---
        function setupGUI() {
            const gui = new GUI({ title: 'Shader Settings' });
            gui.close(); // Collapse the panel by default

            // Create an object to hold GUI proxy values
            const guiParams = {
                pixelRatio: currentPixelRatio,
                evolutionSpeed: uniforms.uEvolutionSpeed.value,
                iterations: uniforms.uMaxIterations.value,
                stepSize: uniforms.uStepSize.value,
                glowSoftness: uniforms.uGlowIntensity.value,
                tunnelRadius: uniforms.uTunnelSize.value,
                fogDensity: uniforms.uFogDensity.value,
                fractalScale: uniforms.uFractalScale.value,
                colorPhaseR: uniforms.uColorPhase.value.x,
                colorPhaseG: uniforms.uColorPhase.value.y,
                colorPhaseB: uniforms.uColorPhase.value.z
            };

            const folderOptimization = gui.addFolder('Performance & Raymarching');
            folderOptimization.add(guiParams, 'pixelRatio', 0.1, 2.0, 0.1).name('Pixel Ratio').onChange(v => {
                currentPixelRatio = v;
                renderer.setPixelRatio(v);
                uniforms.iResolution.value.set(window.innerWidth * v, window.innerHeight * v, 1);
            });
            folderOptimization.add(guiParams, 'iterations', 10, 150, 1).name('Max Iterations').onChange(v => uniforms.uMaxIterations.value = v);
            folderOptimization.add(guiParams, 'stepSize', 0.01, 0.1, 0.005).name('Ray Step Size').onChange(v => uniforms.uStepSize.value = v);

            const folderNebula = gui.addFolder('Nebula Controls');
            folderNebula.add(guiParams, 'evolutionSpeed', 0.0, 3.0, 0.1).name('Evolution Speed').onChange(v => uniforms.uEvolutionSpeed.value = v);
            folderNebula.add(guiParams, 'fogDensity', 0.1, 5.0, 0.1).name('Fog Density').onChange(v => uniforms.uFogDensity.value = v);
            folderNebula.add(guiParams, 'fractalScale', 0.5, 3.0, 0.1).name('Fractal Scale').onChange(v => uniforms.uFractalScale.value = v);
            folderNebula.add(guiParams, 'tunnelRadius', 0.5, 10.0, 0.1).name('Cloud Radius').onChange(v => uniforms.uTunnelSize.value = v);
            folderNebula.add(guiParams, 'glowSoftness', 500, 10000, 100).name('Glow Softness').onChange(v => uniforms.uGlowIntensity.value = v);

            const folderColors = gui.addFolder('Color Phase (Purple/Blue)');
            folderColors.add(guiParams, 'colorPhaseR', 0, 10, 0.1).name('Red Phase').onChange(v => uniforms.uColorPhase.value.x = v);
            folderColors.add(guiParams, 'colorPhaseG', 0, 10, 0.1).name('Green Phase').onChange(v => uniforms.uColorPhase.value.y = v);
            folderColors.add(guiParams, 'colorPhaseB', 0, 10, 0.1).name('Blue Phase').onChange(v => uniforms.uColorPhase.value.z = v);
        }

        // --- Resize Handler ---
        function onWindowResize() {
            renderer.setSize(window.innerWidth, window.innerHeight);
            uniforms.iResolution.value.set(window.innerWidth * currentPixelRatio, window.innerHeight * currentPixelRatio, 1);
        }

        // --- Animation Loop ---
        function animate() {
            requestAnimationFrame(animate);
            
            // Update time uniform
            uniforms.iTime.value = clock.getElapsedTime();
            
            // Render scene
            renderer.render(scene, camera);
        }

        // --- Start Application ---
        init();
        animate();
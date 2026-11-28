# Black-Hole Simulation Using OpenGL

## Preview
<img width="800" height="450" alt="VideoProject1-ezgif com-video-to-gif-converter" src="https://github.com/user-attachments/assets/704e568a-bff2-4fc1-8eaf-ed06f3769e2a" />

## About the Project
This project simulates a non-spinning (Schwarzschild) black hole in real time. Built from scratch in C++20 and OpenGL 3.3, it serves as a testbed to benchmark per-pixel numerical geodesic integration (RK4) against precomputed lookup tables (Eric Bruneton’s method).

## Development Roadmap
- [x] Set up OpenGL 3.3 boilerplate, windowing context, and camera controls
- [x] Implement a baseline ray-marching pipeline
- [x] Implement Schwarzschild black hole gravitational lensing using RK4 integration
- [ ] Implement Eric Bruneton's precomputation lookup tables for real-time rendering
- [ ] Add runtime toggling between RK4 and precomputed lookup modes
- [ ] Benchmark and log frame-time vs. accuracy tradeoffs across both methods

### Optional Visual Improvements
- [ ] Add a volumetric or thin accretion disc
- [ ] Enhance background starfield rendering following Eric Bruneton's method
- [ ] Implement relativistic Doppler shift and gravitational redshift

## Architecture & Implementation
The renderer uses a full-screen fragment shader to ray-march photon trajectories across the view frustum. Simulation parameters including camera orientation, black hole mass ($`M`$), angular step size ($`d\phi`$), and maximum integration steps are passed dynamically via shader uniforms, allowing interactive inspection of lensing distortion and integration stability at runtime.

## The RK4 Method
To trace photon trajectories in Schwarzschild spacetime, the shader numerically integrates the orbital geodesic ODE:

$$
u''(\phi) = -u\left(1 - \frac{3}{2}u^2\right), \quad \text{where } u = \frac{1}{r}
$$

Fourth-order Runge-Kutta (RK4) is used instead of first-order Euler integration because its $`O(h^4)`$ local truncation error preserves photon paths near the photon sphere without severe drift. However, evaluating four derivative samples per step makes real-time RK4 computationally expensive; reducing cost by increasing step size ($`d\phi`$) or capping maximum steps quickly degrades visual accuracy near the event horizon. This bottleneck motivates the second phase of the project: replacing per-frame ODE integration with Eric Bruneton’s precomputation approach.


## Dependencies & Build
* **Requirements:** C++20 compiler, CMake ($\ge 3.20$), OpenGL 3.3+ (GLFW 3.4 and GLAD are vendored in `external/`; GLM 1.0.1 is fetched automatically via CMake)

```bash
git clone https://github.com/NafaeImran/BlackHoleSimulation-OpenGL.git
cd BlackHoleSimulation-OpenGL
cmake -B build -DCMAKE_BUILD_TYPE=Release
cmake --build build
./build/OpenGL
```

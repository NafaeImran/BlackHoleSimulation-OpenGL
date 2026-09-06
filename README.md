# Black-Hole Simulation Using Opengl
## Project Phases:
- [x] Setup Simple Boiler Plate code necessary for OpenGL
- [x] Setup a simple path tracer
- [x] Implement a simple black hole simulation using RK4
- [ ] Implement Eric Bruneton's method for black hole simulation using pre-computations
- [ ] Allow for real time switching between the two simulation methods
- [ ] Add an accretion disc
- [ ] Improve background stars following Eric Bruneton's method
- [ ] Implement realistic physics effects such as redshift

##
<img width="800" height="450" alt="VideoProject1-ezgif com-video-to-gif-converter" src="https://github.com/user-attachments/assets/704e568a-bff2-4fc1-8eaf-ed06f3769e2a" />


##
## About the project
This project aims to create a simulation of a non-spinning(Schwarzschild) black hole. The purpose of this project is two fold. Firstly it serves as the start of my journey into the wonderful world of Computer Graphics secondly it will be used to demonstrate 
in real time the benefits of Eric Bruneton's method of pre-computation over the high cost RK4 integration method for the purposes of simulating a black hole.

## The RK4 method

RK4 or Runge-Kutta 4 is an integration method that allows us to solve the ODE we obtain when deriving the photon's trajectory around the black hole in
particular the equation u''(φ) = -u(1 - (3/2)u²), where u = 1/r. The reason that RK4 is the preferred method for this over something like Euler is due to the added accuracy due to RK4 being a 4th order method allowing its accumulated error to be
smaller than that of the first order Euler method. However the RK4 method is not without its own flaws namely that evaluating the ray at 4 points results in a high performance cost which cannot be avoided without compromising
quality by decreasing step size(dphi) or the maximum number of steps taken during the integration. This is what motivates the second half of this project that being the pre-computation methodology of Eric Bruneton.
## Controls
### Camera 
- W : Move Forward
- S: Move Backward
- A: Move Left
- D : Move Right
### Simulation Variables
- N : Increase step size(dphi)
- Shift + N : Decrease step size(dphi)
- B : Increase Max steps
- Left Shift + B : Decrease Max steps
- M : Increase Black hole mass
- Left Shift + M : Decrease Black hole mass
### General
- esc : Quit

## References
[Numerical Simulation of Black Hole Images from photon trajectories in Schwarzschild Geometry](https://arxiv.org/pdf/2608.07031)

[Physics of oseiskar.github.io/black-hole](https://oseiskar.github.io/black-hole/docs/physics.html)

[Visualizing a Black Hole](http://spiro.fisica.unipd.it/~antonell/schwarzschild/)

[Schwarzschild geodesics](https://en.wikipedia.org/wiki/Schwarzschild_geodesics)

[Real-time High-Quality Rendering of Non-Rotating Black Holes](https://arxiv.org/abs/2010.08735)

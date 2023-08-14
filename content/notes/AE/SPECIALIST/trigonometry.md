---
title: "trigonometry"
---
## Assumed Knowledge (from methods)
- Angles in degrees in radians (and converting between units).
- Defining sin and cos using the unit circle.
- Graphs of y = sinx, y = cosx and y = tanx.
- The pythagorean identity.
- Symmetry properties of trig functions.
- Exact values of trig functions for integer multiples of $\frac{\pi}{2}$, $\frac{\pi}{4}$, and $\frac{\pi}{6}$ radians.

## Sketch the graph of the function
h: \[0, 2pi] -> $\mathbb{R}$, h(x) = $3\cos\left( 2x + \frac{\pi}{3} \right)+1$
dilations first, followed by translations, provided it is written in the factorised form.

## General solutions to trig equations.
### recap
- sin (x) = 1/2
	- we said within one revolution of a unit circle, there exists two solutions for this statement.
	- 2 out of infinity many solutions, with other solutions that can be obtained by some number of revolutions around the unit circle.
	- $\therefore$ in general, $x=\frac{\pi}{6}+k 2 \pi$, $\frac{5\pi}{6} + k 2 \pi$ for some integer k
### more on general solutions
- for the trigonometric equation such as $\cos \theta = 0.3$. there exists infinitely many solutions.
- if you put the equation in a calculator, $\cos^{-1}(0.3) = 72.54\degree$ <- only 1 definite value, out of infinite values is given, not even two values of the unit circle.
	- how does the calculator decide which value to give?
	- there exists a rule/notion of what an inverse of a trig function gives you.
- think of $\cos^{-1}$ as a function, such value -> $\cos^{-1}$ -> angle
	- we need to define a range for the possible outputs
		- by convention, $\cos^{-1}$ has range $\{\theta |0\leq \theta\leq \pi\}$
		- by convention, the graph of $cos^{-1}x$ is: 
			- ![300](notes/images/Screen%20Shot%202023-08-14%20at%209.09.44%20am.png)
		- $\sin^{-1}$ has range $\left\{ \theta | -\frac{\pi}{2} \leq \theta \leq \frac{\pi}{2} \right\}$
			- ![300](notes/images/Screen%20Shot%202023-08-14%20at%209.11.04%20am.png)
		- $\tan^{-1}$ has range $\{\theta | -\frac{\pi}{2} < \theta < \frac{\pi}{2}\}$
			- ![500](notes/images/Screen%20Shot%202023-08-14%20at%209.13.04%20am.png)
- consider the trig equation $\cos \theta = \frac{1}{2}$
- by convention, $\cos^{-1}\left( \frac{1}{2} \right) = \frac{\pi}{3}$
- the solution in the reflected position can be negative
- this can be expressed as 
	- $\theta=2k \pi \pm \cos^{-1}\left( \frac{1}{2} \right)$
	- $=2k\pi \pm \frac{\pi}{3}$
	- $=\frac{(6k\pm1)\pi}{3},k \in \mathbb{Z}$
- consider the trig equation $\sin \theta=\frac{1}{2}$
	- a calculator gives $\sin^{-1}\left( \frac{1}{2} \right)=\frac{\pi}{6}$
	- the other solution is $\pi - \sin^{-1} (\frac{1}{2})$
	- so general solution is
	- $\theta=k 2 \pi + \sin^{-1} (\frac{1}{2})$ or $\theta = (2k+1)\pi - \sin^{-1} (\frac{1}{2})$
> [!note] dont have to write in this form, but you may see this form in questions!
---
title: Matrices
tags:
  - matrices
  - speech
  - AE
---
## Matrices Prequel: Linear Transformation

Transformation } Function

- Vector Input -> Vector output
- its raining so hard
- i love 3 blue 1 brown <3 go watch the video
  Linear }
  $$\begin{bmatrix} a & b \\ c & d \end{bmatrix} \begin{bmatrix} e \\ f \end{bmatrix} = e \begin{bmatrix} a \\ c \end{bmatrix} + f \begin{bmatrix} b \\ d \end{bmatrix} = \begin{bmatrix} ea + fb \\ ec + fd \end{bmatrix}$$

## background

- used to represent linear transformations (like in computer animations)
- it is a rectangular (though often square) array of mathematical objects.
- if it has **m** rows and **n** columns, it is called an **m** x **n** matrix
- entries in the matrix can be indexed using subscripts for the row and column - $a_{13}$ is in row 1, column 3 = 0
  $$
  A=\begin{bmatrix}
  3 & -1 & 0 \\ 4 & -2 & 3
  \end{bmatrix}
  $$

## matrix equality

- if and only if they have same number of rows and columns, and all corresponding entries are equal.

## addition and multiplication of matrices

- notes not needed (intuitive and straightforward)

## 11C: matrix multiplication

### multiplying two matrices

- matrices can be multiplied even if they do not have same dimensions.
- work through the rows of the first matrix, and the column of the second.
  - form the scalar product for each row and column of the first and second matrix.
- properties of matrix multiplication creates certain rules within matrices.
  - two matrices can be multiplied together provided the number of columns in the first matrix equals the number of rows in the second matrix.
  - suppose matrix A has dimension m x n, and matrix B has dimensions p x q.
    - the product $A_{mn}B_{pq}$ can only be formed if $n=p$.
      - in this case AB will have dimension m x q.
    - the product $B_{pq}A_{mn}$ can only be formed if $q=m$.
      - in this case BA will have dimension p x n.z
    - in the product AB we say that B is **premultiplied** by A **or** A is **postmultiplied** by B.

## zero matrix

- 0 is called the additive identity of the real numbers
- consider the matrix: $$\begin{pmatrix}
1 & 6 \\ -2 & 5
\end{pmatrix}$$
- then: $$\begin{pmatrix}
1 & 6 \\ -2 & 5
\end{pmatrix}+\begin{pmatrix}
 0 & 0 \\ 0 & 0
\end{pmatrix}=\begin{pmatrix}
1 & 6 \\ -2 & 5
\end{pmatrix}$$
- for a given matrix size mxn, the matrix $0_{m\times n}$
- the 0 matrix leaves the other matrix unchanged.

## identity matrix

- in normal multiplication, $x \times 1$ is always x
- in matrices, the matrix X multiplied by the identity matrix is always X
- consider the matrix: $$\begin{pmatrix} 1 & 6 \\ -2 & 5 \end{pmatrix}$$
- then the identity matrix (1 0 \ 0 1) and multiplied $$\begin{pmatrix} 1 & 6 \\ -2 & 5 \end{pmatrix}\begin{pmatrix} 1 & 0 \\ 0 & 1
\end{pmatrix} = \begin{pmatrix}1 & 6 \\ -2 & 5 \end{pmatrix}$$

### consider non-square matrices

- consider the matrix: $$\begin{pmatrix} 6 & 1 & -4 \\ 8 & 0 & 2 \end{pmatrix}$$
- to multiply by a matrix and attain the same matrix: $$? \times \begin{pmatrix} 6 & 1 & -4 \\ 8 & 0 & 2 \end{pmatrix} = \begin{pmatrix} 6 & 1 & -4 \\ 8 & 0 & 2 \end{pmatrix}$$
  ? would be: $$\begin{pmatrix} 1 & 0 \\ 0 & 1 \end{pmatrix} \times \begin{pmatrix} 6 & 1 & -4 \\ 8 & 0 & 2 \end{pmatrix} = \begin{pmatrix} 6 & 1 & -4 \\ 8 & 0 & 2 \end{pmatrix}$$
- then what about the case where: $$\begin{pmatrix}
6&1&-4\\8&0&2
\end{pmatrix} \times ?= \begin{pmatrix}
6&1&-4\\8&0&2
\end{pmatrix}$$
- then: $$\begin{pmatrix}
6&1&-4\\8&0&2
\end{pmatrix} \times \begin{pmatrix}
1 & 0 &0\\0&1&0\\0&0&1
\end{pmatrix}= \begin{pmatrix}
6&1&-4\\8&0&2
\end{pmatrix}$$
- the notation of the identity matrix is $I_{x}$ with x being the dimensions (only 1 dimension is needed because the identity matrix is always square)

#### a word of warning

- the matrices A x B = C in which C is a 0 matrix, and A is not a matrix, B is **NOT ALWAYS** a 0 matrix.
- furthermore, in normal arithmetic, 3a = 3b, such a = b - therefore in matrices, AB = CB, therefore A = C - THIS IS INCORRECT - consider $$AB=\begin{bmatrix}
3&1\\1&4
\end{bmatrix},B=\begin{bmatrix}
1\\2
\end{bmatrix}, C=\begin{bmatrix}
-3&2\\5&2
\end{bmatrix}$$ - in this case AB = CB, B!=0, but A != C
- same case for identity matrices as well. you **CANNOT** assume an unknown matrix is the identity matrix.

## matrix division

- there is no concept of matrix division but theres something similar (?)
- consider multiplying 4 by 3
  - $3 \times 4 = 12$
- to get back to 4 from 12, you could divide 12 by 3
  - $12 \div 3 = 4$
- alternatively you could multiply 12 by $\frac{1}{3}$
  - $\frac{1}{3} \times 12 = 4$
- this is because $\frac{1}{3} \times 3 = 1$
- there is no division operation in matrix arithmetic, but we can use the second method to 'undo' multiplication by a matrix: $$AB=C$$
- to get B from C, multiply (on the left) by a matrix $A^{-1}$ such that $A^{-1}A=I$
  $$A^{-1}AB=A^{-1}C$$$$IB=A^{-1}C$$
  $$B=A^{-1}C$$
  the matrix $A^{-1}$ is called the inverse matrix.

#### how to find the inverse matrix

- given a matrix A, how do you find the inverse matrix $A^{-1}$
- messy process: - $2 \times 2$ case: - let: $$A=\begin{pmatrix}
a&b\\c&d
\end{pmatrix}$$ - we need to find the matrix $$A^{-1}=\begin{pmatrix}
w&x\\y&z
\end{pmatrix}$$ - preferably with $w,x,y$ and $z$ given in terms of $a,b,c$ and $d$. - we know that $A\times A^{-1}=I$ - blah blah blah rearrange expression you get (for the 2x2 case) - $w=\frac{d}{ad-bc}$ and blah blah for x, y, z
- therefore: for $$A=\begin{pmatrix}
a&b\\c&d
\end{pmatrix},A^{-1}=\frac{1}{ad-bc}\begin{pmatrix}
d&-b\\-c&a
\end{pmatrix}$$

#### (ad-bc) is the **determinant** of A, written det A or $\mid A\mid$

- it is possible that $\frac{1}{ad-bc}=0$
- a matrix with an inverse is **invertible**.
- a matrix with no inverse is **singular** (or just **non-invertible** lol)

## Recap

- multiplicative identity matrix
  - always a square, and when it is multiplied to a given matrix, the matrix remains unchanged.
- the inverse of a given matrix has the property of multiplying the given matrix to gain the identity matrix.
- to find the inverse of a 2x2 matrix
- for $$A=\begin{pmatrix}
a&b\\c&d
\end{pmatrix},A^{-1}=\frac{1}{ad-bc}\begin{pmatrix}
d&-b\\-c&a
\end{pmatrix}$$
- there may be a case where an inverse does not exist, which is where $\frac{1}{ad-bc}=0$

## solving a system of a linear equation (using matrices)

- x-y = 7
- 2x + 3y = 4
- you can extrapolate both systems into a linear equation (using coefficients)
  $$
  \begin{bmatrix}
  1&-1\\2&3
  \end{bmatrix}\begin{bmatrix}
  x\\y
  \end{bmatrix}=\begin{bmatrix}
  7\\4
  \end{bmatrix}
  $$
  ie coefficient matrix A x variable matrix = constant matrix
  the aim is to convert to the form: $$\begin{bmatrix}
x\\y
\end{bmatrix}=\begin{bmatrix}
a\\b
\end{bmatrix}$$
  where $a$ and $b$ are the solutions

### method

pre-multiply both sides by $A^{-1}$

$$
A^{-1}\begin{bmatrix}
1&-1\\2&3
\end{bmatrix}\begin{bmatrix}
x\\y
\end{bmatrix}=A^{-1}\begin{bmatrix}
7\\4
\end{bmatrix}
$$

$$
I\begin{bmatrix}
x\\y
\end{bmatrix}=\begin{bmatrix}
x\\y
\end{bmatrix}=A^{-1}\begin{bmatrix}
7\\4
\end{bmatrix}
$$

$$
A^{-1}=\frac{1}{5}\begin{bmatrix}
3&1\\-2&1
\end{bmatrix}
$$

$$
\begin{bmatrix}
x\\y
\end{bmatrix}=A^{-1}\begin{bmatrix}
7\\4
\end{bmatrix}=\frac{1}{5}\begin{bmatrix}
3&1\\-2&1
\end{bmatrix}\begin{bmatrix}
7\\4
\end{bmatrix}
$$

$$
=\frac{1}{5}\begin{bmatrix}
25\\-10
\end{bmatrix}=\begin{bmatrix}
5\\-2
\end{bmatrix}
$$

## matrix arithmetic

- recall that simulations solutions in 2 variables can have (lines intercept in one point)
- no solutions, or (lines parallel
- infinitely many solutions (lines coincident))
- if a coefficient matrix is non-invertible, it could either have no solutions, or infinitely many solutions.

## Matrices Transformation

- Shear: **not a part of the actual syllabus** ( i think ? ), but we are learning anyways.
- Transformation in the 2D plane r ways of systematically changing points P = (x, y) to points P' = (x', y') (e.g. (2, 5) reflected through the y-axis is (-2, 5))
  - you can describe these transformation by multiplying it by a 2x2 matrix.
- First P = (x, y) is written as a column matrix $\begin{bmatrix} x\\y\end{bmatrix}$

### basic idea

- start with (2, 3), to transform with $T=\begin{pmatrix} 1 & -2 \\ 3 & 1 \end{pmatrix}$:
- $\begin{pmatrix} 1&-2\\3&1 \end{pmatrix}\begin{pmatrix} 2\\3 \end{pmatrix}=\begin{pmatrix} -4\\9 \end{pmatrix}$
- so **(2, 3)** gets transformed to **(-4, 9)**
- translation is not a linear transformation, because it does not satisfy the linear transformation's definition of "the origin has to stay where it is", where if you translate the entire plane, the origin will move as well.
- reflection is only a linear transformation if it is on the line of the origin, otherwise the position of the origin is changed.

### how to find what kind of transformation a transformation matrix is (top secret pro tip 99.95% of matrix solvers dont know about)

- say you have the transformation matrix $\begin{bmatrix} 3&0\\0&1 \end{bmatrix}$, take the arbitrary values of x and y and apply the transformation on it. $$\begin{bmatrix} 3&0\\0&1 \end{bmatrix}\begin{bmatrix} x\\y \end{bmatrix}=\begin{bmatrix} 3x\\y \end{bmatrix}$$

## Transformation Matrices: Ultimate Guide

- Take the identity matrix $$\begin{bmatrix} 1&0\\0&1 \end{bmatrix}$$
- if you change $a$ in $\begin{bmatrix} a&0\\0&1 \end{bmatrix}$, if $a>0$, horizontal dilation by $a$, if $a<0$, reflection through y-axis combined with a horizontal dilation by a factor of $|a|$
- if you change $b$ in $\begin{bmatrix} 1&b\\0&1 \end{bmatrix}$, a horizontal shear occurs, where the transformation is dependent on how far away the point is from the x-axis.
- if you change $c$ in $\begin{bmatrix} 1&0\\c&1 \end{bmatrix}$, a vertical shear occurs, where the transformation is dependent on how far away the point is from the y-axis.
- if you change $d$ in $\begin{bmatrix} 1&0\\0&d \end{bmatrix}$, if $d>0$, vertical dilation by $d$, if $d<0$, reflection through x-axis combined with a horizontal dilation by a factor of $|d|$

## Rotation

- observe that for a given matrix $A=\begin{bmatrix} a & b \\ c & d \end{bmatrix}$, the following is true:
  $$\begin{bmatrix} a&b\\c&d \end{bmatrix}\begin{bmatrix} 1\\0 \end{bmatrix}=\begin{bmatrix} a\\c \end{bmatrix}$$
  $$\begin{bmatrix} a&b\\c&d \end{bmatrix}\begin{bmatrix} 0\\1 \end{bmatrix}=\begin{bmatrix} b\\d \end{bmatrix}$$
- if you know where the two points $\begin{bmatrix} 1 \\ 0 \end{bmatrix}$ and $\begin{bmatrix} 0 \\ 1 \end{bmatrix}$ lands, you can identify the rotation.
  in a 90 degree rotation:
- $\begin{bmatrix} 1 \\ 0 \end{bmatrix}$ lands on $\begin{bmatrix} 0 \\ -1 \end{bmatrix}$
- $\begin{bmatrix} 0 \\ 1 \end{bmatrix}$ lands on $\begin{bmatrix} 1 \\ 0 \end{bmatrix}$
- therefore the transformation matrix maps out to be: $\begin{bmatrix} 0 & 1 \\ -1 & 0 \end{bmatrix}$

## HOW TO: Matrices for Arbitrary Reflections and Rotations (WTF!!!!)

### general rotation

- rotate a unit by $\frac{\pi}{3}\degree$, the transformation matrix would be $\begin{bmatrix} 0.5 & -0.866 \\ 0.866 & 0.5 \end{bmatrix}$.
  - interesting. but what is the pattern here?
  - let's go back to what we learnt prior, and define the transformation matrix as transformations of $\begin{bmatrix} 0 \\ 1 \end{bmatrix}$ and $\begin{bmatrix}  1 \\ 0 \end{bmatrix}$
- the point $A=(1,0)$ would be transformed to $A'=(\cos \theta,\sin \theta)$
- the point $C = (0,1)$ would be transformed to $C' = (-\sin \theta,\cos \theta)$
- looks better with a graph - no wifi rn so just google "a general rotation about the origin graph for matrices" maybe comes up with a result lol xDDD ^\_^
  THEREFORE IT WOULD MAP TO
  $$\begin{bmatrix} \cos \theta & -\sin \theta \\ \sin \theta & \cos \theta \end{bmatrix}$$ where $\theta$ is an anti-clockwise rotation about the origin.
- THIS IS IN THE FORMULA BOOKLET! - NO NEED TO MEMORISE IT 8)

### general reflection

- once again, we need to find where the points A (1, 0) and B (0, 1) ends up after a reflection.
- search up "general reflection in a line that passes through the origin graph proof matrices" for a graph.
- the angle made with the x axis is twice the angle of the line of reflection (looks more obvious when you look at it), therefore (1, 0) maps to $(\cos 2\theta, \sin 2 \theta)$
- C (0, 1) maps to $(\sin 2 \theta, - \cos 2 \theta)$ (wow!)
  therefore the matrix for reflection is: $$\begin{bmatrix} \cos 2 \theta & \sin 2 \theta \\ \sin 2 \theta & - \cos 2 \theta \end{bmatrix}$$ where the reflection is in the line $y = x \tan \theta$
- once again, this is in the formula sheet, no need to memorise it.

## transformation matrices: combining transformation

- consider $A = \begin{bmatrix} 3 & 0 \\ 0 & 1 \end{bmatrix}$ (dilation by 3) and $B = \begin{bmatrix} 0 & -1 \\ 1 & 0 \end{bmatrix}$ (rotation $90\degree$ anti-clockwise around origin)
- how do you find the single transformation matrices that follows the transformation of A proceeded by B?
  - matrix multiplication.
- say you have the arbitrary values $\begin{bmatrix} x \\ y \end{bmatrix}$, and it is transformed by A, then we get $A \begin{bmatrix} x \\ y \end{bmatrix}$
- then multiplying $A \begin{bmatrix}  x \\ y \end{bmatrix}$ by B changes $A \begin{bmatrix}  x \\ y \end{bmatrix}$ to $B(A \begin{bmatrix}  x \\y \end{bmatrix})$ which equals $BA \begin{bmatrix} x \\ y \end{bmatrix}$
  > [!Warning]
  > NOTE THAT MULTIPLICATION IS IN REVERSE ORDER **A -> B** IS **BA**

## transformations of lines

- all points on the line $y=2x-3$ are transformed by the matrix $\begin{bmatrix} 1 & 2 \\ 1 & 0 \end{bmatrix}$. Find the equation of the image line.
  - let $(a,2a-3)$ be a point on the line $y=2x-3$
  - then $\begin{bmatrix} 1 & 2 \\ 1 & 0 \end{bmatrix} \begin{bmatrix}  a \\ 2a - 3 \end{bmatrix}=\begin{bmatrix} a + 4a - 6 \\ a \end{bmatrix}$
  - $= \begin{bmatrix} 5a - 6 \\ a \end{bmatrix}$
  - the image of $(a,b)$ is $(x,y)$, where $x = 5a - 6$ and $y=a$.
  - but $x = 5y - 6$,
  - $y=\frac{x+6}{5}=\frac{1}{5}x+\frac{6}{5}$

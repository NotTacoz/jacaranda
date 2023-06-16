---
title: "Matrices"
---

## Matrices Prequel: Linear Transformation
Transformation } Function
- Vector Input -> Vector output
- its raining so hard
- i love 3 blue 1 brown <3 go watch the video
Linear } 
$$\begin{bmatrix}  
a & b \\  c & d   
\end{bmatrix} \begin{bmatrix}
e \\ f
\end{bmatrix}=e\begin{bmatrix}
a \\ c
\end{bmatrix}+f\begin{bmatrix}
b \\ d
\end{bmatrix}=\begin{bmatrix}
ea + fb \\ ec + fd
\end{bmatrix}$$

## background
- used to represent linear transformations (like in computer animations)
- it is a rectangular (though often square) array of mathematical objects.
- if it has **m** rows and **n** columns, it is called an **m** x **n** matrix
- entries in the matrix can be indexed using subscripts for the row and column
	- $a_{13}$ is in  row 1, column 3 = 0
$$A=\begin{bmatrix}
3 & -1 & 0 \\ 4 & -2 & 3
\end{bmatrix}$$
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
1&6\\-2&5
\end{pmatrix}$$
- then: $$\begin{pmatrix}
1&6\\-2&5
\end{pmatrix}+\begin{pmatrix}
0&0\\0&0
\end{pmatrix}=\begin{pmatrix}
1&6\\-2&5
\end{pmatrix}$$
- for a given matrix size mxn, the matrix $0_{m\times n}$
- the 0 matrix leaves the other matrix unchanged.
## identity matrix
- in normal multiplication, $x \times 1$ is always x
- in matrices, the matrix X multiplied by the identity matrix is always X
- consider the matrix: $$\begin{pmatrix}
1&6\\-2&5
\end{pmatrix}$$
- then the identity matrix (1 0 \ 0 1) and multiplied $$\begin{pmatrix}
1&6\\-2&5
\end{pmatrix}\begin{pmatrix}
1&0\\0&1
\end{pmatrix}=\begin{pmatrix}
1&6\\-2&5
\end{pmatrix}$$
### consider non-square matrices
- consider the matrix: $$\begin{pmatrix}
6&1&-4\\8&0&2
\end{pmatrix}$$
- to multiply by a matrix and attain the same matrix: $$? \times \begin{pmatrix}
6&1&-4\\8&0&2
\end{pmatrix} = \begin{pmatrix}
6&1&-4\\8&0&2
\end{pmatrix}$$
? would be: $$\begin{pmatrix}
1 & 0 \\0&1
\end{pmatrix} \times \begin{pmatrix}
6&1&-4\\8&0&2
\end{pmatrix} = \begin{pmatrix}
6&1&-4\\8&0&2
\end{pmatrix}$$
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
- furthermore, in normal arithmetic, 3a = 3b, such a = b
	- therefore in matrices, AB = CB, therefore A = C
		- THIS IS INCORRECT
		- consider $$AB=\begin{bmatrix}
3&1\\1&4
\end{bmatrix},B=\begin{bmatrix}
1\\2
\end{bmatrix}, C=\begin{bmatrix}
-3&2\\5&2
\end{bmatrix}$$
			- in this case AB = CB, B!=0, but A != C
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
- messy process:
	- $2 \times 2$ case:
	- let: $$A=\begin{pmatrix}
a&b\\c&d
\end{pmatrix}$$
	- we need to find the matrix $$A^{-1}=\begin{pmatrix}
w&x\\y&z
\end{pmatrix}$$
	- preferably with $w,x,y$ and $z$ given in terms of $a,b,c$ and $d$.
	- we know that $A\times A^{-1}=I$
	- blah blah blah rearrange expression you get (for the 2x2 case)
	- $w=\frac{d}{ad-bc}$ and blah blah for x, y, z
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
$$\begin{bmatrix}
1&-1\\2&3
\end{bmatrix}\begin{bmatrix}
x\\y
\end{bmatrix}=\begin{bmatrix}
7\\4
\end{bmatrix}$$
ie coefficient matrix A x variable matrix = constant matrix
the aim is to convert to the form: $$\begin{bmatrix}
x\\y
\end{bmatrix}=\begin{bmatrix}
a\\b
\end{bmatrix}$$
where $a$ and $b$ are the solutions

### method
pre-multiply both sides by $A^{-1}$
$$A^{-1}\begin{bmatrix}
1&-1\\2&3
\end{bmatrix}\begin{bmatrix}
x\\y
\end{bmatrix}=A^{-1}\begin{bmatrix}
7\\4
\end{bmatrix}$$
$$I\begin{bmatrix}
x\\y
\end{bmatrix}=\begin{bmatrix}
x\\y
\end{bmatrix}=A^{-1}\begin{bmatrix}
7\\4
\end{bmatrix}$$
$$A^{-1}=\frac{1}{5}\begin{bmatrix}
3&1\\-2&1
\end{bmatrix}$$
$$\begin{bmatrix}
x\\y
\end{bmatrix}=A^{-1}\begin{bmatrix}
7\\4
\end{bmatrix}=\frac{1}{5}\begin{bmatrix}
3&1\\-2&1
\end{bmatrix}\begin{bmatrix}
7\\4
\end{bmatrix}$$
$$=\frac{1}{5}\begin{bmatrix}
25\\-10
\end{bmatrix}=\begin{bmatrix}
5\\-2
\end{bmatrix}$$
## matrix arithmetic
- recall that simulations solutions in 2 variables can have (lines intercept in one point)
- no solutions, or (lines parallel
- infinitely many solutions (lines coincident))
- if a coefficient matrix is non-invertible, it could either have no solutions, or infinitely many solutions.
---
title: "Some Induction Proofs"
---

2d ) prove each of the following divisibility statements by mathematical induction: $5^n+6\times 7^n +1$ is divisible by 4 for all $n \in \mathbb{N}$

- let the proposition P(n) be $5^n+6\times 7^n +1$ is divisible by 4
- assume that P(k) is true for some $k \in \mathbb{N}$
  - then $5^k+6\times 7^k +1$ is divisible by 4
  - P(k+1) = $5^{k+1}+6\times 7^{k+1} +1$
  - $5\times 5^k + 7 \times 6 \times 7^k +1$
  - $4(5^k+6\times 7^k)+(5^k + 6 \times 7^k + 1)+12\times 7^k$
  - all factors are divisible by 4, which means the equation is divisible by 4.

## formula for sums of series

- consider adding odd numbers
  - 1 = 1
  - 1 + 3 = 4
  - 1 + 3 + 5 = 9
  - 1 + 3 + 5 + 7 = 16
  - 1 + 3 + 5 + 7 = 25
- the sum of the first $n$ odd numbers seems to be $n^2$$$1+3+5+\dots+2n-1=n^2$$
- we want to prove that $$1+3+5+\dots+2n-1=n^2$$
- for all integers $n\geq 1$
  - Let P(n) stand for '$1+3+5+\dots+2n-1=n^2$'
  - First, prove P(1)
    - with $n=1$, LHS = $2\times {1}-1=1$ and RHS $=1^2=1$
    - Hence P(1) is true
  - Second, prove: If P(k) is true for some $k\geq 1$, then P(k+1) is also true.
    - Assume that P(k) is true for some $k \geq 1$
    - Then $1+3+5+\dots+2k-1 = k^2$
    - Now $1+3+5+\dots+2k-1+2(k+1)-1=k^2+2(k+1)-1$
    - $k^2 +2k+1=(k+1)^2$
    - That is, $1+3+5+\dots+2(k+1)-1=(k+1)^2$
    - Hence P(k+1) is also true.
  - We have shown that P(1) is true, and that if P(k) is true for some $k\geq 1$ then so is P(k+1).
  - Hence, by the principle of mathematical induction, P(n) is true for all $n \geq 1$.

## Common Errors: Evaluating LHS & RHS separately

- When showing an identity is true, you should not evaluate it by simplifying the Left Hand Side (LHS) and Right Hand Side (RHS) separately.
- e.g. Let P(n) be the proposition that $$'1^2 + 2^2 + \dots+ n ^2 = \frac{n(n+1)(2n+1)}{6}'$$
  - with n=1, LHS of P(1) $=1^2$
  - RHS of P(1) $=\frac{1(1+1)(2(1)+1)}{6}=\frac{1(2)(3)}{6}=\frac{6}{6}=1$
  - $\therefore P(1)$ is true

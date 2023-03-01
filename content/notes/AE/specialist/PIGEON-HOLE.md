---
title: "pigeonhole principle"
---
[go back](notes/subsections/spec.md)

*based on the cambridge seniors maths chapter 1H*

# Pigeonhole principle
> If n+1 or more objects are placed into n holes, then some hole contains at least two objects

> ### Example 31
> You have 13 red, 10 blue and 8 green socks. How many socks need to be selected at random to ensure that you have a matching pair.
> 
> #### Solution:
> Label three holes with the colours red, blue and green.
> R B G
> Selecting just three socks is clearly not sufficient, as you might pick one sock colour. Selet four socks and place each sock into the hole corresponding to the colour of the sock. As there are four socks and three holes, the pigeonhole principle guarantees that some hole contains at least two socks. This is the required pair.

# Generalised Pigeonhole principle
> If at least mn + 1 objects are placed into n holes, then some hole contains at least m + 1 objects

> ### Example 33
> Sixteen natural numbers are written on a whiteboard. Perove that at least four numbers will leave the same remainder when divided by 5.
> 
> #### Solution
> We label five holes with each of the possible remainders on division by 5.
> 0 1 2 3 4 
> There are 16 numbers to be placed into five holes. Since $$16 = 3 \times 5+1$$there is some hole with at least 4 numbers, each of which leaves the same remainder when divided by 5.
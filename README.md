# Turmite Playground

A Pen created on CodePen.io. Original URL: [https://codepen.io/tsuhre/pen/JrYXEr](https://codepen.io/tsuhre/pen/JrYXEr).

Turmites are a more general version of Langtons Ant: relying on a state machine between the ant and the cell data. for more information on Tumites see the following link:

https://en.wikipedia.org/wiki/Turmite

The truth table is set up in the following way: each column indicates a new color that the turmite can record, and each row represents a state. The data inside the input box at row[state], col[color] will be called for each the program.

The data inside each cell is formatted as a comma delimited tuple of the form "a, b, c" where:
a = the value to set the color to
b = the number of 90 degree turns by which to turn the ant
c = the value to set the state of the ant to

a lank, negative, or out of bounds value will be interepreted as -1 in the tuple, the "do nothing" state.

Converting the wiki format:
ex: {{{1, 1, 1}, {1, 8, 0}}, {{1, 2, 1}, {0, 1, 0}}}
becomes:
[1, 0, 1]  [1, 3, 0]
[1, 1, 0]  [0, 0, 0]
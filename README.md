# SnakeGame

This project uses the base to my search algorith visualizer (a canvas grid).

I made two classes: Snake and Berry.  The snake stores the body's coordinates in an array and has a render function that draws squares for each coordinate.  
The snake also has a function `updateUsingDirection`.  This function taken in a `Direction` object and updates the snake array by shifting the tail and adding a new head in the direction specified.  WASD and arrow keys both work.  However, pressing the arrow keys effectively presses the start button.  WASD doesn't start the update function because the user could be putting in their name for high scores.
Ideally, I would be saving the high scores in a text file or in a server/db using an external service.  
## If anyone knows how to do this, it would be a great help to me! 

Next steps:

- [x] Use A* or BFS algo to have computer play the game and do well
- [ ] Let user choose size
- **If anyone is looking at my project, let me know some suggestions**

# minesweeper

![thumbnail](/thumbnail.jpg)

**Week 8 + 9: 11/12 - 11/25**

A recreation of Minesweeper in React

**Goals:** Create simple Minesweeper game with adjustable game width, height, and mine count.

11/14: Created initial project, built basic UI layout and set up game parameters in changable state bound inputs. Built Game and Tile components and begain rendering game board. Built useWindowDimensions hook for detecting current window size.

11/17: Transferred state into GlobalContext, updated components to work with context, modified board update behavior (added update button instead of dynamic updates), and added default tile image.

11/19: Overhauled board generation to calculate cell mine count values, added remaining images for tiles and updated Tile component to display correct image for it's value. Fixed bugs around board resizing and updating.

11/21: Added visited / not visited states to tiles, added left/right click detection and built depth first search algorithm for finding adjacent empty tiles.

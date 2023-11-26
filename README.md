# minesweeper

![thumbnail](/thumbnail.jpg)

**Week 8 + 9: 11/12 - 11/25**

A recreation of Minesweeper in React

**Goals:** Create simple Minesweeper game with adjustable game width, height, and mine count.

11/14: Created initial project, built basic UI layout and set up game parameters in changable state bound inputs. Built Game and Tile components and begain rendering game board. Built useWindowDimensions hook for detecting current window size.

11/17: Transferred state into GlobalContext, updated components to work with context, modified board update behavior (added update button instead of dynamic updates), and added default tile image.

11/19: Overhauled board generation to calculate tile mine count values, added remaining images for tiles and updated Tile component to display correct image for it's value. Fixed bugs around board resizing and updating.

11/21: Added visited / not visited states to tiles, added left/right click detection and built depth first search algorithm for finding adjacent empty tiles.

11/24: Updated empty tile search algorithm to reveal adjacent tiles, consolidated context tileValue and tileState arrays into a single array using objects, and updated components to work with new state structure. Updated board generation to reduce re-renders in Game component, improved flagging functionality, added new images for mines and flagged tiles, added image for flagged tiles with no mines, added gameActive state to context and disabled Tile interaction when gameActive is false. Updated naming conventions across project for consistency and added missing documentation.

11/25: Overhauled header UI and game info, added reset button and win / lose message, improved header scaling, updated context to check for game win / loss.

**Reflections/Improvements for future:** I was able to implement almost everything I wanted to in this project, the only other additions I had in mind was adding a scale parameter to the board to allow zooming, and creating a correctly sized board for the window size on load (this could be an easy update). Otherwise the game is fully functional in all aspects and can be as large as it's window size allows.

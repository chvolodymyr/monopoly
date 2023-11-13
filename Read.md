# Monopoly game on js

## You could play here

## Key Features

- **Pure JavaScript and HTML**: The game logic is implemented entirely in JavaScript.
- **Design Patterns**: Utilizes Factory, Observer, Singleton, and Dependency Injection patterns for efficient and modular code structure.

## Game Rules
- The game follows the standard Monopoly rules.
- Players can roll dice, buy properties, pay rent, and more.
- Special handling for players in jail: rolling doubles to get free, etc.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Running the Application

#### Prerequisites

- [Node.js and npm](https://nodejs.org/en/download/) (Node.js 14.x or newer)
- [Parcel](https://parceljs.org/) for building and running the project.

```bash
git clone https://github.com/chvolodymyr/monopoly.git
cd monopoly
```
Start the development server using Parcel:


```bash
npm run start
```

The game will be available at http://localhost:1234 (or a similar local URL shown in your terminal).

####  Building for Production
To build the application for production, run:

```bash
npm run build
```
This will generate the dist folder, which you can deploy to your production server.


### To do
- [ ] Allow user to build houses and hotels 
- [ ] Update design
- [ ] Create server for online game 
# D20CCC - Homebrew D&D 5.0 Character Creation Tool

A comprehensive web application for creating and managing characters for the Homebrew D&D 5.0 (HB-5.0) tabletop RPG system. Built with React and Vite, this tool provides an intuitive multi-step wizard for character generation with 16 playable species, biological variants (Sub-Species), heritage options, and detailed stat management.

## Features

- **Multi-Step Character Creation Wizard**: Guided experience through race, sub-species, heritage, class, and stat allocation
- **16 Playable Species**: Beastman, Celestial Primate, Cerealian, Galactic Citizen, Android, Arcosian, Chronin, Demon Realm Denizen, Grey, Majin, Namekian, Neko Majin, Neo Machine Mutant, Sateery, Saiyan, Xeno, Yardratian, Zoolatar
- **Sub-Species System**: Biological variants for each species with unique mechanical features
- **Heritage System**: Optional heritage selection with feature replacement mechanics (swap up to 3 race features)
- **4 Character Classes**: Martial Artist, Blaster, Brawler, Mystic
- **Flexible Stat Management**: Three methods - Point Buy (27 points), Standard Array (16,14,13,12,10,8), or Random Roll (4d6 drop lowest)
- **Character Persistence**: Save and load characters using browser localStorage
- **Comprehensive Character Sheet**: Full character details with stats, features, race/class information
- **Modern UI**: Built with React icons (Lucide) for intuitive visual design

## Game System

This character creation tool implements the **Homebrew D&D 5.0 (HB-5.0)** system, a custom tabletop RPG inspired by D&D 5th Edition with unique mechanics:

- **Species**: 16 playable character species with 4-5 unique racial features each
- **Sub-Species**: Biological variants providing mechanical benefits and flavor
- **Heritages**: Optional cultural/heritage variants allowing feature customization
- **Classes**: Four distinct character classes with unique class features
- **Attributes**: Core ability scores plus specialized mechanics for skills and techniques
- **Local Storage**: Characters are saved to browser localStorage for easy access

## Character Creation Flow

1. **Race Selection** - Choose from 16 playable species
2. **Race Features** - Review stat bonuses and racial abilities
3. **Sub-Species Selection** - Pick a biological variant with mechanical features
4. **Heritage Selection** - Optionally choose a heritage
5. **Feature Replacement** - Swap up to 3 race features for heritage features
6. **Class Selection** - Pick from 4 character classes
7. **Class Features** - Review class abilities
8. **Stat Assignment** - Allocate ability scores using preferred method
9. **Character Summary** - Review and finalize character

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

### Development

Start the development server with hot module reload:

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Building

Build for production:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## Project Structure

```
src/
├── App.jsx                          # Main application component
├── main.jsx                         # React entry point
├── App.css                          # Main styles
├── index.css                        # Global styles
├── assets/                          # Static assets
└── components/
    ├── Charactermancer.jsx          # Character creation wizard (762 lines)
    │                                 # - Multi-step form state management
    │                                 # - Race, class, stat allocation logic
    │                                 # - Character saving to localStorage
    ├── CharacterSheet.jsx           # Character display and editing
    │                                 # - Full character details
    │                                 # - Feature calculations
    │                                 # - Character persistence
    └── Styles/
        ├── Charactermancer.css      # Wizard styling
        └── CharacterSheet.css       # Sheet styling
```

## Tech Stack

- **React** 19.2.0 - UI framework with modern hooks
- **Vite** 7.2.4 - Fast build tool with HMR
- **Lucide React** 0.554.0 - Icon library
- **ESLint** - Code quality enforcement
- **React Compiler** - Performance optimization
- **localStorage API** - Client-side character persistence

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint checks
- `npm run preview` - Preview production build

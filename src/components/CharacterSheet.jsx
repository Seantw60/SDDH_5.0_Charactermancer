import { Zap } from 'lucide-react';
import './Styles/CharacterSheet.css';

const CORE_STATS = ['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA'];

const RACE_DATA = {
  Beastmen: 
  { name: 'Beastmen', features: [
    { name: 'Animal Lineage', description: 'Your animal nature shows itself in a variety of ways. You must choose your Lineage from the following list, detailed at the end of this Race: Aquatic, Avian, Insect, Mammal, Reptile' }, 
    { name: 'Bestial Characteristics', description: 'Requires: Animal Lineage Racial Feature. You possess natural strengths that are not commonplace among other humanoids. Choose two options from the Bestial Characteristcs List listed at the end of this Race, these can not be changed later.' },
    { name: 'Know-How', description: 'Due to the ever changing nature of your life, it has become easier to learn things as you go and make the best of every opportunity to do so. Whenever a Level-Up would not grant you a Technique, you gain one, and you gain an additional Technique every Level beyond 20. Additionally, you gain 1 additional Training Boon each time you have a Training Arc.' },
    { name: 'More "Beast" than "Man"', description: 'You are closer to being a large animal than other intelligent species. You are treated as a Beast instead of a Humanoid to any Effect that would check what kind of Creature you are.' },
    { name: 'Primal Energy', description: 'You are far more physically fit than most other humanoid races. At 1st Level and every time you Level-Up you gain +1 to your Maximum Stamina Points.' },
    ] 
},
  Cerealians: 
  { name: 'Cerealians', features: [
    { name: 'Cerealians Focus', description: 'As a Bonus Action on your turn you may spend 1 Stamina to gain advantage on all Ranged Weapon Attack Rolls and Basic Ki Blasts until the end of your next turn. You may do this a number of times equal to your Proficiency Bonus per Long Rest.' }, 
    { name: 'Hyper Reflexes', description: 'Your brain is evolved to take on more information than others. You gain an additional Reaction each round that can only be used for an Attack of Opportunity, Clash Stamina Manuever, or the Interception Stamina Manuever.' },
    { name: 'Red Eye Of The Cerealians', description: 'Cerealians are born with a strange quirk, a single hyper-evolved red eye. Your right eye becomes a Hyper Focused Red-Eye and you gain the Red Eye Focus Power-Up so long as you have that eye. Additionally, each time you Rank Up you gain one Red Eye Focus Form-Specific Modification.' }, 
    { name: 'Laser Sight', description: 'Your supernatural aim allows you to make every shot a little more deadly. Your first Ranged Weapon Attack each turn deals additional Damage equal to double your Proficiency Bonus.' },
    { name: 'Tenacity', description: 'Once per Long Rest when you would hit 0 HP you instead drop to 1 HP.' }        
    ] 
},  
  Saiyan: 
  { name: 'Saiyan', features: [
    { name: 'Saiyan instincts', description: 'You add your Proficiency Bonus to Initiative and can act normally on the first round of combat even when Suprised. Additionally, you may learn Saiyan Tactics Trained Features as if they were Mortal Trained Features.' }, 
    { name: 'Saiyan Lineage', description: 'Your Saiyan genes vary slightly the mix of Saiyans following the tournament of power. Regardless of your choice, you are eligible for the Super Saiyan God God Form and its ritual. You gain access to Saiyan Lineage Feats and you must choose your Lineage from the following list, detailed at the end of this Race: Universe 7 "Child of the Great Ape", Universe 6 "Masters of Super Saiyan".' },
    { name: 'Super Saiyan', description: 'The golden form of legend. At Level 5 you gain the Super Saiyan Transformation. Additionally, you gain access to Super Saiyan Form-Specific Modifications as listed in the Form-Specific Modifications Section.' }, 
    { name: 'Super Stomach', description: 'A race as powerful as the Saiyans requires extraordinary caloric intake. You require twice as much food as normal to avoid Exhaustion, however anytime that you eat an Attack Cuisine or a unit of Rations you regain 1d4 Stamina. This benefit becomes 2d4 Stamina at 10th Level.' },
    { name: 'Zenkai Boost', description: 'When pushed to near death the saiyan spirit is known to rebel against the threat of death, creating a stronger warrior when they are pushed to near death. Whenever you fail a Death Saving Throw, roll a d20 Check with a DC starting at 6, increasing by 2 each time you succeed. On a Success you gain 1 Training Boon. You may use this Training Boon immediately or as soon as you regain conciousness for the chance at a second Zenkai Boost. This Feature only activates in times of Mortal Peril, your DM may decide that the situation doesnt warrant a high enough threat level to induce growth.' }, 
    { name: 'Universe 7 "Child of the Great Ape"', description: 'You gain access to Saiyan Feats with the U7 Tag and Feats in the Universe 7 Saiyan section. You also gain the Saiyan Pride , Saiyan Tail, and Warrior Race Features: Ruthless and battle hungry, Universe 7 Saiyans lived many years as planet conquerors and soldiers with the help of their tail and the mighty great ape transformation. Saiyan Tail, Saiyan Pride, Warrior Race.' },
    { name: 'Universe 6 "Masters of Super Saiyan"', description: 'You gain access to Saiyan Feats with the U6 Tag and Feats in the Universe 6 Saiyan section. You also gain the Super Saiyan Superiority Feature: Otherwise known as Tail-less Saiyans, these are an alternate, or perhaps even future, evolution to the Universe 7 Saiyans. These Saiyans eventually lost their tails, replacing them with much higher S-Cells numbers. This change resulted in stronger, though slower to obtain, Super Saiyan Forms. Decades of Experience, Evolved Energy, Super Saiyan Superiority.' },                      
    ] 
},
Ogre: 
  { name: 'Ogre', features: [
    { name: 'Battle Cry', description: 'Ogres have a natural ability to inspire anger and aggression from those near them. You gain the following Omni Technique and it\'s rank matches your Ki Rank: Battle Cry' }, 
    { name: 'Defender of HFIL', description: 'Your body is capable of being on the mortal planes but was designed for Otherworld. You gain the Infernal Tag and you may perform a Power Strike Manuever by expending Ki Points instead of Stamina at a rate of 10 Ki Points per Stamina Point you would expend.' },
    { name: 'Muscular Durability', description: 'Your body is unnaturally durable. You gain Damage Reduction equal to your Ki Rank.' },
    { name: 'Ogre Stamina', description: 'Your unique biology makes you longer winded than most species. You gain +1 Stamina at Level 1 and everytime you Level Up.' },
    { name: 'Ogres Endurance', description: 'As an Action on your turn, you may spend Stamina to gain Xd12 Temporary HP where X is equal to the Stamina spent. This Temporary HP disappears after 1 hour or whenever you gain another source of Temporary HP.' }
    ] 
},
  Arcosian: 
  { name: "Arcosian", features: [
    { name: 'Arcosian Lineage', description: 'Certain variations in genetics have appeared between the different tribes that have appeared throught the Universes. You must choose your Lineage from the following list, detailed at the end of this Race: Cold Tribe, Hero Tribe.' }, 
    { name: 'Galactic Lords', description: 'Long ago your people were known for traveling the stars and conquering other planets. You do not need to breathe and have Resistance to Cold Damage as your body is designed to explore the vast reaches of space.' },
    { name: 'Incredible Potential', description: 'The emperors of old thrived by their incredible potential that was used to great, though simple, effect as many never sought out to find the depts of said potential. You gain an additional Training Boon anytime you have a Training Arc.' }, 
    { name: 'Short Fuse', description: 'You have inherited the same temper as the Arcosians of the past. A number of times per Long Rest equal to your Ki Rank you may gain the Enraged Condition.' },
    { name: 'Strong Carapice', description: 'Your exoskeleton is strong and capable of cushioning the more vital parts of your anatomy. You gain Resistance against Bludgeoning, Piercing, and Slashing Damage. Additionally, at 10th Level you gain Resistance to Energy Damage.' }, 
    { name: 'Cold Tribe', description: 'Long ago this Tribe controlled vast stretches of the known Universe, made famous by a small group of Mutants of the Tribe. While most never reach the caliber of the great Lord Frieza, the Tribe as a whole still greatly resemble the Tyrant of old. You gain the following benefit: Gated Power.' },
    { name: 'Hero Tribe', description: 'After the destruction of the Cold Empire it took many years for the members of the Hero Tribe to rejoin the greater society without predjudice. Metamorphosis.' }            
    ] 
},
  Namekian: 
  { name: 'Namekian', features: [
    { name: 'Namekian Assimilation', description: 'As a highly spiritual demonic race, Namekian are capable of assimilating other willing Namekians into themselves to create a stronger being. As an Action on your Turn you may touch a willing Namekian and Assimilate them, turning you into a Namekian Fusion. When you Assimilate a Namekian you record the Creature and their Assimilated Power, as described below, and gain the Super Namekian Power-Up. You gain the Creature\'s Assimilated Power unless an effect would cause you to seperate from an Assimilated Creature. You may Assimilate a number of Namekians equal to half of your Proficiency Modifier, rounded up. Additionally, a Namekian that has already Assimilated another using this Feature transfers all of their Assimilations to the Namekian that Assimilated them. Assimilated Power: Record the Creature\'s highest Ability Score and increase your own matching Ability Score by 1. Record and gain all of the Creature\'s Techniques. Duration of a Namekian Fusion: A Namekian Fusion has Maximum Stability Hit Points equal to 5x the number of Assimilated Namekians and has one Assimilated Namekian seperated from them for each 5 Stability Hit Points that they lose. Alternatively, a Wish Spell or use of a set of Dragon Balls can undo the Assimilation effect.' }, 
    { name: 'Namekian Biology', description: 'Namekians do not eat and survive only off of water. Due to this liquid nature namekians are able to stretch thier limbs for combat and utility purposes. Your Unarmed Strikes, Melee Weapon Attacks and Armed/Unarmed Techniques gain 5 feet of the Reach Property equal to your Ki Rank. When you make a Grapple Check you count as 1 Size Category larger for each rank of Reach Property.' },
    { name: 'Namekian Lineage', description: 'The Clan you originate from heavily impacts your abilities as a Namekian. At 1st Level you must choose one Lineage to gain the benefits from, detailed at the end of this Race: Dark Clan Namekian, Dragon Clan Namekian, Warrior Clan Namekian.' }, 
    { name: 'Sounds of the Universe', description: 'The ears of Namekians are fine-tuned to hear oncoming noises so that they may hear danger encroaching on their homeworld. You gain a Static Bonus to hearing based Perception Checks and Passive Perception equal to your Proficiency Bonus. Additionally should you gain the ability to Sense Ki, you may hear the surroundings of any creature you Sense. Unfortunately your incredible hearing comes at a cost, you gain Vulnerability to Thunder Damage.' },
    { name: 'Telepathy', description: 'Namekians can speak telepathically to anyone within a mile that they know well. This range is increased to 10 miles at Level 5, Continent-wide at Level 10, Planet-wide at Level 15, and Galaxy-wide at Level 20. This Feature can also target any creature who you can find through Sense Ki, so long as it is not from a Scouter.' }, 
    { name: 'Dark Namekian', description: 'These Namekians are hardier than most and are usually demonized in Namekian Society due to their duller colors and lack of distinct Namekian abilities. Dark Namekians have mastered their own regenerative capability, some say they evolved purely to combat the raging discrimination they once faced. You gain the following benefits: Demonic Durability, Hellish Regeneration.' },
    { name: 'Dragon Clan', description: 'Those attuned to the spirit of Zalama the dragon god. these namekians are spiritually gifted and some even manage to emulate Zalama himself by creating Dragon Balls. You gain the following benefits: Ancient Teachings, Draconic Blessing.' },
    { name: 'Flexible Limbs', description: 'Increased reach for Unarmed Attacks.' }                
    ] 
},
  GalacticCitizen: 
  { name: 'Earthling', features: [
    { name: 'Heroic Nature', description: 'A life of strife and growth has led to you having stores of heroism that those that are stronger still find hard to emulate. At 1st Level and everytime you Rank Up you gain one Heroic Feature of your choice, this does not count as gaining a Heroic Feature as a Class Feature.' }, 
    { name: 'Indomitable Will', description: 'Your determination to live is stronger than most. Once per Long Rest when you drop to 0 Hit Points, but are not killed outright, you may instead drop to 1 Hit Point.' },
    { name: 'Know-How', description: 'Due to the ever changing nature of your life, it has become easier to learn things as you go and make the best of every opportunity to do so. Whenever a Level-Up would not grant you a Technique, you gain one, and you gain an additional Technique every Level beyond 20. Additionally, you gain 1 additional Training Boon each time you have a Training Arc.' },
    { name: 'Strange Quirks', description: 'Requires: Humanoid Lineage Many humanoids possess minor differences that set them apart from each other. Choose two options from the Quirks List listed at the end of this Race, these can not be changed later.' },
    { name: 'I can figure this out, right?', description: 'You gain a bonus to any Skill Check involved with using an Item or Vehicle that you are not Proficient with equal to 1/3 of your Proficiency Bonus, rounded up.' },
    { name: 'Intelligent Ape', description: 'Your deep-rooted ape biology has its advantages, including an ease at learning the basics. All Rank 1 Techniques that you learn immediately gain 1 Rank of Mastery.' }         
    ] 
},
};

const CLASS_DATA = {
    MartialArtist: { name: 'Martial Artist', features: [{ name: 'Rapid Strike', description: 'One additional Unarmed Attack on hit.' }] },
    Blaster: { name: 'Blaster', features: [{ name: 'Ki Reservoir', description: 'Increased max Ki.' }] },
    Brawler: { name: 'Brawler', features: [{ name: 'Durable Frame', description: 'Use Reaction for Damage Reduction.' }] },
    Mystic: { name: 'Mystic', features: [{ name: 'Utility Technique', description: 'Learn one utility Technique at half Ki Cost.' }] },
};

const SUB_SPECIES_DATA = {
  Saiyan: {
    'Standard': {
      name: 'Standard Saiyan',
      description: 'A typical member of the Saiyan race with balanced traits.'
    },
    'Half-Saiyan': {
      name: 'Half-Saiyan',
      description: 'Born from a Saiyan and non-Saiyan union, inheriting traits from both.'
    },
    'Mutant': {
      name: 'Mutant Saiyan',
      description: 'A rare genetic variation with unique biological advantages.'
    },
    'Ancient': {
      name: 'Ancient Saiyan',
      description: 'A Saiyan from ages past, with primal power and ancient techniques.'
    },
    'Legendary': {
      name: 'Legendary Saiyan',
      description: 'Born once in a thousand years, possessing legendary power.'
    }
  },
  Arcosian: {
    'Standard': {
      name: 'Standard Arcosian',
      description: 'A typical member of the Arcosian race.'
    },
    'Royal': {
      name: 'Royal Arcosian',
      description: 'Born into nobility with enhanced status and authority.'
    },
    'Hybrid': {
      name: 'Hybrid Arcosian',
      description: 'Arcosian with mixed heritage from another race.'
    },
    'Mutant': {
      name: 'Mutant Arcosian',
      description: 'A genetic anomaly with unusual biological traits.'
    }
  },
  Namekian: {
    'Standard': {
      name: 'Standard Namekian',
      description: 'A typical member of Namekian society.'
    },
    'Regenerated': {
      name: 'Regenerated Namekian',
      description: 'A Namekian recreated through regeneration, retaining previous memories.'
    },
    'Pure-Hearted': {
      name: 'Pure-Hearted Namekian',
      description: 'A Namekian born with exceptional spiritual purity.'
    },
    'Corrupted': {
      name: 'Corrupted Namekian',
      description: 'A Namekian influenced by dark or corrupting forces.'
    }
  },
  Beastmen: {
    'Standard': {
      name: 'Standard Beastman',
      description: 'A typical Beastman with balanced animal traits.'
    },
    'Feral': {
      name: 'Feral Beastman',
      description: 'A Beastman with dominant animal instincts and primal behavior.'
    },
    'Hybrid': {
      name: 'Hybrid Beastman',
      description: 'A Beastman with mixed heritage from multiple animal types.'
    }
  },
  Cerealians: {
    'Standard': {
      name: 'Standard Cerealian',
      description: 'A typical Cerealian from nomadic lineage.'
    },
    'Ascendant': {
      name: 'Ascendant Cerealian',
      description: 'A Cerealian who has achieved a higher state of evolution.'
    },
    'Ancient': {
      name: 'Ancient Cerealian',
      description: 'A Cerealian from the old homeworld era.'
    }
  },
  GalacticCitizen: {
    'Standard': {
      name: 'Standard Earthling',
      description: 'A typical human from Earth.'
    },
    'Enhanced': {
      name: 'Enhanced Earthling',
      description: 'An Earthling with exceptional natural abilities.'
    },
    'Hybrid': {
      name: 'Hybrid Earthling',
      description: 'An Earthling with non-human ancestry.'
    }
  },
  Ogre: {
    'Standard': {
      name: 'Standard Ogre',
      description: 'A typical Ogre from the Otherworld.'
    },
    'Pure-Blooded': {
      name: 'Pure-Blooded Ogre',
      description: 'An Ogre with unbroken Otherworldly lineage.'
    },
    'Hybrid': {
      name: 'Hybrid Ogre',
      description: 'An Ogre with mixed heritage from the mortal realm.'
    }
  }
};

const SUB_RACE_DATA = {
  Saiyan: {},
  Arcosian: {},
  Namekian: {},
  Beastmen: {},
  Cerealians: {},
  GalacticCitizen: {},
  Ogre: {}
};

const CharacterSheet = ({ characterData, onReturn, onFinish }) => {
    if (!characterData || !characterData.finalStats) return <div className="error-msg">No Data</div>;

    const { name, race, class: charClass, level, finalStats, subSpecies, subRace, replacedFeatures } = characterData;
    
    // Get race features and replace ones based on selection
    let raceFeatures = RACE_DATA[race]?.features || [];
    const subRaceData = SUB_RACE_DATA[race]?.[subRace];
    
    // Create a map of replaced feature names
    const replacedFeaturesSet = new Set(replacedFeatures || []);
    
    // Filter out replaced features and add sub-race features
    raceFeatures = raceFeatures.filter(f => !replacedFeaturesSet.has(f.name));
    
    if (subRaceData) {
        const subRaceFeatures = subRaceData.features.filter(f => replacedFeaturesSet.has(f.name));
        raceFeatures = [...raceFeatures, ...subRaceFeatures];
    }
    
    const classFeatures = CLASS_DATA[charClass]?.features || [];
    
    const getStatModifier = (score) => Math.floor((score - 10) / 2);
    const proficiencyBonus = Math.floor((level - 1) / 4) + 2;

    const mockAC = 10 + getStatModifier(finalStats.DEX);
    const mockMaxHP = 10 + (level * 8) + (level * getStatModifier(finalStats.CON));
    const mockSpeed = 30;

    const skillMap = {
        'Acrobatics (Dex)': 'DEX', 'Athletics (Str)': 'STR', 'Insight (Wis)': 'WIS', 
        'Intimidation (Cha)': 'CHA', 'Perception (Wis)': 'WIS', 'Stealth (Dex)': 'DEX'
    };

    return (
        <div className="sheet-container">
            <header className="sheet-header">
                <h1>{name}</h1>
                <div className="header-meta">
                    <span>Level {level} {race}{subSpecies ? ` (${SUB_SPECIES_DATA[race]?.[subSpecies]?.name || subSpecies})` : ''}{subRace ? ` - ${SUB_RACE_DATA[race]?.[subRace]?.name || subRace}` : ''} {charClass}</span>
                    <span>Background: Hero</span>
                </div>
            </header>

            <div className="sheet-body">
                {/* LEFT COLUMN: STATS */}
                <div className="col-stats">
                    <div className="pb-box">Proficiency: <span>+{proficiencyBonus}</span></div>
                    {CORE_STATS.map(stat => {
                        const mod = getStatModifier(finalStats[stat]);
                        return (
                            <div key={stat} className="stat-row">
                                <div className="stat-label">
                                    <strong>{stat}</strong>
                                    <small>Mod: {mod >= 0 ? '+' : ''}{mod}</small>
                                </div>
                                <div className="stat-val">{finalStats[stat]}</div>
                            </div>
                        );
                    })}
                </div>

                {/* CENTER COLUMN: COMBAT */}
                <div className="col-combat">
                    <div className="vital-stats">
                        <div className="vital-box ac">
                            <label>AC</label>
                            <div className="val">{mockAC}</div>
                        </div>
                        <div className="vital-box hp">
                            <label>Max HP</label>
                            <div className="val">{mockMaxHP}</div>
                        </div>
                        <div className="vital-box speed">
                            <label>Speed</label>
                            <div className="val">{mockSpeed}</div>
                        </div>
                    </div>

                    <div className="attacks-section">
                        <h3><Zap size={16}/> Attacks</h3>
                        <div className="attack-row">
                            <span>Unarmed Strike</span>
                            <span className="atk-bonus">+{getStatModifier(finalStats.STR) + proficiencyBonus}</span>
                            <span className="atk-dmg">1d4 + {getStatModifier(finalStats.STR)}</span>
                        </div>
                        <div className="attack-row">
                            <span>Ki Blast</span>
                            <span className="atk-bonus">+{getStatModifier(finalStats.WIS) + proficiencyBonus}</span>
                            <span className="atk-dmg">1d4 + {getStatModifier(finalStats.WIS)}</span>
                        </div>
                    </div>
                </div>

                {/* RIGHT COLUMN: FEATURES */}
                <div className="col-features">
                    <div className="features-list">
                        <h3>Race Features</h3>
                        {raceFeatures.slice(0, 3).map((feature, i) => (
                            <div key={i} className="feature-item">
                                <strong>{feature.name}</strong>
                                <p>{feature.description}</p>
                            </div>
                        ))}
                    </div>
                    <div className="features-list">
                        <h3>Class Features</h3>
                        {classFeatures.map((feature, i) => (
                            <div key={i} className="feature-item">
                                <strong>{feature.name}</strong>
                                <p>{feature.description}</p>
                            </div>
                        ))}
                    </div>
                    <div className="resource-box">
                        <div>Ki Points: <strong>50</strong></div>
                        <div>Forms: <strong>1</strong></div>
                    </div>
                </div>
            </div>

            <footer className="sheet-footer">
                <button className="btn neutral" onClick={onReturn}>Back to List</button>
                <button className="btn success" onClick={onFinish}>Load to VTT</button>
            </footer>
        </div>
    );
};

export default CharacterSheet;
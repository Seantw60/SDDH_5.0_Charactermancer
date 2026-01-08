import { useState, useMemo, useEffect } from 'react';
import { Zap, Shield, Heart, User, Sword, Bolt, HardHat, Sun, Aperture, Dice6, CheckCircle, List, ArrowLeft } from 'lucide-react';
import CharacterSheet from './CharacterSheet';
import './Styles/Charactermancer.css';

// --- GAME DATA CONSTANTS ---
const CORE_STATS = ['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA'];
const POINT_BUY_BUDGET = 27;
const STANDARD_ARRAY_SCORES = [16, 14, 13, 12, 10, 8];

const RACE_DATA = {
Beastmen: 
  { name: 'Beastmen', icon: <HardHat size={24} />, 
  summary: 'Humanoid animals created through temporary shapeshifting drug that became permanent. Most possess animal features from desirable beasts like Bears, Sharks, or Buffalo.', 
  bonuses: { STR: 1, DEX: 1, CON: 1, INT: 0, WIS: 0, CHA: 0 }, 
  features: [
    { name: 'Animal Lineage', 
        description: 'Your animal nature shows itself in a variety of ways. You must choose your Lineage from the following list, detailed at the end of this Race: Aquatic, Avian, Insect, Mammal, Reptile' }, 
    { name: 'Bestial Characteristics', 
        description: 'Requires: Animal Lineage Racial Feature. You possess natural strengths that are not commonplace among other humanoids. Choose two options from the Bestial Characteristcs List listed at the end of this Race, these can not be changed later.' },
    { name: 'Know-How', 
        description: 'Due to the ever changing nature of your life, it has become easier to learn things as you go and make the best of every opportunity to do so. Whenever a Level-Up would not grant you a Technique, you gain one, and you gain an additional Technique every Level beyond 20. Additionally, you gain 1 additional Training Boon each time you have a Training Arc.' },
    { name: 'More “Beast” than “Man”', 
        description: 'You are closer to being a large animal than other intelligent species. You are treated as a Beast instead of a Humanoid to any Effect that would check what kind of Creature you are.' },
    { name: 'Primal Energy', 
        description: 'You are far more physically fit than most other humanoid races. At 1st Level and every time you Level-Up you gain +1 to your Maximum Stamina Points.' },
    ] 
},
Cerealians: 
  { name: 'Cerealian', icon: <Aperture size={24} />, 
  summary: 'Cerealians look similar to Human-type Earthlings, though they all seem to have green-colored hair and have an average lifespan of 200 years, Their right eyes have also evolved to grant them incredible visual acuity, having a merged iris and pupil, which is deep red in color.',
  bonuses: { WIS: 2, DEX: 1, STR: 0, CON: 0, INT: 0, CHA: 0 }, 
  features: [
    { name: 'Cerealian Focus', 
        description: 'As a Bonus Action on your turn you may spend 1 Stamina to gain a Static Bonus on all Ranged Weapon Attack Rolls equal to your Ki Rank until the end of your next turn. You may do this a number of times equal to your Proficiency Bonus per Long Rest.' }, 
    { name: 'Hyper Reflexes', 
        description: 'Your brain is evolved to take on more information than others. Once per Round, you may expend your Reaction to regain the use of a Snap Decision that you used on this turn.' },
    { name: 'Indomitable Will', 
        description: 'Your determination to live is stronger than most. Once per Long Rest when you drop to 0 Hit Points, but are not killed outright, you may instead drop to 1 Hit Point.' }, 
    { name: 'Red Eye of the Cerealians', 
        description: 'Cerealians are born with a strange quirk, a single hyper-evolved red eye. Your right eye becomes a Hyper Focused Red-Eye and you gain the Red Eye Focus Power-Up so long as you have that eye. Additionally, each time you Rank Up you gain one Red Eye Focus Form-Specific Modification.' },
    { name: 'Laser Sight', 
        description: 'Your supernatural aim allows you to make every shot a little more deadly. Your first Ranged Weapon Attack each turn deals additional Damage equal to your Proficiency Bonus.' }        
    ] 
},  
Saiyan: 
  { name: 'Saiyan', icon: <Zap size={24} />, 
  summary: 'Saiyans have a long history of invading and claiming planets to live on, often driving previous inhabitants to extinction. They are a fierce race born with a desire for conquest, but saiyan empires have never been established for long periods and the population remains relatively low.', 
  bonuses: { STR: 2, CON: 1},  
  features: [
    { name: 'Saiyan instincts', 
        description: 'You add your Proficiency Bonus to Initiative and can act normally on the first round of combat even when Suprised. Additionally, you may learn Saiyan Tactics Trained Features as if they were Mortal Trained Features.' }, 
    { name: 'Saiyan Lineage', 
        description: 'Your Saiyan genes vary slightly the mix of Saiyans following the tournament of power. Regardless of your choice, you are eligible for the Super Saiyan God God Form and its ritual. You gain access to Saiyan Lineage Feats and you must choose your Lineage from the following list, detailed at the end of this Race: Universe 7 “Child of the Great Ape”, Universe 6 “Masters of Super Saiyan”.' },
    { name: 'Super Saiyan', 
        description: 'The golden form of legend. At Level 5 you gain the Super Saiyan Transformation. Additionally, you gain access to Super Saiyan Form-Specific Modifications as listed in the Form-Specific Modifications Section.' }, 
    { name: 'Super Stomach', 
        description: 'A race as powerful as the Saiyans requires extraordinary caloric intake. You require twice as much food as normal to avoid Exhaustion, however anytime that you eat an Attack Cuisine or a unit of Rations you regain 1d4 Stamina. This benefit becomes 2d4 Stamina at 10th Level.' },
    { name: 'Zenkai Boost', 
        description: 'When pushed to near death the saiyan spirit is known to rebel against the threat of death, creating a stronger warrior when they are pushed to near death. Whenever you fail a Death Saving Throw, roll a d20 Check with a DC starting at 6, increasing by 2 each time you succeed. On a Success you gain 1 Training Boon. You may use this Training Boon immediately or as soon as you regain conciousness for the chance at a second Zenkai Boost. This Feature only activates in times of Mortal Peril, your DM may decide that the situation doesnt warrant a high enough threat level to induce growth.' },                       
    ] 
},

Arcosian: 
  { name: "Arcosian", icon: <Shield size={24} />, 
  summary: 'Arcosians or Frost Demons are vaguely humanoid aliens born with protective armor/skin, horns, and tails. All Frost Demons are males and they reproduce asexually. When a Frost Demon is born, it immediately covers itself in a thick, unbreakable layer of ice and begins a thawing process which can last a varying number of years. The number of years they remain in thawing determines how powerful they are when they emerge. The longer they thaw, the more powerful they will be. Upon emerging from this thawing period, they are fully grown adult Frost Demons. Afterwards, if it is needed, the Frost Demon will create for himself a varying number of transformations to help keep his power under control.', 
  bonuses: { INT: 2, CHA: 1 }, 
  features: [
    { name: 'Galactic Lords', 
        description: 'Long ago your people were known for traveling the stars and conquering other planets. You do not need to breathe and have Resistance to Cold Damage as your body is designed to explore the vast reaches of space.'}, 
    { name: 'Incredible Potential', 
        description: 'The emperors of old thrived by their incredible potential that was used to great, though simple, effect as many never sought out to find the depts of said potential. You gain an additional Training Boon anytime you have a Training Arc.'},
    { name: 'Short Fuse', 
        description: 'You have inherited the same temper as the Arcosians of the past. A number of times per Long Rest equal to your Ki Rank you may use a Bonus Action to gain the Enraged Condition.'}, 
    { name: 'Strong Carapace', 
        description: 'Your exoskeleton is strong and capable of cushioning the more vital parts of your anatomy. Choose one of the following between Bludgeoning, Energy, Piercing, and Slashing Damage. You gain Resistance to the chosen Damage Type. Every time you Rank Up, you may choose another option that you did not pick.'}             
    ] 
},

Namekian: 
  { name: 'Namekian', icon: <Heart size={24} />, 
  summary: 'Long ago, Namekians dwelled in the Demon Realm before they launched a mass scale escape to avoid subjegation. While many Namekians settled in isolation, many more congregated on empty worlds to make into their own. History is rarely on the side of the Namekians, however, and their societies are prone to destruction that prevents mass growth as a species.', 
  bonuses: { CON: 1, WIS: 1}, 
  features: [
    { name: 'Namekian Assimilation', 
        description: 'As a highly spiritual demonic race, Namekian are capable of assimilating other willing Namekians into themselves to create a stronger being. As an Action on your Turn you may touch a willing Namekian and Assimilate them, turning you into a Namekian Fusion. When you Assimilate a Namekian you record the Creature and their Assimilated Power, as described below, and gain the Super Namekian Power-Up. You gain the Creature’s Assimilated Power unless an effect would cause you to seperate from an Assimilated Creature. You may Assimilate a number of Namekians equal to half of your Proficiency Modifier, rounded up. Additionally, a Namekian that has already Assimilated another using this Feature transfers all of their Assimilations to the Namekian that Assimilated them. Assimilated Power: Record the Creature’s highest Ability Score and increase your own matching Ability Score by 1. Record and gain all of the Creature’s Techniques. Duration of a Namekian Fusion: A Namekian Fusion has Maximum Stability Hit Points equal to 5x the number of Assimilated Namekians and has one Assimilated Namekian seperated from them for each 5 Stability Hit Points that they lose. Alternatively, a Wish Spell or use of a set of Dragon Balls can undo the Assimilation effect.' }, 
    { name: 'Namekian Biology', 
        description: 'Namekians do not eat and survive only off of water. Due to this liquid nature namekians are able to stretch thier limbs for combat and utility purposes. Your Unarmed Strikes, Melee Weapon Attacks and Armed/Unarmed Techniques gain 5 feet of the Reach Property equal to your Ki Rank. When you make a Grapple Check you count as 1 Size Category larger for each rank of Reach Property.' },
    { name: 'Namekian Lineage', 
        description: 'The Clan you originate from heavily impacts your abilities as a Namekian. At 1st Level you must choose one Lineage to gain the benefits from, detailed at the end of this Race: Dark Clan Namekian, Dragon Clan Namekian, Warrior Clan Namekian.' }, 
    { name: 'Sounds of the Universe', 
        description: 'The ears of Namekians are fine-tuned to hear oncoming noises so that they may hear danger encroaching on their homeworld. You gain a Static Bonus to hearing based Perception Checks and Passive Perception equal to your Proficiency Bonus. Additionally should you gain the ability to Sense Ki, you may hear the surroundings of any creature you Sense. Unfortunately your incredible hearing comes at a cost, you gain Vulnerability to Thunder Damage.' },
    { name: 'Telepathy', 
        description: 'Namekians can speak telepathically to anyone within a mile that they know well. This range is increased to 10 miles at Level 5, Continent-wide at Level 10, Planet-wide at Level 15, and Galaxy-wide at Level 20. This Feature can also target any creature who you can find through Sense Ki, so long as it is not from a Scouter.' },              
    ] 
},

GalacticCitizen: 
  { name: 'GalacticCitizen', icon: <User size={24} />, 
  summary: 'They come in all shapes and sizes; some are large, some are small, some are bald, some have three eyes. Galactic Citizens are strong in their own right, but have less flashy abilities than other species.', 
  bonuses: { STR: 1, DEX: 1, CON: 1, INT: 1, WIS: 1, CHA: 1 },  
  features: [
    { name: 'Heroic Nature', 
        description: 'A life of strife and growth has led to you having stores of heroism that those that are stronger still find hard to emulate. At 1st Level and everytime you Rank Up you gain one Heroic Feat of your choice, this does not count as gaining a Heroic Feat as a Class Feature.' }, 
    { name: 'Indomitable Will', 
        description: 'Your determination to live is stronger than most. Once per Long Rest when you drop to 0 Hit Points, but are not killed outright, you may instead drop to 1 Hit Point.'},
    { name: 'Know-How', 
        description: 'Due to the ever changing nature of your life, it has become easier to learn things as you go and make the best of every opportunity to do so. Whenever a Level-Up would not grant you a Technique, you gain one, and you gain an additional Technique every Level beyond 20. Additionally, you gain 1 additional Training Boon each time you have a Training Arc.'},
    { name: 'Strange Quirks', 
        description: 'Prerequisite: Galactic Sub-Species Species Feature: Many Galctic Citizens possess minor differences that set them apart from each other. Choose two options from the Quirks List listed at the end of this Species, these can not be changed later.'},         
    ] 
},

Android: 
  { name: 'Android', icon: <User size={24} />, 
  summary: 'Visibly identical to their designers species but completely artificial', 
  bonuses: { STR: 1, DEX: 1, CON: 1, INT: 1, WIS: 1, CHA: 1 },  
  features: [
    { name: 'Crank Generator', 
        description: 'Your body possess a special generator that recycles energy you are hit with into a resource for you. Whenever you take damage that isnt Destruction, you regain an amount of Ki Points equal to (1/2 x the final damage you took).' }, 
    { name: 'Leech Cuffs', 
        description: 'You have small machines in the base of your hands granting you the following benefits: When you would take the Push Back Snap Decision, any damage that was reduced is converted into your Current Ki Points. This cannot raise you above your Maximum Ki Points. Alternatively, anytime you have a creature Grappled, you may expend your Bonus Action to steal Xd6 Current Ki Points from the Grappled target, where X equals your Ki Rank. Should a target start their turn Grappled by you, they lose an amount of Current Ki Points equal to your Unarmed Damage Die and you gain the result into your Current Ki Points. This cannot raise you above your Maximum Ki Points.' },
    { name: 'Mental Processor', 
        description: 'Your mind is assisted by a secondary processor to help filter out external stimuli. You gain Advantage on all Saving Throws against mind altering effects.'},
    { name: 'Robotic Body',
        description: 'You have an internal power core that keeps you fueled. Your Creature Type becomes Construct and you do not suffer negative effects from not eating. Additionally, the act of sleeping is replaced with a different, albeit similar, Recovery Mode to properly restore yourself where you are semi-aware of your surroundings. Additionally, you are incapable of regaining Ki from Gather Ki, a Technique, or an Item. Instead you regen (2 x your Character Level) + (3 x your Current Power Bonus) Ki Points per Round. Your artificial energy also means that you may not be found through the use of the Sense Energy option of the Ki Sense Heroic Feat.'},         
    { name: 'Routine Maintenance',
        description: 'Your body was made to be quickly repairable. You do not need to sleep, or rather do not need to go into your Recovery Mode,  and can not be forced to fall asleep by any means. To benefit from a Long Rest you must instead go into a Repair Mode where your systems fix themself. You may do light activity during this 4 hour rest period. Additionally you may gain the benefits of a Short Rest in 10 Minutes.'},
    { name: 'Signature Upgrade',
        description: 'A piece of advanced technology has been perfectly integrated into your mechanical form. You gain an option from the High-Tech Parts List, this does not count against your Cybernetic Limit.'},
    ] 
},

CelestialPrimate: 
  { name: 'Celestial Primate', icon: <User size={24} />, 
  summary: 'Falling into the standard body shapes of other humanoids, Celestial Primates are one of a small group of primates that are hatched from Stone Eggs and possess incredible abilities as well as mental acuity. Despite their advanced potential and intellect, they otherwise remain indistinguishable from other primates while standing with their traditional posture.', 
  bonuses: { STR: 1, DEX: 1, CON: 1, INT: 1, WIS: 1, CHA: 1 },  
  features: [
    { name: 'Long Living', 
        description: 'The unique circumstances of your creation cause you to be incredibly long-lived. Your natural lifespan sits around 1000 years. Additionally, you are treated as an Otherworldly Species whenever you would be effected by the Altered Condition.' }, 
    { name: 'Extended Learning Curve', 
        description: 'You have adapted to support your extreme lifespan. At 1st Level you gain 3 Skill, Tool, or Item Proficiencies of your choice. Each time your Proficiency Bonus increases you gain an additional proficiency of your choice. You may instead gain Expertise in a Skill you already have proficiency in.' },
    { name: 'Primate Body', 
        description: 'You possess a body shape that is extremely well designed to traverse the world around you. You gain the following effects: Your Creature Type is replaced with Beast. You possess a tail that functions as a third primary limb, capable of wielding or assisting in the use of a Weapon and holding your bodyweight with some strain. Your feet are also prehensile capable of manipulating objects or holding a Light Weapon as if they were additional Off-Hands. Your Walk Speed is reduced by half for each foot that you are using to wield a Weapon in this way. You possess a tail that functions as a third primary limb, capable of wielding or assisting in the use of a Weapon and holding your bodyweight with some strain. Your feet are also prehensile capable of manipulating objects or holding a Light Weapon as if they were additional Off-Hands. Your Walk Speed is reduced by half for each foot that you are using to wield a Weapon in this way.' },
    { name: 'Spiritual Cultivation',
        description: 'Due to your near-divine nature, the mastery of the spirit comes to you like second nature. At Level 1 you gain 1 Spirit Control Trained Feature of your choice. You also gain an additional Spirit Control Trained Feature at Ki Rank 3.'},         
    ] 
},

Chronin: 
  { name: 'Chronin', icon: <User size={24} />, 
  summary: 'Purple and almost humanoid, Chronins are hairless with tympaniums in place of ears. They can range between 5 and 7 feet tall at maturity and can live between 1000 and 2000 years.', 
  bonuses: { STR: 1, DEX: 1, CON: 1, INT: 1, WIS: 1, CHA: 1 },  
  features: [
    { name: 'Adaptability', 
        description: 'Your species survives on its ability to learn and adapt to threats. Whenever you are hit with a Critical Hit, roll a d20 Check with a DC starting at 10, increasing by 2 each time you succeed. On a successful check you gain 1 Training Boon. These Training Boons must be used immediately or at the start of your next turn. This Feature only activates in times of Mortal Peril, your DM may decide that the situation doesnt warrant a high enough threat level to induce growth.' }, 
    { name: 'Blood of Time', 
        description: 'At Level 1, you gain the Basic Time Skipping Trained Feature and you reduce the Casting Cost of Techniques from the Time Skip Super Technique Line by 4x the Techniques Rank, minimum 4 Ki.'},
    { name: 'High-Speed Reactions', 
        description: 'Your brain acts with a supernatural efficiency. Snap Decisions that you spend 2 or more Stamina on cost 1 less Stamina to use, to a minimum Casting Cost of 1 Stamina.' },
    { name: 'Know-How',
        description: 'Due to the ever changing nature of your life, it has become easier to learn things as you go and make the best of every opportunity to do so. Whenever a Level-Up would not grant you a Technique, you gain one, and you gain an additional Technique every Level beyond 20. Additionally, you gain 1 additional Training Boon each time you have a Training Arc.'},         
    { name: 'Millenial Learning Curve',
        description: 'You have unique brain chemistry to support your extreme lifespan, due to this they are able to compartmentalize specific knowledge so that it can be remembered and improved on easily. At 1st Level you gain 3 Skill, Tool, or Vehicle Proficiencies of your choice. Each time your Proficiency Bonus increases you gain an additional proficiency of your choice. You may instead gain Expertise in a Skill you already have proficiency in.'},
    ] 
},

DemonRealmDenizen: 
  { name: 'Demon Realm Denizen', icon: <User size={24} />, 
  summary: 'Demon Realm Denizens are one of the many species that some believe that life in the Mortal Realm evolved to emulate. Though not limited to, each classification of Demon Realm Denizen is based on where they are most commonly found amongst the different Demon Worlds.', 
  bonuses: { STR: 1, DEX: 1, CON: 1, INT: 1, WIS: 1, CHA: 1 },  
  features: [
    { name: 'Awakened Demonic Power', 
        description: 'Whenever you would get the option to choose a God Form to gain, you may choose to instead choose a Form that you know and add the following permanent effects to it: +1 Stable Power. The benefiting Form becomes a God Form. Increase all available Movement Speeds by 10 feet. Increase all Damage dealt by your Attack Action by 1. The benefiting Form gains +5 Ki Upkeep, even if it is already expending a different Resource.'}, 
    { name: 'Magic or Mindfullness', 
        description: 'You possess an advanced mind that makes it possible to awaken mystical abilities or better process information. At 1st Level you gain one of the following features of your choice, this can not be changed later: You gain one 1st Level Spell of your choice. You may cast this spell a number of times per Short or Long Rest equal to your Proficiency Bonus. These Spells can only be cast at their lowest Spell Level and Charisma is your Spellcasting Modifier for this Spell. At 1st Level you gain 2 Skill Proficiencies of your choice or may gain Expertise in 1 Skill that you gained from your Species Traits.'},
    { name: 'Magictech Knowledge', 
        description: 'Your history with Demon Realm technology has led to the devices in the Mortal Realm to feel almost primative in comparison. You may reduce the Crafting Cost of any Technology by half.'},
    { name: 'Otherworldly Energy',
        description: 'Your energy possess a truly unique magical signal. Creatures without God Ki treat your Passive Ki Stealth and Ki Stealth Checks as 5 higher than it would actually be.'},         
    ] 
},
};

const CLASS_DATA = {
    MartialArtist: 
    { name: 'Martial Artist', icon: <Sword size={24} />, 
    summary: 'Masters of rapid strikes.', 
    primaryStats: ['Strength', 'Dexterity'], 
    features: [
        { name: 'Rapid Strike', description: 'One additional Unarmed Attack on hit.' }] },
    
    Blaster: 
    { name: 'Blaster', icon: <Bolt size={24} />, 
    summary: 'Specialist in Ki energy manipulation.', 
    primaryStats: ['Intelligence', 'Charisma'], 
    features: [
        { name: 'Ki Reservoir', description: 'Increased max Ki.' }] },
    
    Brawler: 
    { name: 'Brawler', icon: <HardHat size={24} />, 
    summary: 'Relies on brute force and durability.', 
    primaryStats: ['Constitution'], 
    features: [
        { name: 'Durable Frame', description: 'Use Reaction for Damage Reduction.' }] },
    
    Mystic: 
    { name: 'Mystic', icon: <Sun size={24} />, 
    summary: 'Support, healing, and utility.', 
    primaryStats: ['Wisdom'], 
    features: [
        { name: 'Utility Technique', description: 'Learn one utility Technique at half Ki Cost.' }
    ] 
},
};

// --- SUB-SPECIES DATA (Biological Variants) ---
const SUB_SPECIES_DATA = {
  Saiyan: {
    'Standard': {
      name: 'Standard Saiyan',
      description: 'A typical member of the Saiyan race with balanced traits.',
      features: [
        { name: 'Warrior Instinct', description: 'Gain proficiency with one martial weapon of your choice.' },
        { name: 'Saiyan Tail', description: 'You possess a prehensile monkey tail that can wield light weapons.' }
      ]
    },
    'Half-Saiyan': {
      name: 'Half-Saiyan',
      description: 'Born from a Saiyan and non-Saiyan union, inheriting traits from both.',
      features: [
        { name: 'Hybrid Vigor', description: 'Gain +1 to Constitution modifier (max 20).' },
        { name: 'Diverse Heritage', description: 'Gain one skill proficiency from your non-Saiyan parent\'s race.' }
      ]
    },
    'Mutant': {
      name: 'Mutant Saiyan',
      description: 'A rare genetic variation with unique biological advantages.',
      features: [
        { name: 'Mutation Surge', description: 'Once per long rest, gain advantage on one attack roll or saving throw.' },
        { name: 'Unstable Power', description: '+1 to damage rolls with techniques and unarmed strikes.' }
      ]
    },
    'Ancient': {
      name: 'Ancient Saiyan',
      description: 'A Saiyan from ages past, with primal power and ancient techniques.',
      features: [
        { name: 'Primal Knowledge', description: 'Learn one additional technique at 1st level.' },
        { name: 'Ancient Power', description: '+2 to initiative rolls.' }
      ]
    },
    'Legendary': {
      name: 'Legendary Saiyan',
      description: 'Born once in a thousand years, possessing legendary power.',
      features: [
        { name: 'Legendary Bloodline', description: 'Gain +2 to Strength modifier (max 20).' },
        { name: 'Unstoppable Force', description: 'Once per long rest, reroll one failed attack roll or damage roll.' }
      ]
    }
  },

  Arcosian: {
    'Cold Tribe': {
      name: 'Cold Tribe',
      description: 'Long ago this Tribe controlled vast stretches of the known Universe, made famous by a small group of Mutants of the Tribe. While most never reach the caliber of the great Lord Frieza, the Tribe as a whole still greatly resemble the tyrant of old.',
      features: [
        { name: 'Gated Power', description: 'Born into their incredible power before hiding it through the use of Metamorphosis, the Cold Tribe spend a vast portion of their life attempting to "unlock" their original forms. At 1st Level the Power Regression Transformation is always active and must remain active at all times.' },
      ]
    },

    'Hero Tribe': {
      name: 'Hero Tribe',
      description: 'After the destruction of the Cold Empire it took many years for the members of the Hero Tribe to rejoin the greater society without predjudice.',
      features: [
        { name: 'Metamorphosis', description: 'Based on generations of learning to move through the galaxy to live and survive where they could, the Hero Tribe perfected the use of their innate metamorphic abilities to alter their form to better survive. At 5th Level you gain the Alter Form Transformation.' },
      ]
    },
  },
  Namekian: {
    'Dark Namekian': {
      name: 'Dark Namekian',
      description: 'These Namekians are hardier than most and are usually demonized in Namekian Society due to their duller colors and lack of distinct Namekian abilities. Dark Namekians have mastered their own regenerative capability, some say they evolved purely to combat the raging discrimination they once faced.',
      features: [
        { name: 'Demonic Durability', description: 'Increase your Constitution Ability Score by 2.' },
        { name: 'Hellish Regeneration', description: 'You have access to a pool of Hit Points equal to 2x your Maximum Ki Points. As an Action or Bonus Action on your turn, you may expend any number of Hit Points from this pool to regain that many. This can not raise you above your Hit Point Maximum. Additionally as an Action on your turn, you may expend 10 of these Hit Points to regenerate a limb lost due to the Crippled Condition. The pool refreshes on a Long Rest.' }
      ]
    },
    'Dragon Clan': {
      name: 'Dragon Clan Namekian',
      description: 'Those attuned to the spirit of Zalama the dragon god. these namekians are spiritually gifted and some even manage to emulate Zalama himself by creating Dragon Balls.',
      features: [
        { name: 'Ancient Teachings', description: 'Increase your Intellegence Ability Score and Wisdom Ability Score by 1.' },
        { name: 'Draconic Blessing', description: 'You have access to a pool of Hit Points equal to your Maximum Ki Points. As an Action on your turn, you may expend any number of Hit Points from this pool to regain that many. This can not raise you above your Hit Point Maximum. Additionally as an Action on your turn, you may expend 20 of these Hit Points to regenerate a limb lost due to the Crippled Condition. The pool refreshes on a Long Rest.' },
        { name: 'Porungas Touch', description: 'You may touch a willing creature as an Action and expend Hit Points from this pool to restore half as many Hit Points to the Creature. This can not raise them above their Hit Point Maximum.' }
      ]
    },
    'Warrior Clan': {
      name: 'Warrior Clan Namekian',
      description: 'Namekians born for combat that can utilize the monstrous Titan form.',
      features: [
        { name: 'Stunted Regeneration', description: 'You have access to a pool of Hit Points equal to your Maximum Ki Points. As an Action or Bonus Action on your turn, you may expend any number of Hit Points from this pool to regain that many. This can not raise you above your Hit Point Maximum. Additionally as an Action on your turn, you may expend 30 of these Hit Points to regenerate a limb lost due to the Crippled Condition. The pool refreshes on a Long Rest.' },
        { name: 'Titan Namekian', description: 'You gain the Titan Namekian Transformation.' },
        { name: 'Warriors Frame', description: 'Increase your Dexterity Ability Score and Strength Ability Score by 1. This cannot raise you over your Ability Score Maximum.' }
      ]
    }
  },

  Beastmen: {
    'Aquatic': {
      name: 'Aquatic Beastman',
      description: 'You possess a mucus lined skin or a covering of light scales that help you move smoothly in the water.',
      features: [
        { name: 'Born to Swim', description: 'At 1st Level you gain the Nonterrestrial Fighting Style from the Warrior Class.' },
        { name: 'Semi-Aquatic', description: 'You are capable of breathing underwater as well as in open air. Additionally, you may hold your breath for twice as long.' }
      ]
    },

    'Avian': {
      name: 'Avian Beastman',
      description: 'You possess feathers, a beak, and even have arms that double as wings.',
      features: [
        { name: 'Echolalia', description: 'Your voicebox is made to be contorted for incredible effect. You gain a Static Bonus to Performance Checks that involve talking, singing, or impersonating another sound equal to your Ki Rank.' },
        { name: 'Winged Form', description: 'Your arms function as wings. So long as you are not holding a Weapon in either hand you gain a *Fly Speed* equal to 15x your Ki Rank.' }
      ]
    },

    'Insect': {
      name: 'Insect Beastman',
      description: 'Your biology is more simple than other beastmen, with a more resilient and disturbing form.',
      features: [
        { name: 'Nuke Survivor', description: 'Insects are said to be so resilient that they are practically unkillable outside of natural means. A number of times per Long Rest equal to your Ki Rank you may choose to remain at 1 Hit Point whenever you would be reduced to zero Hit Points from taking Damage.' },
        { name: 'Mental Chronometry', description: 'You possess an incredible ability to react to stimuli and change your actions at the last second. If a creature would use their Reaction in response to you rolling an Attack Roll against them, you can use your Reaction to change the target of the initial Attack Roll to be another target within its range. The creature who triggers this effect still expends their Reaction.' }
      ]
    },

    'Mammal': {
      name: 'Mammal Beastman',
      description: 'Mammal-Type Beastman tend to be the most commonly seen type, able to survive in many environments and possessing superior strength.',
      features: [
        { name: 'Dread Hunter', description: 'Your animal instincts are geared toward finding prey and noticing threats. You gain a Static Bonus equal to your Ki Rank on any Skill Check to locate a creature that you have previously seen, or have identified via their energy signature.' },
        { name: 'Polyphasic Sleep', description: 'Due to your animal instincts you find it almost impossible to sleep through the night, instead sleeping in sporadic naps that leave you minimally aware of their surroundings. You only need to sleep for 4 hours out of a Long Rest, leaving the other 4 hours for light activity. Additionally, you may make perception checks as if you were awake while you are Unconscious.' }
      ]
    },

    'Reptile': {
      name: 'Reptile Beastman',
      description: 'You are cold blooded and have scales that protects your vulnerable form.',
      features: [
        { name: 'Lizard Brain', description: 'Your reptilian nature causes you to be impossible to sway through magical effects. You are Immune to any magical effect that would attempt to impart the Berserk, Charmed, or Frightened Condition.' },
        { name: 'Regenerative Limbs', description: 'Whenever you would perform a Short Rest, you may maximize the result of any Hit Die that you expend to heal. Additionally if you suffer from a lost limb due to the Crippled Condition when you perform a Short or Long Rest, it is removed as your limb regenerates.' }
      ]
    }
  },

  Cerealian: {
    'Standard': {
      name: 'Standard Cerealian',
      description: 'A typical Cerealian from nomadic lineage.',
      },
   },

  GalacticCitizen: {
    'Brench-Seijin': {
      name: 'Brench-Seijin',
      description: 'Brench-Seijin spent most of their known history under the reign of the Cold Empire and as such lack a formal history of their own.',
      features: [
        { name: 'Galactic Artillery', description: 'Your people are hailed for their impressive energy attacks. Your Ki Techniques deal an additional 2 Damage.' },
        { name: 'Long Ranged', description: 'You take pride in your energy projections, and their effectiveness reflects this. All Ki Techniques that you cast have their Range extended as if they were Charged once.' }
      ]
    },

    'Creamorian': {
      name: 'Creamorian',
      description: 'Creamorians have spent most of their known history under the reign of the Cold Empire and as such lack a formal history of their own.',
      features: [
        { name: 'Dashing Combatant', description: 'You strive to keep your fights as captivating as yourself. All Strike Techniques with a Range of Melee gain 10 feet of Movement as part of their Casting.' },
        { name: 'Galactic Infantry', description: 'Your Strike Techniques deal an additional 2 points of Damage.' }
      ]
    },

    'Earthling': {
      name: 'Earthling',
      description: 'The dominant species of Earth, Earthlings have held the planet for as long as sentient life has existed there, protecting it time and time again with the help of the more powerful and clever among them.',
      features: [
        { name: 'I can figure this out', description: 'You gain a bonus to any Skill Check involved with using an Item or Vehicle that you are not Proficient with equal to 1/3 of your Proficiency Bonus, rounded up.' },
        { name: 'Intelligent Ape', description: 'Your deep-rooted ape biology has its advantages, including an ease at learning the basics. You immediately gain the Technique Mastery Heroic Feat.' }
      ]
    },
    
    'Heeter': {
      name: 'Heeter',
      description: 'With bright blue skin and horns of various sizes that extend from their head, the Heeters are a species of nomadic people. Many Heeters find themselves in positions as mercenaries or soldiers due to their hardy nature.',
      features: [
        { name: 'Unyielding Ferocity', description: 'Choose one variation of the Boosted Condition, this can not be changed later. Whenever you possess the Berserk or Enraged Conditions, you gain the chosen Condition for its duration.' },
        { name: 'Warriors Wrath', description: 'Generations traversing the stars has left you with a survival instinct that comes out whenever you are in danger. The first time per Long Rest that you are reduced below 50% of your Maximum Hit Points, you gain the Enraged Condition.' }
      ]
    },

    'Hera': {
      name: 'Hera',
      description: 'Long ago the Hera Clan were a proud and respectable warrior species before the unfortunate loss of their homeworld that led to their survival through piracy. Throughout the ages many Hera-Jin have denounced this life and settled on quiet planets, though most of them to this day still find themselves being born in the medbay of a Warship.',
      features: [
        { name: 'Space Pirate', description: 'Years aboard Starships and mercenary vessels have taught you all manner of combat. You gain Proficiency in all Martial Weapons.' },
        { name: 'Powerful Body', description: 'You are considered one Size Category larger then normal when Grappling or interacting with the Launch Mechanic.'}
      ]
    },

    'Herculean': {
      name: 'Herculean',
      description: 'Long ago their was another sub-species of Earthling known as the Herculeans that were said to be blessed by the gods with divine might.',
      features: [
        { name: 'Empowered Fists', description: 'Your fists are weapons in their own right. Your Unarmed Strikes can be treated as Combat Gauntlets for the sake of casting Armed Techniques.' },
        { name: 'Legendary Might', description: 'You have an innate wellspring of strength that you can call on temporarily. Once per Long Rest as a Bonus Action on your turn you may gain the Boosted Condition or the Empowered Condition for a number of rounds equal to your Ki Rank.'}
      ]
    },

    'Jiangshi': {
      name: 'Jiangshi',
      description: 'With stark white skin, save for their rosie cheeks, the Jiangshi are a rare sight to see. The Jiangshi are seen as a sub-species to modern Earthlings.',
      features: [
        { name: 'Magic Being', description: 'You gain a bonus to all Intelligence, Wisdom, and Charisma Saving Throws enforced by Spells equal to your Ki Rank.' },
        { name: 'Psychic Energy', description: 'You may replace the Damage Type of your Basic Ki Blasts and Ki Techniques to Psychic Damage.'}
      ]
    },

    'Konatsian': {
      name: 'Konatsian',
      description: 'The Konatsians once waged war against power hungry aliens known as the Kashvar, who re-awakened the ancient monster Hirudegarn. Two legendary heroes split the beast in half and sealed it within themselves to protect what remained of their people, leaving them to rebuild in relative peace.',
      features: [
        { name: 'Mystical Nature', description: 'You possess natural magical qualities. You gain two Cantrips of your choice.' },
        { name: 'Space Knights', description: 'You may treat any Martial Melee Weapon that you are Proficient in as a Monastic Weapon.'}
      ]
    },

    'Outworlders': {
      name: 'Outworlders',
      description: 'Outworlders make up the majority of the space fairing population. They can be found in every corner of the universe using their experience with technology and space travel to make a living in different kinds of ways.',
      features: [
        { name: 'Alien Knowledge', description: 'Your myriad of offworld knowledge has led to you being incredibly gifted with creating things. The Base Zeni Cost to create any object is reduced by 25% of its original Zeni Cost.' },
        { name: 'Alien Technology', description: 'You are used to far more advanced gear than you keep finding yourself with. Whenever you perform the Craft or Invent Downtime Activity, you gain a *Static Bonus* equal to 1 + your Ki Rank. Additionally, crafting Scientific Gears only increases the Base Zeni Cost of the Enchant Downtime Activity by 50%.'}
      ]
    },

    'Triclops': {
      name: 'Triclops',
      description: 'Almost indistinguishable from Earthlings, the Triclops intermingled and interbred with them. The Triclops of the modern day are seen as a sub-species to modern Earthlings.',
      features: [
        { name: 'Sight of Three Eyes', description: 'As an Action on your turn you may focus the true strength of your third eye, granting you Truesight in a range of 30 feet until the end of your next turn.' },
        { name: 'Improved Perception', description: 'As a Bonus Action on your turn you may focus all three eyes on one point, granting you Advantage on the next Attack Roll or Perception Check that you make. You may use this Feature a number of times per Long Rest equal to your Proficiency Modifier.'}
      ]
    },

    'Tsufruian': {
      name: 'Tsufruian',
      description: 'Otherwise known as the Tuffles, the Tsufruians were a species of highly advanced people that were attacked and seemingly wiped out by the Saiyan Armada years prior. Tales arise all throughout the galaxy of sightings of them, yet the greater universe has yet to see direct evidence.',
      features: [
        { name: 'Beautiful Mind', description: 'You are capable of performing intense calculations in your head to assist in combat. As a Bonus Action on your turn you may begin running calculations, allowing you to use your Intelligence Modifier in place of the Attack Modifier or Casting Modifier of the next Attack Roll that you make or Technique that you cast.'},
        { name: 'Master Craftsmen', description: 'Your people were famous for their abiity to learn and create things. You gain Proficiency in three Toolkits of your choice.'}
      ]
    },

    'Wagashi-seijin': {
      name: 'Wagashi-seijin',
      description: 'Sometimes referred to as the "Grand Pontas", the Wagashi-Seijin are a species of red skinned individuals that became renowned for their Universe-spanning delivery service.',
      features: [
        { name: 'Space Couriers', description: 'Youre not exactly the fastest thing in the universe, but that doesnt mean you arent quick. Your Base Walk Speed increases by 10 feet.'},
        { name: 'Inner Cowardice', description: 'No matter how brave they may be, part of your very genetics is always afraid and ready to flee. You may take the Dash or Disengage Action as a Bonus Action on your turn.'}
      ]
    },
  },
  
  DemonRealmDenizen: {
    '1st Demon World': {
      name: '1st Demon World',
      description: 'Sometimes known as Lucifarians, named after the once great Supreme Demon King Lucifer from the Age of Sand. These demons have rigid horns and occasionaly possess tails.',
      features: [
        { name: 'Dark Magic Manifestation', description: 'You have the ability to produce more magical effects than others. At 1st Level, you gain one option from the Demon World Magic List.'},
        { name: 'Wind through your horns', description: 'Whether by design or by chance, you possess almost superhuman manueverability. Your Base Walk Speed is increased by 15 feet.' }
      ]
    },
    '2nd Demon World': {
      name: '2nd Demon World',
      description: 'Usually refered to as the Glinds, these bright individuals almost ooze magic. Growing from magical trees and being the first place to look for replacements for Kais, the Glind are a very well respected people across the universes and Demon Realm.',
      features: [
        { name: 'Magic Resilience', description: 'Your hyper magical nature give you the ability to try and push through magical effets. Whenever you use the Block Snap Decision you gain an additional +3 on all Saving Throws against Spells.' },
        { name: 'Minor Magic', description: 'At 1st Level you must choose one School of Magic, this can not be changed later. You gain Spells from the chosen list at specified Character Levels, listed below. These Spells can only be cast at their lowest Spell Level and Charisma is your Spellcasting Modifier for this Spell. Spell Levels that have the same number of uses per Short or Long Rest share the number. At 3rd Level, you gain a 2nd Level or lower Spell. You may cast this Spell a number of times per Short or Long Rest equal to your Proficiency Bonus. At 7th Level, you gain a 4th Level or lower Spell. You may cast this Spell a number of times per Short or Long Rest equal to half your Proficiency Bonus, rounded up. At 9th Level, you gain a 5th Level or lower Spell. You may cast this Spell a number of times per Short or Long Rest equal to your Ki Rank.' }
      ]
    },

    '3rd Demon World': {
      name: '3rd Demon World',
      description: 'Predominantly blue-skinned with snow white hair, the denizens of the 3rd Demon Realm are filled with a harsh desire to survive due to the rough living conditions around them.',
      features: [
        { name: 'Survival Instinct', description: 'You refuse to let the cruel world around you take you down! At 1st Level, you gain the Survivor Heroic Feat.'},
        { name: 'Quick Thinking', description: 'You have learned to be quick on your feet and even quicker with your thoughts. A number of times per Long Rest equal to your Ki Rank you may add your Intelligence Modifier or Wisdom Modifier to a Skill Check, even if the Skill Check would already use that Ability Score Modifier.' }
      ]
    },

    'Otherworld Exile': {
      name: 'Otherworld Exile',
      description: 'There was once a group of Demon Realm Denizens, sometimes known as Ogres, that had attempted to stage a coup against an ancient Supreme Demon King and found themselves banished to Otherworld to remain in HFIL as its protectors or as assisstants to the powers that be.',
      features: [
        { name: 'Bloody Instincts', description: 'Your deeply seated instincts for battle are not gone, meerly suppressed. Whenever you roll Initiative, you may choose to gain the Enraged Condition for a number of rounds equal to your Ki Rank. At the end of this duration, you gain 1 Rank of Exhaustion.'},
        { name: 'HFIL Horns', description: 'Choose one of the following to gain the benefits of: One Horn. You possess a singular horn in the center of your head, only large enough to act as a sensory organ. At 1st Level, you gain Proficiency in the Perception Skill. This grants you Expertise if you would gain Proficiency from another source. Two Horns. You possess a set of matching horns, each extending off the side of your head that grants you the intimidating visage of a demon. At 1st Level, you gain Proficiency in the Intimidation Skill. This grants you Expertise if you would gain Proficiency from another source.' }
      ]
    }

  }
};

// --- SUB-RACE DATA (Heritage Variants - Empty for now) ---
const SUB_RACE_DATA = {
  Saiyan: {},
  Arcosian: {},
  Namekian: {},
  Beastmen: {},
  Cerealians: {},
  GalacticCitizen: {},
  Ogre: {}
};

// --- UTILS & MOCK DB ---
const getStatModifier = (score) => Math.floor((score - 10) / 2);
const roll4d6DropLowest = () => {
    const rolls = Array.from({ length: 4 }, () => Math.floor(Math.random() * 6) + 1);
    rolls.sort((a, b) => b - a);
    return rolls.slice(0, 3).reduce((sum, roll) => sum + roll, 0);
};

const DatabaseService = (() => {
    const STORAGE_KEY = 'DBZ_Characters';
    const loadAllCharacters = () => {
        try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; } catch { return []; }
    };
    const saveCharacter = (characterData) => {
        const characters = loadAllCharacters();
        const id = characterData.id || `char-${Date.now()}`;
        const newChar = { ...characterData, id, level: characterData.level || 1 };
        const index = characters.findIndex(c => c.id === id);
        if (index > -1) characters[index] = newChar; else characters.push(newChar);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(characters));
        return newChar;
    };
    return { loadAllCharacters, saveCharacter };
})();

// --- SUB-COMPONENTS ---

const TitleScreen = ({ onStartCreation, onSelectCharacter }) => (
    <div className="wizard-slide title-screen">
        <h1>SDDH 5.0 Charactermancer</h1>
        <div className="menu-buttons">
            <button className="btn primary" onClick={onStartCreation}>Create Character</button>
            <button className="btn secondary" onClick={onSelectCharacter}>Select Character</button>
        </div>
    </div>
);

const CharacterSelectScreen = ({ onReturn, onCharacterSelect }) => {
    const [characters] = useState(DatabaseService.loadAllCharacters());
    const [selectedId, setSelectedId] = useState(null);

    return (
        <div className="wizard-slide">
            <div className="slide-header">
                <h2>Select Your Champion</h2>
                <div className="actions">
                    <button className="btn neutral" onClick={onReturn}>Return</button>
                    <button className="btn success" disabled={!selectedId} onClick={() => onCharacterSelect(characters.find(c => c.id === selectedId))}>Confirm</button>
                </div>
            </div>
            <div className="char-select-grid">
                {characters.length === 0 ? <div className="empty-state">No characters found.</div> : 
                    characters.map(char => (
                        <div key={char.id} className={`char-card ${selectedId === char.id ? 'selected' : ''}`} onClick={() => setSelectedId(char.id)}>
                            <h3>{char.name}</h3>
                            <p>{char.race} {char.class} (Lvl {char.level})</p>
                        </div>
                    ))
                }
            </div>
        </div>
    );
};

const RaceSelect = ({ formData, setFormData, handleNext, onReturn }) => {
    const [selected, setSelected] = useState(formData.race || 'Saiyan');
    const confirm = () => { setFormData(p => ({ ...p, race: selected })); handleNext(); };
    return (
        <div className="wizard-slide">
            <h2>Select Race</h2>
            <div className="selection-grid">
                {Object.entries(RACE_DATA).map(([key, data]) => (
                    <div key={key} className={`selection-card ${selected === key ? 'active' : ''}`} onClick={() => setSelected(key)}>
                        <div className="card-header">{data.icon} <span>{data.name}</span></div>
                        <p>{data.summary}</p>
                    </div>
                ))}
            </div>
            <div className="wizard-footer"><button className="btn neutral" onClick={onReturn}>Back</button><button className="btn primary" onClick={confirm}>Next</button></div>
        </div>
    );
};

const RaceFeatures = ({ formData, handleNext, onReturn }) => {
    const data = RACE_DATA[formData.race];
    return (
        <div className="wizard-slide">
            <h2>{data.name} Features</h2>
            <div className="features-container">
                {data.features.map((f, i) => <div key={i} className="feature-box"><h3>{f.name}</h3><p>{f.description}</p></div>)}
                <div className="feature-box stat-box"><h3>Stat Bonuses</h3><p>{Object.entries(data.bonuses).map(([k,v]) => `${k} +${v}`).join(', ')}</p></div>
            </div>
            <div className="wizard-footer"><button className="btn neutral" onClick={onReturn}>Back</button><button className="btn primary" onClick={handleNext}>Next</button></div>
        </div>
    );
};

const ClassSelect = ({ formData, setFormData, handleNext, onReturn }) => {
    const [selected, setSelected] = useState(formData.class || 'MartialArtist');
    const confirm = () => { setFormData(p => ({ ...p, class: selected })); handleNext(); };
    return (
        <div className="wizard-slide">
            <h2>Select Class</h2>
            <div className="selection-grid">
                {Object.entries(CLASS_DATA).map(([key, data]) => (
                    <div key={key} className={`selection-card ${selected === key ? 'active' : ''}`} onClick={() => setSelected(key)}>
                        <div className="card-header">{data.icon} <span>{data.name}</span></div>
                        <p>{data.summary}</p>
                    </div>
                ))}
            </div>
            <div className="wizard-footer"><button className="btn neutral" onClick={onReturn}>Back</button><button className="btn primary" onClick={confirm}>Next</button></div>
        </div>
    );
};

const ClassFeatures = ({ formData, handleNext, onReturn }) => {
    const data = CLASS_DATA[formData.class];
    return (
        <div className="wizard-slide">
            <h2>{data.name} Features</h2>
            <div className="features-container">
                {data.features.map((f, i) => <div key={i} className="feature-box"><h3>{f.name}</h3><p>{f.description}</p></div>)}
                <div className="feature-box stat-box"><h3>Primary Stats</h3><p>{data.primaryStats.join(', ')}</p></div>
            </div>
            <div className="wizard-footer"><button className="btn neutral" onClick={onReturn}>Back</button><button className="btn primary" onClick={handleNext}>Next</button></div>
        </div>
    );
};

const SubSpeciesSelect = ({ formData, setFormData, handleNext, onReturn }) => {
    const hasSubSpecies = SUB_SPECIES_DATA[formData.race];
    if (!hasSubSpecies) {
        handleNext();
        return null;
    }
    
    const [selected, setSelected] = useState(formData.subSpecies || Object.keys(hasSubSpecies)[0]);
    const confirm = () => { setFormData(p => ({ ...p, subSpecies: selected })); handleNext(); };
    
    return (
        <div className="wizard-slide">
            <h2>Select {formData.race} Sub-Species</h2>
            <div className="selection-grid">
                {Object.entries(hasSubSpecies).map(([key, data]) => (
                    <div key={key} className={`selection-card ${selected === key ? 'active' : ''}`} onClick={() => setSelected(key)}>
                        <div className="card-header"><span>{data.name}</span></div>
                        <p>{data.description}</p>
                    </div>
                ))}
            </div>
            <div className="wizard-footer"><button className="btn neutral" onClick={onReturn}>Back</button><button className="btn primary" onClick={confirm}>Next</button></div>
        </div>
    );
};

const SubRaceSelect = ({ formData, setFormData, handleNext, onReturn }) => {
    const hasSubRaces = SUB_RACE_DATA[formData.race];
    if (!hasSubRaces || Object.keys(hasSubRaces).length === 0) {
        handleNext();
        return null;
    }
    
    const [selected, setSelected] = useState(formData.subRace || Object.keys(hasSubRaces)[0]);
    const confirm = () => { setFormData(p => ({ ...p, subRace: selected })); handleNext(); };
    
    return (
        <div className="wizard-slide">
            <h2>Select {formData.race} Sub-Race</h2>
            <div className="selection-grid">
                {Object.entries(hasSubRaces).map(([key, data]) => (
                    <div key={key} className={`selection-card ${selected === key ? 'active' : ''}`} onClick={() => setSelected(key)}>
                        <div className="card-header"><span>{data.name}</span></div>
                        <p>{data.description}</p>
                    </div>
                ))}
            </div>
            <div className="wizard-footer"><button className="btn neutral" onClick={onReturn}>Back</button><button className="btn primary" onClick={confirm}>Next</button></div>
        </div>
    );
};

const FeatureReplacement = ({ formData, setFormData, handleNext, onReturn }) => {
    const raceFeatures = RACE_DATA[formData.race].features;
    const subRaceData = SUB_RACE_DATA[formData.race]?.[formData.subRace];
    
    if (!subRaceData) {
        handleNext();
        return null;
    }
    
    const [selectedFeatures, setSelectedFeatures] = useState(formData.replacedFeatures || []);
    
    const toggleFeature = (subRaceFeatureName) => {
        setSelectedFeatures(prev => {
            if (prev.includes(subRaceFeatureName)) {
                return prev.filter(f => f !== subRaceFeatureName);
            } else if (prev.length < 3) {
                return [...prev, subRaceFeatureName];
            }
            return prev;
        });
    };
    
    const confirm = () => {
        setFormData(p => ({ ...p, replacedFeatures: selectedFeatures }));
        handleNext();
    };
    
    return (
        <div className="wizard-slide">
            <h2>Select Sub-Race Features (0-3)</h2>
            <p style={{textAlign: 'center', color: '#666', marginBottom: '20px'}}>Choose up to 3 sub-race features to replace your racial features</p>
            <div className="features-container">
                {subRaceData.features.map((f, i) => (
                    <div 
                        key={i} 
                        className={`feature-box ${selectedFeatures.includes(f.name) ? 'selected' : ''}`}
                        onClick={() => toggleFeature(f.name)}
                        style={{cursor: 'pointer', border: selectedFeatures.includes(f.name) ? '2px solid #4CAF50' : '1px solid #ddd'}}
                    >
                        <h3>✓ {f.name}</h3>
                        <p>{f.description}</p>
                    </div>
                ))}
            </div>
            <div className="wizard-footer">
                <button className="btn neutral" onClick={onReturn}>Back</button>
                <button className="btn primary" onClick={confirm}>Next ({selectedFeatures.length}/3)</button>
            </div>
        </div>
    );
};

const StatsStyleSelect = ({ handleNext, onReturn, setStatStyle }) => (
    <div className="wizard-slide">
        <h2>Choose Stats Method</h2>
        <div className="selection-grid three-col">
            <div className="selection-card" onClick={() => setStatStyle('stats_standard_array')}><List/><h3>Standard Array</h3><p>Fixed: 16, 14, 13, 12, 10, 8</p></div>
            <div className="selection-card" onClick={() => setStatStyle('stats_point_buy')}><Aperture/><h3>Point Buy</h3><p>Customize with 27 points</p></div>
            <div className="selection-card" onClick={() => setStatStyle('stats_random_roll')}><Dice6/><h3>Random Roll</h3><p>Roll 4d6 drop lowest</p></div>
        </div>
        <div className="wizard-footer"><button className="btn neutral" onClick={onReturn}>Back</button></div>
    </div>
);

const PointBuy = ({ formData, setFormData, handleNext, onReturn }) => {
    const budget = POINT_BUY_BUDGET;
    const remaining = budget - formData.pointSpent;

    const adjust = (stat, val) => {
        const current = formData.allocatedStats[stat];
        const next = current + val;
        let cost = 0;
        if (val > 0) cost = (next <= 13) ? 1 : 2;
        else cost = (current <= 13) ? -1 : -2;
        
        if ((val > 0 && (next > 15 || remaining < cost)) || (val < 0 && next < 8)) return;
        
        setFormData(p => ({
            ...p,
            allocatedStats: { ...p.allocatedStats, [stat]: next },
            pointSpent: p.pointSpent + cost
        }));
    };

    return (
        <div className="wizard-slide">
            <h2>Point Buy (Remaining: {remaining})</h2>
            <div className="point-buy-container">
                {CORE_STATS.map(stat => (
                    <div key={stat} className="pb-row">
                        <span>{stat}</span>
                        <div className="pb-controls">
                            <button className="pb-btn dec" onClick={() => adjust(stat, -1)}>-</button>
                            <span>{formData.allocatedStats[stat]}</span>
                            <button className="pb-btn inc" onClick={() => adjust(stat, 1)}>+</button>
                        </div>
                        <span>Mod: {getStatModifier(formData.allocatedStats[stat])}</span>
                    </div>
                ))}
            </div>
            <div className="wizard-footer"><button className="btn neutral" onClick={onReturn}>Back</button><button className="btn primary" disabled={remaining !== 0} onClick={handleNext}>Confirm</button></div>
        </div>
    );
};

const StandardArray = ({ formData, setFormData, handleNext, onReturn }) => {
    const assignedScores = formData.allocatedStats;
    const usedScores = Object.values(assignedScores).filter(s => STANDARD_ARRAY_SCORES.includes(s));
    const availableScores = STANDARD_ARRAY_SCORES.filter(s => {
        const countUsed = usedScores.filter(u => u === s).length;
        const countTotal = STANDARD_ARRAY_SCORES.filter(a => a === s).length;
        return countUsed < countTotal;
    }).sort((a,b) => b-a);

    const handleDrop = (e, stat) => {
        e.preventDefault();
        const val = parseInt(e.dataTransfer.getData("text"));
        if (availableScores.includes(val) || assignedScores[stat] === val) {
            setFormData(p => ({...p, allocatedStats: {...p.allocatedStats, [stat]: val}}));
        }
    };

    return (
        <div className="wizard-slide">
            <h2>Standard Array Allocation</h2>
            <div className="score-pool">
                {availableScores.map((s, i) => (
                    <div key={i} className="draggable-score" draggable onDragStart={(e) => e.dataTransfer.setData("text", s)}>{s}</div>
                ))}
            </div>
            <div className="stat-drop-grid">
                {CORE_STATS.map(stat => (
                    <div key={stat} className="stat-drop-target" onDragOver={(e) => e.preventDefault()} onDrop={(e) => handleDrop(e, stat)}>
                        <h4>{stat}</h4>
                        <div className={`score-display ${assignedScores[stat] !== 8 ? 'filled' : ''}`}>{assignedScores[stat] !== 8 ? assignedScores[stat] : '?'}</div>
                    </div>
                ))}
            </div>
            <div className="wizard-footer"><button className="btn neutral" onClick={onReturn}>Back</button><button className="btn primary" disabled={availableScores.length > 0} onClick={handleNext}>Confirm</button></div>
        </div>
    );
};

const RandomRoll = ({ formData, setFormData, handleNext, onReturn }) => {
    const [rolls, setRolls] = useState(formData.rolledScores);
    
    const roll = () => {
        const newRolls = Array.from({length: 6}, roll4d6DropLowest).sort((a,b)=>b-a);
        setRolls(newRolls);
        const resetStats = CORE_STATS.reduce((acc, stat) => ({ ...acc, [stat]: 8 }), {});
        setFormData(p => ({...p, rolledScores: newRolls, allocatedStats: resetStats}));
    };

    const assign = (stat, val) => {
        setFormData(p => ({...p, allocatedStats: {...p.allocatedStats, [stat]: val}}));
    };

    // Logic simplified for display: filter used scores for dropdowns
    const used = Object.values(formData.allocatedStats).filter(v => v !== 8);
    const isComplete = !CORE_STATS.some(s => formData.allocatedStats[s] === 8);

    return (
        <div className="wizard-slide">
            <h2>Random Roll</h2>
            <div className="roll-controls"><button className="btn primary" onClick={roll}>Roll Stats!</button></div>
            <div className="roll-pool">{rolls.map((r,i) => <span key={i} className="roll-val">{r}</span>)}</div>
            <div className="stat-drop-grid">
                {CORE_STATS.map(stat => (
                    <div key={stat} className="stat-drop-target">
                        <h4>{stat}</h4>
                        <select value={formData.allocatedStats[stat]} onChange={(e) => assign(stat, parseInt(e.target.value))}>
                            <option value={8}>Select...</option>
                            {[...rolls, formData.allocatedStats[stat]].filter(r => r !== 8 && (!used.includes(r) || r === formData.allocatedStats[stat])).map((r,i) => <option key={i} value={r}>{r}</option>)}
                        </select>
                    </div>
                ))}
            </div>
            <div className="wizard-footer"><button className="btn neutral" onClick={onReturn}>Back</button><button className="btn primary" disabled={!isComplete} onClick={handleNext}>Confirm</button></div>
        </div>
    );
};

const FinalSummary = ({ formData, finalStats, handleFinish, onReturn }) => {
    const [name, setName] = useState(formData.name);
    const race = RACE_DATA[formData.race];
    const cls = CLASS_DATA[formData.class];

    const finalize = () => {
        const finalData = { ...formData, finalStats, name: name || 'Unnamed Hero' };
        const saved = DatabaseService.saveCharacter(finalData);
        handleFinish(saved);
    };

    return (
        <div className="wizard-slide">
            <h2>Final Review</h2>
            <div className="summary-form">
                <label>Character Name</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter Name" />
            </div>
            <div className="summary-grid">
                <div className="summary-card race"><h3>{race.name}</h3><p>{race.summary}</p></div>
                <div className="summary-card class"><h3>{cls.name}</h3><p>{cls.summary}</p></div>
                <div className="summary-card stats">
                    <h3>Attributes</h3>
                    <ul>{Object.entries(finalStats).map(([k,v]) => <li key={k}><strong>{k}:</strong> {v} ({getStatModifier(v)>=0?'+':''}{getStatModifier(v)})</li>)}</ul>
                </div>
            </div>
            <div className="wizard-footer"><button className="btn neutral" onClick={onReturn}>Back</button><button className="btn success" onClick={finalize}>Finish</button></div>
        </div>
    );
};

// --- MAIN CONTROLLER ---
export default function Charactermancer({ onClose, onSave }) {
    const [step, setStep] = useState('title');
    const [formData, setFormData] = useState({
        race: 'Saiyan', class: 'MartialArtist', statStyle: '', name: '', level: 1,
        subSpecies: null, subRace: null, replacedFeatures: [],
        allocatedStats: CORE_STATS.reduce((acc, stat) => ({ ...acc, [stat]: 8 }), {}),
        pointSpent: 0, rolledScores: [], flexibleAllocations: {},
    });
    const [selectedChar, setSelectedChar] = useState(null);

    const applyBonuses = (base, raceKey) => {
        const race = RACE_DATA[raceKey];
        if (!race) return base;
        const final = { ...base };
        Object.entries(race.bonuses).forEach(([k, v]) => { if(CORE_STATS.includes(k)) final[k] = (final[k]||0)+v; });
        return final;
    };
    const finalStats = useMemo(() => applyBonuses(formData.allocatedStats, formData.race), [formData.allocatedStats, formData.race]);

    const next = () => {
        const flow = { 
            title: 'race_select', 
            race_select: 'race_features', 
            race_features: 'sub_species_select',
            sub_species_select: 'sub_race_select',
            sub_race_select: 'feature_replacement',
            feature_replacement: 'class_select',
            class_select: 'class_features', 
            class_features: 'stats_style' 
        };
        if (flow[step]) setStep(flow[step]);
        else if (step.startsWith('stats_')) setStep('final_summary');
    };
    const back = () => {
        const flow = { 
            race_select: 'title', 
            race_features: 'race_select', 
            sub_species_select: 'race_features',
            sub_race_select: 'sub_species_select',
            feature_replacement: 'sub_race_select',
            class_select: 'feature_replacement', 
            class_features: 'class_select', 
            stats_style: 'class_features', 
            final_summary: formData.statStyle, 
            character_select: 'title', 
            character_sheet: 'character_select' 
        };
        if (flow[step]) setStep(flow[step]);
        else if (step.startsWith('stats_') && step !== 'stats_style') setStep('stats_style');
        else setStep('title');
    };

    if (step === 'character_sheet') return <CharacterSheet characterData={selectedChar} onReturn={back} onFinish={() => { onSave(selectedChar); onClose(); }} />;

    return (
        <div className="charactermancer-overlay">
            <div className="wizard-window">
                {step === 'title' && <TitleScreen onStartCreation={() => setStep('race_select')} onSelectCharacter={() => setStep('character_select')} />}
                {step === 'character_select' && <CharacterSelectScreen onReturn={back} onCharacterSelect={(c) => { setSelectedChar(c); setStep('character_sheet'); }} />}
                {step === 'race_select' && <RaceSelect formData={formData} setFormData={setFormData} handleNext={next} onReturn={back} />}
                {step === 'race_features' && <RaceFeatures formData={formData} handleNext={next} onReturn={back} />}
                {step === 'sub_species_select' && <SubSpeciesSelect formData={formData} setFormData={setFormData} handleNext={next} onReturn={back} />}
                {step === 'sub_race_select' && <SubRaceSelect formData={formData} setFormData={setFormData} handleNext={next} onReturn={back} />}
                {step === 'feature_replacement' && <FeatureReplacement formData={formData} setFormData={setFormData} handleNext={next} onReturn={back} />}
                {step === 'class_select' && <ClassSelect formData={formData} setFormData={setFormData} handleNext={next} onReturn={back} />}
                {step === 'class_features' && <ClassFeatures formData={formData} handleNext={next} onReturn={back} />}
                {step === 'stats_style' && <StatsStyleSelect handleNext={next} onReturn={back} setStatStyle={(s) => { setFormData(p => ({...p, statStyle: s})); setStep(s); }} />}
                {step === 'stats_point_buy' && <PointBuy formData={formData} setFormData={setFormData} handleNext={next} onReturn={() => setStep('stats_style')} />}
                {step === 'stats_standard_array' && <StandardArray formData={formData} setFormData={setFormData} handleNext={next} onReturn={() => setStep('stats_style')} />}
                {step === 'stats_random_roll' && <RandomRoll formData={formData} setFormData={setFormData} handleNext={next} onReturn={() => setStep('stats_style')} />}
                {step === 'final_summary' && <FinalSummary formData={formData} finalStats={finalStats} handleFinish={(data) => { setSelectedChar(data); setStep('character_sheet'); }} onReturn={back} />}
            </div>
        </div>
    );
}
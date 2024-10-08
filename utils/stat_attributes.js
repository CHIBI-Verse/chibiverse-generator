exports.backgroundStat = function (val) {
  switch (val) {
    case 'Cold':
      return { mp: 10, magic_attack: 10, coin_bonus: 5, energy_bonus: 5 };
    case 'Fire':
      return { hp: 10, attack: 10, coin_bonus: 5, energy_bonus: 5 };
    case 'Retro':
      return { hp: 10, defence: 10, coin_bonus: 5, energy_bonus: 5 };
    default:
      return null;
  }
};

exports.typeStat = function (val) {
  switch (val) {
    case 'Astronaut':
      return { hp: 40, defence: 40 };
    case 'Ghost':
      return { hp: 50, defence: 30 };
    case 'Unlock Character':
      return { hp: 30, defence: 30 };
    case 'Who are you':
      return { hp: 35, defence: 35 };
    case 'Zombie':
      return { hp: 50, defence: 20 };
    default:
      return null;
  }
};

exports.eyeStat = function (val) {
  switch (val) {
    case 'Coin':
      return { coin_bonus: 2 };
    case 'Fighter Eye with Scouter':
      return { reduce_farming_time: 2 };
    case 'Light Eye':
      return { energy_bonus: 2 };
    default:
      return null;
  }
};

exports.mouthStat = function (val) {
  switch (val) {
    case 'Coin':
      return { coin_bonus: 3 };
    case 'Meat':
      return { reduce_farming_time: 3 };
    case 'Rainbow':
      return { energy_bonus: 3 };
    default:
      return null;
  }
};

exports.weaponStat = function (val) {
  switch (val) {
    case "Apprentice's Wand":
      return { attack: 10 };
    case 'Baseball Bat':
      return { attack: 15 };
    case 'Black Excalibur':
      return { attack: 30 };
    case 'Dango':
      return { attack: 20 };
    case 'Demon Scythe':
      return { attack: 20 };
    case 'Double Bladed Lightsaber':
      return { attack: 20 };
    case 'Excalibur':
      return { attack: 30 };
    case 'Giant Knife':
      return { attack: 15 };
    case 'Giant Sword':
      return { attack: 15 };
    case 'Glass Sword':
      return { attack: 15 };
    case 'Great Sword':
      return { attack: 15 };
    case 'Heavy Axe':
      return { attack: 10 };
    case 'Ice Sword':
      return { attack: 25 };
    case 'Inferno Sword':
      return { attack: 25 };
    case 'Iron Lance':
      return { attack: 10 };
    case 'Jade Blade':
      return { attack: 20 };
    case 'Juicy Meat':
      return { attack: 20 };
    case 'Katana':
      return { attack: 10 };
    case 'Leek':
      return { attack: 20 };
    case 'Lightning Axe':
      return { attack: 25 };
    case 'Lightsaber':
      return { attack: 20 };
    case 'Muramasa':
      return { attack: 25 };
    case 'Phantom Knife':
      return { attack: 30 };
    case 'Phantom Scythe':
      return { attack: 25 };
    case 'Poo on a Stick':
      return { attack: 15 };
    case 'Rainbow Sword':
      return { attack: 25 };
    case 'Red Lance':
      return { attack: 15 };
    case 'Slaying Moon Sword':
      return { attack: 20 };
    case 'Violet Scythe':
      return { attack: 15 };
    case 'Wand of Darkness':
      return { attack: 25 };
    case "Wizard's Staff":
      return { attack: 15 };
    case 'Wooden Axe':
      return { attack: 10 };
    case 'Wooden Bow':
      return { attack: 10 };
    case 'Wooden Lance':
      return { attack: 10 };
    case 'Wooden StaffRetro':
      return { attack: 10 };
    case 'Wooden Sword':
      return { attack: 5 };
    default:
      return null;
  }
};

exports.itemStat = function (val) {
  switch (val) {
    case 'Cheese':
      return { hp: 10 };
    case 'Chicken':
      return { hp: 10 };
    case 'Crystal Ball':
      return { mp: 10 };
    case 'Diamond':
      return { hp: 10 };
    case 'Empty Treasure Chest':
      return { hp: 10, reduce_farming_time: 5 };
    case 'Gold':
      return { hp: 10 };
    case 'Magic Ball':
      return { magic_attack: 5 };
    case 'Medium Healing Potion':
      return { hp: 15 };
    case 'Medium Mana Potion':
      return { mp: 15 };
    case 'Medium Violet Potion':
      return { hp: 15, mp: 15 };
    case 'Monster Egg':
      return { hp: 10 };
    case 'Monster Eye':
      return { hp: 10 };
    case 'Pig':
      return { attack: 10, reduce_farming_time: 5 };
    case 'Poison Potion':
      return null;
    case 'Rune Stone':
      return { hp: 10 };
    case 'Slime':
      return { hp: 10, reduce_farming_time: 5 };
    case 'Small Healing Potion':
      return { hp: 10 };
    case 'Small Mana Potion':
      return { mp: 10 };
    case 'Small Violet Potion':
      return { hp: 10, mp: 10 };
    case 'Superpower':
      return { energy_bonus: 3 };
    case 'Rainbow':
      return { hp: 10, attack: 10, reduce_farming_time: 5 };
    case 'Timber':
      return { defence: 5 };
    default:
      return null;
  }
};

exports.bodyStat = function (val) {
  switch (val) {
    case 'Adventure Outfit':
      return { hp: 10, defence: 10 };
    case 'Asura':
      return { hp: 20, defence: 20 };
    case 'Bat Outfit':
      return { hp: 20, defence: 20 };
    case "Bishop's Robe":
      return { hp: 10, defence: 10 };
    case 'Black Hakama Outfit':
      return { hp: 10, defence: 10 };
    case 'Black Hood':
      return { hp: 15, defence: 15 };
    case 'Brown Hakama Outfit':
      return { hp: 10, defence: 10 };
    case 'Brown Outfit':
      return { hp: 10, defence: 10 };
    case 'Chinese Battle Armor':
      return { hp: 15, defence: 15 };
    case 'Chinese Outfit':
      return { hp: 10, defence: 10 };
    case 'Combat Outfit':
      return { hp: 15, defence: 15 };
    case 'Dark Armor':
      return { hp: 20, defence: 20 };
    case 'Darth Outfit':
      return { hp: 20, defence: 20 };
    case 'Death Outfit':
      return { hp: 15, defence: 15 };
    case 'Fighter Outfit 2':
      return { hp: 15, defence: 15 };
    case 'Fighter Outfit':
      return { hp: 15, defence: 15 };
    case 'Gold Armor':
      return { hp: 20, defence: 20 };
    case 'Green Outfit':
      return { hp: 10, defence: 10 };
    case 'Hunter Outfit':
      return { hp: 10, defence: 10 };
    case 'Iron Armor':
      return { hp: 10, defence: 10 };
    case 'Killer Outfit':
      return { hp: 15, defence: 15 };
    case 'Knight Armor':
      return { hp: 10, defence: 10 };
    case 'Leather Armor':
      return { hp: 10, defence: 10 };
    case 'Light Armor':
      return { hp: 20, defence: 20 };
    case 'Ninja Outfit':
      return { hp: 15, defence: 15 };
    case 'Normal Outfit':
      return { hp: 5, defence: 5 };
    case 'Old Wizard Outfit':
      return { hp: 10, defence: 10 };
    case 'Onmyouji Outfit':
      return { hp: 15, defence: 15 };
    case 'Phantom Armor':
      return { hp: 20, defence: 20 };
    case 'Red Armor':
      return { hp: 10, defence: 10 };
    case 'Samurai Armor':
      return { hp: 15, defence: 15 };
    case 'Shippuden Outfit':
      return { hp: 20, defence: 20 };
    case 'Strange Outfit':
      return { hp: 10, defence: 10 };
    case 'Superhero Outfit':
      return { hp: 15, defence: 15 };
    case 'Superpower Outfit':
      return { hp: 20, defence: 20 };
    case 'Training Outfit':
      return { hp: 5, defence: 5 };
    case 'White Hakama Outfit':
      return { hp: 10, defence: 10 };
    case 'Wizard Outfit':
      return { hp: 10, defence: 10 };
    case 'Wounded Outfit':
      return { hp: 5, defence: 5 };
    default:
      return null;
  }
};

exports.headStat = function (val) {
  switch (val) {
    case 'Asura Hair':
      return { hp: 10, defence: 10 };
    case 'Bald Head':
      return { hp: 5, defence: 5 };
    case 'Bat Mask':
      return { hp: 15, defence: 15 };
    case "Bishop's Helmet":
      return { hp: 15, defence: 15 };
    case 'Black Hair':
      return { hp: 10, defence: 10 };
    case 'Blue Hair':
      return { hp: 10, defence: 10 };
    case 'Bronze Helmet':
      return { hp: 10, defence: 10 };
    case 'Brown Hair':
      return { hp: 10, defence: 10 };
    case 'Combat Helmet':
      return { hp: 15, defence: 15 };
    case 'Creed Hood':
      return { hp: 15, defence: 15 };
    case 'Dark Helmet':
      return { hp: 20, defence: 20 };
    case 'Darth Helmet':
      return { hp: 20, defence: 20 };
    case 'Death Hood':
      return { hp: 15, defence: 15 };
    case 'Demon Hair':
      return { hp: 15, defence: 15 };
    case 'Dragon Helmet':
      return { hp: 20, defence: 20 };
    case 'Fighter Hair 2':
      return { hp: 10, defence: 10 };
    case 'Fighter Hair':
      return { hp: 10, defence: 10 };
    case 'Fox Helmet':
      return { hp: 15, defence: 15 };
    case 'Green Hair':
      return { hp: 5, defence: 5 };
    case 'Hunter Cap':
      return { hp: 15, defence: 15 };
    case 'Ichi hair':
      return { hp: 10, defence: 10 };
    case 'Just hair':
      return { hp: 10, defence: 10 };
    case 'King hair':
      return { hp: 10, defence: 10 };
    case 'Knight Helm':
      return { hp: 15, defence: 15 };
    case 'Ninja Hair':
      return { hp: 15, defence: 15 };
    case 'Pajamas Hat':
      return { hp: 10, defence: 10 };
    case 'Phantom Helmet':
      return { hp: 20, defence: 20 };
    case 'Red Helmet':
      return { hp: 10, defence: 10 };
    case 'Samurai Helmet':
      return { hp: 20, defence: 20 };
    case 'Samurai hair':
      return { hp: 10, defence: 10 };
    case 'Soldier Helm':
      return { hp: 15, defence: 15 };
    case 'Stand Hat':
      return { hp: 20, defence: 20 };
    case 'Straw Hat':
      return { hp: 15, defence: 15 };
    case 'Suku Hair':
      return { hp: 10, defence: 10 };
    case 'Super Fighter Hair 2':
      return { hp: 15, defence: 15 };
    case 'Super Fighter Hair':
      return { hp: 15, defence: 15 };
    case "Valkyrie's Helm":
      return { hp: 20, defence: 20 };
    case 'Violet Hair':
      return { hp: 10, defence: 10 };
    case 'Wizard Hat':
      return { hp: 10, defence: 10 };
    case 'Yellow Hair':
      return { hp: 5, defence: 5 };
    default:
      return null;
  }
};

const _ = require('lodash');
const basePath = process.cwd();
const { NETWORK } = require(`${basePath}/constants/network.js`);
const fs = require('fs');
const sha1 = require(`${basePath}/node_modules/sha1`);
const { createCanvas, loadImage } = require(`${basePath}/node_modules/canvas`);
const buildDir = `${basePath}/build`;
const layersDir = `${basePath}/layers`;
const {
  format,
  baseImagesUri,
  baseAnimationUri,
  description,
  background,
  uniqueDnaTorrance,
  layerConfigurations,
  rarityDelimiter,
  shuffleLayerConfigurations,
  debugLogs,
  extraMetadata,
  text,
  namePrefix,
  network,
  solanaMetadata,
  gif,
} = require(`${basePath}/src/config.js`);
const statUtil = require('../utils/stat_attributes');
const canvas = createCanvas(format.width, format.height);
const ctx = canvas.getContext('2d');
ctx.imageSmoothingEnabled = format.smoothing;
var metadataList = [];
var attributesList = [];
var dnaList = new Set();
const DNA_DELIMITER = '-';
const HashlipsGiffer = require(`${basePath}/modules/HashlipsGiffer.js`);

let hashlipsGiffer = null;

const buildSetup = () => {
  if (fs.existsSync(buildDir)) {
    fs.rmdirSync(buildDir, { recursive: true });
  }
  fs.mkdirSync(buildDir);
  fs.mkdirSync(`${buildDir}/json`);
  fs.mkdirSync(`${buildDir}/images`);
  if (gif.export) {
    fs.mkdirSync(`${buildDir}/gifs`);
  }
};

const getRarityWeight = (_str) => {
  let nameWithoutExtension = _str.slice(0, -4);
  var nameWithoutWeight = Number(
    nameWithoutExtension.split(rarityDelimiter).pop(),
  );
  if (isNaN(nameWithoutWeight)) {
    nameWithoutWeight = 1;
  }
  return nameWithoutWeight;
};

const cleanDna = (_str) => {
  const withoutOptions = removeQueryStrings(_str);
  var dna = Number(withoutOptions.split(':').shift());
  return dna;
};

const cleanName = (_str) => {
  let nameWithoutExtension = _str.slice(0, -4);
  var nameWithoutWeight = nameWithoutExtension.split(rarityDelimiter).shift();
  return nameWithoutWeight;
};

const getElements = (path) => {
  return fs
    .readdirSync(path)
    .filter((item) => !/(^|\/)\.[^\/\.]/g.test(item))
    .map((i, index) => {
      return {
        id: index,
        name: cleanName(i),
        filename: i,
        path: `${path}${i}`,
        weight: getRarityWeight(i),
      };
    });
};

const layersSetup = (layersOrder) => {
  const layers = layersOrder.map((layerObj, index) => ({
    id: index,
    elements: getElements(`${layersDir}/${layerObj.name}/`),
    name:
      layerObj.options?.['displayName'] != undefined
        ? layerObj.options?.['displayName']
        : layerObj.name,
    blend:
      layerObj.options?.['blend'] != undefined
        ? layerObj.options?.['blend']
        : 'source-over',
    opacity:
      layerObj.options?.['opacity'] != undefined
        ? layerObj.options?.['opacity']
        : 1,
    bypassDNA:
      layerObj.options?.['bypassDNA'] !== undefined
        ? layerObj.options?.['bypassDNA']
        : false,
  }));
  return layers;
};

const saveImage = (_editionCount) => {
  fs.writeFileSync(
    `${buildDir}/images/${_editionCount}.png`,
    canvas.toBuffer('image/png'),
  );
};

const genColor = () => {
  let hue = Math.floor(Math.random() * 360);
  let pastel = `hsl(${hue}, 100%, ${background.brightness})`;
  return pastel;
};

const drawBackground = () => {
  ctx.fillStyle = background.static ? background.default : genColor();
  ctx.fillRect(0, 0, format.width, format.height);
};

const addMetadata = (_dna, _edition) => {
  let dateTime = Date.now();
  let tempMetadata = {
    name: `${namePrefix} #${_edition}`,
    description: description,
    image: `${baseImagesUri}/${_edition}.png`,
    external_url: `https://chibiverse.fun/chibi/${_edition}`,
    dna: sha1(_dna),
    edition: _edition,
    date: dateTime,
    ...extraMetadata,
    attributes: attributesList,
    // compiler: 'Toffysoft Custom Engine',
  };
  if (network == NETWORK.sol) {
    tempMetadata = {
      //Added metadata for solana
      name: tempMetadata.name,
      symbol: solanaMetadata.symbol,
      description: tempMetadata.description,
      //Added metadata for solana
      seller_fee_basis_points: solanaMetadata.seller_fee_basis_points,
      image: `image.png`,
      //Added metadata for solana
      external_url: solanaMetadata.external_url,
      edition: _edition,
      ...extraMetadata,
      attributes: tempMetadata.attributes,
      properties: {
        files: [
          {
            uri: 'image.png',
            type: 'image/png',
          },
        ],
        category: 'image',
        creators: solanaMetadata.creators,
      },
    };
  }

  const attributes = _.get(tempMetadata, ['attributes']);

  const background = _.find(attributes, (o) => o.trait_type === 'Background');

  if (_.includes(['Cold', 'Fire', 'Retro'], background.value)) {
    tempMetadata.animation_url = `${baseAnimationUri}/${_edition}.mp4`;

    console.log(tempMetadata);
  }

  metadataList.push(tempMetadata);
  attributesList = [];
};

const addAttributes = (_element) => {
  let selectedElement = _element.layer.selectedElement;

  if (selectedElement.name != '-') {
    attributesList.push({
      trait_type: _element.layer.name,
      value: selectedElement.name,
    });
  }
};

const loadLayerImg = async (_layer) => {
  return new Promise(async (resolve) => {
    const image = await loadImage(`${_layer.selectedElement.path}`);
    resolve({ layer: _layer, loadedImage: image });
  });
};

const addText = (_sig, x, y, size) => {
  ctx.fillStyle = text.color;
  ctx.font = `${text.weight} ${size}pt ${text.family}`;
  ctx.textBaseline = text.baseline;
  ctx.textAlign = text.align;
  ctx.fillText(_sig, x, y);
};

const drawElement = (_renderObject, _index, _layersLen) => {
  ctx.globalAlpha = _renderObject.layer.opacity;
  ctx.globalCompositeOperation = _renderObject.layer.blend;
  text.only
    ? addText(
        `${_renderObject.layer.name}${text.spacer}${_renderObject.layer.selectedElement.name}`,
        text.xGap,
        text.yGap * (_index + 1),
        text.size,
      )
    : _renderObject.loadedImage &&
      ctx.drawImage(
        _renderObject.loadedImage,
        0,
        0,
        format.width,
        format.height,
      );

  addAttributes(_renderObject);
};

const constructLayerToDna = (_dna = '', _layers = []) => {
  let mappedDnaToLayers = _layers.map((layer, index) => {
    let selectedElement = layer.elements.find(
      (e) => e.id == cleanDna(_dna.split(DNA_DELIMITER)[index]),
    );
    return {
      name: layer.name,
      blend: layer.blend,
      opacity: layer.opacity,
      selectedElement: selectedElement,
    };
  });
  return mappedDnaToLayers;
};

/**
 * In some cases a DNA string may contain optional query parameters for options
 * such as bypassing the DNA isUnique check, this function filters out those
 * items without modifying the stored DNA.
 *
 * @param {String} _dna New DNA string
 * @returns new DNA string with any items that should be filtered, removed.
 */
const filterDNAOptions = (_dna) => {
  const dnaItems = _dna.split(DNA_DELIMITER);
  const filteredDNA = dnaItems.filter((element) => {
    const query = /(\?.*$)/;
    const querystring = query.exec(element);
    if (!querystring) {
      return true;
    }
    const options = querystring[1].split('&').reduce((r, setting) => {
      const keyPairs = setting.split('=');
      return { ...r, [keyPairs[0]]: keyPairs[1] };
    }, []);

    return options.bypassDNA;
  });

  return filteredDNA.join(DNA_DELIMITER);
};

/**
 * Cleaning function for DNA strings. When DNA strings include an option, it
 * is added to the filename with a ?setting=value query string. It needs to be
 * removed to properly access the file name before Drawing.
 *
 * @param {String} _dna The entire newDNA string
 * @returns Cleaned DNA string without querystring parameters.
 */
const removeQueryStrings = (_dna) => {
  const query = /(\?.*$)/;
  return _dna.replace(query, '');
};

const isDnaUnique = (_DnaList = new Set(), _dna = '') => {
  const _filteredDNA = filterDNAOptions(_dna);
  return !_DnaList.has(_filteredDNA);
};

const createDna = (_layers) => {
  let randNum = [];
  _layers.forEach((layer) => {
    var totalWeight = 0;
    layer.elements.forEach((element) => {
      totalWeight += element.weight;
    });
    // number between 0 - totalWeight
    let random = Math.floor(Math.random() * totalWeight);
    for (var i = 0; i < layer.elements.length; i++) {
      // subtract the current weight from the random weight until we reach a sub zero value.
      random -= layer.elements[i].weight;
      if (random < 0) {
        return randNum.push(
          `${layer.elements[i].id}:${layer.elements[i].filename}${
            layer.bypassDNA ? '?bypassDNA=true' : ''
          }`,
        );
      }
    }
  });
  return randNum.join(DNA_DELIMITER);
};

const writeMetaData = (_data) => {
  fs.writeFileSync(`${buildDir}/json/_metadata.json`, _data);
};

const saveMetaDataSingleFile = (_editionCount) => {
  let metadata = metadataList.find((meta) => meta.edition == _editionCount);

  let hp = 0;
  let mp = 0;
  let attack = 0;
  let magic_attack = 0;
  let defence = 0;
  let coin_bonus = 0;
  let energy_bonus = 0;
  let reduce_farming_time = 0;

  const attributes = _.get(metadata, ['attributes'], []);
  const attributesWithStat = [...attributes];
  const background = _.find(attributes, (o) => o.trait_type === 'Background');
  const type = _.find(attributes, (o) => o.trait_type === 'Type');
  const eye = _.find(attributes, (o) => o.trait_type === 'Eye');
  const mouth = _.find(attributes, (o) => o.trait_type === 'Mouth');
  const weapon = _.find(attributes, (o) => o.trait_type === 'Weapon');
  const item = _.find(attributes, (o) => o.trait_type === 'Item');

  const backgroundStat =
    background?.value && statUtil.backgroundStat(background?.value);
  const typeStat = type?.value && statUtil.typeStat(type?.value);
  const eyeStat = eye?.value && statUtil.eyeStat(eye?.value);
  const mouthStat = mouth?.value && statUtil.mouthStat(mouth?.value);
  const weaponStat = weapon?.value && statUtil.weaponStat(weapon?.value);
  const itemStat = item?.value && statUtil.itemStat(item?.value);

  if (backgroundStat) {
    const backgroundStatHP = _.toSafeInteger(_.get(backgroundStat, ['hp'], 0));
    const backgroundStatMP = _.toSafeInteger(_.get(backgroundStat, ['mp'], 0));
    const backgroundStatAttack = _.toSafeInteger(
      _.get(backgroundStat, ['attack'], 0),
    );
    const backgroundStatMagicAttack = _.toSafeInteger(
      _.get(backgroundStat, ['magic_attack'], 0),
    );
    const backgroundStatDefence = _.toSafeInteger(
      _.get(backgroundStat, ['defence'], 0),
    );
    const backgroundStatCoinBonus = _.toSafeInteger(
      _.get(backgroundStat, ['coin_bonus'], 0),
    );
    const backgroundStatEnergyBonus = _.toSafeInteger(
      _.get(backgroundStat, ['energy_bonus'], 0),
    );
    const backgroundStatReduceFarmingTime = _.toSafeInteger(
      _.get(backgroundStat, ['reduce_farming_time'], 0),
    );

    hp += backgroundStatHP;
    mp += backgroundStatMP;
    attack += backgroundStatAttack;
    magic_attack += backgroundStatMagicAttack;
    defence += backgroundStatDefence;
    coin_bonus += backgroundStatCoinBonus;
    energy_bonus += backgroundStatEnergyBonus;
    reduce_farming_time += backgroundStatReduceFarmingTime;

    // console.log({
    //   hp,
    //   backgroundStatHP,
    //   mp,
    //   backgroundStatMP,
    //   attack,
    //   backgroundStatAttack,
    //   magic_attack,
    //   backgroundStatMagicAttack,
    //   defence,
    //   backgroundStatDefence,
    //   coin_bonus,
    //   backgroundStatCoinBonus,
    //   energy_bonus,
    //   backgroundStatEnergyBonus,
    //   reduce_farming_time,
    //   backgroundStatReduceFarmingTime,
    // });
  }

  if (typeStat) {
    const typeStatHP = _.toSafeInteger(_.get(typeStat, ['hp'], 0));
    const typeStatMP = _.toSafeInteger(_.get(typeStat, ['mp'], 0));
    const typeStatAttack = _.toSafeInteger(_.get(typeStat, ['attack'], 0));
    const typeStatMagicAttack = _.toSafeInteger(
      _.get(typeStat, ['magic_attack'], 0),
    );
    const typeStatDefence = _.toSafeInteger(_.get(typeStat, ['defence'], 0));
    const typeStatCoinBonus = _.toSafeInteger(
      _.get(typeStat, ['coin_bonus'], 0),
    );
    const typeStatEnergyBonus = _.toSafeInteger(
      _.get(typeStat, ['energy_bonus'], 0),
    );
    const typeStatReduceFarmingTime = _.toSafeInteger(
      _.get(typeStat, ['reduce_farming_time'], 0),
    );

    hp += typeStatHP;
    mp += typeStatMP;
    attack += typeStatAttack;
    magic_attack += typeStatMagicAttack;
    defence += typeStatDefence;
    coin_bonus += typeStatCoinBonus;
    energy_bonus += typeStatEnergyBonus;
    reduce_farming_time += typeStatReduceFarmingTime;

    // console.log({
    //   hp,
    //   typeStatHP,
    //   mp,
    //   typeStatMP,
    //   attack,
    //   typeStatAttack,
    //   magic_attack,
    //   typeStatMagicAttack,
    //   defence,
    //   typeStatDefence,
    //   coin_bonus,
    //   typeStatCoinBonus,
    //   energy_bonus,
    //   typeStatEnergyBonus,
    //   reduce_farming_time,
    //   typeStatReduceFarmingTime,
    // });
  }

  if (eyeStat) {
    const eyeStatHP = _.toSafeInteger(_.get(eyeStat, ['hp'], 0));
    const eyeStatMP = _.toSafeInteger(_.get(eyeStat, ['mp'], 0));
    const eyeStatAttack = _.toSafeInteger(_.get(eyeStat, ['attack'], 0));
    const eyeStatMagicAttack = _.toSafeInteger(
      _.get(eyeStat, ['magic_attack'], 0),
    );
    const eyeStatDefence = _.toSafeInteger(_.get(eyeStat, ['defence'], 0));
    const eyeStatCoinBonus = _.toSafeInteger(_.get(eyeStat, ['coin_bonus'], 0));
    const eyeStatEnergyBonus = _.toSafeInteger(
      _.get(eyeStat, ['energy_bonus'], 0),
    );
    const eyeStatReduceFarmingTime = _.toSafeInteger(
      _.get(eyeStat, ['reduce_farming_time'], 0),
    );

    hp += eyeStatHP;
    mp += eyeStatMP;
    attack += eyeStatAttack;
    magic_attack += eyeStatMagicAttack;
    defence += eyeStatDefence;
    coin_bonus += eyeStatCoinBonus;
    energy_bonus += eyeStatEnergyBonus;
    reduce_farming_time += eyeStatReduceFarmingTime;

    // console.log({
    //   hp,
    //   eyeStatHP,
    //   mp,
    //   eyeStatMP,
    //   attack,
    //   eyeStatAttack,
    //   magic_attack,
    //   eyeStatMagicAttack,
    //   defence,
    //   eyeStatDefence,
    //   coin_bonus,
    //   eyeStatCoinBonus,
    //   energy_bonus,
    //   eyeStatEnergyBonus,
    //   reduce_farming_time,
    //   eyeStatReduceFarmingTime,
    // });
  }

  if (mouthStat) {
    const mouthStatHP = _.toSafeInteger(_.get(mouthStat, ['hp'], 0));
    const mouthStatMP = _.toSafeInteger(_.get(mouthStat, ['mp'], 0));
    const mouthStatAttack = _.toSafeInteger(_.get(mouthStat, ['attack'], 0));
    const mouthStatMagicAttack = _.toSafeInteger(
      _.get(mouthStat, ['magic_attack'], 0),
    );
    const mouthStatDefence = _.toSafeInteger(_.get(mouthStat, ['defence'], 0));
    const mouthStatCoinBonus = _.toSafeInteger(
      _.get(mouthStat, ['coin_bonus'], 0),
    );
    const mouthStatEnergyBonus = _.toSafeInteger(
      _.get(mouthStat, ['energy_bonus'], 0),
    );
    const mouthStatReduceFarmingTime = _.toSafeInteger(
      _.get(mouthStat, ['reduce_farming_time'], 0),
    );

    hp += mouthStatHP;
    mp += mouthStatMP;
    attack += mouthStatAttack;
    magic_attack += mouthStatMagicAttack;
    defence += mouthStatDefence;
    coin_bonus += mouthStatCoinBonus;
    energy_bonus += mouthStatEnergyBonus;
    reduce_farming_time += mouthStatReduceFarmingTime;

    // console.log({
    //   hp,
    //   mouthStatHP,
    //   mp,
    //   mouthStatMP,
    //   attack,
    //   mouthStatAttack,
    //   magic_attack,
    //   mouthStatMagicAttack,
    //   defence,
    //   mouthStatDefence,
    //   coin_bonus,
    //   mouthStatCoinBonus,
    //   energy_bonus,
    //   mouthStatEnergyBonus,
    //   reduce_farming_time,
    //   mouthStatReduceFarmingTime,
    // });
  }

  if (weaponStat) {
    const weaponStatHP = _.toSafeInteger(_.get(weaponStat, ['hp'], 0));
    const weaponStatMP = _.toSafeInteger(_.get(weaponStat, ['mp'], 0));
    const weaponStatAttack = _.toSafeInteger(_.get(weaponStat, ['attack'], 0));
    const weaponStatMagicAttack = _.toSafeInteger(
      _.get(weaponStat, ['magic_attack'], 0),
    );
    const weaponStatDefence = _.toSafeInteger(
      _.get(weaponStat, ['defence'], 0),
    );
    const weaponStatCoinBonus = _.toSafeInteger(
      _.get(weaponStat, ['coin_bonus'], 0),
    );
    const weaponStatEnergyBonus = _.toSafeInteger(
      _.get(weaponStat, ['energy_bonus'], 0),
    );
    const weaponStatReduceFarmingTime = _.toSafeInteger(
      _.get(weaponStat, ['reduce_farming_time'], 0),
    );

    hp += weaponStatHP;
    mp += weaponStatMP;
    attack += weaponStatAttack;
    magic_attack += weaponStatMagicAttack;
    defence += weaponStatDefence;
    coin_bonus += weaponStatCoinBonus;
    energy_bonus += weaponStatEnergyBonus;
    reduce_farming_time += weaponStatReduceFarmingTime;

    // console.log({
    //   hp,
    //   weaponStatHP,
    //   mp,
    //   weaponStatMP,
    //   attack,
    //   weaponStatAttack,
    //   magic_attack,
    //   weaponStatMagicAttack,
    //   defence,
    //   weaponStatDefence,
    //   coin_bonus,
    //   weaponStatCoinBonus,
    //   energy_bonus,
    //   weaponStatEnergyBonus,
    //   reduce_farming_time,
    //   weaponStatReduceFarmingTime,
    // });
  }

  if (itemStat) {
    const itemStatHP = _.toSafeInteger(_.get(itemStat, ['hp'], 0));
    const itemStatMP = _.toSafeInteger(_.get(itemStat, ['mp'], 0));
    const itemStatAttack = _.toSafeInteger(_.get(itemStat, ['attack'], 0));
    const itemStatMagicAttack = _.toSafeInteger(
      _.get(itemStat, ['magic_attack'], 0),
    );
    const itemStatDefence = _.toSafeInteger(_.get(itemStat, ['defence'], 0));
    const itemStatCoinBonus = _.toSafeInteger(
      _.get(itemStat, ['coin_bonus'], 0),
    );
    const itemStatEnergyBonus = _.toSafeInteger(
      _.get(itemStat, ['energy_bonus'], 0),
    );
    const itemStatReduceFarmingTime = _.toSafeInteger(
      _.get(itemStat, ['reduce_farming_time'], 0),
    );

    hp += itemStatHP;
    mp += itemStatMP;
    attack += itemStatAttack;
    magic_attack += itemStatMagicAttack;
    defence += itemStatDefence;
    coin_bonus += itemStatCoinBonus;
    energy_bonus += itemStatEnergyBonus;
    reduce_farming_time += itemStatReduceFarmingTime;

    // console.log({
    //   hp,
    //   itemStatHP,
    //   mp,
    //   itemStatMP,
    //   attack,
    //   itemStatAttack,
    //   magic_attack,
    //   itemStatMagicAttack,
    //   defence,
    //   itemStatDefence,
    //   coin_bonus,
    //   itemStatCoinBonus,
    //   energy_bonus,
    //   itemStatEnergyBonus,
    //   reduce_farming_time,
    //   itemStatReduceFarmingTime,
    // });
  }

  attributesWithStat.push({
    trait_type: 'HP',
    value: hp >= 100 ? 100 : hp,
    max_value: 100,
  });
  attributesWithStat.push({
    trait_type: 'MP',
    value: mp >= 100 ? 100 : mp,
    max_value: 100,
  });
  attributesWithStat.push({
    trait_type: 'Attack',
    value: attack >= 100 ? 100 : attack,
    max_value: 100,
  });
  attributesWithStat.push({
    trait_type: 'Magic Attack',
    value: magic_attack >= 100 ? 100 : magic_attack,
    max_value: 100,
  });
  attributesWithStat.push({
    trait_type: 'Defence',
    value: defence >= 100 ? 100 : defence,
    max_value: 100,
  });

  if (coin_bonus) {
    attributesWithStat.push({
      display_type: 'boost_percentage',
      trait_type: 'Coin Bonus',
      value: coin_bonus >= 10 ? 10 : coin_bonus,
    });
  }

  if (energy_bonus) {
    attributesWithStat.push({
      display_type: 'boost_percentage',
      trait_type: 'Energy Bonus',
      value: energy_bonus >= 10 ? 10 : energy_bonus,
    });
  }

  if (reduce_farming_time) {
    attributesWithStat.push({
      display_type: 'boost_percentage',
      trait_type: 'Reduce Farming Time',
      value: reduce_farming_time >= 10 ? 10 : reduce_farming_time,
    });
  }

  _.set(metadata, ['attributes'], attributesWithStat);

  delete metadata.edition;

  debugLogs
    ? console.log(
        `Writing metadata for ${_editionCount}: ${JSON.stringify(metadata)}`,
      )
    : null;
  fs.writeFileSync(
    `${buildDir}/json/${_editionCount}.json`,
    JSON.stringify(metadata, null, 2),
  );
};

function shuffle(array) {
  let currentIndex = array.length,
    randomIndex;
  while (currentIndex != 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }
  return array;
}

const startCreating = async () => {
  let layerConfigIndex = 0;
  let editionCount = 1;
  let failedCount = 0;
  let abstractedIndexes = [];
  for (
    let i = network == NETWORK.sol ? 0 : 1;
    i <= layerConfigurations[layerConfigurations.length - 1].growEditionSizeTo;
    i++
  ) {
    abstractedIndexes.push(i);
  }
  if (shuffleLayerConfigurations) {
    abstractedIndexes = shuffle(abstractedIndexes);
  }
  debugLogs
    ? console.log('Editions left to create: ', abstractedIndexes)
    : null;
  while (layerConfigIndex < layerConfigurations.length) {
    const layers = layersSetup(
      layerConfigurations[layerConfigIndex].layersOrder,
    );
    while (
      editionCount <= layerConfigurations[layerConfigIndex].growEditionSizeTo
    ) {
      let newDna = createDna(layers);
      if (isDnaUnique(dnaList, newDna)) {
        let results = constructLayerToDna(newDna, layers);
        let loadedElements = [];

        results.forEach((layer) => {
          loadedElements.push(loadLayerImg(layer));
        });

        await Promise.all(loadedElements).then((renderObjectArray) => {
          debugLogs ? console.log('Clearing canvas') : null;
          ctx.clearRect(0, 0, format.width, format.height);
          if (gif.export) {
            hashlipsGiffer = new HashlipsGiffer(
              canvas,
              ctx,
              `${buildDir}/gifs/${abstractedIndexes[0]}.gif`,
              gif.repeat,
              gif.quality,
              gif.delay,
            );
            hashlipsGiffer.start();
          }
          if (background.generate) {
            drawBackground();
          }
          renderObjectArray.forEach((renderObject, index) => {
            const typeObject = _.find(
              renderObjectArray,
              (o) => o.layer.name === 'Type',
            );

            const type = _.get(typeObject, ['layer', 'selectedElement']);

            const layerName = _.get(renderObject, ['layer', 'name']);

            if (
              type.name !== 'None' &&
              (layerName === 'Head' ||
                layerName === 'Body' ||
                layerName === 'Skin' ||
                layerName === 'Eye' ||
                layerName === 'Mouth')
            ) {
              const o = _.cloneDeep(renderObject);

              _.set(o, ['loadedImage'], null);
              _.set(o, ['layer', 'selectedElement', 'name'], '-');

              drawElement(
                o,
                index,
                layerConfigurations[layerConfigIndex].layersOrder.length,
              );
              if (gif.export) {
                hashlipsGiffer.add();
              }
              return;
            }

            drawElement(
              renderObject,
              index,
              layerConfigurations[layerConfigIndex].layersOrder.length,
            );
            if (gif.export) {
              hashlipsGiffer.add();
            }
          });
          if (gif.export) {
            hashlipsGiffer.stop();
          }
          debugLogs
            ? console.log('Editions left to create: ', abstractedIndexes)
            : null;
          saveImage(abstractedIndexes[0]);
          addMetadata(newDna, abstractedIndexes[0]);
          saveMetaDataSingleFile(abstractedIndexes[0]);
          console.log(
            `Created edition: ${abstractedIndexes[0]}, with DNA: ${sha1(
              newDna,
            )}`,
          );
        });
        dnaList.add(filterDNAOptions(newDna));
        editionCount++;
        abstractedIndexes.shift();
      } else {
        console.log('DNA exists!');
        failedCount++;
        if (failedCount >= uniqueDnaTorrance) {
          console.log(
            `You need more layers or elements to grow your edition to ${layerConfigurations[layerConfigIndex].growEditionSizeTo} artworks!`,
          );
          process.exit();
        }
      }
    }
    layerConfigIndex++;
  }
  writeMetaData(JSON.stringify(metadataList, null, 2));
};

module.exports = { startCreating, buildSetup, getElements };

const basePath = process.cwd();
const { MODE } = require(`${basePath}/constants/blend_mode.js`);
const { NETWORK } = require(`${basePath}/constants/network.js`);

const network = NETWORK.eth;

// General metadata for Ethereum
const namePrefix = 'CHIBI';
const description =
  'A collection of 10,000 NFTs minted on the Ethereum blockchain. Every character is created by a random algorithm which ensures that each character is unique and differentiated from the others.';
const baseImagesUri = 'ipfs://NewImagesToReplace';
const baseAnimationUri = 'ipfs://NewAnimationUriToReplace';

const solanaMetadata = {
  symbol: 'YC',
  seller_fee_basis_points: 1000, // Define how much % you want from secondary market sales 1000 = 10%
  external_url: 'https://www.youtube.com/c/hashlipsnft',
  creators: [
    {
      address: '7fXNuer5sbZtaTEPhtJ5g5gNtuyRoKkvxdjEjEnPN4mC',
      share: 100,
    },
  ],
};

// If you have selected Solana then the collection starts from 0 automatically
const layerConfigurations = [
  {
    growEditionSizeTo: 100,
    layersOrder: [
      { name: 'Background' },
      { name: 'Weapon' },
      { name: 'Type' },
      { name: 'Skin' },
      { name: 'Body' },
      { name: 'Eye' },
      { name: 'Head' },
      { name: 'Item' },
      { name: 'Mouth' },
    ],
  },
];

const shuffleLayerConfigurations = true;

const debugLogs = false;

const format = {
  width: 500,
  height: 500,
  smoothing: true,
};

const gif = {
  export: false,
  repeat: 0,
  quality: 100,
  delay: 500,
};

const text = {
  only: true,
  color: '#000',
  size: 20,
  xGap: 40,
  yGap: 40,
  align: 'left',
  baseline: 'top',
  weight: 'regular',
  family: 'Courier',
  spacer: ' => ',
};

const pixelFormat = {
  ratio: 128 / 1024,
};

const background = {
  generate: true,
  brightness: '80%',
  static: false,
  default: '#000000',
};

const extraMetadata = {
  creator: 'Maxvoy',
};

const rarityDelimiter = '#';

const uniqueDnaTorrance = 3000;

const preview = {
  thumbPerRow: 5,
  thumbWidth: 300,
  imageRatio: format.height / format.width,
  imageName: 'preview.png',
};

const preview_gif = {
  numberOfImages: 5,
  order: 'ASC', // ASC, DESC, MIXED
  repeat: 0,
  quality: 100,
  delay: 500,
  imageName: 'preview.gif',
};

module.exports = {
  format,
  baseImagesUri,
  baseAnimationUri,
  description,
  background,
  uniqueDnaTorrance,
  layerConfigurations,
  rarityDelimiter,
  preview,
  shuffleLayerConfigurations,
  debugLogs,
  extraMetadata,
  pixelFormat,
  text,
  namePrefix,
  network,
  solanaMetadata,
  gif,
  preview_gif,
};

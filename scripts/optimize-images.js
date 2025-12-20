import sharp from 'sharp';
import fs from 'fs/promises';
import imagemin from 'imagemin';
import imageminMozjpeg from 'imagemin-mozjpeg';
import path from 'node:path';

const INPUT_DIR = process.env.IMAGE_INPUT_DIR || './raw-images';
const OUTPUT_DIR = process.env.IMAGE_OUTPUT_DIR || './public/images/products';

/**
 * Quality settings by image type
 */
const QUALITY_SETTINGS = {
  hero: { jpeg: 85, webp: 80 },
  thumbnail: { jpeg: 80, webp: 75 },
  detail: { jpeg: 85, webp: 80 }
};

/**
 * Responsive dimensions for each image type
 */
const SIZES = {
  hero: [
    { width: 2400, suffix: '' },
    { width: 4800, suffix: '@2x' },
    { width: 1200, suffix: '@mobile' }
  ],
  thumbnail: [
    { width: 800, suffix: '' },
    { width: 400, suffix: '@mobile' }
  ],
  detail: [
    { width: 1600, suffix: '' }
  ]
};

function getOutputPath(baseName, suffix, extension) {
  return `${OUTPUT_DIR}/${baseName}${suffix}.${extension}`;
}

/**
 * Process an image in multiple sizes and formats
 */
async function processImage(inputPath, outputName, type) {
  const sizes = SIZES[type];
  const quality = QUALITY_SETTINGS[type];

  if (!sizes || !quality) {
    throw new Error(`Invalid image type: ${type}. Missing size or quality configuration.`);
  }

  let sourceBuffer;
  try {
    sourceBuffer = await fs.readFile(inputPath);
  } catch (error) {
    error.stage = 'read';
    throw error;
  }

  const ext = path.extname(inputPath).toLowerCase();
  const isJpeg = ext === '.jpg' || ext === '.jpeg';

  let optimizedSource = sourceBuffer;
  if (isJpeg) {
    try {
      optimizedSource = await imagemin.buffer(sourceBuffer, {
        plugins: [
          imageminMozjpeg({
            quality: quality.jpeg,
            progressive: true
          })
        ]
      });
    } catch (error) {
      error.stage = 'preoptimize';
      throw error;
    }
  }

  for (const size of sizes) {
    const jpegPath = getOutputPath(outputName, size.suffix, 'jpg');
    const webpPath = getOutputPath(outputName, size.suffix, 'webp');

    // Generate optimized JPEG
    await sharp(optimizedSource)
      .resize(size.width, null, {
        withoutEnlargement: true,
        fit: 'inside'
      })
      .jpeg({
        quality: quality.jpeg,
        progressive: true,
        mozjpeg: true
      })
      .toFile(jpegPath);

    // Generate WebP
    await sharp(optimizedSource)
      .resize(size.width, null, {
        withoutEnlargement: true,
        fit: 'inside'
      })
      .webp({
        quality: quality.webp,
        effort: 6
      })
      .toFile(webpPath);

    console.log(`✅ Processed: ${outputName}${size.suffix}`);
  }
}

/**
 * Process all images
 */
async function optimizeAllImages() {
  // Create output directory if it doesn't exist
  await fs.mkdir(OUTPUT_DIR, { recursive: true });

  // List of images to process
  const images = [
    // Crema Cotta Abacaxi
    { input: `${INPUT_DIR}/crema-abacaxi-hero.jpg`, output: 'crema-abacaxi-hero', type: 'hero' },
    { input: `${INPUT_DIR}/crema-abacaxi-top.jpg`, output: 'crema-abacaxi-top', type: 'detail' },
    { input: `${INPUT_DIR}/crema-abacaxi-detail.jpg`, output: 'crema-abacaxi-detail', type: 'detail' },
    { input: `${INPUT_DIR}/crema-abacaxi-thumb.jpg`, output: 'crema-abacaxi-thumb', type: 'thumbnail' },

    // Crema Cotta Maracujá
    { input: `${INPUT_DIR}/crema-maracuja-hero.jpg`, output: 'crema-maracuja-hero', type: 'hero' },
    { input: `${INPUT_DIR}/crema-maracuja-top.jpg`, output: 'crema-maracuja-top', type: 'detail' },
    { input: `${INPUT_DIR}/crema-maracuja-detail.jpg`, output: 'crema-maracuja-detail', type: 'detail' },
    { input: `${INPUT_DIR}/crema-maracuja-thumb.jpg`, output: 'crema-maracuja-thumb', type: 'thumbnail' },

    // Crema Cotta Morango
    { input: `${INPUT_DIR}/crema-morango-hero.jpg`, output: 'crema-morango-hero', type: 'hero' },
    { input: `${INPUT_DIR}/crema-morango-top.jpg`, output: 'crema-morango-top', type: 'detail' },
    { input: `${INPUT_DIR}/crema-morango-detail.jpg`, output: 'crema-morango-detail', type: 'detail' },
    { input: `${INPUT_DIR}/crema-morango-thumb.jpg`, output: 'crema-morango-thumb', type: 'thumbnail' },

    // Strati di Moca
    { input: `${INPUT_DIR}/strati-moca-hero.jpg`, output: 'strati-moca-hero', type: 'hero' },
    { input: `${INPUT_DIR}/strati-moca-top.jpg`, output: 'strati-moca-top', type: 'detail' },
    { input: `${INPUT_DIR}/strati-moca-detail.jpg`, output: 'strati-moca-detail', type: 'detail' },
    { input: `${INPUT_DIR}/strati-moca-thumb.jpg`, output: 'strati-moca-thumb', type: 'thumbnail' }
  ];

  console.log('🚀 Starting image optimization...\n');

  for (const img of images) {
    try {
      await processImage(img.input, img.output, img.type);
    } catch (error) {
      if (error?.stage === 'read') {
        console.error(`❌ Error reading input file "${img.input}":`, error);
      } else if (error?.stage === 'preoptimize') {
        console.error(`❌ Error optimizing source "${img.input}" before resizing:`, error);
      } else {
        console.error(`❌ Error processing image "${img.input}" during optimization or resizing:`, error);
      }
    }
  }

  console.log('\n✨ Optimization completed!');
  const totalGenerated = images.reduce((sum, img) => {
    const variants = SIZES[img.type]?.length ?? 0;
    return sum + variants * 2;
  }, 0);
  console.log(`📊 Total images generated: ${totalGenerated} files`);
}

// Run
optimizeAllImages();

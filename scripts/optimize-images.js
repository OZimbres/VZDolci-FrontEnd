import imagemin from 'imagemin';
import imageminMozjpeg from 'imagemin-mozjpeg';
import path from 'node:path';
import sharp from 'sharp';
import fs from 'fs/promises';

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

const JPEG_EXTENSIONS = new Set(['.jpg', '.jpeg']);
const SUFFIX_TO_TYPE = {
  '-hero': 'hero',
  '-top': 'detail',
  '-detail': 'detail',
  '-thumb': 'thumbnail'
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
  const isJpeg = JPEG_EXTENSIONS.has(ext);

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

    try {
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
    } catch (error) {
      error.stage = 'jpeg-encode';
      throw error;
    }

    try {
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
    } catch (error) {
      error.stage = 'webp-encode';
      throw error;
    }

    console.log(`✅ Processed: ${outputName}${size.suffix}`);
  }
}

async function discoverImages() {
  const images = [];
  const entries = await fs.readdir(INPUT_DIR, { withFileTypes: true });

  for (const entry of entries) {
    if (!entry.isFile()) continue;

    const ext = path.extname(entry.name).toLowerCase();
    if (!JPEG_EXTENSIONS.has(ext)) continue;

    const baseName = path.parse(entry.name).name;
    let detectedType = null;
    for (const [suffix, type] of Object.entries(SUFFIX_TO_TYPE)) {
      if (baseName.endsWith(suffix)) {
        detectedType = type;
        break;
      }
    }

    if (!detectedType) continue;

    images.push({
      input: path.join(INPUT_DIR, entry.name),
      output: baseName,
      type: detectedType
    });
  }

  return images;
}

/**
 * Process all images
 */
async function optimizeAllImages() {
  // Create output directory if it doesn't exist
  await fs.mkdir(OUTPUT_DIR, { recursive: true });

  const images = await discoverImages();

  console.log('🚀 Starting image optimization...\n');

  if (images.length === 0) {
    console.log('ℹ️ No matching images found to optimize.');
    return;
  }

  for (const img of images) {
    try {
      await processImage(img.input, img.output, img.type);
    } catch (error) {
      if (error?.stage === 'read') {
        console.error(`❌ Error reading input file "${img.input}":`, error);
      } else if (error?.stage === 'preoptimize') {
        console.error(`❌ Error optimizing source "${img.input}" before resizing:`, error);
      } else if (error?.stage === 'jpeg-encode') {
        console.error(`❌ Error encoding JPEG for "${img.input}":`, error);
      } else if (error?.stage === 'webp-encode') {
        console.error(`❌ Error encoding WebP for "${img.input}":`, error);
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
optimizeAllImages().catch((err) => {
  console.error('❌ Error during image optimization:', err);
  process.exitCode = 1;
});

const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

function crc32(buf) {
  let table = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let j = 0; j < 8; j++) {
      c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
    }
    table[i] = c;
  }
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    crc = table[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function createChunk(type, data) {
  const typeBuf = Buffer.from(type, 'ascii');
  const lenBuf = Buffer.alloc(4);
  lenBuf.writeUInt32BE(data.length, 0);

  const crcPayload = Buffer.concat([typeBuf, data]);
  const crcVal = crc32(crcPayload);
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crcVal, 0);

  return Buffer.concat([lenBuf, typeBuf, data, crcBuf]);
}

function generateIconPNG(size = 256) {
  const width = size;
  const height = size;

  // Raw image data with row filter bytes
  const rowBytes = 1 + width * 4;
  const rawData = Buffer.alloc(height * rowBytes);

  const center = size / 2;
  const radius = size * 0.44;

  for (let y = 0; y < height; y++) {
    const rowOffset = y * rowBytes;
    rawData[rowOffset] = 0; // Filter: None

    for (let x = 0; x < width; x++) {
      const pxOffset = rowOffset + 1 + x * 4;

      // Distance from center for rounded container
      const dx = Math.abs(x - center);
      const dy = Math.abs(y - center);
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Matte dark container with smooth corner
      const cornerR = size * 0.18;
      const isInsideRect = (x >= size * 0.08 && x <= size * 0.92 && y >= size * 0.08 && y <= size * 0.92);

      let r = 18, g = 18, b = 22, a = 255;

      // Draw modern folder icon geometry
      // Tab top
      const isTab = (x >= size * 0.22 && x <= size * 0.48 && y >= size * 0.24 && y <= size * 0.35);
      // Folder body
      const isBody = (x >= size * 0.20 && x <= size * 0.80 && y >= size * 0.32 && y <= size * 0.76);
      // Inner sparkle/accent
      const isAccent = (x >= size * 0.46 && x <= size * 0.54 && y >= size * 0.48 && y <= size * 0.60);

      if (isTab || isBody) {
        // Deep matte blue gradient for folder
        r = 10;
        g = 132;
        b = 255;
        if (y < size * 0.4) {
          r = 40; g = 150; b = 255;
        }
      } else if (isInsideRect) {
        // Matte dark background
        r = 16;
        g = 16;
        b = 20;
      } else {
        // Transparent outside
        a = 0;
      }

      rawData[pxOffset] = r;
      rawData[pxOffset + 1] = g;
      rawData[pxOffset + 2] = b;
      rawData[pxOffset + 3] = a;
    }
  }

  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR chunk
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8; // bit depth
  ihdrData[9] = 6; // RGBA
  ihdrData[10] = 0; // compression
  ihdrData[11] = 0; // filter
  ihdrData[12] = 0; // interlace
  const ihdrChunk = createChunk('IHDR', ihdrData);

  // IDAT chunk
  const compressed = zlib.deflateSync(rawData);
  const idatChunk = createChunk('IDAT', compressed);

  // IEND chunk
  const iendChunk = createChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

const pubDir = path.join(__dirname, '../public');
if (!fs.existsSync(pubDir)) fs.mkdirSync(pubDir, { recursive: true });

const png = generateIconPNG(256);
fs.writeFileSync(path.join(pubDir, 'icon.png'), png);
console.log('Created public/icon.png successfully!');

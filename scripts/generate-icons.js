#!/usr/bin/env node

/**
 * Icon generator for PWA
 * Creates PNG icons from SVG using sharp
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const iconsDir = path.join(__dirname, '../public/icons')

// Ensure icons directory exists
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true })
}

const sizes = [72, 96, 128, 144, 152, 192, 384, 512]

async function generateIcons() {
  for (const size of sizes) {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" fill="#3b82f6" rx="${size * 0.125}"/>
  <g transform="translate(${size/2}, ${size/2})">
    <circle cx="0" cy="0" r="${size * 0.27}" fill="none" stroke="#ffffff" stroke-width="${size * 0.04}"/>
    <circle cx="0" cy="0" r="${size * 0.19}" fill="none" stroke="#ffffff" stroke-width="${size * 0.04}"/>
    <circle cx="0" cy="0" r="${size * 0.11}" fill="none" stroke="#ffffff" stroke-width="${size * 0.04}"/>
    <circle cx="0" cy="0" r="${size * 0.04}" fill="#ffffff"/>
    <text x="0" y="${size * 0.06}" font-family="Arial, sans-serif" font-size="${size * 0.35}" font-weight="bold" fill="#ffffff" text-anchor="middle">S</text>
  </g>
</svg>`

    const pngFilename = `icon-${size}x${size}.png`
    const svgFilename = `icon-${size}x${size}.svg`

    // Save SVG
    fs.writeFileSync(path.join(iconsDir, svgFilename), svg)

    // Convert to PNG
    await sharp(Buffer.from(svg))
      .png()
      .toFile(path.join(iconsDir, pngFilename))

    console.log(`Created ${pngFilename}`)
  }

  console.log('\nIcons generated successfully!')
}

generateIcons().catch(console.error)

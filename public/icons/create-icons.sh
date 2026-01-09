#!/bin/bash
# This script creates placeholder icon files
# In production, replace these with actual PNG icons

sizes=(72 96 128 144 152 192 384 512)

for size in "${sizes[@]}"; do
  # Create a simple SVG that will serve as placeholder
  cat > "icon-${size}x${size}.png.txt" << SVGEOF
This is a placeholder for icon-${size}x${size}.png
For production, create a PNG icon with size ${size}x${size} pixels
Suggested design: Nova logo with gradient background (blue to purple)
SVGEOF
done

echo "Placeholder icon references created"

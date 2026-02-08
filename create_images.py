from PIL import Image, ImageDraw, ImageFont
import os

# Create images directory if it doesn't exist
os.makedirs('images', exist_ok=True)

# Blog images with modern gradient designs
blog_configs = [
    {
        'name': 'blog-1.jpg',
        'gradient': ['#6366f1', '#8b5cf6', '#ec4899'],
        'title': 'Model\nExplainability'
    },
    {
        'name': 'blog-2.jpg',
        'gradient': ['#10b981', '#14b8a6', '#06b6d4'],
        'title': 'Production\nML at Scale'
    },
    {
        'name': 'blog-3.jpg',
        'gradient': ['#f59e0b', '#f97316', '#ef4444'],
        'title': 'Ethical AI\n& Fairness'
    }
]

for config in blog_configs:
    # Create image
    img = Image.new('RGB', (1200, 630), color='#1a1a2e')
    draw = ImageDraw.Draw(img)
    
    # Draw gradient circles
    for i, color in enumerate(config['gradient']):
        # Convert hex to RGB
        h = color.lstrip('#')
        rgb = tuple(int(h[i:i+2], 16) for i in (0, 2, 4))
        
        # Draw large gradient orb
        x = 200 + i * 400
        y = 315
        size = 300
        bbox = [x - size//2, y - size//2, x + size//2, y + size//2]
        draw.ellipse(bbox, fill=rgb)
    
    # Add text
    try:
        font = ImageFont.truetype('arial.ttf', 80)
    except:
        font = ImageFont.load_default()
    
    # Draw text with shadow
    text = config['title']
    bbox = draw.textbbox((0, 0), text, font=font)
    text_width = bbox[2] - bbox[0]
    text_height = bbox[3] - bbox[1]
    x = (1200 - text_width) // 2
    y = (630 - text_height) // 2
    
    # Shadow
    draw.text((x+4, y+4), text, fill='#000000', font=font, align='center')
    # Main text
    draw.text((x, y), text, fill='#ffffff', font=font, align='center')
    
    img.save(f'images/{config["name"]}', quality=85)
    print(f'Created {config["name"]}')

# Create OG image
og_img = Image.new('RGB', (1200, 630), color='#0f0f1e')
draw = ImageDraw.Draw(og_img)

# Gradient background
for i in range(630):
    r = int(15 + (99 - 15) * i / 630)
    g = int(15 + (102 - 15) * i / 630)
    b = int(30 + (241 - 30) * i / 630)
    draw.line([(0, i), (1200, i)], fill=(r, g, b))

# Add text
try:
    title_font = ImageFont.truetype('arial.ttf', 100)
    subtitle_font = ImageFont.truetype('arial.ttf', 50)
except:
    title_font = ImageFont.load_default()
    subtitle_font = ImageFont.load_default()

title = 'ML Engineer &\nData Scientist'
subtitle = 'Interactive Portfolio | 2026'

# Title
bbox = draw.textbbox((0, 0), title, font=title_font)
x = (1200 - (bbox[2] - bbox[0])) // 2
draw.text((x, 180), title, fill='#ffffff', font=title_font, align='center')

# Subtitle
bbox = draw.textbbox((0, 0), subtitle, font=subtitle_font)
x = (1200 - (bbox[2] - bbox[0])) // 2
draw.text((x, 450), subtitle, fill='#22d3ee', font=subtitle_font, align='center')

og_img.save('images/og-image.jpg', quality=90)
print('Created og-image.jpg')

print('\nAll blog images and OG image created successfully!')

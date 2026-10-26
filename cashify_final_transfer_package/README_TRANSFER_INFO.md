# Cashify Catalog Transfer Package (Final Ready-to-Deploy)

This package contains complete product device data with all variants and HD images, updated with a +2% price boost.

## Directory Contents:
1. `cashify_mobile.txt` : 1,404 Mobile Phone models, 2,692 variants (+2% pricing)
2. `cashify_tablets.txt` : 483 Tablet models, 716 variants (+2% pricing)
3. `cashify_laptops.txt` : 308 Laptop models, 308 variants (+2% pricing)
4. `cashify_all_device_images.txt` : Master text catalog linking all 3,716 devices to both CDN image URLs and local files.
5. `cashify_all_device_images.json` : Master JSON database with all fields (brand, model, variant, price, image_url, local_image, page_url).
6. `images/` : Folder containing 2132 downloaded high-definition product images (.jpg / .png / .webp).

## Pricing Note:
All prices across all variants have been boosted by exactly 2% (rounded to nearest integer and formatted in Indian Rupee format).

## Website Transfer & Integration:
- Transfer this entire folder `cashify_final_transfer_package` to your server or storage.
- You can host the images locally from the `images/` directory or use the provided Cashify CDN `image_url` field.

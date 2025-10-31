
import json

def replace_broken_urls(artworks_file):
    with open(artworks_file, 'r') as f:
        artworks = json.load(f)

    for artwork in artworks:
        if artwork['imageUrl'] == "https://images.unsplash.com/photo-1549492423-400259a2e574?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80":
            artwork['imageUrl'] = f"https://picsum.photos/seed/{artwork['id']}/800/600"

    with open(artworks_file, 'w') as f:
        json.dump(artworks, f, indent=2)

if __name__ == '__main__':
    replace_broken_urls('/home/flow/art-auction/src/data/json/artworks.json')

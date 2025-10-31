
import json

def replace_broken_urls(artworks_file):
    with open(artworks_file, 'r') as f:
        artworks = json.load(f)

    new_url = "https://images.unsplash.com/photo-1549492423-400259a2e574?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"

    for artwork in artworks:
        if artwork['imageUrl'] == "https://images.unsplash.com/photo-1506806782131-5a091733363a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80":
            artwork['imageUrl'] = new_url

    with open(artworks_file, 'w') as f:
        json.dump(artworks, f, indent=2)

if __name__ == '__main__':
    replace_broken_urls('/home/flow/art-auction/src/data/json/artworks.json')

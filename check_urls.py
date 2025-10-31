
import json
import requests

def check_and_replace_urls(artworks_file):
    with open(artworks_file, 'r') as f:
        artworks = json.load(f)

    for artwork in artworks:
        try:
            response = requests.head(artwork['imageUrl'], timeout=5)
            if response.status_code != 200:
                print(f"Broken URL found for artwork ID {artwork['id']}: {artwork['imageUrl']}")
                new_url = find_new_image_url(artwork['title'])
                if new_url:
                    artwork['imageUrl'] = new_url
                    print(f"Replaced with new URL: {new_url}")
        except requests.exceptions.RequestException as e:
            print(f"Error checking URL for artwork ID {artwork['id']}: {e}")
            new_url = find_new_image_url(artwork['title'])
            if new_url:
                artwork['imageUrl'] = new_url
                print(f"Replaced with new URL: {new_url}")

    with open(artworks_file, 'w') as f:
        json.dump(artworks, f, indent=2)

def find_new_image_url(query):
    # This is a placeholder for a real image search function.
    # In a real scenario, you would use an image search API.
    # For this example, we'll just return a placeholder URL.
    print(f"Searching for new image for: {query}")
    return "https://images.unsplash.com/photo-1506806782131-5a091733363a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"

if __name__ == '__main__':
    check_and_replace_urls('/home/flow/art-auction/src/data/json/artworks.json')

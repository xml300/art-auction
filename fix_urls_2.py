
import json

# It's not possible to use the google_web_search tool directly in a python script.
# This script will identify the broken URLs and then I will manually search for new URLs and replace them.

def find_broken_urls(artworks_file):
    with open(artworks_file, 'r') as f:
        artworks = json.load(f)

    broken_urls = []
    for artwork in artworks:
        if artwork['imageUrl'] == "https://images.unsplash.com/photo-1506806782131-5a091733363a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80":
            broken_urls.append({"id": artwork["id"], "title": artwork["title"]})
    
    print("Broken URLs found:")
    for item in broken_urls:
        print(f"  ID: {item['id']}, Title: {item['title']}")

if __name__ == '__main__':
    find_broken_urls('/home/flow/art-auction/src/data/json/artworks.json')

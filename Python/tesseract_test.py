from PIL import Image, ImageDraw
import pytesseract

# Path to the image.
path = "bloodhound_test.png"

# The image object.
image = Image.open(path)

# Allows us to draw on the image.
draw = ImageDraw.Draw(image)

# Allows us to get the bounding box data.
text = pytesseract.image_to_string(image, None, True, False)

# Raw, unprocessed data from the image.
raw_data = text.split('\n')

# print(raw_data)
# The dimension of the image the words are contained within.
dims = image.size

# The words we are searching for.
words = ["104", "(City", "of", "Cambridge)", "Squadron", "ATC;", "1163", "Squadron"]

# What we use to determine if we have foud the correct word or not; deleted after each word is found.
string_builder = ""

# Saves the coords of each letter, deleted after each word is found.
coord_list = []

## The center point of the coordinates of each word, we want to save these!!
master_coords = []

for x in range(len(raw_data)):

    data = raw_data[x].split(" ")

    letter = data[0]
    
    x1 = int(data[1])
    y1 = dims[1] - int(data[2])

    x2 = int(data[3])
    y2 = dims[1] - int(data[4])

    string_builder += letter
    coord_list.append([x1, y1, x2, y2])
    
    for word in words:

        if string_builder == word:

            # print("we found word: " + word + " with the following coords: " + str(coord_list))

            num_coords = len(coord_list)
            
            word_x1 = coord_list[0][0]
            word_x2 = coord_list[num_coords - 1][2]

            word_y1 = coord_list[0][1]
            word_y2 = coord_list[num_coords - 1][3]
            
            draw.rectangle([word_x1, word_y1, word_x2, word_y2], outline = "white")

            string_builder = ""
            coord_list = []

            # Removes the current word from the list of words to search.
            words.remove(word)

            centerX = (word_x2 - word_x1) / 2 + word_x1
            centerY = (word_y1 - word_y2)/ 2 + word_y2

            # print("Word: " + word + "y1: " + str(word_y1) + ", y2: " + str(word_y2))

            master_coords.append((word, centerX, centerY))
            break
        

    # draw.rectangle([x1, y1, x2, y2], outline = "red")

"""
Currently we have each seperated word from each whole word, however we need to join the seperated words into the correct whole word.

Thankfully in the PDF file each whole word is seperated by ;, so we just need to detect that in the individual words.
"""

# For ever word found in master list.
for point in master_coords:

    x = point[1]
    y = point[2]
    word = point[0]

    """
    # For every letter in the word.
    for char in word:

        # We know this is the end of a whole word.
        if char == ";"
    """
    
    draw.ellipse([x, y, x + 5, y + 5], outline = "white")
    
    print(word + ": " + str(x) + ", " + str(y))
image.show()

    

import tensorflow as tf
import cv2
import os
from functions import *
import numpy as np
import sys

print("starting")
sys.stdout.flush()

# Exits if no arguments are given
if len(sys.argv) <= 1:
    sys.exit(1)

arg_userId = sys.argv[1]
imgPath = f'public/python/tmp_images/{arg_userId}.jpg'
modelPath = f'public/python/models/{arg_userId}.h5'

# Check if the model file exists
if not os.path.isfile(modelPath):
    print('model does not exitst') 
    sys.exit(1)

# Check if the image file exists
if not os.path.isfile(imgPath):
    print('image does not exitst') 
    sys.exit(1)

# Load the trained model
model = tf.keras.models.load_model(modelPath)

# Load and preprocess the test image
cropped_faces = detect_and_crop_faces(cv2.imread(imgPath))
face = cropped_faces[0]

# Perform feature extraction on the face (similar to the training process)
lbp_features = lbp(face)
hog_features = hog(face)
features = np.concatenate((lbp_features, hog_features))

# Reshape the features array to match the expected input shape of the model
features = features.reshape(1, -1)

# Make a prediction using the trained model
prediction = model.predict(features)

# Convert the prediction to a boolean value
is_person = bool(prediction[0])

print("is_person: " + str(is_person))
sys.stdout.flush()

os.remove(imgPath)

# Print the result
if is_person:
	print(True) #print("The person in the image matches the trained person.")
	sys.stdout.flush()
	sys.exit(10)
else:
	print(False) #print("The person in the image does not match the trained person.")
	sys.stdout.flush()
	sys.exit(20)



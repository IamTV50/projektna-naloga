import tensorflow as tf
import cv2 #pip install opencv-contrib-python
import numpy as np
from functions import *
import os
import sys

# Exits if no arguments are given
if len(sys.argv) <= 1:
    sys.exit(1)

arg_userId = sys.argv[1]
videoPath = f'tmp_videos/{arg_userId}.mp4'

if not os.path.isfile(videoPath): # Check if the video file exists
    print('video does not exitst') 
    sys.exit(1)

cap = cv2.VideoCapture(videoPath)
train_features = []
train_labels = []

i = 0
while True:
	if i % 3 != 0: # reads every 3rd frame
		i += 1
		continue

	ret, frame = cap.read()
	if not ret: # Check if the frame was successfully read
		break

	cropped_faces = detect_and_crop_faces(frame)
	if len(cropped_faces) < 1:
		i += 1
		continue

	face = cropped_faces[0]

	# Perform LBP and HOG feature extraction on the frame
	lbp_features = lbp(face)
	hog_features = hog(face)

	# Combine the features and store them
	features = np.concatenate((lbp_features, hog_features))
	train_features.append(features)

	# Set the label to 1 (frames belong to the trained person)
	train_labels.append(1)
	i += 1

# Release the video capture object
cap.release()

if (not os.path.isfile('false_faces_train_features.npy')) or (not os.path.isfile('false_faces_train_labels.npy')):
	prepare_false_faces()

# Load the false faces training features and labels
false_faces_train_features = np.load('false_faces_train_features.npy')
false_faces_train_labels = np.load('false_faces_train_labels.npy')

# Extend the original training features and labels with the false faces data
train_features.extend(false_faces_train_features)
train_labels.extend(false_faces_train_labels)

# Convert the training features and labels to numpy arrays
train_features = np.array(train_features)
train_labels = np.array(train_labels)

# Get the number of features
num_features = train_features.shape[1]

# Train the model
model = tf.keras.models.Sequential([
    tf.keras.layers.Dense(64, activation='relu', input_shape=(num_features,)),
    tf.keras.layers.Dense(32, activation='relu'),
    tf.keras.layers.Dense(1, activation='sigmoid')
])

# Compile the model
model.compile(optimizer='adam', loss='binary_crossentropy', metrics=['accuracy'])

# Train the model
model.fit(train_features, train_labels, epochs=10, batch_size=32)

# Save the trained model
model.save(f'models/{arg_userId}.h5')

os.remove(videoPath)

sys.exit(0)


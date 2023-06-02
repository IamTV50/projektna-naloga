import numpy as np
import cv2
import os

def lbp(slika):
	slika = cv2.resize(slika, (100, 100))
	slika = cv2.cvtColor(slika, cv2.COLOR_BGR2GRAY)
	histVals = []
	
	for y in range(0, slika.shape[0]):
		for x in range(slika.shape[1]):
			centerPixel = slika[y, x]
			binCodeOfBox = ''

			# Check if pixel is in the corner
			if x == 0 and y == 0:
				# Top-left corner
				neighbor_positions = [(0, 1), (1, 1), (1, 0)]
				binCodeOfBox = '000'		
				for dy, dx in neighbor_positions:
					neighbor_value = slika[y + dy, x + dx]
					binCodeOfBox += '0' if centerPixel < neighbor_value else '1'
				binCodeOfBox += '00'
			
			elif x == 0 and y == slika.shape[0] - 1:
				# Bottom-left corner
				neighbor_positions = [(-1, 0), (-1, 1), (0, 1)]
				binCodeOfBox += '0'
				for dy, dx in neighbor_positions:
					neighbor_value = slika[y + dy, x + dx]
					binCodeOfBox += '0' if centerPixel < neighbor_value else '1'
				binCodeOfBox += '0000'
			
			elif x == slika.shape[1] - 1 and y == 0:
				# Top-right corner
				neighbor_positions = [(1, 0), (1, -1), (0, -1)]		
				binCodeOfBox += '00000'
				for dy, dx in neighbor_positions:
					neighbor_value = slika[y + dy, x + dx]
					binCodeOfBox += '0' if centerPixel < neighbor_value else '1'
			
			elif x == slika.shape[1] - 1 and y == slika.shape[0] - 1:
				# Bottom-right corner
				neighbor_positions = [(-1, -1), (-1, 0), (5,5), (5, 5), (5, 5), (5, 5), (5,5), (0, -1)]	
				for dy, dx in neighbor_positions:
					if dy == 5 or dx == 5:
						binCodeOfBox += '0'
						continue
					neighbor_value = slika[y + dy, x + dx]
					binCodeOfBox += '0' if centerPixel < neighbor_value else '1'
			
			# Check if pixel is at the edge
			elif x == 0:
				# Left edge
				neighbor_positions = [(-1, 0), (-1, 1), (0, 1), (1, 1), (1, 0)]	
				binCodeOfBox += '0'	
				for dy, dx in neighbor_positions:
					neighbor_value = slika[y + dy, x + dx]
					binCodeOfBox += '0' if centerPixel < neighbor_value else '1'
				binCodeOfBox += '00'
			
			elif y == 0:
				# Top edge
				neighbor_positions = [(0, 1), (1, 1), (1, 0), (1, -1), (0, -1)]	
				binCodeOfBox += '0000'	
				for dy, dx in neighbor_positions:
					neighbor_value = slika[y + dy, x + dx]
					binCodeOfBox += '0' if centerPixel < neighbor_value else '1'
			
			elif x == slika.shape[1] - 1:
				# Right edge
				neighbor_positions = [(-1, -1), (-1, 0), (5,5), (5,5), (5,5), (1, 0), (1, -1), (0, -1)]	
				for dy, dx in neighbor_positions:
					if dy == 5 or dx == 5:
						binCodeOfBox += '0'
						continue
					neighbor_value = slika[y + dy, x + dx]
					binCodeOfBox += '0' if centerPixel < neighbor_value else '1'
			
			elif y == slika.shape[0] - 1:
				# Bottom edge
				neighbor_positions = [(-1, -1), (-1, 0), (-1, 1), (0, 1), (5, 5), (5, 5), (5, 5), (0, -1)]		
				binCodeOfBox += '0000'	
				for dy, dx in neighbor_positions:
					if dy == 5 or dx == 5:
						binCodeOfBox += '0'
						continue
					neighbor_value = slika[y + dy, x + dx]
					binCodeOfBox += '0' if centerPixel < neighbor_value else '1'
			
			# pixel is neither in the corner, neither on edge
			else:
				# (top left corner), (above center),(top right corner), (right of center), (bottom right corner), (under center), (bottom left corner), (left of center)
				neighbor_positions = [(-1, -1), (-1, 0), (-1, 1), (0, 1), (1, 1), (1, 0), (1, -1), (0, -1)]		
				for dy, dx in neighbor_positions:
					neighbor_value = slika[y + dy, x + dx]
					binCodeOfBox += '0' if centerPixel < neighbor_value else '1'
			
			histVals.append(int(binCodeOfBox, 2))
	
	return histVals

def hog(slika, vel_celice = 8, vel_blok = 2, razdelki = 9):
    slika = cv2.resize(slika, (100, 100))
    siva_slika = cv2.cvtColor(slika, cv2.COLOR_BGR2GRAY)
    korak_razdelka = 180/razdelki
    Cx = int(np.ceil(siva_slika.shape[1]/vel_celice))
    Cy = int(np.ceil(siva_slika.shape[0]/vel_celice))
    Bx = Cx - (vel_blok - 1)
    By = Cy - (vel_blok - 1)
    Ci = 0
    
    Gx = cv2.Sobel(siva_slika, cv2.CV_64F, 1, 0, ksize=3)
    Gy = cv2.Sobel(siva_slika, cv2.CV_64F, 0, 1, ksize=3)
    M = np.sqrt(np.square(Gx) + np.square(Gy))
    S = (np.degrees(np.arctan2(Gy, Gx)) + 180) % 180
    Hc = np.zeros((Cx * Cy, razdelki), dtype = np.float32)
    Hb = []
    
    for y in range(0, siva_slika.shape[0], vel_celice):
        for x in range(0, siva_slika.shape[1], vel_celice):
            celica_x = vel_celice
            celica_y = vel_celice
            
            if (siva_slika.shape[0] - y < vel_celice):
                celica_y = siva_slika.shape[0] - y
                
            if (siva_slika.shape[1] - x < vel_celice):
                celica_x = siva_slika.shape[1] - x
                
            for i in range(y, y + celica_y):
                for j in range(x, x + celica_x):
                    m = M[i, j]
                    kot = S[i, j]
                    r1 = int(kot / korak_razdelka)
                    r2 = (r1 + 1) % razdelki
                    
                    d1 = abs(kot - (r1 * korak_razdelka)) % korak_razdelka
                    d2 = abs(kot - (r2 * korak_razdelka)) % korak_razdelka
                    
                    Hc[Ci, r1] += m * (d2 / korak_razdelka)
                    Hc[Ci, r2] += m * (d1 / korak_razdelka)
            
            Ci += 1
    
    for y in range(By):
        for x in range(Bx):
            Hk = []
            
            for i in range(vel_blok):
                for j in range(vel_blok):
                    Ci = (((i + y) * By) + j + x)
                    Hk = np.concatenate((Hk, Hc[Ci]))
                    
            k = np.sqrt(np.sum(np.square(Hk)))

            if k > 0:
                Hk = Hk / k

            Hb = np.concatenate((Hb, Hk))
            
    return Hb

def detect_and_crop_faces(img):
	# Load the Haar cascade for face detection
	face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')

	#image = cv2.imread(image_path)
	gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

	# Perform face detection
	faces = face_cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5, minSize=(30, 30))

	# Crop and return the detected face(s)
	cropped_faces = []
	for (x, y, w, h) in faces:
		cropped_face = img[y:y+h, x:x+w]
		cropped_faces.append(cropped_face)

	return cropped_faces

def prepare_false_faces():
    train_features = []
    train_labels = []

    for image in os.listdir('public/python/images/false_images'):
        cropped_faces = detect_and_crop_faces(cv2.imread(f'public/python/images/false_images/{image}'))
        if len(cropped_faces) > 0:
            face = cropped_faces[0]

            # Perform LBP and HOG feature extraction on the face
            lbp_features = lbp(face)
            hog_features = hog(face)

            # Combine the features and store them
            features = np.concatenate((lbp_features, hog_features))
            train_features.append(features)

            # Set the label to 0 (frames NOT belong to the trained person)
            train_labels.append(0)
            
    # Convert the lists to numpy arrays
    train_features_array = np.array(train_features)
    train_labels_array = np.array(train_labels)

    # Save the arrays as npArray files
    np.save('public/python/false_faces_train_features.npy', train_features_array)
    np.save('public/python/false_faces_train_labels.npy', train_labels_array)

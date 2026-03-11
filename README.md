# AI-Based Online Exam Proctoring System

An AI-powered web-based proctoring system designed to detect cheating during online examinations using browser behavior monitoring and camera-based detection.

# Project Overview

This system monitors candidate behavior during online exams to detect possible cheating activities such as tab switching, exiting fullscreen, multiple faces in camera, gaze deviation, and copy-paste attempts.

It combines **browser monitoring**, **AI-based face detection**, and **audio monitoring** to maintain exam integrity.

---

## Features

- Tab Switching Detection
- Fullscreen Exit Detection
- Window Focus / Blur Tracking
- Copy-Paste Attempt Logging
- Face Detection
- Multiple Face Detection
- Gaze Detection (Looking Away)
- Audio Noise Detection
- Violation Logging System
- Automated Proctoring Score Calculation

---

## Project Architecture

```
AI-Proctoring-System
│
├── index.html → Main UI
│
├── js/
│ ├── app.js → Main controller
│ ├── config.js → System configuration
│
│ ├── browser/ → Browser behavior monitoring
│ │ ├── tabSwitchDetector.js
│ │ ├── fullscreenDetector.js
│ │ ├── focusBlurDetector.js
│ │ └── copyPasteDetector.js
│
│ ├── media/ → AI monitoring modules
│ │ ├── cameraManager.js
│ │ ├── faceDetection.js
│ │ ├── gazeDetection.js
│ │ └── audioDetection.js
│
│ ├── core/ → Violation and scoring system
│ │ ├── scoringEngine.js
│ │ └── violationLogger.js
│
│ └── utils/
│ └── timer.js

```
---

## Technologies Used

- HTML5
- CSS3
- JavaScript (ES6 Modules)
- Browser APIs
- Face Detection AI Models
- Web Camera API
- Web Audio API

---

##  How to Run the Project

1. Clone the repository


```git clone https://github.com/prajwalpg/AI-Proctoring-System.git```


2. Navigate to the project folder


```cd AI-Proctoring-System```


3. Run the project using a local server


```npx serve```


4. Open the browser and start the exam monitoring system.

---

##  Key Functional Modules

### Browser Monitoring
- Tab switch detection
- Fullscreen exit detection
- Copy-paste monitoring
- Window focus detection

### AI Monitoring
- Face detection
- Multi-face detection
- Gaze tracking
- Audio monitoring

### Violation System
- Violation logging
- Cheating score calculation
- Automatic exam termination

---

##  Future Improvements

- Real-time gaze tracking using facial landmarks
- Cloud-based proctoring analytics
- AI behavior analysis using machine learning
- Admin dashboard for monitoring candidates

---

## Author

**Prajwal PG**  
Computer Science (AI & ML)

GitHub:  
https://github.com/prajwalpg

---

##  License

This project is developed for academic and research purposes.

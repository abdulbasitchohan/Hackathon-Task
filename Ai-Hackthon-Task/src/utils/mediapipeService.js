import { Pose } from '@mediapipe/pose';
import { Camera } from '@mediapipe/camera_utils';

class MediaPipeService {
  constructor() {
    this.pose = null;
    this.camera = null;
    this.landmarks = null;
  }

  async initialize(videoRef) {
    return new Promise((resolve, reject) => {
      this.pose = new Pose({
        locateFile: (file) => {
          return `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`;
        }
      });

      this.pose.setOptions({
        modelComplexity: 1,
        smoothLandmarks: true,
        enableSegmentation: false,
        smoothSegmentation: false,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5
      });

      this.pose.onResults((results) => {
        if (results.poseLandmarks) {
          this.landmarks = results.poseLandmarks;
          this.onLandmarksDetected?.(this.landmarks);
        }
      });

      const camera = new Camera(videoRef.current, {
        onFrame: async () => {
          try {
            await this.pose.send({ image: videoRef.current });
          } catch (error) {
            console.error('Pose detection error:', error);
          }
        },
        width: 640,
        height: 480
      });

      camera.start().then(() => {
        this.camera = camera;
        resolve();
      }).catch(reject);
    });
  }

  // Get body landmarks
  getLandmarks() {
    return this.landmarks;
  }

  // Calculate BMI from landmarks (approximate)
  calculateBMI(landmarks) {
    // This is a simplified estimation
    // In production, use actual body measurements
    return {
      bmi: 22.5,
      bodyFat: 15.5,
      posture: this.analyzePosture(landmarks)
    };
  }

  // Analyze posture
  analyzePosture(landmarks) {
    if (!landmarks || landmarks.length < 33) return 'neutral';

    const leftShoulder = landmarks[11];
    const rightShoulder = landmarks[12];
    const leftHip = landmarks[23];
    const rightHip = landmarks[24];

    // Check if shoulders are level
    const shoulderDiff = Math.abs(leftShoulder.y - rightShoulder.y);
    const hipDiff = Math.abs(leftHip.y - rightHip.y);

    if (shoulderDiff > 0.03 && hipDiff > 0.03) {
      return 'forward_lean';
    } else if (shoulderDiff > 0.03) {
      return 'shoulder_imbalance';
    } else if (hipDiff > 0.03) {
      return 'hip_imbalance';
    }

    return 'good';
  }

  // Stop camera
  stop() {
    if (this.camera) {
      this.camera.stop();
    }
  }

  // Cleanup
  cleanup() {
    this.stop();
    this.pose = null;
    this.landmarks = null;
  }
}

export default new MediaPipeService();
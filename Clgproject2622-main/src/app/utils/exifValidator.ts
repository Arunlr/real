// EXIF Metadata Extractor and Validator
// Extracts GPS coordinates and timestamp from image EXIF data

export interface ExifData {
  gps: {
    latitude: number | null;
    longitude: number | null;
    altitude: number | null;
  };
  timestamp: Date | null;
  camera: {
    make: string | null;
    model: string | null;
  };
  hasGPS: boolean;
  hasTimestamp: boolean;
  isValid: boolean;
}

export interface ValidationResult {
  isValid: boolean;
  exifData: ExifData | null;
  errors: string[];
  warnings: string[];
}

export class ExifValidator {
  /**
   * Extract EXIF data from an image file
   */
  static async extractExifData(file: File): Promise<ExifData> {
    return new Promise((resolve) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        const arrayBuffer = e.target?.result as ArrayBuffer;
        const view = new DataView(arrayBuffer);

        try {
          // Check for JPEG signature
          if (view.getUint16(0, false) !== 0xFFD8) {
            resolve(this.createEmptyExifData());
            return;
          }

          // Find EXIF marker (0xFFE1)
          let offset = 2;
          while (offset < view.byteLength) {
            const marker = view.getUint16(offset, false);
            const length = view.getUint16(offset + 2, false);

            if (marker === 0xFFE1) {
              // EXIF data found
              const exifData = this.parseExifData(view, offset + 4, length - 2);
              resolve(exifData);
              return;
            }

            offset += 2 + length;
          }

          // No EXIF data found
          resolve(this.createEmptyExifData());
        } catch (error) {
          console.error('Error parsing EXIF:', error);
          resolve(this.createEmptyExifData());
        }
      };

      reader.onerror = () => {
        resolve(this.createEmptyExifData());
      };

      reader.readAsArrayBuffer(file.slice(0, 65536)); // Read first 64KB
    });
  }

  /**
   * Parse EXIF data structure
   */
  private static parseExifData(view: DataView, offset: number, length: number): ExifData {
    try {
      // Check for "Exif\0\0" header
      const exifHeader = String.fromCharCode(
        view.getUint8(offset),
        view.getUint8(offset + 1),
        view.getUint8(offset + 2),
        view.getUint8(offset + 3)
      );

      if (exifHeader !== 'Exif') {
        return this.createEmptyExifData();
      }

      // Skip to TIFF header
      offset += 6;

      // Determine byte order (II = little-endian, MM = big-endian)
      const byteOrder = view.getUint16(offset, false);
      const littleEndian = byteOrder === 0x4949;

      // We'll create mock data for demonstration since full EXIF parsing is complex
      // In production, you'd use a library like exif-js or piexifjs
      
      // For now, return empty data - in production this would parse real EXIF tags
      return this.createEmptyExifData();
    } catch (error) {
      return this.createEmptyExifData();
    }
  }

  /**
   * Create empty EXIF data structure
   */
  private static createEmptyExifData(): ExifData {
    return {
      gps: {
        latitude: null,
        longitude: null,
        altitude: null,
      },
      timestamp: null,
      camera: {
        make: null,
        model: null,
      },
      hasGPS: false,
      hasTimestamp: false,
      isValid: false,
    };
  }

  /**
   * Mock EXIF extraction for testing purposes
   * In production, this would extract real EXIF data
   */
  static async extractExifDataMock(
    file: File,
    useRealGPS: boolean = false,
    currentLocation?: GeolocationCoordinates
  ): Promise<ExifData> {
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 800));

    // Randomly decide if image has EXIF data (80% chance for simulation)
    const hasExifData = Math.random() > 0.2;

    if (!hasExifData) {
      return this.createEmptyExifData();
    }

    // Get file creation/modification time
    const fileDate = new Date(file.lastModified);

    // Generate GPS coordinates
    let latitude: number | null = null;
    let longitude: number | null = null;

    if (useRealGPS && currentLocation) {
      // Use actual device GPS (simulated as close to real)
      latitude = currentLocation.latitude;
      longitude = currentLocation.longitude;
    } else {
      // Generate mock coordinates (Bangalore area)
      latitude = 12.9716 + (Math.random() - 0.5) * 0.1;
      longitude = 77.5946 + (Math.random() - 0.5) * 0.1;
    }

    return {
      gps: {
        latitude,
        longitude,
        altitude: 900 + Math.random() * 50, // Bangalore elevation ~900m
      },
      timestamp: fileDate,
      camera: {
        make: ['Apple', 'Samsung', 'Google', 'OnePlus'][Math.floor(Math.random() * 4)],
        model: ['iPhone 14 Pro', 'Galaxy S23', 'Pixel 7', 'OnePlus 11'][Math.floor(Math.random() * 4)],
      },
      hasGPS: true,
      hasTimestamp: true,
      isValid: true,
    };
  }

  /**
   * Validate EXIF data meets requirements
   */
  static validateExifData(
    exifData: ExifData,
    expectedLocation?: { latitude: number; longitude: number },
    maxDistance: number = 100,
    maxAgeHours: number = 24
  ): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Check for GPS data
    if (!exifData.hasGPS || !exifData.gps.latitude || !exifData.gps.longitude) {
      errors.push('Photo does not contain GPS location data');
    }

    // Check for timestamp
    if (!exifData.hasTimestamp || !exifData.timestamp) {
      errors.push('Photo does not contain timestamp metadata');
    }

    // Validate GPS location if expected location provided
    if (expectedLocation && exifData.gps.latitude && exifData.gps.longitude) {
      const distance = this.calculateDistance(
        exifData.gps.latitude,
        exifData.gps.longitude,
        expectedLocation.latitude,
        expectedLocation.longitude
      );

      if (distance > maxDistance) {
        errors.push(
          `Photo location is ${Math.round(distance)}m away from target (max: ${maxDistance}m)`
        );
      } else if (distance > maxDistance * 0.7) {
        warnings.push(
          `Photo was taken ${Math.round(distance)}m from target location`
        );
      }
    }

    // Validate timestamp age
    if (exifData.timestamp) {
      const ageHours = (Date.now() - exifData.timestamp.getTime()) / (1000 * 60 * 60);
      
      if (ageHours > maxAgeHours) {
        errors.push(
          `Photo is too old (${Math.round(ageHours)} hours). Must be taken within ${maxAgeHours} hours`
        );
      } else if (ageHours > maxAgeHours * 0.7) {
        warnings.push(
          `Photo was taken ${Math.round(ageHours)} hours ago`
        );
      }
    }

    return {
      isValid: errors.length === 0,
      exifData,
      errors,
      warnings,
    };
  }

  /**
   * Calculate distance between two GPS coordinates using Haversine formula
   */
  private static calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distance in meters
  }

  /**
   * Format EXIF data for display
   */
  static formatExifData(exifData: ExifData): string {
    const parts: string[] = [];

    if (exifData.gps.latitude && exifData.gps.longitude) {
      parts.push(`📍 GPS: ${exifData.gps.latitude.toFixed(6)}, ${exifData.gps.longitude.toFixed(6)}`);
    }

    if (exifData.timestamp) {
      parts.push(`🕐 Taken: ${exifData.timestamp.toLocaleString()}`);
    }

    if (exifData.camera.make && exifData.camera.model) {
      parts.push(`📱 Device: ${exifData.camera.make} ${exifData.camera.model}`);
    }

    return parts.join(' • ') || 'No metadata available';
  }
}

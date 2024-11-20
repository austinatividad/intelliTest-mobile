import * as FileSystem from 'expo-file-system';

export async function convertImageToBase64(imageUri: string) {
    try {
      // Read the file at the given URI
      const base64String = await FileSystem.readAsStringAsync(imageUri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      return base64String;
    } catch (error) {
      console.error('Error reading file:', error);
      return null;
    }
  }

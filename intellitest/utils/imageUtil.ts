import * as FileSystem from 'expo-file-system';

import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';

import { Document } from './types';


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

  export const extractImageBase64Values = (assets: Document[]): string[] => {
    return assets
      .filter((asset) => {

        // Check if the asset is an image
        return asset.base64;
      })
      .map((asset) => asset.base64!); // Extract the base64 values (non-null assertion)
  };
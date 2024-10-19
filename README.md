# [intelliTest](https://github.com/austinatividad/intelliTest-mobile)
A mobile application for comprehensive AI Mock tests
# Running intelliTest

1. Navigate to the folder
   ```bash
   cd intellitest
   ```
2. Install required dependencies
    ```
    npm i
    ```
3. Run Expo Go (Quick Method)
     ```
     npx expo start
     ```
4. Once Expo is runninng, press "s" to switch to Expo Go
5. Scan the QR on a mobile device, or press "a" to run in an android emulator

# Building Android Package 
###### (from https://docs.expo.dev/build/setup/)
   ```
   npm install -g eas-cli
   eas login
   eas build:configure
   eas build --platform android
   ```
  

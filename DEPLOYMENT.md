# Deployment Guide - Tone Analyzer Mobile App

This guide will help you build and deploy the Tone Analyzer mobile app to iOS and Android devices.

## Prerequisites

### For Both Platforms
- Node.js 18+ installed
- Git installed
- Code editor (VS Code recommended)

### For iOS Development
- macOS computer (required for iOS development)
- Xcode 14+ installed from Mac App Store
- CocoaPods installed: `sudo gem install cocoapods`
- Apple Developer Account ($99/year for App Store distribution)

### For Android Development
- Android Studio installed
- JDK 17+ installed
- Android SDK and build tools
- Physical Android device or emulator

## Initial Setup

### 1. Clone the Repository

```bash
git clone https://github.com/Sconiboy/tone-analyzer-mobile.git
cd tone-analyzer-mobile
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Backend URL

Edit `src/config.ts` and update the API_URL to your deployed backend:

```typescript
export const API_URL = 'https://your-backend-url.com';
```

You can get your backend URL from:
- The web app deployment (e.g., `https://your-app.manus.space`)
- Or your custom domain

## iOS Setup and Deployment

### 1. Install iOS Dependencies

```bash
cd ios
pod install
cd ..
```

### 2. Configure Share Extension (iOS)

Open `ios/ToneKeyboard.xcworkspace` in Xcode, then:

1. Select the project in the navigator
2. Click "+ Capability" and add "App Groups"
3. Create an app group: `group.com.yourcompany.toneanalyzer`

### 3. Add Share Extension Target

In Xcode:
1. File → New → Target
2. Select "Share Extension"
3. Name it "ToneShare"
4. Configure the extension to accept text data

### 4. Update Info.plist

Add these keys to `ios/ToneKeyboard/Info.plist`:

```xml
<key>NSAppTransportSecurity</key>
<dict>
    <key>NSAllowsArbitraryLoads</key>
    <true/>
</dict>
```

### 5. Build and Run on Simulator

```bash
npm run ios
```

### 6. Build for Physical Device

1. Connect your iPhone via USB
2. In Xcode, select your device from the device dropdown
3. Click the "Play" button to build and install

### 7. App Store Distribution

1. In Xcode: Product → Archive
2. Once archived, click "Distribute App"
3. Choose "App Store Connect"
4. Follow the wizard to upload to App Store Connect
5. Submit for review in App Store Connect dashboard

## Android Setup and Deployment

### 1. Configure Share Intent (Android)

The share functionality is configured in `android/app/src/main/AndroidManifest.xml`.

Add this intent filter to your main activity:

```xml
<intent-filter>
    <action android:name="android.intent.action.SEND" />
    <category android:name="android.intent.category.DEFAULT" />
    <data android:mimeType="text/plain" />
</intent-filter>
```

### 2. Update Network Security Config

Create `android/app/src/main/res/xml/network_security_config.xml`:

```xml
<?xml version="1.0" encoding="utf-8"?>
<network-security-config>
    <base-config cleartextTrafficPermitted="true">
        <trust-anchors>
            <certificates src="system" />
        </trust-anchors>
    </base-config>
</network-security-config>
```

Reference it in `AndroidManifest.xml`:

```xml
<application
    android:networkSecurityConfig="@xml/network_security_config"
    ...>
```

### 3. Build and Run on Emulator

```bash
npm run android
```

### 4. Build APK for Testing

```bash
cd android
./gradlew assembleRelease
cd ..
```

The APK will be at: `android/app/build/outputs/apk/release/app-release.apk`

### 5. Install APK on Physical Device

```bash
adb install android/app/build/outputs/apk/release/app-release.apk
```

### 6. Generate Signed APK for Distribution

1. Generate a keystore:
```bash
keytool -genkey -v -keystore tone-analyzer.keystore -alias tone-analyzer -keyalg RSA -keysize 2048 -validity 10000
```

2. Create `android/gradle.properties`:
```properties
MYAPP_RELEASE_STORE_FILE=tone-analyzer.keystore
MYAPP_RELEASE_KEY_ALIAS=tone-analyzer
MYAPP_RELEASE_STORE_PASSWORD=your_password
MYAPP_RELEASE_KEY_PASSWORD=your_password
```

3. Update `android/app/build.gradle`:
```gradle
android {
    ...
    signingConfigs {
        release {
            storeFile file(MYAPP_RELEASE_STORE_FILE)
            storePassword MYAPP_RELEASE_STORE_PASSWORD
            keyAlias MYAPP_RELEASE_KEY_ALIAS
            keyPassword MYAPP_RELEASE_KEY_PASSWORD
        }
    }
    buildTypes {
        release {
            signingConfig signingConfigs.release
            ...
        }
    }
}
```

4. Build signed APK:
```bash
cd android
./gradlew assembleRelease
```

### 7. Google Play Store Distribution

1. Create a Google Play Developer account ($25 one-time fee)
2. Create a new app in Play Console
3. Upload the signed APK or AAB (Android App Bundle)
4. Fill in store listing details
5. Submit for review

## Testing the Share Functionality

### iOS
1. Open Messages, Mail, or any app with text
2. Select text and tap "Share"
3. Choose "Tone Analyzer" from the share sheet
4. The app opens with the text pre-filled

### Android
1. Open any app with text
2. Select text and tap "Share"
3. Choose "Tone Analyzer" from the list
4. The app opens with the text pre-filled

## Troubleshooting

### iOS Build Errors

**Pod install fails:**
```bash
cd ios
pod deintegrate
pod install
cd ..
```

**Code signing issues:**
- Ensure you're logged into Xcode with your Apple ID
- Select your team in project settings

### Android Build Errors

**Gradle sync fails:**
```bash
cd android
./gradlew clean
cd ..
```

**SDK not found:**
- Open Android Studio
- Go to Tools → SDK Manager
- Install required SDK versions

### Network Errors

**Cannot connect to backend:**
- Verify the API_URL in `src/config.ts`
- Check that your backend is deployed and accessible
- For iOS: Ensure App Transport Security allows your domain
- For Android: Check network security config

## Next Steps

1. Test thoroughly on both platforms
2. Gather beta tester feedback using TestFlight (iOS) or Google Play Internal Testing (Android)
3. Implement analytics to track usage
4. Add crash reporting (e.g., Sentry, Firebase Crashlytics)
5. Set up CI/CD for automated builds

## Support

For issues or questions:
- Check the main README.md
- Open an issue on GitHub
- Review React Native documentation: https://reactnative.dev/docs/getting-started

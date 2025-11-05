# Tone Analyzer Mobile App

A React Native mobile application for on-demand message tone analysis with AI-powered response suggestions.

## Features

- **Share Sheet Integration**: Analyze received messages by sharing them to the app
- **Quick Access Widget**: Activate before sending to check your message tone
- **Color-Coded Analysis**: Green (positive), Yellow (neutral/ambiguous), Red (negative/confrontational)
- **AI Response Suggestions**: Get professional, friendly, casual, and diplomatic response options
- **Clipboard Integration**: Easy copy-paste workflow
- **Works Everywhere**: SMS, WhatsApp, Email, and all messaging apps

## Architecture

This mobile app connects to the Tone Analyzer web backend API for processing:
- **Backend**: https://github.com/Sconiboy/tone-analyzer-web
- **API Endpoint**: Your deployed web app URL + `/api/trpc`

## Prerequisites

- Node.js 18+ and npm
- React Native development environment
- For iOS: Xcode 14+, CocoaPods
- For Android: Android Studio, JDK 17+

## Installation

```bash
# Clone the repository
git clone https://github.com/Sconiboy/tone-analyzer-mobile.git
cd tone-analyzer-mobile

# Install dependencies
npm install

# iOS only: Install pods
cd ios && pod install && cd ..
```

## Configuration

1. Update the API endpoint in `src/config.ts`:
```typescript
export const API_URL = 'https://your-deployed-backend-url.com';
```

2. Configure app permissions in:
   - **iOS**: `ios/ToneKeyboard/Info.plist`
   - **Android**: `android/app/src/main/AndroidManifest.xml`

## Running the App

### iOS
```bash
npm run ios
```

### Android
```bash
npm run android
```

## Building for Production

### iOS
1. Open `ios/ToneKeyboard.xcworkspace` in Xcode
2. Select your development team
3. Archive and upload to App Store Connect

### Android
```bash
cd android
./gradlew assembleRelease
```

The APK will be in `android/app/build/outputs/apk/release/`

## Usage

### Analyzing Received Messages
1. Long-press on a message in any app
2. Tap "Share" → "Tone Analyzer"
3. View the analysis and suggested responses
4. Tap a response to copy it
5. Paste back into your messaging app

### Checking Before Sending
1. Open the Tone Analyzer app
2. Paste your draft message
3. Select message type and relationship
4. View analysis and adjust your message
5. Copy the suggested response if needed

## Project Structure

```
ToneKeyboard/
├── src/
│   ├── components/     # Reusable UI components
│   ├── screens/        # App screens
│   ├── services/       # API integration
│   ├── config.ts       # App configuration
│   └── App.tsx         # Main app component
├── ios/                # iOS native code
├── android/            # Android native code
└── package.json
```

## Development Notes

This is a [**React Native**](https://reactnative.dev) project, bootstrapped using [`@react-native-community/cli`](https://github.com/react-native-community/cli).

For detailed React Native development instructions, see the [React Native documentation](https://reactnative.dev/docs/environment-setup).

## Related Projects

- **Web App**: [tone-analyzer-web](https://github.com/Sconiboy/tone-analyzer-web)

## License

MIT

## Support

For issues or questions, please open an issue on GitHub.

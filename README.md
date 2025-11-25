# MatheApp

## How to build

Steps for building of .apk file for tests (instruction for the first time, the next time you need only to run npm run build-cordova-android command)

1. Install `cordova` package globally using this command: `npm install -g cordova`
2. Install JDK ans set environment variables: [Windows](https://www.makeuseof.com/windows-android-studio-setup/) [Linux](https://www.makeuseof.com/windows-android-studio-setup/) [MacOS](https://www.makeuseof.com/windows-android-studio-setup/)
3. Install Android Studio : https://developer.android.com/studio
4. Set `ANDROID_HOME` and `Path` Variables: [Windows](https://www.makeuseof.com/windows-android-studio-setup/) [Linux](https://www.makeuseof.com/windows-android-studio-setup/) [MacOS](https://www.makeuseof.com/windows-android-studio-setup/)
5. Install Gradle: https://gradle.org/install/
6. Open the project (e.g. `f7-math`) and go to `cordova` folder
7. Create folder `www` in `cordova` folder
8. Run `cordova platform add android` inside `cordova` folder
9. Go back to main folder
10. Run `npm run build-cordova-android`

Now you should find app-debug.apk in cordova/platforms/android/app/build/outputs/apk/debug/ folder.

## How to sign the application

https://support.google.com/googleplay/android-developer/answer/9842756?hl=en-GB&visit_id=638390175088165962-4165502714&rd=1

## How to build for Play Market

1. Update build version in `cordova/config.xml` file
2. go to `cordova` folder and run `cordova build --release android`
3. Open `cordova/platforms/android` file in Android Studio 
4. Go to Build -> Generate App Bundle(s) or APKs -> Generate Bundles
5. In Main menu select Build -> Generate Signed Bundle / APK 
   - 5.1. Select Android App Bundle
   - 5.2. Select keystore file and password (most probably it's already saved in Android Studio)
   - 5.3. Click Next
   - 5.4. Choose "release" and Create
6. Get the .aab file from `\cordova\platforms\android\app\release` folder


## Install Dependencies

First of all we need to install dependencies, run in terminal
```
npm install
```

## NPM Scripts

* 🔥 `start` - run development server
* 🔧 `dev` - run development server
* 🔧 `build` - build web app for production
* 📱 `build-cordova` - build cordova app
* 📱 `build-cordova-ios` - build cordova iOS app
* 📱 `cordova-ios` - run dev build cordova iOS app
* 📱 `build-cordova-android` - build cordova Android app
* 📱 `cordova-android` - run dev build cordova Android app

## Vite

There is a [Vite](https://vitejs.dev) bundler setup. It compiles and bundles all "front-end" resources. You should work only with files located in `/src` folder. Vite config located in `vite.config.js`.
## Cordova

Cordova project located in `cordova` folder. You shouldn't modify content of `cordova/www` folder. Its content will be correctly generated when you call `npm run cordova-build-prod`.





## Assets

Assets (icons, splash screens) source images located in `assets-src` folder. To generate your own icons and splash screen images, you will need to replace all assets in this directory with your own images (pay attention to image size and format), and run the following command in the project directory:

```
framework7 assets
```

Or launch UI where you will be able to change icons and splash screens:

```
framework7 assets --ui
```



## Documentation & Resources

* [Framework7 Core Documentation](https://framework7.io/docs/)
* [Framework7 Vue Documentation](https://framework7.io/vue/)


* [Framework7 Icons Reference](https://framework7.io/icons/)
* [Community Forum](https://forum.framework7.io)

## Support Framework7

Love Framework7? Support project by donating or pledging on:
- Patreon: https://patreon.com/framework7
- OpenCollective: https://opencollective.com/framework7

## Version Dependencies

If your machine has problem running the application, please double check the versions of `node` and `npm` to fix those or other possible solution that may or may not work would be to delete `package-lock.json` file and removing `node_modules` and then doing `npm install` or the third option would be to go with the docker setup which is mentioned in the readme.

**OTHERWISE** the versions that you should use are the ones mentioned below.

> node v16 (16.15.0)

> npm v8 (8.5.5)

or if you don't prefer doing the above you could also make use of NVM (Node Version Manager - POSIX-compliant bash script to manage multiple active node.js versions) as per your convenience.

[NVM for windows](https://content.breatheco.de/en/how-to/nvm-install-windows#:~:text=Steps%20to%20install%20with%20nvm%3A&text=Install%20nvm%20Go%20to%20your,that%20you%20will%20hit%20too.)

[NVM for mac](https://tecadmin.net/install-nvm-macos-with-homebrew/)


## Development Tips
During creating questions/answers you can use these markings.
- `@` - will put text in span/div tag without any changes.
- `@@` - will put text in span/div tag as an HTML with `monospace` font. It can be used for multirow expressions.
- `@@@` - will put text in span/div tag as an HTML.
- `@emoji@` - can be used with emoji questions. This can be used only for questions with emojis. Most probably this template can be removed.
- `@pre@` - put text in `pre` tag. It is in used for column exercises (սյունյակով հանում/գումարում/․․․). Most probably it will replace `@@` syntax in the future.
- If no markings are used then text will be handled by MathJax

## How to distribute new iOS build  

### Prerequisites

You should have macOS device, also you should have Xcode and Transporter installed, if you don't have – please install.

* [Xcode](https://developer.apple.com/xcode/)
* [Transporter](https://apps.apple.com/us/app/transporter/id1450874784?mt=12)

### Steps

1. Pull the Latest Code

`git pull`

2. Clean and Prepare Cordova iOS Platform

```
cd cordova
cordova clean ios && cordova prepare ios
```

3. Build the App

`npm run build-cordova-ios`

4. Open the Project in Xcode

`open platforms/ios/MatheApp.xcworkspace`

5. Create and Export the .ipa File in Xcode

   - 5.1 Archive the App
   In Xcode, select Any iOS Device (arm64).
   Go to Product > Archive to create an archive.
   The Organizer window will open automatically.

   - 5.2 Distribute the App
   Select your archive in the Organizer and click Distribute App.

   - 5.3 Distribution Steps
     - Step 1: Choose Custom as the method for distribution.
     - Step 2: Choose App Store Connect as the distribution method.
     - Step 3: Choose Export to save the .ipa file locally.
     - Step 4: In the App Store Connect distribution options, leave the default options and click Next.
     - Step 5: In the Re-sign section, choose Automatically manage signing and click Next.
     - Step 6: Review all details and click Export to generate the .ipa file.

   - 5.4 Upload the .ipa File to App Store Connect
   
   - 5.5 Use the Transporter app to upload the .ipa file to App Store Connect.

6. Submit the App for Review on App Store Connect
   - 6.1 Log in to App Store Connect
   Go to App Store Connect and log in with your Apple Developer account.
   
   - 6.2 Select Your App
   Click My Apps, and select the app you want to submit for review.
   
   - 6.3 Prepare the App for Submission
   Review and update the following sections:
   App Information: Verify metadata such as name, subtitle, and version.
   Pricing and Availability: Set your app’s pricing and availability.
   Version Information: Ensure the version number and release notes are correct.
   
   - 6.4 Select the Build
   In the App Store tab, go to the Build section and click Select a Build before you submit your app.
   Choose the correct build uploaded via Transporter.
   
   - 6.5 Missing Compliance Prompt
   In the TestFlight tab, a Missing Compliance warning may appear.
   Select None of these algorithms if your app does not use encryption algorithms requiring compliance documentation.
   Click Done to resolve the warning.
   
   - 6.6 Complete App Information
   Description: Ensure the app description is correct.
   Keywords: Add relevant keywords for discoverability.
   Support URL and Privacy Policy URL: Ensure these are accurate.
   
   - 6.7 App Review Information
   Provide contact details for the reviewer.
   Add any necessary notes for the review team, such as login details for testing.
   
   - 6.8 Submit for Review
   Click Submit for Review.
   Answer any compliance-related questions (e.g., encryption or sensitive content).
   
   - 6.9 Choose Release Options
   Select when to release your app after approval:
   Automatic Release: The app will be released immediately after approval.
   Manual Release: You can release it manually after approval.
   Scheduled Release: Set a future release date.
   
   - 6.10 Monitor App Status
   The app will enter Waiting for Review status.
   Track the submission progress under the Activity tab.

# F7-Test

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
OR, IF YOU NEED TO BUILD PRODUCTION VERSION (.aab):
11. go to `cordova` folder and run `cordova build --release android`

Now you should find app-debug.apk in cordova/platforms/android/app/build/outputs/apk/debug/ folder.

## How to sign the application

https://support.google.com/googleplay/android-developer/answer/9842756?hl=en-GB&visit_id=638390175088165962-4165502714&rd=1

## How to build for Play Market

1. Update build version in `cordova/config.xml` file
2. Open `cordova/platforms/android/app` file in Android Studio 
3. Go to Build -> Build Bundle(s) / APK(s) -> Build Bundle(s)
4. In Main menu select Build -> Generate Signed Bundle / APK 
   - 4.1. Select Android App Bundle
   - 4.2. Select keystore file and password (most probably it's already saved in Android Studio)
   - 4.3. Click Next
   - 4.4. Choose "release" and Create
5. Get the .aab file from `\cordova\platforms\android\app\release` folder

## Framework7 CLI Options

Framework7 app created with following options:

```
{
  "cwd": "/home/sasha-jarvi/projects/my-projects/f7-test",
  "type": [
    "cordova"
  ],
  "name": "Math App",
  "pkg": "io.framework7.math-app",
  "framework": "vue",
  "template": "single-view",
  "cssPreProcessor": "scss",
  "bundler": "vite",
  "cordova": {
    "folder": "cordova",
    "platforms": [
      "ios",
      "android"
    ],
    "plugins": [
      "cordova-plugin-statusbar",
      "cordova-plugin-keyboard",
      "cordova-plugin-splashscreen"
    ]
  },
  "theming": {
    "customColor": false,
    "color": "#007aff",
    "darkTheme": false,
    "iconFonts": true,
    "fillBars": false
  },
  "customBuild": false
}
```

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
@ - will put text in span/div tag without any changes.
@@ - will put text in span/div tag as an HTML with `monospace` font. It can be used for multirow expressions.
@@@ - will put text in span/div tag as an HTML.
@emoji@ - can be used with emoji questions. This can be used only for questions with emojis. Most probably this template can be removed.
@pre@ - put text in `pre` tag. It is in used for column exercises (սյունյակով հանում/գումարում/․․․). Most probably it will replace `@@` syntax in the future.
If no markings are used then text will be handled by MathJax

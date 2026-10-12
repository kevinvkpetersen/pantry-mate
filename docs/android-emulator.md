# Android Emulator Setup (Ubuntu)

How to get an Android emulator running so you can launch the Expo app. This is a one-time setup.

## 1. Check hardware acceleration

Without KVM the emulator is very slow. Check that it's available:

```bash
sudo apt install cpu-checker
kvm-ok
```

You want "KVM acceleration can be used". If it says it can't, enable virtualization (Intel VT-x or AMD-V) in your BIOS. Then make sure your user can use the device:

```bash
sudo usermod -aG kvm $USER
```

Log out and back in for the group change to apply.

## 2. Install Android Studio

```bash
sudo snap install android-studio --classic
```

Launch it and run the setup wizard with the **Standard** install. It downloads the SDK, platform tools, and emulator into `~/Android/Sdk`, which takes a while and uses roughly 10 GB. Android Studio bundles its own JDK, so you don't need to install Java. You can skip creating a project.

## 3. Create a virtual device

In Android Studio, go to **More Actions → Virtual Device Manager → Create Device**:

1. Pick a phone profile, such as a Pixel.
2. Pick a recent **x86_64** system image with **Google APIs**. Avoid ARM images, which are much slower on x86 hardware.
3. Finish, then press the play button to confirm it boots. The first boot can take a few minutes.

## 4. Set environment variables

Expo needs to find the SDK. Add this to `~/.bashrc` (or `~/.zshrc`):

```bash
export ANDROID_HOME=$HOME/Android/Sdk
export PATH=$PATH:$ANDROID_HOME/emulator:$ANDROID_HOME/platform-tools
```

Open a new terminal and verify:

```bash
adb --version
emulator -list-avds
```

The second command should list the device you created. If the SDK is somewhere other than `~/Android/Sdk`, adjust the path (Android Studio's SDK Manager shows the location).

## 5. Run the app

Start the emulator first, then from the repo root:

```bash
npm run -w apps/mobile start -- --clear
```

Press `a` in the Expo terminal. Expo installs Expo Go on the emulator and opens the app.

## Reaching the API from the emulator

Inside the emulator, `localhost` means the emulator itself. The emulator exposes your computer at `10.0.2.2`, so `apps/mobile/.env.development` uses `http://10.0.2.2:3000` (with the port matching `API_PORT`).

## Common problems

- **`ENOSPC: System limit for number of file watchers reached`** from Metro. Raise the limit:

    ```bash
    echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf
    sudo sysctl -p
    ```

- **Emulator window is black or won't render.** In the virtual device's advanced settings, change graphics from Automatic to Software or Hardware. This is common on Wayland sessions and some GPU drivers.
- **`adb` or `emulator` not found.** The `PATH` lines in step 4 didn't take effect. Open a new terminal or run `source ~/.bashrc`.

import type { ForgeConfig } from '@electron-forge/shared-types';
import { MakerSquirrel } from '@electron-forge/maker-squirrel';
import { MakerZIP } from '@electron-forge/maker-zip';
import { MakerDeb } from '@electron-forge/maker-deb';
import { MakerRpm } from '@electron-forge/maker-rpm';
import { VitePlugin } from '@electron-forge/plugin-vite';
import { FusesPlugin } from '@electron-forge/plugin-fuses';
import { FuseV1Options, FuseVersion } from '@electron/fuses';

const config: ForgeConfig = {
  packagerConfig: {
      asar: true,
      // Sets the application icon for Windows (.ico) and macOS (.icns)
      icon: 'src/assets/chiikawa', // Note: no file extension
    },
    rebuildConfig: {},
    makers: [
      // Windows Squirrel installer
      new MakerSquirrel({
        // Sets the icon for the setup.exe installer
        setupIcon: 'src/assets/chiikawa.ico'
      }), 
      new MakerZIP({}, ['darwin']), 
      // Red Hat/Fedora Linux package
      new MakerRpm({
        options: {
          // Sets the icon for the Linux package manager
          icon: 'src/assets/chiikawa.png'
        }
      }), 
      // Debian/Ubuntu Linux package
      new MakerDeb({
        options: {
          // Sets the icon for the Linux package manager
          icon: 'src/assets/chiikawa.png'
        }
      })
    ], 
  plugins: [
    new VitePlugin({
      // `build` can specify multiple entry builds, which can be Main process, Preload scripts, Worker process, etc.
      // If you are familiar with Vite configuration, it will look really familiar.
      build: [
        {
          // `entry` is just an alias for `build.lib.entry` in the corresponding file of `config`.
          entry: 'src/main.ts',
          config: 'vite.main.config.ts',
          target: 'main',
        },
        {
          entry: 'src/preload.ts',
          config: 'vite.preload.config.ts',
          target: 'preload',
        },
      ],
      renderer: [
        {
          name: 'main_window',
          config: 'vite.renderer.config.ts',
        },
      ],
    }),
    // Fuses are used to enable/disable various Electron functionality
    // at package time, before code signing the application
    new FusesPlugin({
      version: FuseVersion.V1,
      [FuseV1Options.RunAsNode]: false,
      [FuseV1Options.EnableCookieEncryption]: true,
      [FuseV1Options.EnableNodeOptionsEnvironmentVariable]: false,
      [FuseV1Options.EnableNodeCliInspectArguments]: false,
      [FuseV1Options.EnableEmbeddedAsarIntegrityValidation]: true,
      [FuseV1Options.OnlyLoadAppFromAsar]: true,
    }),
  ],
};

export default config;

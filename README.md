# LCLPLauncherApps
Collection of first-party LCLPLauncher app installers

## Compiling app installers
Initially, setup Node and npm:
```bash
nvm use  # (optional) use the correct version of node
npm install
```
**Optional**: Setup [NVM](https://github.com/nvm-sh/nvm) to use the exact node version, this project uses.

After the initial setup, you can compile an app with:
```
./compile <appId>
```

If you are on Windows, or don't want to use the bash script, you can also use the npm script directly:
```
npm run compile <appId>
```

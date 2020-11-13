const path = require('path')
const iconPath = path.resolve(path.join(__dirname, "src", "rendererProcess", "globalAssets", "logo.png"));

module.exports = exports = {
    electronPackagerConfig: {
        icon: iconPath
    },
    packagerConfig: {
      icon: iconPath
    },
    makers: [
      {
        name: "@electron-forge/maker-squirrel",
        config: {
          name: "media_bits"
        }
      },
      {
        name: "@electron-forge/maker-zip",
        platforms: [
          "darwin"
        ]
      },
      {
        name: "@electron-forge/maker-deb",
        config: {}
      },
      {
        name: "@electron-forge/maker-rpm",
        config: {}
      }
    ]
  };
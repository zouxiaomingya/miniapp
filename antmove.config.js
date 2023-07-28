module.exports = {
    "env": "production",
    "platform": "alipay",
    "component2": true,
    "scope": true,
    "type": "alipay-compiler",
    "error": false,
    "empty": false,
    "fromId": 0,
    "isReport": true,
    "useRuntimeLog": false,
    "watch": false,
    "ignoreNpm": true,
    "libraryName": "",
    "useCompileLog": false,
    "autoOpenReport": false,
    "input": "./",
    "output": "..\\out",
    "npm": {
        "@vant/weapp": {
            "name": "vant-aliapp",
            "version": "1.1.2"
        }
    }
,
    "hooks": {
        "appJson": function plugin(appJson) {
          return appJson
        }

    },
    "babel": {
        "presets": [],
        "plugins": function() {
          return []
        }
    },
        "plugins": []
}
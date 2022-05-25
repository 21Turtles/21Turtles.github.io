let dependencyUrls = []
const maxLoadTimesTrys = 4;

//Main Libraries
dependencyUrls.push("https://www.googletagmanager.com/gtag/js?id=UA-118283086-6", "https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js");
//Ads Libraries
dependencyUrls.push("./ads-prebid.js", "./IronSourceRV.js", "./cpmstar.js", "./adsController.js");
//Firebase/Google Libraries
dependencyUrls.push("./googleAnalytics.js", "./firebase.js", "./login.js", "./firebase-config.js", "./firestore.js")
//Game Libraries
dependencyUrls.push("./unityUrls.js", "./unityGame.js", "./mobileRedirect.js", "./fullscreen.js")
//etc. Libraries
dependencyUrls.push("./windowResize.js", "./adblockManager.js", "./macUserAgent.js", "./visibilityChangeListener.js", "./xsolla.js")

dynamicallyLoadScripts();

async function dynamicallyLoadScripts() {
    for (let i = 0; i < dependencyUrls.length; i++) {
        let url = dependencyUrls[i];
        let script = document.createElement("script");
        script.src = url;

        document.head.appendChild(script);
    }

    let trys = 0;
    while (window.loadedUrls === undefined || window.firebaseLoaded === undefined || window.adsLoaded === undefined
    || window.gameScriptLoaded === undefined || window.configInit === undefined || window.adsControllerLoaded === undefined) {
        await sleep(500)
        trys++;
        if(trys >= maxLoadTimesTrys) {
            break;
        }
    }
    
    initAds();
    loadGame();
    initFirebaseLibraries();
    fixMacUserAgent();
}

function loadGame() {
    let gameLoader = document.createElement("script")
    gameLoader.src = getGameLoaderUrl();
    gameLoader.id = "unity-loader"
    gameLoader.onload = function () {
        showGame();
    };

    let gameLoadDiv = document.getElementById("unity-loader-div");
    gameLoadDiv.innerHTML = "";
    gameLoadDiv.appendChild(gameLoader);
}

function initFirebaseLibraries() {
    initializeFireBase();
    initRemoteConfig();
}

function onUnityReady() {
    checkAdBlock();
    sendConfig();
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

package com.supermap.RN;

import android.app.ActivityManager;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

public class AppUtils extends ReactContextBaseJavaModule {


    public AppUtils(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "AppUtils";
    }
    @ReactMethod
    public void AppExit(){
        appManager.getAppManager().AppExit(getReactApplicationContext());

    }
}

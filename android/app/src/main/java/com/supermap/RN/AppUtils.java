package com.supermap.RN;

import android.app.ActivityManager;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;

import java.util.Map;

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

    @ReactMethod
    public void  sendFileOfWechat(ReadableMap map, Promise promise){
        try {
            Map params = map.toHashMap();
            appManager.getAppManager().sendFileOfWechat(params);
            promise.resolve(true);
        }catch (Exception e){
            promise.reject(e);
        }
    }
}

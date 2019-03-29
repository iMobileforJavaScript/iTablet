package com.supermap.RN;

import android.app.ActivityManager;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.supermap.containts.EventConst;

import java.util.Map;

public class AppUtils extends ReactContextBaseJavaModule {
    private static ReactContext mReactContext;

    public AppUtils(ReactApplicationContext reactContext) {
        super(reactContext);
        mReactContext=reactContext;
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
            Boolean result=appManager.getAppManager().sendFileOfWechat(params);
            promise.resolve(result);
        }catch (Exception e){
            promise.reject(e);
        }
    }

    public static void sendShareResult(String result) {
        mReactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit(EventConst.MESSAGE_SHARERESULT, result);
    }

}

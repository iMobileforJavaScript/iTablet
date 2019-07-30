package com.supermap.RN;

import android.app.ActivityManager;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.supermap.containts.EventConst;
import com.supermap.plugin.LocationManagePlugin;
import com.supermap.smNative.collector.SMCollector;

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

    @ReactMethod
    public void  getCurrentLocation(Promise promise){
        try {
            LocationManagePlugin.GPSData data = SMCollector.getGPSPoint();
            WritableMap map = Arguments.createMap();
            map.putDouble ("longitude", data.dLongitude);
            map.putDouble("latitude", data.dLatitude);
            promise.resolve(map);
        }catch (Exception e){
            promise.reject(e);
        }
    }

    @ReactMethod
    public void pause (int time, Promise promise){
        try {
            final int timeInMS = time * 1000;
            new Thread(new Runnable() {
                @Override
                public void run() {
                    try {
                        Thread.sleep(timeInMS);
                    } catch (InterruptedException e) {
                        e.printStackTrace();
                    }
                    promise.resolve(true);
                }
            }).start();
        }catch (Exception e){
            promise.reject(e);
        }
    }

    public static void sendShareResult(String result) {
        mReactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit(EventConst.MESSAGE_SHARERESULT, result);
    }

}

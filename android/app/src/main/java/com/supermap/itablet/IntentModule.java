package com.supermap.itablet;
import android.app.Activity;
import android.content.Intent;
import com.facebook.react.bridge.JSApplicationIllegalArgumentException;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.supermap.RN.appManager;

import java.util.Stack;

public class IntentModule extends ReactContextBaseJavaModule {
    public IntentModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "IntentModule";
    }
    @ReactMethod
    public void open(String name){
          switch (name){
              case "Visual":
                  name="com.supermap.imb.appconfig.StartupActivity";
                  break;
              case "Layer":
                  name="com.tronzzb.sampleapp.activity.MapLayer";
                  break;
          }
        try{
            Activity currentActivity = getCurrentActivity();
            if(null!=currentActivity){

                Class toActivity = Class.forName(name);
                Intent intent = new Intent(currentActivity,toActivity);
                currentActivity.startActivity(intent);
            }
        }catch(Exception e){
            throw new JSApplicationIllegalArgumentException(
                    "不能打开Activity : "+e.getMessage());
        }
    }

}


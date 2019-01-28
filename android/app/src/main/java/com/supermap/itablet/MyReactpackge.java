package com.supermap.itablet;

import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.JavaScriptModule;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.ViewManager;
import com.supermap.RN.AppUtils;
import com.supermap.RN.NativeMethod;
import com.supermap.RN.FileTools;
import com.supermap.RN.SPUtils;


import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
public class MyReactpackge implements  ReactPackage {
    public List<Class<? extends JavaScriptModule>> createJSModules() {
        return Collections.emptyList();
    }

    @Override
    public List<NativeModule> createNativeModules(ReactApplicationContext reactContext) {
        List<NativeModule> modules = new ArrayList<>();
        modules.add(new IntentModule(reactContext));
        modules.add(new FileTools(reactContext));
        modules.add(new NativeMethod(reactContext));
        modules.add(new SPUtils(reactContext));
        modules.add(new AppUtils(reactContext));
        return modules;
    }

    @Override
    public List<ViewManager> createViewManagers(ReactApplicationContext reactContext) {
        return Collections.emptyList();
    }
}

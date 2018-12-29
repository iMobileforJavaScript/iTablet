package com.supermap.RN;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;

import java.io.File;

/**
 * @Author: shanglongyang
 * Date:        2018/12/12
 * project:     iTablet
 * package:     iTablet
 * class:
 * description:
 */
public class NativeMethod extends ReactContextBaseJavaModule {

    public NativeMethod(ReactApplicationContext reactContext) {
        super(reactContext);
    }
    public static final String SDCARD = android.os.Environment.getExternalStorageDirectory().getAbsolutePath() + "/";

    @Override
    public String getName() {
        return "NativeMethod";
    }

    @ReactMethod
    public void getTemplates(String userName, Promise promise) {
        try {
            if (userName == null || userName.equals("")) {
                userName = "Customer";
            }

            WritableArray templateList = Arguments.createArray();
            String templatePath = SDCARD + "iTablet/User/" + userName + "/Downloads";
            File file = new File(templatePath);

            if (file.exists() && file.isDirectory()) {
                File[] tempsArray = file.listFiles();
                for (int i = 0; i < tempsArray.length; i++) {
                    if (tempsArray[i].isDirectory()) {
                        File[] tempArray = tempsArray[i].listFiles();
                        for (int j = 0; j < tempArray.length; j++) {
                            String tempFileName = tempArray[j].getName();
                            String suffix = tempFileName.substring(tempFileName.lastIndexOf(".") + 1).toLowerCase();
                            if (suffix.equals("smw") || suffix.equals("sxwu") || suffix.equals("sxw") || suffix.equals("smwu")) {
                                String tempName = tempFileName.substring(0, tempFileName.lastIndexOf("."));
                                WritableMap tempInfo = Arguments.createMap();
                                tempInfo.putString("name", tempName);
                                tempInfo.putString("path", tempArray[j].getAbsolutePath());

                                templateList.pushMap(tempInfo);
                            }
                        }
                    } else {
                        String tempFileName = tempsArray[i].getName();
                        String suffix = tempFileName.substring(tempFileName.lastIndexOf(".") + 1).toLowerCase();
                        if (suffix.equals("smw") || suffix.equals("sxwu") || suffix.equals("sxw") || suffix.equals("smwu")) {
                            WritableMap tempInfo = Arguments.createMap();
                            String fileName = tempFileName.substring(0, tempFileName.lastIndexOf("."));

                            tempInfo.putString("name", fileName);
                            tempInfo.putString("path", tempsArray[i].getAbsolutePath());

                            templateList.pushMap(tempInfo);
                        }
                    }
                }

            }
            promise.resolve(templateList);

        } catch (Exception e) {
            promise.reject(e);
        }
    }
}

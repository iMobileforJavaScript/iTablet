package com.supermap.RN;

import android.graphics.Color;
import android.view.View;
import android.view.ViewGroup;
import android.widget.RelativeLayout;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
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
    public void getTemplates(String userName, String strModule, Promise promise) {
        try {
            if (userName == null || userName.equals("")) {
                userName = "Customer";
            }
            String templatePath = "";
            WritableArray templateList = Arguments.createArray();
            if (strModule == null || strModule.equals("")) {
                templatePath = SDCARD + "iTablet/User/" + userName + "/ExternalData";
            } else {
                templatePath = SDCARD + "iTablet/User/" + userName + "/ExternalData/" + strModule;
            }

            File file = new File(templatePath);

            if (file.exists() && file.isDirectory()) {
                File[] tempsArray = file.listFiles();
                for (int i = 0; i < tempsArray.length; i++) {
                    if (tempsArray[i].getName().contains("_示范数据")) continue;
                    if (tempsArray[i].isDirectory()) {
                        File[] tempArray = tempsArray[i].listFiles();
                        WritableMap tempInfo = Arguments.createMap();
                        boolean hasTemplates = false;
                        boolean hasWorkspace = false;
                        for (int j = 0; j < tempArray.length; j++) {
                            String tempFileName = tempArray[j].getName();
                            String suffix = tempFileName.substring(tempFileName.lastIndexOf(".") + 1).toLowerCase();
                            if (suffix.equals("smw") || suffix.equals("sxwu") || suffix.equals("sxw") || suffix.equals("smwu")) {
                                String tempName = tempFileName.substring(0, tempFileName.lastIndexOf("."));
                                tempInfo.putString("name", tempName);
                                tempInfo.putString("path", tempArray[j].getAbsolutePath());
                                hasWorkspace = true;

                                if (hasTemplates) break;
                            } else if (suffix.equals("xml")) {
                                hasTemplates = true;
//                                if (tempInfo.hasKey("name") && tempInfo.getString("name") != null && !tempInfo.getString("name").equals("")) break;
                                if (hasWorkspace) break;
                            }
                        }
                        // WritableMap 突然不能获取内部的值？？？
//                        if (hasTemplates && info.hasKey("name") && info.getString("name") != null && !info.getString("name").equals("")) {
                        if (hasTemplates && hasWorkspace) {
                            templateList.pushMap(tempInfo);
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

    public static WritableArray getTemplate(String path) {
        WritableArray templateList = Arguments.createArray();
        File file = new File(path);

        if (file.exists() && file.isDirectory()) {
            File[] tempsArray = file.listFiles();
            WritableMap tempInfo = Arguments.createMap();
            boolean hasTemplate = false;

            for (int i = 0; i < tempsArray.length; i++) {
                if (tempInfo == null) {
                    tempInfo = Arguments.createMap();
                }
                if (tempsArray[i].isDirectory()) {
                    WritableArray subList = getTemplate(tempsArray[i].getAbsolutePath());
                    if (subList.size() > 0) {
                        for (int j = 0; j < subList.size(); j++) {
                            ReadableMap info = subList.getMap(i);
                            templateList.pushMap((WritableMap) info);
                        }
                    }
                } else {
                    String tempFileName = tempsArray[i].getName();
                    String name = tempFileName.substring(0, tempFileName.lastIndexOf(".")).toLowerCase();
                    String suffix = tempFileName.substring(tempFileName.lastIndexOf(".") + 1).toLowerCase();
                    if (suffix.equals("smw") || suffix.equals("sxwu") || suffix.equals("sxw") || suffix.equals("smwu")) {
                        if (name.contains("~[") && name.contains("]")) continue;
                        String fileName = tempFileName.substring(0, tempFileName.lastIndexOf("."));

                        tempInfo.putString("name", fileName);
                        tempInfo.putString("path", tempsArray[i].getAbsolutePath());

                        if (hasTemplate) {
                            templateList.pushMap(tempInfo);
                            hasTemplate = false;
                            tempInfo = null;
                        }
                    } else if (suffix.equals("xml")) {
                        hasTemplate = true;
                        if (tempInfo.getString("name") != null && !tempInfo.getString("name").equals("")) {
                            templateList.pushMap(tempInfo);
                            hasTemplate = false;
                            tempInfo = null;
                        }
                    }
                }
            }
        }
        return templateList;
    }
}

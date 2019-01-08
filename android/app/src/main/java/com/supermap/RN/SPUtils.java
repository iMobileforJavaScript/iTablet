package com.supermap.RN;

import android.content.Context;
import android.content.SharedPreferences;
import android.content.SharedPreferences.Editor;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

/**
 * sp存储工具类
 * 
 * @author zzb
 * 
 */
public class SPUtils extends ReactContextBaseJavaModule {

    private static final String REACT_CLASS = "SPUtils";
    private static ReactApplicationContext reactContext;

    public SPUtils(ReactApplicationContext context) {
        super(context);
        reactContext = context;
    }

    @Override
	public String getName() {
		return REACT_CLASS;
	}

	// 创建sp文件
    @ReactMethod
	public static void createFile(String fileName, Promise promise) {
        try {
            reactContext.getSharedPreferences(fileName, Context.MODE_PRIVATE);
            promise.resolve(true);
        } catch (Exception e) {
            promise.reject(e);
        }
	}

    @ReactMethod
	public static void putInt(String fileName, String key, int value, Promise promise) {
        try {
            Editor sp = reactContext.getSharedPreferences(fileName, Context.MODE_PRIVATE).edit();
            sp.putInt(key, value);
            sp.commit();

            promise.resolve(true);
        } catch (Exception e) {
            promise.reject(e);
        }
	}

    @ReactMethod
	public static void putBoolean(String fileName, String key, boolean value, Promise promise) {
        try {
            Editor sp = reactContext.getSharedPreferences(fileName, Context.MODE_PRIVATE).edit();
            sp.putBoolean(key, value);
            sp.commit();

            promise.resolve(true);
        } catch (Exception e) {
            promise.reject(e);
        }
	}

    @ReactMethod
	public static void putString(String fileName, String key, String value, Promise promise) {
        try {
            Editor sp = reactContext.getSharedPreferences(fileName, Context.MODE_PRIVATE).edit();
            sp.putString(key, value);
            sp.commit();

            promise.resolve(true);
        } catch (Exception e) {
            promise.reject(e);
        }
	}

    @ReactMethod
	public static void getInt(String fileName, String key, int defValue, Promise promise) {
        try {
            SharedPreferences sp = reactContext.getSharedPreferences(fileName,Context.MODE_PRIVATE);
            int value = sp.getInt(key, defValue);

            promise.resolve(value);
        } catch (Exception e) {
            promise.reject(e);
        }
	}

    @ReactMethod
	public static void getBoolean(String fileName, String key, boolean defValue, Promise promise) {
        try {
            SharedPreferences sp = reactContext.getSharedPreferences(fileName, Context.MODE_PRIVATE);
            boolean value = sp.getBoolean(key, defValue);

            promise.resolve(value);
        } catch (Exception e) {
            promise.reject(e);
        }
	}

    @ReactMethod
	public static void getString(String fileName, String key, String defValue, Promise promise) {
        try {
            SharedPreferences sp = reactContext.getSharedPreferences(fileName, Context.MODE_PRIVATE);
            String value = sp.getString(key, defValue);

            promise.resolve(value);
        } catch (Exception e) {
            promise.reject(e);
        }
	}

}

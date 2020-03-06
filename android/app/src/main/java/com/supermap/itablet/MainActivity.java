package com.supermap.itablet;

import android.Manifest;
import android.app.Activity;
import android.content.Intent;
import android.content.IntentFilter;
import android.content.pm.ActivityInfo;
import android.content.res.Configuration;
import android.net.ConnectivityManager;
import android.net.wifi.WifiManager;
import android.os.Bundle;
import android.util.Log;

import com.facebook.react.ReactActivity;
import com.facebook.react.ReactFragmentActivity;
import com.rnfs.RNFSManager;
import com.supermap.RN.FileTools;
import com.supermap.RN.appManager;
import com.supermap.data.Environment;
import com.supermap.data.LicenseStatus;
import com.supermap.data.LicenseType;
import com.supermap.file.Utils;
import com.supermap.smNative.collector.SMCollector;
import com.tbruyelle.rxpermissions2.Permission;
import com.tbruyelle.rxpermissions2.RxPermissions;
import com.tencent.mm.opensdk.openapi.IWXAPI;

import io.reactivex.functions.Consumer;

import org.devio.rn.splashscreen.SplashScreen;

public class MainActivity extends ReactActivity {
    public final static String SDCARD = android.os.Environment.getExternalStorageDirectory().getAbsolutePath();
    public static boolean isActive;
    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "iTablet";
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        SplashScreen.show(this);
        super.onCreate(savedInstanceState);
        requestPermissions();
        initEnvironment();
        initDefaultData();
        if (!isTablet(this)) {
            setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_PORTRAIT);
        } else {
            setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_USER);
        }
        appManager.getAppManager().addActivity(this);
        IWXAPI iwxapi=appManager.getAppManager().registerWechat(this);
        FileTools.getUriState(this);



//        SMCollector.openGPS(this);
        //注册网络状态监听广播
        RNFSManager.NetWorkChangReceiver netWorkChangReceiver = new RNFSManager.NetWorkChangReceiver();
        IntentFilter filter = new IntentFilter();
        filter.addAction(WifiManager.WIFI_STATE_CHANGED_ACTION);
        filter.addAction(WifiManager.NETWORK_STATE_CHANGED_ACTION);
        filter.addAction(ConnectivityManager.CONNECTIVITY_ACTION);
        registerReceiver(netWorkChangReceiver, filter);
    }

    @Override
    public void onConfigurationChanged(Configuration newConfig) {
        super.onConfigurationChanged(newConfig);
        Intent intent = new Intent("onConfigurationChanged");
        intent.putExtra("newConfig", newConfig);
        this.sendBroadcast(intent);
    }
    @Override
    public void onNewIntent(Intent intent) {

        super.onNewIntent(intent);

        setIntent(intent);
        FileTools.getUriState(this);
        //must store the new intent unless getIntent() will return the old one
    }


    private void initEnvironment() {
        String licensePath = SDCARD + "/iTablet/license/";
        String licenseName = "Trial_License.slm";
        if (!Utils.fileIsExit(licensePath + licenseName)) {
            Utils.copyAssetFileToSDcard(this, licensePath, licenseName);
        }
//        Utils.copyAssetFileToSDcard(this, licensePath, licenseName);
        Environment.setLicensePath(SDCARD + "/iTablet/license");

        Environment.initialization(this);

        LicenseStatus status = Environment.getLicenseStatus();
        if (status.isTrailLicense() && !status.isLicenseValid()) {
            Utils.copyAssetFileToSDcard(this, licensePath, licenseName);
            Environment.initialization(this);

            status = Environment.getLicenseStatus();
        }
    }

    private void initDefaultData() {
        FileTools.initUserDefaultData("Customer", this);
        // 拷贝默认的工作空间
//        String customerWs = SDCARD + "/iTablet/User/Customer/Data";
//        String customerWsName = "Customer.smwu";
//        if (!Utils.fileIsExit(customerWs + customerWsName)) {
//            Utils.copyAssetFileToSDcard(this, customerWs, customerWsName);
//        }
//        // 拷贝默认的配置
//        String configName = "mapinfo.txt";
//        if (!Utils.fileIsExit(customerWs + configName)) {
//            Utils.copyAssetFileToSDcard(this, customerWs, configName);
//        }
        // 拷贝默认数据
//        String localPath = SDCARD + "/iTablet/data/local/";
//        String defaultZipData = "defaultData.zip";
//        if (!Utils.fileIsExit(localPath + "Changchun")) {
//            Utils.copyAssetFileToSDcard(this, localPath, defaultZipData);
//            Decompressor.UnZipFolder(localPath + defaultZipData, localPath);
//            Utils.deleteFile(localPath + defaultZipData);
//        }

//        String localPath2 = SDCARD + "/iTablet/data/local/";
//        String defaultZipData2 = "OlympicGreen_android.zip";
//        if (!Utils.fileIsExit(localPath2 + "OlympicGreen_android")) {
//            Utils.copyAssetFileToSDcard(this, localPath2, defaultZipData2);
//            Decompressor.UnZipFolder(localPath2 + defaultZipData2, localPath2);
//            Utils.deleteFile(localPath2 + defaultZipData2);
//        }
    }

    private void requestPermissions() {
        RxPermissions rxPermission = new RxPermissions(this);
        rxPermission
                .requestEach(Manifest.permission.READ_PHONE_STATE,
                        Manifest.permission.ACCESS_FINE_LOCATION,
                        Manifest.permission.WRITE_EXTERNAL_STORAGE,
                        Manifest.permission.READ_EXTERNAL_STORAGE,
                        Manifest.permission.KILL_BACKGROUND_PROCESSES,
                        Manifest.permission.RECORD_AUDIO,
                        Manifest.permission.CAMERA)
                .subscribe(new Consumer<Permission>() {
                    @Override
                    public void accept(Permission permission) throws Exception {
                        if (permission.granted) {
                            // 用户已经同意该权限
                            Log.d("RxPermissionTest", permission.name + " is granted.");
                        } else if (permission.shouldShowRequestPermissionRationale) {
                            // 用户拒绝了该权限，没有选中『不再询问』（Never ask again）,那么下次再次启动时，还会提示请求权限的对话框
                            Log.d("RxPermissionTest", permission.name + " is denied. More info should be provided.");
                        } else {
                            // 用户拒绝了该权限，并且选中『不再询问』
                            Log.d("RxPermissionTest", permission.name + " is denied.");
                        }
                    }
                });
    }

    private boolean isTablet(Activity context) {
        return (context.getResources().getConfiguration().screenLayout & Configuration.SCREENLAYOUT_SIZE_MASK) >= Configuration.SCREENLAYOUT_SIZE_LARGE;
    }

}

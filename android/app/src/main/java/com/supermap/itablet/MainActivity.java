package com.supermap.itablet;

import android.Manifest;
import android.os.Bundle;
import android.util.Log;

import com.facebook.react.ReactActivity;
import com.supermap.data.Environment;
import com.supermap.file.Decompressor;
import com.supermap.file.Utils;
import com.tbruyelle.rxpermissions2.Permission;
import com.tbruyelle.rxpermissions2.RxPermissions;

import io.reactivex.functions.Consumer;

public class MainActivity extends ReactActivity {

    public final static String SDCARD = android.os.Environment.getExternalStorageDirectory().getAbsolutePath();

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

        super.onCreate(savedInstanceState);
        requestPermissions();
        initEnvironment();
        initDefaultData();
    }

    private void initEnvironment() {
        Utils.copyAssetFileToSDcard(this, SDCARD + "/iTablet/license", "Trial_License.slm");
        Environment.setLicensePath(SDCARD + "/iTablet/license");
        Environment.initialization(this);
    }

    private void initDefaultData() {
        // 拷贝默认的工作空间
        String customerWs = SDCARD + "/iTablet/User/Customer/Data";
        String customerWsName = "Customer.smwu";
        if (!Utils.fileIsExit(customerWs + customerWsName)) {
            Utils.copyAssetFileToSDcard(this, customerWs, customerWsName);
        }
//        // 拷贝默认的配置
//        String configName = "mapinfo.txt";
//        if (!Utils.fileIsExit(customerWs + configName)) {
//            Utils.copyAssetFileToSDcard(this, customerWs, configName);
//        }
        // 拷贝默认数据
        String localPath = SDCARD + "/iTablet/data/local/";
        String defaultZipData = "defaultData.zip";
        Utils.copyAssetFileToSDcard(this, localPath, defaultZipData);
        Decompressor.UnZipFolder(localPath + defaultZipData, localPath);
        Utils.deleteFile(localPath + defaultZipData);
    }

    private void requestPermissions() {
        RxPermissions rxPermission = new RxPermissions(this);
        rxPermission
                .requestEach(Manifest.permission.READ_PHONE_STATE,
                        Manifest.permission.ACCESS_FINE_LOCATION,
                        Manifest.permission.WRITE_EXTERNAL_STORAGE,
                        Manifest.permission.READ_EXTERNAL_STORAGE)
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
}

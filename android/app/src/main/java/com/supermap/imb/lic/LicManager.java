package com.supermap.imb.lic;

import android.content.Context;
import android.content.SharedPreferences;

import com.supermap.data.LicenseType;
import com.supermap.file.FileManager;

import java.io.File;

public class LicManager {

    public static void restoreBackupLicense(Context context) {
        try{
            String licensePath = context.getFilesDir().getAbsolutePath() + "/recycleLicense/";
            String backupPath = context.getExternalCacheDir().getParentFile().getParent() + "/com.config.supermap.runtime/config/recycleLicense/" + "9D" + File.separatorChar;
            String serialNumberFilePath = context.getExternalCacheDir().getParentFile().getParent() + "/com.config.supermap.runtime/config/recycleLicense/" + "serialNumber.txt";

            File serialNumberFile = new File(serialNumberFilePath);
            if(!serialNumberFile.exists()){
                return;
            }

            File licenseDir = new File(licensePath);
            if(!licenseDir.exists()){
                licenseDir.mkdirs();
            } else if (licenseDir.listFiles().length != 0) {
                return;
            }
            File backupDir = new File(backupPath);
            if(backupDir.exists()){
                File[] files = backupDir.listFiles();
                if(files.length > 0) {
                    for(int i = 0; i < files.length; i++){
                        String fileName = files[i].getName();
                        if(fileName.contains(".slm")){
                            fileName = fileName.split(".slm")[1] + ".slm";
                        }
                        FileManager.getInstance().copy(backupPath + fileName, licensePath + fileName);
                    }

                    SharedPreferences.Editor shareData = context.getSharedPreferences("RecycleLicense", 0).edit();
                    shareData.putString("APP_LICENSE_PATH", licensePath);
                    shareData.putInt("LICENSE_TYPE", LicenseType.UUID.value());
                    shareData.commit();
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

}

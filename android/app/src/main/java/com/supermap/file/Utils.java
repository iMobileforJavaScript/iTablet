package com.supermap.file;

import android.content.Context;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;

public class Utils {
    public static void copyAssetFileToSDcard(Context context, String filePath, String fileName) {
        InputStream inputStream;
        try {
            inputStream = context.getResources().getAssets().open(fileName);// assets文件夹下的文件
            File file = new File(filePath);
            if (!file.exists()) {
                file.mkdirs();
            }
            FileOutputStream fileOutputStream = new FileOutputStream(filePath + "/" + fileName);// 保存到本地的文件夹下的文件
            byte[] buffer = new byte[1024];
            int count = 0;
            while ((count = inputStream.read(buffer)) > 0) {
                fileOutputStream.write(buffer, 0, count);
            }
            fileOutputStream.flush();
            fileOutputStream.close();
            inputStream.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    public static void copyAssetFileToSDcard(Context context, String filePath, String fileName, String targetName) {
        InputStream inputStream;
        try {
            inputStream = context.getResources().getAssets().open(fileName);// assets文件夹下的文件
            File file = new File(filePath);
            if (!file.exists()) {
                file.mkdirs();
            }
            FileOutputStream fileOutputStream = new FileOutputStream(filePath + "/" + targetName);// 保存到本地的文件夹下的文件
            byte[] buffer = new byte[1024];
            int count = 0;
            while ((count = inputStream.read(buffer)) > 0) {
                fileOutputStream.write(buffer, 0, count);
            }
            fileOutputStream.flush();
            fileOutputStream.close();
            inputStream.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    public static boolean fileIsExit(String filePath) {
        File file = new File(filePath);
        return file.exists();
    }

    public static void deleteFile(String filePath) {
        File file = new File(filePath);
        if (file.isDirectory()) {
            delDir(filePath);
        } else {
            delFile(filePath);
        }
    }

    //删除文件
    public static void delFile(String filePath){
        File file = new File(filePath);
        if(file.isFile()){
            file.delete();
        }
        file.exists();
    }

    //删除文件夹和文件夹里面的文件
    public static void delDir(String filePath) {
        File dir = new File(filePath);
        if (dir == null || !dir.exists() || !dir.isDirectory())
            return;

        for (File file : dir.listFiles()) {
            if (file.isFile())
                file.delete(); // 删除所有文件
            else if (file.isDirectory())
                delDir(file.getAbsolutePath()); // 递规的方式删除文件夹
        }
        dir.delete();// 删除目录本身
    }
}

package com.supermap.file;

import android.content.Context;
import android.content.pm.ApplicationInfo;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import android.os.AsyncTask;
import android.os.Build;
import android.os.Process;
import android.util.Log;


import com.supermap.RNUtils.FileUtil;
import com.supermap.itablet.MainApplication;
import com.supermap.services.LogInfoService;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;


/**
 * 异常捕捉工具，捕获到异常之后，发送到后台
 * <p/>
 *
 */
public class CrashHandler implements Thread.UncaughtExceptionHandler {
    private static final String TAG = "CrashHandler";
    private static boolean DEBUG = true;

    private static CrashHandler sInstance = new CrashHandler();
    private Thread.UncaughtExceptionHandler mDefaultCrashHandler;
    private static Context mContext;

    public static String crashPath =FileUtil.homeDirectory+"/iTablet/Cache/crash_handler.txt" ;

    private CrashHandler() {
    }

    public static CrashHandler getInstance() {
        return sInstance;
    }

    public static void setDebug(boolean mode) {
        DEBUG = mode;
    }

    public void init(Context appContext) {
        mDefaultCrashHandler = Thread.getDefaultUncaughtExceptionHandler();
        Thread.setDefaultUncaughtExceptionHandler(this);
        mContext = appContext.getApplicationContext();
        sendLastExceptionMsg();
    }

    @Override
    public void uncaughtException(final Thread thread, final Throwable ex) {
        String exceptionMsg = new String();
        Long time = System.currentTimeMillis();
        String current = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(new Date(time));
        StringBuffer sb = new StringBuffer();
        try {
            sb.append("时间: " + current + "\n");
            sb.append(ex.getClass().getCanonicalName() + ": " + ex.getLocalizedMessage() + "\n");
            sb.append("" + "\n");
            StackTraceElement[] s = ex.getStackTrace();
            for (int i = 0; s != null && i < s.length; i++) {
                StackTraceElement stackTraceElement = s[i];
                sb.append("at " + stackTraceElement.toString() + "\n");
            }
            sb.append("\nCause by: " + ex.getCause() + "\n");
            s = null;
            if (ex.getCause() != null) {
                s = ex.getCause().getStackTrace();
            }
            for (int i = 0; s != null && i < s.length; i++) {
                StackTraceElement stackTraceElement = s[i];
                sb.append("at " + stackTraceElement.toString() + "\n");
            }
            sb.append("\n异常手机信息：\n");

//            if (User.userInfo != null) {
//                sb.append(String.format("\n用户：%s (%s)\n", User.userInfo.mPhone, User.userInfo.mUserName));
//            }
            try {
                PackageManager manager = MainApplication.getInstance().getPackageManager();
                PackageInfo info = manager.getPackageInfo(MainApplication.getInstance().getPackageName(), 0);
                String version = info.versionName;
                sb.append(String.format("\n软件版本%s %s\n", info.versionName, info.versionCode));
            } catch (Exception e) {
                e.printStackTrace();
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        exceptionMsg = sb.toString();
        String finalExceptionMsg = exceptionMsg;
        saveExceptionAsync(finalExceptionMsg, thread, ex);
    }
    //判断当前应用是否是debug状态
    public static boolean isApkInDebug(Context context) {
        try {
            ApplicationInfo info = context.getApplicationInfo();
            return (info.flags & ApplicationInfo.FLAG_DEBUGGABLE) != 0;
        } catch (Exception e) {
            return false;
        }
    }


    @SuppressWarnings("deprecation")
    private void saveExceptionAsync(final String error, final Thread thread, final Throwable ex) {
        if (isApkInDebug(mContext)) {
            Process.killProcess(Process.myPid());
            return;
        }
        final AsyncTask st = new AsyncTask() {

            @Override
            protected Object doInBackground(Object... params) {
//                LogUtil.e("保存异常信息");
                saveExceptionMsg(error);
                handlerCrash(thread, ex);
                return null;
            }

            @Override
            protected void onPostExecute(Object result) {
//                LogUtil.e("保存异常信息-完成");
                handlerCrash(thread, ex);
            }

            @Override
            protected void onCancelled() {
//                LogUtil.e("取消保存信息");
                handlerCrash(thread, ex);
            }
        };
        st.execute(error);
    }

    public static void saveExceptionMsg(String errorMsg) {
        File file = new File(crashPath);
        if (!file.getParentFile().exists()) {
            file.getParentFile().mkdirs();
        }
        if (!file.exists()) {
            OutputStream outputStream = null;
            try {
                file.createNewFile();
                outputStream = new FileOutputStream(file);
                outputStream.write(errorMsg.getBytes());
                outputStream.flush();
//                LogUtil.e("保存成功");
            } catch (IOException e) {
                e.printStackTrace();
            } finally {
                if (outputStream != null) {
                    try {
                        outputStream.close();
                    } catch (IOException e) {
                        e.printStackTrace();
                    }
                }
            }
        }
    }

    /**
     * 发送上次产生的异常
     */
    private static void sendLastExceptionMsg() {
        new Thread(new Runnable() {
            @Override
            public void run() {
                File file = new File(crashPath);
                if (!file.exists()) {
//                    LogUtil.e("没有异常文件");
                    return;
                }
                ByteArrayOutputStream baos = new ByteArrayOutputStream();
                InputStream inputStream = null;
                try {
                    inputStream = new FileInputStream(file);
                    byte[] buffer = new byte[1024];
                    int count = 0;
                    while ((count = inputStream.read(buffer)) != -1) {
                        baos.write(buffer, 0, count);
                    }
                    final String errorMsg = baos.toString();
//                    LogUtil.e("异常文件信息:" + errorMsg);


                    crashReport(errorMsg);

                    file.delete();
                } catch (FileNotFoundException e) {
                    e.printStackTrace();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        }).start();
    }

    private void handlerCrash(Thread thread, Throwable ex) {
        if (mDefaultCrashHandler != null) {
//            LogUtil.e("系统处理");
            mDefaultCrashHandler.uncaughtException(thread, ex);
        } else {
//            LogUtil.e("自己处理");
            Process.killProcess(Process.myPid());
        }
    }


    /**
     * 提交崩溃错误信息
     *
     * @param message
     */
    private static void crashReport(String message) {

        Map<String,String> crashMap=new HashMap<>();
        crashMap.put("crashAndroid",message);
        LogInfoService.sendAPPLogInfo(crashMap, mContext, new LogInfoService.SendAppInfoListener() {
            @Override
            public void result(boolean result) {
                if(result){
                    Log.e(TAG, "-------异常信息发送成功-------/n");
                }else {
                    Log.e(TAG, "-------异常信息发送失败-------/n");
                }
            }
        });

    }


}

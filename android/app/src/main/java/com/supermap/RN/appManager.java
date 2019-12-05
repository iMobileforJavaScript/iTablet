package com.supermap.RN;

import android.app.Activity;
import android.content.Context;
import android.os.Handler;

import com.tencent.mm.opensdk.modelmsg.SendMessageToWX;
import com.tencent.mm.opensdk.modelmsg.WXFileObject;
import com.tencent.mm.opensdk.modelmsg.WXMediaMessage;
import com.tencent.mm.opensdk.openapi.IWXAPI;
import com.tencent.mm.opensdk.openapi.WXAPIFactory;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.text.DecimalFormat;
import java.util.Map;
import java.util.Stack;

public class appManager {
    private static Stack<Activity> activityStack;
    private static appManager instance;
    private IWXAPI iwxapi = null;

    private appManager() {
    }

    /**
     * 单一实例
     */
    public static appManager getAppManager() {
        if (instance == null) {
            instance = new appManager();
        }
        return instance;
    }

    /**
     * 添加Activity到堆栈
     */
    public void addActivity(Activity activity) {
        if (activityStack == null) {
            activityStack = new Stack<Activity>();
        }
        activityStack.add(activity);
    }

    /**
     * 获取当前Activity（堆栈中最后一个压入的）
     */
    public Activity currentActivity() {
        Activity activity = activityStack.lastElement();
        return activity;
    }

    /**
     * 结束当前Activity（堆栈中最后一个压入的）
     */
    public void finishActivity() {
        Activity activity = activityStack.lastElement();
        finishActivity(activity);
    }

    /**
     * 结束指定的Activity
     */
    public void finishActivity(Activity activity) {
        if (activity != null) {
            activityStack.remove(activity);
            activity.finish();
            activity = null;
        }
    }

    /**
     * 结束指定类名的Activity
     */
    public void finishActivity(Class<?> cls) {
        for (Activity activity : activityStack) {
            if (activity.getClass().equals(cls)) {
                finishActivity(activity);
            }
        }
    }

    /**
     * 结束所有Activity
     */
    public void finishAllActivity() {
        for (int i = 0, size = activityStack.size(); i < size; i++) {
            if (null != activityStack.get(i)) {
                activityStack.get(i).finish();
            }
        }
        activityStack.clear();
    }


    /**
     * 退出应用程序
     */
    public void AppExit(final Context context) {
        try {
//            android.os.Process.killProcess(android.os.Process.myPid());
            finishAllActivity();
            Handler handler = new Handler();
            handler.postDelayed(new Runnable() {
                @Override
                public void run() {
                    android.os.Process.killProcess(android.os.Process.myPid());
                }
            }, 1000);//1秒后执行Runnable中的run方法
        } catch (Exception e) {
            System.out.println(e);
        }
    }

    public IWXAPI registerWechat(Context context) {
        String APP_ID = "wx06e9572a1d069aaa";
        iwxapi = WXAPIFactory.createWXAPI(context, APP_ID, false);
        iwxapi.registerApp(APP_ID);
        return iwxapi;
    }

    public boolean isWXInstalled() {
        return iwxapi.isWXAppInstalled();
    }

    public Boolean sendFileOfWechat(Map map) {
        Boolean result = false;
        WXMediaMessage msg = new WXMediaMessage();
        SendMessageToWX.Req req = new SendMessageToWX.Req();
        if (map.containsKey("title")) {
            msg.title = map.get("title").toString();
        }
        if (map.containsKey("description")) {
            msg.description = map.get("description").toString();
        }
        if (map.containsKey("filePath")) {
            File file=new File(map.get("filePath").toString());
            try {
                FileInputStream fis=new FileInputStream(file);
                long size=fis.available();
                if(size>10485760){
                    return false;
                }
            } catch (FileNotFoundException e) {
                e.printStackTrace();
            } catch (IOException e) {
                e.printStackTrace();
            }
            WXFileObject fileObject = new WXFileObject(map.get("filePath").toString());
            msg.mediaObject = fileObject;
        }
        req.transaction = buildTransaction("file");
        req.message = msg;
        req.scene = SendMessageToWX.Req.WXSceneSession;
        if (iwxapi != null) {
            result = iwxapi.sendReq(req);
            int i=0;
            while (!result){
                result= iwxapi.sendReq(req);
                i++;
                if(result||i==10){
                    break;
                }
            }
        }
        return result;
    }

    private String buildTransaction(String type) {
        return (type == null) ? String.valueOf(System.currentTimeMillis()) : type + System.currentTimeMillis();
    }
}

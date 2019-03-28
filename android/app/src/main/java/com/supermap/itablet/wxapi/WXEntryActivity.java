package com.supermap.itablet.wxapi;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.support.v7.app.AppCompatActivity;
import android.util.Log;

import com.supermap.RN.appManager;
import com.tencent.mm.opensdk.modelbase.BaseReq;
import com.tencent.mm.opensdk.modelbase.BaseResp;
import com.tencent.mm.opensdk.openapi.IWXAPI;
import com.tencent.mm.opensdk.openapi.IWXAPIEventHandler;

public class WXEntryActivity extends AppCompatActivity implements IWXAPIEventHandler {
    private IWXAPI iwxapi;

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        iwxapi = appManager.getAppManager().registerWechat(this);
        iwxapi.handleIntent(getIntent(), this);
    }

    @Override
    protected void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        setIntent(intent);
        iwxapi.handleIntent(intent, this);
    }


    @Override
    public void onReq(BaseReq baseReq) {
        String result = null;
    }

    @Override
    public void onResp(BaseResp baseResp) {
        String result = null;
        switch (baseResp.errCode) {
            case BaseResp.ErrCode.ERR_OK: {
                itentMainActivity();
                result = "分享成功";
                Log.e("分享成功", "=====================");
            }
            break;
            case BaseResp.ErrCode.ERR_USER_CANCEL:
                itentMainActivity();
                result = "分享取消";
                Log.e("分享取消", "=====================");
                break;
            case BaseResp.ErrCode.ERR_AUTH_DENIED:
                itentMainActivity();
                result = "分享被拒绝";
                Log.e("分享被拒绝", "=====================");
                break;
            default:
                itentMainActivity();
                result = "分享返回";
                Log.e("分享返回", "=====================");
                break;
        }

   }

   public void itentMainActivity(){
       try {
           Class toActivity=Class.forName("com.supermap.itablet.MainActivity");
           Intent intent = new Intent(this,toActivity);
           this.startActivity(intent);
       } catch (ClassNotFoundException e) {
           e.printStackTrace();
       }
   }
}

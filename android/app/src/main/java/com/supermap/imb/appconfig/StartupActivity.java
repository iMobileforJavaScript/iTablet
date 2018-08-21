package com.supermap.imb.appconfig;


import com.itablet.MainApplication;
import com.supermap.DataVisualization.VisualizationActivity;
import com.supermap.data.Environment;


import android.app.Activity;
import android.app.ProgressDialog;
import android.content.Intent;

import android.os.Bundle;


import com.supermp.imb.file.MyAssetManager;
import com.supermp.imb.file.MySharedPreferences;

/**
 * 启动界面，初始化数据
 *
 */
public class StartupActivity extends Activity {
private ProgressDialog dialog;
	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		setContentView(android.R.layout.list_content);
		Environment.setLicensePath(DefaultDataConfig.LicPath);
		Environment.initialization(this);
		//初始化系统相关的类
		MySharedPreferences.init(this);
		MyAssetManager.init(this);
		// Assume thisActivity is the current activity
		String path = MainApplication.SDCARD+"SuperMap/license/" ;

	}

	@Override
	protected void onStart() {
		super.onStart();
		dialog = new ProgressDialog(this);
		dialog.setCancelable(false);
		dialog.setCanceledOnTouchOutside(false);
		dialog.setMessage("正在初始化数据。。。");
		dialog.show();
		new Thread(){
			public void run() {
				new DefaultDataConfig().autoConfig();

				dialog.dismiss();
				runOnUiThread(new Runnable() {

					@Override
					public void run() {

						Intent intent = new Intent(StartupActivity.this, VisualizationActivity.class);
						StartupActivity.this.startActivity(intent);
						finish();
					}
				});
			};
		}.start();

	}

	@Override
	protected void onStop() {

		super.onStop();
	}

}

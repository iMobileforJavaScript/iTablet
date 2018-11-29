package com.supermap.imb.lic;

import java.io.File;
import java.io.FileWriter;
import java.io.IOException;

import com.supermap.imb.appconfig.DefaultDataConfig;

import android.content.Context;

public class LicConfig {

	private static String CONFIGPATH = null;
	public static void configLic(Context context){
		if(context != null){
			
			String path1 = context.getCacheDir().getAbsolutePath();
			
			File file = new File(path1 + "/templic/s.slm");
			if(!file.exists()){
				FileWriter writer =null;
				
				try {
					file.getParentFile().mkdirs();
					writer = new FileWriter(file, true);
					String keyStr = "188569B7C376D2C08D4A7868184770ED";
					
					String encodedStr = null;
					encodedStr = "51SviJclnoagh1LixJ1KbvR84vfqOxxYv3lM6DVbgdybvADj8kxvRKsRtCZ8uI8/L2JEDd3ga/8/hw3uCBbkCENr0v2S4MXUGlcuJuWaXZCkM1marUZAJUBOD6sbz0TpkQYKqtbEG2CUh5G6vx2dCvJoldSC3NBv";
					String decodedStr = StringEncrypt.decode(encodedStr, keyStr);
					writer.write(decodedStr);
					
					DefaultDataConfig.LicPath = file.getParent();
					CONFIGPATH = file.getParent();
				} catch (IOException e) {
					e.printStackTrace();
				} finally {
					if(writer != null){
						try {
							writer.flush();
							writer.close();
						} catch (IOException e) {
							e.printStackTrace();
						}
					}
				}
			} else {
				DefaultDataConfig.LicPath = file.getParent();
				CONFIGPATH = file.getParent();
			} 
		}
		
	}
	
	public static String getConfigPath(){
		return CONFIGPATH;
	}
}

package com.supermap.imb.lic;

import javax.crypto.Cipher;
import javax.crypto.SecretKey;
import javax.crypto.SecretKeyFactory;
import javax.crypto.spec.DESKeySpec;
import javax.crypto.spec.IvParameterSpec;

import android.util.Base64;

/**
 * @author Jun Xing , 2017-11-16
 */
public class StringEncrypt {

	
	private static byte[] iv = new byte[] {0x11, 0x22, 0x33, 0x44, 0x55, 0x66, 0x77, (byte) 0x88};
	public static String encode(String data, String keyStr){
		
		String encodedStr = null;
		try {
			
			DESKeySpec keySpec = new DESKeySpec(keyStr.getBytes("utf-8"));
			IvParameterSpec ivSpec = new IvParameterSpec(iv);
			
			SecretKeyFactory keyFactory = SecretKeyFactory.getInstance("DES");
			
			SecretKey key = keyFactory.generateSecret(keySpec);
			
			
			Cipher cipher = Cipher.getInstance("DES/CBC/PKCS5Padding");
			cipher.init(Cipher.ENCRYPT_MODE, key, ivSpec);
			
			byte[] encodeBytes = Base64.encode(cipher.doFinal(data.getBytes("utf-8")), Base64.DEFAULT);
		
			encodedStr = new String(encodeBytes);
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
		return encodedStr;
	}
	
	public static String decode(String data, String keyStr){
		String decodedStr = null;
		try {

			DESKeySpec keySpec = new DESKeySpec(keyStr.getBytes());
			IvParameterSpec ivSpec = new IvParameterSpec(iv);

			SecretKeyFactory keyFactory = SecretKeyFactory.getInstance("DES");

			SecretKey key = keyFactory.generateSecret(keySpec);

			Cipher cipher = Cipher.getInstance("DES/CBC/PKCS5Padding");
			cipher.init(Cipher.DECRYPT_MODE, key, ivSpec);

			byte[] decodeBytes = cipher.doFinal(Base64.decode(data.getBytes("utf-8"),  Base64.DEFAULT));

			decodedStr = new String(decodeBytes);
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

		return decodedStr;
	}
	
}

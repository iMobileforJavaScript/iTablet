package com.supermap.file;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.InputStream;

public class FileManager {
	private static FileManager sInstance = null;
	
	private FileManager()
	{
		
	}
	
	public boolean isFileExsit(String name){
		File file = new File(name);
		if(file.isFile() && file.exists()){
			return true;
		}
		return false;
	}
	public boolean isDirExsit(String dir){
		File file = new File(dir);
		if(file.isDirectory() && file.exists()){
			return true;
		}
		return false;
	}
	
	public static FileManager getInstance(){
		if(sInstance == null){
			sInstance = new FileManager();
		}
		return sInstance;
	}
	
	public boolean mkdirs(String path){
		File dir = new File(path);
		if(dir.isDirectory())
		{
			if(!dir.exists())
			{
				dir.mkdirs();
			}
			return dir.exists();
		}
		return false;
	}
	
	public File[] opendir(String path){
		File dir = new File(path);
		if(dir.isDirectory())
		{
			return dir.listFiles(); 
		}
		return null;
	}
	
	public boolean copy(String from,String to)
	{
		File fromFile = new File(from);
		File toFile = new File(to);
		if (!fromFile.exists()) return false;
		Boolean result = true;
        try {
		    if(fromFile.isFile()) {
				return copyFile(fromFile, toFile, true);
            } else {
                File[] fileList = fromFile.listFiles();
                for (File file : fileList) {
                    if (file.isFile()) {
                        File desFile = new File(to + "/" + file.getName());
                        result = copyFile(file, desFile, true) && result;
                    } else {
                        result = copy(file.getAbsolutePath(), to + "/" + file.getName()) && result;
                    }
                }
            }
        } catch (Exception e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
            return false;
        }
		
		return result;
	}

	public boolean copy(InputStream from ,String to)
	{
		File toFile = new File(to);
		return copyFile(from, toFile,true);
	}
	
	public boolean deleteFile(String file)
	{
		return deleteFile(new File(file));
	}
	
	public boolean deleteFile(File file)
	{
		if(file.isFile() && file.exists())
		{
			return file.delete();
		}
		return false;
	}
	
	/**
	 * 删除文件夹会删除文件夹下的文件
	 * @param dir
	 * @return
	 */
	public boolean deleteDir(String dir)
	{
		return deleteDir(new File(dir));
	}
	
	public boolean deleteDir(File dir)
	{
		if(dir.exists() && dir.isDirectory())
		{
			return delete(dir);
		}
		return false;
	}
	
	/**
	 * 无论是文件还是文件夹递归删除
	 * @param file
	 * @return
	 */
	private boolean delete(File file)
	{
		if(file.exists() && file.isDirectory())
		{
			File[] files = file.listFiles();
			for(File f:files)
			{
				delete(f);
			}
			//现在是空文件夹了，可以正常删除了
			return file.delete();
			
		}else if(file.exists() && file.isFile())
		{
			return file.delete();
		}
		return false;
	}
	
	private boolean copyFile(File from, File des,boolean rewrite){
    	//目标路径不存在的话就创建一个
    	if(!des.getParentFile().exists()){
    		des.getParentFile().mkdirs();
    	}
    	if(des.exists()){
    		if(rewrite){
    			des.delete();
    		}else{
    			return false;
    		}
    	}
    	
    	try{
    		InputStream fis = new FileInputStream(from);
    		FileOutputStream fos = new FileOutputStream(des);
    		//1kb
    		byte[] bytes = new byte[1024];
    		int readlength = -1;
    		while((readlength = fis.read(bytes))>0){
    			fos.write(bytes, 0, readlength);
    		}
    		fos.flush();
    		fos.close();
    		fis.close();
    	}catch(Exception e){
    		return false;
    	}
    	return true;
    }

	private boolean copyFile(InputStream from, File des,boolean rewrite){
    	//目标路径不存在的话就创建一个
    	if(!des.getParentFile().exists()){
    		des.getParentFile().mkdirs();
    	}
    	if(des.exists()){
    		if(rewrite){
    			des.delete();
    		}else{
    			return false;
    		}
    	}

    	try{
    		InputStream fis = from;
    		FileOutputStream fos = new FileOutputStream(des);
    		//1kb
    		byte[] bytes = new byte[1024];
    		int readlength = -1;
    		while((readlength = fis.read(bytes))>0){
    			fos.write(bytes, 0, readlength);
    		}
    		fos.flush();
    		fos.close();
    		fis.close();
    	}catch(Exception e){
    		return false;
    	}
    	return true;
    }
}

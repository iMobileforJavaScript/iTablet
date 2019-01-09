package com.supermap.RN;

import android.content.Context;
import android.util.Log;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.supermap.file.Decompressor;
import com.supermap.file.FileManager;
import com.supermap.file.Utils;

import org.apache.tools.zip.ZipEntry;
import org.apache.tools.zip.ZipFile;

import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.FileWriter;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.io.UnsupportedEncodingException;
import java.util.Enumeration;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.zip.ZipException;
//import java.util.zip.ZipOutputStream;
import org.apache.tools.zip.ZipOutputStream;

public class FileTools extends ReactContextBaseJavaModule {
    public static final String REACT_CLASS = "FileTools";
//    private static final int BUFF_SIZE = 1024 * 1024; // 1M Byte
    private final static String TAG = "ZipHelper";
    private final static int BUFF_SIZE = 2048;

    public static final String SDCARD = android.os.Environment.getExternalStorageDirectory().getAbsolutePath();
    public static ReactApplicationContext reactContext;

    public FileTools(ReactApplicationContext context) {
        super(context);
        reactContext = context;
    }

    @Override
    public String getName() {
        return REACT_CLASS;
    }

    @ReactMethod
    public void getHomeDirectory(Promise promise) {
        try {
            promise.resolve(SDCARD);
        } catch (Exception e) {
            promise.reject(e);
        }
    }

    @ReactMethod
    public void getDirectoryContent(String path, Promise promise) {
        try {
            File flist = new File(path);
            String[] mFileList = flist.list();

            WritableArray arr = Arguments.createArray();
            for (String str : mFileList) {
                String type = "";
                if (new File(path + "/" + str).isDirectory()) {
                    type = "directory";
                } else {
                    type = "file";
                }
                WritableMap map = Arguments.createMap();
                map.putString("name", str);
                map.putString("type", type);

                arr.pushMap(map);
            }

            promise.resolve(arr);
        } catch (Exception e) {
            promise.reject(e);
        }
    }

    @ReactMethod
    public void fileIsExist(String path, Promise promise) {
        try {
            Boolean isExist = false;
            File file = new File(path);

            if (file.exists()) {
                isExist = true;
            }

            promise.resolve(isExist);
        } catch (Exception e) {
            promise.reject(e);
        }
    }

    @ReactMethod
    public void fileIsExistInSDCARD(String path, Promise promise) {
        try {
            Boolean isExist = false;
            File file = new File(SDCARD + "/" + path);

            if (file.exists()) {
                isExist = true;
            }

            promise.resolve(isExist);
        } catch (Exception e) {
            promise.reject(e);
        }
    }

    /**
     * 创建文件目录
     *
     * @param path    - 绝对路径
     * @param promise
     */
    @ReactMethod
    public void createDirectory(String path, Promise promise) {
        try {
            boolean result = createDirectory(path);
            promise.resolve(result);
        } catch (Exception e) {
            promise.reject(e);
        }
    }

    @ReactMethod
    public void isDirectory(String path, Promise promise) {
        try {
            File file = new File(path);
            boolean isDirectory = file.isDirectory();
            promise.resolve(isDirectory);
        } catch (Exception e) {
            promise.reject(e);
        }
    }

    @ReactMethod
    public void getPathList(String path, Promise promise) {
        try {
            File file = new File(path);

            File[] files = file.listFiles();
            WritableArray array = Arguments.createArray();
            for (int i = 0; i < files.length; i++) {
                String p = files[i].getAbsolutePath().replace(SDCARD, "");
                String n = files[i].getName();
                boolean isDirectory = files[i].isDirectory();
                WritableMap map = Arguments.createMap();
                map.putString("path", p);
                map.putString("name", n);
                map.putBoolean("isDirectory", isDirectory);
                array.pushMap(map);
            }
            promise.resolve(array);
        } catch (Exception e) {
            promise.reject(e);
        }
    }

    @ReactMethod
    public void getPathListByFilter(String path, ReadableMap filter, Promise promise) {
        try {
            File file = new File(path);

            File[] files = file.listFiles();
            WritableArray array = Arguments.createArray();
            if (files != null) {
                for (int i = 0; i < files.length; i++) {
                    String p = files[i].getAbsolutePath().replace(SDCARD, "");
                    String n = files[i].getName();
                    int lastDot = n.lastIndexOf(".");
                    String name, extension = "";
                    if (lastDot > 0) {
                        name = n.substring(0, lastDot).toLowerCase();
                        extension = n.substring(lastDot + 1).toLowerCase();
                    } else {
                        name = n;
                    }
                    boolean isDirectory = files[i].isDirectory();

                    String type = "Directory";
                    if (filter.toHashMap().containsKey("type")) {
                        type = filter.getString("type");
                    }

                    if (!filter.toHashMap().containsKey("name")) {
                        String filterName = filter.getString("name").toLowerCase().trim();
                        // 判断文件名
                        if (isDirectory || filterName.equals("") || !name.contains(filterName)) {
                            continue;
                        }
                    }

                    boolean isExist = false;
                    if (filter.toHashMap().containsKey("extension")) {
                        String filterType = filter.getString("extension").toLowerCase();
                        String[] extensions = filterType.split(",");
                        for (int j = 0; j < extensions.length; j++) {
                            String mExtension = extensions[j].trim();
                            // 判断文件类型
                            if (isDirectory && type.equals("Directory") || !isDirectory && !mExtension.equals("") && extension.contains(mExtension)) {
                                isExist = true;
                                break;
                            } else {
                                isExist = false;
                            }
                        }
                    }
                    if (!isExist) {
                        continue;
                    }

                    WritableMap map = Arguments.createMap();
                    map.putString("path", p);
                    map.putString("name", n);
                    map.putBoolean("isDirectory", isDirectory);
                    array.pushMap(map);
                }
            }
            promise.resolve(array);
        } catch (Exception e) {
            promise.reject(e);
        }
    }

    /**
     * 拷贝文件到app目录下
     *
     * @param fileName
     * @param path
     * @param promise
     */
    @ReactMethod
    public void assetsDataToSD(String fileName, String path, Promise promise) {
        try {
            InputStream myInput;
            OutputStream myOutput = new FileOutputStream(fileName);
            myInput = getReactApplicationContext().getAssets().open("myfile.zip");
            byte[] buffer = new byte[1024];
            int length = myInput.read(buffer);
            while (length > 0) {
                myOutput.write(buffer, 0, length);
                length = myInput.read(buffer);
            }
            myOutput.flush();
            myInput.close();
            myOutput.close();
        } catch (Exception e) {
            promise.reject(e);
        }
    }

    @ReactMethod
    public static void zipFile(String archive, String targetPath, Promise promise) throws IOException, FileNotFoundException, ZipException {
        try {
            org.apache.tools.zip.ZipOutputStream zipout = new org.apache.tools.zip.ZipOutputStream(new BufferedOutputStream(new FileOutputStream(
                    targetPath), BUFF_SIZE));
            zipout.setEncoding("GBK");
            Boolean result = true;
            File file = new File(archive);
            if (file.exists()) {
                zipFile(file, zipout, "");
            } else {
                result = false;
            }
            zipout.close();
            promise.resolve(result);
        } catch (Exception e) {
            promise.reject(e);
        }
    }

    @ReactMethod
    public static void zipFiles(ReadableArray archives, String targetPath, Promise promise) throws IOException, FileNotFoundException, ZipException {
        try {
            ZipOutputStream zipout = new ZipOutputStream(new BufferedOutputStream(new FileOutputStream(
                    targetPath), BUFF_SIZE));
            zipout.setEncoding("GBK");
            Boolean result = true;
            for (int i = 0; i < archives.size(); i++) {
                File file = new File(archives.getString(i));
                if (file.exists()) {
                    zipFile(file, zipout, "");
                } else {
                    result = false;
                    break;
                }
            }
            zipout.close();
            promise.resolve(result);
        } catch (Exception e) {
            promise.reject(e);
        }
    }

    @ReactMethod
    public static void unZipFile(String archive, String decompressDir, Promise promise) throws IOException, FileNotFoundException, ZipException {
        try {
            Boolean isUnZipped = FileTools.unZipFile(archive, decompressDir);
            promise.resolve(isUnZipped);
        } catch (Exception e) {
            promise.reject(e);
        }
    }


    @ReactMethod
    public static void deleteFile(String zippath, Promise promise) {
        try {
            File file = new File(zippath);
            boolean result = false;
            if (file.exists()) {
                result = file.delete();
            }
            promise.resolve(result);
        }catch (Exception e){
            promise.reject(e);
        }

    }

    @ReactMethod
    public static void copyFile(String fromPath, String toPath, Boolean override, Promise promise) {
        try {
            File toFile = new File(toPath);
            boolean result = toFile.exists();
            if (override || !result) {
                result = FileManager.getInstance().copy(fromPath, toPath);
            }
            promise.resolve(result);
        }catch (Exception e){
            promise.reject(e);
        }

    }

    //读文件
    @ReactMethod
    public static String readFile(String filePath, Promise promise){

        File file = new File(filePath);
        if(file.isFile() && file.exists()){
            try {
                FileInputStream fileInputStream = new FileInputStream(file);
                InputStreamReader inputStreamReader = new InputStreamReader(fileInputStream, "UTF-8");
                BufferedReader bufferedReader = new BufferedReader(inputStreamReader);

                StringBuffer sb = new StringBuffer();
                String text = null;
                while((text = bufferedReader.readLine()) != null){
                    sb.append(text);
                }
                promise.resolve(sb.toString());

            } catch (Exception e) {
                // TODO: handle exception
            }
        }
        return null;
    }


    /**
     * 以FileWriter方式写入txt文件。
     *
     */
    @ReactMethod
    public static void writeToFile(String filePath,String strJson, Promise promise){
        try {

            File file = new File(filePath);
            if(file.exists()){
                FileWriter fw = new FileWriter(file,false);
                BufferedWriter bw = new BufferedWriter(fw);
                bw.write(strJson);
                bw.close();
                fw.close();
                promise.resolve(true);
//                System.out.println("test1 done!");
            }

        } catch (Exception e) {
            // TODO: handle exception
        }
    }

    @ReactMethod
    public static void initUserDefaultData(String userName, Promise promise){
        try {
            Boolean isInit = FileTools.initUserDefaultData(userName, reactContext);
            promise.resolve(isInit);
        } catch (Exception e) {
            promise.reject(e);
        }
    }

    @ReactMethod
    public void fileIsExistInHomeDirectory(String path, Promise promise) {
        try {
            Boolean isExist = false;
            File file = new File(SDCARD + "/" + path);

            if (file.exists()) {
                isExist = true;
            }
            promise.resolve(isExist);
        } catch (Exception e) {
            promise.reject(e);
        }
    }

    private static void zipFile(File resFile, ZipOutputStream zipout, String rootpath)
            throws FileNotFoundException, IOException {
        rootpath = rootpath + (rootpath.trim().length() == 0 ? "" : File.separator)
                + resFile.getName();
        rootpath = new String(rootpath.getBytes("8859_1"), "GB2312");
        if (resFile.isDirectory()) {
            File[] fileList = resFile.listFiles();
            for (File file : fileList) {
                zipFile(file, zipout, rootpath);
            }
        } else {
            byte buffer[] = new byte[BUFF_SIZE];
            BufferedInputStream in = new BufferedInputStream(new FileInputStream(resFile),
                    BUFF_SIZE);
            zipout.putNextEntry(new ZipEntry(rootpath));
            int realLength;
            while ((realLength = in.read(buffer)) != -1) {
                zipout.write(buffer, 0, realLength);
            }
            in.close();
            zipout.flush();
            zipout.closeEntry();
        }
    }

    public static boolean unZipFile(String archive, String decompressDir) {
        boolean isUnZipped = false;
        try {
            BufferedInputStream bi;
//            String encodeType = getCharset(new File(archive));
            ZipFile zf = new ZipFile(archive, "GBK");
            Enumeration e = zf.getEntries();
            while (e.hasMoreElements()) {
                ZipEntry ze2 = (ZipEntry) e.nextElement();
                String entryName = ze2.getName();

                if (isMessyCode(entryName)) {
//                if (!(java.nio.charset.Charset.forName("GBK").newEncoder().canEncode(entryName))) {
                    entryName = new String(entryName.getBytes( "GBK" ), "UTF-8");
                }

                String path = decompressDir + "/" + entryName;
                if (ze2.isDirectory()) {
                    System.out.println("正在创建解压目录 - " + entryName);
                    File decompressDirFile = new File(path);
                    if (!decompressDirFile.exists()) {
                        decompressDirFile.mkdirs();
                    }
                } else {
                    System.out.println("正在创建解压文件 - " + entryName);
                    String fileDir = path.substring(0, path.lastIndexOf("/"));
                    File fileDirFile = new File(fileDir);
                    if (!fileDirFile.exists()) {
                        fileDirFile.mkdirs();
                    }
                    BufferedOutputStream bos = new BufferedOutputStream(new FileOutputStream(decompressDir + "/" + entryName));
                    bi = new BufferedInputStream(zf.getInputStream(ze2));
                    byte[] readContent = new byte[1024];
                    int readCount = bi.read(readContent);
                    while (readCount != -1) {
                        bos.write(readContent, 0, readCount);
                        readCount = bi.read(readContent);
                    }
                    bos.close();
                }
            }
            zf.close();
            isUnZipped = true;
            return isUnZipped;
        } catch (Exception e) {
            return isUnZipped;
        }
    }

    public static Boolean createDirectory(String path) {
        boolean result = false;
        File file = new File(path);

        if (!file.exists()) {
            result = file.mkdirs();
        } else {
            result = true;
        }
        return result;
    }

    public static Boolean initUserDefaultData(String userName, Context context) {
        userName = userName == null || userName.equals("") ? "Customer" : userName;

        // 初始化用户工作空间
        String downloadsPath = SDCARD + "/iTablet/User/" + userName + "/ExternalData/";
        String dataPath = SDCARD + "/iTablet/User/" + userName + "/Data/";
        String dataPath2 = SDCARD + "/iTablet/User/" + userName + "/Data/Scene/";
        String originName = "Customer.smwu";
        String originName2 = "OlympicGreen_android.zip";
        String wsName = "Workspace.smwu";
        String ssName = "OlympicGreen_android.zip";
        if (!Utils.fileIsExit(dataPath + wsName)) {
            Utils.copyAssetFileToSDcard(context.getApplicationContext(), dataPath, originName, wsName);
        }
        if (!Utils.fileIsExit(dataPath2 + ssName)) {
            Utils.copyAssetFileToSDcard(context.getApplicationContext(), dataPath2, originName2, ssName);
            Decompressor.UnZipFolder(dataPath2 + originName2, dataPath2);
            Utils.deleteFile(dataPath2 + originName2);
        }

        //创建用户目录
        createDirectory(dataPath + "Attribute");
        createDirectory(dataPath + "Datasource");
        createDirectory(dataPath + "Scene");
        createDirectory(dataPath + "Symbol");
        createDirectory(dataPath + "Template");
        createDirectory(dataPath + "Workspace");
        createDirectory(dataPath + "Temp");
        createDirectory(downloadsPath);

        // 初始化用户数据
        String commonPath = SDCARD + "/iTablet/Common/";
        String commonZipPath = commonPath + "Template.zip";
        String defaultZipData = "Template.zip";
        String templatePath = downloadsPath;
        String templateFilePath = templatePath + "地理国情普查";

        Boolean isUnZip;
        if (!Utils.fileIsExit(templatePath) || !Utils.fileIsExit(templateFilePath)) {
            if (Utils.fileIsExit(commonZipPath)) {
                isUnZip = FileTools.unZipFile(commonZipPath, templatePath);
                System.out.print(isUnZip ? "解压数据成功" : "解压数据失败");
            } else {
                Utils.copyAssetFileToSDcard(context.getApplicationContext(), commonPath, defaultZipData);
                isUnZip = FileTools.unZipFile(commonZipPath, templatePath);
                System.out.print(isUnZip ? "解压数据成功" : "解压数据失败");
            }
        } else {
            isUnZip = true;
        }

        return isUnZip;
    }

    /**
     * 判断文件编码
     * @param file
     * @return
     */
    static public String getCharset(File file) {
        String charset = "GBK";
        byte[] first3Bytes = new byte[3];
        try {
            boolean checked = false;
            BufferedInputStream bis = new BufferedInputStream(
                    new FileInputStream(file));
            bis.mark(0);
            int read = bis.read(first3Bytes, 0, 3);
            if (read == -1)
                return charset;
            if (first3Bytes[0] == (byte) 0xFF && first3Bytes[1] == (byte) 0xFE) {
                charset = "UTF-16LE";
                checked = true;
            } else if (first3Bytes[0] == (byte) 0xFE
                    && first3Bytes[1] == (byte) 0xFF) {
                charset = "UTF-16BE";
                checked = true;
            } else if (first3Bytes[0] == (byte) 0xEF
                    && first3Bytes[1] == (byte) 0xBB
                    && first3Bytes[2] == (byte) 0xBF) {
                charset = "UTF-8";
                checked = true;
            }
            bis.reset();
            if (!checked) {
                int loc = 0;
                while ((read = bis.read()) != -1) {
                    loc++;
                    if (read >= 0xF0)
                        break;
                    if (0x80 <= read && read <= 0xBF)
                        break;
                    if (0xC0 <= read && read <= 0xDF) {
                        read = bis.read();
                        if (0x80 <= read && read <= 0xBF)
                            continue;
                        else
                            break;
                    } else if (0xE0 <= read && read <= 0xEF) {
                        read = bis.read();
                        if (0x80 <= read && read <= 0xBF) {
                            read = bis.read();
                            if (0x80 <= read && read <= 0xBF) {
                                charset = "UTF-8";
                                break;
                            } else
                                break;
                        } else
                            break;
                    }
                }
            }
            bis.close();
        } catch (Exception e) {
            e.printStackTrace();
        }
        return charset;
    }

    /**
     * 判断字符串是否是乱码
     *
     * @param strName 字符串
     * @return 是否是乱码
     */
    public static boolean isMessyCode(String strName) {
        try {
            Pattern p = Pattern.compile("\\s*|\t*|\r*|\n*");
            Matcher m = p.matcher(strName);
            String after = m.replaceAll("");
            String temp = after.replaceAll("\\p{P}", "");
            char[] ch = temp.trim().toCharArray();

            int length = (ch != null) ? ch.length : 0;
            for (int i = 0; i < length; i++) {
                char c = ch[i];
                if (!Character.isLetterOrDigit(c)) {
                    String str = "" + ch[i];
                    if (!str.matches("[\u4e00-\u9fa5]|[ _`~!@#$%^&*()+=|{}':;',\\[\\].<>/?~！@#￥%……&*（）——+|{}【】‘；：”“’。，、？]|\n|\r|\t+")) {
                        return true;
                    }
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

        return false;

    }
}


package com.supermap.itablet;

import android.support.multidex.MultiDexApplication;

import com.supermap.imb.lic.LicConfig;
import com.facebook.react.ReactApplication;
import org.devio.rn.splashscreen.SplashScreenReactPackage;
import com.github.yamill.orientation.OrientationPackage;
import com.rnfs.RNFSPackage;
import com.supermap.SupermapFullPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends MultiDexApplication implements ReactApplication {
    public static String SDCARD = android.os.Environment.getExternalStorageDirectory().getAbsolutePath() + "/";
    private static MainApplication sInstance = null;
    private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
        @Override
        public boolean getUseDeveloperSupport() {
            return BuildConfig.DEBUG;
        }

        @Override
        protected List<ReactPackage> getPackages() {
            return Arrays.<ReactPackage>asList(
                    new MainReactPackage(),
            new OrientationPackage(),
            new RNFSPackage(),
            new SplashScreenReactPackage(),
                    new SupermapFullPackage(),
                    new MyReactpackge()

            );
        }

        @Override
        protected String getJSMainModuleName() {
            return "index";
        }
    };

    @Override
    public ReactNativeHost getReactNativeHost() {
        return mReactNativeHost;
    }

    public static MainApplication getInstance() {
        return sInstance;
    }

    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new SupermapFullPackage(),
              new MyReactpackge(),
              new OrientationPackage()
      );
    }

    @Override
    public void onCreate() {
        super.onCreate();
        sInstance = this;
        LicConfig.configLic(this);
        SoLoader.init(this, /* native exopackage */ false);
    }

}

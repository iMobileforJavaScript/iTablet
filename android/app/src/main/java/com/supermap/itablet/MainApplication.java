package com.supermap.itablet;

import android.support.multidex.MultiDexApplication;

import com.supermap.file.CrashHandler;
import com.facebook.react.ReactApplication;
import com.psykar.cookiemanager.CookieManagerPackage;
import fr.bamlab.rnimageresizer.ImageResizerPackage;
import com.reactnative.photoview.PhotoViewPackage;
import com.beefe.picker.PickerViewPackage;
import com.swmansion.gesturehandler.react.RNGestureHandlerPackage;
import ca.jaysoo.extradimensions.ExtraDimensionsPackage;
import com.ocetnik.timer.BackgroundTimerPackage;
import org.reactnative.camera.RNCameraPackage;
import cn.jpush.reactnativejpush.JPushPackage;
import com.brentvatne.react.ReactVideoPackage;
import com.rt2zz.reactnativecontacts.ReactNativeContacts;
import com.reactnative.ivpusic.imagepicker.PickerPackage;
import com.rnfs.RNFSPackage;
import cn.qiuxiang.react.geolocation.AMapGeolocationPackage;
import org.devio.rn.splashscreen.SplashScreenReactPackage;
import com.github.yamill.orientation.OrientationPackage;
import com.supermap.SupermapFullPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import com.supermap.rnsupermap.BuildConfig;

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
            new CookieManagerPackage(),
            new ImageResizerPackage(),
            new PhotoViewPackage(),
            new PickerViewPackage(),
            new RNGestureHandlerPackage(),
            new ExtraDimensionsPackage(),
            new BackgroundTimerPackage(),
            new RNCameraPackage(),
            new JPushPackage(!BuildConfig.DEBUG, !BuildConfig.DEBUG),
            new ReactVideoPackage(),
            new JPushPackage(!BuildConfig.DEBUG, !BuildConfig.DEBUG),
            new PickerPackage(),
            new RNFSPackage(),
            new JPushPackage(true, true),
            new ReactNativeContacts(),
            new AMapGeolocationPackage(),
            new OrientationPackage(),
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
        SoLoader.init(this, /* native exopackage */ false);
        CrashHandler.getInstance().init(getApplicationContext());
    }

}

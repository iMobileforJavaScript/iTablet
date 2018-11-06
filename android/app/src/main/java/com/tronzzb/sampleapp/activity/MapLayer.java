package com.tronzzb.sampleapp.activity;

import android.os.Bundle;
import android.support.v4.app.FragmentTransaction;
import android.support.v7.app.AppCompatActivity;
import android.view.KeyEvent;
import android.view.View;
import android.widget.LinearLayout;
import android.widget.Toast;
import com.supermap.data.*;
import com.supermap.itablet.R;
import com.supermap.mapping.Map;
import com.supermap.mapping.MapView;
import com.tronzzb.sampleapp.fragment.*;

public class MapLayer extends AppCompatActivity implements View.OnClickListener {

    private MapView mapView;

    private LinearLayout ll_layer_menu = null;

    private SymbolMarkerFragment symbolMarkerFragment = null;
    private SymbolLineFragment symbolLineFragment = null;
    private SymbolFillFragment symbolFillFragment = null;
    private GridStyleFragment gridStyleFragment = null;
    private TextStyleFragment textStyleFragment = null;

    private LinearLayout ll_bottom_menu;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        Environment.setLicensePath(android.os.Environment.getExternalStorageDirectory().getAbsolutePath() + "/SuperMap/License");
        Environment.setOpenGLMode(true);
        Environment.initialization(this);

        setContentView(R.layout.activity_layer);

        init();

        openWorkspace();
    }

    private void init() {
        ll_layer_menu = findViewById(R.id.ll_layer_menu);
        ll_bottom_menu = findViewById(R.id.bottom_menu);

        findViewById(R.id.btn_symbol_mark).setOnClickListener(this);
        findViewById(R.id.btn_symbol_line).setOnClickListener(this);
        findViewById(R.id.btn_symbol_fill).setOnClickListener(this);
        findViewById(R.id.btn_grid_style).setOnClickListener(this);
        findViewById(R.id.btn_text_style).setOnClickListener(this);

        findViewById(R.id.btn_map).setOnClickListener(this);
        findViewById(R.id.btn_maplayer).setOnClickListener(this);
        findViewById(R.id.btn_attr).setOnClickListener(this);
        findViewById(R.id.btn_setting).setOnClickListener(this);

    }

    /**
     * 打开工作空间，显示地图
     */
    private void openWorkspace() {
//        final String dataPath = android.os.Environment.getExternalStorageDirectory().getAbsolutePath() + "/SampleData/Beijing/beijing.smwu";
//        final String dataPath = android.os.Environment.getExternalStorageDirectory().getAbsolutePath() + "/SampleData/City/Changchun.smwu";
        final String dataPath = android.os.Environment.getExternalStorageDirectory().getAbsolutePath() + "/SampleData/Jingjin/Jingjin.smwu";
        Workspace workspace = new Workspace();
        WorkspaceConnectionInfo info = new WorkspaceConnectionInfo();
        info.setServer(dataPath);
        info.setType(WorkspaceType.SMWU);
        boolean isOpen = workspace.open(info);
        if (!isOpen) {
            return;
        }
        mapView = (MapView) findViewById(R.id.mapView);
        Map map = mapView.getMapControl().getMap();
        map.setWorkspace(workspace);
        map.open(workspace.getMaps().get(0));
        map.setViewBounds(map.getBounds());

//        Layer layer = map.getLayers().get(3);
//        layer.setVisible(false);

        map.refresh();
    }

    @Override
    public void onClick(View v) {
        switch (v.getId()) {
            case R.id.btn_symbol_mark:
                //点
                hideLayerMenu();
                ll_bottom_menu.setVisibility(View.GONE);
                showSymbolMarkerFragment();

                break;
            case R.id.btn_symbol_line:
                //线
                hideLayerMenu();
                ll_bottom_menu.setVisibility(View.GONE);
                showSymbolLineFragment();

                break;
            case R.id.btn_symbol_fill:
                //面
                hideLayerMenu();
                ll_bottom_menu.setVisibility(View.GONE);
                showSymbolFillFragment();

                break;
            case R.id.btn_grid_style:
                //栅格
                hideLayerMenu();
                ll_bottom_menu.setVisibility(View.GONE);
                showGridStyleFragment();

                break;
            case R.id.btn_text_style:
                //文本
                hideLayerMenu();
                ll_bottom_menu.setVisibility(View.GONE);
                showTextStyleFragment();

                break;
            case R.id.btn_map:


                break;
            case R.id.btn_maplayer:
                showOrHideLayerMenu();

                break;
            case R.id.btn_attr:


                break;
            case R.id.btn_setting:


                break;
        }
    }

    private void showOrHideLayerMenu() {
        if (ll_layer_menu.getVisibility() == View.VISIBLE) {
            hideLayerMenu();
        } else {
            showLayerMenu();
        }
    }

    private void showLayerMenu() {
        ll_layer_menu.setVisibility(View.VISIBLE);
    }

    private void hideLayerMenu() {
        ll_layer_menu.setVisibility(View.GONE);
    }

    public void showBottomMenu() {
        ll_bottom_menu.setVisibility(View.VISIBLE);
    }

    private void lockMap() {
        //不让地图滑动
        Map map = mapView.getMapControl().getMap();
        Rectangle2D viewBounds = map.getViewBounds();
        map.setLockedViewBounds(viewBounds);
        map.setViewBoundsLocked(true);
    }

    private void showSymbolMarkerFragment() {
        lockMap();
        FragmentTransaction fragmentTransaction = getSupportFragmentManager().beginTransaction();

        if (symbolMarkerFragment == null) {
            symbolMarkerFragment = new SymbolMarkerFragment();
            symbolMarkerFragment.setMapView(mapView);

            fragmentTransaction.add(R.id.container, symbolMarkerFragment, "symbolMarkerFragment");
        }

        hideAllFragment(fragmentTransaction);

        fragmentTransaction
                .show(symbolMarkerFragment)
                .commit();
    }

    private void showSymbolLineFragment() {
        lockMap();

        FragmentTransaction fragmentTransaction = getSupportFragmentManager().beginTransaction();

        if (symbolLineFragment == null) {
            symbolLineFragment = new SymbolLineFragment();
            symbolLineFragment.setMapView(mapView);

            fragmentTransaction.add(R.id.container, symbolLineFragment, "symbolLineFragment");
        }

        hideAllFragment(fragmentTransaction);

        fragmentTransaction
                .show(symbolLineFragment)
                .commit();
    }

    private void showSymbolFillFragment() {
        lockMap();

        FragmentTransaction fragmentTransaction = getSupportFragmentManager().beginTransaction();

        if (symbolFillFragment == null) {
            symbolFillFragment = new SymbolFillFragment();
            symbolFillFragment.setMapView(mapView);

            fragmentTransaction.add(R.id.container, symbolFillFragment, "symbolFillFragment");
        }

        hideAllFragment(fragmentTransaction);

        fragmentTransaction
                .show(symbolFillFragment)
                .commit();
    }

    private void showGridStyleFragment() {
        lockMap();

        FragmentTransaction fragmentTransaction = getSupportFragmentManager().beginTransaction();

        if (gridStyleFragment == null) {
            gridStyleFragment = new GridStyleFragment();
            gridStyleFragment.setMapView(mapView);

            fragmentTransaction.add(R.id.container, gridStyleFragment, "gridStyleFragment");
        }

        hideAllFragment(fragmentTransaction);

        fragmentTransaction
                .show(gridStyleFragment)
                .commit();
    }

    private void showTextStyleFragment() {
        lockMap();

        FragmentTransaction fragmentTransaction = getSupportFragmentManager().beginTransaction();

        if (textStyleFragment == null) {
            textStyleFragment = new TextStyleFragment();
            textStyleFragment.setMapView(mapView);

            fragmentTransaction.add(R.id.container, textStyleFragment, "textStyleFragment");
        }

        hideAllFragment(fragmentTransaction);

        fragmentTransaction
                .show(textStyleFragment)
                .commit();
    }

    private void hideAllFragment(FragmentTransaction fragmentTransaction) {
        if (symbolLineFragment != null) {
            fragmentTransaction.hide(symbolLineFragment);
        }

        if (symbolMarkerFragment != null) {
            fragmentTransaction.hide(symbolMarkerFragment);
        }

        if (symbolFillFragment != null) {
            fragmentTransaction.hide(symbolFillFragment);
        }

        if (gridStyleFragment != null) {
            fragmentTransaction.hide(gridStyleFragment);
        }

        if (textStyleFragment != null) {
            fragmentTransaction.hide(textStyleFragment);
        }
    }

    //记录用户首次点击返回键的时间
    private long firstTime = 0;

    /**
     * 监听keyUp
     */
    @Override
    public boolean onKeyUp(int keyCode, KeyEvent event) {
        if (keyCode == KeyEvent.KEYCODE_BACK && event.getAction() == KeyEvent.ACTION_UP) {
            long secondTime = System.currentTimeMillis();
            if (secondTime - firstTime > 2000) {
                Toast.makeText(MapLayer.this, "再按一次退出程序", Toast.LENGTH_SHORT).show();
                firstTime = secondTime;
                return true;
            } else {
                finish();
            }
        }

        return super.onKeyUp(keyCode, event);
    }

}

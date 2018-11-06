package com.tronzzb.sampleapp.fragment;

import android.content.Context;
import android.graphics.Color;
import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.support.v4.app.FragmentManager;
import android.support.v4.app.FragmentTransaction;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.*;
import com.supermap.data.*;
import com.supermap.mapping.*;
import com.supermap.itablet.R;
import com.tronzzb.sampleapp.activity.MapLayer;
import com.tronzzb.sampleapp.adapter.ColorInfo;
import com.tronzzb.sampleapp.adapter.ColorInfoAdapter;
import com.tronzzb.sampleapp.adapter.MakerGridViewAdapter;
import com.tronzzb.sampleapp.scrollermenu.HorizontalListView;
import com.tronzzb.sampleapp.scrollermenu.ScrollerMenu;
import com.tronzzb.sampleapp.seekbar.BubbleSeekBar;

import java.util.ArrayList;

/**
 * 点风格(专题图)
 */
public class SymbolMarkerFragment extends Fragment implements ScrollerMenu.ScrollerMenuListener, View.OnClickListener {
    private static final String TAG = "SymbolMarkerFragment";

    private static final String KEY_BUNDLE_PROGRESS = "KEY_BUNDLE_PROGRESS";
    private static final String KEY_BUNDLE_SELECTED_MENU_INDEX = "KEY_BUNDLE_SELECTED_MENU_INDEX";
    private static int PROGRESS_MAX = 100;
    private static int PROGRESS_MIN = 0;

    private TextView selectedMenu;
    private TextView progressText;
    private int progress;
    private ScrollerMenu scrollerMenu;

    private LinearLayout linearLayoutMenu;

    private ImageButton samples;

    private BubbleSeekBar seekbar = null;
    private LinearLayout ll_show_progress = null;

    private GridView gridView;
    private MakerGridViewAdapter makerGridViewAdapter;

    private HorizontalListView horizontalListView;

    private ArrayList<ColorInfo> mColorInfos = new ArrayList<>();

    private String[] menuItems = new String[]{
            "点符号","大小", "颜色", "旋转角度", "透明度"
    };

    private int MarkerSymbolID = 0;
    private int MarkerSize = 0;
    private String MarkerColor = "无";
    private int MarkerAngle = 0;
    private int MarkerAlpha = 0;

    private String[] menuProgress = new String[]{
            "" + MarkerSymbolID,
            "" + MarkerSize + "mm",
            "" + MarkerColor,
            "" + MarkerAngle + "°",
            "" + MarkerAlpha + "%"
    };

    private int mLastPosition = -1;

    //当前选择的菜单项
    private int selectedItem = 0;

    public SymbolMarkerFragment() {
    }

    private MapView mapView = null;
    private int currentLayer = 0;

    public void setMapView(MapView mapView) {
        this.mapView = mapView;
    }

    private Context mContext = null;

    @Override
    public void onAttach(Context context) {
        super.onAttach(context);
        mContext = getActivity();
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        View rootView = inflater.inflate(R.layout.fragment_symbol_maker, container, false);
        initView(rootView);

        initListening(rootView);

        initScrollerMenu(savedInstanceState);

        initGridView(rootView);

        initSeekBar(rootView);

        initHorizontalListView(rootView);

        return rootView;
    }

    private void initView(View rootView) {
        selectedMenu = (TextView) rootView.findViewById(R.id.fragment_image_holder_selected_menu);
        progressText = (TextView) rootView.findViewById(R.id.fragment_image_holder_progress);
        scrollerMenu = (ScrollerMenu) rootView.findViewById(R.id.scroller_menu);

        linearLayoutMenu = rootView.findViewById(R.id.ll_menu);
        setLayoutTransition();

        samples = rootView.findViewById(R.id.samples);
    }

    private void initListening(View rootView) {
        rootView.findViewById(R.id.menu_show_hide).setOnClickListener(this);
        rootView.findViewById(R.id.samples).setOnClickListener(this);
        rootView.findViewById(R.id.btn_cancel).setOnClickListener(this);
        rootView.findViewById(R.id.save).setOnClickListener(this);
    }

    private void initScrollerMenu(Bundle savedInstanceState) {
        int menuItemIndex = 0;
        if (savedInstanceState != null) {
            progress = savedInstanceState.getInt(KEY_BUNDLE_PROGRESS);
            menuItemIndex = savedInstanceState.getInt(KEY_BUNDLE_SELECTED_MENU_INDEX);
        }
        scrollerMenu.setSelectedMenuItem(menuItemIndex);
        progressText.setText(String.valueOf(progress));
        selectedMenu.setText(menuItems[menuItemIndex]);

        scrollerMenu.setMenuItems(menuItems);
        scrollerMenu.setMenuProgress(menuProgress);

        scrollerMenu.setMenuListener(this);

        scrollerMenu.setMapView(mapView);
    }

    private void initHorizontalListView(View rootView) {
        horizontalListView = rootView.findViewById(R.id.horizontal_listview);
        setupColorInfoLists();
    }

    private void initGridView(View rootView) {
        gridView = rootView.findViewById(R.id.gridview);

        makerGridViewAdapter = new MakerGridViewAdapter(mapView, mContext);
        gridView.setAdapter(makerGridViewAdapter);

        //设置点符号的监听
        gridView.setOnItemClickListener(gridViweOnItemClickListening);
    }

    private AdapterView.OnItemClickListener gridViweOnItemClickListening = new AdapterView.OnItemClickListener() {
        @Override
        public void onItemClick(AdapterView<?> parent, View view, int position, long id) {
            Workspace workspace;
            try {
                workspace = mapView.getMapControl().getMap().getWorkspace();
            } catch (Exception e) {
                e.printStackTrace();
                return;
            }
            if (workspace == null) {
                return;
            }
            Resources m_resources = workspace.getResources();

            SymbolMarkerLibrary symbol_M = m_resources.getMarkerLibrary();
            SymbolGroup Group_M = symbol_M.getRootGroup();
            Symbol symbol = Group_M.get(position);

            if (symbol != null) {
                setMakerSymbolID(symbol.getID());
            }
        }
    };

    //设置点符号的ID
    private void setMakerSymbolID(int makerSymbolID) {
        Layers layers = mapView.getMapControl().getMap().getLayers();
        Layer layer = layers.get(currentLayer);
        if (layer != null && layer.getTheme() == null) {
            layer.setEditable(true);

            if (layer.getAdditionalSetting() != null) {
                LayerSettingVector layerSettingVector = (LayerSettingVector) layer.getAdditionalSetting();
                if (layerSettingVector != null) {
                    GeoStyle style = layerSettingVector.getStyle();
                    style.setMarkerSymbolID(makerSymbolID);
                    layerSettingVector.setStyle(style);
                    mapView.getMapControl().getMap().refresh();

                    MarkerSymbolID = makerSymbolID;
                    menuProgress[0] = "" + MarkerSymbolID;

                    progressText.setText(menuProgress[0]);
                    scrollerMenu.setMenuProgress(menuProgress);

                }
            }

        } else {
            // 专题图
            Log.e(TAG, "专题图");
        }

    }

    // 设置点符号的大小：1-100mm
    private void setMarkerSize(int mm) {
        Layers layers = mapView.getMapControl().getMap().getLayers();
        Layer layer = layers.get(currentLayer);
        if (layer != null && layer.getTheme() == null) {
            layer.setEditable(true);

            if (layer.getAdditionalSetting() != null) {
                LayerSettingVector layerSettingVector = (LayerSettingVector) layer.getAdditionalSetting();
                if (layerSettingVector != null) {
                    GeoStyle style = layerSettingVector.getStyle();
                    style.setMarkerSize(new Size2D(mm, mm));
                    layerSettingVector.setStyle(style);
                    mapView.getMapControl().getMap().refresh();

                    MarkerSize = mm;
                    menuProgress[1] = "" + MarkerSize + "mm";

                    progressText.setText(menuProgress[1]);
                    scrollerMenu.setMenuProgress(menuProgress);

                }
            }

        } else {
            // 专题图
            Log.e(TAG, "专题图");
        }

    }

    // 设置点符号的颜色
    private void setMarkerColor(String color) {
        Layers layers = mapView.getMapControl().getMap().getLayers();
        Layer layer = layers.get(currentLayer);
        if (layer != null && layer.getTheme() == null) {
            layer.setEditable(true);

            int parseColor = Color.parseColor(color);
            int[] rgb = getRGB(parseColor);
            com.supermap.data.Color makerColor = new com.supermap.data.Color(rgb[0], rgb[1], rgb[2]);


            if (layer.getAdditionalSetting() != null) {
                LayerSettingVector layerSettingVector = (LayerSettingVector) layer.getAdditionalSetting();
                if (layerSettingVector != null) {
                    GeoStyle style = layerSettingVector.getStyle();
                    //设置颜色
                    style.setLineColor(makerColor);
                    layerSettingVector.setStyle(style);
                    mapView.getMapControl().getMap().refresh();

                    MarkerColor = color;
                    menuProgress[2] = "" + MarkerColor;

                    progressText.setText(menuProgress[2]);
                    scrollerMenu.setMenuProgress(menuProgress);

                }
            }

        } else {
            // 专题图
            Log.e(TAG, "专题图");
        }

    }

    private int[] getRGB(int color) {
        int[] rgb = new int[3];

        int r = ( color & 0xff0000 ) >> 16;
        int g = ( color & 0xff00 ) >> 8;
        int b = color & 0xff;

        rgb[0] = r;
        rgb[1] = g;
        rgb[2] = b;

        return rgb;
    }

    // 设置点符号的旋转角度：0-360°
    private void setMarkerAngle(int angle) {
        Layers layers = mapView.getMapControl().getMap().getLayers();
        Layer layer = layers.get(currentLayer);
        if (layer != null && layer.getTheme() == null) {
            layer.setEditable(true);

            if (layer.getAdditionalSetting() != null) {
                LayerSettingVector layerSettingVector = (LayerSettingVector) layer.getAdditionalSetting();
                if (layerSettingVector != null) {
                    GeoStyle style = layerSettingVector.getStyle();
                    style.setMarkerAngle(angle);
                    layerSettingVector.setStyle(style);
                    mapView.getMapControl().getMap().refresh();

                    MarkerAngle = angle;
                    menuProgress[3] = "" + MarkerAngle + "°";

                    progressText.setText(menuProgress[3]);
                    scrollerMenu.setMenuProgress(menuProgress);

                }
            }

        } else {
            // 专题图
            Log.e(TAG, "专题图");
        }

    }

    // 设置点符号的透明度：1-100%
    private void setMarkerAlpha(int alpha) {
        Layers layers = mapView.getMapControl().getMap().getLayers();
        Layer layer = layers.get(currentLayer);
        if (layer != null && layer.getTheme() == null) {
            layer.setEditable(true);

            if (layer.getAdditionalSetting() != null) {
                LayerSettingVector layerSettingVector = (LayerSettingVector) layer.getAdditionalSetting();
                if (layerSettingVector != null) {
                    GeoStyle style = layerSettingVector.getStyle();
                    //设置透明度
                    style.setFillOpaqueRate(100 - alpha);
                    layerSettingVector.setStyle(style);
                    mapView.getMapControl().getMap().refresh();

                    MarkerAlpha = alpha;
                    menuProgress[4] = "" + MarkerAlpha + "%";

                    progressText.setText(menuProgress[4]);
                    scrollerMenu.setMenuProgress(menuProgress);

                }
            }

        } else {
            // 专题图
            Log.e(TAG, "专题图");
        }

    }

    private void showSeekBar() {
        seekbar.setVisibility(View.VISIBLE);
    }

    private void hideSeekBar() {
        seekbar.setVisibility(View.GONE);
    }

    private boolean isSeekBarTouched = false;

    private void initSeekBar(View rootView) {
        seekbar = rootView.findViewById(R.id.seekbar);
        ll_show_progress = rootView.findViewById(R.id.ll_show_progress);

        setSeekBar(0, 100);

        seekbar.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
//                Log.e(TAG, "seekBar:OnClick");
                isSeekBarTouched = true;
            }
        });

        seekbar.setOnProgressChangedListener(new BubbleSeekBar.OnProgressChangedListener() {
            @Override
            public void onProgressChanged(BubbleSeekBar bubbleSeekBar, int progressedBy, float progressFloat, boolean fromUser) {
//              Log.e(TAG, "onProgressChanged");

                scrollerMenu.hide();

                if (!isSeekBarTouched) {
                    //由滑动屏幕引起的变更不需要再重复设置
//                    Log.e(TAG, "onProgressChanged：!isSeekBarTouched");
                    return;
                }

                if (selectedItem == 0) {
                    //点符号
                }
                else if (selectedItem == 1) {
                    //大小
                    setMarkerSize(progressedBy);
                }
                else if (selectedItem == 2) {
                    //颜色
                }
                else if (selectedItem == 3) {
                    //旋转角度
                    setMarkerAngle(progressedBy);
                }
                else if (selectedItem == 4) {
                    //透明度
                    setMarkerAlpha(progressedBy);
                }
            }

            @Override
            public void getProgressOnActionUp(BubbleSeekBar bubbleSeekBar, int progressedBy, float progressFloat) {
//                Log.e(TAG, "getProgressOnActionUp");
                isSeekBarTouched = false;
                progress = progressedBy;
            }

            @Override
            public void getProgressOnFinally(BubbleSeekBar bubbleSeekBar, int progressedBy, float progressFloat, boolean fromUser) {
//                Log.e(TAG, "getProgressOnFinally");
            }
        });
    }

    //设置SeekBar的范围及默认值
    private void setSeekBar(int minProgress, int maxProgress) {
        PROGRESS_MIN = minProgress;
        PROGRESS_MAX = maxProgress;

        seekbar.getConfigBuilder()
                .min(minProgress)
                .max(maxProgress)
                .progress(minProgress)
                .build();
    }

    private void addColorInfos() {
        mColorInfos.add(new ColorInfo(false, "#000000"));
        mColorInfos.add(new ColorInfo(false, "#424242"));
        mColorInfos.add(new ColorInfo(false, "#757575"));
        mColorInfos.add(new ColorInfo(false, "#BDBDBD"));
        mColorInfos.add(new ColorInfo(false, "#EEEEEE"));
        mColorInfos.add(new ColorInfo(false, "#FFFFFF"));
        mColorInfos.add(new ColorInfo(false, "#3E2723"));
        mColorInfos.add(new ColorInfo(false, "#5D4037"));
        mColorInfos.add(new ColorInfo(false, "#A1887F"));
        mColorInfos.add(new ColorInfo(false, "#D7CCC8"));
        mColorInfos.add(new ColorInfo(false, "#263238"));
        mColorInfos.add(new ColorInfo(false, "#546E7A"));
        mColorInfos.add(new ColorInfo(false, "#90A4AE"));
        mColorInfos.add(new ColorInfo(false, "#CFD8DC"));
        mColorInfos.add(new ColorInfo(false, "#FFECB3"));
        mColorInfos.add(new ColorInfo(false, "#FFF9C4"));
        mColorInfos.add(new ColorInfo(false, "#F1F8E9"));
        mColorInfos.add(new ColorInfo(false, "#E3F2FD"));
        mColorInfos.add(new ColorInfo(false, "#EDE7F6"));
        mColorInfos.add(new ColorInfo(false, "#FCE4EC"));
        mColorInfos.add(new ColorInfo(false, "#FBE9E7"));
        mColorInfos.add(new ColorInfo(false, "#004D40"));
        mColorInfos.add(new ColorInfo(false, "#006064"));
        mColorInfos.add(new ColorInfo(false, "#009688"));
        mColorInfos.add(new ColorInfo(false, "#8BC34A"));
        mColorInfos.add(new ColorInfo(false, "#A5D6A7"));
        mColorInfos.add(new ColorInfo(false, "#80CBC4"));
        mColorInfos.add(new ColorInfo(false, "#80DEEA"));
        mColorInfos.add(new ColorInfo(false, "#A1C2FA"));
        mColorInfos.add(new ColorInfo(false, "#9FA8DA"));
        mColorInfos.add(new ColorInfo(false, "#01579B"));
        mColorInfos.add(new ColorInfo(false, "#1A237E"));
        mColorInfos.add(new ColorInfo(false, "#3F51B5"));
        mColorInfos.add(new ColorInfo(false, "#03A9F4"));
        mColorInfos.add(new ColorInfo(false, "#4A148C"));
        mColorInfos.add(new ColorInfo(false, "#673AB7"));
        mColorInfos.add(new ColorInfo(false, "#9C27B0"));
        mColorInfos.add(new ColorInfo(false, "#880E4F"));
        mColorInfos.add(new ColorInfo(false, "#E91E63"));
        mColorInfos.add(new ColorInfo(false, "#F44336"));
        mColorInfos.add(new ColorInfo(false, "#F48FB1"));
        mColorInfos.add(new ColorInfo(false, "#EF9A9A"));
        mColorInfos.add(new ColorInfo(false, "#F57F17"));
        mColorInfos.add(new ColorInfo(false, "#F4B400"));
        mColorInfos.add(new ColorInfo(false, "#FADA80"));
        mColorInfos.add(new ColorInfo(false, "#FFF59D"));
        mColorInfos.add(new ColorInfo(false, "#FFEB3B"));
    }

    private void setupColorInfoLists() {
        addColorInfos();

        // Make an array colorInfoAdapter using the built in android layout to render a list of strings
        final ColorInfoAdapter adapter = new ColorInfoAdapter(mContext, mColorInfos);

        // Assign colorInfoAdapter to HorizontalListView
        horizontalListView.setAdapter(adapter);

        horizontalListView.setOnItemClickListener(new AdapterView.OnItemClickListener() {
            @Override
            public void onItemClick(AdapterView<?> parent, View view, int position, long id) {
               setMarkerColor(mColorInfos.get(position).getColor());

               if (mLastPosition != position) {
                   for (int i = 0; i < mColorInfos.size(); i++) {
                       if (i == position) {
                           mColorInfos.get(i).setSelected(true);
                       } else {
                           mColorInfos.get(i).setSelected(false);
                       }
                   }
                   adapter.notifyDataSetChanged();

                   mLastPosition = position;
               }
            }
        });
    }

    @Override
    public void onMenuItemSelected(String[] menuItems, int index) {
//        Log.e(TAG, "onMenuItemSelected");
        //只有地图响应双指手势
        if (scrollerMenu.isDoubleTouch()) {
            return;
        }

        selectedItem = index;

        if (selectedItem == 0) {
            //点符号
            chooseMenuMarkerSymbolID();
        }
        else if (selectedItem == 1) {
            //大小
            chooseMenuMarkerSize();
        }
        else if (selectedItem == 2) {
            //颜色
            chooseMenuMarkerColor();
        }
        else if (selectedItem == 3) {
            //旋转角度
            chooseMenuMarkerAngle();
        }
        else if (selectedItem == 4) {
            //透明度
            chooseMenuMarkerAlpha();
        }

    }

    //选择透明度菜单
    private void chooseMenuMarkerAlpha() {
        gridView.setVisibility(View.GONE);
        horizontalListView.setVisibility(View.GONE);
        samples.setVisibility(View.GONE);

        selectedMenu.setText(menuItems[4]);
        progressText.setText(menuProgress[4]);

        setSeekBar(0,100);
        showSeekBar();

        String str = menuProgress[4];
        String sub;
        try {
            sub = str.substring(0, str.length() - 1);
            progress = Integer.parseInt(sub);
            seekbar.setProgress(progress);
        } catch (Exception e) {
            e.printStackTrace();
            seekbar.setProgress(0);
        }
    }

    //选择旋转角度菜单
    private void chooseMenuMarkerAngle() {
        gridView.setVisibility(View.GONE);
        horizontalListView.setVisibility(View.GONE);
        samples.setVisibility(View.GONE);

        selectedMenu.setText(menuItems[3]);
        progressText.setText(menuProgress[3]);

        setSeekBar(0,360);
        showSeekBar();

        String str = menuProgress[3];
        String sub;
        try {
            sub = str.substring(0,str.length() - 1);
            progress = Integer.parseInt(sub);
            seekbar.setProgress(progress);
        } catch (Exception e) {
            e.printStackTrace();
            seekbar.setProgress(0);
        }
    }

    //选择颜色菜单
    private void chooseMenuMarkerColor() {
        hideSeekBar();
        gridView.setVisibility(View.GONE);
        horizontalListView.setVisibility(View.VISIBLE);
        samples.setVisibility(View.VISIBLE);

        selectedMenu.setText(menuItems[2]);
        progressText.setText(menuProgress[2]);
    }

    //选择大小菜单
    private void chooseMenuMarkerSize() {
        gridView.setVisibility(View.GONE);
        horizontalListView.setVisibility(View.GONE);
        samples.setVisibility(View.GONE);

        selectedMenu.setText(menuItems[1]);
        progressText.setText(menuProgress[1]);

        setSeekBar(0,100);
        showSeekBar();

        String str = menuProgress[1];
        String sub;
        try {
            sub = str.substring(0,str.length() - 2);
            progress = Integer.parseInt(sub);
            seekbar.setProgress(progress);
        } catch (Exception e) {
            e.printStackTrace();
            seekbar.setProgress(0);
        }
    }

    //选择点符号菜单
    private void chooseMenuMarkerSymbolID() {
        hideSeekBar();
        gridView.setVisibility(View.VISIBLE);
        horizontalListView.setVisibility(View.GONE);
        samples.setVisibility(View.VISIBLE);

        selectedMenu.setText(menuItems[0]);
        progressText.setText(menuProgress[0]);
    }

    /**
     * 刷新ScrollerMenu
     */
    private void refreshScrollerMenu() {
        scrollerMenu.scrollToItem(0);
        scrollerMenu.scrollToItem(menuItems.length - 1);
        scrollerMenu.scrollToItem(selectedItem);
    }

    @Override
    public void onMenuItemProgressed(String[] menuItems, int index, int progressedBy) {
//      Log.e(TAG, "onMenuItemProgressed");

        if (index == 0 || index == 2) {
            hideSeekBar();
        } else {
            showSeekBar();

            int totalprogress = progress + progressedBy;
            if (totalprogress < PROGRESS_MIN) {
                totalprogress = PROGRESS_MIN;
            }

            if (totalprogress > PROGRESS_MAX) {
                totalprogress = PROGRESS_MAX;
            }
            seekbar.setProgress(totalprogress);

            if (index == 1) {
                //大小
                setMarkerSize(totalprogress);
            } else if (index == 3) {
                //旋转角度
                setMarkerAngle(totalprogress);
            } else if (index == 4) {
                //透明度
                setMarkerAlpha(totalprogress);
            }

        }

    }

    @Override
    public void onDown() {
//        Log.e(TAG, "OnDown");
        //触摸屏幕时隐藏
        gridView.setVisibility(View.GONE);
        horizontalListView.setVisibility(View.GONE);
    }

    //不让地图滑动
    private void lockMap() {
        Map map = mapView.getMapControl().getMap();
        Rectangle2D viewBounds = map.getViewBounds();
        map.setLockedViewBounds(viewBounds);
        map.setViewBoundsLocked(true);
    }

    @Override
    public void onDoubleTap() {
//        Log.e(TAG, "OnDoubleTap");
        //双击后不让地图滑动
        lockMap();
    }

    @Override
    public void onUp() {
//        Log.e(TAG,"onUP");
        //手指抬起
        if (seekbar != null) {
            progress = seekbar.getProgress();
        }

        //进度不刷新的问题
        refreshScrollerMenu();
    }

    @Override
    public void onSaveInstanceState(Bundle outState) {
        outState.putInt(KEY_BUNDLE_PROGRESS, progress);
        outState.putInt(KEY_BUNDLE_SELECTED_MENU_INDEX, scrollerMenu.getSelectedMenuItem());
        super.onSaveInstanceState(outState);
    }

    @Override
    public void onClick(View v) {
        switch (v.getId()) {
            case R.id.menu_show_hide:
                //菜单
                gridView.setVisibility(View.GONE);
                horizontalListView.setVisibility(View.GONE);
                showOrHideMenu();

                break;
            case R.id.samples:
                //隐藏或显示当前菜单内容
                showOrHideSamples();

                break;
            case R.id.btn_cancel:
                //取消
                hideEditFragment();

                break;
            case R.id.save:
                //保存
                Toast.makeText(mContext, "保存", Toast.LENGTH_SHORT).show();


                break;
        }
    }

    //隐藏或显示菜单
    private void showOrHideMenu() {
        //进度不刷新的问题
        refreshScrollerMenu();

        if (!scrollerMenu.isVisible()) {
            scrollerMenu.show();
        } else {
            scrollerMenu.hide();
        }
    }

    private void showOrHideSamples() {
        scrollerMenu.hide();

        if (selectedItem == 0) {
            //点符号
            if (gridView.getVisibility() == View.VISIBLE) {
                gridView.setVisibility(View.GONE);
            } else {
                gridView.setVisibility(View.VISIBLE);
            }
        }
        else if (selectedItem == 1) {
            //大小

        }
        else if (selectedItem == 2) {
            //颜色
            if (horizontalListView.getVisibility() == View.VISIBLE) {
                horizontalListView.setVisibility(View.GONE);
            } else {
                horizontalListView.setVisibility(View.VISIBLE);
            }
        }
        else if (selectedItem == 3) {
            //旋转角度

        }
        else if (selectedItem == 4) {
            //透明度

        }

    }


    //水平滑动菜单的布局显示与隐藏的动画
    private void setLayoutTransition() {
//        LayoutTransition anim = new LayoutTransition();
//        PropertyValuesHolder scaleInX = PropertyValuesHolder.ofFloat("scaleX", 0.8f, 1f);
//        PropertyValuesHolder scaleInY = PropertyValuesHolder.ofFloat("scaleY", 0.8f, 1f);
//        PropertyValuesHolder alphaIn = PropertyValuesHolder.ofFloat("alpha", 0.5f, 1f);
//
//        PropertyValuesHolder scaleOutX = PropertyValuesHolder.ofFloat("scaleX", 1f, 0.8f);
//        PropertyValuesHolder scaleOutY = PropertyValuesHolder.ofFloat("scaleY", 1f, 0.8f);
//        PropertyValuesHolder alphaOut = PropertyValuesHolder.ofFloat("alpha", 1f, 0.5f);
//
//        ObjectAnimator in = ObjectAnimator.ofPropertyValuesHolder((View) null, scaleInX, scaleInY, alphaIn);
//        ObjectAnimator out = ObjectAnimator.ofPropertyValuesHolder((View) null, scaleOutX, scaleOutY, alphaOut);
//
//        ObjectAnimator animatorIn = ObjectAnimator.ofFloat(null, "rotationY", 90F, 0F).
//                setDuration(anim.getDuration(LayoutTransition.APPEARING));
//
//        ObjectAnimator animatorOut = ObjectAnimator.ofFloat(null, "rotationX", 0F, 90F, 0F).
//                setDuration(anim.getDuration(LayoutTransition.DISAPPEARING));
//
//        anim.setAnimator(LayoutTransition.APPEARING, animatorIn);
//        anim.setAnimator(LayoutTransition.DISAPPEARING, animatorOut);
//        anim.setDuration(100);
//
//        linearLayoutMenu.setLayoutTransition(anim);
    }

    private void hideEditFragment() {
        mapView.getMapControl().setAction(Action.PAN);
        Map map = mapView.getMapControl().getMap();
        map.setViewBoundsLocked(false);

        MapLayer mapLayer = (MapLayer) mContext;
        mapLayer.showBottomMenu();

        FragmentManager fragmentManager = getFragmentManager();
        FragmentTransaction fragmentTransaction = fragmentManager.beginTransaction();
        fragmentTransaction.hide(this);
        fragmentTransaction.commit();
    }

}

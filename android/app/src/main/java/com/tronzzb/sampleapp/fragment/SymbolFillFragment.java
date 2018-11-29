package com.tronzzb.sampleapp.fragment;

import android.content.Context;
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
import com.tronzzb.sampleapp.adapter.FillGridViewAdapter;
import com.tronzzb.sampleapp.adapter.LineGridViewAdapter;
import com.tronzzb.sampleapp.scrollermenu.HorizontalListView;
import com.tronzzb.sampleapp.scrollermenu.ScrollerMenu;
import com.tronzzb.sampleapp.seekbar.BubbleSeekBar;

import java.util.ArrayList;

/**
 * 面风格
 */

public class SymbolFillFragment extends Fragment implements ScrollerMenu.ScrollerMenuListener, View.OnClickListener{
    private static final String TAG = "SymbolFillFragment";

    private static final String KEY_BUNDLE_PROGRESS = "KEY_BUNDLE_PROGRESS";
    private static final String KEY_BUNDLE_SELECTED_MENU_INDEX = "KEY_BUNDLE_SELECTED_MENU_INDEX";
    private static int PROGRESS_MAX = 100;
    private static int PROGRESS_MIN = 0;

    private TextView selectedMenu;
    private TextView progressText;
    private int progress;
    private ScrollerMenu scrollerMenu;

    private LinearLayout linearLayoutMenu;

    private BubbleSeekBar seekbar = null;
    private LinearLayout ll_show_progress = null;

    private GridView gridView;//符号库
    private FillGridViewAdapter fillGridViewAdapter;
    private LineGridViewAdapter lineGridViewAdapter;

    private LinearLayout ll_fill_gradient;//渐变菜单栏

    private HorizontalListView horizontalListView;//颜色菜单

    private ImageButton samples;

    private ArrayList<ColorInfo> mColorInfos = new ArrayList<>();

    private String[] menuItems = new String[]{
            "面符号","前景色", "背景色", "透明度",
            "渐变",
            "边框符号","边框宽度","边框颜色"
    };

    private int FillSymbolID = 0;
    private String FillForeColor = "无";
    private String FillBackColor = "无";
    private int FillOpaqueRate = 0;

    private String FillLinearGradient = "线性";//线性渐变
    private String FillRadialGradient = "辐射";//辐射渐变
    private String FillSquareGradient = "方形";//方形渐变
    private String FillNoneGradient = "无";

    private String FillGradient = FillNoneGradient;

    private String FillLineColor = "#FFFFFF";
    private int FillLineSymbolID = 0;
    private double FillLineWidth = 0;

    private String[] menuProgress = new String[]{
            "" + FillSymbolID,
            "" + FillForeColor ,
            "" + FillBackColor,
            "" + FillOpaqueRate + "%",

            "" + FillGradient,

            "" + FillLineSymbolID,
            "" + FillLineWidth + "mm",
            "" + FillLineColor,
    };

    private int mLastPosition = -1;

    /**
     * 当前选中的菜单项
     */
    private int selectedItem = 0;

    public SymbolFillFragment() {
    }

    private MapView mapView = null;
    private int currentLayer = 4;

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
        View rootView = inflater.inflate(R.layout.fragment_symbol_fill, container, false);

        initView(rootView);

        initListening(rootView);

        initScrollerMenu(savedInstanceState);

        initGridView(rootView);

        initSeekBar(rootView);

        initHorizontalListView(rootView);

        initFillGradient(rootView);

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

    private void initFillGradient(View rootView) {
        ll_fill_gradient = rootView.findViewById(R.id.ll_fill_gradient);

        rootView.findViewById(R.id.fill_linear_gradient).setOnClickListener(this);
        rootView.findViewById(R.id.fill_fadial_gradient).setOnClickListener(this);
        rootView.findViewById(R.id.fill_square_gradient).setOnClickListener(this);
        rootView.findViewById(R.id.fill_none_gradient).setOnClickListener(this);
    }

    private void initHorizontalListView(View rootView) {
        horizontalListView = rootView.findViewById(R.id.horizontal_listview);
        setupColorInfoLists();
    }

    private void initGridView(View rootView) {
        gridView = rootView.findViewById(R.id.gridview);

        fillGridViewAdapter = new FillGridViewAdapter(mapView, mContext);
        lineGridViewAdapter = new LineGridViewAdapter(mapView, mContext);

        gridView.setAdapter(fillGridViewAdapter);

        //设置符号的监听
        gridView.setOnItemClickListener(gridViewOnItemClickListening);
    }

    private AdapterView.OnItemClickListener gridViewOnItemClickListening = new AdapterView.OnItemClickListener() {
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
            if (selectedItem == 0) {
                //面符号
                SymbolFillLibrary symbol_F = m_resources.getFillLibrary();
                SymbolGroup Group_F = symbol_F.getRootGroup();
                Symbol symbol = Group_F.get(position);

                if (symbol != null) {
                    setFillSymbolID(symbol.getID());
                }
            } else if (selectedItem == 5) {
                //线符号
                SymbolLineLibrary symbol_L = m_resources.getLineLibrary();
                SymbolGroup Group_L = symbol_L.getRootGroup();
                Symbol symbol = Group_L.get(position);

                if (symbol != null) {
                    setLineSymbolID(symbol.getID());
                }
            }

        }
    };

    //设置面符号的ID
    private void setFillSymbolID(int FillSymbolID) {
        Layers layers = mapView.getMapControl().getMap().getLayers();
        Layer layer = layers.get(currentLayer);
        if (layer != null && layer.getTheme() == null) {
            layer.setEditable(true);

            if (layer.getAdditionalSetting() != null) {
                LayerSettingVector layerSettingVector = (LayerSettingVector) layer.getAdditionalSetting();
                if (layerSettingVector != null) {
                    GeoStyle geoStyle = layerSettingVector.getStyle();
                    geoStyle.setFillSymbolID(FillSymbolID);
                    layerSettingVector.setStyle(geoStyle);
                    mapView.getMapControl().getMap().refresh();

                    this.FillSymbolID = FillSymbolID;
                    menuProgress[0] = "" + this.FillSymbolID;

                    progressText.setText(menuProgress[0]);
                    scrollerMenu.setMenuProgress(menuProgress);

                }
            }

        } else {
            // 专题图
            Log.e(TAG, "专题图");
        }
    }

    // 设置前景色
    private void setFillForeColor(String fillForeColor) {
        Layers layers = mapView.getMapControl().getMap().getLayers();
        Layer layer = layers.get(currentLayer);
        if (layer != null && layer.getTheme() == null) {
            layer.setEditable(true);

            int parseColor = android.graphics.Color.parseColor(fillForeColor);
            int[] rgb = getRGB(parseColor);
            com.supermap.data.Color color = new com.supermap.data.Color(rgb[0], rgb[1], rgb[2]);

            if (layer.getAdditionalSetting() != null) {
                LayerSettingVector layerSettingVector = (LayerSettingVector) layer.getAdditionalSetting();
                if (layerSettingVector != null) {
                    GeoStyle geoStyle = layerSettingVector.getStyle();
                    geoStyle.setFillForeColor(color);
                    layerSettingVector.setStyle(geoStyle);
                    mapView.getMapControl().getMap().refresh();

                    FillForeColor = fillForeColor;
                    menuProgress[1] = "" + FillForeColor;

                    progressText.setText(menuProgress[1]);
                    scrollerMenu.setMenuProgress(menuProgress);
                }
            }

        } else {
            // 专题图
            Log.e(TAG, "专题图");
        }

    }

    // 设置背景色
    private void setFillBackColor(String fillBackColor) {
        Layers layers = mapView.getMapControl().getMap().getLayers();
        Layer layer = layers.get(currentLayer);
        if (layer != null && layer.getTheme() == null) {
            layer.setEditable(true);

            int parseColor = android.graphics.Color.parseColor(fillBackColor);
            int[] rgb = getRGB(parseColor);
            com.supermap.data.Color color = new com.supermap.data.Color(rgb[0], rgb[1], rgb[2]);

            if (layer.getAdditionalSetting() != null) {
                LayerSettingVector layerSettingVector = (LayerSettingVector) layer.getAdditionalSetting();
                if (layerSettingVector != null) {
                    GeoStyle geoStyle = layerSettingVector.getStyle();
                    geoStyle.setFillBackColor(color);
                    layerSettingVector.setStyle(geoStyle);
                    mapView.getMapControl().getMap().refresh();

                    FillBackColor = fillBackColor;
                    menuProgress[2] = "" + FillBackColor;

                    progressText.setText(menuProgress[2]);
                    scrollerMenu.setMenuProgress(menuProgress);
                }
            }

        } else {
            // 专题图
            Log.e(TAG, "专题图");
        }

    }

    //颜色值转换
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


    // 设置透明度（0-100）
    private void setFillOpaqueRate(int fillOpaqueRate) {
        Layers layers = mapView.getMapControl().getMap().getLayers();
        Layer layer = layers.get(currentLayer);
        if (layer != null && layer.getTheme() == null) {
            layer.setEditable(true);

            if (layer.getAdditionalSetting() != null) {
                LayerSettingVector layerSettingVector = (LayerSettingVector) layer.getAdditionalSetting();
                if (layerSettingVector != null) {
                    GeoStyle geoStyle = layerSettingVector.getStyle();
                    geoStyle.setFillOpaqueRate(100 - fillOpaqueRate);//此接口是设置不透明度
                    layerSettingVector.setStyle(geoStyle);
                    mapView.getMapControl().getMap().refresh();

                    FillOpaqueRate = fillOpaqueRate;
                    menuProgress[3] = "" + FillOpaqueRate + "%";

                    progressText.setText(menuProgress[3]);
                    scrollerMenu.setMenuProgress(menuProgress);

                }
            }

        } else {
            // 专题图
            Log.e(TAG, "专题图");
        }

    }

    //设置线性渐变
    private void setFillLinearGradient(){
        if (Environment.isOpenGLMode()) {
            Toast.makeText(mContext, "OpenGL不支持颜色渐变", Toast.LENGTH_SHORT).show();
            return;
        }

        Layers layers = mapView.getMapControl().getMap().getLayers();
        Layer layer = layers.get(currentLayer);
        if (layer != null && layer.getTheme() == null) {
            layer.setEditable(true);

            if (layer.getAdditionalSetting() != null) {
                LayerSettingVector layerSettingVector = (LayerSettingVector) layer.getAdditionalSetting();
                if (layerSettingVector != null) {
                    GeoStyle geoStyle = layerSettingVector.getStyle();
                    geoStyle.setFillGradientMode(FillGradientMode.LINEAR);
                    layerSettingVector.setStyle(geoStyle);
                    mapView.getMapControl().getMap().refresh();

                    FillGradient = FillLinearGradient;
                    menuProgress[4] = "" + FillGradient;

                    progressText.setText(menuProgress[4]);
                    scrollerMenu.setMenuProgress(menuProgress);
                }
            }

        } else {
            // 专题图
            Log.e(TAG, "专题图");
        }
    }

    //设置辐射渐变
    private void setFillRadialGradient(){
        if (Environment.isOpenGLMode()) {
            Toast.makeText(mContext, "OpenGL不支持颜色渐变", Toast.LENGTH_SHORT).show();
            return;
        }

        Layers layers = mapView.getMapControl().getMap().getLayers();
        Layer layer = layers.get(currentLayer);
        if (layer != null && layer.getTheme() == null) {
            layer.setEditable(true);

            if (layer.getAdditionalSetting() != null) {
                LayerSettingVector layerSettingVector = (LayerSettingVector) layer.getAdditionalSetting();
                if (layerSettingVector != null) {
                    GeoStyle geoStyle = layerSettingVector.getStyle();
                    geoStyle.setFillGradientMode(FillGradientMode.RADIAL);
                    layerSettingVector.setStyle(geoStyle);
                    mapView.getMapControl().getMap().refresh();

                    FillGradient = FillRadialGradient;
                    menuProgress[4] = "" + FillGradient;

                    progressText.setText(menuProgress[4]);
                    scrollerMenu.setMenuProgress(menuProgress);
                }
            }

        } else {
            // 专题图
            Log.e(TAG, "专题图");
        }
    }

    //设置方形渐变
    private void setFillSquareGradient(){
        if (Environment.isOpenGLMode()) {
            Toast.makeText(mContext, "OpenGL不支持颜色渐变", Toast.LENGTH_SHORT).show();
            return;
        }

        Layers layers = mapView.getMapControl().getMap().getLayers();
        Layer layer = layers.get(currentLayer);
        if (layer != null && layer.getTheme() == null) {
            layer.setEditable(true);

            if (layer.getAdditionalSetting() != null) {
                LayerSettingVector layerSettingVector = (LayerSettingVector) layer.getAdditionalSetting();
                if (layerSettingVector != null) {
                    GeoStyle geoStyle = layerSettingVector.getStyle();
                    geoStyle.setFillGradientMode(FillGradientMode.SQUARE);
                    layerSettingVector.setStyle(geoStyle);
                    mapView.getMapControl().getMap().refresh();

                    FillGradient = FillSquareGradient;
                    menuProgress[4] = "" + FillGradient;

                    progressText.setText(menuProgress[4]);
                    scrollerMenu.setMenuProgress(menuProgress);
                }
            }

        } else {
            // 专题图
            Log.e(TAG, "专题图");
        }
    }

    //设置无渐变
    private void setFillNoneGradient(){
        Layers layers = mapView.getMapControl().getMap().getLayers();
        Layer layer = layers.get(currentLayer);
        if (layer != null && layer.getTheme() == null) {
            layer.setEditable(true);

            if (layer.getAdditionalSetting() != null) {
                LayerSettingVector layerSettingVector = (LayerSettingVector) layer.getAdditionalSetting();
                if (layerSettingVector != null) {
                    GeoStyle geoStyle = layerSettingVector.getStyle();
                    geoStyle.setFillGradientMode(FillGradientMode.NONE);
                    layerSettingVector.setStyle(geoStyle);
                    mapView.getMapControl().getMap().refresh();

                    FillGradient = FillNoneGradient;
                    menuProgress[4] = "" + FillGradient;

                    progressText.setText(menuProgress[4]);
                    scrollerMenu.setMenuProgress(menuProgress);
                }
            }

        } else {
            // 专题图
            Log.e(TAG, "专题图");
        }
    }

    //设置线符号的ID
    private void setLineSymbolID(int lineSymbolID) {
        Layers layers = mapView.getMapControl().getMap().getLayers();
        Layer layer = layers.get(currentLayer);
        if (layer != null && layer.getTheme() == null) {
            layer.setEditable(true);

            if (layer.getAdditionalSetting() != null) {
                LayerSettingVector layerSettingVector = (LayerSettingVector) layer.getAdditionalSetting();
                if (layerSettingVector != null) {
                    GeoStyle geoStyle = layerSettingVector.getStyle();
                    geoStyle.setLineSymbolID(lineSymbolID);
                    layerSettingVector.setStyle(geoStyle);
                    mapView.getMapControl().getMap().refresh();

                    FillLineSymbolID = lineSymbolID;
                    menuProgress[5] = "" + FillLineSymbolID;

                    progressText.setText(menuProgress[5]);
                    scrollerMenu.setMenuProgress(menuProgress);

                }
            }

        } else {
            // 专题图
            Log.e(TAG, "专题图");
        }
    }

    // 设置线宽：1-10mm
    private void setFillLineWidth(int mm) {
        Layers layers = mapView.getMapControl().getMap().getLayers();
        Layer layer = layers.get(currentLayer);
        if (layer != null && layer.getTheme() == null) {
            layer.setEditable(true);

            if (layer.getAdditionalSetting() != null) {
                LayerSettingVector layerSettingVector = (LayerSettingVector) layer.getAdditionalSetting();
                if (layerSettingVector != null) {
                    GeoStyle geoStyle = layerSettingVector.getStyle();
                    double width = (double)mm / 10;
                    geoStyle.setLineWidth(width);
                    layerSettingVector.setStyle(geoStyle);
                    mapView.getMapControl().getMap().refresh();

                    FillLineWidth = width;
                    menuProgress[6] = "" + FillLineWidth + "mm";

                    progressText.setText(menuProgress[6]);
                    scrollerMenu.setMenuProgress(menuProgress);
                }
            }

        } else {
            // 专题图
            Log.e(TAG, "专题图");
        }

    }

    // 设置边框颜色
    private void setFillLineColor(String lineColor) {
        Layers layers = mapView.getMapControl().getMap().getLayers();
        Layer layer = layers.get(currentLayer);
        if (layer != null && layer.getTheme() == null) {
            layer.setEditable(true);

            int parseColor = android.graphics.Color.parseColor(lineColor);
            int[] rgb = getRGB(parseColor);
            com.supermap.data.Color color = new com.supermap.data.Color(rgb[0], rgb[1], rgb[2]);

            if (layer.getAdditionalSetting() != null) {
                LayerSettingVector layerSettingVector = (LayerSettingVector) layer.getAdditionalSetting();
                if (layerSettingVector != null) {
                    GeoStyle geoStyle = layerSettingVector.getStyle();
                    geoStyle.setLineColor(color);
                    layerSettingVector.setStyle(geoStyle);
                    mapView.getMapControl().getMap().refresh();

                    FillLineColor = lineColor;
                    menuProgress[7] = "" + FillLineColor;

                    progressText.setText(menuProgress[7]);
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
//                Log.e(TAG, "onProgressChanged");

                scrollerMenu.hide();

                if (!isSeekBarTouched) {
                    //由滑动屏幕引起的变更不需要再重复设置
//                    Log.e(TAG, "onProgressChanged：!isSeekBarTouched");
                    return;
                }

                if (selectedItem == 0) {
                    //面符号

                }
                else if (selectedItem == 1) {
                    //前景色

                }
                else if (selectedItem == 2) {
                    //背景色

                }
                else if (selectedItem == 3) {
                    //透明度
                    setFillOpaqueRate(progressedBy);
                }
                else if (selectedItem == 4) {
                    //渐变

                }
                else if (selectedItem == 5) {
                    //边框符号

                }
                else if (selectedItem == 6) {
                    //边框宽度
                    setFillLineWidth(progressedBy);
                }
                else if (selectedItem == 7) {
                    //边框颜色

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
//               Toast.makeText(mContext, "color" + position, Toast.LENGTH_SHORT).show();

                if (selectedItem == 1) {
                    //前景色
                    setFillForeColor(mColorInfos.get(position).getColor());
                } else if (selectedItem == 2) {
                    //背景色
                    setFillBackColor(mColorInfos.get(position).getColor());
                } else if (selectedItem == 7) {
                    //边框颜色
                    setFillLineColor(mColorInfos.get(position).getColor());
                }

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
            //面符号
            chooseMenuFillSymbolID();
        }
        else if (selectedItem == 1) {
            //前景色
            chooseMenuFillForeColor();
        }
        else if (selectedItem == 2) {
            //背景色
            chooseMenuFillBackColor();
        }
        else if (selectedItem == 3) {
            //透明度
            chooseMenuFillOpaqueRate();
        }
        else if (selectedItem == 4) {
            //渐变
            chooseMenuFillGradient();
        }
        else if (selectedItem == 5) {
            //边框符号
            chooseMenuFillLineSymbolID();
        }
        else if (selectedItem == 6) {
            //边框宽度
            chooseMenuFillLineWidth();
        }
        else if (selectedItem == 7) {
            //边框颜色
            chooseMenuFillLineColor();
        }
    }

    //选择边框颜色菜单
    private void chooseMenuFillLineColor() {
        hideSeekBar();
        gridView.setVisibility(View.GONE);
        horizontalListView.setVisibility(View.VISIBLE);
        ll_fill_gradient.setVisibility(View.GONE);
        samples.setVisibility(View.VISIBLE);

        selectedMenu.setText(menuItems[7]);
        progressText.setText(menuProgress[7]);

    }

    //选择边框宽度菜单
    private void chooseMenuFillLineWidth() {
        gridView.setVisibility(View.GONE);
        horizontalListView.setVisibility(View.GONE);
        ll_fill_gradient.setVisibility(View.GONE);
        samples.setVisibility(View.GONE);

        selectedMenu.setText(menuItems[6]);
        progressText.setText(menuProgress[6]);

        setSeekBar(0, 100);
        showSeekBar();

        String str = menuProgress[6];
        String sub;
        try {
            sub = str.substring(0, str.length() - 2);
            double parseDouble = Double.parseDouble(sub);
            progress = (int) (parseDouble * 10);
            seekbar.setProgress(progress);
        } catch (Exception e) {
            e.printStackTrace();
            seekbar.setProgress(0);
        }
    }

    //选择边框符号菜单
    private void chooseMenuFillLineSymbolID() {
        ListAdapter adapter = gridView.getAdapter();
        if (adapter instanceof FillGridViewAdapter) {
            gridView.setAdapter(lineGridViewAdapter);
        }

        hideSeekBar();
        gridView.setVisibility(View.VISIBLE);
        horizontalListView.setVisibility(View.GONE);
        ll_fill_gradient.setVisibility(View.GONE);
        samples.setVisibility(View.VISIBLE);

        selectedMenu.setText(menuItems[5]);
        progressText.setText(menuProgress[5]);

    }

    //选择渐变菜单
    private void chooseMenuFillGradient() {
        hideSeekBar();
        gridView.setVisibility(View.GONE);
        horizontalListView.setVisibility(View.GONE);
        ll_fill_gradient.setVisibility(View.VISIBLE);
        samples.setVisibility(View.VISIBLE);

        selectedMenu.setText(menuItems[4]);
        progressText.setText(menuProgress[4]);

    }

    //选择透明度菜单
    private void chooseMenuFillOpaqueRate() {
        gridView.setVisibility(View.GONE);
        horizontalListView.setVisibility(View.GONE);
        ll_fill_gradient.setVisibility(View.GONE);
        samples.setVisibility(View.GONE);

        selectedMenu.setText(menuItems[3]);
        progressText.setText(menuProgress[3]);

        setSeekBar(0, 100);
        showSeekBar();

        String str = menuProgress[3];
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

    //选择背景色菜单
    private void chooseMenuFillBackColor() {
        hideSeekBar();
        gridView.setVisibility(View.GONE);
        horizontalListView.setVisibility(View.VISIBLE);
        ll_fill_gradient.setVisibility(View.GONE);
        samples.setVisibility(View.VISIBLE);

        selectedMenu.setText(menuItems[2]);
        progressText.setText(menuProgress[2]);
    }

    //选择前景色菜单
    private void chooseMenuFillForeColor() {
        hideSeekBar();
        gridView.setVisibility(View.GONE);
        horizontalListView.setVisibility(View.VISIBLE);
        ll_fill_gradient.setVisibility(View.GONE);
        samples.setVisibility(View.VISIBLE);

        selectedMenu.setText(menuItems[1]);
        progressText.setText(menuProgress[1]);
    }

    //选择面符号菜单
    private void chooseMenuFillSymbolID() {
        ListAdapter adapter = gridView.getAdapter();
        if (adapter instanceof LineGridViewAdapter) {
            gridView.setAdapter(fillGridViewAdapter);
        }

        hideSeekBar();
        gridView.setVisibility(View.VISIBLE);
        horizontalListView.setVisibility(View.GONE);
        ll_fill_gradient.setVisibility(View.GONE);
        samples.setVisibility(View.VISIBLE);

        selectedMenu.setText(menuItems[0]);
        progressText.setText(menuProgress[0]);
    }

    /**
     * 刷新ScrollerView
     */
    private void refreshScrollerMenu() {
        scrollerMenu.scrollToItem(0);
        scrollerMenu.scrollToItem(menuItems.length - 1);
        scrollerMenu.scrollToItem(selectedItem);
    }

    @Override
    public void onMenuItemProgressed(String[] menuItems, int index, int progressedBy) {
//      Log.e(TAG, "onMenuItemProgressed");

        if (index == 0 || index == 1 || index == 2 || index == 4 || index == 5 || index == 7) {
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

            if (index == 3) {
                //透明度
                setFillOpaqueRate(totalprogress);
            }
            else if (index == 6) {
                //线宽
                setFillLineWidth(totalprogress);
            }
        }

    }

    @Override
    public void onDown() {
//        Log.e(TAG, "OnDown");
        //触摸屏幕时隐藏
        gridView.setVisibility(View.GONE);
        horizontalListView.setVisibility(View.GONE);
        ll_fill_gradient.setVisibility(View.GONE);
    }

    private void lockMap() {
        //不让地图滑动
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
                ll_fill_gradient.setVisibility(View.GONE);

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
            case R.id.fill_linear_gradient:
                //线性
                setFillLinearGradient();

                break;
            case R.id.fill_fadial_gradient:
                //辐射
                setFillRadialGradient();

                break;
            case R.id.fill_square_gradient:
                //方形
                setFillSquareGradient();

                break;
            case R.id.fill_none_gradient:
                //无渐变
                setFillNoneGradient();

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
            //面符号
            if (gridView.getVisibility() == View.VISIBLE) {
                gridView.setVisibility(View.GONE);
            } else {
                gridView.setVisibility(View.VISIBLE);
            }
        }
        else if (selectedItem == 1) {
            //前景色
            if (horizontalListView.getVisibility() == View.VISIBLE) {
                horizontalListView.setVisibility(View.GONE);
            } else {
                horizontalListView.setVisibility(View.VISIBLE);
            }
        }
        else if (selectedItem == 2) {
            //背景色
            if (horizontalListView.getVisibility() == View.VISIBLE) {
                horizontalListView.setVisibility(View.GONE);
            } else {
                horizontalListView.setVisibility(View.VISIBLE);
            }
        }
        else if (selectedItem == 3) {
            //透明度
            
        }
        else if (selectedItem == 4) {
            //渐变
            if (ll_fill_gradient.getVisibility() == View.VISIBLE) {
                ll_fill_gradient.setVisibility(View.GONE);
            } else {
                ll_fill_gradient.setVisibility(View.VISIBLE);
            }
        }
        else if (selectedItem == 5) {
            //边框符号
            if (gridView.getVisibility() == View.VISIBLE) {
                gridView.setVisibility(View.GONE);
            } else {
                gridView.setVisibility(View.VISIBLE);
            }
        }
        else if (selectedItem == 6) {
            //边框宽度

        }
        else if (selectedItem == 7) {
            //边框颜色
            if (horizontalListView.getVisibility() == View.VISIBLE) {
                horizontalListView.setVisibility(View.GONE);
            } else {
                horizontalListView.setVisibility(View.VISIBLE);
            }
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

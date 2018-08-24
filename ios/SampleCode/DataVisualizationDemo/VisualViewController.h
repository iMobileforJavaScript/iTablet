//
//  ViewController.h
//  HotMap
//
//  Created by imobile-xzy on 16/11/7.
//  Copyright (c) 2016年 imobile-xzy. All rights reserved.
//

#import <UIKit/UIKit.h>
#import "SuperMap/HeatChart.h"
#import "SuperMap/PolymerChart.h"
#import "SuperMap/PointDensityChart.h"
#import "SuperMap/RelationalPointChart.h"
#import "SuperMap/PieChart.h"
#import "SuperMap/LineChart.h"
#import "SuperMap/BarChart.h"
#import "SuperMap/InstrumentChart.h"
#import "SuperMap/TimeLine.h"
#import "SuperMap/GridHotChart.h"
#import "SuperMap/ScatterChart.h"
#import "SuperMap/SuperMap.h"

@interface VisualViewController : UIViewController<GeometrySelectedDelegate,QueryServiceDelegate>
{
    DynamicView* dv;
    HeatChart *mHeatMap;
    PolymerChart* mPolymeMap;
    PointDensityChart* mDensityMap;
    RelationalPointChart* mRelationMap;
    GridHotChart* mGridHotMap;
    ScatterChart* mScatterCHart;
    TimeLine* chartTimeLine;
    
    __weak IBOutlet InstrumentChart* instrumentChart;
    __weak IBOutlet InstrumentChart *instrumentChart2;
    __weak IBOutlet  PieChart *pieChart;
    __weak IBOutlet  LineChart *lineChart;
    __weak IBOutlet  BarChart* barChart;
   // __weak IBOutlet  BarChart* barChart2;
    
    __weak IBOutlet UIView *timeLine;
    IBOutlet MapControl *m_mapControl;
    Workspace* _workspace;
    WorkspaceConnectionInfo *m_Info;
    __weak IBOutlet UIButton *mPolymerBtn;
    __weak IBOutlet UISwitch *m_swithch;
    
    __weak IBOutlet UISwitch *m_swithCh_r;
}

@end


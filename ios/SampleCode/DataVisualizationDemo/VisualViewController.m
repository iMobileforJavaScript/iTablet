//
//  ViewController.m
//  HotMap
//
//  Created by imobile-xzy on 16/11/7.
//  Copyright (c) 2016年 imobile-xzy. All rights reserved.
//

#import "VisualViewController.h"
#import "SuperMap/Rectangle2D.h"
#import "SuperMap/Color.h"
#import "SuperMap/CloudLicenseManager.h"
#import "SuperMap/ChartPoint.h"
#import "SuperMap/PieChart.h"
#import "SuperMap/ChartLegend.h"
#import "SuperMap/ChartData.h"
#import "SuperMap/Color.h"
#import "ZipArchive.h"
#import "SuperMap/Toast.h"
#import <objc/runtime.h>

//#import "SuperMap/RecycleLicenseManager.h"

//#define _EN_
@interface VisualViewController ()
{
    
    __weak IBOutlet UIButton *bt6;
    __weak IBOutlet UIButton *bt5;
    
    __weak IBOutlet UIButton *bt4;
    __weak IBOutlet UIButton *bt3;
    __weak IBOutlet UIButton *bt2;
    __weak IBOutlet UIButton *bt1;
    __weak IBOutlet UIButton *realTimeBtn;
    __weak IBOutlet UIButton *timeDataBtn;
    __weak IBOutlet UIView *chartHostView;
    
    NSArray* colors;// = @[[[Color alloc]initWithR:188 G:254 B:151],[[Color alloc]initWithR:255 G:245 B:151],[[Color alloc]initWithR:126 G:237 B:253],[[Color alloc]initWithR:255 G:205 B:147],[[Color alloc]initWithR:125 G:125 B:151]];
    
    NSMutableArray* m_30WData;
    NSMutableArray* dataArr;
    NSString* curMap;
}
@end

#define isPad (UI_USER_INTERFACE_IDIOM() == UIUserInterfaceIdiomPad)
static MapControl* g_mapcontrol;
static Workspace* g_workspace;

@implementation VisualViewController

- (void)orientationToPortrait:(UIInterfaceOrientation)orientation {
//
//  SEL selector = NSSelectorFromString(@"setOrientation:");
//  NSInvocation *invocation = [NSInvocation invocationWithMethodSignature:[UIDevice instanceMethodSignatureForSelector:selector]];
//  [invocation setSelector:selector];
//  [invocation setTarget:[UIDevice currentDevice]];
//  int val = orientation;
//  [invocation setArgument:&val atIndex:2];//前两个参数已被target和selector占用
//  [invocation invoke];
  
  NSNumber *orientationUnknown = [NSNumber numberWithInt:UIInterfaceOrientationUnknown];
  [[UIDevice currentDevice] setValue:orientationUnknown forKey:@"orientation"];
  
  NSNumber *orientationTarget = [NSNumber numberWithInt:orientation];
  [[UIDevice currentDevice] setValue:orientationTarget forKey:@"orientation"];
  
}

-(void)viewWillDisappear:(BOOL)animated{
  Method t = class_getClassMethod([NSString class], @selector(lowercaseString));
  [m_mapControl.map close];
  [_workspace close];
  m_30WData = nil;
  dataArr = nil;
 // [m_mapControl dispose];
  _workspace = nil;
  self.navigationController.navigationBarHidden = YES;
   [self orientationToPortrait:UIInterfaceOrientationPortrait];
}
- (void)viewDidLoad {
    [super viewDidLoad];
    
    [self orientationToPortrait:UIInterfaceOrientationLandscapeLeft];
//    [Environment setUserLicInfo:@"01F51-B93E3-DB4E9-28C53-83119"/*@"62202-55667-1A489-994B3-90DCA"*/ Modules:@[CORE_DEV]];
//    
//    [PermissionToolKit clearKeyChainItem];
//    if([Environment activateDevice])
//    {
//        NSLog(@"激活成功！");
//    }
  
  self.navigationItem.title = @"数据可视化";
    [Toast show:@"数据准备中..." hostView:m_mapControl];
    
}

-(void)viewDidAppear:(BOOL)animated
{
    
   
    m_swithch = nil;
    m_swithCh_r = nil;
//    [Environment setLicensePath:[NSHomeDirectory() stringByAppendingFormat:@"/Library/Caches/%@",@""]];
//    NSString *srclic = [[NSBundle mainBundle] pathForResource:@"Trial_License" ofType:@"slm"];
//    NSString* deslic = [NSHomeDirectory() stringByAppendingFormat:@"/Library/Caches/%@",@"Trial_License.slm"];
//    if(![[NSFileManager defaultManager] fileExistsAtPath:deslic isDirectory:nil]){
//        if(![[NSFileManager defaultManager] copyItemAtPath:srclic toPath:deslic error:nil])
//            NSLog(@"拷贝数据失败");
//    }
  

   // NSArray* moudles = [NSArray arrayWithObjects:@"2",@"8",@"32",@"512",@"2048",@"32768",@"524288",nil];
//    NSString* userID = @"23C1C-525F7-DC461-CB413-20708";
//    userID = @"E1617-A7BAD-1A46E-794B2-EF9BA";
//     RecycleLicenseManager *licenseManager = [RecycleLicenseManager getInstance];
//      NSArray* moudles = [licenseManager query:userID];
//    //激活前许可状态
//    [Environment setUserLicInfo:userID Modules:moudles];
//    //激活
//   
//    BOOL isActive = [licenseManager activateDevice:userID modules:moudles];
//    if(!isActive) {
//        NSLog(@"激活许可失败");
//        return ;
//    }
    
//    NSString *srcfileName = [[NSBundle mainBundle] pathForResource:@"VisualDemoData" ofType:@"zip"];
//    
//    NSString* desFile = [NSHomeDirectory() stringByAppendingFormat:@"/Documents/iTablet/data/sample%@",@""];
//    
//    if(![[NSFileManager defaultManager] fileExistsAtPath:[desFile stringByAppendingString:@"VisualDemoData"] isDirectory:nil]){
//        if(![[NSFileManager defaultManager] copyItemAtPath:srcfileName toPath:[desFile stringByAppendingString:@"VisualDemoData.zip"] error:nil])
//            NSLog(@"拷贝数据失败");
//        else{
//            ZipArchive *za = [[ZipArchive alloc] init];
//            if ( [za UnzipOpenFile: [NSHomeDirectory() stringByAppendingFormat:@"/Library/Caches/%@",@"VisualDemoData.zip"]] ){
//                if( [za UnzipFileTo: desFile overWrite: YES] )
//                    [[NSFileManager defaultManager] removeItemAtPath:[desFile stringByAppendingString:@"VisualDemoData.zip"] error:nil];
//                [za UnzipCloseFile];
//            }
//        }
//    }
  
    colors = @[[UIColor colorWithRed:188/255.0 green:254/255.0 blue:151/255.0 alpha:1.0],
               [UIColor colorWithRed:255/255.0 green:245/255.0 blue:151/255.0 alpha:1.0],
               [UIColor colorWithRed:126/255.0 green:237/255.0 blue:253/255.0 alpha:1.0],
               [UIColor colorWithRed:255/255.0 green:205/255.0 blue:147/255.0 alpha:1.0],
               [UIColor colorWithRed:125/255.0 green:125/255.0 blue:151/255.0 alpha:1.0]
               ];
    
    CloudLicenseManager* clm = [CloudLicenseManager getInstance];
    //  [clm login:@"kangweibo@supermap.com" password:@"supermap12160"];
    //  [clm login:@"weiwei3@supermap.com" password:@"123456789"];
    // [clm login:@"xiezhiyan" password:@"imobile"];
    [Environment setOpenGLMode:1];
    // [Environment setMainScreenScale:1.0];
    // Do any additional setup after loading the view, typically from a nib.
    [self openMap];
    
//    return;
//
//    [Toast showIndicatorView];
    
    dispatch_queue_t queue = dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_DEFAULT, 0);
    // 执行异步任务
    dispatch_async(queue, ^(void){

        if(!m_30WData){
            m_30WData = [NSMutableArray array];
            Recordset* rd = [((DatasetVector*)[[_workspace.datasources get:0].datasets get:5]) recordset:NO cursorType:DYNAMIC];
            int i = 0;

            while (![rd isEOF]) {
                
                Point2D* point = [rd.geometry getInnerPoint];
                if ([m_mapControl.map.prjCoordSys type]!= PCST_EARTH_LONGITUDE_LATITUDE) {//若投影坐标不是经纬度坐标则进行转换
                    Point2Ds *points = [[Point2Ds alloc]init];
                    [points add:point];
                    PrjCoordSys *srcPrjCoorSys = [[PrjCoordSys alloc]init];
                    [srcPrjCoorSys setType:PCST_EARTH_LONGITUDE_LATITUDE];
                    CoordSysTransParameter *param = [[CoordSysTransParameter alloc]init];
                    
                    //根据源投影坐标系与目标投影坐标系对坐标点串进行投影转换，结果将直接改变源坐标点串
                    [CoordSysTranslator convert:points PrjCoordSys:srcPrjCoorSys PrjCoordSys:[m_mapControl.map prjCoordSys] CoordSysTransParameter:param CoordSysTransMethod:(CoordSysTransMethod)9603];
                    point = [points getItem:0];
                }

                float dw = arc4random()%12+1;
                ChartPoint* weightPoint = [[ChartPoint alloc]initWithPoint:point weight:dw];
                [m_30WData addObject:weightPoint];
//                if(++i == 1000)
//                    break;
                [rd moveNext];
            }
            [rd dispose];
        }
        
        if(!dataArr){
            dataArr = [NSMutableArray array];
            Recordset* rd = [((DatasetVector*)[[_workspace.datasources get:0].datasets get:3]) recordset:NO cursorType:DYNAMIC];
            int i = 0;
            while (![rd isEOF]) {
                
                Point2D* point = [rd.geometry getInnerPoint];
                if ([m_mapControl.map.prjCoordSys type]!= PCST_EARTH_LONGITUDE_LATITUDE) {//若投影坐标不是经纬度坐标则进行转换
                    Point2Ds *points = [[Point2Ds alloc]init];
                    [points add:point];
                    PrjCoordSys *srcPrjCoorSys = [[PrjCoordSys alloc]init];
                    [srcPrjCoorSys setType:PCST_EARTH_LONGITUDE_LATITUDE];
                    CoordSysTransParameter *param = [[CoordSysTransParameter alloc]init];
                    
                    //根据源投影坐标系与目标投影坐标系对坐标点串进行投影转换，结果将直接改变源坐标点串
                    [CoordSysTranslator convert:points PrjCoordSys:srcPrjCoorSys PrjCoordSys:[m_mapControl.map prjCoordSys] CoordSysTransParameter:param CoordSysTransMethod:(CoordSysTransMethod)9603];
                    point = [points getItem:0];
                }

                
                float dw = 25;//arc4random()%50+1;
                ChartPoint* weightPoint = [[ChartPoint alloc]initWithPoint:point weight:dw];
                [dataArr addObject:weightPoint];
//                if(i++ == 11000)
//                    break;
                [rd moveNext];
            }
            [rd dispose];
        }
        
         dispatch_async(dispatch_get_main_queue(), ^{
             [Toast hideIndicatorView];
             bt6.hidden = NO;
             bt5.hidden = NO;
             bt4.hidden = NO;
             bt3.hidden = NO;
             bt2.hidden = NO;
             if(isPad)
                 bt1.hidden = NO;
             
           //  [self p_initScatterMap];
         });
    });
}


-(void)openMap{
    
   
    //初始化工作空间
    if (_workspace == nil) {
        _workspace = [[Workspace alloc]init];
        [m_mapControl mapControlInit];
        [m_mapControl.map setWorkspace:_workspace];
        g_mapcontrol = m_mapControl;
        g_workspace = _workspace;
    }
    
    NSString* workspace =  [NSHomeDirectory() stringByAppendingFormat:@"/Documents/iTablet/data/sample/hotMap/%@",@"hotMap.smwu"];//[NSHomeDirectory() stringByAppendingString:@"/Library/Caches/VisualDemoData/hotMap.smwu"];
   // NSString* workspace = [NSHomeDirectory() stringByAppendingString:@"/Documents/china2013/china7C-20140806.smwu"];
    m_Info = [[WorkspaceConnectionInfo alloc]init];
    m_Info.server = workspace;
    m_Info.type = SM_SMWU;
    //m_Info.password = @"superMap@iMobile%123";
    BOOL isInitOk = [_workspace open:m_Info];
    if(!isInitOk){
        NSLog(@"打开工作空间失败");
    }
    
    

    
    if (isInitOk)
    {

        BOOL isOpenMap = [m_mapControl.map open:[_workspace.maps get:0]];
        if (isOpenMap)
        {
            m_mapControl.map.isAntialias = YES;
            m_mapControl.isMagnifierEnabled = NO;
            //设置默认地图全幅
            NSLog(@"Open Map Success!");
            [m_mapControl.map viewEntire];
            [m_mapControl setAction:PAN];
            m_mapControl.geometrySelectedDelegate = self;
            [m_mapControl.map refresh];
            m_mapControl.isMagnifierEnabled = YES;
            m_mapControl.map.isFullScreenDrawModel = NO;
        }
        else
        {
            NSLog(@"Open Map Failed!");
        }
        
    }
    
}

-(void)doneExcute:(BOOL)bResult datasources:(NSArray*)datasources{
    if(bResult){
        [m_mapControl.map close];
        DatasourceConnectionInfo* dsInfo = [[DatasourceConnectionInfo alloc]init];
        [dsInfo setAlias:@"rest"];
    
        dsInfo.server = datasources[1];
        dsInfo.engineType = ET_REST;
    
        Datasource* ds = [_workspace.datasources open:dsInfo];
        [m_mapControl.map.layers addDataset:[ds.datasets get:0] ToHead:YES];
        
        [m_mapControl.map viewEntire];
    }
}




-(void)geometrySelected:(int)geometryID Layer:(Layer*)layer{
    if(pieChart&&lineChart&&barChart){
        [pieChart setSelectedGeoID:geometryID];
        [lineChart setSelectedGeoID:geometryID];
        [barChart setSelectedGeoID:geometryID];
    }
   // [barChart2 setSelectedGeoID:geometryID];
    NSLog(@"single");
}

-(void)geometryMultiSelected:(NSArray*)layersAndIds{
    NSLog(@"%@",layersAndIds);
}
-(void)p_initPieChart{
   
    
   // Recordset* rd = [((DatasetVector*)[m_mapControl.map.layers getLayerAtIndex:1].dataset) recordset:NO cursorType:STATIC];
    NSMutableArray* chartDatas = [NSMutableArray array];
    
    Recordset* rd = [((DatasetVector*)[m_mapControl.map.layers getLayerWithName:@"图表@hotMap"].dataset) queryWithFilter:@"NAME = '四川' " Type:STATIC];
    [chartDatas addObject:[[ChartPieData alloc] initWithItemName:@"四川" value: @[[rd getFieldValueWithString:@"POPU"]] color: colors[0] ID:((NSNumber*)[rd getFieldValueWithString:@"SmID"]).floatValue]];
    [rd dispose];
    
    rd = [((DatasetVector*)[m_mapControl.map.layers getLayerWithName:@"图表@hotMap"].dataset) queryWithFilter:@"NAME = '河南' " Type:STATIC];
    [chartDatas addObject:[[ChartPieData alloc] initWithItemName:@"河南" value:@[[rd getFieldValueWithString:@"POPU"]] color:colors[1] ID:((NSNumber*)[rd getFieldValueWithString:@"SmID"]).floatValue]];
    [rd dispose];
    
    rd = [((DatasetVector*)[m_mapControl.map.layers getLayerWithName:@"图表@hotMap"].dataset) queryWithFilter:@"NAME = '广东' " Type:STATIC];
    [chartDatas addObject:[[ChartPieData alloc] initWithItemName:@"广东" value:@[[rd getFieldValueWithString:@"POPU"]] color:colors[2] ID:((NSNumber*)[rd getFieldValueWithString:@"SmID"]).floatValue]];
    [rd dispose];
    
    rd = [((DatasetVector*)[m_mapControl.map.layers getLayerWithName:@"图表@hotMap"].dataset) queryWithFilter:@"NAME = '陕西' " Type:STATIC];
    [chartDatas addObject:[[ChartPieData alloc] initWithItemName:@"陕西" value:@[[rd getFieldValueWithString:@"POPU"]] color:colors[3] ID:((NSNumber*)[rd getFieldValueWithString:@"SmID"]).floatValue]];
    [rd dispose];
    
    rd = [((DatasetVector*)[m_mapControl.map.layers getLayerWithName:@"图表@hotMap"].dataset) queryWithFilter:@"NAME = '山东' " Type:STATIC];
    [chartDatas addObject:[[ChartPieData alloc] initWithItemName:@"山东" value:@[[rd getFieldValueWithString:@"POPU"]] color:colors[4] ID:((NSNumber*)[rd getFieldValueWithString:@"SmID"]).floatValue]];
    [rd dispose];
    
    //pieChart.titleColor = [UIColor blackColor];
    pieChart.title = @"人口对比";
  //  pieChart.radious = 90;
    pieChart.legend.orient = YES;
    pieChart.legend.alignment = BOTTOMRIGHT;
    [pieChart addChartDatas:chartDatas];
    [pieChart update];
    Layer* layer = [m_mapControl.map.layers getLayerWithName:@"图表@hotMap"];
    [layer addChart:pieChart];
}

-(void)p_initBarChart{

    
    barChart.title = @"高校对比";
    barChart.hightLightColor = [UIColor whiteColor];
    barChart.isValueAlongXAxis = YES;
    NSMutableArray* chartDatas = [NSMutableArray array];
    
    
    NSArray* lables = @[@"四川",@"河南",@"广东",@"陕西",@"山东"];
    
     NSMutableArray* datas1 = [NSMutableArray array];
     NSMutableArray* datas2 = [NSMutableArray array];
    
    int i = 0;
    for(NSString* lable in lables){
         Recordset* rd = [((DatasetVector*)[m_mapControl.map.layers getLayerWithName:@"图表@hotMap"].dataset) queryWithFilter:[NSString stringWithFormat:@"NAME = '%@'",lable] Type:STATIC];
        
        [datas1 addObject:[[ChartBarDataItem alloc]initWithValue:((NSNumber*)[rd getFieldValueWithString:@"HIGHSCHOOL_1990"]) color:colors[i]  lable:lable ID:((NSNumber*)[rd getFieldValueWithString:@"SmID"]).floatValue]];
        [datas2 addObject:[[ChartBarDataItem alloc]initWithValue:((NSNumber*)[rd getFieldValueWithString:@"HIGHSCHOOL_2000"]) color:colors[i] lable:lable ID:((NSNumber*)[rd getFieldValueWithString:@"SmID"]).floatValue]];
        
        [rd dispose];
        i++;
    }
    
    [chartDatas addObject:[[ChartBarData alloc]initWithItemName:@"1999年" values:datas1]];
    [chartDatas addObject:[[ChartBarData alloc]initWithItemName:@"2000年" values:datas2]];
    
    [barChart addChartDatas:chartDatas];
    
    barChart.xAxisLables = @[@"1999年",@"2000年"];
    [barChart update];
    
    Layer* layer = [m_mapControl.map.layers getLayerWithName:@"图表@hotMap"];
    [layer addChart:barChart];
    
    //barchart2
    
    
 //   barChart2.title = @"高校对比1";
    
    chartDatas = [NSMutableArray array];
    
    
    lables = @[@"四川",@"河南",@"广东",@"陕西",@"山东"];
    
    
    datas2 = [NSMutableArray array];
    
    i = 0;
    for(NSString* lable in lables){
        Recordset* rd = [((DatasetVector*)[m_mapControl.map.layers getLayerWithName:@"图表@hotMap"].dataset) queryWithFilter:[NSString stringWithFormat:@"NAME = '%@'",lable] Type:STATIC];
        
        datas1 = [NSMutableArray array];
        [datas1 addObject:[[ChartBarDataItem alloc]initWithValue:((NSNumber*)[rd getFieldValueWithString:@"HIGHSCHOOL_1990"]) color:colors[0]  lable:@"1999年" ID:-1]];
        [datas1 addObject:[[ChartBarDataItem alloc]initWithValue:((NSNumber*)[rd getFieldValueWithString:@"HIGHSCHOOL_2000"]) color:colors[1] lable:@"2000年" ID:-1]];
        
        ChartBarData* barData = [[ChartBarData alloc]initWithItemName:lable values:datas1];
        barData.geoId = ((NSNumber*)[rd getFieldValueWithString:@"SmID"]).floatValue;
        barData.color = colors[i];
        
        [chartDatas addObject:barData];
        [rd dispose];
        i++;
    }
    
    
//    [barChart2 addChartDatas:chartDatas];
//    
//    barChart2.axisLables = lables;
//    barChart2.hightLightColor = [UIColor purpleColor];
//    
//    [barChart2 update];
    
//    [[m_mapControl.map.layers getLayerAtIndex:0] addChart:barChart2];
}
-(void)p_initLineChart{
    
    lineChart.title = @"GDP走势对比";
    
    lineChart.hightLightColor = [UIColor greenColor];
    
    NSMutableArray* chartDatas = [NSMutableArray array];

    Recordset* rd = [((DatasetVector*)[m_mapControl.map.layers getLayerWithName:@"图表@hotMap"].dataset) queryWithFilter:@"NAME = '四川' " Type:STATIC];
    NSMutableArray* datas = [NSMutableArray array];
    [datas addObject:[rd getFieldValueWithString:@"GDP_1994"]];
    [datas addObject:[rd getFieldValueWithString:@"GDP_1997"]];
    [datas addObject:[rd getFieldValueWithString:@"GDP_1998"]];
    [datas addObject:[rd getFieldValueWithString:@"GDP_1999"]];
    [datas addObject:[rd getFieldValueWithString:@"GDP_2000"]];
    [chartDatas addObject:[[ChartLineData alloc]initWithItemName:@"四川" value:datas color:colors[0] ID:((NSNumber*)[rd getFieldValueWithString:@"SmID"]).floatValue]];
    [rd dispose];
    
    rd = [((DatasetVector*)[m_mapControl.map.layers getLayerWithName:@"图表@hotMap"].dataset) queryWithFilter:@"NAME = '山东' " Type:STATIC];
    datas = [NSMutableArray array];
    [datas addObject:[rd getFieldValueWithString:@"GDP_1994"]];
    [datas addObject:[rd getFieldValueWithString:@"GDP_1997"]];
    [datas addObject:[rd getFieldValueWithString:@"GDP_1998"]];
    [datas addObject:[rd getFieldValueWithString:@"GDP_1999"]];
    [datas addObject:[rd getFieldValueWithString:@"GDP_2000"]];
    [chartDatas addObject:[[ChartLineData alloc]initWithItemName:@"山东" value:datas color:colors[4] ID:((NSNumber*)[rd getFieldValueWithString:@"SmID"]).floatValue]];
    [rd dispose];
    
    rd = [((DatasetVector*)[m_mapControl.map.layers getLayerWithName:@"图表@hotMap"].dataset) queryWithFilter:@"NAME = '广东' " Type:STATIC];
    datas = [NSMutableArray array];
    [datas addObject:[rd getFieldValueWithString:@"GDP_1994"]];
    [datas addObject:[rd getFieldValueWithString:@"GDP_1997"]];
    [datas addObject:[rd getFieldValueWithString:@"GDP_1998"]];
    [datas addObject:[rd getFieldValueWithString:@"GDP_1999"]];
    [datas addObject:[rd getFieldValueWithString:@"GDP_2000"]];
    [chartDatas addObject:[[ChartLineData alloc]initWithItemName:@"广东" value:datas color:colors[2] ID:((NSNumber*)[rd getFieldValueWithString:@"SmID"]).floatValue]];
    [rd dispose];
    
    rd = [((DatasetVector*)[m_mapControl.map.layers getLayerWithName:@"图表@hotMap"].dataset) queryWithFilter:@"NAME = '河南' " Type:STATIC];
    datas = [NSMutableArray array];
    [datas addObject:[rd getFieldValueWithString:@"GDP_1994"]];
    [datas addObject:[rd getFieldValueWithString:@"GDP_1997"]];
    [datas addObject:[rd getFieldValueWithString:@"GDP_1998"]];
    [datas addObject:[rd getFieldValueWithString:@"GDP_1999"]];
    [datas addObject:[rd getFieldValueWithString:@"GDP_2000"]];
    [chartDatas addObject:[[ChartLineData alloc]initWithItemName:@"河南" value:datas color:colors[1] ID:((NSNumber*)[rd getFieldValueWithString:@"SmID"]).floatValue]];
    [rd dispose];
    
    rd = [((DatasetVector*)[m_mapControl.map.layers getLayerWithName:@"图表@hotMap"].dataset) queryWithFilter:@"NAME = '陕西' " Type:STATIC];
    datas = [NSMutableArray array];
    [datas addObject:[rd getFieldValueWithString:@"GDP_1994"]];
    [datas addObject:[rd getFieldValueWithString:@"GDP_1997"]];
    [datas addObject:[rd getFieldValueWithString:@"GDP_1998"]];
    [datas addObject:[rd getFieldValueWithString:@"GDP_1999"]];
    [datas addObject:[rd getFieldValueWithString:@"GDP_2000"]];
    [chartDatas addObject:[[ChartLineData alloc]initWithItemName:@"陕西" value:datas color:colors[3] ID:((NSNumber*)[rd getFieldValueWithString:@"SmID"]).floatValue]];
    [rd dispose];
    
    NSArray *lineLables = @[@"GDP_1994",@"GDP_1997",@"GDP_1998",@"GDP_1999",@"GDP_2000"];

    lineChart.xAxisLables = lineLables;
    lineChart.yAxisTitle = @"GDP(千亿元)";
    [lineChart addChartDatas:chartDatas];
    lineChart.allowsUserInteraction = YES;
    [lineChart update];
    
    Layer* layer = [m_mapControl.map.layers getLayerWithName:@"图表@hotMap"];
    [layer addChart:lineChart];
}

NSTimer* timer;
-(void)p_initInstruChart{
    //instrumentChart = [[InstrumentChart alloc]initWithFrame:CGRectMake(self.view.frame.size.width/2.0, 15, 260, 260)];
    
    instrumentChart.minValue = 0;
    instrumentChart.maxValue = 200;
    
    instrumentChart.title = @"pm2.5\n 成都";
    
    ColorScheme* gradient = [[ColorScheme alloc]init];
    gradient.colors = @[[[UIColor alloc]initWithRed:145/255.0 green:199/255.0 blue:174/255.0 alpha:1.0],  [UIColor blackColor],   [UIColor redColor]    ];
    gradient.segmentValue =  @[ @( instrumentChart.maxValue * 0.06) ,   @( instrumentChart.maxValue * 0.85),               @(instrumentChart.maxValue)              ];
    instrumentChart.gradient = gradient;
    [instrumentChart update];
    
    //[self.view addSubview:instrumentChart];
    
    
    //instrumentChart2 = [[InstrumentChart alloc]initWithFrame:CGRectMake(self.view.frame.size.width/2.0-183, 55, 200, 200)];
    
    instrumentChart2.minValue = 0;
    instrumentChart2.maxValue = 60;
    instrumentChart2.splitCount = 4;
    //instrumentChart2.value = 2;
    instrumentChart2.title = @"米/秒 (风速)";
    
    ColorScheme* gradient2 = [[ColorScheme alloc]init];
    gradient2.colors = @[  [[UIColor alloc]initWithRed:0/255.0 green:0/255.0 blue:0/255.0 alpha:1.0],   [UIColor redColor]    ];
    gradient2.segmentValue =  @[    @( instrumentChart2.maxValue * 0.85),       @(instrumentChart2.maxValue)    ];
    instrumentChart2.gradient = gradient2;
    instrumentChart2.startAngle = 30;
    instrumentChart2.endAngle = 250;
  //  instrumentChart2.innerBackgroundColor = [[UIColor alloc]initWithRed:99/255.0 green:134/255.0 blue:158/255.0 alpha:1.0];
    [instrumentChart2 update];
    
   // [self.view addSubview:instrumentChart2];

    [timer invalidate];
    timer = nil;
    timer = [NSTimer scheduledTimerWithTimeInterval:2.0
                                     target:self
                                   selector:@selector(gaugeUpdateTimer:)
                                   userInfo:nil
                                    repeats:YES];

    
    
    instrumentChart.updataInterval = 2;
    instrumentChart2.updataInterval = 2;
//    [instrumentChart update];
//    [instrumentChart2 update];
    
    
//    for(int i=0;i<10;i++){
//        NSMutableArray* arr1 = [NSMutableArray array];
//        NSMutableArray* arr2 = [NSMutableArray array];
//        [arr1 addObject:@(arc4random()%(int)(instrumentChart.maxValue*1.05) - 10)];
//        [arr2 addObject:@(arc4random()%(int)(instrumentChart2.maxValue))];
//        
//        [instrumentChart addChartDataset:arr1 timeTag:[NSString stringWithFormat:@"t%i",i+1]];
//        [instrumentChart2 addChartDataset:arr2 timeTag:[NSString stringWithFormat:@"t%i",i+1]];
//    }
//    
//    chartTimeLine = [[TimeLine alloc]initWithHostView:timeLine];;
//    chartTimeLine.sliderTextSize = 10;
//    [chartTimeLine addChart:instrumentChart];
//    [chartTimeLine addChart:instrumentChart2];
//    // chartTimeLine.isHorizontal = NO;
//    [chartTimeLine load];
  //  [mHeatMap startPlay];
}

-(void)gaugeUpdateTimer:(NSTimer *)timer
{
    [instrumentChart addChartDatas:@[@(arc4random()%(int)(instrumentChart.maxValue*1.05) - 10)]];
    [instrumentChart2 addChartDatas:@[@(arc4random()%(int)(instrumentChart2.maxValue))]];
    
}


-(void)p_initScatterMap{
    for(int i=0;i<[m_mapControl.map.layers getCount];i++){
        if(i==0)
            continue;
        Layer* layer = [m_mapControl.map.layers getLayerAtIndex:i];
        layer.visible = NO;
    }
    Layer* layer = [m_mapControl.map.layers getLayerWithName:@"Provinces_R@hotMap#2"];
    layer.visible = YES;
    m_mapControl.map.scale =  0.000000065099303341972671;
    m_mapControl.map.center = [[Point2D alloc] initWithX:108.79366417027659 Y:32.180036928883418];
    [m_mapControl.map refresh];
    
    mScatterCHart = [[ScatterChart alloc]initWithMapControl:m_mapControl];
    mScatterCHart.title = @"散点图";
    [mScatterCHart setRadius:10];
    ColorScheme* gradient = [[ColorScheme alloc]init];
//    gradient.colors = @[
//                        //                        [[Color alloc]initWithR:0 G:125 B:255],
//                        //                        [[Color alloc]initWithR:249 G:106 B:14],
//                        //                        [[Color alloc]initWithR:164 G:255 B:0],
//                        
//                        [[Color alloc]initWithR:43 G:127 B:217],
//                        [[Color alloc]initWithR:24 G:208 B:212],
//                        [[Color alloc]initWithR:217 G:219 B:222],
//                        ];
    
    gradient.segmentValue = @[@(1)
                              ,@(2),@(3),@(4),@(5)
                              ,@(6),@(7),@(8),@(9),@(10),
                              //@(11),@(12)
                              ];
   // gradient.segmentLable = @[@"  弱",@"  中",@"  强"];
    NSMutableArray* symbles = [NSMutableArray array];
    for(int i=0;i<10;i++){
        NSString* name = [NSString stringWithFormat:@"poi%03i.png",i+1];
        [ symbles addObject:[UIImage imageNamed:name]];
    }
    gradient.symbols = symbles;//@[[UIImage imageNamed:@"dot_selected_level.png"],[UIImage imageNamed:@"navi_start.png"],[UIImage imageNamed:@"navi_end.png"]];
    [mScatterCHart setColorScheme:gradient];
    [mScatterCHart addChartDatas:m_30WData];
    mScatterCHart.legend.orient = NO;
    [mScatterCHart.legend update];

}
-(void)p_initPolymeMap{
    
    for(int i=0;i<[m_mapControl.map.layers getCount];i++){
        if(i==0)
            continue;
        Layer* layer = [m_mapControl.map.layers getLayerAtIndex:i];
        layer.visible = NO;
    }
    Layer* layer = [m_mapControl.map.layers getLayerWithName:@"Provinces_R@hotMap#2"];
    layer.visible = YES;
    
    m_mapControl.map.scale =  0.000000081887287763467158;
    m_mapControl.map.center = [[Point2D alloc] initWithX:109.38087581861375 Y:30.922633709727265];
    [m_mapControl.map refresh];

    mPolymeMap = [[PolymerChart alloc]initWithMapControl:m_mapControl];//[[PolymerChart alloc]initWithMapControl:m_mapControl];
    self.navigationItem.title = @"聚合图";
#ifdef _EN_
    self.navigationItem.title = @"Aggregation Map";
#endif
    mPolymeMap.polymeriztionType = 1;

    Recordset* rd = [((DatasetVector*)[[_workspace.datasources get:0].datasets get:6]) recordset:NO cursorType:DYNAMIC];
    
    // NSArray* weight = @[@350,@250,@470,@80];
    int i=0;
    NSMutableArray* arr = [NSMutableArray array];
    while (![rd isEOF]) {
        
        Point2D* point = [rd.geometry getInnerPoint];
//        if ([m_mapControl.map.prjCoordSys type]!= PCST_EARTH_LONGITUDE_LATITUDE) {//若投影坐标不是经纬度坐标则进行转换
//            Point2Ds *points = [[Point2Ds alloc]init];
//            [points add:point];
//            PrjCoordSys *srcPrjCoorSys = [[PrjCoordSys alloc]init];
//            [srcPrjCoorSys setType:PCST_EARTH_LONGITUDE_LATITUDE];
//            CoordSysTransParameter *param = [[CoordSysTransParameter alloc]init];
//
//            //根据源投影坐标系与目标投影坐标系对坐标点串进行投影转换，结果将直接改变源坐标点串
//            [CoordSysTranslator convert:points PrjCoordSys:srcPrjCoorSys PrjCoordSys:[m_mapControl.map prjCoordSys] CoordSysTransParameter:param CoordSysTransMethod:CoordSysTransMethod::MTH_GEOCENTRIC_TRANSLATION];
//            point = [points getItem:0];
//        }

        float dw = arc4random()%200+1;
        ChartPoint* weightPoint = [[ChartPoint alloc]initWithPoint:point weight:dw];
        [arr addObject:weightPoint];
        
        //        if(i++ == 0)
        //            break;
        [rd moveNext];
    }
    [rd dispose];
    [mPolymeMap addChartDatas:arr];
}


-(void)p_initHotMap
{
    
    
//    CGImageRef image = [m_mapControl outputMap:CGRectMake(0, 0, 500,500)];
//    UIImage* imagett = [[UIImage alloc]initWithCGImage:image];
//    UIImageView* view = [[UIImageView alloc]initWithImage:imagett];
//    [self.view addSubview:view];
//    return;
    for(int i=0;i<[m_mapControl.map.layers getCount];i++){
        if(i==0)
            continue;
        Layer* layer = [m_mapControl.map.layers getLayerAtIndex:i];
        layer.visible = NO;
    }
    Layer* layer = [m_mapControl.map.layers getLayerWithName:@"Provinces_R@hotMap"];
    layer.visible = YES;
    
    m_mapControl.map.scale =  0.000000065099303341972671;
    m_mapControl.map.center = [[Point2D alloc] initWithX:108.79366417027659 Y:32.180036928883418];
    [m_mapControl.map refresh];
   // return;
    mHeatMap = [[HeatChart alloc]initWithMapControl:m_mapControl];
    self.navigationItem.title = @"热力图";
#ifdef _EN_
    self.navigationItem.title = @"Heat Map";
#endif
  //  [mHeatMap setRadius:25];
   
    mHeatMap.isSmoothTransColor = YES;
    ColorScheme* gradient = [[ColorScheme alloc]init];
    gradient.colors = @[
                        [[Color alloc]initWithR:68 G:111 B:242],
                        [[Color alloc]initWithR:50 G:174 B:238],
                        [[Color alloc] initWithR:74 G:248 B:221],
                        [[Color alloc]initWithR:243 G:245 B:138],
                        [[Color alloc]initWithR:243 G:233 B:14],
                        [[Color alloc]initWithR:234 G:91 B:0],
                        [[Color alloc]initWithR:237 G:29 B:19],
                        ];
    gradient.segmentValue = @[@(1),@(50),@(100),@(150),@(200),@(250),@(300)];
    
//    gradient.colors = @[[[Color alloc]initWithR:0 G:0 B:255],
//                        [[Color alloc] initWithR:0 G:255 B:0],
//                        [[Color alloc]initWithR:255 G:252 B:2],
//                        [[Color alloc]initWithR:255 G:0 B:0],
//                        
//                        ];
//    gradient.startPoints = @[@(1),@(5),@(10),@(15)];
   // [mHeatMap setColorScheme:gradient];
   
    
    [mHeatMap addChartDatas:dataArr];
    [mHeatMap setRadius:15];
  
    
  //  [self dataChange];

}



UIButton* btn;
-(IBAction)timeData:(id)sender{
    
    if([curMap isEqualToString:@"td"])
        return;
    curMap = @"td";
    
    btn.selected = NO;
    [mHeatMap removeAllData];
   // Point2D* centerPos = [[Point2D alloc]initWithX:104.3990952 Y:34.728209];
  
  
    self.navigationItem.title = @"时空数据";
#ifdef _EN_
    self.navigationItem.title = @"Spatial-temporal Data";
#endif
    m_mapControl.map.scale =  0.000000079894767750595735;
    m_mapControl.map.center = [[Point2D alloc] initWithX:109.26399365742239 Y:31.447075367249585];
    [m_mapControl.map refresh];
    
    [Toast show:@"时空数据准备中..." hostView:m_mapControl];
    [Toast showIndicatorViewWith:[UIColor whiteColor]];
    
    bt6.enabled = NO;
    bt5.enabled = NO;
    bt4.enabled = NO;
    bt3.enabled = NO;
    bt2.enabled = NO;
    bt1.enabled = NO;
    realTimeBtn.enabled = NO;
    dispatch_queue_t queue = dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_DEFAULT, 0);
    // 执行异步任务
    dispatch_async(queue, ^(void){
        
        NSArray* centers = @[
                             [[Point2D alloc]initWithX:116.26 Y:39.56],
                             [[Point2D alloc]initWithX:121.27 Y:31.13],
                             [[Point2D alloc]initWithX:114.6 Y:22.59],
                             [[Point2D alloc]initWithX:103.59 Y:30.45],
                            // [[Point2D alloc]initWithX:123.32 Y:41.44],
                           //  [[Point2D alloc]initWithX:101.43 Y:36.41],
    //                         [[Point2D alloc]initWithX:105.33 Y:40.9],
    //                         [[Point2D alloc]initWithX:120.3 Y:33.52]
                             ];
       
        [timer invalidate];
        timer = nil;
        btn.selected = NO;
        
        int nDay = 12;
        if(isPad)
            nDay = 24;
        //选出30%流动
        NSMutableDictionary* liudongArr = [[NSMutableDictionary alloc]initWithCapacity:5];
        int liudongCount = dataArr.count*1.0;
        
        for(int i=0;i<liudongCount;i++){
            NSNumber* liudong =  @(arc4random()%dataArr.count);
            
            if(!liudongArr[liudong]){
                int speed = arc4random()%(nDay)+1;
                int r = arc4random()%10;
                if(r < 4)//beijing
                    liudongArr[liudong] = @[@(speed),centers[0]];
                else if (r>=4 && r<7)//shanghai
                    liudongArr[liudong] = @[@(speed),centers[1]];
                else if (r>=7 && r<9)//guangzou
                    liudongArr[liudong] = @[@(speed),centers[2]];
                else//chengdu
                    liudongArr[liudong] = @[@(speed),centers[3]];
            }else
                i--;
            
        }
      //  int idx=0;
        
        for(int j=0;j<nDay;j++){
            int nCount = dataArr.count;//5000 + idx++ * 2000;
            NSMutableArray*arrTmp = [NSMutableArray array];
            for(int i=0;i<nCount;i++){
                
                ChartPoint* weightPoint = dataArr[i];
                if(!liudongArr[@(i)]){
                    [arrTmp addObject:weightPoint];
                }else{
                
                    int speed = [liudongArr[@(i)][0] integerValue];
                    Point2D* centerPos = liudongArr[@(i)][1];
                    
                    double fx = 0;//(arc4random()%20000 - 10000)/40000.0;
                    double fy = 0;//(arc4random()%20000 - 10000)/40000.0;
                    
                    float dWeight = 15+arc4random()%(nDay-5 );
                    float offsetX = (centerPos.x+fx-weightPoint.point.x);
                    float offsetY = (centerPos.y+fy-weightPoint.point.y);
                    
                    float n = j;
                    if(j > speed){
                        n = speed;
                    }
                    if(j==0)
                        n = 0.10;
                    float dX = weightPoint.point.x+(offsetX/speed)*n;
                    float dY = weightPoint.point.y+(offsetY/speed)*n;
                    [arrTmp addObject:[[ChartPoint alloc] initWithPoint:[[Point2D alloc] initWithX:dX Y:dY] weight:dWeight]];
                }
                
            }
            [mHeatMap insertChartDataset:arrTmp timeTag:[NSString stringWithFormat:@"%i时",nDay-j] atIndex:0];
           // [mHeatMap addChartDataset:arrTmp timeTag:[NSString stringWithFormat:@"%i时",nDay-j]];
        }
    
        dispatch_async(dispatch_get_main_queue(), ^{
            mHeatMap.playInterval = 0.55;
            chartTimeLine = [[TimeLine alloc]initWithHostView:timeLine ];;
            chartTimeLine.sliderTextSize = 8;
            chartTimeLine.sliderSize = 20;
            [chartTimeLine addChart:mHeatMap];
            [chartTimeLine load];
            mHeatMap.isLoopPlay = YES;
            [mHeatMap startPlay];
            [Toast hideIndicatorView];
            bt6.enabled = YES;
            bt5.enabled = YES;
            bt4.enabled = YES;
            bt3.enabled = YES;
            bt2.enabled = YES;
            bt1.enabled = YES;
            realTimeBtn.enabled = YES;
        });
        
    });
}


-(IBAction)realTimeData:(id)sender{
    

//    chartTimeLine.isHorizontal = !chartTimeLine.isHorizontal;
//    [chartTimeLine load];
//    return;
    curMap = @"###";
    btn = sender;
    
    [timer invalidate];
    timer = nil;
    self.navigationItem.title = @"实时数据";
#ifdef _EN_
    self.navigationItem.title = @"Real-time Data";
#endif
    if(!btn.selected){
        [mHeatMap removeAllData];
        [chartTimeLine dispose];
      
        timer = [NSTimer scheduledTimerWithTimeInterval:0.5
                                                 target:self
                                               selector:@selector(dataChange)
                                               userInfo:nil
                                                repeats:YES];
          mHeatMap.updataInterval = 0.8;
        
    }else{
        mHeatMap.updataInterval = 0;
    }
    
    btn.selected = !btn.selected;
}

-(void)dataChange
{
    int nCount = 5000 + arc4random()%(dataArr.count+5000);
    NSMutableArray*arrTmp = [NSMutableArray array];
    for(int i=0;i<nCount;i++){
        
        int index = arc4random()%dataArr.count;
        
        {
            ChartPoint* weightPoint = dataArr[index];
            float dWeight = arc4random()%50+1;
            weightPoint.weighted = dWeight;
            
            [arrTmp addObject:weightPoint];

        }
    }
    [mHeatMap addChartDatas:arrTmp];
    
}
-(void)p_initRelationMap
{
    for(int i=0;i<[m_mapControl.map.layers getCount];i++){
        if(i==0)
            continue;
        Layer* layer = [m_mapControl.map.layers getLayerAtIndex:i];
        layer.visible = NO;
    }
    Layer* layer = [m_mapControl.map.layers getLayerWithName:@"Provinces_R@hotMap#2"];
    layer.visible = YES;
    m_mapControl.map.scale =  0.00000004710369833422136;
    m_mapControl.map.center = [[Point2D alloc] initWithX:104.45644039125189 Y:34.960112480819163];
    [m_mapControl.map refresh];
    
    mRelationMap = [[RelationalPointChart alloc]initWithMapControl:m_mapControl];
    self.navigationItem.title = @"关系图";
#ifdef _EN_
    self.navigationItem.title = @"Relation Map";
#endif
    mRelationMap.isAnimation = YES;
    mRelationMap.childPointSize = 3;

    ColorScheme* gradient = [[ColorScheme alloc]init];
    gradient.colors = @[
                        [[Color alloc]initWithR:75 G:119 B:190],
                        [[Color alloc]initWithR:60 G:188 B:209],
                        [[Color alloc]initWithR:61 G:147 B:208],
                        [[Color alloc]initWithR:46 G:169 B:109],
                        [[Color alloc]initWithR:246 G:149 B:78],
                        [[Color alloc]initWithR:238 G:107 B:77],
                        ];
    gradient.segmentValue = @[@(1),@(15),@(16),@(25),@(30),@(50)];
    
    [mRelationMap setColorScheme:gradient];

    
    mRelationMap.childRelationalPointColor = [[Color alloc] initWithR:156 G:137 B:123];
    mRelationMap.lineWidth = 1.0f;
//    mRelationMap.relationLineDesColor = [[Color alloc] initWithR:156 G:137 B:123];
    Recordset* rd = [((DatasetVector*)[[_workspace.datasources get:0].datasets get:0]) recordset:NO cursorType:DYNAMIC];
  
   
    RelationalChartPoint* weightTargetPoint;

    NSMutableSet* setName = [[NSMutableSet alloc]init];
    NSMutableArray* targetArr = [NSMutableArray array];
    while (![rd isEOF]) {
        
        Point2D* point = [rd.geometry getInnerPoint];
//        if ([m_mapControl.map.prjCoordSys type]!= PCST_EARTH_LONGITUDE_LATITUDE) {//若投影坐标不是经纬度坐标则进行转换
//            Point2Ds *points = [[Point2Ds alloc]init];
//            [points add:point];
//            PrjCoordSys *srcPrjCoorSys = [[PrjCoordSys alloc]init];
//            [srcPrjCoorSys setType:PCST_EARTH_LONGITUDE_LATITUDE];
//            CoordSysTransParameter *param = [[CoordSysTransParameter alloc]init];
//            
//            //根据源投影坐标系与目标投影坐标系对坐标点串进行投影转换，结果将直接改变源坐标点串
//            [CoordSysTranslator convert:points PrjCoordSys:srcPrjCoorSys PrjCoordSys:[m_mapControl.map prjCoordSys] CoordSysTransParameter:param CoordSysTransMethod:CoordSysTransMethod::MTH_GEOCENTRIC_TRANSLATION];
//            point = [points getItem:0];
//        }

        RelationalChartPoint* weightPoint = [[RelationalChartPoint alloc]initWithPoint:point weight:0];
        weightPoint.relationalName = [rd getFieldValueWithString:@"name"];
        
        if(
           [weightPoint.relationalName isEqualToString:@"成都市"] ||
           [weightPoint.relationalName isEqualToString:@"北京市"] ||
           [weightPoint.relationalName isEqualToString:@"上海市"] ||
          [weightPoint.relationalName isEqualToString:@"广州市"] ||
           [weightPoint.relationalName isEqualToString:@"兰州市"] ||
           [weightPoint.relationalName isEqualToString:@"乌鲁木齐市"] ||
           [weightPoint.relationalName isEqualToString:@"拉萨市"] ||
           [weightPoint.relationalName isEqualToString:@"昆明市"] ||
           [weightPoint.relationalName isEqualToString:@"西安市"] ||
           [weightPoint.relationalName isEqualToString:@"呼和浩特市"] ||
           [weightPoint.relationalName isEqualToString:@"沈阳市"] ||
           [weightPoint.relationalName isEqualToString:@"郑州市"] ||
           [weightPoint.relationalName isEqualToString:@"厦门市"] ||
           [weightPoint.relationalName isEqualToString:@"青岛市"] ||
           [weightPoint.relationalName isEqualToString:@"长沙市"] ||
           [weightPoint.relationalName isEqualToString:@"杭州市"] ||
          [weightPoint.relationalName isEqualToString:@"哈尔滨市"]
           ){

            if(![setName containsObject:weightPoint.relationalName]){
                [targetArr addObject:weightPoint];
                [setName addObject:weightPoint.relationalName];
            }
        }
        [rd moveNext];
    }
    [rd dispose];
   
    
    for(int i=0;i<targetArr.count;i++){
        
        NSArray* tempArr = nil;
        weightTargetPoint = targetArr[i];

        if([weightTargetPoint.relationalName isEqualToString:@"北京市"]){
            weightTargetPoint.weighted = 60;
        }else if ([weightTargetPoint.relationalName isEqualToString:@"上海市"]){
            weightTargetPoint.weighted = 30;
        }else if ([weightTargetPoint.relationalName isEqualToString:@"广州市"]){
            weightTargetPoint.weighted = 29;
        }else if ([weightTargetPoint.relationalName isEqualToString:@"成都市"] ||
                  [weightTargetPoint.relationalName isEqualToString:@"西安市"]
                  ){
            weightTargetPoint.weighted = 26;
        }else if ([weightTargetPoint.relationalName isEqualToString:@"沈阳市"]){
            weightTargetPoint.weighted = 23;
        }else if ([weightTargetPoint.relationalName isEqualToString:@"呼和浩特市"] ||
                  [weightTargetPoint.relationalName isEqualToString:@"杭州市"] ||
                  [weightTargetPoint.relationalName isEqualToString:@"郑州市"]
                  ){
            weightTargetPoint.weighted = 16;
        }else if ([weightTargetPoint.relationalName isEqualToString:@"长沙市"]){
            weightTargetPoint.weighted = 25;
            
        }else
            weightTargetPoint.weighted = 3;
        
         NSMutableSet* set = [[NSMutableSet alloc]initWithCapacity:5];
        
        for(int j=0;j<targetArr.count;j++){
            int ntaget = j;//arc4random()%(n-1)+1;
            RelationalChartPoint* weightTargetPointTmp = targetArr[ntaget];
            if([set containsObject:@(ntaget)] || [weightTargetPointTmp.relationalName isEqual:weightTargetPoint.relationalName]){
               // j--;
                continue;
            }else{
                [set addObject:@(ntaget)];
            }
            [weightTargetPoint.relationalPoints addObject:weightTargetPointTmp];
        }
    }
    [mRelationMap setLineWidth:1.0];
    [mRelationMap addChartDatas:targetArr];
}

-(void)p_initGridHotMap
{
    for(int i=0;i<[m_mapControl.map.layers getCount];i++){
        if(i==0)
            continue;
        Layer* layer = [m_mapControl.map.layers getLayerAtIndex:i];
        layer.visible = NO;
    }
    Layer* layer = [m_mapControl.map.layers getLayerWithName:@"Provinces_R@hotMap#2"];
    //    Layer* layer = [m_mapControl.map.layers getLayerWithName:@"Provinces_R@hotMap#2"];
    layer.visible = YES;
    m_mapControl.map.scale =  0.00000043952755608609846;
    m_mapControl.map.center = [[Point2D alloc] initWithX:116.58764784354724 Y:39.823781647298183];
    [m_mapControl.map refresh];
    mGridHotMap = [[GridHotChart  alloc]initWithMapControl:m_mapControl];
    
    ColorScheme* gradient = [[ColorScheme alloc]init];
    
    gradient.colors = @[
                        [[Color alloc] initWithR:252 G:165 B:93],
                        // [[Color alloc]initWithR:233 G:120 B:44],
                        [[Color alloc]initWithR:227 G:74 B:51],
                        [[Color alloc]initWithR:165 G:0 B:38],
                        
                        ];
    gradient.segmentValue = @[@(1),@(5),@(15)];
    
    [mGridHotMap setColorScheme:gradient];
    self.navigationItem.title = @"格网热力图";
#ifdef _EN_
    self.navigationItem.title = @"Grid Heat Map";
#endif
    [mGridHotMap addChartDatas:m_30WData];
    
    
}

-(void)p_initDensityMap
{
    for(int i=0;i<[m_mapControl.map.layers getCount];i++){
        if(i==0)
            continue;
        Layer* layer = [m_mapControl.map.layers getLayerAtIndex:i];
        layer.visible = NO;
    }
    Layer* layer = [m_mapControl.map.layers getLayerWithName:@"Provinces_R@hotMap"];
    layer.visible = YES;
    m_mapControl.map.scale =  0.000000065099303341972671;
    m_mapControl.map.center = [[Point2D alloc] initWithX:108.79366417027659 Y:32.180036928883418];
    [m_mapControl.map refresh];
    
    mDensityMap = [[PointDensityChart alloc]initWithMapControl:m_mapControl];
  
    self.navigationItem.title = @"密度图";
#ifdef _EN_
    self.navigationItem.title = @"Density Map";
#endif
    [mDensityMap setRadius:3];
    ColorScheme* gradient = [[ColorScheme alloc]init];
    gradient.colors = @[
//                        [[Color alloc]initWithR:0 G:125 B:255],
//                        [[Color alloc]initWithR:249 G:106 B:14],
//                        [[Color alloc]initWithR:164 G:255 B:0],
                    
                        [[Color alloc]initWithR:43 G:127 B:217],
                        [[Color alloc]initWithR:24 G:208 B:212],
                        [[Color alloc]initWithR:217 G:219 B:222],
                        ];
    
    gradient.segmentValue = @[@(1),@(5),@(18)];
    gradient.segmentLable = @[@"  弱",@"  中",@"  强"];
    [mDensityMap setColorScheme:gradient];

    [mDensityMap addChartDatas:m_30WData];
    
    mDensityMap.legend.orient = NO;
    [mDensityMap.legend update];
}
- (IBAction)takeShouldRepeatTextureFrom:(UISwitch *)sender
{
    if(sender.tag == 1){
        mRelationMap.isAnimation = !mRelationMap.isAnimation;
        [Toast show:@"动态效果" hostView:m_mapControl];
    }else{
        ColorScheme* gradient = [[ColorScheme alloc]init];
        gradient.colors = @[
                            [[Color alloc]initWithR:205 G:213 B:218],
                            [[Color alloc]initWithR:179 G:221 B:233],
                            [[Color alloc]initWithR:141 G:224 B:239],
                            [[Color alloc]initWithR:107 G:187 B:225],
                            [[Color alloc]initWithR:3 G:188 B:232],
                            [[Color alloc]initWithR:16 G:168 B:204],
                            [[Color alloc]initWithR:17 G:146 B:199],
                            ];
        if(mPolymeMap.polymeriztionType == 1){
            gradient.segmentValue = @[@(1),@(20),@(100),@(500),@(800),@(1500),@(2000)];
            mPolymeMap.polymeriztionType = 2;
        }else{
            gradient.segmentValue = @[@(1),@(3),@(6),@(10),@(15),@(30),@(100)];
            mPolymeMap.polymeriztionType = 1;
        }
        [mPolymeMap setColorScheme:gradient];
        [Toast show:@"聚合效果切换" hostView:m_mapControl];
    }
    
}

- (void)onDataFlowReceive:(Geometry*)geo{
    NSLog(@"%@",geo);
}
-(IBAction)hotMap:(id)sender
{
    if([curMap isEqualToString:@"red"])
        return;
    curMap = @"red";
    [self clear:nil];
    realTimeBtn.hidden = NO;
    timeDataBtn.hidden = NO;
     m_swithch.hidden = YES;
     m_swithCh_r.hidden = YES;
    [self p_initHotMap];
    [Toast show:@"热力图" hostView:m_mapControl];
}

-(IBAction)polymerMap:(id)sender{
    if([curMap isEqualToString:@"jh"])
        return;
    curMap = @"jh";
    [self clear:nil];
     m_swithch.hidden = NO;
    m_swithCh_r.hidden = YES;
    [self p_initPolymeMap];
    [Toast show:@"聚合图" hostView:m_mapControl];
}

-(IBAction)relationMap:(id)sender{
    if([curMap isEqualToString:@"guanxi"])
        return;
    curMap = @"guanxi";
    [self clear:nil];
    m_swithch.hidden = YES;
    m_swithCh_r.hidden = NO;
    [self p_initRelationMap];
    [Toast show:@"关系图" hostView:m_mapControl];
}

-(IBAction)gridHotMap:(id)sender
{
    if([curMap isEqualToString:@"gewang"])
        return;
    curMap = @"gewang";
    [self clear:nil];
    m_swithch.hidden = YES;
    m_swithCh_r.hidden = YES;
    [self p_initGridHotMap];
    [Toast show:@"格网热力图" hostView:m_mapControl];
}
-(IBAction)clear:(id)sender{
    [timer invalidate];
    timer = nil;
 //   curMap = @"";
    btn.selected = NO;
    mHeatMap.updataInterval = 0;
    [mHeatMap stopPlay];

    [mPolymeMap dispose];
    [mHeatMap dispose];
    mHeatMap = nil;
    [mDensityMap dispose];
    mDensityMap = nil;
    [mScatterCHart dispose];
    mScatterCHart = nil;
    [mRelationMap dispose];
    [mGridHotMap dispose];
    [instrumentChart2 dispose];
    [instrumentChart dispose];
    [pieChart dispose];
    [lineChart dispose];
    [barChart dispose];
    instrumentChart2.hidden =instrumentChart.hidden =pieChart.hidden = barChart.hidden  = lineChart.hidden = YES;
    m_mapControl.action = PAN;
    [m_mapControl.map.trackingLayer clear];

    [chartTimeLine dispose];
    realTimeBtn.hidden = YES;
    timeDataBtn.hidden = YES;
    
    m_mapControl.action = PAN;
    
}

-(IBAction)normalCharts:(id)sender{
    
    if([curMap isEqualToString:@"tubiao"])
        return;
    curMap = @"tubiao";
    
    m_mapControl.action = SELECT;
    [self clear:nil];
    for(int i=0;i<[m_mapControl.map.layers getCount];i++){
        if(i==0)
            continue;
        Layer* layer = [m_mapControl.map.layers getLayerAtIndex:i];
        layer.visible = NO;
    }
    Layer* layer = [m_mapControl.map.layers getLayerWithName:@"Provinces_R@hotMap#1"];
    layer.visible = YES;
    [m_mapControl.map.layers getLayerWithName:@"图表@hotMap"].visible = YES;
    m_mapControl.map.scale =  0.000000032440651758653652;
    m_mapControl.map.center = [[Point2D alloc] initWithX:110.02849662972616 Y:36.062624976357171];
    [m_mapControl.map refresh];

  self.navigationItem.title = @"图表";
    instrumentChart2.hidden =instrumentChart.hidden =pieChart.hidden = barChart.hidden  = lineChart.hidden = NO;
    [self p_initLineChart];
    [self p_initPieChart];
    [self p_initBarChart];
    [self p_initInstruChart];
    [m_mapControl setAction:SELECT];
}
-(IBAction)densityMap:(id)sender{
    
    if([curMap isEqualToString:@"密度图"])
        return;
     curMap = @"密度图";
    [self clear:nil];
    [self p_initDensityMap];
    [Toast show:@"密度图" hostView:m_mapControl];
   
}




//非地图界面强制锁定竖屏
-(void)viewWillLayoutSubviews{
    
}
- (void)didReceiveMemoryWarning {
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

@end

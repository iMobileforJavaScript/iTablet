//
//  ViewController.m
//  OpenGLCache
//
//  Created by imobile on 2017/11/14.
//  Copyright © 2017年 imobile. All rights reserved.
//

#import "VCViewController.h"
#import "ZipArchive.h"
#import "SuperMap/Toast.h"

@interface VCViewController ()

@end

@implementation VCViewController

- (void)viewDidLoad {
    [super viewDidLoad];
   // [self p_init];
  
    [self openMap];
}
-(void)viewWillDisappear:(BOOL)animated{
  [m_mapControl.map close];
  [m_workspace close];
  self.navigationController.navigationBarHidden = YES;
}
-(void)p_init
{
    [Environment setOpenGLMode:YES];
    m_mapControl.userInteractionEnabled = NO;
//    NSString *srclic = [[NSBundle mainBundle] pathForResource:@"Trial_License" ofType:@"slm"];
//    NSString* deslic = [NSHomeDirectory() stringByAppendingFormat:@"/Documents/%@",@"Trial_License.slm"];
//    if(![[NSFileManager defaultManager] fileExistsAtPath:deslic isDirectory:nil]){
//        if(![[NSFileManager defaultManager] copyItemAtPath:srclic toPath:deslic error:nil])
//            NSLog(@"拷贝数据失败");
//    }
//    NSString *srcfileName = [[NSBundle mainBundle] pathForResource:@"demoData" ofType:@"zip"];
//    
//    NSString* desFile = [NSHomeDirectory() stringByAppendingFormat:@"/Library/Caches/%@",@""];
//    
//    if(![[NSFileManager defaultManager] fileExistsAtPath:[desFile stringByAppendingString:@"demoData"] isDirectory:nil]){
//        if(![[NSFileManager defaultManager] copyItemAtPath:srcfileName toPath:[desFile stringByAppendingString:@"demoData.zip"] error:nil])
//            NSLog(@"拷贝数据失败");
//        else{
//            ZipArchive *za = [[ZipArchive alloc] init];
//            if ( [za UnzipOpenFile: [NSHomeDirectory() stringByAppendingFormat:@"/Library/Caches/%@",@"demoData.zip"]] ){
//                if( [za UnzipFileTo: desFile overWrite: YES] )
//                    [[NSFileManager defaultManager] removeItemAtPath:[desFile stringByAppendingString:@"demoData.zip"] error:nil];
//                [za UnzipCloseFile];
//            }
//        }
//    }
    
}
-(void)openMap {
    //初始化工作空间
    if (m_workspace == nil) {
        m_workspace = [[Workspace alloc]init];
    }
    [m_mapControl mapControlInit];
    m_map = m_mapControl.map;
    [m_map setWorkspace:m_workspace];
    
    NSString *server = @"https://www.supermapol.com/iserver/services/map-china_glvectortile/rest/OpenGLTile";//[NSHomeDirectory() stringByAppendingString:@"/Library/Caches/demoData/VectorCache.xml"];
    m_Info = [[DatasourceConnectionInfo alloc]init];
    m_Info.server = server;
    m_Info.engineType = ET_OPENGLCACHE;
    m_datasource = [m_workspace.datasources open:m_Info];
    if(m_datasource == nil) {
        [Toast show:@"打开矢量切片数据失败" hostView:m_mapControl];
    }
    self.navigationItem.title = @"GL地图瓦片";
    [m_map.layers addDataset:[m_datasource.datasets get:0] ToHead:YES];
    m_map.scale = 1/235000000;;
    [m_map refresh];
}
- (void)didReceiveMemoryWarning {
    [super didReceiveMemoryWarning];
}


@end

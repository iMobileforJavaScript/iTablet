/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

#import "AppDelegate.h"

#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>
#import "VisualViewController.h"
#import "VCViewController.h"

static NSString* g_sampleCodeName = @"#";;
@implementation AppDelegate

+(void)SetSampleCodeName:(NSString*)name
{
  g_sampleCodeName = name;
}
- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  NSURL *jsCodeLocation;
  
#if DEBUG
  [[RCTBundleURLProvider sharedSettings] setJsLocation:@"10.10.3.101"];  //   10.10.2.46
  
#endif
  jsCodeLocation = [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index" fallbackResource:nil];

  NSLog(@"============== %@",NSHomeDirectory());
  RCTRootView *rootView = [[RCTRootView alloc] initWithBundleURL:jsCodeLocation
                                                      moduleName:@"iTablet"
                                               initialProperties:nil
                                                   launchOptions:launchOptions];
  rootView.backgroundColor = [[UIColor alloc] initWithRed:1.0f green:1.0f blue:1.0f alpha:1];

  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  UIViewController *rootViewController = [UIViewController new];
  rootViewController.view = rootView;
  _nav=[[UINavigationController alloc]initWithRootViewController:rootViewController];
  _nav.navigationBarHidden = YES;
  
  [_nav.navigationBar setBackgroundImage:[UIImage new] forBarMetrics:UIBarMetricsDefault];
  
  [_nav.navigationBar setShadowImage:[UIImage new]];
  
  self.window.rootViewController = _nav;
  [self.window makeKeyAndVisible];
  
  [self initEnvironment];
  [self initDefaultData];
  
  self.allowRotation = NO;
  [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(doSampleCodeNotification:) name:@"RNOpenVC" object:nil];
  return YES;
}

#pragma mark - 初始化license
- (void)initEnvironment {
  [Environment setLicensePath:[NSHomeDirectory() stringByAppendingFormat:@"/Library/Caches/%@",@""]];
  NSString *srclic = [[NSBundle mainBundle] pathForResource:@"Trial_License" ofType:@"slm"];
  if (srclic) {
    NSString* deslic = [NSHomeDirectory() stringByAppendingFormat:@"/Library/Caches/%@",@"Trial_License.slm"];
    if(![[NSFileManager defaultManager] fileExistsAtPath:deslic isDirectory:nil]){
      if(![[NSFileManager defaultManager] copyItemAtPath:srclic toPath:deslic error:nil])
        NSLog(@"拷贝数据失败");
    }
  }
}

#pragma mark - 初始化默认数据
- (void)initDefaultData {
  // 初始化游客工作空间
  NSString *srclic = [[NSBundle mainBundle] pathForResource:@"Customer" ofType:@"smwu"];
  NSString* dataPath = @"/Documents/iTablet/User/Customer/Data/";
  [AppDelegate createFileDirectories:[NSHomeDirectory() stringByAppendingFormat:@"%@%@", dataPath, @""]];
  if (srclic) {
    NSString* deslic = [NSHomeDirectory() stringByAppendingFormat:@"%@%@", dataPath, @"Customer.smwu"];
    if(![[NSFileManager defaultManager] fileExistsAtPath:deslic isDirectory:nil]){
      if(![[NSFileManager defaultManager] copyItemAtPath:srclic toPath:deslic error:nil])
        NSLog(@"拷贝数据失败");
    }
  }
}

-(void)doSampleCodeNotification:(NSNotification *)notification
{
  NSLog(@"成功收到===>通知");
  if([g_sampleCodeName isEqualToString:@"Visual"]){
    
    VisualViewController* vt = [[UIStoryboard storyboardWithName:@"VisualMain" bundle:nil] instantiateViewControllerWithIdentifier:@"Visual"];
    [self.nav pushViewController:vt animated:YES];
     self.nav.navigationBarHidden = NO;
  }else if([g_sampleCodeName isEqualToString:@"glCache"])
  {
    VCViewController* vt = [[UIStoryboard storyboardWithName:@"VCMain" bundle:nil] instantiateViewControllerWithIdentifier:@"VC"];
    [self.nav pushViewController:vt animated:YES];
    self.nav.navigationBarHidden = NO;
  }
}

- (UIInterfaceOrientationMask)application:(UIApplication *)application supportedInterfaceOrientationsForWindow:(nullable UIWindow *)window
{
  if (self.allowRotation == YES) {
    //横屏
    return UIInterfaceOrientationMaskLandscape;
  } else{
    //竖屏
    return UIInterfaceOrientationMaskPortrait;
  }
}

+(BOOL)createFileDirectories:(NSString*)path
{
  
  // 判断存放音频、视频的文件夹是否存在，不存在则创建对应文件夹
  NSString* DOCUMENTS_FOLDER_AUDIO = path;
  NSFileManager *fileManager = [NSFileManager defaultManager];
  
  BOOL isDir = FALSE;
  BOOL isDirExist = [fileManager fileExistsAtPath:DOCUMENTS_FOLDER_AUDIO isDirectory:&isDir];
  
  
  if(!(isDirExist && isDir)){
    BOOL bCreateDir = [fileManager createDirectoryAtPath:DOCUMENTS_FOLDER_AUDIO withIntermediateDirectories:YES attributes:nil error:nil];
    
    if(!bCreateDir){
      
      NSLog(@"Create Directory Failed.");
      return NO;
    }else
    {
      //  NSLog(@"%@",DOCUMENTS_FOLDER_AUDIO);
      return YES;
    }
  }
  
  return YES;
}
@end

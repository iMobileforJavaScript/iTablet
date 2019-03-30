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
#import "RNFSManager.h"
//#import "RNSplashScreen.h"

static NSString* g_sampleCodeName = @"#";;
@implementation AppDelegate

- (void)application:(UIApplication *)application handleEventsForBackgroundURLSession:(NSString *)identifier completionHandler:(void (^)())completionHandler
{
  [RNFSManager setCompletionHandlerForIdentifier:identifier completionHandler:completionHandler];
}

+(void)SetSampleCodeName:(NSString*)name
{
  g_sampleCodeName = name;
}
- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  NSURL *jsCodeLocation;
  
#if DEBUG
  [[RCTBundleURLProvider sharedSettings] setJsLocation:@"localhost"];
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
  
  [NSThread sleepForTimeInterval:1];
  //  [RNSplashScreen show];
  //注册微信
  [WeiXinUtils registerApp];
  return YES;
}

#pragma mark - 微信打开压缩包
- (BOOL)application:(UIApplication *)application openURL:(NSURL *)url sourceApplication:(NSString *)sourceApplication annotation:(id)annotation
{
  if(![[url absoluteString] containsString:@"platformId=wechat"]){
       [FileTools getUriState:url];
  }
  return [WXApi handleOpenURL:url delegate:self];
}

#pragma mark - 初始化license
- (void)initEnvironment {
  [Environment setLicensePath:[NSHomeDirectory() stringByAppendingFormat:@"/Library/Caches/%@",@""]];
  NSString *srclic = [[NSBundle mainBundle] pathForResource:@"Trial_License" ofType:@"slm"];
  if (srclic) {
    NSString* deslic = [NSHomeDirectory() stringByAppendingFormat:@"/Library/Caches/%@",@"Trial_License.slm"];
    //    if(![[NSFileManager defaultManager] fileExistsAtPath:deslic isDirectory:nil]){
    //      if(![[NSFileManager defaultManager] copyItemAtPath:srclic toPath:deslic error:nil])
    //        NSLog(@"拷贝数据失败");
    //    }
    if(![[NSFileManager defaultManager] copyItemAtPath:srclic toPath:deslic error:nil])
      NSLog(@"拷贝数据失败");
  }
}

#pragma mark - 初始化默认数据
- (void)initDefaultData {
  //  [self initCustomWorkspace];
  [self initDefaultWorkspace];
}

#pragma mark - 初始化游客工作空间
- (void)initCustomWorkspace {
  NSString *srclic = [[NSBundle mainBundle] pathForResource:@"Customer" ofType:@"smwu"];
  NSString* dataPath = @"/Documents/iTablet/User/Customer/Data/";
  [FileTools createFileDirectories:[NSHomeDirectory() stringByAppendingFormat:@"%@%@", dataPath, @""]];
  if (srclic) {
    NSString* deslic = [NSHomeDirectory() stringByAppendingFormat:@"%@%@", dataPath, @"Customer.smwu"];
    if(![[NSFileManager defaultManager] fileExistsAtPath:deslic isDirectory:nil]){
      if(![[NSFileManager defaultManager] copyItemAtPath:srclic toPath:deslic error:nil])
        NSLog(@"拷贝数据失败");
    }
  }
}

#pragma mark - 初始化默认工作空间数据
-(void)initDefaultWorkspace {
  [FileTools initUserDefaultData:@"Customer"];
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

// onReq是微信终端向第三方程序发起请求，要求第三方程序响应。第三方程序响应完后必须调用sendRsp返回。在调用sendRsp返回时，会切回到微信终端程序界面
- (void)onReq:(BaseReq *)req
{
  
}

// 如果第三方程序向微信发送了sendReq的请求，那么onResp会被回调。sendReq请求调用后，会切到微信终端程序界面
- (void)onResp:(BaseResp *)resp
{
  // 处理 分享请求 回调
  [FileTools sendShareResult];
}

//- (UIInterfaceOrientationMask)application:(UIApplication *)application supportedInterfaceOrientationsForWindow:(nullable UIWindow *)window
//{
//  if (self.allowRotation == YES) {
//    //横屏
//    return UIInterfaceOrientationMaskLandscape;
//  } else{
//    //竖屏
//    return UIInterfaceOrientationMaskPortrait;
//  }
//}
@end

/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

#import "AppDelegate.h"
#import <RCTJPushModule.h>
#ifdef NSFoundationVersionNumber_iOS_9_x_Max
#import <UserNotifications/UserNotifications.h>
#endif



#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>
//#import "VisualViewController.h"
//#import "VCViewController.h"
#import "RNFSManager.h"
#import "SuperMap/LogInfoService.h"
//#import "RNSplashScreen.h"
#import "Common/HWNetworkReachabilityManager.h"
#import "NativeUtil.h"
#import "Orientation.h"


static NSString* g_sampleCodeName = @"#";;
@implementation AppDelegate

- (void)application:(UIApplication *)application didRegisterForRemoteNotificationsWithDeviceToken:(NSData *)deviceToken
{
  [JPUSHService registerDeviceToken:deviceToken];
}

- (void)application:(UIApplication *)application didReceiveRemoteNotification:(NSDictionary *)userInfo
{
  [[NSNotificationCenter defaultCenter] postNotificationName:kJPFDidReceiveRemoteNotification object:userInfo];
}

- (void)application:(UIApplication *)application didReceiveLocalNotification:(UILocalNotification *)notification
{
  [[NSNotificationCenter defaultCenter] postNotificationName:kJPFDidReceiveRemoteNotification object: notification.userInfo];
}

- (void)application:(UIApplication *)application didReceiveRemoteNotification:(NSDictionary *)userInfo fetchCompletionHandler:(void (^)   (UIBackgroundFetchResult))completionHandler
{
  [[NSNotificationCenter defaultCenter] postNotificationName:kJPFDidReceiveRemoteNotification object:userInfo];
}

- (void)jpushNotificationCenter:(UNUserNotificationCenter *)center willPresentNotification:(UNNotification *)notification withCompletionHandler:(void (^)(NSInteger))completionHandler
{
  NSDictionary * userInfo = notification.request.content.userInfo;
  if ([notification.request.trigger isKindOfClass:[UNPushNotificationTrigger class]]) {
    [JPUSHService handleRemoteNotification:userInfo];
    [[NSNotificationCenter defaultCenter] postNotificationName:kJPFDidReceiveRemoteNotification object:userInfo];
  }

  completionHandler(UNNotificationPresentationOptionAlert);
}

- (void)jpushNotificationCenter:(UNUserNotificationCenter *)center didReceiveNotificationResponse:(UNNotificationResponse *)response withCompletionHandler:(void (^)())completionHandler
{
  NSDictionary * userInfo = response.notification.request.content.userInfo;
  if ([response.notification.request.trigger isKindOfClass:[UNPushNotificationTrigger class]]) {
    [JPUSHService handleRemoteNotification:userInfo];
    [[NSNotificationCenter defaultCenter] postNotificationName:kJPFOpenNotification object:userInfo];
  }

  completionHandler();
}


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
  
  [JPUSHService setupWithOption:launchOptions appKey:@"7d2470baad20e273cd6e53cc"
                        channel:nil apsForProduction:nil];
  NSURL *jsCodeLocation;
  
#if DEBUG

  [[RCTBundleURLProvider sharedSettings] setJsLocation:@"192.168.43.228"];

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
  
  
  [self initDefaultData];
  [self initEnvironment];
  self.allowRotation = NO;
  [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(doSampleCodeNotification:) name:@"RNOpenVC" object:nil];
  
  [NSThread sleepForTimeInterval:1];
  //  [RNSplashScreen show];
  //注册微信
  [WeiXinUtils registerApp];
  [[NSNotificationCenter defaultCenter] postNotificationName:@"dowloadFile"
                                                      object:nil];
  // 开启网络监听
  [[HWNetworkReachabilityManager shareManager] monitorNetworkStatus];
  
  //监听崩溃信息
  NSSetUncaughtExceptionHandler(&UncaughtExceptionHandler);
  //判断上次是否有崩溃信息
  initCrash();
  
  @try {
    //初始化极光推送
    JPUSHRegisterEntity * entity = [[JPUSHRegisterEntity alloc] init];
    entity.types = JPAuthorizationOptionAlert|JPAuthorizationOptionBadge|JPAuthorizationOptionSound|JPAuthorizationOptionProvidesAppNotificationSettings;
    [JPUSHService registerForRemoteNotificationConfig:entity delegate:self];
    
  } @catch (NSException *exception) {
    NSLog(@"%@", exception.description);
  }
    dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(0.2 * NSEC_PER_SEC)), dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_DEFAULT, 0), ^{
        [NativeUtil openGPS];
    });
  dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(0.3 * NSEC_PER_SEC)), dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_DEFAULT, 0), ^{
         [NativeUtil closeGPS];
     });
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
//  [Environment setOpenGLMode:false];
  
  NSString *srclic = [[NSBundle mainBundle] pathForResource:@"Trial_License" ofType:@"slm"];
  if (srclic) {
    NSString* deslic = [NSHomeDirectory() stringByAppendingFormat:@"/Documents/iTablet/license/%@",@"Trial_License.slm"];
    if([[NSFileManager defaultManager] fileExistsAtPath:deslic isDirectory:nil]){
      NSString* srcTime = [NSString stringWithContentsOfFile:srclic encoding:NSUTF8StringEncoding error:nil];
      NSString* desTime = [NSString stringWithContentsOfFile:deslic encoding:NSUTF8StringEncoding error:nil];
      NSRegularExpression *regular = [NSRegularExpression regularExpressionWithPattern:@"ExpiredDate=([0-9]+)" options:0 error:nil];
      
      NSTextCheckingResult *match = [regular firstMatchInString:srcTime options:0 range:NSMakeRange(0, [srcTime length])];
      NSTextCheckingResult *match1 = [regular firstMatchInString:desTime options:0 range:NSMakeRange(0, [desTime length])];
      
      if (match && match1) {
          NSString *result = [srcTime substringWithRange:[match rangeAtIndex:1] ];
          NSLog(@"time: %@",result);
          NSString *result1 = [desTime substringWithRange:[match1 rangeAtIndex:1] ];
          NSLog(@"time: %@",result);
        if(result1.longLongValue < result.longLongValue){
          [[NSFileManager defaultManager] removeItemAtPath:deslic error:nil];
        }
      }
    }
    [FileTools createFileDirectories:[NSHomeDirectory() stringByAppendingFormat:@"/Documents/iTablet/license/%@",@""]];
    if(![[NSFileManager defaultManager] copyItemAtPath:srclic toPath:deslic error:nil])
      NSLog(@"拷贝数据失败");
    [Environment setLicensePath:[NSHomeDirectory() stringByAppendingFormat:@"/Documents/iTablet/%@/",@"license"]];
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
- (void)applicationDidEnterBackground:(UIApplication *)application {
  // Use this method to release shared resources, save user data, invalidate timers, and store enough application state information to restore your application to its current state in case it is terminated later.
  // If your application supports background execution, this method is called instead of applicationWillTerminate: when the user quits.
  
  self.taskId = [application beginBackgroundTaskWithExpirationHandler:^(void) {
    //当申请的后台时间用完的时候调用这个block
    [self endTask];
  }];
  
  
}


- (void)applicationWillEnterForeground:(UIApplication *)application {
  // Called as part of the transition from the background to the active state; here you can undo many of the changes made on entering the background.
  
  [[NSNotificationCenter defaultCenter] postNotificationName:@"dowloadFile"
                                                      object:nil];
}

void UncaughtExceptionHandler(NSException *exception) {
  /**
   *  获取异常崩溃信息
   */
  NSArray *callStack = [exception callStackSymbols];
  NSString *reason = [exception reason];
  NSString *name = [exception name];
  NSString *content = [NSString stringWithFormat:@"========异常错误报告========\nname:%@\nreason:\n%@\ncallStackSymbols:\n%@",name,reason,[callStack componentsJoinedByString:@"\n"]];
  
  //将崩溃信息持久化在本地，下次程序启动时、或者后台，将崩溃信息作为日志发送给开发者。
  [[NSUserDefaults standardUserDefaults] setObject:content forKey:@"ExceptionContent"];
}
void initCrash(){
  NSString* crashKey=@"ExceptionContent";
  NSUserDefaults *userDefault = [NSUserDefaults standardUserDefaults];
  NSString* crashStr=[userDefault objectForKey:crashKey];
  if(crashStr){
    NSMutableDictionary* dic=[[NSMutableDictionary alloc] init];
    [dic setValue:crashStr forKey:@"crashIos"];
    //上传数据
    [LogInfoService sendAPPLogInfo:dic completionHandler:^(BOOL result) {
      if(result){
        //上传成功
      }
    }];
    [userDefault removeObjectForKey:crashKey];
  }
}


- (void)applicationDidBecomeActive:(UIApplication *)application {
  // Restart any tasks that were paused (or not yet started) while the application was inactive. If the application was previously in the background, optionally refresh the user interface.
  
  [self endTask];
  
}

-(void)endTask
{
  [[UIApplication sharedApplication] endBackgroundTask:_taskId];
  _taskId = UIBackgroundTaskInvalid;
}
- (UIInterfaceOrientationMask)application:(UIApplication *)application supportedInterfaceOrientationsForWindow:(nullable UIWindow *)window
{
//  if (self.allowRotation == YES) {
//    //横屏
//    return UIInterfaceOrientationMaskLandscape;
//  } else{
//    //竖屏
//    return UIInterfaceOrientationMaskPortrait;
//  }
  NSString* strDevice = [[UIDevice currentDevice].model substringToIndex:4];
  if ([strDevice isEqualToString:@"iPad"]){
    return [Orientation getOrientation];
  } else {
    return UIInterfaceOrientationMaskPortrait;
  }
}
@end

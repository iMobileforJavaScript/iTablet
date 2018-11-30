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
  [[RCTBundleURLProvider sharedSettings] setJsLocation:@"192.168.218.119"];  //   10.10.2.46
  
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
  
  [Environment setLicensePath:[NSHomeDirectory() stringByAppendingFormat:@"/Library/Caches/%@",@""]];
  NSString *srclic = [[NSBundle mainBundle] pathForResource:@"Trial_License" ofType:@"slm"];
  NSString* deslic = [NSHomeDirectory() stringByAppendingFormat:@"/Library/Caches/%@",@"Trial_License.slm"];
  if(![[NSFileManager defaultManager] fileExistsAtPath:deslic isDirectory:nil]){
    if(![[NSFileManager defaultManager] copyItemAtPath:srclic toPath:deslic error:nil])
      NSLog(@"拷贝数据失败");
  }
  self.allowRotation = NO;
  [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(doSampleCodeNotification:) name:@"RNOpenVC" object:nil];
  return YES;
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
@end

//
//  FileTools.m
//  iTablet
//
//  Created by Yang Shang Long on 2018/9/21.
//  Copyright © 2018年 Facebook. All rights reserved.
//

#import "FileTools.h"

@implementation FileTools
RCT_EXPORT_MODULE();

RCT_REMAP_METHOD(getHomeDirectory,getHomeDirectoryWithresolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject){
  NSString* home = [NSHomeDirectory() stringByAppendingString:@"/Documents"];
  if (home) {
    resolve(home);
  }else{
    reject(@"systemUtil",@"get home directory failed",nil);
  }
}

RCT_REMAP_METHOD(getPathListByFilter, path:(NSString*)path filter:(NSDictionary*)filter getHomeDirectoryWithresolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject){
  BOOL flag = YES;
  NSFileManager* fileMgr = [NSFileManager defaultManager];
  NSMutableArray* array = [NSMutableArray array];
  
  if ([fileMgr fileExistsAtPath:path isDirectory:&flag]) {
    NSArray* tempArray = [fileMgr contentsOfDirectoryAtPath:path error:nil];
    
    NSString* filterKey = filter[@"name"];
    NSString* filterEx = filter[@"extension"];
    NSString* type = @"Directory";
    if (filter[@"type"]) {
      type = [filter[@"type"] isEqualToString:@""] ? @"Directory" : filter[@"type"];
    }
    for (NSString* fileName in tempArray) {
      
      
      NSString* fullPath = [path stringByAppendingPathComponent:fileName];
      NSString* strModeDate;
      if ([fileMgr fileExistsAtPath:fullPath isDirectory:&flag]) {
        NSError *error = nil;
        NSDictionary *fileAttributes = [fileMgr attributesOfItemAtPath:fullPath error:&error];
        if(fileAttributes != nil){
          NSDate* fileModDate = [fileAttributes objectForKey:NSFileModificationDate];
          strModeDate = [FileTools getLastModifiedTime:fileModDate];
        }
        NSString* tt = [fullPath stringByReplacingOccurrencesOfString:[NSHomeDirectory() stringByAppendingString:@"/Documents"] withString:@""];
        NSString* extension = [tt pathExtension];
        NSString* fileName = [tt lastPathComponent];
        if(([filterEx containsString:extension] && ([fileName containsString:filterKey] || [filterKey isEqualToString:@""])) || (flag && [type isEqualToString:@"Directory"])) {
          [array addObject:@{@"name":fileName,@"path":tt,@"mtime":strModeDate,@"isDirectory":@(flag)}];
        }
        
      }
      
    }
  }
  
  resolve(array);
}

RCT_REMAP_METHOD(getDirectoryContent, path:(NSString*)path getHomeDirectoryWithresolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject){
  // NSString* home = NSHomeDirectory();
  
  NSMutableArray* array = [NSMutableArray arrayWithCapacity:10];
  NSFileManager* fileMgr = [NSFileManager defaultManager];
  NSArray* tempArray = [fileMgr contentsOfDirectoryAtPath:path error:nil];
  
  for (NSString* fileName in tempArray) {
    
    BOOL flag = YES;
    NSString* fullPath = [path stringByAppendingPathComponent:fileName];
    if ([fileMgr fileExistsAtPath:fullPath isDirectory:&flag]) {
      
      if (!flag) {
        [array addObject:@{@"name":fileName,@"type":@"file"}];
        
      }else{
        [array addObject:@{@"name":fileName,@"type":@"directory"}];
      }
    }
  }
  resolve(array);
}

RCT_REMAP_METHOD(isDirectory,isDirectoryPath:(NSString*)path getHomeDirectoryWithresolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject){
  // NSString* home = NSHomeDirectory();
  BOOL isDir = FALSE;
  BOOL isDirExist = [[NSFileManager defaultManager] fileExistsAtPath:path isDirectory:&isDir];
  
  resolve(@(isDirExist&&isDir));
  
}

RCT_REMAP_METHOD(getPathList,getPathListPath:(NSString*)path getHomeDirectoryWithresolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject){
  NSMutableArray* array = [NSMutableArray arrayWithCapacity:10];
  
  NSFileManager* fileMgr = [NSFileManager defaultManager];
  NSArray* tempArray = [fileMgr contentsOfDirectoryAtPath:path error:nil];
  
  for (NSString* fileName in tempArray) {
    
    BOOL flag = YES;
    
    NSString* fullPath = [path stringByAppendingPathComponent:fileName];
    
    if ([fileMgr fileExistsAtPath:fullPath isDirectory:&flag]) {
      
      NSString* tt = [fullPath stringByReplacingOccurrencesOfString:[NSHomeDirectory() stringByAppendingString:@"/Documents"] withString:@""];
      [array addObject:@{@"name":fileName,@"path":tt,@"isDirectory":@(flag)}];
      //  [array addObject:@{@"name":fileName,@"type":@"directory"}];
    }
    
  }
  
  resolve(array);
  
}

RCT_REMAP_METHOD(fileIsExist,fileIsExistPath:(NSString*)path getHomeDirectoryWithresolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject){
  // NSString* home = NSHomeDirectory();
  BOOL b =[[NSFileManager defaultManager] fileExistsAtPath:path isDirectory:nil];
  
  resolve(@(b));
  
}

RCT_REMAP_METHOD(fileIsExistInHomeDirectory,fileIsExistInHomeDirectoryPath:(NSString*)path getHomeDirectoryWithresolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject){
  NSString* home = NSHomeDirectory();
  BOOL b =[[NSFileManager defaultManager] fileExistsAtPath:[home stringByAppendingFormat:@"/Documents/%@",path] isDirectory:nil];
  //BOOL b = [[NSFileManager defaultManager] createDirectoryAtPath:[home stringByAppendingFormat:@"/Documents/%@",path] withIntermediateDirectories:NO attributes:nil error:nil];
  resolve(@(b));
}

RCT_REMAP_METHOD(zipFile, zipFileByPath:(NSString *)archivePath targetPath:(NSString *)targetPath resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject){
  @try {
    BOOL result = [FileTools zipFile:archivePath targetPath:targetPath];
    
    resolve([NSNumber numberWithBool:result]);
  } @catch (NSException *exception) {
    reject(@"zipFile", exception.reason, nil);
  }
}

RCT_REMAP_METHOD(zipFiles, zipFilesByPaths:(NSArray *)archivePaths targetPath:(NSString *)targetPath resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject){
  @try {
    BOOL result = [FileTools zipFiles:archivePaths targetPath:targetPath];
    
    resolve([NSNumber numberWithBool:result]);
  } @catch (NSException *exception) {
    reject(@"zipFile", exception.reason, nil);
  }
}

RCT_REMAP_METHOD(unZipFile, unZipFileByPath:(NSString *)archivePath targetPath:(NSString *)targetPath resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject){
  @try {
    BOOL result = [FileTools unZipFile:archivePath targetPath:targetPath];
    
    resolve([NSNumber numberWithBool:result]);
  } @catch (NSException *exception) {
    reject(@"unZipFile", exception.reason, nil);
  }
}

RCT_REMAP_METHOD(deleteFile, deleteFileByPath:(NSString *)path resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject){
  @try {
    BOOL result = NO;
    if (path != nil && ![path isEqualToString:@""]) {
      result = [FileTools deleteFile:path];
    }
    
    resolve([NSNumber numberWithBool:result]);
  } @catch (NSException *exception) {
    reject(@"unZipFile", exception.reason, nil);
  }
}

RCT_REMAP_METHOD(copyFile, copyFileByPath:(NSString *)fromPath targetPath:(NSString *)toPath override:(BOOL)override resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject){
  @try {
    BOOL result = [[NSFileManager defaultManager] fileExistsAtPath:toPath];
    if (override || !result) {
      result = [FileTools copyFile:fromPath targetPath:toPath];
    }
    resolve([NSNumber numberWithBool:result]);
  } @catch (NSException *exception) {
    reject(@"unZipFile", exception.reason, nil);
  }
}

RCT_REMAP_METHOD(initUserDefaultData, initUserDefaultDataByUserName:(NSString *)userName resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject){
  @try {
    BOOL result = [FileTools initUserDefaultData:userName];
    resolve([NSNumber numberWithBool:result]);
  } @catch (NSException *exception) {
    reject(@"unZipFile", exception.reason, nil);
  }
}

+(BOOL)zipFile:(NSString *)archivePath targetPath:(NSString *)targetPath {
  NSFileManager *fileManager = [NSFileManager defaultManager];
  BOOL isDir = NO;
  BOOL exist = [fileManager fileExistsAtPath:archivePath isDirectory:&isDir];
  BOOL result = NO;
  if (exist) {
    if (isDir) {
      result = [SSZipArchive createZipFileAtPath:targetPath withContentsOfDirectory:archivePath];
    } else {
      NSArray* filePaths = [NSArray arrayWithObjects:archivePath, nil];
      result = [SSZipArchive createZipFileAtPath:targetPath withFilesAtPaths:filePaths];
    }
  }
  return result;
}

+(BOOL)zipFiles:(NSArray *)archivePaths targetPath:(NSString *)targetPath {
  BOOL result = [SSZipArchive createZipFileAtPath:targetPath withFilesAtPaths:archivePaths];
  return result;
}

+(BOOL)unZipFile:(NSString *)archivePath targetPath:(NSString *)targetPath {
  BOOL result = NO;
  NSFileManager *fileManager = [NSFileManager defaultManager];
  BOOL isDir = NO;
  BOOL exist = [fileManager fileExistsAtPath:archivePath isDirectory:&isDir];
  
  if (exist){
    result = [SSZipArchive unzipFileAtPath:archivePath toDestination:targetPath];
  }
  return result;
}

+(BOOL)deleteFile:(NSString *)path {
  BOOL result = NO;
  if([[NSFileManager defaultManager] fileExistsAtPath:path isDirectory:nil]){
    result = [[NSFileManager defaultManager] removeItemAtPath:path error:nil];
  }
  return result;
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

+(BOOL)copyFile:(NSString *)fromPath targetPath:(NSString *)toPath {
  BOOL result = NO;
  if ([[NSFileManager defaultManager] fileExistsAtPath:fromPath]) {
    result = [[NSFileManager defaultManager] copyItemAtPath:fromPath toPath:toPath error:nil];
  }
  return result;
}

+(BOOL)initUserDefaultData:(NSString *)userName {
  userName = userName == nil || [userName isEqualToString:@""] ? @"Customer" : userName;
  
  // 初始化用户工作空间
  NSString* srclic = [[NSBundle mainBundle] pathForResource:@"Workspace" ofType:@"zip"];
  NSString* defaultDataPath = [NSHomeDirectory() stringByAppendingFormat:@"%@%@%@", @"/Documents/iTablet/User/", userName, @"/DefaultData/" ];
  NSString* wsName = @"Workspace.sxwu";
  
  [FileTools createFileDirectories:[NSHomeDirectory() stringByAppendingFormat:@"%@%@", defaultDataPath, @""]];
//  if (srclic) {
//    NSString* deslic = [NSHomeDirectory() stringByAppendingFormat:@"%@%@%@", wsPath, @"Workspace", @".smwu"];
//    if(![[NSFileManager defaultManager] fileExistsAtPath:deslic isDirectory:nil]){
//      if(![[NSFileManager defaultManager] copyItemAtPath:srclic toPath:deslic error:nil])
//        NSLog(@"拷贝数据失败");
//    }
//  }
  
  if (![[NSFileManager defaultManager] fileExistsAtPath:[NSString stringWithFormat:@"%@%@%@", defaultDataPath, @"Workspace/", wsName] isDirectory:nil]) {
    if(![FileTools unZipFile:srclic targetPath:defaultDataPath])
      NSLog(@"拷贝数据失败");
  }
  
  //创建用户目录
  NSString* commonPath = @"/Documents/iTablet/Common/";
  NSString* dataPath = [NSString stringWithFormat:@"%@%@%@", @"/Documents/iTablet/User/", userName, @"/Data/"];
  NSString* downloadsPath = [NSString stringWithFormat:@"%@%@%@", @"/Documents/iTablet/User/", userName, @"/ExternalData/"];
  [FileTools createFileDirectories:[NSHomeDirectory() stringByAppendingFormat:@"%@%@", dataPath, @""]];
  [FileTools createFileDirectories:[NSHomeDirectory() stringByAppendingFormat:@"%@%@", commonPath, @""]];
  [FileTools createFileDirectories:[NSHomeDirectory() stringByAppendingFormat:@"%@%@", dataPath, @"Attribute"]];
  [FileTools createFileDirectories:[NSHomeDirectory() stringByAppendingFormat:@"%@%@", dataPath, @"Datasource"]];
  [FileTools createFileDirectories:[NSHomeDirectory() stringByAppendingFormat:@"%@%@", dataPath, @"Scene"]];
  [FileTools createFileDirectories:[NSHomeDirectory() stringByAppendingFormat:@"%@%@", dataPath, @"Symbol"]];
  [FileTools createFileDirectories:[NSHomeDirectory() stringByAppendingFormat:@"%@%@", dataPath, @"Template"]];
  [FileTools createFileDirectories:[NSHomeDirectory() stringByAppendingFormat:@"%@%@", dataPath, @"Workspace"]];
  [FileTools createFileDirectories:[NSHomeDirectory() stringByAppendingFormat:@"%@%@", dataPath, @"Temp"]];
  [FileTools createFileDirectories:[NSHomeDirectory() stringByAppendingFormat:@"%@%@", downloadsPath, @""]];
  
  // 初始化模板数据
//  NSString* originPath = [[NSBundle mainBundle] pathForResource:@"Template" ofType:@"zip"];
//  NSString* commonZipPath = [NSHomeDirectory() stringByAppendingFormat:@"%@%@", commonPath, @"Template.zip"];
//  NSString* templatePath = [NSHomeDirectory() stringByAppendingFormat:@"%@", downloadsPath];
//  NSString* templateFilePath = [NSString stringWithFormat:@"%@/%@", downloadsPath, @"地理国情普查"];
//
//  BOOL isUnZip = NO;
//  if (![[NSFileManager defaultManager] fileExistsAtPath:downloadsPath isDirectory:nil] || ![[NSFileManager defaultManager] fileExistsAtPath:templateFilePath isDirectory:nil]) {
//    if ([[NSFileManager defaultManager] fileExistsAtPath:commonZipPath isDirectory:nil]) {
//      isUnZip = [FileTools unZipFile:commonZipPath targetPath:templatePath];
//      NSLog(isUnZip ? @"解压数据成功" : @"解压数据失败");
//    } else {
//      if ([FileTools copyFile:originPath targetPath:commonZipPath]) {
//        isUnZip = [FileTools unZipFile:commonZipPath targetPath:templatePath];
//        NSLog(isUnZip ? @"解压数据成功" : @"解压数据失败");
//      }
//    }
//  } else {
//    isUnZip = YES;
//  }
//
//   NSString* sceneData = [NSHomeDirectory() stringByAppendingFormat:@"%@%@%@", @"/Documents/iTablet/User/", userName, @"/Data/Scene/OlympicGreen_ios.zip"];
//   NSString* sceneDir = [NSHomeDirectory() stringByAppendingFormat:@"%@%@%@", @"/Documents/iTablet/User/", userName, @"/Data/Scene/"];
//   NSString* srcSceneData = [[NSBundle mainBundle] pathForResource:@"OlympicGreen_ios" ofType:@"zip"];
//  if (![[NSFileManager defaultManager] fileExistsAtPath:[NSHomeDirectory() stringByAppendingFormat:@"%@%@%@", @"/Documents/iTablet/User/", userName, @"/Data/Scene/OlympicGreen_ios"] isDirectory:nil]) {
//      if ([FileTools copyFile:srcSceneData targetPath:sceneData]) {
//        isUnZip = [FileTools unZipFile:sceneData targetPath:sceneDir];
//        [FileTools deleteFile:sceneData];
//        NSLog(isUnZip ? @"解压数据成功" : @"解压数据失败");
//      }
//  } else {
//    isUnZip = YES;
//  }
//
//  return isUnZip;
  
  return YES;
}

+(NSString*)getLastModifiedTime:(NSDate*) nsDate{
  NSDateFormatter *fmt = [[NSDateFormatter alloc] init];
  [fmt setDateFormat:@"yyyy/MM/dd hh:mm:ss"];
  NSString *string=[fmt stringFromDate:nsDate];
  return string;
}

RCT_REMAP_METHOD(createDirectory,createDirectoryPath:(NSString*)path getHomeDirectoryWithresolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject){
  // NSString* home = NSHomeDirectory();
  BOOL b = [FileTools createFileDirectories:path];
  
  resolve(@(b));
  
}
@end

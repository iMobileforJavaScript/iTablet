//
//  FileTools.m
//  iTablet
//
//  Created by Yang Shang Long on 2018/9/21.
//  Copyright © 2018年 Facebook. All rights reserved.
//

#import "FileTools.h"

NSString * const MESSAGE_IMPORTEXTERNALDATA = @"com.supermap.RN.Mapcontrol.message_importexternaldata";
NSString * const MESSAGE_SHARERESULT = @"com.supermap.RN.Mapcontrol.message_shareresult";
static FileTools *filetools = nil;

@implementation FileTools

RCT_EXPORT_MODULE();
- (NSArray<NSString *> *)supportedEvents
{
  return @[
          MESSAGE_IMPORTEXTERNALDATA,
          MESSAGE_SHARERESULT,
           ];
}

+(id)allocWithZone:(NSZone *)zone {
  static dispatch_once_t onceToken;
  dispatch_once(&onceToken, ^{
    filetools = [super allocWithZone:zone];
  });
  return filetools;
}

+(NSString *)getFilePath:(NSString *)path{
  NSString *realPath = path;
  NSFileManager *filemanager = [NSFileManager defaultManager];
  BOOL isDir = YES;
  BOOL hasDirInPath = NO;
  NSString *dirpath;
  if([filemanager fileExistsAtPath:realPath isDirectory:&isDir]){
    NSArray *contents = [filemanager contentsOfDirectoryAtPath:realPath error:nil];
    for(NSString * item in contents){
      NSString *curPath = [NSString stringWithFormat:@"%@%@%@",realPath,item,@"/"];
      if([filemanager fileExistsAtPath:curPath isDirectory:&isDir]){
        hasDirInPath = YES;
        dirpath = curPath;
      }
      if([item hasSuffix:@".smwu"]){
        return realPath;
      }
    }
    if(hasDirInPath){
      return [FileTools getFilePath:dirpath];
    }else{
      return realPath;
    }
  }else{
    return realPath;
  }
}

RCT_REMAP_METHOD(getHomeDirectory,getHomeDirectoryWithresolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject){
  NSString* home = [NSHomeDirectory() stringByAppendingString:@"/Documents"];
  if (home) {
    resolve(home);
  }else{
    reject(@"systemUtil",@"get home directory failed",nil);
  }
}

RCT_REMAP_METHOD(getPathListByFilter, path:(NSString*)path filter:(NSDictionary*)filter resolve:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject){
  BOOL flag = YES;
  NSFileManager* fileMgr = [NSFileManager defaultManager];
  NSMutableArray* array = [NSMutableArray array];
  
  if ([fileMgr fileExistsAtPath:path isDirectory:&flag]) {
    NSArray* tempArray = [fileMgr contentsOfDirectoryAtPath:path error:nil];
    
    NSString* filterName = filter[@"name"];
    NSString* filterEx = filter[@"extension"];
    NSString* type = filter[@"type"];
//    NSString* type = @"Directory";
//    if (filter[@"type"]) {
//      type = [filter[@"type"] isEqualToString:@""] ? @"Directory" : filter[@"type"];
//    }
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
        
        // 匹配后缀
        if (filterEx != nil) {
          NSArray* exArr = [filterEx componentsSeparatedByString:@","];
          BOOL hasFile = NO;
          for (int i = 0; i < exArr.count; i++) {
            NSString* tempEx = [[exArr[i] lowercaseString] stringByTrimmingCharactersInSet:[NSCharacterSet whitespaceCharacterSet]];
            if ([tempEx isEqualToString:[extension lowercaseString]]) {
              hasFile = YES;
              break;
            }
          }
          if (!hasFile) continue;
        }
        // 匹配名称
        if (filterName != nil && ![fileName.lowercaseString containsString:[filterName.lowercaseString.lowercaseString stringByTrimmingCharactersInSet:[NSCharacterSet whitespaceCharacterSet]]]) continue;
        // 匹配类型
        if (type != nil && ([type isEqualToString:@"Directory"] != flag)) continue;
        
        [array addObject:@{@"name":fileName,@"path":tt,@"mtime":strModeDate,@"isDirectory":@(flag)}];
        
//        if(
//           (
//            filterEx != nil && [filterEx containsString:extension] &&
//            (
//             filterName == nil ||
//             [filterName containsString:fileName] ||
//             [filterName isEqualToString:@""]
//             )
//            ) ||
//           (flag && [type isEqualToString:@"Directory"])) {
//          [array addObject:@{@"name":fileName,@"path":tt,@"mtime":strModeDate,@"isDirectory":@(flag)}];
//        }
        
      }
      
    }
  }
  
  resolve(array);
}

RCT_REMAP_METHOD(getMaps, getMapsPath:(NSString*)path filter:(NSDictionary*)filter resolve:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject){
  @try {
    BOOL flag = YES;
    BOOL templateFlag = YES;
    NSFileManager* fileMgr = [NSFileManager defaultManager];
    NSMutableArray* array = [NSMutableArray array];
    
    NSString* templatePath = [NSString stringWithFormat:@"%@/%@", [path stringByDeletingLastPathComponent], @"Template"];
    NSArray* templateArray;
    if ([fileMgr fileExistsAtPath:templatePath isDirectory:&templateFlag]) {
      templateArray = [fileMgr contentsOfDirectoryAtPath:templatePath error:nil];
    }
    
    if ([fileMgr fileExistsAtPath:path isDirectory:&flag]) {
      NSArray* tempArray = [fileMgr contentsOfDirectoryAtPath:path error:nil];
      
      NSString* filterEx = @"xml";
      NSString* filterName = filter[@"name"];
      if (filterName == nil) filterName = @"";
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
          if([filterEx containsString:extension] && ([fileName containsString:filterName] || [filterName isEqualToString:@""])) {
            BOOL isTemplate = NO;
//            for (NSString* templateFileName in templateArray) {
//              NSString* _fileName = [fileName stringByDeletingPathExtension];
//              NSString* expFileName = [_fileName stringByAppendingPathExtension:@"exp"];
//              NSString* expPath = [NSString stringWithFormat:@"%@/%@", [fullPath stringByDeletingLastPathComponent], expFileName];
//              NSDictionary* expInfo;
//              if ([fileMgr fileExistsAtPath:expPath]) {
//                expInfo = [FileTools readLocalFileWithPath:expPath];
//                NSString* templateName = [expInfo objectForKey:@"Template"];
//
//                if (templateName && [templateFileName isEqualToString:[templateName lastPathComponent]]) {
//                  isTemplate = YES;
//                  break;
//                }
//              }
//            }
            
            NSString* _fileName = [fileName stringByDeletingPathExtension];
            NSString* expFileName = [_fileName stringByAppendingPathExtension:@"exp"];
            NSString* expPath = [NSString stringWithFormat:@"%@/%@", [fullPath stringByDeletingLastPathComponent], expFileName];
            NSDictionary* expInfo;
            
            
            if ([fileMgr fileExistsAtPath:expPath]) {
              expInfo = [FileTools readLocalFileWithPath:expPath];
              NSString* templateRelativePath = [expInfo objectForKey:@"Template"];
              NSString* templateFullPath = [NSString stringWithFormat:@"%@%@%@", [NSHomeDirectory() stringByAppendingString:@"/Documents/"], @"iTablet/User/", templateRelativePath];
              
              if (templateRelativePath && [fileMgr fileExistsAtPath:templateFullPath]) {
                isTemplate = YES;
              }
            }
            
            [array addObject:@{
                               @"name":fileName,
                               @"path":tt,
                               @"mtime":strModeDate,
                               @"isTemplate":@(isTemplate),
                               }];
          }
        }
      }
    }
    
    resolve(array);
  } @catch (NSException *exception) {
    reject(@"getMaps", exception.reason, nil);
  }
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

/****************************************************************************************************************/

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
  
  [FileTools createFileDirectories:defaultDataPath];
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
  //创建Import文件夹
  NSString *importFilePath = [NSHomeDirectory() stringByAppendingString:@"/Documents/iTablet/Import"];
  [FileTools deleteFile:importFilePath];
  [FileTools createFileDirectories:importFilePath];
  //创建用户目录
  NSString* commonPath = @"/Documents/iTablet/Common/";
  NSString* CachePath = @"/Documents/iTablet/Cache/";
  
  NSString* dataPath = [NSString stringWithFormat:@"%@%@%@", @"/Documents/iTablet/User/", userName, @"/Data/"];
  NSString* externalDataPath = [NSString stringWithFormat:@"%@%@%@", @"/Documents/iTablet/User/", userName, @"/ExternalData/"];
  NSString* plottingExtDataPath = [NSString stringWithFormat:@"%@%@", externalDataPath, @"/Plotting/"];
  NSString* collectionExtDataPath = [NSString stringWithFormat:@"%@%@", externalDataPath, @"/Collection/"];
  [FileTools createFileDirectories:[NSHomeDirectory() stringByAppendingFormat:@"%@", dataPath]];
  [FileTools createFileDirectories:[NSHomeDirectory() stringByAppendingFormat:@"%@", commonPath]];
  [FileTools createFileDirectories:[NSHomeDirectory() stringByAppendingFormat:@"%@", CachePath]];
  [FileTools createFileDirectories:[NSHomeDirectory() stringByAppendingFormat:@"%@%@", dataPath, @"Attribute"]];
  [FileTools createFileDirectories:[NSHomeDirectory() stringByAppendingFormat:@"%@%@", dataPath, @"Datasource"]];
  [FileTools createFileDirectories:[NSHomeDirectory() stringByAppendingFormat:@"%@%@", dataPath, @"Scene"]];
  [FileTools createFileDirectories:[NSHomeDirectory() stringByAppendingFormat:@"%@%@", dataPath, @"Symbol"]];
  [FileTools createFileDirectories:[NSHomeDirectory() stringByAppendingFormat:@"%@%@", dataPath, @"Template"]];
  [FileTools createFileDirectories:[NSHomeDirectory() stringByAppendingFormat:@"%@%@", dataPath, @"Workspace"]];
  [FileTools createFileDirectories:[NSHomeDirectory() stringByAppendingFormat:@"%@%@", dataPath, @"Temp"]];
  [FileTools createFileDirectories:[NSHomeDirectory() stringByAppendingFormat:@"%@%@", dataPath, @"Color"]];
  [FileTools createFileDirectories:[NSHomeDirectory() stringByAppendingFormat:@"%@%@", dataPath, @"Map"]];
  [FileTools createFileDirectories:[NSHomeDirectory() stringByAppendingFormat:@"%@", externalDataPath]];
  [FileTools createFileDirectories:[NSHomeDirectory() stringByAppendingFormat:@"%@", plottingExtDataPath]];
  [FileTools createFileDirectories:[NSHomeDirectory() stringByAppendingFormat:@"%@", collectionExtDataPath]];
  
  // 初始化模板数据
  NSString* originPath = [[NSBundle mainBundle] pathForResource:@"Template" ofType:@"zip"];
  NSString* commonZipPath = [NSHomeDirectory() stringByAppendingFormat:@"%@%@", commonPath, @"Template.zip"];
  NSString* templatePath = [NSHomeDirectory() stringByAppendingFormat:@"%@", collectionExtDataPath];
  NSString* templateFilePath = [NSString stringWithFormat:@"%@/%@", collectionExtDataPath, @"地理国情普查"];
  
  BOOL isUnZip = NO;
  if (![[NSFileManager defaultManager] fileExistsAtPath:externalDataPath isDirectory:nil] || ![[NSFileManager defaultManager] fileExistsAtPath:templateFilePath isDirectory:nil]) {
    if ([[NSFileManager defaultManager] fileExistsAtPath:commonZipPath isDirectory:nil]) {
      isUnZip = [FileTools unZipFile:commonZipPath targetPath:templatePath];
      NSLog(isUnZip ? @"解压数据成功" : @"解压数据失败");
    } else {
      if ([FileTools copyFile:originPath targetPath:commonZipPath]) {
        isUnZip = [FileTools unZipFile:commonZipPath targetPath:templatePath];
        NSLog(isUnZip ? @"解压数据成功" : @"解压数据失败");
      }
    }
  } else {
    isUnZip = YES;
  }
  
  NSString* commonCache = [NSHomeDirectory() stringByAppendingFormat:@"%@/%@",CachePath,@"publicMap.txt"];
  if (![[NSFileManager defaultManager] fileExistsAtPath:commonCache isDirectory:nil]) {
    srclic = [[NSBundle mainBundle] pathForResource:@"publicMap" ofType:@"txt"];
    if (srclic) {
      
      if(![[NSFileManager defaultManager] copyItemAtPath:srclic toPath:commonCache error:nil])
        NSLog(@"拷贝数据失败");
    }
  }
  
  NSString *labelUDB = [NSHomeDirectory() stringByAppendingFormat:@"%@%@%@%@", dataPath, @"Datasource/Label_",userName,@"#.udb"];
  
  if(![[NSFileManager defaultManager]fileExistsAtPath:labelUDB]){
    Workspace *workspace = [[Workspace alloc] init];
    DatasourceConnectionInfo *info = [[DatasourceConnectionInfo alloc]init];
    info.alias = @"Label";
    info.engineType = ET_UDB;
    info.server = labelUDB;
    Datasources *datasources = workspace.datasources;
    Datasource *datasource = [datasources create:info];
    if (datasource != nil) {
      NSLog(@"数据源创建成功");
    }else{
      NSLog(@"数据源创建失败");
    }
    [workspace dispose];
  }

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

+ (NSDictionary *)readLocalFileWithPath:(NSString *)path {
  // 将文件数据化
  NSData *data = [[NSData alloc] initWithContentsOfFile:path];
  // 对数据进行JSON格式化并返回字典形式
  return [NSJSONSerialization JSONObjectWithData:data options:kNilOptions error:nil];
}

RCT_REMAP_METHOD(getImportResult, getImportResult:(RCTPromiseResolveBlock)resolve rejector:(RCTPromiseRejectBlock)reject){
  @try {
    BOOL isSuccess = hasImportedData;
    resolve(@(isSuccess));
  } @catch (NSException *exception) {
    reject(@"",@"improtError",(NSError *)exception);
  }
}

RCT_REMAP_METHOD(importData, importData:(RCTPromiseResolveBlock)resolve rejector:(RCTPromiseRejectBlock)reject){
  
  NSString* head=[NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES) objectAtIndex:0];
  NSString * destinationPath = [head stringByAppendingString:@"/iTablet/Import/"];
  BOOL isImportSuccess = NO;
  NSFileManager *filemanager = [NSFileManager defaultManager];
  if(hasImportedData){
    @try {
      NSMutableArray *workSpaceFile = [[NSMutableArray alloc]init];
      NSMutableArray *dataSourceFile = [[NSMutableArray alloc]init];
      NSMutableArray *xmlSourceFile = [[NSMutableArray alloc]init];
      NSMutableArray *symbolSourceFile = [[NSMutableArray alloc]init];
      NSString *deletepath = destinationPath;
      destinationPath = [FileTools getFilePath:destinationPath];
      NSArray *dirArray = [filemanager contentsOfDirectoryAtPath:destinationPath error:nil];
      NSString *suffix = @"";
      
      for(NSString *str in dirArray){
        suffix = [str pathExtension];
        
        NSDictionary *verisonMap = [[NSDictionary alloc] initWithObjectsAndKeys:
                                    @"9.0",@"smwu",
                                    @"8.0",@"sxwu",
                                    @"4.0",@"sxw",
                                    @"5.0",@"smw",
                                    nil];
        if([suffix isEqualToString:@"smwu"] || [suffix isEqualToString:@"sxwu"] ||[suffix isEqualToString:@"sxw"] ||[suffix isEqualToString:@"smw"] ){
          // workspace add
          NSMutableDictionary *dic = [[NSMutableDictionary alloc]init];
          
          [dic setValue:[destinationPath stringByAppendingString:str] forKey:@"server"];
          [dic setValue:[verisonMap valueForKey:suffix] forKey:@"type"];
          
          [workSpaceFile addObject:dic];
        }
        if([suffix isEqualToString:@"udb"]){
          //udb add
          [dataSourceFile addObject:[destinationPath stringByAppendingString:str]];
        }
        if([suffix isEqualToString:@"xml"]){
          [xmlSourceFile addObject:[destinationPath stringByAppendingString:str]];
        }
        if([suffix isEqualToString:@"sym"] || [suffix isEqualToString:@"lsl"] || [suffix isEqualToString:@"bru"]){
           [symbolSourceFile addObject:[destinationPath stringByAppendingString:str]];
        }
      }
      SMap *sMap = [SMap singletonInstance];
      if(xmlSourceFile.count ){
        NSString *fileDir = [[[xmlSourceFile objectAtIndex:0]lastPathComponent] stringByDeletingPathExtension];
        NSString *collection = [NSString stringWithFormat:@"%@%@%@%@%@%@",head,@"/iTablet/User",[FileTools getUserName],@"/ExternalData/Collection/",fileDir,@"/"];
        if(![filemanager fileExistsAtPath:collection]){
          [FileTools createFileDirectories:collection];
        }
        for(int i = 0; i < dirArray.count; i++){
          NSString *fileName = [dirArray objectAtIndex:i];
          [FileTools copyFile:[destinationPath stringByAppendingString:fileName] targetPath:[collection stringByAppendingString:fileName]];
        }
        if (workSpaceFile.count) {
          [sMap.smMapWC importWorkspaceInfo:[workSpaceFile objectAtIndex:0] toModule:@"" isPrivate:@(YES)];
        }
        isImportSuccess = YES;
        hasImportedData = NO;
      }
      else if(workSpaceFile.count){
        //导入工作空间
        BOOL importResult = [sMap.smMapWC importWorkspaceInfo:[workSpaceFile objectAtIndex:0] toModule:@"" isPrivate:YES];
        
        if(importResult){
          hasImportedData = NO;
          isImportSuccess = YES;
          [FileTools deleteFile:deletepath];
        }
      }else if([dataSourceFile count]){
        //导入udb文件
        for(int i = 0,len = dataSourceFile.count; i < len; i++){
          Workspace *ws = [[Workspace alloc]init];
          DatasourceConnectionInfo *dsci = [[DatasourceConnectionInfo alloc]init];
          dsci.server = [dataSourceFile objectAtIndex:i];
          dsci.engineType = ET_UDB;
          Datasource *datasource = [[ws datasources]open:dsci];
          if([datasource.description isEqualToString:@"Label"]){
            NSString *udbName = [NSString stringWithFormat:@"%@%@%@",@"Label_",[FileTools getUserName],@"#"];
            NSString *todatasource = [NSString stringWithFormat:@"%@%@%@%@%@",head,@"/iTablet/User/",[FileTools getUserName],@"/Data/Datasource/",udbName];
            [filemanager createFileAtPath:todatasource contents:nil attributes:nil];
            if([filemanager fileExistsAtPath:todatasource]){
              [sMap.smMapWC copyDatasetsFrom:[dataSourceFile objectAtIndex:i] to:todatasource];
              isImportSuccess = YES;
              hasImportedData = NO;
            }
          }else{
            [sMap.smMapWC importDatasourceFile:[dataSourceFile objectAtIndex:0] ofModule:nil];
            isImportSuccess = YES;
            hasImportedData = NO;
          }
        }
      }else if(symbolSourceFile.count){
        NSString *symbolPath = [NSString stringWithFormat:@"%@%@%@%@",head,@"/iTablet/User/",[FileTools getUserName],@"/Data/Symbol/"];
        for(int i = 0; i < symbolSourceFile.count; i++){
          NSString *fileName = [symbolSourceFile objectAtIndex:i];
          [FileTools copyFile:[destinationPath stringByAppendingString:fileName] targetPath:[symbolPath stringByAppendingString:fileName]];
        }
        isImportSuccess = YES;
        hasImportedData = NO;
      }
      resolve(@(isImportSuccess));
    } @catch (NSException *exception) {
      reject(@"",@"improtError",(NSError *)exception);
    }
  }
  
}
/*
 * 获取用户名
 */
+(NSString *)getUserName{
  SMap *sMap = [SMap singletonInstance];
  NSString *userName = [sMap.smMapWC getUserName];
  return userName;
}
/*
 * 判断压缩包是否存在并解压，给RN发送消息，用户选择是否导入
 */
+(BOOL)getUriState:(NSURL *)url{
  
   NSString* head=[NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES) objectAtIndex:0];
  
  NSString* zipFilePath=[url absoluteString];
 
  zipFilePath = [@"/" stringByAppendingString:[[zipFilePath componentsSeparatedByString:@"Documents"] objectAtIndex:1]];
  zipFilePath=[[head stringByAppendingString:zipFilePath] stringByRemovingPercentEncoding];
  
  NSFileManager *filemanager = [NSFileManager defaultManager];
  
  NSString *destinationPath = [head stringByAppendingString: @"/iTablet/Import/"];
  BOOL isFileExist =[filemanager fileExistsAtPath:zipFilePath isDirectory:nil];
  
  if(isFileExist)
  {
     BOOL isUnzipSuccess = [FileTools unZipFile:zipFilePath targetPath:destinationPath];
    if(isUnzipSuccess){
      [FileTools deleteFile:zipFilePath];
      hasImportedData = YES;
      [filetools sendEventWithName:MESSAGE_IMPORTEXTERNALDATA
                              body:[NSNumber numberWithBool:YES]];
      
    }
   
  }
  
  return isFileExist;
}
/*
 * 微信分享完成或取消回调触发，给RN发信息通知分享成功 6.7.2版本微信更新后无法获取是否分享成功，success和cancel统一走success回调
 */
+(void)sendShareResult{
  [filetools sendEventWithName:MESSAGE_SHARERESULT body:nil];
}
@end

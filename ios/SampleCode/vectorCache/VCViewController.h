//
//  ViewController.h
//  OpenGLCache
//
//  Created by imobile on 2017/11/14.
//  Copyright © 2017年 imobile. All rights reserved.
//

#import <UIKit/UIKit.h>
#import <SuperMap/SuperMap.h>

@interface VCViewController : UIViewController {
    
    //IBOutlet MapControl *m_mapControl;
    
  IBOutlet MapControl *m_mapControl;
  Map *m_map;
    DatasourceConnectionInfo *m_Info;
    Workspace *m_workspace;
    Datasource *m_datasource;
}


@end


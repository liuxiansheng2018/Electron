### 技术选型
   1.  Native (C++/C#/Objective-C)
      理由： 高性能， 原生体验，包体积小，   门槛高，迭代速度慢
   2.  QT （软件： WPS, DropBox）
      理由： 基于C++， 跨平台（MAC, windows, ios, android, Linux, 嵌入式）， 高性能， 媲美原生体验， 门槛高， 迭代速度一般
   3. Flutter
      理由： 跨端（ios, android, mac, window, Linux, web）, 基建少 ，pc端正在发展中（mac > Linux, windows上基本不可用的）(太新了)
   4. NW.js （软件：微信开发工具）
      理由： 跨平台（mac, windows, linux） , 迭代速度快，web技术构建， 源码加密，支持chrome扩展， 不错的社区， 包体积大， 性能一般
   5. Electron （软件： 大象， atom, vscode, whatsApp, wordPress...）
      理由： 跨平台（mac, window, linux, 不支持xp）, web技术构建， 活跃的社区， 大型应用案例， 包体积大， 性能一般
  more: carlo, wpf, chromium Embedded Framework(CEF), PWA


### 安装环境
    1. 安装node 
    2. 安装 npm install electron -S
    3. 安装 npm install --arch=ia32 --platform=win32 electron (指定arch=ia32来安装32位electron, 在window上平台打包都要基于32位来打。这样打出来的包在32位和64位都可以用 )
     验证是否安装成功
       1. npx electron -v   2. ./node_modules/.bin/electron -v

###Electro中的主进程
      1. electron 运行package.json的main脚本被称为主进程
      2. 每个应用都只有一个主进程
      3. 管理原生GUI, 典型的窗口（BrowserWindow, Tray, Dock, Menu）
      4. 创建渲染进程
      5. 控制应用的生命周期（app)     
###Electron的渲染进程
      1. 展示web页面的进程称为渲染进程
      2. 通过Node.js, Electron提供的api， 可以跟系统底层打交道
      3. 一个Electron应用可以有多个渲染进程
###主进程 和 渲染进程的 的众多Natvie模块
  主进程： 20多个(app, BrowserWindow,ipcMain,menu,tray,menuItem...)
  渲染进程： 8个 (ipcRenderer, remote, desktopCaptrue)
  有4个模块在两个进程中都可以使用（clipboard, crashReporter, shell, nativeImage）

###进程中通信
    * Electron 通信的目的
        a). 通知事件
        b). 数据传输
        c). 共享数据
    * IPC 模块通信
        1. Electron提供了IPC通信模块, 主进程的ipcMain 和 渲染进程的 ipcRenderer
        2. ipcMain ipcRenderer都是EventEmitter对象
    * 渲染进程到主进程
        a). Callback写法：
              # ipcRenderer.send(channel, ...args)
              # ipcMain.on(channel, handler)
        b). Promise写法（electron7.0之后， 处理请求 + 响应模式）
              # ipcRenderer.invoke(channel, ...args)
              # ipcMain.handle(channel, handler)
    * 主进程到渲染进程
        a. 因为我们的渲染进程有多个，所以我们可以借用webContents指定的渲染进程
          # ipcRenderer.on(channel, handle)              
          # webContents.send(channel)

    * 渲染进程和渲染进程
       a). 通知事件
            # 通过主进程转发 （Electron 5之前）
            # ipcRenderer.sendTo  (Electron5 之后)

       b). 数据共享
             # web技术 (localStorage、 sessionStorage、indexdDB) 
             # 使用remote(不推荐，会将我们的数据挂载在我们的全局，因为用不好会导致程序卡顿， 影响性能 )

###   经验 & 技巧
  1. 少用remote
  2. 不要用sync 模式
  3. 在请求 + 响应的通信模式下， 需要自定义超时限制
    

### electron如何把启动react脚本 和 启动 electron 命令从两个结合成一个
      1. npm i concurrently
      2. npm i wait-on
      3. 在package.json 中的script设置启动脚本 "start": "concurrently \"npm run start:main\" \"wait-on localhost:3000 npm run start:render\" ",
 
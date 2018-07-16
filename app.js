const { app, BrowserWindow } = require('electron');
const client = require('electron-connect').client;

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

function createWindow() {
    // 创建浏览器窗口。
    mainWindow = new BrowserWindow({ width: 800, height: 600 });

    // 然后加载应用的 index.html。
    mainWindow.loadFile('index.html');

    client.create(mainWindow);

    // 打开开发者工具
    mainWindow.webContents.openDevTools();

    // 当 window 被关闭，这个事件会被触发。
    mainWindow.on('closed', () => {
        // 取消引用 window 对象，如果你的应用支持多窗口的话，
        // 通常会把多个 window 对象存放在一个数组里面，
        // 与此同时，你应该删除相应的元素。
        mainWindow = null;
    });
}

// Electron 会在初始化后并准备
// 创建浏览器窗口时，调用这个函数。
// 部分 API 在 ready 事件触发后才能使用。
app.on('ready', createWindow);
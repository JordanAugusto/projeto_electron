const {app, BrowserWindow, } = require('electron');

app.setAppUserModelId('emails')

function createWindow(){
    let mainWindow = new BrowserWindow({
        width: 1600,
        height: 800,
        icon:__dirname+'/icon.png',
    });

    mainWindow.loadFile(__dirname + '/src/index.html');
    mainWindow.on('closed', function(){
        mainWindow = null;
    });

    mainWindow.setMenu(null); // tirando o menu 

}   
app.on('ready', createWindow);
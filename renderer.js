
const path = require('path');
const async = require('async');
const puppeteer = require('puppeteer');
const mume = require("@shd101wyy/mume");
const { getPath, showInfo, getMarkdownList } = require('./business');

// 获取显现提示信息的Dom
let $msg = $('#msg');

// 开始转换
$('#startTask').click( async function(){

    let md_dir_path, pdf_dir_path, md_filename_list;

    // 获取markdown源文件路径
    let md = getPath.call($('#md_path'));
    if (md.success){
        md_dir_path = md.path;
    } else {
        showInfo.call($msg, md.info);
        return;
    };

    // 获取生成的pdf文件存储路径
    let pdf = getPath.call($('#pdf_path'));
    if (pdf.success) {
        pdf_dir_path = pdf.path;
    } else {
        showInfo.call($msg, pdf.info);
        return;
    };

    // 获取markdown文件名字列表
    let md_list_result = await getMarkdownList(md_dir_path);
    if (md_list_result.success){
        md_filename_list = md_list_result.data;
    }else{
        showInfo.call($msg, md_list_result.info);
        return;
    };

    const browser = await puppeteer.launch({
        executablePath: 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe'
    });

    await mume.init();

    async.map(md_filename_list, async (md_filename, callback)=>{
        // markdown文件完整路径
        let md_file_path = md_dir_path + '\\' + md_filename;
        // markdown文件无后缀名字
        let filename = path.basename(md_filename,'.md');
        // 存储html文件完整路径
        let html_file_path = md_dir_path + '\\' + filename + '.html';
        // 存储pdf文件完整路径
        let pdf_file_path = pdf_dir_path + '\\' + filename + '.pdf'

        //md 转换成html中间文件 html文件存储在md相同文件夹下
        const engine = new mume.MarkdownEngine({
            filePath: md_file_path,
            config: {
                previewTheme: "github-light.css",
                // revealjsTheme: "white.css"
                codeBlockTheme: "default.css",
                printBackground: true,
                enableScriptExecution: true, // <= for running code chunks
            },
        });

        // html export
        engine.htmlExport({ offline: false, runAllCodeChunks: true }).then(async ()=>{
            
            let page = await browser.newPage();
            await page.goto(html_file_path, { waitUntil: 'networkidle2' });
            page.pdf({
                path: pdf_file_path,
                format: 'A4',
                margin: { top: '50px', right: '30px', bottom: '50px', left: '30px', }
            });
        });
        
    });


    


});


// (async () => {
//         const browser = await puppeteer.launch({
//             executablePath:'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe'
//         });
//         const page = await browser.newPage();
//         await page.goto('https://baidu.com');
//         await page.screenshot({ path: 'baidu.png' });

//         await browser.close();
// })();
const fs = require('fs');

module.exports = function (source_path) {
    return new Promise((resolve, reject) => {
        fs.readdir(source_path, function (err, files) {
            if (err) {

                reject({success: false, info: '读取md目录文件列表失败：' + err});

            } else {
                
                files = files.filter((item) => {
                    if (/\.md$/.test(item)) {
                        return item;
                    }
                });

                resolve({success: true, data:files})
            }

        });
    })
}
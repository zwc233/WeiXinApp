const cloud = require('wx-server-sdk')
const fs = require('fs');

function delDir(path) {
    console.log("delete Dir")
    let files = [];
    if (fs.existsSync(path)) {
        files = fs.readdirSync(path);
        files.forEach((file, index) => {
            let curPath = path + "/" + file;
            if (fs.statSync(curPath).isDirectory()) {
                delDir(curPath); //递归删除文件夹
            } else {
                fs.unlinkSync(curPath); //删除文件
            }
        });
        // fs.rmdirSync(path); // 删除文件夹自身
    }
}
readDocx_fs = function (path) {
    return new Promise((resolve, reject) => {
        fs.readFile(path, (err, data) => {
            resolve(data);
            reject(err);
        })
    })
}
//save QR
saveFile = function (filePath, fileData) {
    return new Promise((resolve, reject) => {
        const wstream = fs.createWriteStream(filePath);
        wstream.on('open', () => {
            const blockSize = 128;
            const nbBlocks = Math.ceil(fileData.length / (blockSize));
            for (let i = 0; i < nbBlocks; i += 1) {
                const currentBlock = fileData.slice(
                    blockSize * i,
                    Math.min(blockSize * (i + 1), fileData.length),
                );
                wstream.write(currentBlock);
            }
            wstream.end();
        });
        wstream.on('error', (err) => {
            reject(err);
        });
        wstream.on('finish', () => {
            resolve(true);
        });
    });
}


exports.genWord = async (event) => {
    let officegen = require('officegen');
    let fs = require('fs');
    let docx = officegen('docx');

    //ini
    delDir('/tmp')
    var item = event.data
    var filePath = 'exportVoluntaryData'
    var fileName = "21zyzm" + Date.parse(new Date()) + '.docx'
    var varpath = filePath + '/' + fileName

    //=========以下建构文档内容==========

    //get QRcode
    const result = await cloud.openapi.wxacode.getUnlimited({
        page: '/miniprogram/pages/admin_science/admin_science',
        scene: item.id,
        width: 140,
    })
    const QRcode = result.buffer
    await saveFile('/tmp/qr.jpg', QRcode); // 这里的fileData是Buffer类型

    timeBottom = time.getFullYear() + '年' + (time.getMonth() + 1) + '月' + time.getDate() + '日'
    for (var i in item.volunteerInfo) {
        let pObj = docx.createP({
            align: 'center'
        })
        pObj = docx.createP({
            align: 'center'
        })
        pObj.addText('志愿服务时间证明', {
            bold: true,
            font_face: 'KaiTi',
            font_size: 19,
            color: '595959'
        });
        pObj = docx.createP()
        pObj = docx.createP({
            align: 'justify'
        })
        pObj.options.indentFirstLine = 440;
        if (item.volunteerInfo[i].academy && item.volunteerInfo[i].major && item.volunteerInfo[i].grade) {
            var txt = item.volunteerInfo[i].academy + ' ' + item.volunteerInfo[i].major + '专业 ' + item.volunteerInfo[i].grade + ' ' + item.volunteerInfo[i].name + ' 同学（学号 ' + item.volunteerInfo[i].idnum + '），于 ' + date + '参加 ' + item.title + ' 工作，志愿服务时间达到 ' + item.hours + ' 小时。'


        } else {
            var txt = item.volunteerInfo[i].name + ' 同学（学号 ' + item.volunteerInfo[i].idnum + '），于 ' + date + '参加 ' + item.title + ' 工作，志愿服务时间达到 ' + item.hours + ' 小时。'
        }
        pObj.addText(txt, {
            font_face: 'FangSong',
            font_size: 15,
            color: '595959'
        });
        pObj = docx.createP()
        pObj.options.indentFirstLine = 440;
        pObj.addText('特此证明。', {
            font_face: 'FangSong',
            font_size: 15,
            color: '595959'
        });
        pObj = docx.createP()
        pObj.options.indentFirstLine = 440;
        pObj.addText('证明人：' + event.tea_info.name + '  ' + event.tea_info.phone, {
            font_face: 'FangSong',
            font_size: 15,
            color: '595959'
        });
        pObj = docx.createP()
        pObj = docx.createP()
        pObj.options.indentFirstLine = 440;
        pObj.addText('微信扫描下方小程序码，可核验此证明。核验信息与此证明一致时，此证明不加盖公章仍然有效；若不一致，则以加盖公章的证明为准。', {
            font_face: 'FangSong',
            font_size: 12,
            color: '595959',
            italic: true,
        });
        pObj = docx.createP()
        pObj.options.indentFirstLine = 440;
        pObj.addImage('/tmp/qr.jpg', {
            cx: 140,
            cy: 140
        });
        pObj = docx.createP()
        pObj = docx.createP()
        pObj = docx.createP({
            align: 'right'
        })
        pObj.addText('XXXXX', {
            font_face: 'FangSong',
            font_size: 15,
            color: '595959'
        });
        pObj = docx.createP({
            align: 'right'
        })
        pObj.addText(timeBottom, {
            font_face: 'FangSong',
            font_size: 15,
            color: '595959'
        });

        // Add a Footer:
        pObj = docx.createP()
        pObj = docx.createP()
        pObj = docx.createP()
        pObj.addText('XXXXX证明_' + item._id, {
            font_face: 'FangSong',
            font_size: 10,
            color: '808080'
        });
        pObj = docx.createP()
        pObj.addText(time.toString(), {
            font_face: 'FangSong',
            font_size: 10,
            color: '808080'
        });


        if (i != ((item.volunteerInfo).length - 1)) {
            docx.putPageBreak()
        }
    }

    //=======================建构文档内容结束=========================

    // Let's generate the Word document into a file:
    let out = fs.createWriteStream('/tmp/' + fileName)

    return new Promise((resolve, reject) => {
        docx.generate(out);
        out.on('close', async function () {
            console.log("文件已被关闭,总共写入字节", out.bytesWritten)
            // console.log('写入的文件路径是'+ out.path);
            var fileBuf = await readDocx_fs(out.path);
            var upd = await cloud.uploadFile({
                cloudPath: varpath,
                fileContent: fileBuf,
            });
            console.log(docx)

            resolve({
                event,
                upd,
                size: Math.floor(100 * out.bytesWritten / 1024) / 100 + "KB"
            })
        });
        out.on('error', (err) => {
            console.error(err);
            reject({
                errMsg: err
            })
        });
    })
}
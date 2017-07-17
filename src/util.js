var async = require("async");
const { spawn } = require('child_process');
var iconv = require('iconv-lite');
var fs = require("fs");
const path = require('path')

/**
 *导出一个顺序执行的方法
 *handleSeries([1,2,3], (it)=>{return (cb)=>{console.log("/home/" + it);cb(null, "/home/" + it)}}, done);
*/
exports.handleSeries = (list ,handle, done)=>{
     var l ;
     l = list.map((it)=>{
          return handle(it);
     });
     async.series(l, done);
}

/**
 * 返回(切割 node x.js) -a，传入的参数
*/
exports.getArgvs = ()=>{
	return process.argv.slice(2);
}

exports.log = (tx)=>{
	console.log(tx);
}

/*
 *执行一个命令
 *异步
*/
exports.execCmd = (cmd, params, cb, options)=>{
	var bat = spawn(cmd, params, options); 
	
	bat.stdout.on('data', (data) => {
	  console.log(exports.toGBK(data));
	});

	bat.stderr.on('data', (data) => {
	  console.error(exports.toGBK(data));
	  // cb(new Error(-100));
	});

	bat.on('exit', (code) => {
	  // console.log(`Child exited with code ${code}`);
	  cb(null, code);
	});
}

/*
* 原生Node仅支持如下编码：utf8, ucs2, ascii, binary, base64, hex，并不支持中文GBK或GB2312之类的编码，因此如果要读写GBK或GB2312格式的文件的中文内容，必须要用额外的模块：iconv-lite
*/
exports.toGBK = (tx)=>{
	if(process.platform.indexOf('win32') != -1){
		return iconv.decode(tx, 'gbk'); 
	}else{
		return tx;
	}
}

/**
*
*递归下面所有的文件，传入handle函数，返回文件路径
*handleFile是针对每个文件的路径
*文件顺序无法保证
*/
exports.recursiveDir = (path, handleFile)=>{
	fs.readdir(path, function(err, files) {  
		if (err) {  
			console.log('read dir error');  
		} else {  
			files.forEach(function(item) {  
				var tmpPath = path + '/' + item;  
				fs.stat(tmpPath, function(err1, stats) {  
					if (err1) {  
						console.log('stat error');  
					} else {  
						if (stats.isDirectory()) {  
							exports.recursiveDir(tmpPath, handleFile);  
						} else {
							//正则文件名
							handleFile(tmpPath);  
						}  
					}  
				})  
			});  

		}  
	});  
}

/**
*
*递归下面所有的文件，传入handle函数，返回文件路径
*handleFile是针对每个文件的路径
*文件顺序无法保证
*/
exports.recursiveDirSync = (path, handleFile)=>{
	var files = fs.readdirSync(path);
	files.forEach(function(item) {  
		var tmpPath = path + '/' + item;  
		var stats =  fs.statSync(tmpPath);
		if (stats.isDirectory()) {  
			exports.recursiveDirSync(tmpPath, handleFile);  
		} else {
			//正则文件名
			handleFile(tmpPath);  
		}  
	});
}

exports.ENV_SEPARATOR = process.platform === 'win32' ? ';' : ':';

exports.findFilesInDir = function(dirPath, regex, recursive) {
	var files = []
	var listFiles = (dir) => {
		fs.readdirSync(dir).forEach(item => {
			var thisPath = path.join(dir, item)
			var stats = fs.statSync(thisPath)
			if(recursive && stats.isDirectory()) {
				listFiles(thisPath)
			} else if(stats.isFile()) {
				if(!regex || regex.test(item)) {
					files.push(thisPath)
				}
			}
		})
	}
	listFiles(dirPath)
	return files
}
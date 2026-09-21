const fs = require("fs");
const path = require("path");
const { myEmitter } = require("./fileEvent");

const file1Path = path.join(__dirname, "test1.txt");
const file2Path = path.join(__dirname, "test2.txt");

let file1Data = null;
let file2Data = null;

console.log("Start reading files Non-Blocking Asynchronous...");

// قراءة الملف الأول بشكل غير متزامن
fs.readFile(file1Path, "utf-8", (err, data) => {
    if (err) {
        console.error("Error while reading test1.txt:", err);
        return;
    }
    console.log("The file has been read completely test1.txt");
    file1Data = data;

    // فحص ما إذا كان الملف الآخر قد انتهى من القراءة أيضاً
    if (file2Data !== null) {
        myEmitter.emit("filesRead", file1Data, file2Data);
    }
});

// قراءة الملف الثاني بشكل غير متزامن
fs.readFile(file2Path, "utf-8", (err, data) => {
    if (err) {
        console.error("Error while reading test2.txt:", err);
        return;
    }
    console.log("The file has been read completely  test2.txt");
    file2Data = data;

    // فحص ما إذا كان الملف الأول قد انتهى من القراءة أيضاً
    if (file1Data !== null) {
        myEmitter.emit("filesRead", file1Data, file2Data);
    }
});

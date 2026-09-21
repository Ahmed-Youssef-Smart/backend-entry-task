const EventEmitter = require("events");
const fs = require("fs");
const path = require("path");

// إنشاء كائن EventEmitter
const myEmitter = new EventEmitter();

// الاستماع لحدث اكتمال القراءة للدمج والكتابة في ملف جديد
myEmitter.on("filesRead", (data1, data2) => {
    console.log("[Event Triggered] Reading of the two files has been successfully completed.!");
    
    // دمج محتوى الملفين
    const combinedContent = `--- content test1.txt ---\n${data1}\n\n--- content test2.txt ---\n${data2}\n`;
    const outputPath = path.join(__dirname, "combined.txt");

    // كتابة المحتوى المدمج في ملف ثالث باستخدام Non-Blocking Async
    fs.writeFile(outputPath, combinedContent, "utf-8", (err) => {
        if (err) {
            console.error("An error occurred while writing the third file:", err);
            return;
        }
        console.log(`[Success] The content has been successfully integrated and written into the file: ${outputPath}`);
    });
});

module.exports = {
    myEmitter
};

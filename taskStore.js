// ==========================================
// مصفوفة البيانات (المهام)
// ==========================================
let tasks = [
  { id: 1, title: "كتابة التقرير", status: "todo", priority: 2, ownerId: 7 },
  { id: 2, title: "مراجعة الكود", status: "doing", priority: 3, ownerId: 7 },
  { id: 3, title: "تصميم الواجهة", status: "done", priority: 1, ownerId: 3 }
];

// ==========================================
// 1. دالة عرض البيانات في الصفحة (Display)
// ==========================================
function displayTasks() {
  const container = document.getElementById("tasksList");
  if (!container) return;
  container.innerHTML = ""; // تفريغ المكان قبل إعادة العرض

  // المرور على كل مهمة وعرضها في الصفحة كما في السابق
  tasks.forEach(function(task) {
    // تحديد الحالة إذا كانت قادمة من الموقع الخارجي أو من المصفوفة
    let taskStatus = task.status;
    if (task.completed !== undefined) {
      taskStatus = task.completed ? "done" : "todo";
    }

    container.innerHTML += `
      <div style="border: 1px solid #ccc; padding: 10px; margin: 10px 0; border-radius: 5px;">
        <p><strong>رقم المهمة (ID):</strong> ${task.id}</p>
        <p><strong>العنوان:</strong> ${task.title}</p>
        <p><strong>الحالة:</strong> ${taskStatus}</p>
        <p><strong>الأولوية:</strong> ${task.priority || 1}</p>
      </div>
    `;
  });
}

// ==========================================
// 2. دالة إضافة مهمة جديدة (Add)
// ==========================================
function addTask() {
  const input = document.getElementById("taskTitle");
  const title = input.value;

  if (title === "") {
    alert("من فضلك اكتب عنوان المهمة");
    return;
  }

  // إنشاء المهمة الجديدة
  const newTask = {
    id: tasks.length + 1,
    title: title,
    status: "todo",
    priority: 1,
    ownerId: 1
  };

  // إضافتها للمصفوفة
  tasks[tasks.length] = newTask;

  // تفريغ حقل الإدخال
  input.value = "";

  // عرض البيانات بعد الإضافة
  displayTasks();
}

// ==========================================
// 3. دالة جلب البيانات حسب رقم المستخدم (fetch by userId)
// مع شرط رفض القيمة إذا كانت فارغة
// ==========================================
function fetchTodos() {
  const input = document.getElementById("userIdInput");
  const userId = input.value.trim();

  // شرط رفض القيمة إذا كانت فارغة
  if (userId === "") {
    alert("من فضلك أدخل رقم المستخدم (userId)");
    return;
  }

  // جلب البيانات من الموقع
  fetch("https://jsonplaceholder.typicode.com/todos?userId=" + userId)
    .then(function(response) {
      return response.json();
    })
    .then(function(data) {
      if (data.length === 0) {
        alert("لا توجد بيانات لهذا المستخدم");
        return;
      }
      tasks = data;
      displayTasks();
    })
    .catch(function(error) {
      alert("حدث خطأ أثناء جلب البيانات");
    });
}

// ==========================================
// 4. دالة عرض جميع البيانات من الموقع
// يتم تشغيلها عند الضغط على زر "عرض جميع البيانات"
// ==========================================
function fetchAllTodos() {
  fetch("https://jsonplaceholder.typicode.com/todos")
    .then(function(response) {
      return response.json();
    })
    .then(function(data) {
      tasks = data;
      displayTasks(); // عرض البيانات فقط عند الضغط على الزر
    })
    .catch(function(error) {
      alert("حدث خطأ أثناء جلب البيانات");
    });
}

// ==========================================
// 5. دوال المشروع الأساسية (Functions)
// ==========================================
function getTasks(status) {
  if (!status || status === "all") return tasks;
  return tasks.filter(function(t) { return t.status === status; });
}

function getTaskById(id) {
  for (let i = 0; i < tasks.length; i++) {
    if (tasks[i].id == id) return tasks[i];
  }
  return null;
}

function updateTaskStatus(id, newStatus) {
  const task = getTaskById(id);
  if (task) {
    task.status = newStatus;
    displayTasks();
    return task;
  }
  return null;
}

function deleteTask(id) {
  for (let i = 0; i < tasks.length; i++) {
    if (tasks[i].id == id) {
      tasks.splice(i, 1);
      displayTasks();
      return true;
    }
  }
  return false;
}

function countTasks() {
  let todo = 0, doing = 0, done = 0;
  tasks.forEach(function(t) {
    if (t.status === "todo") todo++;
    if (t.status === "doing") doing++;
    if (t.status === "done") done++;
  });
  return { total: tasks.length, todo: todo, doing: doing, done: done };
}

// لا نقوم بعرض البيانات تلقائياً عند فتح الصفحة

const http = require('http');

// مصفوفة البيانات (قاعدة بيانات مؤقتة في الذاكرة)
let products = [
  { id: 1, name: "Laptop", price: 1200, category: "Electronics" },
  { id: 2, name: "Wireless Mouse", price: 25, category: "Accessories" },
  { id: 3, name: "Mechanical Keyboard", price: 80, category: "Accessories" },
  { id: 4, name: "Gaming Monitor", price: 300, category: "Electronics" }
];

const server = http.createServer((req, res) => {
  // ترويسة افتراضية لدعم الترميز والتنسيق كـ JSON
  const sendJsonResponse = (statusCode, data) => {
    res.statusCode = statusCode;
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.end(JSON.stringify(data));
  };

  // ==================== [GET Methods (3 مسارات)] ====================

  // 1. المسار الأول (GET): الصفحة الرئيسية
  if (req.url === '/' && req.method === 'GET') {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.end('Welcome to the Products API Home Page');
  } 

  // 2. المسار الثاني (GET): جلب كل المنتجات
  else if (req.url === '/api/products' && req.method === 'GET') {
    sendJsonResponse(200, products);
  }

  // 3. المسار الثالث (GET): جلب التصنيفات فقط
  else if (req.url === '/api/categories' && req.method === 'GET') {
    const categories = [...new Set(products.map(p => p.category))];
    sendJsonResponse(200, { categories });
  }

  // ==================== [POST Method (مسار واحد)] ====================

  // 4. مسار استلام وحفظ منتج جديد (POST)
  else if (req.url === '/api/products' && req.method === 'POST') {
    let body = '';

    // تجميع أجزاء البيانات المرسلة (Chunks)
    req.on('data', chunk => {
      body += chunk.toString();
    });

    // عند اكتمال استلام البيانات
    req.on('end', () => {
      try {
        const newProductData = JSON.parse(body);

        // إنشاء كائن المنتج وتوليد ID تلقائي
        const newProduct = {
          id: products.length > 0 ? products[products.length - 1].id + 1 : 1,
          name: newProductData.name,
          price: Number(newProductData.price),
          category: newProductData.category
        };

        // تخزين البيانات في المصفوفة
        products.push(newProduct);

        // الرد بنجاح العملية مع إرجاع المنتج المضاف
        sendJsonResponse(201, {
          message: "تم استلام البيانات وتخزينها بنجاح",
          data: newProduct
        });
      } catch (error) {
        sendJsonResponse(400, {
          message: "بيانات غير صالحة، يرجى إرسال JSON سليم"
        });
      }
    });
  }

  // ==================== [404 Not Found] ====================
  else {
    sendJsonResponse(404, { message: "Page not found" });
  }
});

const port = 5000;
server.listen(port, () => {
  console.log(`API Server running at http://localhost:${port}/`);
});

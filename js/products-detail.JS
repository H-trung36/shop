// Lấy ID sản phẩm từ URL (ví dụ: product.html?id=HD800)
const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get('id');

// Tải dữ liệu từ products-data.json
fetch('Data/products-data.json')
  .then(response => response.json())
  .then(products => {
    const product = products.find(p => p.id === productId);
    if (product) {
      // Hiển thị thông tin sản phẩm
      document.getElementById('product-name').textContent = product.name;
      document.getElementById('product-brand').textContent = product.brand;
      document.getElementById('product-price').textContent = product.price;
      document.getElementById('product-warranty').textContent = product.warranty;
      document.getElementById('main-image').src = product.mainImage;

      // Hiển thị danh sách hình ảnh nhỏ
      const thumbnailList = document.getElementById('thumbnail-list');
      product.images.forEach(image => {
        const img = document.createElement('img');
        img.src = image;
        img.alt = product.name;
        img.addEventListener('click', () => {
          document.getElementById('main-image').src = image;
        });
        thumbnailList.appendChild(img);
      });

      // Hiển thị mô tả sản phẩm
      const descriptionList = document.getElementById('product-description');
      product.description.forEach(desc => {
        const li = document.createElement('li');
        li.textContent = desc;
        descriptionList.appendChild(li);
      });
    } else {
      document.querySelector('.product-details').innerHTML = '<p>Sản phẩm không tồn tại.</p>';
    }
  })
  .catch(error => {
    console.error('Lỗi khi tải dữ liệu sản phẩm:', error);
  });
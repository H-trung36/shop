document.addEventListener('DOMContentLoaded', function() {
    fetch('../data/product-data.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(productsData => {
            loadProductDetails(productsData);
        })
        .catch(error => {
            console.error('Error loading product data:', error);
            document.getElementById('product-detail-container').innerHTML = 
                `<div class="alert alert-danger">Lỗi tải dữ liệu sản phẩm: ${error.message}. Vui lòng kiểm tra file product-data.json hoặc đường dẫn.</div>`;
        });
});

// Function to get URL parameters
function getURLParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

// Function to load product details
function loadProductDetails(productsData) {
    const productId = getURLParameter('id');
    const category = getURLParameter('category');
    
    if (!productId) {
        document.getElementById('product-detail-container').innerHTML = '<div class="alert alert-danger">Product not found</div>';
        return;
    }
    
    // Find the product with the matching id
    let product = null;
    
    // Look through all categories if category not specified
    if (category && productsData[category]) {
        const categoryProducts = productsData[category] || [];
        product = categoryProducts.find(p => p.id === productId);
    } else {
        // Search in all categories
        for (const cat in productsData) {
            const foundProduct = productsData[cat].find(p => p.id === productId);
            if (foundProduct) {
                product = foundProduct;
                break;
            }
        }
    }
    
    if (product) {
        renderProductDetails(product);
        renderRelatedProducts(product, category || getProductCategory(product, productsData));
    } else {
        document.getElementById('product-detail-container').innerHTML = '<div class="alert alert-danger">Product not found</div>';
    }
}

// Find which category a product belongs to
function getProductCategory(product, productsData) {
    for (const category in productsData) {
        if (productsData[category].some(p => p.id === product.id)) {
            return category;
        }
    }
    return null;
}

// Render product details on the page
function renderProductDetails(product) {    
    document.title = `${product.name} | Music Lover`;
    
    // Set main product image
    const mainImg = document.getElementById('main-product-img');
    if (product.images && product.images.length > 0) {
        mainImg.src = product.images[0];
    } else if (product.image) {
        mainImg.src = product.image;
    } else {
        mainImg.src = './img/placeholder.jpg';
    }
    mainImg.alt = product.name;
    
    // Set product details
    document.getElementById('product-name').textContent = product.name;
    document.getElementById('product-brand').textContent = product.brand;
    document.getElementById('product-price').textContent = formatPrice(product.price) + 'đ';
    
    // Set warranty if available
    if (product.warranty) {
        document.getElementById('warranty-period').textContent = `Bảo hành ${product.warranty}`;
    }
    
    // Render thumbnails if multiple images exist
    const thumbnailsContainer = document.getElementById('product-thumbnails');
    thumbnailsContainer.innerHTML = '';
    
    if (product.images && product.images.length > 0) {
        product.images.forEach(img => {
            const thumbnail = document.createElement('div');
            thumbnail.className = 'thumbnail-item mx-2';
            thumbnail.innerHTML = `<img src="${img}" alt="${product.name}" class="img-fluid" onclick="updateMainImage('${img}')">`;
            thumbnailsContainer.appendChild(thumbnail);
        });
    } else if (product.image) {
        const thumbnail = document.createElement('div');
        thumbnail.className = 'thumbnail-item mx-2';
        thumbnail.innerHTML = `<img src="${product.image}" alt="${product.name}" class="img-fluid">`;
        thumbnailsContainer.appendChild(thumbnail);
    }
    
    // Render specifications
    const specsList = document.getElementById('product-specs');
    specsList.innerHTML = '';
    
    if (product.specifications && product.specifications.length > 0) {
        product.specifications.forEach(spec => {
            const li = document.createElement('li');
            li.textContent = spec;
            specsList.appendChild(li);
        });
    } else {
        // Fallback for your current data structure
        if (product.type) specsList.innerHTML += `<li>Loại: ${product.type}</li>`;
        if (product.driver) specsList.innerHTML += `<li>Driver: ${product.driver}</li>`;
        if (product.impedance) specsList.innerHTML += `<li>Trở kháng: ${product.impedance}</li>`;
        if (product.sensitivity) specsList.innerHTML += `<li>Độ nhạy: ${product.sensitivity}</li>`;
        if (product.frequencyResponse) specsList.innerHTML += `<li>Tần số đáp ứng: ${product.frequencyResponse}</li>`;
        if (product.weight) specsList.innerHTML += `<li>Trọng lượng: ${product.weight}</li>`;
        if (product.origin) specsList.innerHTML += `<li>Sản xuất tại: ${product.origin}</li>`;
    }
    
    // Render description
    if (product.description) {
        document.getElementById('product-description').innerHTML = product.description;
    } else {
        document.getElementById('product-description').innerHTML = `<p>Đang cập nhật mô tả cho ${product.name}...</p>`;
    }
}

// Render related products
function renderRelatedProducts(currentProduct, category, productsData) {
    const relatedContainer = document.getElementById('related-products');
    relatedContainer.innerHTML = '';
    
    if (!category || !productsData[category]) return;
    
    // Get up to 4 related products from the same category
    const related = productsData[category]
        .filter(p => p.id !== currentProduct.id)
        .slice(0, 4);
    
    related.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'col-md-3 col-6 mb-4';
        
        const productImage = product.images && product.images.length > 0 
            ? product.images[0] 
            : (product.image || './img/placeholder.jpg');
        
        productCard.innerHTML = `
            <div class="product-card">
                <div class="product-image">
                    <img src="${productImage}" alt="${product.name}" class="img-fluid">
                    <div class="product-overlay">
                        <a href="product-detail.html?id=${product.id}&category=${category}" class="view-btn">
                            <i class="fa-solid fa-eye"></i>
                        </a>
                    </div>
                </div>
                <div class="product-info">
                    <h5 class="product-title">${product.name}</h5>
                    <p class="product-price">${formatPrice(product.price)}đ</p>
                </div>
            </div>
        `;
        relatedContainer.appendChild(productCard);
    });
}

// Update main image when clicking on thumbnails
function updateMainImage(imageSrc) {
    document.getElementById('main-product-img').src = imageSrc;
}

// Format price with commas
function formatPrice(price) {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}
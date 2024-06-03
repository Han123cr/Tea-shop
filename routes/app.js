const hot = document.querySelector('#hot');
const all = document.querySelector('#all');
const detail = document.querySelector('#detail');
const categories = document.querySelector('#DMSP');
// const allproducts = document.querySelector('#all_products');

const urlParams = new URLSearchParams(window.location.search);
const searchInput = document.querySelector('#search');
const allproducts = document.querySelector('#all_products');

function loadProducts(url){
    fetch(url)
    .then(response => response.json())
    .then(data => {
        console.log(data);
        allproducts.innerHTML = '';
        const productsArray = data.products || data.searchProduct || (Array.isArray(data) ? data : []);
        productsArray.forEach(product => {
            allproducts.innerHTML += 
            `
            <div class="col-xl-3 col-md-4 col-6 wow fadeInLeft">
                <div class="box hot">
                    <div class="img-tea hot">
                        <a href="chitietsanpham.html?id=${product.id}">
                            <img class="itemproduct" src="/public/images/${product.img[0]}" alt="" type="">
                        </a>
                        <div class="cart-hv">
                            <h5>
                                <a href="#">Thêm vào giỏ hàng</a>
                            </h5>
                        </div>
                        <div class="content hot">
                            <h3>
                                <a href="#">
                                    ${product.name}
                                </a>
                            </h3>
                        </div>
                        <div class="price">
                            <span>Giá:</span>
                            ${product.price}
                        </div>
                    </div>
                </div>
            </div>
            `
        });
    })
    .catch(err => console.log(err));
}

//Tìm kiếm sản phẩm khi người dùng ấn Enter
let urlProducts = `http://localhost:3000/api/products`;

searchInput.addEventListener('keyup', function(event) {
    if(event.key === 'Enter'){
        const searchItem = searchInput.value.trim();
        if(searchItem !== ''){
            const urlProducts = `http://localhost:3000/api/products/search/${searchItem}`;
            loadProducts(urlProducts);
        }
    }
});

if(urlParams.has('categoryId')){
    catalogid = urlParams.get('categoryId');
    urlProducts += `/categoryId/${catalogid}`
} 

loadProducts(urlProducts);
// const urlParams = new URLSearchParams(window.location.search);
// let urlProducts = `http://localhost:3000/api/products`;
// const allproducts = document.querySelector('#all_products');
// let catalogid = '';
// if(urlParams.has('categoryId')){
//     catalogid = urlParams.get('categoryId');
//     urlProducts += `/categoryId/${catalogid}`
// }else if(urlParams.has('search')){
//     cate
// }

// fetch(urlProducts)
// .then(response => response.json())
// .then(data => {
//     console.log(data);
//     const productsArray = data.products || data;
//     productsArray.forEach(product => {
//         allproducts.innerHTML += 
//         `
//             <div class="col-xl-3 col-md-4 col-6 wow fadeInLeft">
//                 <div class="box hot">
//                     <div class="img-tea hot">
//                         <a href="chitietsanpham.html?id=${product.id}">
//                             <img class="itemproduct" src="/public/images/${product.img[0]}" alt="" type="">
//                         </a>
//                         <div class="cart-hv">
//                             <h5>
//                                 <a href="#">Thêm vào giỏ hàng</a>
//                             </h5>
//                         </div>
//                         <div class="content hot">
//                             <h3>
//                                 <a href="#">
//                                     ${product.name}
//                                 </a>
//                             </h3>
//                         </div>
//                         <div class="price">
//                             <span>Giá:</span>
//                             ${product.price}
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         `
//     });
// })
// .catch(err => console.log(err));
// //-----------------------Load sản phẩm theo danh mục----------------------//
// const urlParams = new URLSearchParams(window.location.search);
// const categoryId = urlParams.get('categoryId');
// const url = `http://localhost:3000/api/products/categoryId/${categoryId}`;
// fetch(url)
// .then(response => response.json())
// .then(data => {
//     console.log(data);
//     data.forEach(product => {
//         allproducts.innerHTML += 
//         `
//             <div class="col-xl-3 col-md-4 col-6 wow fadeInLeft">
//                 <div class="box hot">
//                     <div class="img-tea hot">
//                         <a href="chitietsanpham.html?id=${product.id}">
//                             <img class="itemproduct" src="/public/images/${product.img[0]}" alt="" type="">
//                         </a>
//                         <div class="cart-hv">
//                             <h5>
//                                 <a href="#">Thêm vào giỏ hàng</a>
//                             </h5>
//                         </div>
//                         <div class="content hot">
//                             <h3>
//                                 <a href="#">
//                                     ${product.name}
//                                 </a>
//                             </h3>
//                         </div>
//                         <div class="price">
//                             <span>Giá:</span>
//                             ${product.price}
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         `
//     });
// })
// .catch(err => console.log(err));

//-----------------------Load sản phẩm ra trang chủ----------------------//
fetch('http://localhost:3000/api/products/hot', {
    headers: {
        'Authorization': 'Bearer '+localStorage.getItem('token')
    }
})
.then(response => response.json())
.then(data => {
    console.log(data);
    data.hotproducts.forEach(product => {
        hot.innerHTML += 
        `
            <div class="col-xl-3 col-md-4 col-6 wow fadeInLeft">
                <div class="box hot">
                    <div class="img-tea hot">
                        <a href="chitietsanpham.html?id=${product.id}">
                            <img class="itemproduct" src="/public/images/${product.img[0]}" alt="" type="">
                        </a>
                        <div class="cart-hv">
                            <h5>
                                <a href="#">Thêm vào giỏ hàng</a>
                            </h5>
                        </div>
                        <div class="content hot">
                            <h3>
                                <a href="#">
                                    ${product.name}
                                </a>
                            </h3>
                        </div>
                        <div class="price">
                            <span>Giá:</span>
                            ${product.price}
                        </div>
                    </div>
                </div>
            </div>
        `
    });
})
.catch(err => console.log(err));


//-----------------------Load sản phẩm mới ra trang chủ----------------------//
fetch('http://localhost:3000/api/products/new')
.then(response => response.json())
.then(data => {
    console.log(data);
    data.newproducts.forEach(product => {
        all.innerHTML += 
        `
            <div class="col-xl-3 col-md-4 col-6 wow fadeInLeft">
                <div class="box hot">
                    <div class="img-tea hot">
                        <a href="#">
                            <img class="itemproduct" src="/public/images/${product.img[0]}" alt="" type="">
                        </a>
                        <div class="cart-hv">
                            <h5>
                                <a href="#">Thêm vào giỏ hàng</a>
                            </h5>
                        </div>
                        <div class="content hot">
                            <h3>
                                <a href="#">
                                    ${product.name}
                                </a>
                            </h3>
                        </div>
                        <div class="price">
                            <span>Giá:</span>
                            ${product.price}
                        </div>
                    </div>
                </div>
            </div>
        `
    });
})
.catch(err => console.log(err));

//-----------------------Load chi tiết sản phẩm----------------------//
const id = window.location.href.split('id=')[1];
fetch(`http://localhost:3000/api/products/${id}`)
.then(response => response.json())
.then(data => {
    console.log(data);
    detail.innerHTML += `
            <div class="row">
            <div class="col-lg-6 col-md-6">
                <div class="product__details__pic">
                    <div class="product__details__pic__item">
                        <img class="product__details__pic__item--large"
                            src="/public/images/${data.img[0]}" alt="">
                    </div>
                    <div class="product__details__pic__slider owl-carousel">
                        <!-- <img data-imgbigurl="img/product/details/product-details-2.jpg"
                            src="/public/images/6.jpg" alt="">
                        <img data-imgbigurl="img/product/details/product-details-3.jpg"
                            src="/public/images/6 - ctsp.jpg" alt="">
                        <img data-imgbigurl="img/product/details/product-details-5.jpg"
                            src="/public/images/6 - ctsp.jpg" alt="">
                        <img data-imgbigurl="img/product/details/product-details-4.jpg"
                            src="/public/images/6 - ctsp.jpg" alt=""> -->
                    </div>
                </div>
            </div>
            <div class="col-lg-6 col-md-6">
                <div class="product__details__text">
                    <h3 class="title">${data.name}</h3>
                    <div class="product__details__rating">
                        <i class="fa fa-star"></i>
                        <i class="fa fa-star"></i>
                        <i class="fa fa-star"></i>
                        <i class="fa fa-star"></i>
                        <i class="fa fa-star-half-o"></i>
                        <span>(18 đánh giá)</span>
                    </div>
                    <div class="product__details__price">${data.price}</div>
                    <p class="mota">${data.description}</p>
                    <div class="product__details__quantity">
                        <div class="quantity">
                            <div class="pro-qty">
                                <span class="dec qtybtn">-</span>
                                <input type="text" value="1">
                                <span class="inc qtybtn">+</span>
                            </div>
                        </div>
                    </div>
                    <a href="#" class="primary-btn">THÊM VÀO GIỎ HÀNG</a>
                    <ul>
                        <li><b>Trạng Thái</b> <span>Còn Hàng</span></li>
                        <li><b>Vận Chuyển</b> <span>Vận chuyển trong ngày</span></li>
                        <li><b>Xuất xứ</b> <span>Việt Nam</span></li>
                        <li><b>Chia sẻ</b>
                            <div class="share">
                                <a href="#"><i class="fa fa-facebook"></i></a>
                                <a href="#"><i class="fa fa-twitter"></i></a>
                                <a href="#"><i class="fa fa-instagram"></i></a>
                                <a href="#"><i class="fa fa-pinterest"></i></a>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
            <!-- <div class="col-lg-12">
                <div class="product__details__tab">
                    <ul class="nav nav-tabs" role="tablist">
                        <li class="nav-item">
                            <a class="nav-link active" data-toggle="tab" href="#tabs-1" role="tab"
                                aria-selected="true">Description</a>
                        </li>
                    </ul>
                    <div class="tab-content">
                        <div class="tab-pane active" id="tabs-1" role="tabpanel">
                            <div class="product__details__tab__desc">
                                <h6>Products Infomation</h6>
                                <p></p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div> -->
        </div>
    `;
})
.catch(err => console.log(err));

//Load sản phẩm bên trang sanpham.html


//-----------------------Load danh mục ra trang chủ----------------------//
fetch('http://localhost:3000/api/categories')
.then(response => response.json())
.then(data => {
    console.log(data);
    data.forEach(category => {
        const link = `sanpham.html?categoryId=${category.id}`
        categories.innerHTML += 
        `
        <li><a href="${link}">${category.title}</a></li>
        `
    });
})
.catch(err => console.log(err));


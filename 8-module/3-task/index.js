export default class Cart {
  cartItems = []; // [product: {...}, count: N]

  constructor(cartIcon) {
    this.cartIcon = cartIcon;
  }

  addProduct(product) {
    // ваш код
    if (product !== undefined && product !== null) {
      console.log("arg is not null or empty!");

      function createNewObj(product, cartItems){
        let obj = {};
        obj.product = product;
        obj.count = 1;
        // this.onProductUpdate(obj);
        // this.onProductUpdate(cartItem);
        return(cartItems.push(obj));
      }

      if(this.cartItems.length === 0){
        createNewObj(product, this.cartItems);
      } else {
        this.cartItems.forEach(obj =>  cheekEqualityObjs(obj, product, this.cartItems));

        let arrObj = this.cartItems.map(obj => obj.product);
        let res = arrObj.every(obj => JSON.stringify(obj) !== JSON.stringify(product));
        if(res){createNewObj(product, this.cartItems)}

        function cheekEqualityObjs(obj, product, cartItems){
          if(JSON.stringify(obj.product) === JSON.stringify(product)){
            obj.count += 1;
            // this.onProductUpdate(obj);
            //  this.onProductUpdate(cartItem);
          }
        }
      }
    } else {
      console.log("No argument passed");
    }
console.log(this.cartItems);
  }

  updateProductCount(productId, amount) {
    // ваш код
    let objId = this.cartItems.find(obj => obj.product.id === productId);
    if (amount === 1) {
      objId.count += 1;
    } else {
      objId.count -= 1;
    }
    if(objId.count === 0){
      this.cartItems = this.cartItems.filter(obj => obj.count !== 0);
    }
    // this.onProductUpdate(objId);
    //  this.onProductUpdate(cartItem);
  }

  isEmpty() {
    // ваш код
    return this.cartItems.length === 0;
  }

  getTotalCount() {
    // ваш код
    let totalCount = 0;
    this.cartItems.forEach(obj => (totalCount += obj.count));
    return totalCount;
  }

  getTotalPrice() {
    // ваш код
    let totalPrice = 0;
    this.cartItems.forEach(obj => (totalPrice += (obj.count * obj.product.price)));
    return totalPrice;
  }

  onProductUpdate(cartItem) {
    // реализуем в следующей задаче

    this.cartIcon.update(this);
  }
}


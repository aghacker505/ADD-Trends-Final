import React, { useContext, createContext, useState, useEffect } from "react";

const ShopContext = createContext();

export const StateContext = ({ children }) => {
  // Fetching Products Data
  // Fetch products using GET request
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [activeCat, setActiveCat] = useState("");
  const [qty, setQty] = useState(1);
  const [showCart, setShowCart] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [totalQuantities, setTotalQuantities] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    fetchProducts();
  }, []);
  const fetchProducts = async () => {
    const data = await fetch("http://127.0.0.1:8000/products/");
    // const data = await fetch("https://dummyjson.com/products/");
    // const data = await fetch("https://dummyjson.com/products?limit=30&skip=30");
    const product = await data.json();
    console.log(data.status);
    console.log(product); // Array of products
    setProducts(product);
    setFiltered(product);
  };

  // Parallax Effect
  const parallaxHandler = (e) => {
    // console.log(e.target);
    const imageEl = document.querySelectorAll(".parallax-img");
    imageEl.forEach((img) => {
      const speed = img.getAttribute("data-speed");
      const x = (window.innerWidth - e.pageX * speed) / 100;
      const y = (window.innerHeight - e.pageY * speed) / 100;

      if (img.className.includes("image-1")) {
        img.style.scale = "0.3";
      }

      img.style.translate = `${x}px ${y}px`;
    });
  };

  // Filter.js
  // Filter the orignal products
  useEffect(() => {
    if (activeCat === "") {
      setFiltered(products);
      return;
    }
    const filtered = products.filter((item) => {
      // console.log(item.category);
      return item.category === activeCat;
    });
    setFiltered(filtered);
  }, [activeCat]);

  // FormatNumbers
  const formattedNumber = (price) => {
    const formatter = Intl.NumberFormat("en", {
      notation: "compact",
    });
    return formatter.format(price);
  };

  // Calculate Price
  // const calculatePrice = (discountprice, discount) => {
  //   let remPercentage = 100 - discount;
  //   let n = Number.parseInt((discountprice / remPercentage) * 100 * 80);
  //   return formattedNumber(n);
  // };
  const calculatePrice = (orignalPrice, discount) => {
    let n = (orignalPrice / 100) * discount;
    return Number.parseInt(n);
  };

  // Quantity functions
  // Increase product qty
  const increaseQty = () => {
    setQty((prevQty) => prevQty + 1);
  };
  // Decrease product qty
  const decreaseQty = () => {
    setQty((prevQty) => {
      return prevQty - 1 < 1 ? 1 : prevQty - 1;
    });
  };

  // Cart functions
  // Add product to cart
  const onAdd = (product, quantity) => {
    //Increase total price
    setTotalPrice((prevTotal) => prevTotal + product.price * quantity);
    // Increase totalQuantities
    setTotalQuantities((prevTotal) => prevTotal + quantity);
    // Check if the product is already is in the cart
    const exist = cartItems.find((item) => item.slug === product.slug);
    if (exist) {
      setCartItems(
        cartItems.map((item) =>
          item.slug === product.slug
            ? { ...exist, quantity: exist.quantity + quantity }
            : item
        )
      );
    } else {
      setCartItems([...cartItems, { ...product, quantity: quantity }]);
    }
  };

  // Remove items
  const onRemove = (product) => {
    //Devrease total price
    setTotalPrice((prevTotal) => prevTotal - product.price);
    // Decreses totalQuantities
    setTotalQuantities((prevTotal) => prevTotal - 1);
    // Check if the product is already is in the cart
    const exist = cartItems.find((item) => item.slug === product.slug);
    if (exist.quantity == 1) {
      setCartItems(cartItems.filter((item) => item.slug !== product.slug));
    } else {
      setCartItems(
        cartItems.map((item) =>
          item.slug === product.slug
            ? { ...exist, quantity: exist.quantity - 1 }
            : item
        )
      );
    }
  };

  return (
    <ShopContext.Provider
      value={{
        products,
        filtered,
        setFiltered,
        activeCat,
        setActiveCat,
        parallaxHandler,
        formattedNumber,
        calculatePrice,
        qty,
        increaseQty,
        decreaseQty,
        cartItems,
        setCartItems,
        showCart,
        setShowCart,
        onAdd,
        onRemove,
        totalQuantities,
        setTotalQuantities,
        totalPrice,
        setTotalPrice,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export const useStateContext = () => useContext(ShopContext);

import { useParams } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import { fetchProductById } from "../../services/api";
import { CartContext } from "../../context/CartContext";

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  // const product = products.find((p) => p.id === parseInt(id));

  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    fetchProductById(id).then(setProduct);
  }, [id]);

  if (!product) return <h2>Sản phẩm không tồn tại</h2>;

  return (
    <div className="container">
      <h2>{product.title}</h2>
      <img src={product.thumbnail} alt={product.title} style={{ width: "300px", borderRadius: "10px" }} />
      <p>Giá: {product.variants?.[0]?.prices?.[0]?.amount?.toLocaleString()} đ</p>
      <button className="btn" onClick={() => addToCart(product)}>Thêm vào giỏ</button>
    </div>
  );
}
import { useState, useEffect } from "react";
import { fetchProducts } from "../services/api"; 
import ProductCard from "../components/ProductCard";

export default function Products() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchProducts().then(setProducts);
  }, []);

  // Lọc sản phẩm theo category và tìm kiếm
  const filteredProducts = products.filter(p => {
    return (category === "All" || p.category === category) &&
           p.name.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div className="container">
      <h2>Tất cả sản phẩm</h2>

      {/* Bộ lọc */}
      <div style={{ marginBottom: "20px", display: "flex", gap: "10px", alignItems: "center" }}>
        <input 
          type="text" 
          placeholder="Tìm kiếm sản phẩm..." 
          value={search} 
          onChange={(e) => setSearch(e.target.value)}
          style={{ padding: "8px", flex: 1 }}
        />
        <select value={category} onChange={(e) => setCategory(e.target.value)} style={{ padding: "8px" }}>
          <option value="All">Tất cả</option>
          <option value="Thiết kế">Thiết kế</option>
          <option value="Văn phòng">Văn phòng</option>
          <option value="Lập trình">Lập trình</option>
        </select>
      </div>

      {/* Hiển thị sản phẩm */}
      <div className="grid">
        {filteredProducts.length > 0 ? 
          filteredProducts.map(p => <ProductCard key={p.id} product={p} />) :
          <p>Không tìm thấy sản phẩm</p>
        }
      </div>
    </div>
  );
}
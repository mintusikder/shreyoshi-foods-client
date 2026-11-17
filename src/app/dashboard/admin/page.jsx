import ProductManagement from "@/components/products/ProductManagement";


export const metadata = {
  title: "Product Management | Shreyoshi Foods",
};

export default function AdminProductsPage() {
  return (
    <div className="min-h-screen bg-[#F7F6E9] p-3 sm:p-5 lg:p-6">
      <ProductManagement />
    </div>
  );
}

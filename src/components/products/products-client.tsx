"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PlusIcon, SearchIcon } from "@/components/icons";
import { deleteProduct } from "@/actions/products";
import { motion, AnimatePresence } from "framer-motion";

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: string | number;
  stock: number;
  unit: string | null;
  isActive: boolean;
  createdAt: Date;
}

interface ProductsClientProps {
  initialProducts: Product[];
}

export function ProductsClient({ initialProducts }: ProductsClientProps) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState(initialProducts);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`"${name}" mahsulotini o'chirmoqchimisiz?`)) return;
    setDeletingId(id);
    try {
      await deleteProduct(id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
      router.refresh();
    } catch (e) {
      alert("O'chirishda xatolik yuz berdi");
    } finally {
      setDeletingId(null);
    }
  };

  const stockColor = (stock: number) => {
    if (stock === 0) return "text-red-500";
    if (stock <= 5) return "text-yellow-500";
    return "text-green-500";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Mahsulotlar</h1>
          <p className="text-muted-foreground mt-1">
            Jami {products.length} ta mahsulot
          </p>
        </div>
        <Link href="/dashboard/products/new">
          <Button className="gap-2">
            <PlusIcon className="w-4 h-4" />
            Yangi mahsulot
          </Button>
        </Link>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Mahsulot qidirish..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Products Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          <p className="text-lg">Mahsulotlar topilmadi</p>
          <Link href="/dashboard/products/new">
            <Button variant="outline" className="mt-4 gap-2">
              <PlusIcon className="w-4 h-4" />
              Birinchi mahsulotni qo'shing
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          <AnimatePresence>
            {filtered.map((product) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base font-semibold line-clamp-1">
                      {product.name}
                    </CardTitle>
                    {product.description && (
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {product.description}
                      </p>
                    )}
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-primary">
                        {Number(product.price).toLocaleString()} so'm
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">Ombor:</span>
                      <span className={`font-semibold ${stockColor(product.stock)}`}>
                        {product.stock} {product.unit || "dona"}
                      </span>
                    </div>
                    <div className="flex gap-2 pt-1">
                      <Link
                        href={`/dashboard/products/${product.id}/edit`}
                        className="flex-1"
                      >
                        <Button variant="outline" size="sm" className="w-full">
                          Tahrirlash
                        </Button>
                      </Link>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-destructive hover:bg-destructive/10"
                        disabled={deletingId === product.id}
                        onClick={() => handleDelete(product.id, product.name)}
                      >
                        {deletingId === product.id ? "..." : "O'chirish"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

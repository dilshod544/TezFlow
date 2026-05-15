"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { createProduct } from "@/actions/products";

export function NewProductPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    stock: "0",
    unit: "dona",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.price) {
      setError("Nomi va narxi majburiy");
      return;
    }

    setIsLoading(true);
    try {
      await createProduct({
        name: form.name,
        description: form.description || undefined,
        price: parseFloat(form.price),
        stock: parseInt(form.stock) || 0,
        unit: form.unit || undefined,
      });
      router.push("/dashboard/products");
    } catch (err) {
      setError("Xatolik yuz berdi. Qaytadan urinib ko'ring.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Yangi mahsulot</h1>
        <p className="text-muted-foreground mt-1">Mahsulot katalogiga yangi tovar qo'shing</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Mahsulot ma'lumotlari</CardTitle>
          <CardDescription>Barcha zaruriy maydonlarni to'ldiring</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md text-sm text-destructive">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="name">Mahsulot nomi *</Label>
              <Input
                id="name"
                name="name"
                placeholder="Masalan: iPhone 15 Pro"
                value={form.name}
                onChange={handleChange}
                disabled={isLoading}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Tavsif</Label>
              <Input
                id="description"
                name="description"
                placeholder="Qisqacha tavsif (ixtiyoriy)"
                value={form.description}
                onChange={handleChange}
                disabled={isLoading}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Narxi (so'm) *</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  min="0"
                  step="100"
                  placeholder="0"
                  value={form.price}
                  onChange={handleChange}
                  disabled={isLoading}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="stock">Boshlang'ich miqdor</Label>
                <Input
                  id="stock"
                  name="stock"
                  type="number"
                  min="0"
                  placeholder="0"
                  value={form.stock}
                  onChange={handleChange}
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="unit">O'lchov birligi</Label>
              <Input
                id="unit"
                name="unit"
                placeholder="dona, kg, litr..."
                value={form.unit}
                onChange={handleChange}
                disabled={isLoading}
              />
            </div>

            <div className="flex gap-3 pt-2">
              <Button type="submit" disabled={isLoading} className="flex-1">
                {isLoading ? "Saqlanmoqda..." : "Saqlash"}
              </Button>
              <Button type="button" variant="outline" onClick={() => router.back()} disabled={isLoading}>
                Bekor qilish
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

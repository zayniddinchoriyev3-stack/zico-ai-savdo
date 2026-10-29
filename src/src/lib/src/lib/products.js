
import { supabase } from "./supabase.js";

export async function getProducts() {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

export async function addProduct(product) {
  const { data, error } = await supabase
    .from("products")
    .insert([
      {
        name: product.name,
        description: product.description || "",
        price: Number(product.price) || 0,
        stock: Number(product.stock) || 0
      }
    ])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteProduct(id) {
  const { error } = await supabase
    .from("products")
    .delete()
    .eq("id", id);

  if (error) throw error;
}

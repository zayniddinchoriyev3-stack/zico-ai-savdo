
import { supabase } from "./supabase.js";

export async function getProducts() {
  const { data: { user }, error: userError } =
    await supabase.auth.getUser();

  if (userError) throw userError;
  if (!user) throw new Error("Avval tizimga kiring.");

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function addProduct(product) {
  const { data: { user }, error: userError } =
    await supabase.auth.getUser();

  if (userError) throw userError;
  if (!user) throw new Error("Avval tizimga kiring.");

  const { data, error } = await supabase
    .from("products")
    .insert({
      user_id: user.id,
      name: product.name,
      description: product.description || "",
      price: Number(product.price) || 0,
      stock: Number(product.stock) || 0
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteProduct(id) {
  const { data: { user }, error: userError } =
    await supabase.auth.getUser();

  if (userError) throw userError;
  if (!user) throw new Error("Avval tizimga kiring.");

  const { error } = await supabase
    .from("products")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) throw error;
}

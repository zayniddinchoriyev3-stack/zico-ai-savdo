import { supabase } from "./supabase.js";

export async function getProducts() {
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
  if (!user) throw new Error("Avval hisobga kiring");

  const { data, error } = await supabase
    .from("products")
    .insert({ ...product, user_id: user.id })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function removeProduct(id) {
  const { error } = await supabase
    .from("products")
    .delete()
    .eq("id", id);

  if (error) throw error;
}

export const deleteProduct = removeProduct;

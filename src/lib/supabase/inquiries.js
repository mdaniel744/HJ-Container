import { supabase, STORE_ID } from "./client";

/**
 * Inserts an inquiry. `inquiries` is insert-only — never chain `.select()`
 * after this or it errors even though the row was written.
 *
 * Schema (confirmed by the platform): store_id, product_id (nullable),
 * customer_name, customer_email, customer_phone, message, details (jsonb
 * catch-all for anything without its own column). No `type` column. Don't
 * set `status` — it defaults server-side and is dashboard-managed.
 */
export async function createInquiry({ productId = null, name, email, phone, message, details = {} }) {
  const { error } = await supabase.from("inquiries").insert({
    store_id: STORE_ID,
    product_id: productId,
    customer_name: name,
    customer_email: email,
    customer_phone: phone,
    message,
    details,
  });
  if (error) throw error;
}

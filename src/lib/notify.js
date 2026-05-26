import { supabase } from "./supabase";

export async function notify(userId, title, message = "") {
  if (!userId) return;
  try {
    await supabase.from("notifications").insert({ user_id: userId, title, message });
  } catch (_) {}
}

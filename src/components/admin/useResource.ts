import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

/** CRUD helpers for a salon table, with cache invalidation + toasts. */
export function useResource(table: string, queryKey: string) {
  const queryClient = useQueryClient();
  const db = supabase as any;
  const refresh = () => queryClient.invalidateQueries({ queryKey: [queryKey] });

  return {
    async save(values: Record<string, unknown>, id?: string) {
      const { error } = id
        ? await db.from(table).update(values).eq("id", id)
        : await db.from(table).insert(values);
      if (error) {
        toast.error(error.message);
        return false;
      }
      toast.success("Saved");
      await refresh();
      return true;
    },
    async remove(id: string) {
      const { error } = await db.from(table).delete().eq("id", id);
      if (error) {
        toast.error(error.message);
        return false;
      }
      toast.success("Deleted");
      await refresh();
      return true;
    },
    async patch(id: string, values: Record<string, unknown>) {
      const { error } = await db.from(table).update(values).eq("id", id);
      if (error) {
        toast.error(error.message);
        return false;
      }
      await refresh();
      return true;
    },
  };
}

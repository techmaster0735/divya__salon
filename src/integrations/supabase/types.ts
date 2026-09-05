export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.15";
  };
  public: {
    Tables: {
      academy_media: {
        Row: {
          created_at: string;
          description: string | null;
          file_path: string;
          id: string;
          is_active: boolean;
          kind: string;
          sort_order: number;
          thumbnail_path: string | null;
          title: string;
        };
        Insert: {
          created_at?: string;
          description?: string | null;
          file_path: string;
          id?: string;
          is_active?: boolean;
          kind?: string;
          sort_order?: number;
          thumbnail_path?: string | null;
          title: string;
        };
        Update: {
          created_at?: string;
          description?: string | null;
          file_path?: string;
          id?: string;
          is_active?: boolean;
          kind?: string;
          sort_order?: number;
          thumbnail_path?: string | null;
          title?: string;
        };
        Relationships: [];
      };
      announcements: {
        Row: {
          body: string | null;
          created_at: string;
          id: string;
          is_active: boolean;
          title: string;
        };
        Insert: {
          body?: string | null;
          created_at?: string;
          id?: string;
          is_active?: boolean;
          title: string;
        };
        Update: {
          body?: string | null;
          created_at?: string;
          id?: string;
          is_active?: boolean;
          title?: string;
        };
        Relationships: [];
      };
      gallery_items: {
        Row: {
          category: string;
          created_at: string;
          description: string | null;
          gender: string;
          id: string;
          image_path: string;
          is_active: boolean;
          sort_order: number;
          title: string;
        };
        Insert: {
          category?: string;
          created_at?: string;
          description?: string | null;
          gender?: string;
          id?: string;
          image_path: string;
          is_active?: boolean;
          sort_order?: number;
          title: string;
        };
        Update: {
          category?: string;
          created_at?: string;
          description?: string | null;
          gender?: string;
          id?: string;
          image_path?: string;
          is_active?: boolean;
          sort_order?: number;
          title?: string;
        };
        Relationships: [];
      };
      menu_items: {
        Row: {
          body: string | null;
          created_at: string;
          description: string | null;
          file_path: string | null;
          id: string;
          is_active: boolean;
          kind: string;
          link_url: string | null;
          sort_order: number;
          title: string;
          updated_at: string;
        };
        Insert: {
          body?: string | null;
          created_at?: string;
          description?: string | null;
          file_path?: string | null;
          id?: string;
          is_active?: boolean;
          kind?: string;
          link_url?: string | null;
          sort_order?: number;
          title: string;
          updated_at?: string;
        };
        Update: {
          body?: string | null;
          created_at?: string;
          description?: string | null;
          file_path?: string | null;
          id?: string;
          is_active?: boolean;
          kind?: string;
          link_url?: string | null;
          sort_order?: number;
          title?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      offers: {
        Row: {
          created_at: string;
          description: string | null;
          discount_percent: number | null;
          ends_at: string | null;
          gender: string;
          id: string;
          image_path: string | null;
          is_active: boolean;
          offer_price: number | null;
          price: number | null;
          sort_order: number;
          starts_at: string | null;
          title: string;
        };
        Insert: {
          created_at?: string;
          description?: string | null;
          discount_percent?: number | null;
          ends_at?: string | null;
          gender?: string;
          id?: string;
          image_path?: string | null;
          is_active?: boolean;
          offer_price?: number | null;
          price?: number | null;
          sort_order?: number;
          starts_at?: string | null;
          title: string;
        };
        Update: {
          created_at?: string;
          description?: string | null;
          discount_percent?: number | null;
          ends_at?: string | null;
          gender?: string;
          id?: string;
          image_path?: string | null;
          is_active?: boolean;
          offer_price?: number | null;
          price?: number | null;
          sort_order?: number;
          starts_at?: string | null;
          title?: string;
        };
        Relationships: [];
      };
      services: {
        Row: {
          badge: string | null;
          category: string;
          created_at: string;
          description: string | null;
          duration_minutes: number;
          gender: string;
          id: string;
          image_path: string | null;
          is_active: boolean;
          is_package: boolean;
          name: string;
          offer_price: number | null;
          price: number;
          sort_order: number;
        };
        Insert: {
          badge?: string | null;
          category?: string;
          created_at?: string;
          description?: string | null;
          duration_minutes?: number;
          gender?: string;
          id?: string;
          image_path?: string | null;
          is_active?: boolean;
          is_package?: boolean;
          name: string;
          offer_price?: number | null;
          price?: number;
          sort_order?: number;
        };
        Update: {
          badge?: string | null;
          category?: string;
          created_at?: string;
          description?: string | null;
          duration_minutes?: number;
          gender?: string;
          id?: string;
          image_path?: string | null;
          is_active?: boolean;
          is_package?: boolean;
          name?: string;
          offer_price?: number | null;
          price?: number;
          sort_order?: number;
        };
        Relationships: [];
      };
      site_settings: {
        Row: {
          about: string | null;
          about_image_1_path: string | null;
          about_image_2_path: string | null;
          about_subtitle: string | null;
          about_title: string | null;
          address: string | null;
          email: string | null;
          facebook_url: string | null;
          hero_image_path: string | null;
          hero_subtitle: string | null;
          hero_title: string;
          id: boolean;
          instagram_url: string | null;
          logo_path: string | null;
          maps_embed_url: string | null;
          men_image_path: string | null;
          opening_hours: string | null;
          phone: string | null;
          salon_name: string;
          tagline: string;
          updated_at: string;
          whatsapp: string | null;
          women_image_path: string | null;
        };
        Insert: {
          about?: string | null;
          about_image_1_path?: string | null;
          about_image_2_path?: string | null;
          about_subtitle?: string | null;
          about_title?: string | null;
          address?: string | null;
          email?: string | null;
          facebook_url?: string | null;
          hero_image_path?: string | null;
          hero_subtitle?: string | null;
          hero_title?: string;
          id?: boolean;
          instagram_url?: string | null;
          logo_path?: string | null;
          maps_embed_url?: string | null;
          men_image_path?: string | null;
          opening_hours?: string | null;
          phone?: string | null;
          salon_name?: string;
          tagline?: string;
          updated_at?: string;
          whatsapp?: string | null;
          women_image_path?: string | null;
        };
        Update: {
          about?: string | null;
          about_image_1_path?: string | null;
          about_image_2_path?: string | null;
          about_subtitle?: string | null;
          about_title?: string | null;
          address?: string | null;
          email?: string | null;
          facebook_url?: string | null;
          hero_image_path?: string | null;
          hero_subtitle?: string | null;
          hero_title?: string;
          id?: boolean;
          instagram_url?: string | null;
          logo_path?: string | null;
          maps_embed_url?: string | null;
          men_image_path?: string | null;
          opening_hours?: string | null;
          phone?: string | null;
          salon_name?: string;
          tagline?: string;
          updated_at?: string;
          whatsapp?: string | null;
          women_image_path?: string | null;
        };
        Relationships: [];
      };
      user_roles: {
        Row: {
          created_at: string;
          id: string;
          role: Database["public"]["Enums"]["app_role"];
          user_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          role: Database["public"]["Enums"]["app_role"];
          user_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          role?: Database["public"]["Enums"]["app_role"];
          user_id?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"];
          _user_id: string;
        };
        Returns: boolean;
      };
    };
    Enums: {
      app_role: "admin";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] & DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    keyof DefaultSchema["Enums"] | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    keyof DefaultSchema["CompositeTypes"] | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin"],
    },
  },
} as const;

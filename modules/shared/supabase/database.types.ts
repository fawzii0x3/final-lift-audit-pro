export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4";
  };
  public: {
    Tables: {
      attachments: {
        Row: {
          check_item_id: string | null;
          context: string;
          created_at: string;
          equipment_id: string | null;
          hoist_id: string | null;
          id: string;
          inspection_id: string;
          org_id: string;
          storage_path: string;
          trolley_id: string | null;
          uploaded_by: string;
        };
        Insert: {
          check_item_id?: string | null;
          context: string;
          created_at?: string;
          equipment_id?: string | null;
          hoist_id?: string | null;
          id?: string;
          inspection_id: string;
          org_id: string;
          storage_path: string;
          trolley_id?: string | null;
          uploaded_by: string;
        };
        Update: {
          check_item_id?: string | null;
          context?: string;
          created_at?: string;
          equipment_id?: string | null;
          hoist_id?: string | null;
          id?: string;
          inspection_id?: string;
          org_id?: string;
          storage_path?: string;
          trolley_id?: string | null;
          uploaded_by?: string;
        };
        Relationships: [
          {
            foreignKeyName: "attachments_check_item_id_fkey";
            columns: ["check_item_id"];
            isOneToOne: false;
            referencedRelation: "inspection_check_items";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "attachments_equipment_id_fkey";
            columns: ["equipment_id"];
            isOneToOne: false;
            referencedRelation: "inspection_equipment";
            referencedColumns: ["inspection_id"];
          },
          {
            foreignKeyName: "attachments_hoist_id_fkey";
            columns: ["hoist_id"];
            isOneToOne: false;
            referencedRelation: "inspection_hoists";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "attachments_inspection_id_fkey";
            columns: ["inspection_id"];
            isOneToOne: false;
            referencedRelation: "inspections";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "attachments_org_id_fkey";
            columns: ["org_id"];
            isOneToOne: false;
            referencedRelation: "orgs";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "attachments_trolley_id_fkey";
            columns: ["trolley_id"];
            isOneToOne: false;
            referencedRelation: "inspection_trolleys";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "attachments_uploaded_by_fkey";
            columns: ["uploaded_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      clients: {
        Row: {
          address: string | null;
          created_at: string;
          email: string | null;
          id: string;
          name: string;
          org_id: string;
          phone_number: string | null;
        };
        Insert: {
          address?: string | null;
          created_at?: string;
          email?: string | null;
          id?: string;
          name: string;
          org_id: string;
          phone_number?: string | null;
        };
        Update: {
          address?: string | null;
          created_at?: string;
          email?: string | null;
          id?: string;
          name?: string;
          org_id?: string;
          phone_number?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "clients_org_id_fkey";
            columns: ["org_id"];
            isOneToOne: false;
            referencedRelation: "orgs";
            referencedColumns: ["id"];
          },
        ];
      };
      inspection_check_items: {
        Row: {
          comment: string | null;
          component: string;
          component_id: string | null;
          component_name: string | null;
          component_position: number | null;
          component_type: string | null;
          id: string;
          inspection_id: string;
          is_valid: boolean | null;
          item_key: string;
          problem_type: string | null;
          status: string;
          validation_comment: string | null;
          validation_image_path: string | null;
        };
        Insert: {
          comment?: string | null;
          component: string;
          component_id?: string | null;
          component_name?: string | null;
          component_position?: number | null;
          component_type?: string | null;
          id?: string;
          inspection_id: string;
          is_valid?: boolean | null;
          item_key: string;
          problem_type?: string | null;
          status: string;
          validation_comment?: string | null;
          validation_image_path?: string | null;
        };
        Update: {
          comment?: string | null;
          component?: string;
          component_id?: string | null;
          component_name?: string | null;
          component_position?: number | null;
          component_type?: string | null;
          id?: string;
          inspection_id?: string;
          is_valid?: boolean | null;
          item_key?: string;
          problem_type?: string | null;
          status?: string;
          validation_comment?: string | null;
          validation_image_path?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "inspection_check_items_inspection_id_fkey";
            columns: ["inspection_id"];
            isOneToOne: false;
            referencedRelation: "inspections";
            referencedColumns: ["id"];
          },
        ];
      };
      inspection_equipment: {
        Row: {
          capacity: string | null;
          control_voltage: string | null;
          equipment_number: string | null;
          equipment_type: string;
          height_ft: number | null;
          inspection_id: string;
          location_label: string | null;
          manufacturer: string | null;
          model: string | null;
          ordered_by: string | null;
          power_voltage: string | null;
          serial: string | null;
        };
        Insert: {
          capacity?: string | null;
          control_voltage?: string | null;
          equipment_number?: string | null;
          equipment_type: string;
          height_ft?: number | null;
          inspection_id: string;
          location_label?: string | null;
          manufacturer?: string | null;
          model?: string | null;
          ordered_by?: string | null;
          power_voltage?: string | null;
          serial?: string | null;
        };
        Update: {
          capacity?: string | null;
          control_voltage?: string | null;
          equipment_number?: string | null;
          equipment_type?: string;
          height_ft?: number | null;
          inspection_id?: string;
          location_label?: string | null;
          manufacturer?: string | null;
          model?: string | null;
          ordered_by?: string | null;
          power_voltage?: string | null;
          serial?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "inspection_equipment_inspection_id_fkey";
            columns: ["inspection_id"];
            isOneToOne: true;
            referencedRelation: "inspections";
            referencedColumns: ["id"];
          },
        ];
      };
      inspection_hoists: {
        Row: {
          capacity: string | null;
          hoist_type: string | null;
          id: string;
          inspection_id: string;
          manufacturer: string | null;
          model: string | null;
          position: number;
          serial: string | null;
        };
        Insert: {
          capacity?: string | null;
          hoist_type?: string | null;
          id?: string;
          inspection_id: string;
          manufacturer?: string | null;
          model?: string | null;
          position: number;
          serial?: string | null;
        };
        Update: {
          capacity?: string | null;
          hoist_type?: string | null;
          id?: string;
          inspection_id?: string;
          manufacturer?: string | null;
          model?: string | null;
          position?: number;
          serial?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "inspection_hoists_inspection_id_fkey";
            columns: ["inspection_id"];
            isOneToOne: false;
            referencedRelation: "inspections";
            referencedColumns: ["id"];
          },
        ];
      };
      inspection_trolleys: {
        Row: {
          id: string;
          inspection_id: string;
          manufacturer: string | null;
          model: string | null;
          position: number;
          serial: string | null;
          trolley_type: string | null;
        };
        Insert: {
          id?: string;
          inspection_id: string;
          manufacturer?: string | null;
          model?: string | null;
          position: number;
          serial?: string | null;
          trolley_type?: string | null;
        };
        Update: {
          id?: string;
          inspection_id?: string;
          manufacturer?: string | null;
          model?: string | null;
          position?: number;
          serial?: string | null;
          trolley_type?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "inspection_trolleys_inspection_id_fkey";
            columns: ["inspection_id"];
            isOneToOne: false;
            referencedRelation: "inspections";
            referencedColumns: ["id"];
          },
        ];
      };
      inspections: {
        Row: {
          client_id: string;
          created_by: string;
          id: string;
          org_id: string;
          scheduled_date: string;
          status: string;
          technician_id: string | null;
          updated_at: string;
        };
        Insert: {
          client_id: string;
          created_by: string;
          id?: string;
          org_id: string;
          scheduled_date: string;
          status?: string;
          technician_id?: string | null;
          updated_at?: string;
        };
        Update: {
          client_id?: string;
          created_by?: string;
          id?: string;
          org_id?: string;
          scheduled_date?: string;
          status?: string;
          technician_id?: string | null;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "inspections_client_id_fkey";
            columns: ["client_id"];
            isOneToOne: false;
            referencedRelation: "clients";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "inspections_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "inspections_org_id_fkey";
            columns: ["org_id"];
            isOneToOne: false;
            referencedRelation: "orgs";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "inspections_technician_id_fkey";
            columns: ["technician_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      orgs: {
        Row: {
          created_at: string;
          id: string;
          logo_path: string | null;
          name: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          logo_path?: string | null;
          name: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          logo_path?: string | null;
          name?: string;
        };
        Relationships: [];
      };
      profiles: {
        Row: {
          created_at: string;
          display_name: string;
          email: string;
          id: string;
          org_id: string;
          role: string;
        };
        Insert: {
          created_at?: string;
          display_name: string;
          email: string;
          id: string;
          org_id: string;
          role: string;
        };
        Update: {
          created_at?: string;
          display_name?: string;
          email?: string;
          id?: string;
          org_id?: string;
          role?: string;
        };
        Relationships: [
          {
            foreignKeyName: "profiles_org_id_fkey";
            columns: ["org_id"];
            isOneToOne: false;
            referencedRelation: "orgs";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      get_attachment_component_info: {
        Args: { attachment_id: string };
        Returns: {
          component_id: string;
          component_name: string;
          component_type: string;
          position: number;
        }[];
      };
      get_user_org_id: {
        Args: Record<PropertyKey, never>;
        Returns: string;
      };
      get_user_role: {
        Args: Record<PropertyKey, never>;
        Returns: string;
      };
      is_org_admin: {
        Args: Record<PropertyKey, never>;
        Returns: boolean;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<
  keyof Database,
  "public"
>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {},
  },
} as const;

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      admin_users: {
        Row: {
          created_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          user_id?: string
        }
        Relationships: []
      }
      clients: {
        Row: {
          billing_address: Json
          business_name: string
          created_at: string
          created_by: string
          email: string
          id: string
          name: string
          notes: string | null
          phone: string | null
          stripe_customer_id: string | null
          stripe_sync_error: string | null
          stripe_sync_status: string
          updated_at: string
        }
        Insert: {
          billing_address?: Json
          business_name: string
          created_at?: string
          created_by: string
          email: string
          id?: string
          name: string
          notes?: string | null
          phone?: string | null
          stripe_customer_id?: string | null
          stripe_sync_error?: string | null
          stripe_sync_status?: string
          updated_at?: string
        }
        Update: {
          billing_address?: Json
          business_name?: string
          created_at?: string
          created_by?: string
          email?: string
          id?: string
          name?: string
          notes?: string | null
          phone?: string | null
          stripe_customer_id?: string | null
          stripe_sync_error?: string | null
          stripe_sync_status?: string
          updated_at?: string
        }
        Relationships: []
      }
      contracts: {
        Row: {
          client_id: string
          completed_at: string | null
          created_at: string
          created_by: string
          documenso_envelope_id: string | null
          error_message: string | null
          failed_at: string | null
          id: string
          invoice_id: string | null
          scope_summary: string | null
          sent_at: string | null
          service_start_date: string | null
          signer_email: string
          signer_name: string
          signing_url: string | null
          status: string
          template_envelope_id: string | null
          updated_at: string
        }
        Insert: {
          client_id: string
          completed_at?: string | null
          created_at?: string
          created_by: string
          documenso_envelope_id?: string | null
          error_message?: string | null
          failed_at?: string | null
          id?: string
          invoice_id?: string | null
          scope_summary?: string | null
          sent_at?: string | null
          service_start_date?: string | null
          signer_email: string
          signer_name: string
          signing_url?: string | null
          status?: string
          template_envelope_id?: string | null
          updated_at?: string
        }
        Update: {
          client_id?: string
          completed_at?: string | null
          created_at?: string
          created_by?: string
          documenso_envelope_id?: string | null
          error_message?: string | null
          failed_at?: string | null
          id?: string
          invoice_id?: string | null
          scope_summary?: string | null
          sent_at?: string | null
          service_start_date?: string | null
          signer_email?: string
          signer_name?: string
          signing_url?: string | null
          status?: string
          template_envelope_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "contracts_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contracts_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
        ]
      }
      invoices: {
        Row: {
          amount_due: number | null
          amount_paid: number | null
          client_id: string
          created_at: string
          created_by: string
          currency: string | null
          due_at: string | null
          error_message: string | null
          failed_at: string | null
          hosted_invoice_url: string | null
          id: string
          idempotency_key: string | null
          invoice_pdf_url: string | null
          line_items: Json
          paid_at: string | null
          sent_at: string | null
          status: string
          stripe_invoice_id: string | null
          updated_at: string
        }
        Insert: {
          amount_due?: number | null
          amount_paid?: number | null
          client_id: string
          created_at?: string
          created_by: string
          currency?: string | null
          due_at?: string | null
          error_message?: string | null
          failed_at?: string | null
          hosted_invoice_url?: string | null
          id?: string
          idempotency_key?: string | null
          invoice_pdf_url?: string | null
          line_items?: Json
          paid_at?: string | null
          sent_at?: string | null
          status?: string
          stripe_invoice_id?: string | null
          updated_at?: string
        }
        Update: {
          amount_due?: number | null
          amount_paid?: number | null
          client_id?: string
          created_at?: string
          created_by?: string
          currency?: string | null
          due_at?: string | null
          error_message?: string | null
          failed_at?: string | null
          hosted_invoice_url?: string | null
          id?: string
          idempotency_key?: string | null
          invoice_pdf_url?: string | null
          line_items?: Json
          paid_at?: string | null
          sent_at?: string | null
          status?: string
          stripe_invoice_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "invoices_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      provider_events: {
        Row: {
          event_type: string
          external_event_id: string
          id: string
          payload: Json
          processed_at: string | null
          processing_error: string | null
          processing_status: string
          provider: string
          received_at: string
          resource_id: string | null
        }
        Insert: {
          event_type: string
          external_event_id: string
          id?: string
          payload: Json
          processed_at?: string | null
          processing_error?: string | null
          processing_status?: string
          provider: string
          received_at?: string
          resource_id?: string | null
        }
        Update: {
          event_type?: string
          external_event_id?: string
          id?: string
          payload?: Json
          processed_at?: string | null
          processing_error?: string | null
          processing_status?: string
          provider?: string
          received_at?: string
          resource_id?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const

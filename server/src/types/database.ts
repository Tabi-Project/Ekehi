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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      content_reviews: {
        Row: {
          content_id: string
          content_type: Database["public"]["Enums"]["content_type_enum"]
          created_at: string
          decision: string
          feedback: string | null
          id: string
          reviewer_id: string
        }
        Insert: {
          content_id: string
          content_type: Database["public"]["Enums"]["content_type_enum"]
          created_at?: string
          decision: string
          feedback?: string | null
          id?: string
          reviewer_id: string
        }
        Update: {
          content_id?: string
          content_type?: Database["public"]["Enums"]["content_type_enum"]
          created_at?: string
          decision?: string
          feedback?: string | null
          id?: string
          reviewer_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "content_reviews_reviewer_id_fkey"
            columns: ["reviewer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      credit_products: {
        Row: {
          amount_max: number | null
          amount_min: number | null
          apply_url: string | null
          approval_status:
            | Database["public"]["Enums"]["enum_credit_products_approval_status"]
            | null
          collateral_details: string | null
          collateral_required: boolean | null
          country: string | null
          created_at: string
          currency: string | null
          eligibility_criteria: string | null
          how_to_apply: string | null
          id: string
          institution_name: string | null
          institution_type: Database["public"]["Enums"]["institution_type_enum"]
          interest_rate_range: string | null
          is_women_only: boolean | null
          product_name: string
          reference_code: string | null
          repayment_terms: string | null
          sectors: string[]
          stages: string[] | null
          status: Database["public"]["Enums"]["listing_status_enum"]
          updated_at: string
        }
        Insert: {
          amount_max?: number | null
          amount_min?: number | null
          apply_url?: string | null
          approval_status?:
            | Database["public"]["Enums"]["enum_credit_products_approval_status"]
            | null
          collateral_details?: string | null
          collateral_required?: boolean | null
          country?: string | null
          created_at: string
          currency?: string | null
          eligibility_criteria?: string | null
          how_to_apply?: string | null
          id: string
          institution_name?: string | null
          institution_type: Database["public"]["Enums"]["institution_type_enum"]
          interest_rate_range?: string | null
          is_women_only?: boolean | null
          product_name: string
          reference_code?: string | null
          repayment_terms?: string | null
          sectors?: string[]
          stages?: string[] | null
          status: Database["public"]["Enums"]["listing_status_enum"]
          updated_at: string
        }
        Update: {
          amount_max?: number | null
          amount_min?: number | null
          apply_url?: string | null
          approval_status?:
            | Database["public"]["Enums"]["enum_credit_products_approval_status"]
            | null
          collateral_details?: string | null
          collateral_required?: boolean | null
          country?: string | null
          created_at?: string
          currency?: string | null
          eligibility_criteria?: string | null
          how_to_apply?: string | null
          id?: string
          institution_name?: string | null
          institution_type?: Database["public"]["Enums"]["institution_type_enum"]
          interest_rate_range?: string | null
          is_women_only?: boolean | null
          product_name?: string
          reference_code?: string | null
          repayment_terms?: string | null
          sectors?: string[]
          stages?: string[] | null
          status?: Database["public"]["Enums"]["listing_status_enum"]
          updated_at?: string
        }
        Relationships: []
      }
      credit_products_test: {
        Row: {
          amount_max: number | null
          amount_min: number | null
          apply_url: string | null
          collateral_details: string | null
          collateral_required: string | null
          country: string | null
          credit_id: string
          currency: string | null
          eligibility_criteria: string | null
          how_to_apply: string | null
          institution_name: string | null
          institution_type: string | null
          interest_rate_range: string | null
          is_women_only: boolean | null
          product_name: string | null
          repayment_terms: string | null
          sector: string | null
          stage_eligibility: string | null
          status: string | null
        }
        Insert: {
          amount_max?: number | null
          amount_min?: number | null
          apply_url?: string | null
          collateral_details?: string | null
          collateral_required?: string | null
          country?: string | null
          credit_id: string
          currency?: string | null
          eligibility_criteria?: string | null
          how_to_apply?: string | null
          institution_name?: string | null
          institution_type?: string | null
          interest_rate_range?: string | null
          is_women_only?: boolean | null
          product_name?: string | null
          repayment_terms?: string | null
          sector?: string | null
          stage_eligibility?: string | null
          status?: string | null
        }
        Update: {
          amount_max?: number | null
          amount_min?: number | null
          apply_url?: string | null
          collateral_details?: string | null
          collateral_required?: string | null
          country?: string | null
          credit_id?: string
          currency?: string | null
          eligibility_criteria?: string | null
          how_to_apply?: string | null
          institution_name?: string | null
          institution_type?: string | null
          interest_rate_range?: string | null
          is_women_only?: boolean | null
          product_name?: string | null
          repayment_terms?: string | null
          sector?: string | null
          stage_eligibility?: string | null
          status?: string | null
        }
        Relationships: []
      }
      funding_opportunities: {
        Row: {
          amount_max: number | null
          amount_min: number | null
          application_deadline: string | null
          apply_url: string | null
          approval_status:
            | Database["public"]["Enums"]["enum_funding_opportunities_approval_status"]
            | null
          contact_email: string | null
          country: string | null
          created_at: string
          currency: string | null
          description: string | null
          eligibility_criteria: string | null
          funder_name: string | null
          id: string
          is_equity_free: boolean | null
          is_women_only: boolean | null
          opportunity_title: string
          opportunity_type: Database["public"]["Enums"]["opportunity_type_enum"]
          reference_code: string | null
          sectors: string[]
          stages: string[] | null
          status: Database["public"]["Enums"]["listing_status_enum"]
          submitted_by: string | null
          updated_at: string
        }
        Insert: {
          amount_max?: number | null
          amount_min?: number | null
          application_deadline?: string | null
          apply_url?: string | null
          approval_status?:
            | Database["public"]["Enums"]["enum_funding_opportunities_approval_status"]
            | null
          contact_email?: string | null
          country?: string | null
          created_at?: string
          currency?: string | null
          description?: string | null
          eligibility_criteria?: string | null
          funder_name?: string | null
          id?: string
          is_equity_free?: boolean | null
          is_women_only?: boolean | null
          opportunity_title: string
          opportunity_type: Database["public"]["Enums"]["opportunity_type_enum"]
          reference_code?: string | null
          sectors?: string[]
          stages?: string[] | null
          status?: Database["public"]["Enums"]["listing_status_enum"]
          submitted_by?: string | null
          updated_at?: string
        }
        Update: {
          amount_max?: number | null
          amount_min?: number | null
          application_deadline?: string | null
          apply_url?: string | null
          approval_status?:
            | Database["public"]["Enums"]["enum_funding_opportunities_approval_status"]
            | null
          contact_email?: string | null
          country?: string | null
          created_at?: string
          currency?: string | null
          description?: string | null
          eligibility_criteria?: string | null
          funder_name?: string | null
          id?: string
          is_equity_free?: boolean | null
          is_women_only?: boolean | null
          opportunity_title?: string
          opportunity_type?: Database["public"]["Enums"]["opportunity_type_enum"]
          reference_code?: string | null
          sectors?: string[]
          stages?: string[] | null
          status?: Database["public"]["Enums"]["listing_status_enum"]
          submitted_by?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "funding_opportunities_submitted_by_fkey"
            columns: ["submitted_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      funding_opportunities_test: {
        Row: {
          amount_max: number | null
          amount_min: number | null
          application_deadline: string | null
          apply_url: string | null
          contact_email: string | null
          country: string | null
          currency: string | null
          description: string | null
          eligibility_criteria: string | null
          funder_name: string | null
          is_equity_free: boolean | null
          is_women_only: boolean | null
          opp_id: string
          opportunity_title: string | null
          opportunity_type: string | null
          sector: string | null
          stage_eligibility: string | null
          status: string | null
        }
        Insert: {
          amount_max?: number | null
          amount_min?: number | null
          application_deadline?: string | null
          apply_url?: string | null
          contact_email?: string | null
          country?: string | null
          currency?: string | null
          description?: string | null
          eligibility_criteria?: string | null
          funder_name?: string | null
          is_equity_free?: boolean | null
          is_women_only?: boolean | null
          opp_id: string
          opportunity_title?: string | null
          opportunity_type?: string | null
          sector?: string | null
          stage_eligibility?: string | null
          status?: string | null
        }
        Update: {
          amount_max?: number | null
          amount_min?: number | null
          application_deadline?: string | null
          apply_url?: string | null
          contact_email?: string | null
          country?: string | null
          currency?: string | null
          description?: string | null
          eligibility_criteria?: string | null
          funder_name?: string | null
          is_equity_free?: boolean | null
          is_women_only?: boolean | null
          opp_id?: string
          opportunity_title?: string | null
          opportunity_type?: string | null
          sector?: string | null
          stage_eligibility?: string | null
          status?: string | null
        }
        Relationships: []
      }
      guides: {
        Row: {
          approval_status: string
          category: string | null
          content: string | null
          created_at: string
          id: string
          slug: string
          submitted_by: string | null
          summary: string | null
          title: string
          updated_at: string
        }
        Insert: {
          approval_status?: string
          category?: string | null
          content?: string | null
          created_at?: string
          id?: string
          slug: string
          submitted_by?: string | null
          summary?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          approval_status?: string
          category?: string | null
          content?: string | null
          created_at?: string
          id?: string
          slug?: string
          submitted_by?: string | null
          summary?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "guides_submitted_by_fkey"
            columns: ["submitted_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          first_name: string
          id: string
          last_name: string
          profile_image_path: string | null
          role: Database["public"]["Enums"]["enum_profiles_role"] | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          first_name: string
          id: string
          last_name: string
          profile_image_path?: string | null
          role?: Database["public"]["Enums"]["enum_profiles_role"] | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          first_name?: string
          id?: string
          last_name?: string
          profile_image_path?: string | null
          role?: Database["public"]["Enums"]["enum_profiles_role"] | null
          updated_at?: string
        }
        Relationships: []
      }
      saved_opportunities: {
        Row: {
          created_at: string
          id: string
          opportunity_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          opportunity_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          opportunity_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "saved_opportunities_opportunity_id_fkey"
            columns: ["opportunity_id"]
            isOneToOne: false
            referencedRelation: "funding_opportunities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "saved_opportunities_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      sectors: {
        Row: {
          display_name: string
          slug: string
        }
        Insert: {
          display_name: string
          slug: string
        }
        Update: {
          display_name?: string
          slug?: string
        }
        Relationships: []
      }
      stages: {
        Row: {
          display_name: string
          slug: string
        }
        Insert: {
          display_name: string
          slug: string
        }
        Update: {
          display_name?: string
          slug?: string
        }
        Relationships: []
      }
      templates: {
        Row: {
          approval_status: string
          category: string | null
          content: string | null
          created_at: string
          description: string | null
          file_url: string | null
          id: string
          submitted_by: string | null
          title: string
          updated_at: string
        }
        Insert: {
          approval_status?: string
          category?: string | null
          content?: string | null
          created_at?: string
          description?: string | null
          file_url?: string | null
          id?: string
          submitted_by?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          approval_status?: string
          category?: string | null
          content?: string | null
          created_at?: string
          description?: string | null
          file_url?: string | null
          id?: string
          submitted_by?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "templates_submitted_by_fkey"
            columns: ["submitted_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      training_programmes: {
        Row: {
          application_deadline: string | null
          apply_url: string | null
          approval_status:
            | Database["public"]["Enums"]["enum_training_programmes_approval_status"]
            | null
          certification: string | null
          cost: string | null
          cost_type: Database["public"]["Enums"]["cost_type_enum"]
          created_at: string
          currency: string | null
          description: string | null
          duration_range: Database["public"]["Enums"]["duration_range_enum"]
          format: Database["public"]["Enums"]["training_format_enum"]
          id: string
          is_featured: boolean | null
          location: string | null
          location_scope: Database["public"]["Enums"]["location_scope_enum"]
          programme_name: string
          programme_type: Database["public"]["Enums"]["programme_type_enum"]
          provider: string | null
          reference_code: string | null
          submitted_by: string | null
          topics_covered: string | null
          updated_at: string
        }
        Insert: {
          application_deadline?: string | null
          apply_url?: string | null
          approval_status?:
            | Database["public"]["Enums"]["enum_training_programmes_approval_status"]
            | null
          certification?: string | null
          cost?: string | null
          cost_type: Database["public"]["Enums"]["cost_type_enum"]
          created_at: string
          currency?: string | null
          description?: string | null
          duration_range: Database["public"]["Enums"]["duration_range_enum"]
          format: Database["public"]["Enums"]["training_format_enum"]
          id: string
          is_featured?: boolean | null
          location?: string | null
          location_scope: Database["public"]["Enums"]["location_scope_enum"]
          programme_name: string
          programme_type: Database["public"]["Enums"]["programme_type_enum"]
          provider?: string | null
          reference_code?: string | null
          submitted_by?: string | null
          topics_covered?: string | null
          updated_at: string
        }
        Update: {
          application_deadline?: string | null
          apply_url?: string | null
          approval_status?:
            | Database["public"]["Enums"]["enum_training_programmes_approval_status"]
            | null
          certification?: string | null
          cost?: string | null
          cost_type?: Database["public"]["Enums"]["cost_type_enum"]
          created_at?: string
          currency?: string | null
          description?: string | null
          duration_range?: Database["public"]["Enums"]["duration_range_enum"]
          format?: Database["public"]["Enums"]["training_format_enum"]
          id?: string
          is_featured?: boolean | null
          location?: string | null
          location_scope?: Database["public"]["Enums"]["location_scope_enum"]
          programme_name?: string
          programme_type?: Database["public"]["Enums"]["programme_type_enum"]
          provider?: string | null
          reference_code?: string | null
          submitted_by?: string | null
          topics_covered?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "training_programmes_submitted_by_fkey"
            columns: ["submitted_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      training_programmes_test: {
        Row: {
          application_deadline: string | null
          apply_url: string | null
          certification: string | null
          cost: string | null
          currency: string | null
          description: string | null
          duration: string | null
          format: string | null
          is_featured: boolean | null
          is_free: boolean | null
          location: string | null
          programme_name: string | null
          provider: string | null
          sector: string | null
          stage_eligibility: string | null
          status: string | null
          topics_covered: string | null
          training_id: string
        }
        Insert: {
          application_deadline?: string | null
          apply_url?: string | null
          certification?: string | null
          cost?: string | null
          currency?: string | null
          description?: string | null
          duration?: string | null
          format?: string | null
          is_featured?: boolean | null
          is_free?: boolean | null
          location?: string | null
          programme_name?: string | null
          provider?: string | null
          sector?: string | null
          stage_eligibility?: string | null
          status?: string | null
          topics_covered?: string | null
          training_id: string
        }
        Update: {
          application_deadline?: string | null
          apply_url?: string | null
          certification?: string | null
          cost?: string | null
          currency?: string | null
          description?: string | null
          duration?: string | null
          format?: string | null
          is_featured?: boolean | null
          is_free?: boolean | null
          location?: string | null
          programme_name?: string | null
          provider?: string | null
          sector?: string | null
          stage_eligibility?: string | null
          status?: string | null
          topics_covered?: string | null
          training_id?: string
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
      content_type_enum:
        | "funding_opportunity"
        | "training_programme"
        | "guide"
        | "template"
      cost_type_enum: "free" | "paid" | "sponsored"
      duration_range_enum:
        | "lt_1_week"
        | "1_4_weeks"
        | "1_3_months"
        | "3_plus_months"
        | "self_paced"
      enum_credit_products_approval_status: "approved" | "pending" | "rejected"
      enum_funding_opportunities_approval_status:
        | "approved"
        | "pending"
        | "rejected"
      enum_profiles_role:
        | "user"
        | "super-admin"
        | "data-manager"
        | "content-editor"
      enum_training_programmes_approval_status:
        | "approved"
        | "pending"
        | "rejected"
      institution_type_enum:
        | "commercial_bank"
        | "development_bank"
        | "microfinance_bank"
        | "fintech"
        | "government"
        | "ngo"
      listing_status_enum: "open" | "rolling_applications" | "closed"
      location_scope_enum: "nigeria" | "africa" | "global" | "online"
      opportunity_type_enum:
        | "grant_ngo"
        | "accelerator"
        | "loan"
        | "microfinance"
        | "vc"
        | "prize_money"
        | "angel_investment"
        | "grant_government"
      programme_type_enum:
        | "accelerator"
        | "bootcamp"
        | "workshop"
        | "online_course"
        | "mentorship_programme"
      training_format_enum: "online" | "in_person" | "hybrid"
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
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
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      content_type_enum: [
        "funding_opportunity",
        "training_programme",
        "guide",
        "template",
      ],
      cost_type_enum: ["free", "paid", "sponsored"],
      duration_range_enum: [
        "lt_1_week",
        "1_4_weeks",
        "1_3_months",
        "3_plus_months",
        "self_paced",
      ],
      enum_credit_products_approval_status: ["approved", "pending", "rejected"],
      enum_funding_opportunities_approval_status: [
        "approved",
        "pending",
        "rejected",
      ],
      enum_profiles_role: [
        "user",
        "super-admin",
        "data-manager",
        "content-editor",
      ],
      enum_training_programmes_approval_status: [
        "approved",
        "pending",
        "rejected",
      ],
      institution_type_enum: [
        "commercial_bank",
        "development_bank",
        "microfinance_bank",
        "fintech",
        "government",
        "ngo",
      ],
      listing_status_enum: ["open", "rolling_applications", "closed"],
      location_scope_enum: ["nigeria", "africa", "global", "online"],
      opportunity_type_enum: [
        "grant_ngo",
        "accelerator",
        "loan",
        "microfinance",
        "vc",
        "prize_money",
        "angel_investment",
        "grant_government",
      ],
      programme_type_enum: [
        "accelerator",
        "bootcamp",
        "workshop",
        "online_course",
        "mentorship_programme",
      ],
      training_format_enum: ["online", "in_person", "hybrid"],
    },
  },
} as const

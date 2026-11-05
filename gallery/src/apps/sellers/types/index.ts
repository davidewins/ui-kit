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
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  public: {
    Tables: {
      acquisition_sources: {
        Row: {
          captured_at: string
          detail: string | null
          id: string
          source: string
          user_id: string | null
        }
        Insert: {
          captured_at?: string
          detail?: string | null
          id?: string
          source: string
          user_id?: string | null
        }
        Update: {
          captured_at?: string
          detail?: string | null
          id?: string
          source?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "acquisition_sources_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      admin_alerts: {
        Row: {
          alert_type: string
          created_at: string | null
          data: Json | null
          description: string | null
          entity_id: string | null
          entity_type: string | null
          id: string
          resolution_notes: string | null
          resolved_at: string | null
          resolved_by: string | null
          severity: string | null
          status: string | null
          title: string
          updated_at: string
        }
        Insert: {
          alert_type: string
          created_at?: string | null
          data?: Json | null
          description?: string | null
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          resolution_notes?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          severity?: string | null
          status?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          alert_type?: string
          created_at?: string | null
          data?: Json | null
          description?: string | null
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          resolution_notes?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          severity?: string | null
          status?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "admin_alerts_resolved_by_fkey"
            columns: ["resolved_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      admin_audit_log: {
        Row: {
          action: string
          admin_user_id: string | null
          created_at: string | null
          details: Json | null
          id: string
          ip_address: unknown
          request_id: string
          resource_id: string | null
          resource_type: string
          updated_at: string
          user_agent: string | null
        }
        Insert: {
          action: string
          admin_user_id?: string | null
          created_at?: string | null
          details?: Json | null
          id?: string
          ip_address?: unknown
          request_id: string
          resource_id?: string | null
          resource_type: string
          updated_at?: string
          user_agent?: string | null
        }
        Update: {
          action?: string
          admin_user_id?: string | null
          created_at?: string | null
          details?: Json | null
          id?: string
          ip_address?: unknown
          request_id?: string
          resource_id?: string | null
          resource_type?: string
          updated_at?: string
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "admin_audit_log_admin_user_id_fkey"
            columns: ["admin_user_id"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
        ]
      }
      admin_broadcasts: {
        Row: {
          body: string
          created_at: string | null
          data: Json | null
          errors: Json | null
          id: string
          onesignal_responses: Json | null
          segment: string
          sent_by: string | null
          target_app: string
          title: string
          updated_at: string
        }
        Insert: {
          body: string
          created_at?: string | null
          data?: Json | null
          errors?: Json | null
          id?: string
          onesignal_responses?: Json | null
          segment?: string
          sent_by?: string | null
          target_app: string
          title: string
          updated_at?: string
        }
        Update: {
          body?: string
          created_at?: string | null
          data?: Json | null
          errors?: Json | null
          id?: string
          onesignal_responses?: Json | null
          segment?: string
          sent_by?: string | null
          target_app?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      admin_notification_settings: {
        Row: {
          activity_digest_interval_minutes: number
          activity_digest_last_sent_at: string | null
          activity_digest_min_events: number
          app_activity: boolean
          chat_support: boolean
          consumer_signups: boolean
          id: string
          menu_import_jobs: boolean
          new_orders: boolean
          ops_pulse_interval_minutes: number
          ops_pulse_last_run_at: string | null
          payments: boolean
          security_compliance: boolean
          sources: Json
          updated_at: string
          vendor_signups: boolean
        }
        Insert: {
          activity_digest_interval_minutes?: number
          activity_digest_last_sent_at?: string | null
          activity_digest_min_events?: number
          app_activity?: boolean
          chat_support?: boolean
          consumer_signups?: boolean
          id?: string
          menu_import_jobs?: boolean
          new_orders?: boolean
          ops_pulse_interval_minutes?: number
          ops_pulse_last_run_at?: string | null
          payments?: boolean
          security_compliance?: boolean
          sources?: Json
          updated_at?: string
          vendor_signups?: boolean
        }
        Update: {
          activity_digest_interval_minutes?: number
          activity_digest_last_sent_at?: string | null
          activity_digest_min_events?: number
          app_activity?: boolean
          chat_support?: boolean
          consumer_signups?: boolean
          id?: string
          menu_import_jobs?: boolean
          new_orders?: boolean
          ops_pulse_interval_minutes?: number
          ops_pulse_last_run_at?: string | null
          payments?: boolean
          security_compliance?: boolean
          sources?: Json
          updated_at?: string
          vendor_signups?: boolean
        }
        Relationships: []
      }
      admin_users: {
        Row: {
          active: boolean | null
          created_at: string | null
          created_by: string | null
          id: string
          permissions: Json | null
          role: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          active?: boolean | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          permissions?: Json | null
          role?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          active?: boolean | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          permissions?: Json | null
          role?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      allergens: {
        Row: {
          created_at: string
          id: number
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: number
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: number
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      app_open_pings: {
        Row: {
          app: string
          created_at: string
          id: string
          user_id: string | null
        }
        Insert: {
          app: string
          created_at?: string
          id?: string
          user_id?: string | null
        }
        Update: {
          app?: string
          created_at?: string
          id?: string
          user_id?: string | null
        }
        Relationships: []
      }
      app_search_events: {
        Row: {
          created_at: string
          id: string
          query: string
          results_count: number
          tapped_result_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          query: string
          results_count?: number
          tapped_result_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          query?: string
          results_count?: number
          tapped_result_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "app_search_events_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      app_testers: {
        Row: {
          added_at: string
          note: string | null
          user_id: string
        }
        Insert: {
          added_at?: string
          note?: string | null
          user_id: string
        }
        Update: {
          added_at?: string
          note?: string | null
          user_id?: string
        }
        Relationships: []
      }
      blog_posts: {
        Row: {
          author: string | null
          category: string | null
          content: Json
          cover_image_url: string | null
          excerpt: string | null
          feature_tag: string | null
          id: string
          is_published: boolean | null
          meta_description: string | null
          published_at: string | null
          reading_time_mins: number | null
          slug: string
          tags: string[] | null
          title: string
          updated_at: string | null
        }
        Insert: {
          author?: string | null
          category?: string | null
          content: Json
          cover_image_url?: string | null
          excerpt?: string | null
          feature_tag?: string | null
          id?: string
          is_published?: boolean | null
          meta_description?: string | null
          published_at?: string | null
          reading_time_mins?: number | null
          slug: string
          tags?: string[] | null
          title: string
          updated_at?: string | null
        }
        Update: {
          author?: string | null
          category?: string | null
          content?: Json
          cover_image_url?: string | null
          excerpt?: string | null
          feature_tag?: string | null
          id?: string
          is_published?: boolean | null
          meta_description?: string | null
          published_at?: string | null
          reading_time_mins?: number | null
          slug?: string
          tags?: string[] | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      brands: {
        Row: {
          created_at: string
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      buildings: {
        Row: {
          address: string | null
          banner_path: string | null
          city: string | null
          country: string
          county: string | null
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          is_publicly_listed: boolean
          latitude: number | null
          logo_path: string | null
          longitude: number | null
          name: string
          postcode: string | null
          slug: string | null
          type: string
          updated_at: string
        }
        Insert: {
          address?: string | null
          banner_path?: string | null
          city?: string | null
          country?: string
          county?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          is_publicly_listed?: boolean
          latitude?: number | null
          logo_path?: string | null
          longitude?: number | null
          name: string
          postcode?: string | null
          slug?: string | null
          type?: string
          updated_at?: string
        }
        Update: {
          address?: string | null
          banner_path?: string | null
          city?: string | null
          country?: string
          county?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          is_publicly_listed?: boolean
          latitude?: number | null
          logo_path?: string | null
          longitude?: number | null
          name?: string
          postcode?: string | null
          slug?: string | null
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      bundle_items: {
        Row: {
          bundle_id: string
          created_at: string
          id: string
          product_id: string
          quantity: number | null
          updated_at: string
          variant_id: string | null
        }
        Insert: {
          bundle_id: string
          created_at?: string
          id?: string
          product_id: string
          quantity?: number | null
          updated_at?: string
          variant_id?: string | null
        }
        Update: {
          bundle_id?: string
          created_at?: string
          id?: string
          product_id?: string
          quantity?: number | null
          updated_at?: string
          variant_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bundle_items_bundle_id_fkey"
            columns: ["bundle_id"]
            isOneToOne: false
            referencedRelation: "product_bundles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bundle_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bundle_items_variant_id_fkey"
            columns: ["variant_id"]
            isOneToOne: false
            referencedRelation: "product_variants"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          created_at: string
          description: string | null
          id: string
          img_path: string | null
          name: string
          parent_id: string | null
          sort_order: number | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          img_path?: string | null
          name: string
          parent_id?: string | null
          sort_order?: number | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          img_path?: string | null
          name?: string
          parent_id?: string | null
          sort_order?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "categories_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      category_allergens: {
        Row: {
          allergen_id: number
          category_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          allergen_id: number
          category_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          allergen_id?: number
          category_id?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "category_allergens_allergen_id_fkey"
            columns: ["allergen_id"]
            isOneToOne: false
            referencedRelation: "allergens"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "category_allergens_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      category_attributes: {
        Row: {
          category_id: string | null
          created_at: string
          description: string | null
          id: string
          is_filterable: boolean | null
          name: string
          options: string[] | null
          type: string
          updated_at: string
        }
        Insert: {
          category_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_filterable?: boolean | null
          name: string
          options?: string[] | null
          type: string
          updated_at?: string
        }
        Update: {
          category_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_filterable?: boolean | null
          name?: string
          options?: string[] | null
          type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "category_attributes_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      category_certifications: {
        Row: {
          category_id: string
          certification_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          category_id: string
          certification_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          category_id?: string
          certification_id?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "category_certifications_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "category_certifications_certification_id_fkey"
            columns: ["certification_id"]
            isOneToOne: false
            referencedRelation: "certifications"
            referencedColumns: ["id"]
          },
        ]
      }
      category_ingredients: {
        Row: {
          category_id: string
          created_at: string
          ingredient_id: number
          updated_at: string
        }
        Insert: {
          category_id: string
          created_at?: string
          ingredient_id: number
          updated_at?: string
        }
        Update: {
          category_id?: string
          created_at?: string
          ingredient_id?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "category_ingredients_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "category_ingredients_ingredient_id_fkey"
            columns: ["ingredient_id"]
            isOneToOne: false
            referencedRelation: "ingredients"
            referencedColumns: ["id"]
          },
        ]
      }
      category_tags: {
        Row: {
          category_id: string | null
          created_at: string
          description: string | null
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          category_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          category_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "category_tags_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      certifications: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      commission_rate_daily_stats: {
        Row: {
          commission_rate_id: string | null
          created_at: string | null
          date: string
          error_count: number | null
          id: string
          total_commission_cents: number | null
          total_order_value_cents: number | null
          updated_at: string
          usage_count: number | null
        }
        Insert: {
          commission_rate_id?: string | null
          created_at?: string | null
          date: string
          error_count?: number | null
          id?: string
          total_commission_cents?: number | null
          total_order_value_cents?: number | null
          updated_at?: string
          usage_count?: number | null
        }
        Update: {
          commission_rate_id?: string | null
          created_at?: string | null
          date?: string
          error_count?: number | null
          id?: string
          total_commission_cents?: number | null
          total_order_value_cents?: number | null
          updated_at?: string
          usage_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "commission_rate_daily_stats_commission_rate_id_fkey"
            columns: ["commission_rate_id"]
            isOneToOne: false
            referencedRelation: "commission_rates"
            referencedColumns: ["id"]
          },
        ]
      }
      commission_rate_usage: {
        Row: {
          applied_flat_fee_cents: number | null
          applied_rate_percent: number | null
          commission_amount_cents: number | null
          commission_rate_id: string | null
          created_at: string | null
          id: string
          order_id: string | null
          order_subtotal_cents: number | null
          updated_at: string
          vendor_order_id: string | null
        }
        Insert: {
          applied_flat_fee_cents?: number | null
          applied_rate_percent?: number | null
          commission_amount_cents?: number | null
          commission_rate_id?: string | null
          created_at?: string | null
          id?: string
          order_id?: string | null
          order_subtotal_cents?: number | null
          updated_at?: string
          vendor_order_id?: string | null
        }
        Update: {
          applied_flat_fee_cents?: number | null
          applied_rate_percent?: number | null
          commission_amount_cents?: number | null
          commission_rate_id?: string | null
          created_at?: string | null
          id?: string
          order_id?: string | null
          order_subtotal_cents?: number | null
          updated_at?: string
          vendor_order_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "commission_rate_usage_commission_rate_id_fkey"
            columns: ["commission_rate_id"]
            isOneToOne: false
            referencedRelation: "commission_rates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "commission_rate_usage_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "commission_rate_usage_vendor_order_id_fkey"
            columns: ["vendor_order_id"]
            isOneToOne: false
            referencedRelation: "vendor_orders"
            referencedColumns: ["id"]
          },
        ]
      }
      commission_rates: {
        Row: {
          active: boolean | null
          base_rate: number
          created_at: string | null
          delivery_provider:
            | Database["public"]["Enums"]["delivery_provider"]
            | null
          delivery_type: string | null
          description: string | null
          flat_fee_cents: number | null
          fulfillment_type: string | null
          id: string
          min_order_amount: number | null
          name: string
          payment_methods: string[]
          rate_percent: number
          service_type: string
          updated_at: string | null
        }
        Insert: {
          active?: boolean | null
          base_rate: number
          created_at?: string | null
          delivery_provider?:
            | Database["public"]["Enums"]["delivery_provider"]
            | null
          delivery_type?: string | null
          description?: string | null
          flat_fee_cents?: number | null
          fulfillment_type?: string | null
          id?: string
          min_order_amount?: number | null
          name: string
          payment_methods?: string[]
          rate_percent?: number
          service_type: string
          updated_at?: string | null
        }
        Update: {
          active?: boolean | null
          base_rate?: number
          created_at?: string | null
          delivery_provider?:
            | Database["public"]["Enums"]["delivery_provider"]
            | null
          delivery_type?: string | null
          description?: string | null
          flat_fee_cents?: number | null
          fulfillment_type?: string | null
          id?: string
          min_order_amount?: number | null
          name?: string
          payment_methods?: string[]
          rate_percent?: number
          service_type?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      company_register: {
        Row: {
          address: string | null
          company_name: string
          company_type: string | null
          country_code: string
          id: string
          imported_at: string | null
          inc_date: string | null
          raw: Json | null
          reg_number: string
          status: string | null
        }
        Insert: {
          address?: string | null
          company_name: string
          company_type?: string | null
          country_code: string
          id?: string
          imported_at?: string | null
          inc_date?: string | null
          raw?: Json | null
          reg_number: string
          status?: string | null
        }
        Update: {
          address?: string | null
          company_name?: string
          company_type?: string | null
          country_code?: string
          id?: string
          imported_at?: string | null
          inc_date?: string | null
          raw?: Json | null
          reg_number?: string
          status?: string | null
        }
        Relationships: []
      }
      company_register_syncs: {
        Row: {
          completed_at: string | null
          country_code: string
          error_message: string | null
          id: string
          rows_processed: number | null
          rows_upserted: number | null
          source_url: string | null
          started_at: string
          status: string
        }
        Insert: {
          completed_at?: string | null
          country_code: string
          error_message?: string | null
          id?: string
          rows_processed?: number | null
          rows_upserted?: number | null
          source_url?: string | null
          started_at?: string
          status?: string
        }
        Update: {
          completed_at?: string | null
          country_code?: string
          error_message?: string | null
          id?: string
          rows_processed?: number | null
          rows_upserted?: number | null
          source_url?: string | null
          started_at?: string
          status?: string
        }
        Relationships: []
      }
      compliance_document_categories: {
        Row: {
          created_at: string
          criticality: Database["public"]["Enums"]["compliance_criticality"]
          default_renewal_months: number | null
          description: string
          display_name: string
          guide_md: string | null
          guide_slug: string | null
          icon: string
          jurisdiction: string
          required_when: Json
          scope: Database["public"]["Enums"]["compliance_document_scope"]
          slug: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          criticality: Database["public"]["Enums"]["compliance_criticality"]
          default_renewal_months?: number | null
          description: string
          display_name: string
          guide_md?: string | null
          guide_slug?: string | null
          icon: string
          jurisdiction: string
          required_when?: Json
          scope: Database["public"]["Enums"]["compliance_document_scope"]
          slug: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          criticality?: Database["public"]["Enums"]["compliance_criticality"]
          default_renewal_months?: number | null
          description?: string
          display_name?: string
          guide_md?: string | null
          guide_slug?: string | null
          icon?: string
          jurisdiction?: string
          required_when?: Json
          scope?: Database["public"]["Enums"]["compliance_document_scope"]
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      customer_credit_ledger: {
        Row: {
          amount_cents: number
          campaign_key: string | null
          created_at: string
          funded_by: string
          id: string
          issued_by: string | null
          kind: string
          order_id: string | null
          reason: string | null
          source_id: string | null
          user_id: string
          vendor_id: string | null
        }
        Insert: {
          amount_cents: number
          campaign_key?: string | null
          created_at?: string
          funded_by?: string
          id?: string
          issued_by?: string | null
          kind: string
          order_id?: string | null
          reason?: string | null
          source_id?: string | null
          user_id: string
          vendor_id?: string | null
        }
        Update: {
          amount_cents?: number
          campaign_key?: string | null
          created_at?: string
          funded_by?: string
          id?: string
          issued_by?: string | null
          kind?: string
          order_id?: string | null
          reason?: string | null
          source_id?: string | null
          user_id?: string
          vendor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "customer_credit_ledger_issued_by_fkey"
            columns: ["issued_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customer_credit_ledger_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customer_credit_ledger_source_id_fkey"
            columns: ["source_id"]
            isOneToOne: false
            referencedRelation: "customer_credit_ledger"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customer_credit_ledger_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customer_credit_ledger_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendor_public"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customer_credit_ledger_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      deletion_requests: {
        Row: {
          id: string
          notes: string | null
          processed_at: string | null
          reason: string | null
          requested_at: string
          requester_ip: unknown
          status: string
          user_agent: string | null
          user_id: string
        }
        Insert: {
          id?: string
          notes?: string | null
          processed_at?: string | null
          reason?: string | null
          requested_at?: string
          requester_ip?: unknown
          status?: string
          user_agent?: string | null
          user_id: string
        }
        Update: {
          id?: string
          notes?: string | null
          processed_at?: string | null
          reason?: string | null
          requested_at?: string
          requester_ip?: unknown
          status?: string
          user_agent?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "deletion_requests_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      delivery_assignments: {
        Row: {
          accepted_at: string | null
          assigned_at: string | null
          batch_order_ids: string[] | null
          calculated_pay_cents: number | null
          created_at: string | null
          declined_at: string | null
          delivered_at: string | null
          distance_to_pickup_km: number | null
          eta_to_pickup_seconds: number | null
          expired_at: string | null
          expires_at: string | null
          failed_at: string | null
          id: string
          is_batch: boolean | null
          offer_rank: number | null
          order_id: string
          picked_up_at: string | null
          rider_approaching_dropoff_notified_at: string | null
          rider_approaching_pickup_notified_at: string | null
          rider_id: string
          route_polyline: string | null
          score: number | null
          score_breakdown: Json | null
          status: string
          surge_multiplier: number | null
          surge_reason: string | null
          total_eta_seconds: number | null
          updated_at: string | null
          vehicle_type: string | null
        }
        Insert: {
          accepted_at?: string | null
          assigned_at?: string | null
          batch_order_ids?: string[] | null
          calculated_pay_cents?: number | null
          created_at?: string | null
          declined_at?: string | null
          delivered_at?: string | null
          distance_to_pickup_km?: number | null
          eta_to_pickup_seconds?: number | null
          expired_at?: string | null
          expires_at?: string | null
          failed_at?: string | null
          id?: string
          is_batch?: boolean | null
          offer_rank?: number | null
          order_id: string
          picked_up_at?: string | null
          rider_approaching_dropoff_notified_at?: string | null
          rider_approaching_pickup_notified_at?: string | null
          rider_id: string
          route_polyline?: string | null
          score?: number | null
          score_breakdown?: Json | null
          status?: string
          surge_multiplier?: number | null
          surge_reason?: string | null
          total_eta_seconds?: number | null
          updated_at?: string | null
          vehicle_type?: string | null
        }
        Update: {
          accepted_at?: string | null
          assigned_at?: string | null
          batch_order_ids?: string[] | null
          calculated_pay_cents?: number | null
          created_at?: string | null
          declined_at?: string | null
          delivered_at?: string | null
          distance_to_pickup_km?: number | null
          eta_to_pickup_seconds?: number | null
          expired_at?: string | null
          expires_at?: string | null
          failed_at?: string | null
          id?: string
          is_batch?: boolean | null
          offer_rank?: number | null
          order_id?: string
          picked_up_at?: string | null
          rider_approaching_dropoff_notified_at?: string | null
          rider_approaching_pickup_notified_at?: string | null
          rider_id?: string
          route_polyline?: string | null
          score?: number | null
          score_breakdown?: Json | null
          status?: string
          surge_multiplier?: number | null
          surge_reason?: string | null
          total_eta_seconds?: number | null
          updated_at?: string | null
          vehicle_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "delivery_assignments_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "delivery_assignments_rider_id_fkey"
            columns: ["rider_id"]
            isOneToOne: false
            referencedRelation: "riders"
            referencedColumns: ["id"]
          },
        ]
      }
      delivery_batches: {
        Row: {
          calculated_pay_cents: number
          cancelled_at: string | null
          completed_at: string | null
          created_at: string | null
          id: string
          optimized_route: Json | null
          order_ids: string[]
          rider_id: string | null
          started_at: string | null
          status: string | null
          surge_multiplier: number | null
          surge_reason: string | null
          total_distance_km: number | null
          total_time_minutes: number | null
          updated_at: string
        }
        Insert: {
          calculated_pay_cents: number
          cancelled_at?: string | null
          completed_at?: string | null
          created_at?: string | null
          id?: string
          optimized_route?: Json | null
          order_ids: string[]
          rider_id?: string | null
          started_at?: string | null
          status?: string | null
          surge_multiplier?: number | null
          surge_reason?: string | null
          total_distance_km?: number | null
          total_time_minutes?: number | null
          updated_at?: string
        }
        Update: {
          calculated_pay_cents?: number
          cancelled_at?: string | null
          completed_at?: string | null
          created_at?: string | null
          id?: string
          optimized_route?: Json | null
          order_ids?: string[]
          rider_id?: string | null
          started_at?: string | null
          status?: string | null
          surge_multiplier?: number | null
          surge_reason?: string | null
          total_distance_km?: number | null
          total_time_minutes?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "delivery_batches_rider_id_fkey"
            columns: ["rider_id"]
            isOneToOne: false
            referencedRelation: "riders"
            referencedColumns: ["id"]
          },
        ]
      }
      delivery_economics: {
        Row: {
          batch_size: number | null
          commission_earned: number
          created_at: string | null
          delivery_assignment_id: string | null
          delivery_fee_charged: number
          dispatch_duration_seconds: number | null
          distance_km: number | null
          duration_minutes: number | null
          gross_margin_cents: number | null
          id: string
          offer_count: number | null
          order_id: string
          rider_id: string | null
          rider_pay_cents: number
          rider_tip: number
          service_fee_earned: number
          stripe_fee_cents: number
          surge_multiplier: number | null
          vehicle_type: string | null
          was_batched: boolean | null
          weather_condition: string | null
        }
        Insert: {
          batch_size?: number | null
          commission_earned?: number
          created_at?: string | null
          delivery_assignment_id?: string | null
          delivery_fee_charged?: number
          dispatch_duration_seconds?: number | null
          distance_km?: number | null
          duration_minutes?: number | null
          gross_margin_cents?: number | null
          id?: string
          offer_count?: number | null
          order_id: string
          rider_id?: string | null
          rider_pay_cents?: number
          rider_tip?: number
          service_fee_earned?: number
          stripe_fee_cents?: number
          surge_multiplier?: number | null
          vehicle_type?: string | null
          was_batched?: boolean | null
          weather_condition?: string | null
        }
        Update: {
          batch_size?: number | null
          commission_earned?: number
          created_at?: string | null
          delivery_assignment_id?: string | null
          delivery_fee_charged?: number
          dispatch_duration_seconds?: number | null
          distance_km?: number | null
          duration_minutes?: number | null
          gross_margin_cents?: number | null
          id?: string
          offer_count?: number | null
          order_id?: string
          rider_id?: string | null
          rider_pay_cents?: number
          rider_tip?: number
          service_fee_earned?: number
          stripe_fee_cents?: number
          surge_multiplier?: number | null
          vehicle_type?: string | null
          was_batched?: boolean | null
          weather_condition?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "delivery_economics_delivery_assignment_id_fkey"
            columns: ["delivery_assignment_id"]
            isOneToOne: false
            referencedRelation: "delivery_assignments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "delivery_economics_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "delivery_economics_rider_id_fkey"
            columns: ["rider_id"]
            isOneToOne: false
            referencedRelation: "riders"
            referencedColumns: ["id"]
          },
        ]
      }
      delivery_fee_tiers: {
        Row: {
          created_at: string | null
          fee_cents: number
          id: string
          is_active: boolean | null
          location_id: string | null
          max_distance_km: number
          min_distance_km: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          fee_cents: number
          id?: string
          is_active?: boolean | null
          location_id?: string | null
          max_distance_km: number
          min_distance_km: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          fee_cents?: number
          id?: string
          is_active?: boolean | null
          location_id?: string | null
          max_distance_km?: number
          min_distance_km?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "delivery_fee_tiers_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "vendor_locations"
            referencedColumns: ["id"]
          },
        ]
      }
      delivery_zones: {
        Row: {
          created_at: string | null
          geom: unknown
          id: string
          is_active: boolean | null
          max_radius_m: number | null
          min_radius_m: number | null
          name: string
          slug: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          geom: unknown
          id?: string
          is_active?: boolean | null
          max_radius_m?: number | null
          min_radius_m?: number | null
          name: string
          slug: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          geom?: unknown
          id?: string
          is_active?: boolean | null
          max_radius_m?: number | null
          min_radius_m?: number | null
          name?: string
          slug?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      dispatch_events: {
        Row: {
          created_at: string | null
          data: Json | null
          event_type: string
          id: string
          order_id: string
          rider_id: string | null
        }
        Insert: {
          created_at?: string | null
          data?: Json | null
          event_type: string
          id?: string
          order_id: string
          rider_id?: string | null
        }
        Update: {
          created_at?: string | null
          data?: Json | null
          event_type?: string
          id?: string
          order_id?: string
          rider_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "dispatch_events_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dispatch_events_rider_id_fkey"
            columns: ["rider_id"]
            isOneToOne: false
            referencedRelation: "riders"
            referencedColumns: ["id"]
          },
        ]
      }
      document_expiry_notifications: {
        Row: {
          created_at: string | null
          expiry_date: string
          id: string
          notification_1_sent: boolean | null
          notification_30_sent: boolean | null
          notification_7_sent: boolean | null
          notify_at_1_day: string | null
          notify_at_30_days: string | null
          notify_at_7_days: string | null
          rider_id: string
          status: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          expiry_date: string
          id?: string
          notification_1_sent?: boolean | null
          notification_30_sent?: boolean | null
          notification_7_sent?: boolean | null
          notify_at_1_day?: string | null
          notify_at_30_days?: string | null
          notify_at_7_days?: string | null
          rider_id: string
          status?: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          expiry_date?: string
          id?: string
          notification_1_sent?: boolean | null
          notification_30_sent?: boolean | null
          notification_7_sent?: boolean | null
          notify_at_1_day?: string | null
          notify_at_30_days?: string | null
          notify_at_7_days?: string | null
          rider_id?: string
          status?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "document_expiry_notifications_rider_id_fkey"
            columns: ["rider_id"]
            isOneToOne: false
            referencedRelation: "riders"
            referencedColumns: ["id"]
          },
        ]
      }
      feedback: {
        Row: {
          app_platform: string | null
          app_source: string | null
          app_version: string | null
          created_at: string | null
          id: string
          message: string | null
          profile_type: string | null
          status: string | null
          subject: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          app_platform?: string | null
          app_source?: string | null
          app_version?: string | null
          created_at?: string | null
          id?: string
          message?: string | null
          profile_type?: string | null
          status?: string | null
          subject?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          app_platform?: string | null
          app_source?: string | null
          app_version?: string | null
          created_at?: string | null
          id?: string
          message?: string | null
          profile_type?: string | null
          status?: string | null
          subject?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      gdpr_requests: {
        Row: {
          created_at: string
          first_name: string | null
          id: string
          ip_address: string | null
          last_name: string | null
          message: string | null
          source_application: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          first_name?: string | null
          id?: string
          ip_address?: string | null
          last_name?: string | null
          message?: string | null
          source_application?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          first_name?: string | null
          id?: string
          ip_address?: string | null
          last_name?: string | null
          message?: string | null
          source_application?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      haccp_check_entries: {
        Row: {
          created_at: string
          id: string
          item_id: string
          notes: string | null
          numeric_value: number | null
          passed: boolean | null
          photo_url: string | null
          recorded_at: string
          recorded_by: string | null
          session_id: string
          updated_at: string
          value: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          item_id: string
          notes?: string | null
          numeric_value?: number | null
          passed?: boolean | null
          photo_url?: string | null
          recorded_at?: string
          recorded_by?: string | null
          session_id: string
          updated_at?: string
          value?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          item_id?: string
          notes?: string | null
          numeric_value?: number | null
          passed?: boolean | null
          photo_url?: string | null
          recorded_at?: string
          recorded_by?: string | null
          session_id?: string
          updated_at?: string
          value?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "haccp_check_entries_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "haccp_checklist_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "haccp_check_entries_recorded_by_fkey"
            columns: ["recorded_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "haccp_check_entries_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "haccp_check_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      haccp_check_sessions: {
        Row: {
          check_date: string
          completed_at: string | null
          completed_by: string | null
          created_at: string
          id: string
          location_id: string | null
          notes: string | null
          score_pct: number | null
          signed_off_at: string | null
          signed_off_by: string | null
          started_at: string
          started_by: string | null
          status: string
          storefront_id: string | null
          template_id: string
          updated_at: string
          vendor_id: string
        }
        Insert: {
          check_date?: string
          completed_at?: string | null
          completed_by?: string | null
          created_at?: string
          id?: string
          location_id?: string | null
          notes?: string | null
          score_pct?: number | null
          signed_off_at?: string | null
          signed_off_by?: string | null
          started_at?: string
          started_by?: string | null
          status?: string
          storefront_id?: string | null
          template_id: string
          updated_at?: string
          vendor_id: string
        }
        Update: {
          check_date?: string
          completed_at?: string | null
          completed_by?: string | null
          created_at?: string
          id?: string
          location_id?: string | null
          notes?: string | null
          score_pct?: number | null
          signed_off_at?: string | null
          signed_off_by?: string | null
          started_at?: string
          started_by?: string | null
          status?: string
          storefront_id?: string | null
          template_id?: string
          updated_at?: string
          vendor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "haccp_check_sessions_completed_by_fkey"
            columns: ["completed_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "haccp_check_sessions_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "vendor_locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "haccp_check_sessions_signed_off_by_fkey"
            columns: ["signed_off_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "haccp_check_sessions_started_by_fkey"
            columns: ["started_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "haccp_check_sessions_storefront_id_fkey"
            columns: ["storefront_id"]
            isOneToOne: false
            referencedRelation: "active_vendor_storefronts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "haccp_check_sessions_storefront_id_fkey"
            columns: ["storefront_id"]
            isOneToOne: false
            referencedRelation: "storefront_creation_summary"
            referencedColumns: ["storefront_id"]
          },
          {
            foreignKeyName: "haccp_check_sessions_storefront_id_fkey"
            columns: ["storefront_id"]
            isOneToOne: false
            referencedRelation: "v_public_store_stats"
            referencedColumns: ["storefront_id"]
          },
          {
            foreignKeyName: "haccp_check_sessions_storefront_id_fkey"
            columns: ["storefront_id"]
            isOneToOne: false
            referencedRelation: "vendor_storefronts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "haccp_check_sessions_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "haccp_checklist_templates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "haccp_check_sessions_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendor_public"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "haccp_check_sessions_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      haccp_checklist_items: {
        Row: {
          check_type: string
          created_at: string
          description: string | null
          expected_value: string | null
          id: string
          is_critical: boolean
          label: string
          max_value: number | null
          min_value: number | null
          sort_order: number
          template_id: string
          unit: string | null
          updated_at: string
        }
        Insert: {
          check_type?: string
          created_at?: string
          description?: string | null
          expected_value?: string | null
          id?: string
          is_critical?: boolean
          label: string
          max_value?: number | null
          min_value?: number | null
          sort_order?: number
          template_id: string
          unit?: string | null
          updated_at?: string
        }
        Update: {
          check_type?: string
          created_at?: string
          description?: string | null
          expected_value?: string | null
          id?: string
          is_critical?: boolean
          label?: string
          max_value?: number | null
          min_value?: number | null
          sort_order?: number
          template_id?: string
          unit?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "haccp_checklist_items_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "haccp_checklist_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      haccp_checklist_templates: {
        Row: {
          category: string
          created_at: string
          created_by: string | null
          description: string | null
          due_time: string | null
          frequency: string
          id: string
          is_active: boolean
          is_platform_default: boolean
          location_id: string | null
          sort_order: number
          storefront_id: string | null
          title: string
          updated_at: string
          vendor_id: string | null
        }
        Insert: {
          category?: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          due_time?: string | null
          frequency?: string
          id?: string
          is_active?: boolean
          is_platform_default?: boolean
          location_id?: string | null
          sort_order?: number
          storefront_id?: string | null
          title: string
          updated_at?: string
          vendor_id?: string | null
        }
        Update: {
          category?: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          due_time?: string | null
          frequency?: string
          id?: string
          is_active?: boolean
          is_platform_default?: boolean
          location_id?: string | null
          sort_order?: number
          storefront_id?: string | null
          title?: string
          updated_at?: string
          vendor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "haccp_checklist_templates_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "haccp_checklist_templates_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "vendor_locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "haccp_checklist_templates_storefront_id_fkey"
            columns: ["storefront_id"]
            isOneToOne: false
            referencedRelation: "active_vendor_storefronts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "haccp_checklist_templates_storefront_id_fkey"
            columns: ["storefront_id"]
            isOneToOne: false
            referencedRelation: "storefront_creation_summary"
            referencedColumns: ["storefront_id"]
          },
          {
            foreignKeyName: "haccp_checklist_templates_storefront_id_fkey"
            columns: ["storefront_id"]
            isOneToOne: false
            referencedRelation: "v_public_store_stats"
            referencedColumns: ["storefront_id"]
          },
          {
            foreignKeyName: "haccp_checklist_templates_storefront_id_fkey"
            columns: ["storefront_id"]
            isOneToOne: false
            referencedRelation: "vendor_storefronts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "haccp_checklist_templates_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendor_public"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "haccp_checklist_templates_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      haccp_corrective_actions: {
        Row: {
          action_taken: string | null
          assigned_to: string | null
          created_at: string
          created_by: string | null
          description: string
          due_date: string | null
          entry_id: string | null
          id: string
          location_id: string | null
          photo_url: string | null
          resolved_at: string | null
          resolved_by: string | null
          session_id: string | null
          severity: string
          status: string
          storefront_id: string | null
          temp_log_id: string | null
          updated_at: string
          vendor_id: string
        }
        Insert: {
          action_taken?: string | null
          assigned_to?: string | null
          created_at?: string
          created_by?: string | null
          description: string
          due_date?: string | null
          entry_id?: string | null
          id?: string
          location_id?: string | null
          photo_url?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          session_id?: string | null
          severity?: string
          status?: string
          storefront_id?: string | null
          temp_log_id?: string | null
          updated_at?: string
          vendor_id: string
        }
        Update: {
          action_taken?: string | null
          assigned_to?: string | null
          created_at?: string
          created_by?: string | null
          description?: string
          due_date?: string | null
          entry_id?: string | null
          id?: string
          location_id?: string | null
          photo_url?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          session_id?: string | null
          severity?: string
          status?: string
          storefront_id?: string | null
          temp_log_id?: string | null
          updated_at?: string
          vendor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "haccp_corrective_actions_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "haccp_corrective_actions_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "haccp_corrective_actions_entry_id_fkey"
            columns: ["entry_id"]
            isOneToOne: false
            referencedRelation: "haccp_check_entries"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "haccp_corrective_actions_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "vendor_locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "haccp_corrective_actions_resolved_by_fkey"
            columns: ["resolved_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "haccp_corrective_actions_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "haccp_check_sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "haccp_corrective_actions_storefront_id_fkey"
            columns: ["storefront_id"]
            isOneToOne: false
            referencedRelation: "active_vendor_storefronts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "haccp_corrective_actions_storefront_id_fkey"
            columns: ["storefront_id"]
            isOneToOne: false
            referencedRelation: "storefront_creation_summary"
            referencedColumns: ["storefront_id"]
          },
          {
            foreignKeyName: "haccp_corrective_actions_storefront_id_fkey"
            columns: ["storefront_id"]
            isOneToOne: false
            referencedRelation: "v_public_store_stats"
            referencedColumns: ["storefront_id"]
          },
          {
            foreignKeyName: "haccp_corrective_actions_storefront_id_fkey"
            columns: ["storefront_id"]
            isOneToOne: false
            referencedRelation: "vendor_storefronts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "haccp_corrective_actions_temp_log_id_fkey"
            columns: ["temp_log_id"]
            isOneToOne: false
            referencedRelation: "haccp_temperature_logs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "haccp_corrective_actions_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendor_public"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "haccp_corrective_actions_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      haccp_equipment: {
        Row: {
          created_at: string
          equipment_type: string
          id: string
          is_active: boolean
          location_id: string | null
          max_temp: number | null
          min_temp: number | null
          name: string
          sort_order: number
          storefront_id: string | null
          updated_at: string
          vendor_id: string
        }
        Insert: {
          created_at?: string
          equipment_type?: string
          id?: string
          is_active?: boolean
          location_id?: string | null
          max_temp?: number | null
          min_temp?: number | null
          name: string
          sort_order?: number
          storefront_id?: string | null
          updated_at?: string
          vendor_id: string
        }
        Update: {
          created_at?: string
          equipment_type?: string
          id?: string
          is_active?: boolean
          location_id?: string | null
          max_temp?: number | null
          min_temp?: number | null
          name?: string
          sort_order?: number
          storefront_id?: string | null
          updated_at?: string
          vendor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "haccp_equipment_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "vendor_locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "haccp_equipment_storefront_id_fkey"
            columns: ["storefront_id"]
            isOneToOne: false
            referencedRelation: "active_vendor_storefronts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "haccp_equipment_storefront_id_fkey"
            columns: ["storefront_id"]
            isOneToOne: false
            referencedRelation: "storefront_creation_summary"
            referencedColumns: ["storefront_id"]
          },
          {
            foreignKeyName: "haccp_equipment_storefront_id_fkey"
            columns: ["storefront_id"]
            isOneToOne: false
            referencedRelation: "v_public_store_stats"
            referencedColumns: ["storefront_id"]
          },
          {
            foreignKeyName: "haccp_equipment_storefront_id_fkey"
            columns: ["storefront_id"]
            isOneToOne: false
            referencedRelation: "vendor_storefronts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "haccp_equipment_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendor_public"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "haccp_equipment_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      haccp_notification_preferences: {
        Row: {
          completion_push_enabled: boolean
          created_at: string
          escalation_enabled: boolean
          escalation_time: string
          id: string
          morning_reminder_enabled: boolean
          morning_reminder_time: string
          timezone: string
          updated_at: string
          vendor_id: string
        }
        Insert: {
          completion_push_enabled?: boolean
          created_at?: string
          escalation_enabled?: boolean
          escalation_time?: string
          id?: string
          morning_reminder_enabled?: boolean
          morning_reminder_time?: string
          timezone?: string
          updated_at?: string
          vendor_id: string
        }
        Update: {
          completion_push_enabled?: boolean
          created_at?: string
          escalation_enabled?: boolean
          escalation_time?: string
          id?: string
          morning_reminder_enabled?: boolean
          morning_reminder_time?: string
          timezone?: string
          updated_at?: string
          vendor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "haccp_notification_preferences_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: true
            referencedRelation: "vendor_public"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "haccp_notification_preferences_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: true
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      haccp_share_tokens: {
        Row: {
          created_at: string
          created_by: string | null
          expires_at: string
          id: string
          location_id: string | null
          revoked_at: string | null
          token: string
          vendor_id: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          expires_at: string
          id?: string
          location_id?: string | null
          revoked_at?: string | null
          token: string
          vendor_id: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          expires_at?: string
          id?: string
          location_id?: string | null
          revoked_at?: string | null
          token?: string
          vendor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "haccp_share_tokens_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "haccp_share_tokens_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "vendor_locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "haccp_share_tokens_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendor_public"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "haccp_share_tokens_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      haccp_temperature_logs: {
        Row: {
          created_at: string
          equipment_name: string
          equipment_type: string
          id: string
          is_within_range: boolean | null
          location_id: string | null
          max_threshold: number | null
          min_threshold: number | null
          notes: string | null
          photo_url: string | null
          recorded_at: string
          recorded_by: string | null
          session_id: string | null
          source: string
          storefront_id: string | null
          temperature: number
          unit: string
          updated_at: string
          vendor_id: string
        }
        Insert: {
          created_at?: string
          equipment_name: string
          equipment_type?: string
          id?: string
          is_within_range?: boolean | null
          location_id?: string | null
          max_threshold?: number | null
          min_threshold?: number | null
          notes?: string | null
          photo_url?: string | null
          recorded_at?: string
          recorded_by?: string | null
          session_id?: string | null
          source?: string
          storefront_id?: string | null
          temperature: number
          unit?: string
          updated_at?: string
          vendor_id: string
        }
        Update: {
          created_at?: string
          equipment_name?: string
          equipment_type?: string
          id?: string
          is_within_range?: boolean | null
          location_id?: string | null
          max_threshold?: number | null
          min_threshold?: number | null
          notes?: string | null
          photo_url?: string | null
          recorded_at?: string
          recorded_by?: string | null
          session_id?: string | null
          source?: string
          storefront_id?: string | null
          temperature?: number
          unit?: string
          updated_at?: string
          vendor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "haccp_temperature_logs_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "vendor_locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "haccp_temperature_logs_recorded_by_fkey"
            columns: ["recorded_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "haccp_temperature_logs_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "haccp_check_sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "haccp_temperature_logs_storefront_id_fkey"
            columns: ["storefront_id"]
            isOneToOne: false
            referencedRelation: "active_vendor_storefronts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "haccp_temperature_logs_storefront_id_fkey"
            columns: ["storefront_id"]
            isOneToOne: false
            referencedRelation: "storefront_creation_summary"
            referencedColumns: ["storefront_id"]
          },
          {
            foreignKeyName: "haccp_temperature_logs_storefront_id_fkey"
            columns: ["storefront_id"]
            isOneToOne: false
            referencedRelation: "v_public_store_stats"
            referencedColumns: ["storefront_id"]
          },
          {
            foreignKeyName: "haccp_temperature_logs_storefront_id_fkey"
            columns: ["storefront_id"]
            isOneToOne: false
            referencedRelation: "vendor_storefronts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "haccp_temperature_logs_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendor_public"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "haccp_temperature_logs_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      health_checks: {
        Row: {
          created_at: string
          id: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: number
          updated_at?: string
        }
        Relationships: []
      }
      identity_verification_sessions: {
        Row: {
          completed_at: string | null
          created_at: string | null
          document_expiry_date: string | null
          document_types_allowed: string[] | null
          id: string
          is_test_mode: boolean | null
          metadata: Json | null
          rider_id: string
          status: string
          stripe_session_id: string
          stripe_verification_data: Json | null
          updated_at: string | null
          user_id: string
          vehicle_type: string | null
          verified_document_type: string | null
        }
        Insert: {
          completed_at?: string | null
          created_at?: string | null
          document_expiry_date?: string | null
          document_types_allowed?: string[] | null
          id?: string
          is_test_mode?: boolean | null
          metadata?: Json | null
          rider_id: string
          status?: string
          stripe_session_id: string
          stripe_verification_data?: Json | null
          updated_at?: string | null
          user_id: string
          vehicle_type?: string | null
          verified_document_type?: string | null
        }
        Update: {
          completed_at?: string | null
          created_at?: string | null
          document_expiry_date?: string | null
          document_types_allowed?: string[] | null
          id?: string
          is_test_mode?: boolean | null
          metadata?: Json | null
          rider_id?: string
          status?: string
          stripe_session_id?: string
          stripe_verification_data?: Json | null
          updated_at?: string | null
          user_id?: string
          vehicle_type?: string | null
          verified_document_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "identity_verification_sessions_rider_id_fkey"
            columns: ["rider_id"]
            isOneToOne: false
            referencedRelation: "riders"
            referencedColumns: ["id"]
          },
        ]
      }
      ig_comment_triggers: {
        Row: {
          active: boolean
          created_at: string
          dm_template: string
          id: string
          post_id: string | null
          trigger_word: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          dm_template: string
          id?: string
          post_id?: string | null
          trigger_word: string
        }
        Update: {
          active?: boolean
          created_at?: string
          dm_template?: string
          id?: string
          post_id?: string | null
          trigger_word?: string
        }
        Relationships: []
      }
      ig_messages: {
        Row: {
          attachments: Json | null
          body: string | null
          created_at: string
          direction: string
          id: string
          provider_message_id: string | null
          source: string
          thread_id: string
        }
        Insert: {
          attachments?: Json | null
          body?: string | null
          created_at?: string
          direction: string
          id?: string
          provider_message_id?: string | null
          source?: string
          thread_id: string
        }
        Update: {
          attachments?: Json | null
          body?: string | null
          created_at?: string
          direction?: string
          id?: string
          provider_message_id?: string | null
          source?: string
          thread_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ig_messages_thread_id_fkey"
            columns: ["thread_id"]
            isOneToOne: false
            referencedRelation: "ig_threads"
            referencedColumns: ["id"]
          },
        ]
      }
      ig_story_mention_log: {
        Row: {
          auto_replied: boolean
          comment_id: string | null
          id: string
          ig_user_id: string | null
          ig_username: string | null
          mentioned_at: string
          story_id: string | null
        }
        Insert: {
          auto_replied?: boolean
          comment_id?: string | null
          id?: string
          ig_user_id?: string | null
          ig_username?: string | null
          mentioned_at?: string
          story_id?: string | null
        }
        Update: {
          auto_replied?: boolean
          comment_id?: string | null
          id?: string
          ig_user_id?: string | null
          ig_username?: string | null
          mentioned_at?: string
          story_id?: string | null
        }
        Relationships: []
      }
      ig_threads: {
        Row: {
          id: string
          ig_user_id: string
          ig_username: string | null
          last_inbound_at: string | null
          lead_key: string | null
          opened_at: string
          window_expires_at: string | null
        }
        Insert: {
          id?: string
          ig_user_id: string
          ig_username?: string | null
          last_inbound_at?: string | null
          lead_key?: string | null
          opened_at?: string
          window_expires_at?: string | null
        }
        Update: {
          id?: string
          ig_user_id?: string
          ig_username?: string | null
          last_inbound_at?: string | null
          lead_key?: string | null
          opened_at?: string
          window_expires_at?: string | null
        }
        Relationships: []
      }
      import_jobs: {
        Row: {
          completed_at: string | null
          created_at: string
          error_message: string | null
          id: string
          result_json: Json | null
          source: string
          started_at: string | null
          status: string
          url: string
          user_id: string | null
          vendor_id: string | null
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          error_message?: string | null
          id?: string
          result_json?: Json | null
          source: string
          started_at?: string | null
          status?: string
          url: string
          user_id?: string | null
          vendor_id?: string | null
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          error_message?: string | null
          id?: string
          result_json?: Json | null
          source?: string
          started_at?: string | null
          status?: string
          url?: string
          user_id?: string | null
          vendor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "import_jobs_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendor_public"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "import_jobs_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      ingredients: {
        Row: {
          category: string | null
          created_at: string
          id: number
          name: string
          updated_at: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          id?: number
          name: string
          updated_at?: string
        }
        Update: {
          category?: string | null
          created_at?: string
          id?: number
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      lead_contacts: {
        Row: {
          contact_form_url: string | null
          emails: string[]
          facebook_url: string | null
          fetched_via: string
          id: string
          instagram_url: string | null
          linkedin_url: string | null
          pages_checked: string[]
          phone: string | null
          scraped_at: string
          source_url: string
          storefront_id: string
          tiktok_url: string | null
          whatsapp: string | null
          x_url: string | null
        }
        Insert: {
          contact_form_url?: string | null
          emails?: string[]
          facebook_url?: string | null
          fetched_via?: string
          id?: string
          instagram_url?: string | null
          linkedin_url?: string | null
          pages_checked?: string[]
          phone?: string | null
          scraped_at?: string
          source_url: string
          storefront_id: string
          tiktok_url?: string | null
          whatsapp?: string | null
          x_url?: string | null
        }
        Update: {
          contact_form_url?: string | null
          emails?: string[]
          facebook_url?: string | null
          fetched_via?: string
          id?: string
          instagram_url?: string | null
          linkedin_url?: string | null
          pages_checked?: string[]
          phone?: string | null
          scraped_at?: string
          source_url?: string
          storefront_id?: string
          tiktok_url?: string | null
          whatsapp?: string | null
          x_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lead_contacts_storefront_id_fkey"
            columns: ["storefront_id"]
            isOneToOne: false
            referencedRelation: "active_vendor_storefronts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lead_contacts_storefront_id_fkey"
            columns: ["storefront_id"]
            isOneToOne: false
            referencedRelation: "storefront_creation_summary"
            referencedColumns: ["storefront_id"]
          },
          {
            foreignKeyName: "lead_contacts_storefront_id_fkey"
            columns: ["storefront_id"]
            isOneToOne: false
            referencedRelation: "v_public_store_stats"
            referencedColumns: ["storefront_id"]
          },
          {
            foreignKeyName: "lead_contacts_storefront_id_fkey"
            columns: ["storefront_id"]
            isOneToOne: false
            referencedRelation: "vendor_storefronts"
            referencedColumns: ["id"]
          },
        ]
      }
      lead_crm: {
        Row: {
          assigned_to: string | null
          contact_count: number
          last_contacted_at: string | null
          lead_key: string
          lost_reason: string | null
          next_action: string | null
          next_action_at: string | null
          owner_email: string | null
          owner_name: string | null
          owner_phone: string | null
          owner_role: string | null
          priority: string | null
          status: string
          tags: string[]
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          assigned_to?: string | null
          contact_count?: number
          last_contacted_at?: string | null
          lead_key: string
          lost_reason?: string | null
          next_action?: string | null
          next_action_at?: string | null
          owner_email?: string | null
          owner_name?: string | null
          owner_phone?: string | null
          owner_role?: string | null
          priority?: string | null
          status?: string
          tags?: string[]
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          assigned_to?: string | null
          contact_count?: number
          last_contacted_at?: string | null
          lead_key?: string
          lost_reason?: string | null
          next_action?: string | null
          next_action_at?: string | null
          owner_email?: string | null
          owner_name?: string | null
          owner_phone?: string | null
          owner_role?: string | null
          priority?: string | null
          status?: string
          tags?: string[]
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      lead_notes: {
        Row: {
          author_id: string | null
          body: string
          created_at: string
          id: string
          kind: string
          lead_key: string
        }
        Insert: {
          author_id?: string | null
          body: string
          created_at?: string
          id?: string
          kind?: string
          lead_key: string
        }
        Update: {
          author_id?: string | null
          body?: string
          created_at?: string
          id?: string
          kind?: string
          lead_key?: string
        }
        Relationships: []
      }
      lead_slugs: {
        Row: {
          created_at: string
          job_id: string
          slug: string
        }
        Insert: {
          created_at?: string
          job_id: string
          slug: string
        }
        Update: {
          created_at?: string
          job_id?: string
          slug?: string
        }
        Relationships: [
          {
            foreignKeyName: "lead_slugs_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: true
            referencedRelation: "mv_lead_intel_scored"
            referencedColumns: ["job_id"]
          },
          {
            foreignKeyName: "lead_slugs_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: true
            referencedRelation: "scrape_jobs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lead_slugs_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: true
            referencedRelation: "scrape_jobs_dashboard"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lead_slugs_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: true
            referencedRelation: "v_canonical_listings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lead_slugs_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: true
            referencedRelation: "v_lead_intel"
            referencedColumns: ["job_id"]
          },
          {
            foreignKeyName: "lead_slugs_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: true
            referencedRelation: "v_lead_intel_scored"
            referencedColumns: ["job_id"]
          },
        ]
      }
      leads: {
        Row: {
          auto_reply_sent_at: string | null
          business_name: string | null
          city: string | null
          country: string | null
          county_or_state: string | null
          created_at: string
          email: string | null
          fbclid: string | null
          followed_up_at: string | null
          gclid: string | null
          id: string
          landing_path: string | null
          message: string | null
          name: string | null
          notes: string | null
          phone: string | null
          referrer: string | null
          source: string | null
          subject: string | null
          type: string
          utm_campaign: string | null
          utm_content: string | null
          utm_medium: string | null
          utm_source: string | null
          utm_term: string | null
        }
        Insert: {
          auto_reply_sent_at?: string | null
          business_name?: string | null
          city?: string | null
          country?: string | null
          county_or_state?: string | null
          created_at?: string
          email?: string | null
          fbclid?: string | null
          followed_up_at?: string | null
          gclid?: string | null
          id?: string
          landing_path?: string | null
          message?: string | null
          name?: string | null
          notes?: string | null
          phone?: string | null
          referrer?: string | null
          source?: string | null
          subject?: string | null
          type: string
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
        }
        Update: {
          auto_reply_sent_at?: string | null
          business_name?: string | null
          city?: string | null
          country?: string | null
          county_or_state?: string | null
          created_at?: string
          email?: string | null
          fbclid?: string | null
          followed_up_at?: string | null
          gclid?: string | null
          id?: string
          landing_path?: string | null
          message?: string | null
          name?: string | null
          notes?: string | null
          phone?: string | null
          referrer?: string | null
          source?: string | null
          subject?: string | null
          type?: string
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
        }
        Relationships: []
      }
      legal_documents: {
        Row: {
          content_markdown: string
          slug: string
          title: string
          updated_at: string
        }
        Insert: {
          content_markdown: string
          slug: string
          title: string
          updated_at?: string
        }
        Update: {
          content_markdown?: string
          slug?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      location_delivery_radius: {
        Row: {
          center_lat: number
          center_long: number
          created_at: string | null
          id: number
          location_id: string
          radius_km: number
          updated_at: string | null
        }
        Insert: {
          center_lat: number
          center_long: number
          created_at?: string | null
          id?: number
          location_id: string
          radius_km: number
          updated_at?: string | null
        }
        Update: {
          center_lat?: number
          center_long?: number
          created_at?: string | null
          id?: number
          location_id?: string
          radius_km?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "location_delivery_radius_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: true
            referencedRelation: "vendor_locations"
            referencedColumns: ["id"]
          },
        ]
      }
      location_interest: {
        Row: {
          city: string
          created_at: string
          id: string
          lat: number | null
          lng: number | null
          phone: string
          source: string
          updated_at: string
        }
        Insert: {
          city: string
          created_at?: string
          id?: string
          lat?: number | null
          lng?: number | null
          phone: string
          source?: string
          updated_at?: string
        }
        Update: {
          city?: string
          created_at?: string
          id?: string
          lat?: number | null
          lng?: number | null
          phone?: string
          source?: string
          updated_at?: string
        }
        Relationships: []
      }
      location_order_sequences: {
        Row: {
          created_at: string
          current_sequence: number
          last_updated_at: string | null
          location_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          current_sequence?: number
          last_updated_at?: string | null
          location_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          current_sequence?: number
          last_updated_at?: string | null
          location_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "location_order_sequences_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: true
            referencedRelation: "vendor_locations"
            referencedColumns: ["id"]
          },
        ]
      }
      mcc_codes: {
        Row: {
          category: string | null
          created_at: string
          description: string | null
          id: number
          mcc: string | null
          updated_at: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          description?: string | null
          id?: number
          mcc?: string | null
          updated_at?: string
        }
        Update: {
          category?: string | null
          created_at?: string
          description?: string | null
          id?: number
          mcc?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      menu_diffs: {
        Row: {
          added_items: Json
          availability_changes: Json
          detected_at: string
          from_snapshot_id: string | null
          id: string
          price_changes: Json
          removed_items: Json
          source_type: string
          source_url: string
          to_snapshot_id: string | null
          total_changes: number
        }
        Insert: {
          added_items?: Json
          availability_changes?: Json
          detected_at?: string
          from_snapshot_id?: string | null
          id?: string
          price_changes?: Json
          removed_items?: Json
          source_type: string
          source_url: string
          to_snapshot_id?: string | null
          total_changes?: number
        }
        Update: {
          added_items?: Json
          availability_changes?: Json
          detected_at?: string
          from_snapshot_id?: string | null
          id?: string
          price_changes?: Json
          removed_items?: Json
          source_type?: string
          source_url?: string
          to_snapshot_id?: string | null
          total_changes?: number
        }
        Relationships: [
          {
            foreignKeyName: "menu_diffs_from_snapshot_id_fkey"
            columns: ["from_snapshot_id"]
            isOneToOne: false
            referencedRelation: "menu_snapshots"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "menu_diffs_to_snapshot_id_fkey"
            columns: ["to_snapshot_id"]
            isOneToOne: false
            referencedRelation: "menu_snapshots"
            referencedColumns: ["id"]
          },
        ]
      }
      menu_snapshots: {
        Row: {
          category_count: number
          data_confidence: number | null
          id: string
          product_count: number
          products: Json
          scrape_job_id: string | null
          scraped_at: string
          scraper_used: string | null
          snapshot_hash: string
          source_type: string
          source_url: string
        }
        Insert: {
          category_count?: number
          data_confidence?: number | null
          id?: string
          product_count?: number
          products?: Json
          scrape_job_id?: string | null
          scraped_at?: string
          scraper_used?: string | null
          snapshot_hash: string
          source_type: string
          source_url: string
        }
        Update: {
          category_count?: number
          data_confidence?: number | null
          id?: string
          product_count?: number
          products?: Json
          scrape_job_id?: string | null
          scraped_at?: string
          scraper_used?: string | null
          snapshot_hash?: string
          source_type?: string
          source_url?: string
        }
        Relationships: [
          {
            foreignKeyName: "menu_snapshots_scrape_job_id_fkey"
            columns: ["scrape_job_id"]
            isOneToOne: false
            referencedRelation: "mv_lead_intel_scored"
            referencedColumns: ["job_id"]
          },
          {
            foreignKeyName: "menu_snapshots_scrape_job_id_fkey"
            columns: ["scrape_job_id"]
            isOneToOne: false
            referencedRelation: "scrape_jobs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "menu_snapshots_scrape_job_id_fkey"
            columns: ["scrape_job_id"]
            isOneToOne: false
            referencedRelation: "scrape_jobs_dashboard"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "menu_snapshots_scrape_job_id_fkey"
            columns: ["scrape_job_id"]
            isOneToOne: false
            referencedRelation: "v_canonical_listings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "menu_snapshots_scrape_job_id_fkey"
            columns: ["scrape_job_id"]
            isOneToOne: false
            referencedRelation: "v_lead_intel"
            referencedColumns: ["job_id"]
          },
          {
            foreignKeyName: "menu_snapshots_scrape_job_id_fkey"
            columns: ["scrape_job_id"]
            isOneToOne: false
            referencedRelation: "v_lead_intel_scored"
            referencedColumns: ["job_id"]
          },
        ]
      }
      notification_badge_count: {
        Row: {
          count: number | null
          created_at: string
          id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          count?: number | null
          created_at?: string
          id?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          count?: number | null
          created_at?: string
          id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      notification_settings: {
        Row: {
          basket_reminders: boolean | null
          chat_channel_updates: boolean | null
          chat_member_updates: boolean | null
          chat_messages: boolean | null
          chat_reactions: boolean | null
          created_at: string | null
          email_order_updates: boolean | null
          email_promotions: boolean | null
          email_receipts: boolean | null
          email_weekly_summary: boolean | null
          order_updates: boolean | null
          promotions: boolean | null
          security_alerts: boolean | null
          updated_at: string | null
          user_id: string
          vendor_status_updates: boolean | null
        }
        Insert: {
          basket_reminders?: boolean | null
          chat_channel_updates?: boolean | null
          chat_member_updates?: boolean | null
          chat_messages?: boolean | null
          chat_reactions?: boolean | null
          created_at?: string | null
          email_order_updates?: boolean | null
          email_promotions?: boolean | null
          email_receipts?: boolean | null
          email_weekly_summary?: boolean | null
          order_updates?: boolean | null
          promotions?: boolean | null
          security_alerts?: boolean | null
          updated_at?: string | null
          user_id: string
          vendor_status_updates?: boolean | null
        }
        Update: {
          basket_reminders?: boolean | null
          chat_channel_updates?: boolean | null
          chat_member_updates?: boolean | null
          chat_messages?: boolean | null
          chat_reactions?: boolean | null
          created_at?: string | null
          email_order_updates?: boolean | null
          email_promotions?: boolean | null
          email_receipts?: boolean | null
          email_weekly_summary?: boolean | null
          order_updates?: boolean | null
          promotions?: boolean | null
          security_alerts?: boolean | null
          updated_at?: string | null
          user_id?: string
          vendor_status_updates?: boolean | null
        }
        Relationships: []
      }
      numbers_waitlist: {
        Row: {
          created_at: string
          email: string
          id: string
          meta: Json | null
          product: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          meta?: Json | null
          product: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          meta?: Json | null
          product?: string
        }
        Relationships: []
      }
      one_app_changelogs: {
        Row: {
          changes: Json
          created_at: string | null
          description: string | null
          id: string
          is_published: boolean | null
          platform: string | null
          release_date: string
          title: string
          updated_at: string
          version: string
        }
        Insert: {
          changes: Json
          created_at?: string | null
          description?: string | null
          id?: string
          is_published?: boolean | null
          platform?: string | null
          release_date: string
          title: string
          updated_at?: string
          version: string
        }
        Update: {
          changes?: Json
          created_at?: string | null
          description?: string | null
          id?: string
          is_published?: boolean | null
          platform?: string | null
          release_date?: string
          title?: string
          updated_at?: string
          version?: string
        }
        Relationships: []
      }
      order_items: {
        Row: {
          created_at: string | null
          customizations: Json | null
          discount_amount: number | null
          discount_reason: string | null
          id: string
          is_simulated: boolean
          product_id: string
          product_name: string
          quantity: number
          sku: string | null
          subtotal: number
          tax_amount: number | null
          thumbnail_url: string | null
          unit_price: number
          updated_at: string
          variant_id: string | null
          variant_name: string | null
          vendor_order_id: string
        }
        Insert: {
          created_at?: string | null
          customizations?: Json | null
          discount_amount?: number | null
          discount_reason?: string | null
          id?: string
          is_simulated?: boolean
          product_id: string
          product_name: string
          quantity?: number
          sku?: string | null
          subtotal: number
          tax_amount?: number | null
          thumbnail_url?: string | null
          unit_price: number
          updated_at?: string
          variant_id?: string | null
          variant_name?: string | null
          vendor_order_id: string
        }
        Update: {
          created_at?: string | null
          customizations?: Json | null
          discount_amount?: number | null
          discount_reason?: string | null
          id?: string
          is_simulated?: boolean
          product_id?: string
          product_name?: string
          quantity?: number
          sku?: string | null
          subtotal?: number
          tax_amount?: number | null
          thumbnail_url?: string | null
          unit_price?: number
          updated_at?: string
          variant_id?: string | null
          variant_name?: string | null
          vendor_order_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_variant_id_fkey"
            columns: ["variant_id"]
            isOneToOne: false
            referencedRelation: "product_variants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_vendor_order_id_fkey"
            columns: ["vendor_order_id"]
            isOneToOne: false
            referencedRelation: "vendor_orders"
            referencedColumns: ["id"]
          },
        ]
      }
      order_number_sequences: {
        Row: {
          created_at: string
          current_number: number
          location_id: string
          storefront_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          current_number?: number
          location_id: string
          storefront_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          current_number?: number
          location_id?: string
          storefront_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "order_number_sequences_storefront_id_fkey"
            columns: ["storefront_id"]
            isOneToOne: false
            referencedRelation: "active_vendor_storefronts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_number_sequences_storefront_id_fkey"
            columns: ["storefront_id"]
            isOneToOne: false
            referencedRelation: "storefront_creation_summary"
            referencedColumns: ["storefront_id"]
          },
          {
            foreignKeyName: "order_number_sequences_storefront_id_fkey"
            columns: ["storefront_id"]
            isOneToOne: false
            referencedRelation: "v_public_store_stats"
            referencedColumns: ["storefront_id"]
          },
          {
            foreignKeyName: "order_number_sequences_storefront_id_fkey"
            columns: ["storefront_id"]
            isOneToOne: false
            referencedRelation: "vendor_storefronts"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          age_check_failed_at: string | null
          age_restricted: boolean
          age_verified_at: string | null
          cancellable_until: string | null
          cancelled_by: string | null
          cancelled_on: string | null
          capture_retry_count: number | null
          card_fee: number | null
          channel: string
          claimed_at: string | null
          commission_rate: number | null
          completed_at: string | null
          created_at: string
          credit_applied_cents: number
          customer_id: string | null
          decline_count: number | null
          delivered_at: string | null
          delivery_address: string | null
          delivery_address_id: string | null
          delivery_batch_id: string | null
          delivery_eta_text: string | null
          delivery_fee: number | null
          delivery_instructions: string | null
          delivery_lat: number | null
          delivery_lng: number | null
          delivery_method_id: string | null
          delivery_method_label: string | null
          delivery_point: unknown
          discount_amount_cents: number
          dispatch_after_at: string | null
          dropoff_location: Json | null
          estimated_delivery_at: string | null
          eta: string | null
          food_cost_cents: number | null
          food_receipt_url: string | null
          fulfillment_type: string | null
          id: string
          is_simulated: boolean
          is_test_order: boolean
          items: Json | null
          location_id: string | null
          note_for_rider: string | null
          note_for_vendor: string | null
          notes: string | null
          payment_attempts: number | null
          payment_details: Json | null
          payment_intent_id: string | null
          payment_method: string | null
          payment_method_type: string | null
          payment_status: string | null
          picked_up_at: string | null
          pickup_address: string | null
          pickup_lat: number | null
          pickup_lng: number | null
          pickup_location: string | null
          pickup_point: unknown
          platform_fee: number | null
          platform_fee_cents: number | null
          platform_fee_from_customer: number | null
          platform_fee_from_vendor: number | null
          projected_margin_cents: number | null
          promo_code: string | null
          ready_at: string | null
          reason_for_cancel: string | null
          refund_amount_cents: number | null
          refund_reason: string | null
          refund_status: string | null
          refunded_at: string | null
          rider_base_fee: number | null
          rider_distance_fee: number | null
          rider_id: string | null
          rider_location: string | null
          rider_payout_amount: number | null
          rider_tip: number | null
          rider_total_fee: number | null
          service_fee: number | null
          status: string | null
          storefront_id: string | null
          stripe_application_fee_amount: number | null
          stripe_charge_id: string | null
          stripe_payment_intent_id: string | null
          stripe_payment_method_id: string | null
          stripe_payment_status: string | null
          subtotal: number | null
          surplus: number | null
          total_paid: number | null
          transfer_scheduled_at: string | null
          transfers_completed_at: string | null
          transfers_created: boolean | null
          updated_at: string | null
          vendor_accepted: boolean | null
          vendor_id: string | null
        }
        Insert: {
          age_check_failed_at?: string | null
          age_restricted?: boolean
          age_verified_at?: string | null
          cancellable_until?: string | null
          cancelled_by?: string | null
          cancelled_on?: string | null
          capture_retry_count?: number | null
          card_fee?: number | null
          channel?: string
          claimed_at?: string | null
          commission_rate?: number | null
          completed_at?: string | null
          created_at: string
          credit_applied_cents?: number
          customer_id?: string | null
          decline_count?: number | null
          delivered_at?: string | null
          delivery_address?: string | null
          delivery_address_id?: string | null
          delivery_batch_id?: string | null
          delivery_eta_text?: string | null
          delivery_fee?: number | null
          delivery_instructions?: string | null
          delivery_lat?: number | null
          delivery_lng?: number | null
          delivery_method_id?: string | null
          delivery_method_label?: string | null
          delivery_point?: unknown
          discount_amount_cents?: number
          dispatch_after_at?: string | null
          dropoff_location?: Json | null
          estimated_delivery_at?: string | null
          eta?: string | null
          food_cost_cents?: number | null
          food_receipt_url?: string | null
          fulfillment_type?: string | null
          id?: string
          is_simulated?: boolean
          is_test_order?: boolean
          items?: Json | null
          location_id?: string | null
          note_for_rider?: string | null
          note_for_vendor?: string | null
          notes?: string | null
          payment_attempts?: number | null
          payment_details?: Json | null
          payment_intent_id?: string | null
          payment_method?: string | null
          payment_method_type?: string | null
          payment_status?: string | null
          picked_up_at?: string | null
          pickup_address?: string | null
          pickup_lat?: number | null
          pickup_lng?: number | null
          pickup_location?: string | null
          pickup_point?: unknown
          platform_fee?: number | null
          platform_fee_cents?: number | null
          platform_fee_from_customer?: number | null
          platform_fee_from_vendor?: number | null
          projected_margin_cents?: number | null
          promo_code?: string | null
          ready_at?: string | null
          reason_for_cancel?: string | null
          refund_amount_cents?: number | null
          refund_reason?: string | null
          refund_status?: string | null
          refunded_at?: string | null
          rider_base_fee?: number | null
          rider_distance_fee?: number | null
          rider_id?: string | null
          rider_location?: string | null
          rider_payout_amount?: number | null
          rider_tip?: number | null
          rider_total_fee?: number | null
          service_fee?: number | null
          status?: string | null
          storefront_id?: string | null
          stripe_application_fee_amount?: number | null
          stripe_charge_id?: string | null
          stripe_payment_intent_id?: string | null
          stripe_payment_method_id?: string | null
          stripe_payment_status?: string | null
          subtotal?: number | null
          surplus?: number | null
          total_paid?: number | null
          transfer_scheduled_at?: string | null
          transfers_completed_at?: string | null
          transfers_created?: boolean | null
          updated_at?: string | null
          vendor_accepted?: boolean | null
          vendor_id?: string | null
        }
        Update: {
          age_check_failed_at?: string | null
          age_restricted?: boolean
          age_verified_at?: string | null
          cancellable_until?: string | null
          cancelled_by?: string | null
          cancelled_on?: string | null
          capture_retry_count?: number | null
          card_fee?: number | null
          channel?: string
          claimed_at?: string | null
          commission_rate?: number | null
          completed_at?: string | null
          created_at?: string
          credit_applied_cents?: number
          customer_id?: string | null
          decline_count?: number | null
          delivered_at?: string | null
          delivery_address?: string | null
          delivery_address_id?: string | null
          delivery_batch_id?: string | null
          delivery_eta_text?: string | null
          delivery_fee?: number | null
          delivery_instructions?: string | null
          delivery_lat?: number | null
          delivery_lng?: number | null
          delivery_method_id?: string | null
          delivery_method_label?: string | null
          delivery_point?: unknown
          discount_amount_cents?: number
          dispatch_after_at?: string | null
          dropoff_location?: Json | null
          estimated_delivery_at?: string | null
          eta?: string | null
          food_cost_cents?: number | null
          food_receipt_url?: string | null
          fulfillment_type?: string | null
          id?: string
          is_simulated?: boolean
          is_test_order?: boolean
          items?: Json | null
          location_id?: string | null
          note_for_rider?: string | null
          note_for_vendor?: string | null
          notes?: string | null
          payment_attempts?: number | null
          payment_details?: Json | null
          payment_intent_id?: string | null
          payment_method?: string | null
          payment_method_type?: string | null
          payment_status?: string | null
          picked_up_at?: string | null
          pickup_address?: string | null
          pickup_lat?: number | null
          pickup_lng?: number | null
          pickup_location?: string | null
          pickup_point?: unknown
          platform_fee?: number | null
          platform_fee_cents?: number | null
          platform_fee_from_customer?: number | null
          platform_fee_from_vendor?: number | null
          projected_margin_cents?: number | null
          promo_code?: string | null
          ready_at?: string | null
          reason_for_cancel?: string | null
          refund_amount_cents?: number | null
          refund_reason?: string | null
          refund_status?: string | null
          refunded_at?: string | null
          rider_base_fee?: number | null
          rider_distance_fee?: number | null
          rider_id?: string | null
          rider_location?: string | null
          rider_payout_amount?: number | null
          rider_tip?: number | null
          rider_total_fee?: number | null
          service_fee?: number | null
          status?: string | null
          storefront_id?: string | null
          stripe_application_fee_amount?: number | null
          stripe_charge_id?: string | null
          stripe_payment_intent_id?: string | null
          stripe_payment_method_id?: string | null
          stripe_payment_status?: string | null
          subtotal?: number | null
          surplus?: number | null
          total_paid?: number | null
          transfer_scheduled_at?: string | null
          transfers_completed_at?: string | null
          transfers_created?: boolean | null
          updated_at?: string | null
          vendor_accepted?: boolean | null
          vendor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "orders_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_delivery_address_id_fkey"
            columns: ["delivery_address_id"]
            isOneToOne: false
            referencedRelation: "user_addresses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_delivery_batch_id_fkey"
            columns: ["delivery_batch_id"]
            isOneToOne: false
            referencedRelation: "delivery_batches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_delivery_method_id_fkey"
            columns: ["delivery_method_id"]
            isOneToOne: false
            referencedRelation: "storefront_delivery_methods"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "vendor_locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_rider_id_fkey"
            columns: ["rider_id"]
            isOneToOne: false
            referencedRelation: "riders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_storefront_id_fkey"
            columns: ["storefront_id"]
            isOneToOne: false
            referencedRelation: "active_vendor_storefronts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_storefront_id_fkey"
            columns: ["storefront_id"]
            isOneToOne: false
            referencedRelation: "storefront_creation_summary"
            referencedColumns: ["storefront_id"]
          },
          {
            foreignKeyName: "orders_storefront_id_fkey"
            columns: ["storefront_id"]
            isOneToOne: false
            referencedRelation: "v_public_store_stats"
            referencedColumns: ["storefront_id"]
          },
          {
            foreignKeyName: "orders_storefront_id_fkey"
            columns: ["storefront_id"]
            isOneToOne: false
            referencedRelation: "vendor_storefronts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendor_public"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      organizations: {
        Row: {
          contact_email: string | null
          contact_phone: string | null
          created_at: string
          id: string
          is_active: boolean
          logo_path: string | null
          name: string
          owner_id: string | null
          slug: string | null
          type: string
          updated_at: string
          website: string | null
        }
        Insert: {
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          id?: string
          is_active?: boolean
          logo_path?: string | null
          name: string
          owner_id?: string | null
          slug?: string | null
          type?: string
          updated_at?: string
          website?: string | null
        }
        Update: {
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          id?: string
          is_active?: boolean
          logo_path?: string | null
          name?: string
          owner_id?: string | null
          slug?: string | null
          type?: string
          updated_at?: string
          website?: string | null
        }
        Relationships: []
      }
      payment_sessions: {
        Row: {
          amount: number | null
          created_at: string | null
          expires_at: string | null
          id: string
          metadata: Json | null
          status: number | null
          token: number | null
          updated_at: string
          user_id: string | null
          vendor_id: string | null
        }
        Insert: {
          amount?: number | null
          created_at?: string | null
          expires_at?: string | null
          id?: string
          metadata?: Json | null
          status?: number | null
          token?: number | null
          updated_at?: string
          user_id?: string | null
          vendor_id?: string | null
        }
        Update: {
          amount?: number | null
          created_at?: string | null
          expires_at?: string | null
          id?: string
          metadata?: Json | null
          status?: number | null
          token?: number | null
          updated_at?: string
          user_id?: string | null
          vendor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payment_sessions_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendor_public"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payment_sessions_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      payment_transactions: {
        Row: {
          created_at: string | null
          id: string
          order_id: number | null
          payment_intent_id: string | null
          rider_transfer_id: string | null
          status: string | null
          updated_at: string | null
          user_id: string | null
          vendor_transfer_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          order_id?: number | null
          payment_intent_id?: string | null
          rider_transfer_id?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
          vendor_transfer_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          order_id?: number | null
          payment_intent_id?: string | null
          rider_transfer_id?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
          vendor_transfer_id?: string | null
        }
        Relationships: []
      }
      pending_rider_payments: {
        Row: {
          amount: number | null
          created_at: string | null
          id: string
          order_id: number | null
          paid_at: string | null
          payment_intent_id: string | null
          status: string | null
          updated_at: string
        }
        Insert: {
          amount?: number | null
          created_at?: string | null
          id?: string
          order_id?: number | null
          paid_at?: string | null
          payment_intent_id?: string | null
          status?: string | null
          updated_at?: string
        }
        Update: {
          amount?: number | null
          created_at?: string | null
          id?: string
          order_id?: number | null
          paid_at?: string | null
          payment_intent_id?: string | null
          status?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      platform_fees: {
        Row: {
          active: boolean
          amount_cents: number
          created_at: string
          description: string | null
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          active?: boolean
          amount_cents?: number
          created_at?: string
          description?: string | null
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          active?: boolean
          amount_cents?: number
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      platform_instructions: {
        Row: {
          audience: string
          card_order: number
          category: string
          category_color: string | null
          category_icon: string | null
          category_order: number
          coming_soon: boolean
          created_at: string
          cta_href_web: string | null
          cta_label: string
          cta_route_mobile: string | null
          description: string
          id: string
          is_published: boolean
          key_points: Json
          note: string | null
          secondary_cta_href_web: string | null
          secondary_cta_label: string | null
          secondary_cta_route_mobile: string | null
          slug: string
          subtitle: string | null
          title: string
          updated_at: string
          video_url: string | null
        }
        Insert: {
          audience: string
          card_order?: number
          category: string
          category_color?: string | null
          category_icon?: string | null
          category_order?: number
          coming_soon?: boolean
          created_at?: string
          cta_href_web?: string | null
          cta_label: string
          cta_route_mobile?: string | null
          description: string
          id?: string
          is_published?: boolean
          key_points?: Json
          note?: string | null
          secondary_cta_href_web?: string | null
          secondary_cta_label?: string | null
          secondary_cta_route_mobile?: string | null
          slug: string
          subtitle?: string | null
          title: string
          updated_at?: string
          video_url?: string | null
        }
        Update: {
          audience?: string
          card_order?: number
          category?: string
          category_color?: string | null
          category_icon?: string | null
          category_order?: number
          coming_soon?: boolean
          created_at?: string
          cta_href_web?: string | null
          cta_label?: string
          cta_route_mobile?: string | null
          description?: string
          id?: string
          is_published?: boolean
          key_points?: Json
          note?: string | null
          secondary_cta_href_web?: string | null
          secondary_cta_label?: string | null
          secondary_cta_route_mobile?: string | null
          slug?: string
          subtitle?: string | null
          title?: string
          updated_at?: string
          video_url?: string | null
        }
        Relationships: []
      }
      platform_listing_signals: {
        Row: {
          area_slug: string
          cuisines: string[] | null
          eta_minutes: number | null
          external_name: string
          first_seen_at: string
          id: string
          is_open_now: boolean | null
          is_promoted: boolean
          last_seen_at: string
          listing_url: string
          locality: string | null
          logo_url: string | null
          platform: string
          postcode: string | null
          price_range: string | null
          rail_position: number | null
          rail_title: string | null
          rating: number | null
          review_count: number | null
          storefront_id: string | null
          street_address: string | null
        }
        Insert: {
          area_slug: string
          cuisines?: string[] | null
          eta_minutes?: number | null
          external_name: string
          first_seen_at?: string
          id?: string
          is_open_now?: boolean | null
          is_promoted?: boolean
          last_seen_at?: string
          listing_url: string
          locality?: string | null
          logo_url?: string | null
          platform: string
          postcode?: string | null
          price_range?: string | null
          rail_position?: number | null
          rail_title?: string | null
          rating?: number | null
          review_count?: number | null
          storefront_id?: string | null
          street_address?: string | null
        }
        Update: {
          area_slug?: string
          cuisines?: string[] | null
          eta_minutes?: number | null
          external_name?: string
          first_seen_at?: string
          id?: string
          is_open_now?: boolean | null
          is_promoted?: boolean
          last_seen_at?: string
          listing_url?: string
          locality?: string | null
          logo_url?: string | null
          platform?: string
          postcode?: string | null
          price_range?: string | null
          rail_position?: number | null
          rail_title?: string | null
          rating?: number | null
          review_count?: number | null
          storefront_id?: string | null
          street_address?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "platform_listing_signals_storefront_id_fkey"
            columns: ["storefront_id"]
            isOneToOne: false
            referencedRelation: "active_vendor_storefronts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "platform_listing_signals_storefront_id_fkey"
            columns: ["storefront_id"]
            isOneToOne: false
            referencedRelation: "storefront_creation_summary"
            referencedColumns: ["storefront_id"]
          },
          {
            foreignKeyName: "platform_listing_signals_storefront_id_fkey"
            columns: ["storefront_id"]
            isOneToOne: false
            referencedRelation: "v_public_store_stats"
            referencedColumns: ["storefront_id"]
          },
          {
            foreignKeyName: "platform_listing_signals_storefront_id_fkey"
            columns: ["storefront_id"]
            isOneToOne: false
            referencedRelation: "vendor_storefronts"
            referencedColumns: ["id"]
          },
        ]
      }
      platform_service_areas: {
        Row: {
          active: boolean
          created_at: string
          delivery_zone: unknown
          id: string
          name: string
          region: string
          updated_at: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          delivery_zone?: unknown
          id?: string
          name: string
          region?: string
          updated_at?: string
        }
        Update: {
          active?: boolean
          created_at?: string
          delivery_zone?: unknown
          id?: string
          name?: string
          region?: string
          updated_at?: string
        }
        Relationships: []
      }
      pos_shifts: {
        Row: {
          closed_at: string | null
          closed_by: string | null
          counted_cash_cents: number | null
          expected_cash_cents: number | null
          id: string
          notes: string | null
          opened_at: string
          opened_by: string
          opening_float_cents: number
          status: Database["public"]["Enums"]["pos_shift_status"]
          terminal_location_id: string | null
          variance_cents: number | null
          vendor_id: string
        }
        Insert: {
          closed_at?: string | null
          closed_by?: string | null
          counted_cash_cents?: number | null
          expected_cash_cents?: number | null
          id?: string
          notes?: string | null
          opened_at?: string
          opened_by: string
          opening_float_cents?: number
          status?: Database["public"]["Enums"]["pos_shift_status"]
          terminal_location_id?: string | null
          variance_cents?: number | null
          vendor_id: string
        }
        Update: {
          closed_at?: string | null
          closed_by?: string | null
          counted_cash_cents?: number | null
          expected_cash_cents?: number | null
          id?: string
          notes?: string | null
          opened_at?: string
          opened_by?: string
          opening_float_cents?: number
          status?: Database["public"]["Enums"]["pos_shift_status"]
          terminal_location_id?: string | null
          variance_cents?: number | null
          vendor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "pos_shifts_terminal_location_id_fkey"
            columns: ["terminal_location_id"]
            isOneToOne: false
            referencedRelation: "terminal_locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pos_shifts_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendor_public"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pos_shifts_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      pos_transactions: {
        Row: {
          card_amount_cents: number | null
          cash_tendered_cents: number | null
          change_cents: number | null
          created_at: string
          created_by: string
          id: string
          order_id: string
          payment_method: Database["public"]["Enums"]["pos_payment_method"]
          refund_amount_cents: number | null
          refund_reason: string | null
          refund_stripe_id: string | null
          refunded_at: string | null
          shift_id: string
          stripe_payment_intent_id: string | null
          stripe_terminal_reader_id: string | null
          subtotal_cents: number
          tax_cents: number
          total_cents: number
          vendor_id: string
          void_reason: string | null
          voided_at: string | null
        }
        Insert: {
          card_amount_cents?: number | null
          cash_tendered_cents?: number | null
          change_cents?: number | null
          created_at?: string
          created_by: string
          id?: string
          order_id: string
          payment_method: Database["public"]["Enums"]["pos_payment_method"]
          refund_amount_cents?: number | null
          refund_reason?: string | null
          refund_stripe_id?: string | null
          refunded_at?: string | null
          shift_id: string
          stripe_payment_intent_id?: string | null
          stripe_terminal_reader_id?: string | null
          subtotal_cents: number
          tax_cents?: number
          total_cents: number
          vendor_id: string
          void_reason?: string | null
          voided_at?: string | null
        }
        Update: {
          card_amount_cents?: number | null
          cash_tendered_cents?: number | null
          change_cents?: number | null
          created_at?: string
          created_by?: string
          id?: string
          order_id?: string
          payment_method?: Database["public"]["Enums"]["pos_payment_method"]
          refund_amount_cents?: number | null
          refund_reason?: string | null
          refund_stripe_id?: string | null
          refunded_at?: string | null
          shift_id?: string
          stripe_payment_intent_id?: string | null
          stripe_terminal_reader_id?: string | null
          subtotal_cents?: number
          tax_cents?: number
          total_cents?: number
          vendor_id?: string
          void_reason?: string | null
          voided_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pos_transactions_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pos_transactions_shift_id_fkey"
            columns: ["shift_id"]
            isOneToOne: false
            referencedRelation: "pos_shifts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pos_transactions_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendor_public"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pos_transactions_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      price_crawl_queue: {
        Row: {
          fail_count: number
          last_fetched_at: string | null
          last_status: string | null
          next_fetch_at: string
          source_id: string
          url: string
        }
        Insert: {
          fail_count?: number
          last_fetched_at?: string | null
          last_status?: string | null
          next_fetch_at?: string
          source_id: string
          url: string
        }
        Update: {
          fail_count?: number
          last_fetched_at?: string | null
          last_status?: string | null
          next_fetch_at?: string
          source_id?: string
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "price_crawl_queue_source_id_fkey"
            columns: ["source_id"]
            isOneToOne: false
            referencedRelation: "price_sources"
            referencedColumns: ["id"]
          },
        ]
      }
      price_drop_alerts: {
        Row: {
          item_id: string
          observation_id: number
          sent_at: string
          user_id: string
        }
        Insert: {
          item_id: string
          observation_id: number
          sent_at?: string
          user_id: string
        }
        Update: {
          item_id?: string
          observation_id?: number
          sent_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "price_drop_alerts_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "price_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "price_drop_alerts_observation_id_fkey"
            columns: ["observation_id"]
            isOneToOne: false
            referencedRelation: "price_observations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "price_drop_alerts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      price_geocode_cache: {
        Row: {
          created_at: string
          lat: number | null
          lng: number | null
          query: string
        }
        Insert: {
          created_at?: string
          lat?: number | null
          lng?: number | null
          query: string
        }
        Update: {
          created_at?: string
          lat?: number | null
          lng?: number | null
          query?: string
        }
        Relationships: []
      }
      price_index_state: {
        Row: {
          key: string
          updated_at: string
          value: Json
        }
        Insert: {
          key: string
          updated_at?: string
          value?: Json
        }
        Update: {
          key?: string
          updated_at?: string
          value?: Json
        }
        Relationships: []
      }
      price_items: {
        Row: {
          brand: string | null
          category: string | null
          compare_at_cents: number | null
          currency: string
          external_id: string
          first_seen_at: string
          gtin: string | null
          id: string
          image_url: string | null
          in_stock: boolean | null
          last_changed_at: string
          last_seen_at: string
          match_key: string | null
          mpn: string | null
          price_cents: number
          rating: number | null
          removed_at: string | null
          review_count: number | null
          search: unknown
          sku: string | null
          source_id: string
          title: string
          url: string | null
          variants: Json
        }
        Insert: {
          brand?: string | null
          category?: string | null
          compare_at_cents?: number | null
          currency?: string
          external_id: string
          first_seen_at?: string
          gtin?: string | null
          id?: string
          image_url?: string | null
          in_stock?: boolean | null
          last_changed_at?: string
          last_seen_at?: string
          match_key?: string | null
          mpn?: string | null
          price_cents: number
          rating?: number | null
          removed_at?: string | null
          review_count?: number | null
          search?: unknown
          sku?: string | null
          source_id: string
          title: string
          url?: string | null
          variants?: Json
        }
        Update: {
          brand?: string | null
          category?: string | null
          compare_at_cents?: number | null
          currency?: string
          external_id?: string
          first_seen_at?: string
          gtin?: string | null
          id?: string
          image_url?: string | null
          in_stock?: boolean | null
          last_changed_at?: string
          last_seen_at?: string
          match_key?: string | null
          mpn?: string | null
          price_cents?: number
          rating?: number | null
          removed_at?: string | null
          review_count?: number | null
          search?: unknown
          sku?: string | null
          source_id?: string
          title?: string
          url?: string | null
          variants?: Json
        }
        Relationships: [
          {
            foreignKeyName: "price_items_source_id_fkey"
            columns: ["source_id"]
            isOneToOne: false
            referencedRelation: "price_sources"
            referencedColumns: ["id"]
          },
        ]
      }
      price_observations: {
        Row: {
          compare_at_cents: number | null
          id: number
          in_stock: boolean | null
          item_id: string
          observed_at: string
          price_cents: number
        }
        Insert: {
          compare_at_cents?: number | null
          id?: never
          in_stock?: boolean | null
          item_id: string
          observed_at: string
          price_cents: number
        }
        Update: {
          compare_at_cents?: number | null
          id?: never
          in_stock?: boolean | null
          item_id?: string
          observed_at?: string
          price_cents?: number
        }
        Relationships: [
          {
            foreignKeyName: "price_observations_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "price_items"
            referencedColumns: ["id"]
          },
        ]
      }
      price_sources: {
        Row: {
          address: string | null
          base_url: string | null
          city: string | null
          consecutive_failures: number
          crawl_interval_hours: number
          crawl_state: Json
          created_at: string
          email: string | null
          enabled: boolean
          hours: Json | null
          id: string
          is_food: boolean
          item_count: number
          kind: string
          last_crawled_at: string | null
          last_error: string | null
          last_status: string | null
          lat: number | null
          lease_until: string | null
          lng: number | null
          location_precision: string | null
          name: string
          next_crawl_at: string
          online_only: boolean
          phone: string | null
          platform: string | null
          rating: number | null
          review_count: number | null
          scrape_job_id: string | null
          source_key: string
          storefront_id: string | null
          updated_at: string
          whatsapp: string | null
        }
        Insert: {
          address?: string | null
          base_url?: string | null
          city?: string | null
          consecutive_failures?: number
          crawl_interval_hours?: number
          crawl_state?: Json
          created_at?: string
          email?: string | null
          enabled?: boolean
          hours?: Json | null
          id?: string
          is_food?: boolean
          item_count?: number
          kind: string
          last_crawled_at?: string | null
          last_error?: string | null
          last_status?: string | null
          lat?: number | null
          lease_until?: string | null
          lng?: number | null
          location_precision?: string | null
          name: string
          next_crawl_at?: string
          online_only?: boolean
          phone?: string | null
          platform?: string | null
          rating?: number | null
          review_count?: number | null
          scrape_job_id?: string | null
          source_key: string
          storefront_id?: string | null
          updated_at?: string
          whatsapp?: string | null
        }
        Update: {
          address?: string | null
          base_url?: string | null
          city?: string | null
          consecutive_failures?: number
          crawl_interval_hours?: number
          crawl_state?: Json
          created_at?: string
          email?: string | null
          enabled?: boolean
          hours?: Json | null
          id?: string
          is_food?: boolean
          item_count?: number
          kind?: string
          last_crawled_at?: string | null
          last_error?: string | null
          last_status?: string | null
          lat?: number | null
          lease_until?: string | null
          lng?: number | null
          location_precision?: string | null
          name?: string
          next_crawl_at?: string
          online_only?: boolean
          phone?: string | null
          platform?: string | null
          rating?: number | null
          review_count?: number | null
          scrape_job_id?: string | null
          source_key?: string
          storefront_id?: string | null
          updated_at?: string
          whatsapp?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "price_sources_scrape_job_id_fkey"
            columns: ["scrape_job_id"]
            isOneToOne: false
            referencedRelation: "mv_lead_intel_scored"
            referencedColumns: ["job_id"]
          },
          {
            foreignKeyName: "price_sources_scrape_job_id_fkey"
            columns: ["scrape_job_id"]
            isOneToOne: false
            referencedRelation: "scrape_jobs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "price_sources_scrape_job_id_fkey"
            columns: ["scrape_job_id"]
            isOneToOne: false
            referencedRelation: "scrape_jobs_dashboard"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "price_sources_scrape_job_id_fkey"
            columns: ["scrape_job_id"]
            isOneToOne: false
            referencedRelation: "v_canonical_listings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "price_sources_scrape_job_id_fkey"
            columns: ["scrape_job_id"]
            isOneToOne: false
            referencedRelation: "v_lead_intel"
            referencedColumns: ["job_id"]
          },
          {
            foreignKeyName: "price_sources_scrape_job_id_fkey"
            columns: ["scrape_job_id"]
            isOneToOne: false
            referencedRelation: "v_lead_intel_scored"
            referencedColumns: ["job_id"]
          },
          {
            foreignKeyName: "price_sources_storefront_id_fkey"
            columns: ["storefront_id"]
            isOneToOne: false
            referencedRelation: "active_vendor_storefronts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "price_sources_storefront_id_fkey"
            columns: ["storefront_id"]
            isOneToOne: false
            referencedRelation: "storefront_creation_summary"
            referencedColumns: ["storefront_id"]
          },
          {
            foreignKeyName: "price_sources_storefront_id_fkey"
            columns: ["storefront_id"]
            isOneToOne: false
            referencedRelation: "v_public_store_stats"
            referencedColumns: ["storefront_id"]
          },
          {
            foreignKeyName: "price_sources_storefront_id_fkey"
            columns: ["storefront_id"]
            isOneToOne: false
            referencedRelation: "vendor_storefronts"
            referencedColumns: ["id"]
          },
        ]
      }
      price_stock_checks: {
        Row: {
          channel: string | null
          created_at: string
          id: string
          item_id: string | null
          source_id: string
          user_id: string | null
        }
        Insert: {
          channel?: string | null
          created_at?: string
          id?: string
          item_id?: string | null
          source_id: string
          user_id?: string | null
        }
        Update: {
          channel?: string | null
          created_at?: string
          id?: string
          item_id?: string | null
          source_id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "price_stock_checks_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "price_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "price_stock_checks_source_id_fkey"
            columns: ["source_id"]
            isOneToOne: false
            referencedRelation: "price_sources"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "price_stock_checks_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      product_allergens: {
        Row: {
          allergen_id: number
          created_at: string
          product_id: string
          updated_at: string
        }
        Insert: {
          allergen_id: number
          created_at?: string
          product_id: string
          updated_at?: string
        }
        Update: {
          allergen_id?: number
          created_at?: string
          product_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_allergens_allergen_id_fkey"
            columns: ["allergen_id"]
            isOneToOne: false
            referencedRelation: "allergens"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_allergens_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_attribute_values: {
        Row: {
          attribute_id: string
          created_at: string
          product_id: string
          updated_at: string
          value: string
        }
        Insert: {
          attribute_id: string
          created_at?: string
          product_id: string
          updated_at?: string
          value: string
        }
        Update: {
          attribute_id?: string
          created_at?: string
          product_id?: string
          updated_at?: string
          value?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_attribute_values_attribute_id_fkey"
            columns: ["attribute_id"]
            isOneToOne: false
            referencedRelation: "category_attributes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_attribute_values_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_audit_logs: {
        Row: {
          action: string
          changes: Json | null
          created_at: string | null
          id: string
          product_id: string | null
          updated_at: string
          user_id: string | null
          variant_id: string | null
        }
        Insert: {
          action: string
          changes?: Json | null
          created_at?: string | null
          id?: string
          product_id?: string | null
          updated_at?: string
          user_id?: string | null
          variant_id?: string | null
        }
        Update: {
          action?: string
          changes?: Json | null
          created_at?: string | null
          id?: string
          product_id?: string | null
          updated_at?: string
          user_id?: string | null
          variant_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "product_audit_logs_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_audit_logs_variant_id_fkey"
            columns: ["variant_id"]
            isOneToOne: false
            referencedRelation: "product_variants"
            referencedColumns: ["id"]
          },
        ]
      }
      product_bundles: {
        Row: {
          active: boolean
          created_at: string
          description: string | null
          fixed_price_cents: number | null
          id: string
          name: string
          percentage: number | null
          pricing_type: string
          storefront_id: string | null
          updated_at: string
          valid_from: string
          valid_until: string | null
          vendor_id: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          description?: string | null
          fixed_price_cents?: number | null
          id?: string
          name: string
          percentage?: number | null
          pricing_type: string
          storefront_id?: string | null
          updated_at?: string
          valid_from?: string
          valid_until?: string | null
          vendor_id: string
        }
        Update: {
          active?: boolean
          created_at?: string
          description?: string | null
          fixed_price_cents?: number | null
          id?: string
          name?: string
          percentage?: number | null
          pricing_type?: string
          storefront_id?: string | null
          updated_at?: string
          valid_from?: string
          valid_until?: string | null
          vendor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_bundles_storefront_id_fkey"
            columns: ["storefront_id"]
            isOneToOne: false
            referencedRelation: "active_vendor_storefronts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_bundles_storefront_id_fkey"
            columns: ["storefront_id"]
            isOneToOne: false
            referencedRelation: "storefront_creation_summary"
            referencedColumns: ["storefront_id"]
          },
          {
            foreignKeyName: "product_bundles_storefront_id_fkey"
            columns: ["storefront_id"]
            isOneToOne: false
            referencedRelation: "v_public_store_stats"
            referencedColumns: ["storefront_id"]
          },
          {
            foreignKeyName: "product_bundles_storefront_id_fkey"
            columns: ["storefront_id"]
            isOneToOne: false
            referencedRelation: "vendor_storefronts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_bundles_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendor_public"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_bundles_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      product_categories: {
        Row: {
          category_id: string
          created_at: string
          product_id: string
          updated_at: string
        }
        Insert: {
          category_id: string
          created_at?: string
          product_id: string
          updated_at?: string
        }
        Update: {
          category_id?: string
          created_at?: string
          product_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_categories_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_categories_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_certifications: {
        Row: {
          certification_id: string
          created_at: string
          product_id: string
          updated_at: string
        }
        Insert: {
          certification_id: string
          created_at?: string
          product_id: string
          updated_at?: string
        }
        Update: {
          certification_id?: string
          created_at?: string
          product_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_certifications_certification_id_fkey"
            columns: ["certification_id"]
            isOneToOne: false
            referencedRelation: "certifications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_certifications_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_discounts: {
        Row: {
          created_at: string
          discount_type: string
          end_date: string | null
          id: string
          name: string | null
          product_id: string | null
          start_date: string | null
          updated_at: string
          value: number
          variant_id: string | null
        }
        Insert: {
          created_at?: string
          discount_type: string
          end_date?: string | null
          id?: string
          name?: string | null
          product_id?: string | null
          start_date?: string | null
          updated_at?: string
          value: number
          variant_id?: string | null
        }
        Update: {
          created_at?: string
          discount_type?: string
          end_date?: string | null
          id?: string
          name?: string | null
          product_id?: string | null
          start_date?: string | null
          updated_at?: string
          value?: number
          variant_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "product_discounts_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_discounts_variant_id_fkey"
            columns: ["variant_id"]
            isOneToOne: false
            referencedRelation: "product_variants"
            referencedColumns: ["id"]
          },
        ]
      }
      product_fetch_jobs: {
        Row: {
          completed_at: string | null
          created_at: string
          created_by: string | null
          error_message: string | null
          id: string
          metadata: Json | null
          priority: number | null
          products_found: number | null
          products_imported: number | null
          progress: number | null
          scrape_job_id: string | null
          source_type: string
          source_url: string
          started_at: string | null
          status: string
          storefront_id: string
          updated_at: string
          vendor_id: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          created_by?: string | null
          error_message?: string | null
          id?: string
          metadata?: Json | null
          priority?: number | null
          products_found?: number | null
          products_imported?: number | null
          progress?: number | null
          scrape_job_id?: string | null
          source_type: string
          source_url: string
          started_at?: string | null
          status?: string
          storefront_id: string
          updated_at?: string
          vendor_id: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          created_by?: string | null
          error_message?: string | null
          id?: string
          metadata?: Json | null
          priority?: number | null
          products_found?: number | null
          products_imported?: number | null
          progress?: number | null
          scrape_job_id?: string | null
          source_type?: string
          source_url?: string
          started_at?: string | null
          status?: string
          storefront_id?: string
          updated_at?: string
          vendor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_fetch_jobs_scrape_job_id_fkey"
            columns: ["scrape_job_id"]
            isOneToOne: false
            referencedRelation: "mv_lead_intel_scored"
            referencedColumns: ["job_id"]
          },
          {
            foreignKeyName: "product_fetch_jobs_scrape_job_id_fkey"
            columns: ["scrape_job_id"]
            isOneToOne: false
            referencedRelation: "scrape_jobs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_fetch_jobs_scrape_job_id_fkey"
            columns: ["scrape_job_id"]
            isOneToOne: false
            referencedRelation: "scrape_jobs_dashboard"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_fetch_jobs_scrape_job_id_fkey"
            columns: ["scrape_job_id"]
            isOneToOne: false
            referencedRelation: "v_canonical_listings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_fetch_jobs_scrape_job_id_fkey"
            columns: ["scrape_job_id"]
            isOneToOne: false
            referencedRelation: "v_lead_intel"
            referencedColumns: ["job_id"]
          },
          {
            foreignKeyName: "product_fetch_jobs_scrape_job_id_fkey"
            columns: ["scrape_job_id"]
            isOneToOne: false
            referencedRelation: "v_lead_intel_scored"
            referencedColumns: ["job_id"]
          },
          {
            foreignKeyName: "product_fetch_jobs_storefront_id_fkey"
            columns: ["storefront_id"]
            isOneToOne: false
            referencedRelation: "active_vendor_storefronts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_fetch_jobs_storefront_id_fkey"
            columns: ["storefront_id"]
            isOneToOne: false
            referencedRelation: "storefront_creation_summary"
            referencedColumns: ["storefront_id"]
          },
          {
            foreignKeyName: "product_fetch_jobs_storefront_id_fkey"
            columns: ["storefront_id"]
            isOneToOne: false
            referencedRelation: "v_public_store_stats"
            referencedColumns: ["storefront_id"]
          },
          {
            foreignKeyName: "product_fetch_jobs_storefront_id_fkey"
            columns: ["storefront_id"]
            isOneToOne: false
            referencedRelation: "vendor_storefronts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_fetch_jobs_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendor_public"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_fetch_jobs_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      product_images: {
        Row: {
          created_at: string | null
          id: string
          is_primary: boolean | null
          order_index: number | null
          path: string | null
          product_id: string | null
          updated_at: string | null
          variant_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_primary?: boolean | null
          order_index?: number | null
          path?: string | null
          product_id?: string | null
          updated_at?: string | null
          variant_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_primary?: boolean | null
          order_index?: number | null
          path?: string | null
          product_id?: string | null
          updated_at?: string | null
          variant_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "product_images_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_images_variant_id_fkey"
            columns: ["variant_id"]
            isOneToOne: false
            referencedRelation: "product_variants"
            referencedColumns: ["id"]
          },
        ]
      }
      product_ingredients: {
        Row: {
          created_at: string
          ingredient_id: number
          product_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          ingredient_id: number
          product_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          ingredient_id?: number
          product_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_ingredients_ingredient_id_fkey"
            columns: ["ingredient_id"]
            isOneToOne: false
            referencedRelation: "ingredients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_ingredients_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_inventory: {
        Row: {
          created_at: string
          current_stock: number | null
          location_id: string
          low_stock_threshold: number
          product_id: string
          storefront_id: string
          updated_at: string
          variant_id: string
        }
        Insert: {
          created_at?: string
          current_stock?: number | null
          location_id: string
          low_stock_threshold?: number
          product_id: string
          storefront_id: string
          updated_at?: string
          variant_id: string
        }
        Update: {
          created_at?: string
          current_stock?: number | null
          location_id?: string
          low_stock_threshold?: number
          product_id?: string
          storefront_id?: string
          updated_at?: string
          variant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_inventory_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "vendor_locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_inventory_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_inventory_storefront_id_fkey"
            columns: ["storefront_id"]
            isOneToOne: false
            referencedRelation: "active_vendor_storefronts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_inventory_storefront_id_fkey"
            columns: ["storefront_id"]
            isOneToOne: false
            referencedRelation: "storefront_creation_summary"
            referencedColumns: ["storefront_id"]
          },
          {
            foreignKeyName: "product_inventory_storefront_id_fkey"
            columns: ["storefront_id"]
            isOneToOne: false
            referencedRelation: "v_public_store_stats"
            referencedColumns: ["storefront_id"]
          },
          {
            foreignKeyName: "product_inventory_storefront_id_fkey"
            columns: ["storefront_id"]
            isOneToOne: false
            referencedRelation: "vendor_storefronts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_inventory_variant_id_fkey"
            columns: ["variant_id"]
            isOneToOne: false
            referencedRelation: "product_variants"
            referencedColumns: ["id"]
          },
        ]
      }
      product_media: {
        Row: {
          created_at: string
          id: string
          is_primary: boolean | null
          media_type: string
          product_id: string | null
          sort_order: number | null
          updated_at: string
          url: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_primary?: boolean | null
          media_type: string
          product_id?: string | null
          sort_order?: number | null
          updated_at?: string
          url: string
        }
        Update: {
          created_at?: string
          id?: string
          is_primary?: boolean | null
          media_type?: string
          product_id?: string | null
          sort_order?: number | null
          updated_at?: string
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_media_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_questions: {
        Row: {
          answer: string | null
          answered_at: string | null
          created_at: string | null
          id: string
          product_id: string | null
          question: string
          updated_at: string
          user_id: string
        }
        Insert: {
          answer?: string | null
          answered_at?: string | null
          created_at?: string | null
          id?: string
          product_id?: string | null
          question: string
          updated_at?: string
          user_id: string
        }
        Update: {
          answer?: string | null
          answered_at?: string | null
          created_at?: string | null
          id?: string
          product_id?: string | null
          question?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_questions_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_ratings: {
        Row: {
          comment: string | null
          created_at: string | null
          id: string
          product_id: string | null
          rating: number | null
          thumbs_down: number | null
          thumbs_up: number | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          comment?: string | null
          created_at?: string | null
          id?: string
          product_id?: string | null
          rating?: number | null
          thumbs_down?: number | null
          thumbs_up?: number | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          comment?: string | null
          created_at?: string | null
          id?: string
          product_id?: string | null
          rating?: number | null
          thumbs_down?: number | null
          thumbs_up?: number | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "product_ratings_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_ratings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      product_return_policies: {
        Row: {
          created_at: string | null
          custom_notes: string | null
          id: string
          policy_id: string
          product_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          custom_notes?: string | null
          id?: string
          policy_id: string
          product_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          custom_notes?: string | null
          id?: string
          policy_id?: string
          product_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "product_return_policies_policy_id_fkey"
            columns: ["policy_id"]
            isOneToOne: false
            referencedRelation: "return_policies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_return_policies_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: true
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_stock_logs: {
        Row: {
          change: number
          created_at: string | null
          id: string
          product_id: string | null
          reason: string | null
          updated_at: string
          variant_id: string | null
        }
        Insert: {
          change: number
          created_at?: string | null
          id?: string
          product_id?: string | null
          reason?: string | null
          updated_at?: string
          variant_id?: string | null
        }
        Update: {
          change?: number
          created_at?: string | null
          id?: string
          product_id?: string | null
          reason?: string | null
          updated_at?: string
          variant_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "product_stock_logs_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_stock_logs_variant_id_fkey"
            columns: ["variant_id"]
            isOneToOne: false
            referencedRelation: "product_variants"
            referencedColumns: ["id"]
          },
        ]
      }
      product_tag_values: {
        Row: {
          created_at: string
          product_id: string
          tag_id: string
          updated_at: string
          value: string
        }
        Insert: {
          created_at?: string
          product_id: string
          tag_id: string
          updated_at?: string
          value: string
        }
        Update: {
          created_at?: string
          product_id?: string
          tag_id?: string
          updated_at?: string
          value?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_tag_values_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_tag_values_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "category_tags"
            referencedColumns: ["id"]
          },
        ]
      }
      product_tags: {
        Row: {
          created_at: string
          product_id: string
          tag_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          product_id: string
          tag_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          product_id?: string
          tag_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_tags_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_tags_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "tags"
            referencedColumns: ["id"]
          },
        ]
      }
      product_variants: {
        Row: {
          barcode: string | null
          created_at: string | null
          current_stock: number | null
          dependencies: Json | null
          id: string
          is_active: boolean | null
          is_default: boolean | null
          max_per_order: number | null
          name: string | null
          price_adjustment: number | null
          product_id: string | null
          requires_id: boolean | null
          sku: string | null
          thumbnail: string | null
          track_stock: boolean | null
          updated_at: string | null
        }
        Insert: {
          barcode?: string | null
          created_at?: string | null
          current_stock?: number | null
          dependencies?: Json | null
          id?: string
          is_active?: boolean | null
          is_default?: boolean | null
          max_per_order?: number | null
          name?: string | null
          price_adjustment?: number | null
          product_id?: string | null
          requires_id?: boolean | null
          sku?: string | null
          thumbnail?: string | null
          track_stock?: boolean | null
          updated_at?: string | null
        }
        Update: {
          barcode?: string | null
          created_at?: string | null
          current_stock?: number | null
          dependencies?: Json | null
          id?: string
          is_active?: boolean | null
          is_default?: boolean | null
          max_per_order?: number | null
          name?: string | null
          price_adjustment?: number | null
          product_id?: string | null
          requires_id?: boolean | null
          sku?: string | null
          thumbnail?: string | null
          track_stock?: boolean | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "product_variants_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_warranties: {
        Row: {
          created_at: string
          id: string
          product_id: string | null
          updated_at: string
          warranty_period: number | null
          warranty_terms: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          product_id?: string | null
          updated_at?: string
          warranty_period?: number | null
          warranty_terms?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          product_id?: string | null
          updated_at?: string
          warranty_period?: number | null
          warranty_terms?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "product_warranties_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          allergens: Json | null
          barcode: string | null
          base_price: number | null
          category_id: string | null
          compare_at_price: number | null
          country_of_origin: string | null
          created_at: string | null
          created_by: string | null
          current_stock: number | null
          description: string | null
          dietary_tags: string[] | null
          has_variants: boolean | null
          id: string
          image_source: string | null
          in_store_location: string | null
          ingredients: Json | null
          is_eighteen_plus: boolean | null
          is_featured: boolean | null
          is_live: boolean | null
          is_manufactured: boolean | null
          is_on_sale: boolean | null
          is_out_of_stock: boolean | null
          manufacturer: string | null
          modifier_groups: Json | null
          name: string | null
          nutrition_basis: string | null
          nutrition_carbs_g: number | null
          nutrition_estimated_at: string | null
          nutrition_fat_g: number | null
          nutrition_kcal: number | null
          nutrition_protein_g: number | null
          nutrition_source: string | null
          slug: string | null
          storefront_id: string | null
          thumbnail: string | null
          track_stock: boolean | null
          updated_at: string | null
          vendor_id: string | null
        }
        Insert: {
          allergens?: Json | null
          barcode?: string | null
          base_price?: number | null
          category_id?: string | null
          compare_at_price?: number | null
          country_of_origin?: string | null
          created_at?: string | null
          created_by?: string | null
          current_stock?: number | null
          description?: string | null
          dietary_tags?: string[] | null
          has_variants?: boolean | null
          id?: string
          image_source?: string | null
          in_store_location?: string | null
          ingredients?: Json | null
          is_eighteen_plus?: boolean | null
          is_featured?: boolean | null
          is_live?: boolean | null
          is_manufactured?: boolean | null
          is_on_sale?: boolean | null
          is_out_of_stock?: boolean | null
          manufacturer?: string | null
          modifier_groups?: Json | null
          name?: string | null
          nutrition_basis?: string | null
          nutrition_carbs_g?: number | null
          nutrition_estimated_at?: string | null
          nutrition_fat_g?: number | null
          nutrition_kcal?: number | null
          nutrition_protein_g?: number | null
          nutrition_source?: string | null
          slug?: string | null
          storefront_id?: string | null
          thumbnail?: string | null
          track_stock?: boolean | null
          updated_at?: string | null
          vendor_id?: string | null
        }
        Update: {
          allergens?: Json | null
          barcode?: string | null
          base_price?: number | null
          category_id?: string | null
          compare_at_price?: number | null
          country_of_origin?: string | null
          created_at?: string | null
          created_by?: string | null
          current_stock?: number | null
          description?: string | null
          dietary_tags?: string[] | null
          has_variants?: boolean | null
          id?: string
          image_source?: string | null
          in_store_location?: string | null
          ingredients?: Json | null
          is_eighteen_plus?: boolean | null
          is_featured?: boolean | null
          is_live?: boolean | null
          is_manufactured?: boolean | null
          is_on_sale?: boolean | null
          is_out_of_stock?: boolean | null
          manufacturer?: string | null
          modifier_groups?: Json | null
          name?: string | null
          nutrition_basis?: string | null
          nutrition_carbs_g?: number | null
          nutrition_estimated_at?: string | null
          nutrition_fat_g?: number | null
          nutrition_kcal?: number | null
          nutrition_protein_g?: number | null
          nutrition_source?: string | null
          slug?: string | null
          storefront_id?: string | null
          thumbnail?: string | null
          track_stock?: boolean | null
          updated_at?: string | null
          vendor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "products_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_storefront_id_fkey"
            columns: ["storefront_id"]
            isOneToOne: false
            referencedRelation: "active_vendor_storefronts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_storefront_id_fkey"
            columns: ["storefront_id"]
            isOneToOne: false
            referencedRelation: "storefront_creation_summary"
            referencedColumns: ["storefront_id"]
          },
          {
            foreignKeyName: "products_storefront_id_fkey"
            columns: ["storefront_id"]
            isOneToOne: false
            referencedRelation: "v_public_store_stats"
            referencedColumns: ["storefront_id"]
          },
          {
            foreignKeyName: "products_storefront_id_fkey"
            columns: ["storefront_id"]
            isOneToOne: false
            referencedRelation: "vendor_storefronts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendor_public"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      promo_code_uses: {
        Row: {
          id: string
          order_id: string | null
          promo_code_id: string
          used_at: string
          user_id: string
        }
        Insert: {
          id?: string
          order_id?: string | null
          promo_code_id: string
          used_at?: string
          user_id: string
        }
        Update: {
          id?: string
          order_id?: string | null
          promo_code_id?: string
          used_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "promo_code_uses_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "promo_code_uses_promo_code_id_fkey"
            columns: ["promo_code_id"]
            isOneToOne: false
            referencedRelation: "promo_codes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "promo_code_uses_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      promo_codes: {
        Row: {
          active: boolean
          amount_cents: number | null
          code: string
          created_at: string
          description: string | null
          discount_type: string
          first_order_only: boolean
          id: string
          max_discount_cents: number | null
          max_uses: number | null
          max_uses_per_user: number | null
          min_order_cents: number
          percentage: number | null
          storefront_id: string | null
          uses_count: number
          valid_from: string
          valid_until: string | null
          vendor_id: string | null
        }
        Insert: {
          active?: boolean
          amount_cents?: number | null
          code: string
          created_at?: string
          description?: string | null
          discount_type: string
          first_order_only?: boolean
          id?: string
          max_discount_cents?: number | null
          max_uses?: number | null
          max_uses_per_user?: number | null
          min_order_cents?: number
          percentage?: number | null
          storefront_id?: string | null
          uses_count?: number
          valid_from?: string
          valid_until?: string | null
          vendor_id?: string | null
        }
        Update: {
          active?: boolean
          amount_cents?: number | null
          code?: string
          created_at?: string
          description?: string | null
          discount_type?: string
          first_order_only?: boolean
          id?: string
          max_discount_cents?: number | null
          max_uses?: number | null
          max_uses_per_user?: number | null
          min_order_cents?: number
          percentage?: number | null
          storefront_id?: string | null
          uses_count?: number
          valid_from?: string
          valid_until?: string | null
          vendor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "promo_codes_storefront_id_fkey"
            columns: ["storefront_id"]
            isOneToOne: false
            referencedRelation: "active_vendor_storefronts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "promo_codes_storefront_id_fkey"
            columns: ["storefront_id"]
            isOneToOne: false
            referencedRelation: "storefront_creation_summary"
            referencedColumns: ["storefront_id"]
          },
          {
            foreignKeyName: "promo_codes_storefront_id_fkey"
            columns: ["storefront_id"]
            isOneToOne: false
            referencedRelation: "v_public_store_stats"
            referencedColumns: ["storefront_id"]
          },
          {
            foreignKeyName: "promo_codes_storefront_id_fkey"
            columns: ["storefront_id"]
            isOneToOne: false
            referencedRelation: "vendor_storefronts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "promo_codes_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendor_public"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "promo_codes_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      purchase_order_items: {
        Row: {
          created_at: string
          id: string
          name: string
          position: number
          product_id: string | null
          purchase_order_id: string
          quantity: number
          received_quantity: number
          unit: string | null
          unit_cost: number | null
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          position?: number
          product_id?: string | null
          purchase_order_id: string
          quantity: number
          received_quantity?: number
          unit?: string | null
          unit_cost?: number | null
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          position?: number
          product_id?: string | null
          purchase_order_id?: string
          quantity?: number
          received_quantity?: number
          unit?: string | null
          unit_cost?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "purchase_order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchase_order_items_purchase_order_id_fkey"
            columns: ["purchase_order_id"]
            isOneToOne: false
            referencedRelation: "purchase_orders"
            referencedColumns: ["id"]
          },
        ]
      }
      purchase_orders: {
        Row: {
          cancelled_at: string | null
          created_at: string
          created_by: string | null
          expected_on: string | null
          id: string
          notes: string | null
          po_number: number
          received_at: string | null
          sent_at: string | null
          status: string
          subtotal: number
          supplier_id: string
          updated_at: string
          vendor_id: string
        }
        Insert: {
          cancelled_at?: string | null
          created_at?: string
          created_by?: string | null
          expected_on?: string | null
          id?: string
          notes?: string | null
          po_number?: number
          received_at?: string | null
          sent_at?: string | null
          status?: string
          subtotal?: number
          supplier_id: string
          updated_at?: string
          vendor_id: string
        }
        Update: {
          cancelled_at?: string | null
          created_at?: string
          created_by?: string | null
          expected_on?: string | null
          id?: string
          notes?: string | null
          po_number?: number
          received_at?: string | null
          sent_at?: string | null
          status?: string
          subtotal?: number
          supplier_id?: string
          updated_at?: string
          vendor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "purchase_orders_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "vendor_suppliers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchase_orders_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendor_public"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchase_orders_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      realnumber_waitlist: {
        Row: {
          area: string | null
          created_at: string
          email: string
          id: string
          referrer: string | null
          source: string | null
          utm: Json | null
        }
        Insert: {
          area?: string | null
          created_at?: string
          email: string
          id?: string
          referrer?: string | null
          source?: string | null
          utm?: Json | null
        }
        Update: {
          area?: string | null
          created_at?: string
          email?: string
          id?: string
          referrer?: string | null
          source?: string | null
          utm?: Json | null
        }
        Relationships: []
      }
      refund_request_items: {
        Row: {
          created_at: string | null
          id: string
          item_reason: string | null
          order_item_id: string | null
          product_name: string
          quantity: number
          refund_amount_cents: number
          refund_request_id: string | null
          unit_price_cents: number
          updated_at: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          item_reason?: string | null
          order_item_id?: string | null
          product_name: string
          quantity: number
          refund_amount_cents: number
          refund_request_id?: string | null
          unit_price_cents: number
          updated_at?: string
        }
        Update: {
          created_at?: string | null
          id?: string
          item_reason?: string | null
          order_item_id?: string | null
          product_name?: string
          quantity?: number
          refund_amount_cents?: number
          refund_request_id?: string | null
          unit_price_cents?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "refund_request_items_order_item_id_fkey"
            columns: ["order_item_id"]
            isOneToOne: false
            referencedRelation: "order_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "refund_request_items_refund_request_id_fkey"
            columns: ["refund_request_id"]
            isOneToOne: false
            referencedRelation: "refund_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      refund_requests: {
        Row: {
          admin_notes: string | null
          approved_amount_cents: number | null
          auto_approved: boolean | null
          created_at: string | null
          description: string | null
          id: string
          order_id: string | null
          processed_at: string | null
          proof_images: string[] | null
          reason: string
          reason_category: string | null
          requested_amount_cents: number | null
          reviewed_at: string | null
          reviewed_by: string | null
          status: string | null
          stripe_refund_id: string | null
          updated_at: string | null
          user_id: string | null
          vendor_order_id: string | null
        }
        Insert: {
          admin_notes?: string | null
          approved_amount_cents?: number | null
          auto_approved?: boolean | null
          created_at?: string | null
          description?: string | null
          id?: string
          order_id?: string | null
          processed_at?: string | null
          proof_images?: string[] | null
          reason: string
          reason_category?: string | null
          requested_amount_cents?: number | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string | null
          stripe_refund_id?: string | null
          updated_at?: string | null
          user_id?: string | null
          vendor_order_id?: string | null
        }
        Update: {
          admin_notes?: string | null
          approved_amount_cents?: number | null
          auto_approved?: boolean | null
          created_at?: string | null
          description?: string | null
          id?: string
          order_id?: string | null
          processed_at?: string | null
          proof_images?: string[] | null
          reason?: string
          reason_category?: string | null
          requested_amount_cents?: number | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string | null
          stripe_refund_id?: string | null
          updated_at?: string | null
          user_id?: string | null
          vendor_order_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "refund_requests_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "refund_requests_reviewed_by_fkey"
            columns: ["reviewed_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "refund_requests_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "refund_requests_vendor_order_id_fkey"
            columns: ["vendor_order_id"]
            isOneToOne: false
            referencedRelation: "vendor_orders"
            referencedColumns: ["id"]
          },
        ]
      }
      related_products: {
        Row: {
          created_at: string
          product_id: string
          related_product_id: string
          relation_type: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          product_id: string
          related_product_id: string
          relation_type?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          product_id?: string
          related_product_id?: string
          relation_type?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "related_products_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "related_products_related_product_id_fkey"
            columns: ["related_product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      return_policies: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          name: string
          policy_text: string
          return_period_days: number | null
          sort_order: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          policy_text: string
          return_period_days?: number | null
          sort_order?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          policy_text?: string
          return_period_days?: number | null
          sort_order?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      rider_app_changelogs: {
        Row: {
          changes: Json
          created_at: string | null
          description: string | null
          id: string
          is_published: boolean | null
          platform: string | null
          release_date: string
          title: string
          updated_at: string
          version: string
        }
        Insert: {
          changes: Json
          created_at?: string | null
          description?: string | null
          id?: string
          is_published?: boolean | null
          platform?: string | null
          release_date: string
          title: string
          updated_at?: string
          version: string
        }
        Update: {
          changes?: Json
          created_at?: string | null
          description?: string | null
          id?: string
          is_published?: boolean | null
          platform?: string | null
          release_date?: string
          title?: string
          updated_at?: string
          version?: string
        }
        Relationships: []
      }
      rider_documents: {
        Row: {
          created_at: string
          doc_type: string
          expiry_date: string | null
          id: string
          rejection_reason: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          rider_id: string
          side: string
          status: string
          storage_path: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          doc_type: string
          expiry_date?: string | null
          id?: string
          rejection_reason?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          rider_id: string
          side?: string
          status?: string
          storage_path: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          doc_type?: string
          expiry_date?: string | null
          id?: string
          rejection_reason?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          rider_id?: string
          side?: string
          status?: string
          storage_path?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "rider_documents_rider_id_fkey"
            columns: ["rider_id"]
            isOneToOne: false
            referencedRelation: "riders"
            referencedColumns: ["id"]
          },
        ]
      }
      rider_notification_settings: {
        Row: {
          created_at: string | null
          delivery_updates: boolean | null
          id: string
          payment_received: boolean | null
          security_alerts: boolean | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          delivery_updates?: boolean | null
          id?: string
          payment_received?: boolean | null
          security_alerts?: boolean | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          delivery_updates?: boolean | null
          id?: string
          payment_received?: boolean | null
          security_alerts?: boolean | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      rider_payment_config: {
        Row: {
          active: boolean | null
          base_pay_cents: number
          batch_additional_stop_cents: number
          created_at: string | null
          id: string
          max_pay_cents: number
          min_pay_cents: number
          per_km_cents: number
          per_minute_cents: number
          region: string
          updated_at: string | null
        }
        Insert: {
          active?: boolean | null
          base_pay_cents?: number
          batch_additional_stop_cents?: number
          created_at?: string | null
          id?: string
          max_pay_cents?: number
          min_pay_cents?: number
          per_km_cents?: number
          per_minute_cents?: number
          region?: string
          updated_at?: string | null
        }
        Update: {
          active?: boolean | null
          base_pay_cents?: number
          batch_additional_stop_cents?: number
          created_at?: string | null
          id?: string
          max_pay_cents?: number
          min_pay_cents?: number
          per_km_cents?: number
          per_minute_cents?: number
          region?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      rider_referral_earnings: {
        Row: {
          amount_cents: number
          created_at: string
          id: string
          order_id: string
          paid_at: string | null
          referred_rider_id: string
          referrer_rider_id: string
          stripe_transfer_id: string | null
        }
        Insert: {
          amount_cents: number
          created_at?: string
          id?: string
          order_id: string
          paid_at?: string | null
          referred_rider_id: string
          referrer_rider_id: string
          stripe_transfer_id?: string | null
        }
        Update: {
          amount_cents?: number
          created_at?: string
          id?: string
          order_id?: string
          paid_at?: string | null
          referred_rider_id?: string
          referrer_rider_id?: string
          stripe_transfer_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "rider_referral_earnings_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rider_referral_earnings_referred_rider_id_fkey"
            columns: ["referred_rider_id"]
            isOneToOne: false
            referencedRelation: "riders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rider_referral_earnings_referrer_rider_id_fkey"
            columns: ["referrer_rider_id"]
            isOneToOne: false
            referencedRelation: "riders"
            referencedColumns: ["id"]
          },
        ]
      }
      rider_sessions: {
        Row: {
          created_at: string
          ended_at: string | null
          id: string
          rider_id: string | null
          start_point: unknown
          started_at: string | null
          updated_at: string
          zone_id: string | null
        }
        Insert: {
          created_at?: string
          ended_at?: string | null
          id?: string
          rider_id?: string | null
          start_point?: unknown
          started_at?: string | null
          updated_at?: string
          zone_id?: string | null
        }
        Update: {
          created_at?: string
          ended_at?: string | null
          id?: string
          rider_id?: string | null
          start_point?: unknown
          started_at?: string | null
          updated_at?: string
          zone_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "rider_sessions_rider_id_fkey"
            columns: ["rider_id"]
            isOneToOne: false
            referencedRelation: "riders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rider_sessions_zone_id_fkey"
            columns: ["zone_id"]
            isOneToOne: false
            referencedRelation: "delivery_zones"
            referencedColumns: ["id"]
          },
        ]
      }
      rider_transfers: {
        Row: {
          amount: number
          arrival_date: string | null
          created_at: string | null
          currency: string | null
          delivery_batch_id: string | null
          failure_code: string | null
          failure_message: string | null
          id: string
          metadata: Json | null
          order_id: string
          rider_id: string
          status: string | null
          stripe_transfer_id: string | null
          stripe_transfer_status: string | null
          transfer_date: string | null
          updated_at: string
        }
        Insert: {
          amount: number
          arrival_date?: string | null
          created_at?: string | null
          currency?: string | null
          delivery_batch_id?: string | null
          failure_code?: string | null
          failure_message?: string | null
          id?: string
          metadata?: Json | null
          order_id: string
          rider_id: string
          status?: string | null
          stripe_transfer_id?: string | null
          stripe_transfer_status?: string | null
          transfer_date?: string | null
          updated_at?: string
        }
        Update: {
          amount?: number
          arrival_date?: string | null
          created_at?: string | null
          currency?: string | null
          delivery_batch_id?: string | null
          failure_code?: string | null
          failure_message?: string | null
          id?: string
          metadata?: Json | null
          order_id?: string
          rider_id?: string
          status?: string | null
          stripe_transfer_id?: string | null
          stripe_transfer_status?: string | null
          transfer_date?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "rider_transfers_delivery_batch_id_fkey"
            columns: ["delivery_batch_id"]
            isOneToOne: false
            referencedRelation: "delivery_batches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rider_transfers_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rider_transfers_rider_id_fkey"
            columns: ["rider_id"]
            isOneToOne: false
            referencedRelation: "riders"
            referencedColumns: ["id"]
          },
        ]
      }
      rider_trust_metrics: {
        Row: {
          average_delivery_time_mins: number | null
          average_rating: number | null
          cancelled_deliveries: number | null
          complaint_count: number | null
          completed_deliveries: number | null
          created_at: string | null
          flags: Json | null
          id: string
          incident_count: number | null
          on_time_rate: number | null
          rider_id: string | null
          total_deliveries: number | null
          total_earnings_cents: number | null
          trust_score: number | null
          updated_at: string | null
        }
        Insert: {
          average_delivery_time_mins?: number | null
          average_rating?: number | null
          cancelled_deliveries?: number | null
          complaint_count?: number | null
          completed_deliveries?: number | null
          created_at?: string | null
          flags?: Json | null
          id?: string
          incident_count?: number | null
          on_time_rate?: number | null
          rider_id?: string | null
          total_deliveries?: number | null
          total_earnings_cents?: number | null
          trust_score?: number | null
          updated_at?: string | null
        }
        Update: {
          average_delivery_time_mins?: number | null
          average_rating?: number | null
          cancelled_deliveries?: number | null
          complaint_count?: number | null
          completed_deliveries?: number | null
          created_at?: string | null
          flags?: Json | null
          id?: string
          incident_count?: number | null
          on_time_rate?: number | null
          rider_id?: string | null
          total_deliveries?: number | null
          total_earnings_cents?: number | null
          trust_score?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "rider_trust_metrics_rider_id_fkey"
            columns: ["rider_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      riders: {
        Row: {
          accept_rate: number | null
          anonymized_at: string | null
          avg_response_time_seconds: number | null
          bank_account_bank_name: string | null
          bank_account_holder_name: string | null
          bank_account_last4: string | null
          bank_iban: string | null
          created_at: string | null
          current_lat: number | null
          current_lng: number | null
          current_location: unknown
          date_of_birth: string | null
          deleted_at: string | null
          deletion_requested: boolean | null
          deletion_requested_at: string | null
          documents_verified: boolean | null
          documents_verified_at: string | null
          email: string | null
          first_name: string | null
          home_address_line1: string | null
          home_address_line2: string | null
          home_city: string | null
          home_postal_code: string | null
          id: string
          identity_verified: boolean | null
          insurance: string | null
          insurance_certified: boolean
          insurance_certified_at: string | null
          is_live: boolean | null
          last_decline_at: string | null
          last_name: string | null
          last_offer_at: string | null
          license_plate: string | null
          location_coordinates: string | null
          location_updated_at: string | null
          middle_name: string | null
          onboarding_completed: boolean | null
          phone_number: string | null
          ppsn: string | null
          profile_pic: string | null
          referral_code: string | null
          referred_by_rider_id: string | null
          reliability_score: number | null
          status: string | null
          stripe_account_id: string | null
          stripe_account_status: string | null
          stripe_charges_enabled: boolean | null
          stripe_connect_id: string | null
          stripe_current_deadline: string | null
          stripe_details_submitted: boolean | null
          stripe_onboarding_completed: boolean | null
          stripe_payouts_enabled: boolean | null
          stripe_requirements: Json | null
          today_declines: number | null
          today_deliveries: number | null
          today_earnings_cents: number | null
          updated_at: string | null
          user_id: string
          username: string | null
          vehicle_type: string | null
          verified_address_city: string | null
          verified_address_line1: string | null
          verified_address_postal_code: string | null
          verified_dob: string | null
          verified_document_country: string | null
          verified_document_expiry: string | null
          verified_document_type: string | null
          verified_first_name: string | null
          verified_last_name: string | null
        }
        Insert: {
          accept_rate?: number | null
          anonymized_at?: string | null
          avg_response_time_seconds?: number | null
          bank_account_bank_name?: string | null
          bank_account_holder_name?: string | null
          bank_account_last4?: string | null
          bank_iban?: string | null
          created_at?: string | null
          current_lat?: number | null
          current_lng?: number | null
          current_location?: unknown
          date_of_birth?: string | null
          deleted_at?: string | null
          deletion_requested?: boolean | null
          deletion_requested_at?: string | null
          documents_verified?: boolean | null
          documents_verified_at?: string | null
          email?: string | null
          first_name?: string | null
          home_address_line1?: string | null
          home_address_line2?: string | null
          home_city?: string | null
          home_postal_code?: string | null
          id?: string
          identity_verified?: boolean | null
          insurance?: string | null
          insurance_certified?: boolean
          insurance_certified_at?: string | null
          is_live?: boolean | null
          last_decline_at?: string | null
          last_name?: string | null
          last_offer_at?: string | null
          license_plate?: string | null
          location_coordinates?: string | null
          location_updated_at?: string | null
          middle_name?: string | null
          onboarding_completed?: boolean | null
          phone_number?: string | null
          ppsn?: string | null
          profile_pic?: string | null
          referral_code?: string | null
          referred_by_rider_id?: string | null
          reliability_score?: number | null
          status?: string | null
          stripe_account_id?: string | null
          stripe_account_status?: string | null
          stripe_charges_enabled?: boolean | null
          stripe_connect_id?: string | null
          stripe_current_deadline?: string | null
          stripe_details_submitted?: boolean | null
          stripe_onboarding_completed?: boolean | null
          stripe_payouts_enabled?: boolean | null
          stripe_requirements?: Json | null
          today_declines?: number | null
          today_deliveries?: number | null
          today_earnings_cents?: number | null
          updated_at?: string | null
          user_id: string
          username?: string | null
          vehicle_type?: string | null
          verified_address_city?: string | null
          verified_address_line1?: string | null
          verified_address_postal_code?: string | null
          verified_dob?: string | null
          verified_document_country?: string | null
          verified_document_expiry?: string | null
          verified_document_type?: string | null
          verified_first_name?: string | null
          verified_last_name?: string | null
        }
        Update: {
          accept_rate?: number | null
          anonymized_at?: string | null
          avg_response_time_seconds?: number | null
          bank_account_bank_name?: string | null
          bank_account_holder_name?: string | null
          bank_account_last4?: string | null
          bank_iban?: string | null
          created_at?: string | null
          current_lat?: number | null
          current_lng?: number | null
          current_location?: unknown
          date_of_birth?: string | null
          deleted_at?: string | null
          deletion_requested?: boolean | null
          deletion_requested_at?: string | null
          documents_verified?: boolean | null
          documents_verified_at?: string | null
          email?: string | null
          first_name?: string | null
          home_address_line1?: string | null
          home_address_line2?: string | null
          home_city?: string | null
          home_postal_code?: string | null
          id?: string
          identity_verified?: boolean | null
          insurance?: string | null
          insurance_certified?: boolean
          insurance_certified_at?: string | null
          is_live?: boolean | null
          last_decline_at?: string | null
          last_name?: string | null
          last_offer_at?: string | null
          license_plate?: string | null
          location_coordinates?: string | null
          location_updated_at?: string | null
          middle_name?: string | null
          onboarding_completed?: boolean | null
          phone_number?: string | null
          ppsn?: string | null
          profile_pic?: string | null
          referral_code?: string | null
          referred_by_rider_id?: string | null
          reliability_score?: number | null
          status?: string | null
          stripe_account_id?: string | null
          stripe_account_status?: string | null
          stripe_charges_enabled?: boolean | null
          stripe_connect_id?: string | null
          stripe_current_deadline?: string | null
          stripe_details_submitted?: boolean | null
          stripe_onboarding_completed?: boolean | null
          stripe_payouts_enabled?: boolean | null
          stripe_requirements?: Json | null
          today_declines?: number | null
          today_deliveries?: number | null
          today_earnings_cents?: number | null
          updated_at?: string | null
          user_id?: string
          username?: string | null
          vehicle_type?: string | null
          verified_address_city?: string | null
          verified_address_line1?: string | null
          verified_address_postal_code?: string | null
          verified_dob?: string | null
          verified_document_country?: string | null
          verified_document_expiry?: string | null
          verified_document_type?: string | null
          verified_first_name?: string | null
          verified_last_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "riders_referred_by_rider_id_fkey"
            columns: ["referred_by_rider_id"]
            isOneToOne: false
            referencedRelation: "riders"
            referencedColumns: ["id"]
          },
        ]
      }
      saved_products: {
        Row: {
          created_at: string
          id: string
          product_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          product_id: string
          user_id?: string
        }
        Update: {
          created_at?: string
          id?: string
          product_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "saved_products_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "saved_products_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      scrape_batch_logs: {
        Row: {
          batch_date: string
          completed_at: string | null
          completed_count: number | null
          cost_estimate_cents: number | null
          created_at: string | null
          failed_count: number | null
          id: string
          started_at: string | null
          target_count: number
        }
        Insert: {
          batch_date: string
          completed_at?: string | null
          completed_count?: number | null
          cost_estimate_cents?: number | null
          created_at?: string | null
          failed_count?: number | null
          id?: string
          started_at?: string | null
          target_count?: number
        }
        Update: {
          batch_date?: string
          completed_at?: string | null
          completed_count?: number | null
          cost_estimate_cents?: number | null
          created_at?: string | null
          failed_count?: number | null
          id?: string
          started_at?: string | null
          target_count?: number
        }
        Relationships: []
      }
      scrape_discovery_targets: {
        Row: {
          active: boolean
          city: string | null
          country: string
          county: string | null
          created_at: string
          id: string
          last_result_count: number | null
          last_scraped_at: string | null
          lat: number | null
          lng: number | null
          notes: string | null
          platform: string
          priority: number
          query_template: string | null
          source: string
          tier: string
          updated_at: string
          vertical: string | null
          zone_slug: string | null
        }
        Insert: {
          active?: boolean
          city?: string | null
          country?: string
          county?: string | null
          created_at?: string
          id?: string
          last_result_count?: number | null
          last_scraped_at?: string | null
          lat?: number | null
          lng?: number | null
          notes?: string | null
          platform: string
          priority?: number
          query_template?: string | null
          source: string
          tier?: string
          updated_at?: string
          vertical?: string | null
          zone_slug?: string | null
        }
        Update: {
          active?: boolean
          city?: string | null
          country?: string
          county?: string | null
          created_at?: string
          id?: string
          last_result_count?: number | null
          last_scraped_at?: string | null
          lat?: number | null
          lng?: number | null
          notes?: string | null
          platform?: string
          priority?: number
          query_template?: string | null
          source?: string
          tier?: string
          updated_at?: string
          vertical?: string | null
          zone_slug?: string | null
        }
        Relationships: []
      }
      scrape_history: {
        Row: {
          business_name: string | null
          completed_at: string | null
          created_at: string | null
          data_extracted: Json | null
          error_message: string | null
          id: string
          location_id: string | null
          source_type: string
          source_url: string
          started_at: string | null
          status: string
          storefront_id: string | null
          user_id: string | null
          vendor_id: string | null
        }
        Insert: {
          business_name?: string | null
          completed_at?: string | null
          created_at?: string | null
          data_extracted?: Json | null
          error_message?: string | null
          id?: string
          location_id?: string | null
          source_type: string
          source_url: string
          started_at?: string | null
          status?: string
          storefront_id?: string | null
          user_id?: string | null
          vendor_id?: string | null
        }
        Update: {
          business_name?: string | null
          completed_at?: string | null
          created_at?: string | null
          data_extracted?: Json | null
          error_message?: string | null
          id?: string
          location_id?: string | null
          source_type?: string
          source_url?: string
          started_at?: string | null
          status?: string
          storefront_id?: string | null
          user_id?: string | null
          vendor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "scrape_history_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "vendor_locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "scrape_history_storefront_id_fkey"
            columns: ["storefront_id"]
            isOneToOne: false
            referencedRelation: "active_vendor_storefronts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "scrape_history_storefront_id_fkey"
            columns: ["storefront_id"]
            isOneToOne: false
            referencedRelation: "storefront_creation_summary"
            referencedColumns: ["storefront_id"]
          },
          {
            foreignKeyName: "scrape_history_storefront_id_fkey"
            columns: ["storefront_id"]
            isOneToOne: false
            referencedRelation: "v_public_store_stats"
            referencedColumns: ["storefront_id"]
          },
          {
            foreignKeyName: "scrape_history_storefront_id_fkey"
            columns: ["storefront_id"]
            isOneToOne: false
            referencedRelation: "vendor_storefronts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "scrape_history_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendor_public"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "scrape_history_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      scrape_jobs: {
        Row: {
          brand_key: string | null
          chain_blocked: boolean
          city: string | null
          claimed_at: string | null
          claimed_by_vendor_id: string | null
          completed_at: string | null
          consensus_data: Json | null
          created_at: string
          created_by: string | null
          data_confidence: number | null
          error_message: string | null
          estimated_cost_cents: number | null
          extracted_metadata: Json | null
          failed_at: string | null
          geo_point: unknown
          google_place_id: string | null
          id: string
          is_canonical: boolean | null
          last_attempt_at: string | null
          max_retries: number | null
          next_attempt_at: string | null
          notes: string | null
          phone_verified_at: string | null
          phone_verified_by: string | null
          places_data: Json | null
          places_match_confidence: number | null
          priority: number | null
          raw_html_content_type: string | null
          raw_html_size_bytes: number | null
          raw_html_storage_path: string | null
          retry_count: number | null
          scheduled_for: string | null
          scraper_agreement: number | null
          secondary_html_size_bytes: number | null
          secondary_html_storage_path: string | null
          source_type: string
          source_url: string
          started_at: string | null
          status: string
          superseded_by_id: string | null
          tags: string[] | null
          target_address: string | null
          target_store_name: string | null
          updated_at: string
          vertical: string | null
        }
        Insert: {
          brand_key?: string | null
          chain_blocked?: boolean
          city?: string | null
          claimed_at?: string | null
          claimed_by_vendor_id?: string | null
          completed_at?: string | null
          consensus_data?: Json | null
          created_at?: string
          created_by?: string | null
          data_confidence?: number | null
          error_message?: string | null
          estimated_cost_cents?: number | null
          extracted_metadata?: Json | null
          failed_at?: string | null
          geo_point?: unknown
          google_place_id?: string | null
          id?: string
          is_canonical?: boolean | null
          last_attempt_at?: string | null
          max_retries?: number | null
          next_attempt_at?: string | null
          notes?: string | null
          phone_verified_at?: string | null
          phone_verified_by?: string | null
          places_data?: Json | null
          places_match_confidence?: number | null
          priority?: number | null
          raw_html_content_type?: string | null
          raw_html_size_bytes?: number | null
          raw_html_storage_path?: string | null
          retry_count?: number | null
          scheduled_for?: string | null
          scraper_agreement?: number | null
          secondary_html_size_bytes?: number | null
          secondary_html_storage_path?: string | null
          source_type: string
          source_url: string
          started_at?: string | null
          status?: string
          superseded_by_id?: string | null
          tags?: string[] | null
          target_address?: string | null
          target_store_name?: string | null
          updated_at?: string
          vertical?: string | null
        }
        Update: {
          brand_key?: string | null
          chain_blocked?: boolean
          city?: string | null
          claimed_at?: string | null
          claimed_by_vendor_id?: string | null
          completed_at?: string | null
          consensus_data?: Json | null
          created_at?: string
          created_by?: string | null
          data_confidence?: number | null
          error_message?: string | null
          estimated_cost_cents?: number | null
          extracted_metadata?: Json | null
          failed_at?: string | null
          geo_point?: unknown
          google_place_id?: string | null
          id?: string
          is_canonical?: boolean | null
          last_attempt_at?: string | null
          max_retries?: number | null
          next_attempt_at?: string | null
          notes?: string | null
          phone_verified_at?: string | null
          phone_verified_by?: string | null
          places_data?: Json | null
          places_match_confidence?: number | null
          priority?: number | null
          raw_html_content_type?: string | null
          raw_html_size_bytes?: number | null
          raw_html_storage_path?: string | null
          retry_count?: number | null
          scheduled_for?: string | null
          scraper_agreement?: number | null
          secondary_html_size_bytes?: number | null
          secondary_html_storage_path?: string | null
          source_type?: string
          source_url?: string
          started_at?: string | null
          status?: string
          superseded_by_id?: string | null
          tags?: string[] | null
          target_address?: string | null
          target_store_name?: string | null
          updated_at?: string
          vertical?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "scrape_jobs_claimed_by_vendor_id_fkey"
            columns: ["claimed_by_vendor_id"]
            isOneToOne: false
            referencedRelation: "vendor_public"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "scrape_jobs_claimed_by_vendor_id_fkey"
            columns: ["claimed_by_vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "scrape_jobs_superseded_by_id_fkey"
            columns: ["superseded_by_id"]
            isOneToOne: false
            referencedRelation: "mv_lead_intel_scored"
            referencedColumns: ["job_id"]
          },
          {
            foreignKeyName: "scrape_jobs_superseded_by_id_fkey"
            columns: ["superseded_by_id"]
            isOneToOne: false
            referencedRelation: "scrape_jobs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "scrape_jobs_superseded_by_id_fkey"
            columns: ["superseded_by_id"]
            isOneToOne: false
            referencedRelation: "scrape_jobs_dashboard"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "scrape_jobs_superseded_by_id_fkey"
            columns: ["superseded_by_id"]
            isOneToOne: false
            referencedRelation: "v_canonical_listings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "scrape_jobs_superseded_by_id_fkey"
            columns: ["superseded_by_id"]
            isOneToOne: false
            referencedRelation: "v_lead_intel"
            referencedColumns: ["job_id"]
          },
          {
            foreignKeyName: "scrape_jobs_superseded_by_id_fkey"
            columns: ["superseded_by_id"]
            isOneToOne: false
            referencedRelation: "v_lead_intel_scored"
            referencedColumns: ["job_id"]
          },
        ]
      }
      scrape_refresh_settings: {
        Row: {
          daily_cap: number | null
          id: boolean
          paused: boolean
          stale_after_days: number | null
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          daily_cap?: number | null
          id?: boolean
          paused?: boolean
          stale_after_days?: number | null
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          daily_cap?: number | null
          id?: boolean
          paused?: boolean
          stale_after_days?: number | null
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      security_violations: {
        Row: {
          created_at: string
          device_brand: string | null
          device_id: string | null
          device_model: string | null
          id: string
          ip_address: string | null
          reason: string
          system_version: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          device_brand?: string | null
          device_id?: string | null
          device_model?: string | null
          id?: string
          ip_address?: string | null
          reason: string
          system_version?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          device_brand?: string | null
          device_id?: string | null
          device_model?: string | null
          id?: string
          ip_address?: string | null
          reason?: string
          system_version?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      seller_insights_subscribers: {
        Row: {
          active: boolean | null
          brief_enabled: boolean | null
          business_name: string | null
          created_at: string
          email: string | null
          id: string
          job_id: string | null
          user_id: string | null
        }
        Insert: {
          active?: boolean | null
          brief_enabled?: boolean | null
          business_name?: string | null
          created_at?: string
          email?: string | null
          id?: string
          job_id?: string | null
          user_id?: string | null
        }
        Update: {
          active?: boolean | null
          brief_enabled?: boolean | null
          business_name?: string | null
          created_at?: string
          email?: string | null
          id?: string
          job_id?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      service_areas: {
        Row: {
          active: boolean
          created_at: string
          id: string
          name: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          id?: string
          name: string
        }
        Update: {
          active?: boolean
          created_at?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      service_status: {
        Row: {
          active: boolean
          affected_services: string[] | null
          created_at: string
          id: string
          message: string
          override_status: string | null
          severity: string
          title: string
          updated_at: string
        }
        Insert: {
          active?: boolean
          affected_services?: string[] | null
          created_at?: string
          id?: string
          message: string
          override_status?: string | null
          severity?: string
          title: string
          updated_at?: string
        }
        Update: {
          active?: boolean
          affected_services?: string[] | null
          created_at?: string
          id?: string
          message?: string
          override_status?: string | null
          severity?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      storefront_delivery_methods: {
        Row: {
          active: boolean
          carrier_key: string | null
          counties: string[]
          created_at: string
          eta_max: number | null
          eta_min: number | null
          eta_text: string | null
          eta_unit: string | null
          fee_cents: number
          free_over_cents: number | null
          id: string
          kind: string
          name: string
          position: number
          radius_km: number | null
          regions: string[]
          storefront_id: string
          updated_at: string
        }
        Insert: {
          active?: boolean
          carrier_key?: string | null
          counties?: string[]
          created_at?: string
          eta_max?: number | null
          eta_min?: number | null
          eta_text?: string | null
          eta_unit?: string | null
          fee_cents?: number
          free_over_cents?: number | null
          id?: string
          kind?: string
          name: string
          position?: number
          radius_km?: number | null
          regions?: string[]
          storefront_id: string
          updated_at?: string
        }
        Update: {
          active?: boolean
          carrier_key?: string | null
          counties?: string[]
          created_at?: string
          eta_max?: number | null
          eta_min?: number | null
          eta_text?: string | null
          eta_unit?: string | null
          fee_cents?: number
          free_over_cents?: number | null
          id?: string
          kind?: string
          name?: string
          position?: number
          radius_km?: number | null
          regions?: string[]
          storefront_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "storefront_delivery_methods_storefront_id_fkey"
            columns: ["storefront_id"]
            isOneToOne: false
            referencedRelation: "active_vendor_storefronts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "storefront_delivery_methods_storefront_id_fkey"
            columns: ["storefront_id"]
            isOneToOne: false
            referencedRelation: "storefront_creation_summary"
            referencedColumns: ["storefront_id"]
          },
          {
            foreignKeyName: "storefront_delivery_methods_storefront_id_fkey"
            columns: ["storefront_id"]
            isOneToOne: false
            referencedRelation: "v_public_store_stats"
            referencedColumns: ["storefront_id"]
          },
          {
            foreignKeyName: "storefront_delivery_methods_storefront_id_fkey"
            columns: ["storefront_id"]
            isOneToOne: false
            referencedRelation: "vendor_storefronts"
            referencedColumns: ["id"]
          },
        ]
      }
      storefront_delivery_radius: {
        Row: {
          center_lat: number | null
          center_long: number | null
          coordinates: unknown
          created_at: string
          id: number
          radius_km: number | null
          storefront_id: string | null
          updated_at: string
        }
        Insert: {
          center_lat?: number | null
          center_long?: number | null
          coordinates?: unknown
          created_at?: string
          id?: number
          radius_km?: number | null
          storefront_id?: string | null
          updated_at?: string
        }
        Update: {
          center_lat?: number | null
          center_long?: number | null
          coordinates?: unknown
          created_at?: string
          id?: number
          radius_km?: number | null
          storefront_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "storefront_delivery_radius_storefront_id_fkey"
            columns: ["storefront_id"]
            isOneToOne: false
            referencedRelation: "active_vendor_storefronts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "storefront_delivery_radius_storefront_id_fkey"
            columns: ["storefront_id"]
            isOneToOne: false
            referencedRelation: "storefront_creation_summary"
            referencedColumns: ["storefront_id"]
          },
          {
            foreignKeyName: "storefront_delivery_radius_storefront_id_fkey"
            columns: ["storefront_id"]
            isOneToOne: false
            referencedRelation: "v_public_store_stats"
            referencedColumns: ["storefront_id"]
          },
          {
            foreignKeyName: "storefront_delivery_radius_storefront_id_fkey"
            columns: ["storefront_id"]
            isOneToOne: false
            referencedRelation: "vendor_storefronts"
            referencedColumns: ["id"]
          },
        ]
      }
      storefront_locations: {
        Row: {
          created_at: string
          is_address_public: boolean
          location_id: string
          storefront_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          is_address_public?: boolean
          location_id: string
          storefront_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          is_address_public?: boolean
          location_id?: string
          storefront_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "storefront_locations_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "vendor_locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "storefront_locations_storefront_id_fkey"
            columns: ["storefront_id"]
            isOneToOne: false
            referencedRelation: "active_vendor_storefronts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "storefront_locations_storefront_id_fkey"
            columns: ["storefront_id"]
            isOneToOne: false
            referencedRelation: "storefront_creation_summary"
            referencedColumns: ["storefront_id"]
          },
          {
            foreignKeyName: "storefront_locations_storefront_id_fkey"
            columns: ["storefront_id"]
            isOneToOne: false
            referencedRelation: "v_public_store_stats"
            referencedColumns: ["storefront_id"]
          },
          {
            foreignKeyName: "storefront_locations_storefront_id_fkey"
            columns: ["storefront_id"]
            isOneToOne: false
            referencedRelation: "vendor_storefronts"
            referencedColumns: ["id"]
          },
        ]
      }
      storefront_opening_hours: {
        Row: {
          close_time: string | null
          created_at: string | null
          day_of_week: string | null
          id: string
          is_closed: boolean | null
          open_time: string | null
          source_type: string | null
          storefront_id: string | null
          updated_at: string | null
          vendor_id: string | null
        }
        Insert: {
          close_time?: string | null
          created_at?: string | null
          day_of_week?: string | null
          id?: string
          is_closed?: boolean | null
          open_time?: string | null
          source_type?: string | null
          storefront_id?: string | null
          updated_at?: string | null
          vendor_id?: string | null
        }
        Update: {
          close_time?: string | null
          created_at?: string | null
          day_of_week?: string | null
          id?: string
          is_closed?: boolean | null
          open_time?: string | null
          source_type?: string | null
          storefront_id?: string | null
          updated_at?: string | null
          vendor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "opening_hours_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendor_public"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "opening_hours_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "storefront_opening_hours_storefront_id_fkey"
            columns: ["storefront_id"]
            isOneToOne: false
            referencedRelation: "active_vendor_storefronts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "storefront_opening_hours_storefront_id_fkey"
            columns: ["storefront_id"]
            isOneToOne: false
            referencedRelation: "storefront_creation_summary"
            referencedColumns: ["storefront_id"]
          },
          {
            foreignKeyName: "storefront_opening_hours_storefront_id_fkey"
            columns: ["storefront_id"]
            isOneToOne: false
            referencedRelation: "v_public_store_stats"
            referencedColumns: ["storefront_id"]
          },
          {
            foreignKeyName: "storefront_opening_hours_storefront_id_fkey"
            columns: ["storefront_id"]
            isOneToOne: false
            referencedRelation: "vendor_storefronts"
            referencedColumns: ["id"]
          },
        ]
      }
      storefront_promos: {
        Row: {
          created_at: string
          id: string
          image_path: string
          link_url: string | null
          position: number
          product_id: string | null
          section_id: string | null
          source_key: string
          storefront_id: string
          subtitle: string | null
          title: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          image_path: string
          link_url?: string | null
          position?: number
          product_id?: string | null
          section_id?: string | null
          source_key: string
          storefront_id: string
          subtitle?: string | null
          title?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          image_path?: string
          link_url?: string | null
          position?: number
          product_id?: string | null
          section_id?: string | null
          source_key?: string
          storefront_id?: string
          subtitle?: string | null
          title?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "storefront_promos_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "storefront_promos_section_id_fkey"
            columns: ["section_id"]
            isOneToOne: false
            referencedRelation: "storefront_sections"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "storefront_promos_storefront_id_fkey"
            columns: ["storefront_id"]
            isOneToOne: false
            referencedRelation: "active_vendor_storefronts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "storefront_promos_storefront_id_fkey"
            columns: ["storefront_id"]
            isOneToOne: false
            referencedRelation: "storefront_creation_summary"
            referencedColumns: ["storefront_id"]
          },
          {
            foreignKeyName: "storefront_promos_storefront_id_fkey"
            columns: ["storefront_id"]
            isOneToOne: false
            referencedRelation: "v_public_store_stats"
            referencedColumns: ["storefront_id"]
          },
          {
            foreignKeyName: "storefront_promos_storefront_id_fkey"
            columns: ["storefront_id"]
            isOneToOne: false
            referencedRelation: "vendor_storefronts"
            referencedColumns: ["id"]
          },
        ]
      }
      storefront_ratings: {
        Row: {
          comment: string | null
          created_at: string
          id: string
          location_id: string | null
          order_id: string | null
          storefront_id: string | null
          thumbs_down: number | null
          thumbs_up: number | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          comment?: string | null
          created_at?: string
          id?: string
          location_id?: string | null
          order_id?: string | null
          storefront_id?: string | null
          thumbs_down?: number | null
          thumbs_up?: number | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          comment?: string | null
          created_at?: string
          id?: string
          location_id?: string | null
          order_id?: string | null
          storefront_id?: string | null
          thumbs_down?: number | null
          thumbs_up?: number | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "storefront_ratings_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "vendor_locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "storefront_ratings_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "storefront_ratings_storefront_id_fkey"
            columns: ["storefront_id"]
            isOneToOne: false
            referencedRelation: "active_vendor_storefronts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "storefront_ratings_storefront_id_fkey"
            columns: ["storefront_id"]
            isOneToOne: false
            referencedRelation: "storefront_creation_summary"
            referencedColumns: ["storefront_id"]
          },
          {
            foreignKeyName: "storefront_ratings_storefront_id_fkey"
            columns: ["storefront_id"]
            isOneToOne: false
            referencedRelation: "v_public_store_stats"
            referencedColumns: ["storefront_id"]
          },
          {
            foreignKeyName: "storefront_ratings_storefront_id_fkey"
            columns: ["storefront_id"]
            isOneToOne: false
            referencedRelation: "vendor_storefronts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "storefront_ratings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      storefront_section_products: {
        Row: {
          position: number
          product_id: string
          section_id: string
        }
        Insert: {
          position?: number
          product_id: string
          section_id: string
        }
        Update: {
          position?: number
          product_id?: string
          section_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "storefront_section_products_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "storefront_section_products_section_id_fkey"
            columns: ["section_id"]
            isOneToOne: false
            referencedRelation: "storefront_sections"
            referencedColumns: ["id"]
          },
        ]
      }
      storefront_sections: {
        Row: {
          created_at: string
          id: string
          image_path: string | null
          kind: string
          position: number
          source_key: string
          storefront_id: string
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          image_path?: string | null
          kind: string
          position?: number
          source_key: string
          storefront_id: string
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          image_path?: string | null
          kind?: string
          position?: number
          source_key?: string
          storefront_id?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "storefront_sections_storefront_id_fkey"
            columns: ["storefront_id"]
            isOneToOne: false
            referencedRelation: "active_vendor_storefronts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "storefront_sections_storefront_id_fkey"
            columns: ["storefront_id"]
            isOneToOne: false
            referencedRelation: "storefront_creation_summary"
            referencedColumns: ["storefront_id"]
          },
          {
            foreignKeyName: "storefront_sections_storefront_id_fkey"
            columns: ["storefront_id"]
            isOneToOne: false
            referencedRelation: "v_public_store_stats"
            referencedColumns: ["storefront_id"]
          },
          {
            foreignKeyName: "storefront_sections_storefront_id_fkey"
            columns: ["storefront_id"]
            isOneToOne: false
            referencedRelation: "vendor_storefronts"
            referencedColumns: ["id"]
          },
        ]
      }
      stream_chat_identities: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          display_name: string
          id: string
          identity_type: string
          is_active: boolean | null
          storefront_id: string | null
          stream_user_id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          display_name: string
          id?: string
          identity_type: string
          is_active?: boolean | null
          storefront_id?: string | null
          stream_user_id: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          display_name?: string
          id?: string
          identity_type?: string
          is_active?: boolean | null
          storefront_id?: string | null
          stream_user_id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "stream_chat_identities_storefront_id_fkey"
            columns: ["storefront_id"]
            isOneToOne: false
            referencedRelation: "active_vendor_storefronts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stream_chat_identities_storefront_id_fkey"
            columns: ["storefront_id"]
            isOneToOne: false
            referencedRelation: "storefront_creation_summary"
            referencedColumns: ["storefront_id"]
          },
          {
            foreignKeyName: "stream_chat_identities_storefront_id_fkey"
            columns: ["storefront_id"]
            isOneToOne: false
            referencedRelation: "v_public_store_stats"
            referencedColumns: ["storefront_id"]
          },
          {
            foreignKeyName: "stream_chat_identities_storefront_id_fkey"
            columns: ["storefront_id"]
            isOneToOne: false
            referencedRelation: "vendor_storefronts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stream_chat_identities_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      stripe_events: {
        Row: {
          account_id: string | null
          attempts: number
          created_at: string | null
          data: Json
          error: string | null
          event_type: string
          id: string
          processed: boolean | null
          processed_at: string | null
          stripe_event_id: string
          updated_at: string
        }
        Insert: {
          account_id?: string | null
          attempts?: number
          created_at?: string | null
          data: Json
          error?: string | null
          event_type: string
          id?: string
          processed?: boolean | null
          processed_at?: string | null
          stripe_event_id: string
          updated_at?: string
        }
        Update: {
          account_id?: string | null
          attempts?: number
          created_at?: string | null
          data?: Json
          error?: string | null
          event_type?: string
          id?: string
          processed?: boolean | null
          processed_at?: string | null
          stripe_event_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      supplier_deliveries: {
        Row: {
          created_at: string
          has_issues: boolean
          id: string
          invoice_number: string | null
          invoice_total: number | null
          notes: string | null
          purchase_order_id: string | null
          received_at: string
          received_by: string | null
          supplier_id: string
          vendor_id: string
        }
        Insert: {
          created_at?: string
          has_issues?: boolean
          id?: string
          invoice_number?: string | null
          invoice_total?: number | null
          notes?: string | null
          purchase_order_id?: string | null
          received_at?: string
          received_by?: string | null
          supplier_id: string
          vendor_id: string
        }
        Update: {
          created_at?: string
          has_issues?: boolean
          id?: string
          invoice_number?: string | null
          invoice_total?: number | null
          notes?: string | null
          purchase_order_id?: string | null
          received_at?: string
          received_by?: string | null
          supplier_id?: string
          vendor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "supplier_deliveries_purchase_order_id_fkey"
            columns: ["purchase_order_id"]
            isOneToOne: false
            referencedRelation: "purchase_orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "supplier_deliveries_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "vendor_suppliers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "supplier_deliveries_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendor_public"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "supplier_deliveries_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      suppliers: {
        Row: {
          created_at: string
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      support_conversations: {
        Row: {
          app: string
          assigned_to: string | null
          category: string
          channel_id: string
          created_at: string | null
          id: string
          metadata: Json | null
          order_id: string | null
          priority: string | null
          resolved_at: string | null
          status: string
          subject: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          app: string
          assigned_to?: string | null
          category: string
          channel_id: string
          created_at?: string | null
          id?: string
          metadata?: Json | null
          order_id?: string | null
          priority?: string | null
          resolved_at?: string | null
          status?: string
          subject?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          app?: string
          assigned_to?: string | null
          category?: string
          channel_id?: string
          created_at?: string | null
          id?: string
          metadata?: Json | null
          order_id?: string | null
          priority?: string | null
          resolved_at?: string | null
          status?: string
          subject?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "support_conversations_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "support_conversations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      supported_currencies: {
        Row: {
          active: boolean | null
          code: string
          created_at: string
          decimal_places: number | null
          name: string
          stripe_supported: boolean | null
          symbol: string
          updated_at: string
        }
        Insert: {
          active?: boolean | null
          code: string
          created_at?: string
          decimal_places?: number | null
          name: string
          stripe_supported?: boolean | null
          symbol: string
          updated_at?: string
        }
        Update: {
          active?: boolean | null
          code?: string
          created_at?: string
          decimal_places?: number | null
          name?: string
          stripe_supported?: boolean | null
          symbol?: string
          updated_at?: string
        }
        Relationships: []
      }
      surge_multipliers: {
        Row: {
          active: boolean | null
          created_at: string | null
          day_of_week: number | null
          demand_threshold: number | null
          hour_end: number
          hour_start: number
          id: string
          multiplier: number
          name: string | null
          priority: number | null
          region: string
          updated_at: string
        }
        Insert: {
          active?: boolean | null
          created_at?: string | null
          day_of_week?: number | null
          demand_threshold?: number | null
          hour_end: number
          hour_start: number
          id?: string
          multiplier?: number
          name?: string | null
          priority?: number | null
          region?: string
          updated_at?: string
        }
        Update: {
          active?: boolean | null
          created_at?: string | null
          day_of_week?: number | null
          demand_threshold?: number | null
          hour_end?: number
          hour_start?: number
          id?: string
          multiplier?: number
          name?: string | null
          priority?: number | null
          region?: string
          updated_at?: string
        }
        Relationships: []
      }
      tags: {
        Row: {
          created_at: string
          id: string
          name: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          name?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      teriyaki_leads: {
        Row: {
          address: string | null
          category: string
          city: string
          created_at: string | null
          cro: string | null
          flag: string
          id: string
          intent: string
          notes: string | null
          pitch: string | null
          platform: string | null
          rating: number | null
          reviews: number | null
          score: number
          signal: string
          signal_id: string | null
          signal_type: string
          stage: string
          updated_at: string | null
          user_id: string
          venue: string
        }
        Insert: {
          address?: string | null
          category: string
          city: string
          created_at?: string | null
          cro?: string | null
          flag?: string
          id?: string
          intent: string
          notes?: string | null
          pitch?: string | null
          platform?: string | null
          rating?: number | null
          reviews?: number | null
          score?: number
          signal: string
          signal_id?: string | null
          signal_type: string
          stage?: string
          updated_at?: string | null
          user_id: string
          venue: string
        }
        Update: {
          address?: string | null
          category?: string
          city?: string
          created_at?: string | null
          cro?: string | null
          flag?: string
          id?: string
          intent?: string
          notes?: string | null
          pitch?: string | null
          platform?: string | null
          rating?: number | null
          reviews?: number | null
          score?: number
          signal?: string
          signal_id?: string | null
          signal_type?: string
          stage?: string
          updated_at?: string | null
          user_id?: string
          venue?: string
        }
        Relationships: [
          {
            foreignKeyName: "teriyaki_leads_signal_id_fkey"
            columns: ["signal_id"]
            isOneToOne: false
            referencedRelation: "teriyaki_signals"
            referencedColumns: ["id"]
          },
        ]
      }
      teriyaki_signals: {
        Row: {
          category: string
          city: string
          created_at: string | null
          description: string
          flag: string
          id: string
          intent: string
          platform: string | null
          type: string
          venue: string
        }
        Insert: {
          category: string
          city: string
          created_at?: string | null
          description: string
          flag?: string
          id?: string
          intent: string
          platform?: string | null
          type: string
          venue: string
        }
        Update: {
          category?: string
          city?: string
          created_at?: string | null
          description?: string
          flag?: string
          id?: string
          intent?: string
          platform?: string | null
          type?: string
          venue?: string
        }
        Relationships: []
      }
      teriyaki_user_settings: {
        Row: {
          categories: string[]
          cities: string[]
          created_at: string | null
          email_notifs: boolean
          high_intent_only: boolean
          id: string
          plan: string
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          categories?: string[]
          cities?: string[]
          created_at?: string | null
          email_notifs?: boolean
          high_intent_only?: boolean
          id?: string
          plan?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          categories?: string[]
          cities?: string[]
          created_at?: string | null
          email_notifs?: boolean
          high_intent_only?: boolean
          id?: string
          plan?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      terminal_locations: {
        Row: {
          created_at: string
          default_reader_id: string | null
          id: string
          is_default: boolean
          label: string | null
          stripe_terminal_location_id: string
          vendor_id: string
        }
        Insert: {
          created_at?: string
          default_reader_id?: string | null
          id?: string
          is_default?: boolean
          label?: string | null
          stripe_terminal_location_id: string
          vendor_id: string
        }
        Update: {
          created_at?: string
          default_reader_id?: string | null
          id?: string
          is_default?: boolean
          label?: string | null
          stripe_terminal_location_id?: string
          vendor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "terminal_locations_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendor_public"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "terminal_locations_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      transfer_attempts: {
        Row: {
          amount: number | null
          attempts: number | null
          created_at: string | null
          destination_id: string | null
          destination_type: string | null
          id: string
          last_attempt_at: string | null
          last_error: string | null
          payment_intent_id: string | null
          resolved_at: string | null
          status: string | null
          updated_at: string
        }
        Insert: {
          amount?: number | null
          attempts?: number | null
          created_at?: string | null
          destination_id?: string | null
          destination_type?: string | null
          id?: string
          last_attempt_at?: string | null
          last_error?: string | null
          payment_intent_id?: string | null
          resolved_at?: string | null
          status?: string | null
          updated_at?: string
        }
        Update: {
          amount?: number | null
          attempts?: number | null
          created_at?: string | null
          destination_id?: string | null
          destination_type?: string | null
          id?: string
          last_attempt_at?: string | null
          last_error?: string | null
          payment_intent_id?: string | null
          resolved_at?: string | null
          status?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      transfer_failures: {
        Row: {
          amount_cents: number | null
          created_at: string | null
          destination_account: string | null
          error_code: string | null
          error_message: string | null
          failure_type: string | null
          id: string
          max_retries: number | null
          order_id: string | null
          resolution_notes: string | null
          resolution_transfer_id: string | null
          resolved_at: string | null
          retry_count: number | null
          rider_id: string | null
          stripe_transfer_id: string | null
          updated_at: string
          vendor_id: string | null
        }
        Insert: {
          amount_cents?: number | null
          created_at?: string | null
          destination_account?: string | null
          error_code?: string | null
          error_message?: string | null
          failure_type?: string | null
          id?: string
          max_retries?: number | null
          order_id?: string | null
          resolution_notes?: string | null
          resolution_transfer_id?: string | null
          resolved_at?: string | null
          retry_count?: number | null
          rider_id?: string | null
          stripe_transfer_id?: string | null
          updated_at?: string
          vendor_id?: string | null
        }
        Update: {
          amount_cents?: number | null
          created_at?: string | null
          destination_account?: string | null
          error_code?: string | null
          error_message?: string | null
          failure_type?: string | null
          id?: string
          max_retries?: number | null
          order_id?: string | null
          resolution_notes?: string | null
          resolution_transfer_id?: string | null
          resolved_at?: string | null
          retry_count?: number | null
          rider_id?: string | null
          stripe_transfer_id?: string | null
          updated_at?: string
          vendor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "transfer_failures_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transfer_failures_rider_id_fkey"
            columns: ["rider_id"]
            isOneToOne: false
            referencedRelation: "riders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transfer_failures_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendor_public"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transfer_failures_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      trust_events: {
        Row: {
          created_at: string | null
          entity_id: string
          entity_type: string
          event_data: Json | null
          event_type: string
          id: string
          related_order_id: string | null
          trust_score_after: number | null
          trust_score_before: number | null
          trust_score_change: number | null
          updated_at: string
        }
        Insert: {
          created_at?: string | null
          entity_id: string
          entity_type: string
          event_data?: Json | null
          event_type: string
          id?: string
          related_order_id?: string | null
          trust_score_after?: number | null
          trust_score_before?: number | null
          trust_score_change?: number | null
          updated_at?: string
        }
        Update: {
          created_at?: string | null
          entity_id?: string
          entity_type?: string
          event_data?: Json | null
          event_type?: string
          id?: string
          related_order_id?: string | null
          trust_score_after?: number | null
          trust_score_before?: number | null
          trust_score_change?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "trust_events_related_order_id_fkey"
            columns: ["related_order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      user_addresses: {
        Row: {
          apartment_number: string | null
          city: string | null
          country: string | null
          created_at: string | null
          full_address: string | null
          icon: string | null
          id: string
          is_primary: boolean | null
          label: string | null
          latitude: number | null
          location_coords: unknown
          longitude: number | null
          number_of_orders: number | null
          postal_code: string | null
          state: string | null
          street: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          apartment_number?: string | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          full_address?: string | null
          icon?: string | null
          id?: string
          is_primary?: boolean | null
          label?: string | null
          latitude?: number | null
          location_coords?: unknown
          longitude?: number | null
          number_of_orders?: number | null
          postal_code?: string | null
          state?: string | null
          street?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          apartment_number?: string | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          full_address?: string | null
          icon?: string | null
          id?: string
          is_primary?: boolean | null
          label?: string | null
          latitude?: number | null
          location_coords?: unknown
          longitude?: number | null
          number_of_orders?: number | null
          postal_code?: string | null
          state?: string | null
          street?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_addresses_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_devices: {
        Row: {
          created_at: string
          device_id: string | null
          id: string
          os: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          device_id?: string | null
          id?: string
          os?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          device_id?: string | null
          id?: string
          os?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_devices_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_notifications: {
        Row: {
          action_taken: boolean | null
          body: string | null
          category: string | null
          created_at: string
          data: Json | null
          expires_at: string | null
          id: string
          priority: number | null
          read: boolean | null
          title: string | null
          type: Database["public"]["Enums"]["user_notification_types"]
          updated_at: string
          user_id: string | null
        }
        Insert: {
          action_taken?: boolean | null
          body?: string | null
          category?: string | null
          created_at?: string
          data?: Json | null
          expires_at?: string | null
          id?: string
          priority?: number | null
          read?: boolean | null
          title?: string | null
          type: Database["public"]["Enums"]["user_notification_types"]
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          action_taken?: boolean | null
          body?: string | null
          category?: string | null
          created_at?: string
          data?: Json | null
          expires_at?: string | null
          id?: string
          priority?: number | null
          read?: boolean | null
          title?: string | null
          type?: Database["public"]["Enums"]["user_notification_types"]
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      user_trust_metrics: {
        Row: {
          average_rating: number | null
          cancelled_orders: number | null
          complaint_count: number | null
          completed_orders: number | null
          created_at: string | null
          disputed_orders: number | null
          first_order_at: string | null
          flags: Json | null
          id: string
          last_order_at: string | null
          ratings_given: number | null
          refunded_orders: number | null
          total_orders: number | null
          total_spend_cents: number | null
          trust_score: number | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          average_rating?: number | null
          cancelled_orders?: number | null
          complaint_count?: number | null
          completed_orders?: number | null
          created_at?: string | null
          disputed_orders?: number | null
          first_order_at?: string | null
          flags?: Json | null
          id?: string
          last_order_at?: string | null
          ratings_given?: number | null
          refunded_orders?: number | null
          total_orders?: number | null
          total_spend_cents?: number | null
          trust_score?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          average_rating?: number | null
          cancelled_orders?: number | null
          complaint_count?: number | null
          completed_orders?: number | null
          created_at?: string | null
          disputed_orders?: number | null
          first_order_at?: string | null
          flags?: Json | null
          id?: string
          last_order_at?: string | null
          ratings_given?: number | null
          refunded_orders?: number | null
          total_orders?: number | null
          total_spend_cents?: number | null
          trust_score?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_trust_metrics_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          anonymized_at: string | null
          avatar_url: string | null
          created_at: string | null
          current_weight_kg: number | null
          date_of_birth: string | null
          default_payment_method: string | null
          default_stripe_payment_method_id: string | null
          default_travel_mode: string | null
          deleted_at: string | null
          deletion_requested: boolean | null
          deletion_requested_at: string | null
          email: string | null
          expo_push_token: string | null
          first_name: string | null
          gender: string | null
          height_cm: number | null
          id: string
          last_name: string | null
          phone_number: string | null
          phone_verified_at: string | null
          stripe_customer_id: string | null
          stripe_identity_is_verified: boolean | null
          stripe_verification_id: string | null
          updated_at: string | null
        }
        Insert: {
          anonymized_at?: string | null
          avatar_url?: string | null
          created_at?: string | null
          current_weight_kg?: number | null
          date_of_birth?: string | null
          default_payment_method?: string | null
          default_stripe_payment_method_id?: string | null
          default_travel_mode?: string | null
          deleted_at?: string | null
          deletion_requested?: boolean | null
          deletion_requested_at?: string | null
          email?: string | null
          expo_push_token?: string | null
          first_name?: string | null
          gender?: string | null
          height_cm?: number | null
          id: string
          last_name?: string | null
          phone_number?: string | null
          phone_verified_at?: string | null
          stripe_customer_id?: string | null
          stripe_identity_is_verified?: boolean | null
          stripe_verification_id?: string | null
          updated_at?: string | null
        }
        Update: {
          anonymized_at?: string | null
          avatar_url?: string | null
          created_at?: string | null
          current_weight_kg?: number | null
          date_of_birth?: string | null
          default_payment_method?: string | null
          default_stripe_payment_method_id?: string | null
          default_travel_mode?: string | null
          deleted_at?: string | null
          deletion_requested?: boolean | null
          deletion_requested_at?: string | null
          email?: string | null
          expo_push_token?: string | null
          first_name?: string | null
          gender?: string | null
          height_cm?: number | null
          id?: string
          last_name?: string | null
          phone_number?: string | null
          phone_verified_at?: string | null
          stripe_customer_id?: string | null
          stripe_identity_is_verified?: boolean | null
          stripe_verification_id?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      variant_allergens: {
        Row: {
          allergen_id: number
          created_at: string
          updated_at: string
          variant_id: string
        }
        Insert: {
          allergen_id: number
          created_at?: string
          updated_at?: string
          variant_id: string
        }
        Update: {
          allergen_id?: number
          created_at?: string
          updated_at?: string
          variant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "variant_allergens_allergen_id_fkey"
            columns: ["allergen_id"]
            isOneToOne: false
            referencedRelation: "allergens"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "variant_allergens_variant_id_fkey"
            columns: ["variant_id"]
            isOneToOne: false
            referencedRelation: "product_variants"
            referencedColumns: ["id"]
          },
        ]
      }
      variant_groups: {
        Row: {
          created_at: string
          id: string
          name: string
          product_id: string | null
          sort_order: number | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          product_id?: string | null
          sort_order?: number | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          product_id?: string | null
          sort_order?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "variant_groups_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      variant_ingredients: {
        Row: {
          created_at: string
          ingredient_id: number
          updated_at: string
          variant_id: string
        }
        Insert: {
          created_at?: string
          ingredient_id: number
          updated_at?: string
          variant_id: string
        }
        Update: {
          created_at?: string
          ingredient_id?: number
          updated_at?: string
          variant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "variant_ingredients_ingredient_id_fkey"
            columns: ["ingredient_id"]
            isOneToOne: false
            referencedRelation: "ingredients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "variant_ingredients_variant_id_fkey"
            columns: ["variant_id"]
            isOneToOne: false
            referencedRelation: "product_variants"
            referencedColumns: ["id"]
          },
        ]
      }
      variant_option_selections: {
        Row: {
          created_at: string
          option_id: string
          updated_at: string
          variant_id: string
        }
        Insert: {
          created_at?: string
          option_id: string
          updated_at?: string
          variant_id: string
        }
        Update: {
          created_at?: string
          option_id?: string
          updated_at?: string
          variant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "variant_option_selections_option_id_fkey"
            columns: ["option_id"]
            isOneToOne: false
            referencedRelation: "variant_options"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "variant_option_selections_variant_id_fkey"
            columns: ["variant_id"]
            isOneToOne: false
            referencedRelation: "product_variants"
            referencedColumns: ["id"]
          },
        ]
      }
      variant_options: {
        Row: {
          created_at: string
          group_id: string | null
          id: string
          sort_order: number | null
          updated_at: string
          value: string
        }
        Insert: {
          created_at?: string
          group_id?: string | null
          id?: string
          sort_order?: number | null
          updated_at?: string
          value: string
        }
        Update: {
          created_at?: string
          group_id?: string | null
          id?: string
          sort_order?: number | null
          updated_at?: string
          value?: string
        }
        Relationships: [
          {
            foreignKeyName: "variant_options_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "variant_groups"
            referencedColumns: ["id"]
          },
        ]
      }
      vendor_addresses: {
        Row: {
          address_line1: string
          address_line2: string | null
          city: string
          country: string
          county: string | null
          created_at: string | null
          id: string
          is_primary: boolean | null
          latitude: number | null
          longitude: number | null
          postal_code: string | null
          state: string | null
          updated_at: string | null
          vendor_id: string
        }
        Insert: {
          address_line1: string
          address_line2?: string | null
          city: string
          country: string
          county?: string | null
          created_at?: string | null
          id?: string
          is_primary?: boolean | null
          latitude?: number | null
          longitude?: number | null
          postal_code?: string | null
          state?: string | null
          updated_at?: string | null
          vendor_id: string
        }
        Update: {
          address_line1?: string
          address_line2?: string | null
          city?: string
          country?: string
          county?: string | null
          created_at?: string | null
          id?: string
          is_primary?: boolean | null
          latitude?: number | null
          longitude?: number | null
          postal_code?: string | null
          state?: string | null
          updated_at?: string | null
          vendor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "vendor_addresses_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendor_public"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vendor_addresses_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      vendor_app_changelogs: {
        Row: {
          changes: Json
          created_at: string | null
          description: string | null
          id: string
          is_published: boolean | null
          platform: string | null
          release_date: string
          title: string
          updated_at: string
          version: string
        }
        Insert: {
          changes: Json
          created_at?: string | null
          description?: string | null
          id?: string
          is_published?: boolean | null
          platform?: string | null
          release_date: string
          title: string
          updated_at?: string
          version: string
        }
        Update: {
          changes?: Json
          created_at?: string | null
          description?: string | null
          id?: string
          is_published?: boolean | null
          platform?: string | null
          release_date?: string
          title?: string
          updated_at?: string
          version?: string
        }
        Relationships: []
      }
      vendor_categories: {
        Row: {
          category_group_id: number | null
          created_at: string | null
          description: string | null
          display_order: number | null
          icon_path: string | null
          id: string
          is_active: boolean | null
          name: string | null
          requires_age_verification: boolean | null
          requires_license: boolean | null
          updated_at: string | null
        }
        Insert: {
          category_group_id?: number | null
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          icon_path?: string | null
          id?: string
          is_active?: boolean | null
          name?: string | null
          requires_age_verification?: boolean | null
          requires_license?: boolean | null
          updated_at?: string | null
        }
        Update: {
          category_group_id?: number | null
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          icon_path?: string | null
          id?: string
          is_active?: boolean | null
          name?: string | null
          requires_age_verification?: boolean | null
          requires_license?: boolean | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "vendor_categories_category_group_id_fkey"
            columns: ["category_group_id"]
            isOneToOne: false
            referencedRelation: "vendor_category_groups"
            referencedColumns: ["id"]
          },
        ]
      }
      vendor_category_groups: {
        Row: {
          created_at: string
          description: string | null
          display_order: number | null
          id: number
          is_active: boolean | null
          name: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          display_order?: number | null
          id?: number
          is_active?: boolean | null
          name?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          display_order?: number | null
          id?: number
          is_active?: boolean | null
          name?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      vendor_compliance_attributes: {
        Row: {
          business_type:
            | Database["public"]["Enums"]["compliance_business_type"]
            | null
          created_at: string
          has_employees: boolean
          has_public_premises: boolean
          jurisdiction: string
          serves_alcohol: boolean
          serves_allergens: boolean
          updated_at: string
          uses_gas: boolean
          vendor_id: string
        }
        Insert: {
          business_type?:
            | Database["public"]["Enums"]["compliance_business_type"]
            | null
          created_at?: string
          has_employees?: boolean
          has_public_premises?: boolean
          jurisdiction?: string
          serves_alcohol?: boolean
          serves_allergens?: boolean
          updated_at?: string
          uses_gas?: boolean
          vendor_id: string
        }
        Update: {
          business_type?:
            | Database["public"]["Enums"]["compliance_business_type"]
            | null
          created_at?: string
          has_employees?: boolean
          has_public_premises?: boolean
          jurisdiction?: string
          serves_alcohol?: boolean
          serves_allergens?: boolean
          updated_at?: string
          uses_gas?: boolean
          vendor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "vendor_compliance_attributes_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: true
            referencedRelation: "vendor_public"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vendor_compliance_attributes_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: true
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      vendor_customer_audit_log: {
        Row: {
          action: Database["public"]["Enums"]["customer_audit_action"]
          created_at: string
          customer_id: string | null
          id: number
          metadata: Json | null
          user_id: string | null
          vendor_id: string
          vendor_staff_id: string | null
        }
        Insert: {
          action: Database["public"]["Enums"]["customer_audit_action"]
          created_at?: string
          customer_id?: string | null
          id?: number
          metadata?: Json | null
          user_id?: string | null
          vendor_id: string
          vendor_staff_id?: string | null
        }
        Update: {
          action?: Database["public"]["Enums"]["customer_audit_action"]
          created_at?: string
          customer_id?: string | null
          id?: number
          metadata?: Json | null
          user_id?: string | null
          vendor_id?: string
          vendor_staff_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "vendor_customer_audit_log_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vendor_customer_audit_log_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vendor_customer_audit_log_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendor_public"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vendor_customer_audit_log_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vendor_customer_audit_log_vendor_staff_id_fkey"
            columns: ["vendor_staff_id"]
            isOneToOne: false
            referencedRelation: "vendor_staff"
            referencedColumns: ["id"]
          },
        ]
      }
      vendor_customer_blast_recipients: {
        Row: {
          attributed_order_id: string | null
          blast_id: string
          channel: Database["public"]["Enums"]["customer_blast_channel"]
          clicked_at: string | null
          converted_at: string | null
          customer_id: string
          delivered_at: string | null
          destination: string | null
          error_code: string | null
          error_message: string | null
          id: string
          opened_at: string | null
          provider_id: string | null
          provider_response: Json | null
          queued_at: string
          sent_at: string | null
          status: Database["public"]["Enums"]["customer_blast_recipient_status"]
          vendor_id: string
        }
        Insert: {
          attributed_order_id?: string | null
          blast_id: string
          channel: Database["public"]["Enums"]["customer_blast_channel"]
          clicked_at?: string | null
          converted_at?: string | null
          customer_id: string
          delivered_at?: string | null
          destination?: string | null
          error_code?: string | null
          error_message?: string | null
          id?: string
          opened_at?: string | null
          provider_id?: string | null
          provider_response?: Json | null
          queued_at?: string
          sent_at?: string | null
          status?: Database["public"]["Enums"]["customer_blast_recipient_status"]
          vendor_id: string
        }
        Update: {
          attributed_order_id?: string | null
          blast_id?: string
          channel?: Database["public"]["Enums"]["customer_blast_channel"]
          clicked_at?: string | null
          converted_at?: string | null
          customer_id?: string
          delivered_at?: string | null
          destination?: string | null
          error_code?: string | null
          error_message?: string | null
          id?: string
          opened_at?: string | null
          provider_id?: string | null
          provider_response?: Json | null
          queued_at?: string
          sent_at?: string | null
          status?: Database["public"]["Enums"]["customer_blast_recipient_status"]
          vendor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "vendor_customer_blast_recipients_attributed_order_id_fkey"
            columns: ["attributed_order_id"]
            isOneToOne: false
            referencedRelation: "vendor_orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vendor_customer_blast_recipients_blast_id_fkey"
            columns: ["blast_id"]
            isOneToOne: false
            referencedRelation: "vendor_customer_blasts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vendor_customer_blast_recipients_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vendor_customer_blast_recipients_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendor_public"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vendor_customer_blast_recipients_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      vendor_customer_blasts: {
        Row: {
          attach_promo_code_id: string | null
          audience_filter_json: Json | null
          audience_lifecycle: string | null
          audience_segment_id: string | null
          audience_type: string
          body_html: string | null
          body_text: string
          cancellation_reason: string | null
          cancelled_at: string | null
          channels: Database["public"]["Enums"]["customer_blast_channel"][]
          clicked_count: number
          completed_at: string | null
          converted_count: number
          created_at: string
          created_by: string | null
          delivered_count: number
          failed_count: number
          id: string
          name: string
          opened_count: number
          opted_out_count: number
          push_title: string | null
          quiet_hours_end_local: string
          quiet_hours_skipped_count: number
          quiet_hours_start_local: string
          rate_limit_window_hours: number
          rate_limited_count: number
          recipient_count: number
          scheduled_for: string | null
          sent_count: number
          source: string
          source_ref_id: string | null
          started_at: string | null
          status: Database["public"]["Enums"]["customer_blast_status"]
          subject: string | null
          timezone: string
          updated_at: string
          vendor_id: string
        }
        Insert: {
          attach_promo_code_id?: string | null
          audience_filter_json?: Json | null
          audience_lifecycle?: string | null
          audience_segment_id?: string | null
          audience_type: string
          body_html?: string | null
          body_text: string
          cancellation_reason?: string | null
          cancelled_at?: string | null
          channels?: Database["public"]["Enums"]["customer_blast_channel"][]
          clicked_count?: number
          completed_at?: string | null
          converted_count?: number
          created_at?: string
          created_by?: string | null
          delivered_count?: number
          failed_count?: number
          id?: string
          name: string
          opened_count?: number
          opted_out_count?: number
          push_title?: string | null
          quiet_hours_end_local?: string
          quiet_hours_skipped_count?: number
          quiet_hours_start_local?: string
          rate_limit_window_hours?: number
          rate_limited_count?: number
          recipient_count?: number
          scheduled_for?: string | null
          sent_count?: number
          source?: string
          source_ref_id?: string | null
          started_at?: string | null
          status?: Database["public"]["Enums"]["customer_blast_status"]
          subject?: string | null
          timezone?: string
          updated_at?: string
          vendor_id: string
        }
        Update: {
          attach_promo_code_id?: string | null
          audience_filter_json?: Json | null
          audience_lifecycle?: string | null
          audience_segment_id?: string | null
          audience_type?: string
          body_html?: string | null
          body_text?: string
          cancellation_reason?: string | null
          cancelled_at?: string | null
          channels?: Database["public"]["Enums"]["customer_blast_channel"][]
          clicked_count?: number
          completed_at?: string | null
          converted_count?: number
          created_at?: string
          created_by?: string | null
          delivered_count?: number
          failed_count?: number
          id?: string
          name?: string
          opened_count?: number
          opted_out_count?: number
          push_title?: string | null
          quiet_hours_end_local?: string
          quiet_hours_skipped_count?: number
          quiet_hours_start_local?: string
          rate_limit_window_hours?: number
          rate_limited_count?: number
          recipient_count?: number
          scheduled_for?: string | null
          sent_count?: number
          source?: string
          source_ref_id?: string | null
          started_at?: string | null
          status?: Database["public"]["Enums"]["customer_blast_status"]
          subject?: string | null
          timezone?: string
          updated_at?: string
          vendor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "vendor_customer_blasts_attach_promo_code_id_fkey"
            columns: ["attach_promo_code_id"]
            isOneToOne: false
            referencedRelation: "promo_codes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vendor_customer_blasts_audience_segment_id_fkey"
            columns: ["audience_segment_id"]
            isOneToOne: false
            referencedRelation: "vendor_customer_segments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vendor_customer_blasts_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vendor_customer_blasts_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendor_public"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vendor_customer_blasts_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      vendor_customer_communications: {
        Row: {
          body: string | null
          channel: Database["public"]["Enums"]["customer_comm_channel"]
          created_at: string
          customer_id: string
          direction: Database["public"]["Enums"]["customer_comm_direction"]
          id: string
          ref_id: string | null
          ref_table: string | null
          staff_id: string | null
          status: string | null
          subject: string | null
          vendor_id: string
        }
        Insert: {
          body?: string | null
          channel: Database["public"]["Enums"]["customer_comm_channel"]
          created_at?: string
          customer_id: string
          direction: Database["public"]["Enums"]["customer_comm_direction"]
          id?: string
          ref_id?: string | null
          ref_table?: string | null
          staff_id?: string | null
          status?: string | null
          subject?: string | null
          vendor_id: string
        }
        Update: {
          body?: string | null
          channel?: Database["public"]["Enums"]["customer_comm_channel"]
          created_at?: string
          customer_id?: string
          direction?: Database["public"]["Enums"]["customer_comm_direction"]
          id?: string
          ref_id?: string | null
          ref_table?: string | null
          staff_id?: string | null
          status?: string | null
          subject?: string | null
          vendor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "vendor_customer_communications_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vendor_customer_communications_staff_id_fkey"
            columns: ["staff_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vendor_customer_communications_vendor_id_customer_id_fkey"
            columns: ["vendor_id", "customer_id"]
            isOneToOne: false
            referencedRelation: "vendor_customers"
            referencedColumns: ["vendor_id", "customer_id"]
          },
          {
            foreignKeyName: "vendor_customer_communications_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendor_public"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vendor_customer_communications_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      vendor_customer_identities: {
        Row: {
          created_at: string
          customer_id: string
          kind: Database["public"]["Enums"]["customer_identity_kind"]
          value_hash: string
          vendor_id: string
          verified: boolean
          verified_at: string | null
        }
        Insert: {
          created_at?: string
          customer_id: string
          kind: Database["public"]["Enums"]["customer_identity_kind"]
          value_hash: string
          vendor_id: string
          verified?: boolean
          verified_at?: string | null
        }
        Update: {
          created_at?: string
          customer_id?: string
          kind?: Database["public"]["Enums"]["customer_identity_kind"]
          value_hash?: string
          vendor_id?: string
          verified?: boolean
          verified_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "vendor_customer_identities_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vendor_customer_identities_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendor_public"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vendor_customer_identities_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      vendor_customer_notes: {
        Row: {
          body: string
          created_at: string
          customer_id: string
          id: string
          pinned: boolean
          staff_id: string | null
          updated_at: string
          vendor_id: string
        }
        Insert: {
          body: string
          created_at?: string
          customer_id: string
          id?: string
          pinned?: boolean
          staff_id?: string | null
          updated_at?: string
          vendor_id: string
        }
        Update: {
          body?: string
          created_at?: string
          customer_id?: string
          id?: string
          pinned?: boolean
          staff_id?: string | null
          updated_at?: string
          vendor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "vendor_customer_notes_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vendor_customer_notes_staff_id_fkey"
            columns: ["staff_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vendor_customer_notes_vendor_id_customer_id_fkey"
            columns: ["vendor_id", "customer_id"]
            isOneToOne: false
            referencedRelation: "vendor_customers"
            referencedColumns: ["vendor_id", "customer_id"]
          },
          {
            foreignKeyName: "vendor_customer_notes_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendor_public"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vendor_customer_notes_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      vendor_customer_segments: {
        Row: {
          created_at: string
          created_by: string | null
          filter_json: Json
          id: string
          is_shared: boolean
          name: string
          system_key: string | null
          updated_at: string
          vendor_id: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          filter_json: Json
          id?: string
          is_shared?: boolean
          name: string
          system_key?: string | null
          updated_at?: string
          vendor_id: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          filter_json?: Json
          id?: string
          is_shared?: boolean
          name?: string
          system_key?: string | null
          updated_at?: string
          vendor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "vendor_customer_segments_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vendor_customer_segments_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendor_public"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vendor_customer_segments_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      vendor_customer_tags: {
        Row: {
          created_at: string
          created_by: string | null
          customer_id: string
          tag: string
          vendor_id: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          customer_id: string
          tag: string
          vendor_id: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          customer_id?: string
          tag?: string
          vendor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "vendor_customer_tags_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vendor_customer_tags_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vendor_customer_tags_vendor_id_customer_id_fkey"
            columns: ["vendor_id", "customer_id"]
            isOneToOne: false
            referencedRelation: "vendor_customers"
            referencedColumns: ["vendor_id", "customer_id"]
          },
          {
            foreignKeyName: "vendor_customer_tags_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendor_public"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vendor_customer_tags_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      vendor_customer_winback_rules: {
        Row: {
          attach_promo_code_id: string | null
          audience_lifecycle: string | null
          audience_segment_id: string | null
          body_html: string | null
          body_text: string
          channels: Database["public"]["Enums"]["customer_blast_channel"][]
          cooldown_days: number
          created_at: string
          created_by: string | null
          id: string
          is_active: boolean
          last_run_at: string | null
          min_lifetime_orders: number
          name: string
          push_title: string | null
          quiet_hours_end_local: string
          quiet_hours_start_local: string
          subject: string | null
          timezone: string
          total_recovered: number
          total_runs: number
          trigger: Database["public"]["Enums"]["customer_winback_trigger"]
          trigger_days_since_last_order: number
          updated_at: string
          vendor_id: string
        }
        Insert: {
          attach_promo_code_id?: string | null
          audience_lifecycle?: string | null
          audience_segment_id?: string | null
          body_html?: string | null
          body_text?: string
          channels?: Database["public"]["Enums"]["customer_blast_channel"][]
          cooldown_days?: number
          created_at?: string
          created_by?: string | null
          id?: string
          is_active?: boolean
          last_run_at?: string | null
          min_lifetime_orders?: number
          name?: string
          push_title?: string | null
          quiet_hours_end_local?: string
          quiet_hours_start_local?: string
          subject?: string | null
          timezone?: string
          total_recovered?: number
          total_runs?: number
          trigger?: Database["public"]["Enums"]["customer_winback_trigger"]
          trigger_days_since_last_order?: number
          updated_at?: string
          vendor_id: string
        }
        Update: {
          attach_promo_code_id?: string | null
          audience_lifecycle?: string | null
          audience_segment_id?: string | null
          body_html?: string | null
          body_text?: string
          channels?: Database["public"]["Enums"]["customer_blast_channel"][]
          cooldown_days?: number
          created_at?: string
          created_by?: string | null
          id?: string
          is_active?: boolean
          last_run_at?: string | null
          min_lifetime_orders?: number
          name?: string
          push_title?: string | null
          quiet_hours_end_local?: string
          quiet_hours_start_local?: string
          subject?: string | null
          timezone?: string
          total_recovered?: number
          total_runs?: number
          trigger?: Database["public"]["Enums"]["customer_winback_trigger"]
          trigger_days_since_last_order?: number
          updated_at?: string
          vendor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "vendor_customer_winback_rules_attach_promo_code_id_fkey"
            columns: ["attach_promo_code_id"]
            isOneToOne: false
            referencedRelation: "promo_codes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vendor_customer_winback_rules_audience_segment_id_fkey"
            columns: ["audience_segment_id"]
            isOneToOne: false
            referencedRelation: "vendor_customer_segments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vendor_customer_winback_rules_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vendor_customer_winback_rules_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: true
            referencedRelation: "vendor_public"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vendor_customer_winback_rules_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: true
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      vendor_customer_winback_runs: {
        Row: {
          blast_id: string | null
          candidate_count: number
          completed_at: string | null
          created_at: string
          enrolled_count: number
          error_message: string | null
          id: string
          recovered_count: number
          recovered_revenue_cents: number
          rule_id: string
          started_at: string | null
          status: Database["public"]["Enums"]["customer_winback_run_status"]
          vendor_id: string
        }
        Insert: {
          blast_id?: string | null
          candidate_count?: number
          completed_at?: string | null
          created_at?: string
          enrolled_count?: number
          error_message?: string | null
          id?: string
          recovered_count?: number
          recovered_revenue_cents?: number
          rule_id: string
          started_at?: string | null
          status?: Database["public"]["Enums"]["customer_winback_run_status"]
          vendor_id: string
        }
        Update: {
          blast_id?: string | null
          candidate_count?: number
          completed_at?: string | null
          created_at?: string
          enrolled_count?: number
          error_message?: string | null
          id?: string
          recovered_count?: number
          recovered_revenue_cents?: number
          rule_id?: string
          started_at?: string | null
          status?: Database["public"]["Enums"]["customer_winback_run_status"]
          vendor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "vendor_customer_winback_runs_blast_id_fkey"
            columns: ["blast_id"]
            isOneToOne: false
            referencedRelation: "vendor_customer_blasts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vendor_customer_winback_runs_rule_id_fkey"
            columns: ["rule_id"]
            isOneToOne: false
            referencedRelation: "vendor_customer_winback_rules"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vendor_customer_winback_runs_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendor_public"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vendor_customer_winback_runs_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      vendor_customers: {
        Row: {
          allergies: string[]
          aov_cents: number
          avatar_url: string | null
          birthday: string | null
          blocked_at: string | null
          blocked_by: string | null
          blocked_reason: string | null
          created_at: string
          customer_id: string
          dietary_prefs: Json
          display_name: string | null
          first_order_at: string | null
          is_blocked: boolean
          last_contacted_at: string | null
          last_order_at: string | null
          lifecycle_stage: Database["public"]["Enums"]["customer_lifecycle_stage"]
          lifecycle_stage_at: string
          ltv_cents: number
          marketing_consent_at: string | null
          notes_count: number
          opt_in_email: boolean
          opt_in_push: boolean
          opt_in_sms: boolean
          orders_count: number
          predicted_churn_prob: number | null
          predicted_ltv_cents: number | null
          predicted_next_likely_item_id: string | null
          predicted_next_order_aov_cents: number | null
          predicted_next_order_at: string | null
          rfm_frequency_score: number | null
          rfm_monetary_score: number | null
          rfm_recency_score: number | null
          rfm_segment: string | null
          tags_count: number
          total_spent_cents: number
          updated_at: string
          vendor_id: string
        }
        Insert: {
          allergies?: string[]
          aov_cents?: number
          avatar_url?: string | null
          birthday?: string | null
          blocked_at?: string | null
          blocked_by?: string | null
          blocked_reason?: string | null
          created_at?: string
          customer_id: string
          dietary_prefs?: Json
          display_name?: string | null
          first_order_at?: string | null
          is_blocked?: boolean
          last_contacted_at?: string | null
          last_order_at?: string | null
          lifecycle_stage?: Database["public"]["Enums"]["customer_lifecycle_stage"]
          lifecycle_stage_at?: string
          ltv_cents?: number
          marketing_consent_at?: string | null
          notes_count?: number
          opt_in_email?: boolean
          opt_in_push?: boolean
          opt_in_sms?: boolean
          orders_count?: number
          predicted_churn_prob?: number | null
          predicted_ltv_cents?: number | null
          predicted_next_likely_item_id?: string | null
          predicted_next_order_aov_cents?: number | null
          predicted_next_order_at?: string | null
          rfm_frequency_score?: number | null
          rfm_monetary_score?: number | null
          rfm_recency_score?: number | null
          rfm_segment?: string | null
          tags_count?: number
          total_spent_cents?: number
          updated_at?: string
          vendor_id: string
        }
        Update: {
          allergies?: string[]
          aov_cents?: number
          avatar_url?: string | null
          birthday?: string | null
          blocked_at?: string | null
          blocked_by?: string | null
          blocked_reason?: string | null
          created_at?: string
          customer_id?: string
          dietary_prefs?: Json
          display_name?: string | null
          first_order_at?: string | null
          is_blocked?: boolean
          last_contacted_at?: string | null
          last_order_at?: string | null
          lifecycle_stage?: Database["public"]["Enums"]["customer_lifecycle_stage"]
          lifecycle_stage_at?: string
          ltv_cents?: number
          marketing_consent_at?: string | null
          notes_count?: number
          opt_in_email?: boolean
          opt_in_push?: boolean
          opt_in_sms?: boolean
          orders_count?: number
          predicted_churn_prob?: number | null
          predicted_ltv_cents?: number | null
          predicted_next_likely_item_id?: string | null
          predicted_next_order_aov_cents?: number | null
          predicted_next_order_at?: string | null
          rfm_frequency_score?: number | null
          rfm_monetary_score?: number | null
          rfm_recency_score?: number | null
          rfm_segment?: string | null
          tags_count?: number
          total_spent_cents?: number
          updated_at?: string
          vendor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "vendor_customers_blocked_by_fkey"
            columns: ["blocked_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vendor_customers_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vendor_customers_predicted_next_likely_item_id_fkey"
            columns: ["predicted_next_likely_item_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vendor_customers_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendor_public"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vendor_customers_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      vendor_delivery_radius: {
        Row: {
          center_lat: number | null
          center_lng: number | null
          created_at: string
          id: string
          radius_km: number | null
          updated_at: string
          vendor_id: string | null
        }
        Insert: {
          center_lat?: number | null
          center_lng?: number | null
          created_at?: string
          id?: string
          radius_km?: number | null
          updated_at?: string
          vendor_id?: string | null
        }
        Update: {
          center_lat?: number | null
          center_lng?: number | null
          created_at?: string
          id?: string
          radius_km?: number | null
          updated_at?: string
          vendor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "vendor_delivery_radius_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendor_public"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vendor_delivery_radius_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      vendor_document_notifications: {
        Row: {
          created_at: string
          document_id: string
          expiry_date: string
          id: string
          notification_1_sent: boolean
          notification_30_sent: boolean
          notification_7_sent: boolean
          notify_at_1_day: string | null
          notify_at_30_days: string | null
          notify_at_7_days: string | null
          status: string
          updated_at: string
          version_id: string
        }
        Insert: {
          created_at?: string
          document_id: string
          expiry_date: string
          id?: string
          notification_1_sent?: boolean
          notification_30_sent?: boolean
          notification_7_sent?: boolean
          notify_at_1_day?: string | null
          notify_at_30_days?: string | null
          notify_at_7_days?: string | null
          status?: string
          updated_at?: string
          version_id: string
        }
        Update: {
          created_at?: string
          document_id?: string
          expiry_date?: string
          id?: string
          notification_1_sent?: boolean
          notification_30_sent?: boolean
          notification_7_sent?: boolean
          notify_at_1_day?: string | null
          notify_at_30_days?: string | null
          notify_at_7_days?: string | null
          status?: string
          updated_at?: string
          version_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "vendor_document_notifications_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "vendor_documents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vendor_document_notifications_version_id_fkey"
            columns: ["version_id"]
            isOneToOne: false
            referencedRelation: "vendor_document_versions"
            referencedColumns: ["id"]
          },
        ]
      }
      vendor_document_versions: {
        Row: {
          document_id: string
          expiry_date: string
          file_hash_sha256: string | null
          file_mime: string | null
          file_path: string
          file_size: number | null
          id: string
          is_current: boolean
          issued_by: string | null
          issued_date: string | null
          ocr_extracted: Json | null
          reference_number: string | null
          uploaded_at: string
          uploaded_by_user_id: string | null
        }
        Insert: {
          document_id: string
          expiry_date: string
          file_hash_sha256?: string | null
          file_mime?: string | null
          file_path: string
          file_size?: number | null
          id?: string
          is_current?: boolean
          issued_by?: string | null
          issued_date?: string | null
          ocr_extracted?: Json | null
          reference_number?: string | null
          uploaded_at?: string
          uploaded_by_user_id?: string | null
        }
        Update: {
          document_id?: string
          expiry_date?: string
          file_hash_sha256?: string | null
          file_mime?: string | null
          file_path?: string
          file_size?: number | null
          id?: string
          is_current?: boolean
          issued_by?: string | null
          issued_date?: string | null
          ocr_extracted?: Json | null
          reference_number?: string | null
          uploaded_at?: string
          uploaded_by_user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "vendor_document_versions_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "vendor_documents"
            referencedColumns: ["id"]
          },
        ]
      }
      vendor_documents: {
        Row: {
          category_slug: string
          created_at: string
          current_version_id: string | null
          expiry_date: string | null
          id: string
          jurisdiction: string
          location_id: string | null
          notes: string | null
          reference_number: string | null
          status: Database["public"]["Enums"]["compliance_document_status"]
          updated_at: string
          vendor_id: string
          vendor_staff_id: string | null
        }
        Insert: {
          category_slug: string
          created_at?: string
          current_version_id?: string | null
          expiry_date?: string | null
          id?: string
          jurisdiction: string
          location_id?: string | null
          notes?: string | null
          reference_number?: string | null
          status?: Database["public"]["Enums"]["compliance_document_status"]
          updated_at?: string
          vendor_id: string
          vendor_staff_id?: string | null
        }
        Update: {
          category_slug?: string
          created_at?: string
          current_version_id?: string | null
          expiry_date?: string | null
          id?: string
          jurisdiction?: string
          location_id?: string | null
          notes?: string | null
          reference_number?: string | null
          status?: Database["public"]["Enums"]["compliance_document_status"]
          updated_at?: string
          vendor_id?: string
          vendor_staff_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "vd_category_fk"
            columns: ["category_slug", "jurisdiction"]
            isOneToOne: false
            referencedRelation: "compliance_document_categories"
            referencedColumns: ["slug", "jurisdiction"]
          },
          {
            foreignKeyName: "vd_current_version_fk"
            columns: ["current_version_id"]
            isOneToOne: false
            referencedRelation: "vendor_document_versions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vendor_documents_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "vendor_locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vendor_documents_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendor_public"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vendor_documents_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vendor_documents_vendor_staff_id_fkey"
            columns: ["vendor_staff_id"]
            isOneToOne: false
            referencedRelation: "vendor_staff"
            referencedColumns: ["id"]
          },
        ]
      }
      vendor_locations: {
        Row: {
          address: string | null
          address_components: Json | null
          address_json: Json | null
          building_id: string | null
          city: string | null
          country: string | null
          country_code: string | null
          created_at: string
          delivery_radius_km: number | null
          delivery_zone: unknown
          formatted_address: string | null
          free_delivery_threshold_cents: number | null
          google_place_id: string | null
          id: string
          is_primary: boolean | null
          latitude: number | null
          location_coords: unknown
          longitude: number | null
          min_order_amount_cents: number | null
          neighborhood: string | null
          platform_delivery_eligible: boolean
          postcode: string | null
          state: string | null
          street: string | null
          street_number: string | null
          updated_at: string | null
          vendor_delivery_enabled: boolean
          vendor_id: string | null
          viewport_ne_lat: number | null
          viewport_ne_lng: number | null
          viewport_sw_lat: number | null
          viewport_sw_lng: number | null
        }
        Insert: {
          address?: string | null
          address_components?: Json | null
          address_json?: Json | null
          building_id?: string | null
          city?: string | null
          country?: string | null
          country_code?: string | null
          created_at?: string
          delivery_radius_km?: number | null
          delivery_zone?: unknown
          formatted_address?: string | null
          free_delivery_threshold_cents?: number | null
          google_place_id?: string | null
          id?: string
          is_primary?: boolean | null
          latitude?: number | null
          location_coords?: unknown
          longitude?: number | null
          min_order_amount_cents?: number | null
          neighborhood?: string | null
          platform_delivery_eligible?: boolean
          postcode?: string | null
          state?: string | null
          street?: string | null
          street_number?: string | null
          updated_at?: string | null
          vendor_delivery_enabled?: boolean
          vendor_id?: string | null
          viewport_ne_lat?: number | null
          viewport_ne_lng?: number | null
          viewport_sw_lat?: number | null
          viewport_sw_lng?: number | null
        }
        Update: {
          address?: string | null
          address_components?: Json | null
          address_json?: Json | null
          building_id?: string | null
          city?: string | null
          country?: string | null
          country_code?: string | null
          created_at?: string
          delivery_radius_km?: number | null
          delivery_zone?: unknown
          formatted_address?: string | null
          free_delivery_threshold_cents?: number | null
          google_place_id?: string | null
          id?: string
          is_primary?: boolean | null
          latitude?: number | null
          location_coords?: unknown
          longitude?: number | null
          min_order_amount_cents?: number | null
          neighborhood?: string | null
          platform_delivery_eligible?: boolean
          postcode?: string | null
          state?: string | null
          street?: string | null
          street_number?: string | null
          updated_at?: string | null
          vendor_delivery_enabled?: boolean
          vendor_id?: string | null
          viewport_ne_lat?: number | null
          viewport_ne_lng?: number | null
          viewport_sw_lat?: number | null
          viewport_sw_lng?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "vendor_locations_building_id_fkey"
            columns: ["building_id"]
            isOneToOne: false
            referencedRelation: "buildings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vendor_locations_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendor_public"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vendor_locations_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      vendor_modules: {
        Row: {
          config: Json
          configured_at: string | null
          enabled_at: string
          module_key: string
          status: string
          vendor_id: string
        }
        Insert: {
          config?: Json
          configured_at?: string | null
          enabled_at?: string
          module_key: string
          status?: string
          vendor_id: string
        }
        Update: {
          config?: Json
          configured_at?: string | null
          enabled_at?: string
          module_key?: string
          status?: string
          vendor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "vendor_modules_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendor_public"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vendor_modules_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      vendor_notification_settings: {
        Row: {
          chat_messages: boolean | null
          chat_reactions: boolean | null
          created_at: string | null
          email_account_alerts: boolean | null
          email_daily_summary: boolean | null
          email_disputes: boolean | null
          email_low_stock: boolean | null
          email_new_orders: boolean | null
          email_order_completed: boolean | null
          email_payment_received: boolean | null
          email_payout_processed: boolean | null
          email_promotions: boolean | null
          email_reviews: boolean | null
          email_weekly_summary: boolean | null
          id: string
          low_stock_alerts: boolean | null
          new_orders: boolean | null
          order_updates: boolean | null
          payment_received: boolean | null
          payout_processed: boolean | null
          promotions: boolean | null
          review_alerts: boolean | null
          security_alerts: boolean | null
          updated_at: string | null
          user_id: string
          vendor_id: string
        }
        Insert: {
          chat_messages?: boolean | null
          chat_reactions?: boolean | null
          created_at?: string | null
          email_account_alerts?: boolean | null
          email_daily_summary?: boolean | null
          email_disputes?: boolean | null
          email_low_stock?: boolean | null
          email_new_orders?: boolean | null
          email_order_completed?: boolean | null
          email_payment_received?: boolean | null
          email_payout_processed?: boolean | null
          email_promotions?: boolean | null
          email_reviews?: boolean | null
          email_weekly_summary?: boolean | null
          id?: string
          low_stock_alerts?: boolean | null
          new_orders?: boolean | null
          order_updates?: boolean | null
          payment_received?: boolean | null
          payout_processed?: boolean | null
          promotions?: boolean | null
          review_alerts?: boolean | null
          security_alerts?: boolean | null
          updated_at?: string | null
          user_id: string
          vendor_id: string
        }
        Update: {
          chat_messages?: boolean | null
          chat_reactions?: boolean | null
          created_at?: string | null
          email_account_alerts?: boolean | null
          email_daily_summary?: boolean | null
          email_disputes?: boolean | null
          email_low_stock?: boolean | null
          email_new_orders?: boolean | null
          email_order_completed?: boolean | null
          email_payment_received?: boolean | null
          email_payout_processed?: boolean | null
          email_promotions?: boolean | null
          email_reviews?: boolean | null
          email_weekly_summary?: boolean | null
          id?: string
          low_stock_alerts?: boolean | null
          new_orders?: boolean | null
          order_updates?: boolean | null
          payment_received?: boolean | null
          payout_processed?: boolean | null
          promotions?: boolean | null
          review_alerts?: boolean | null
          security_alerts?: boolean | null
          updated_at?: string | null
          user_id?: string
          vendor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "vendor_notification_settings_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendor_public"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vendor_notification_settings_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      vendor_onboarding_prefill: {
        Row: {
          created_at: string
          id: string
          places_data: Json | null
          scrape_job_id: string | null
          scraped_data: Json
          status: string | null
          storefront_id: string | null
          suggested_business_description: string | null
          suggested_delivery_radius_km: number | null
          suggested_delivery_type: string | null
          suggested_mcc: string | null
          suggested_mcc_confidence: number | null
          updated_at: string
          vendor_choices: Json | null
          vendor_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          places_data?: Json | null
          scrape_job_id?: string | null
          scraped_data?: Json
          status?: string | null
          storefront_id?: string | null
          suggested_business_description?: string | null
          suggested_delivery_radius_km?: number | null
          suggested_delivery_type?: string | null
          suggested_mcc?: string | null
          suggested_mcc_confidence?: number | null
          updated_at?: string
          vendor_choices?: Json | null
          vendor_id: string
        }
        Update: {
          created_at?: string
          id?: string
          places_data?: Json | null
          scrape_job_id?: string | null
          scraped_data?: Json
          status?: string | null
          storefront_id?: string | null
          suggested_business_description?: string | null
          suggested_delivery_radius_km?: number | null
          suggested_delivery_type?: string | null
          suggested_mcc?: string | null
          suggested_mcc_confidence?: number | null
          updated_at?: string
          vendor_choices?: Json | null
          vendor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "vendor_onboarding_prefill_scrape_job_id_fkey"
            columns: ["scrape_job_id"]
            isOneToOne: false
            referencedRelation: "mv_lead_intel_scored"
            referencedColumns: ["job_id"]
          },
          {
            foreignKeyName: "vendor_onboarding_prefill_scrape_job_id_fkey"
            columns: ["scrape_job_id"]
            isOneToOne: false
            referencedRelation: "scrape_jobs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vendor_onboarding_prefill_scrape_job_id_fkey"
            columns: ["scrape_job_id"]
            isOneToOne: false
            referencedRelation: "scrape_jobs_dashboard"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vendor_onboarding_prefill_scrape_job_id_fkey"
            columns: ["scrape_job_id"]
            isOneToOne: false
            referencedRelation: "v_canonical_listings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vendor_onboarding_prefill_scrape_job_id_fkey"
            columns: ["scrape_job_id"]
            isOneToOne: false
            referencedRelation: "v_lead_intel"
            referencedColumns: ["job_id"]
          },
          {
            foreignKeyName: "vendor_onboarding_prefill_scrape_job_id_fkey"
            columns: ["scrape_job_id"]
            isOneToOne: false
            referencedRelation: "v_lead_intel_scored"
            referencedColumns: ["job_id"]
          },
          {
            foreignKeyName: "vendor_onboarding_prefill_storefront_id_fkey"
            columns: ["storefront_id"]
            isOneToOne: false
            referencedRelation: "active_vendor_storefronts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vendor_onboarding_prefill_storefront_id_fkey"
            columns: ["storefront_id"]
            isOneToOne: false
            referencedRelation: "storefront_creation_summary"
            referencedColumns: ["storefront_id"]
          },
          {
            foreignKeyName: "vendor_onboarding_prefill_storefront_id_fkey"
            columns: ["storefront_id"]
            isOneToOne: false
            referencedRelation: "v_public_store_stats"
            referencedColumns: ["storefront_id"]
          },
          {
            foreignKeyName: "vendor_onboarding_prefill_storefront_id_fkey"
            columns: ["storefront_id"]
            isOneToOne: false
            referencedRelation: "vendor_storefronts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vendor_onboarding_prefill_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendor_public"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vendor_onboarding_prefill_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      vendor_orders: {
        Row: {
          acceptance_deadline: string | null
          accepted_at: string | null
          actual_prep_seconds: number | null
          auto_declined_at: string | null
          completed_at: string | null
          created_at: string | null
          delivery_method: string | null
          display_id: string | null
          estimated_pickup_distance: number | null
          fulfillment_location_id: string | null
          id: string
          internal_notes: string | null
          is_simulated: boolean
          note_for_vendor: string | null
          parent_order_id: string
          payment_capture_amount: number | null
          payment_captured_at: string | null
          picked_up_at: string | null
          pickup_sequence: number | null
          platform_commission_amount: number | null
          platform_commission_rate: number | null
          prep_time: number | null
          ready_at: string | null
          rejection_reason: string | null
          status: string
          storefront_id: string
          stripe_transfer_amount: number | null
          stripe_transfer_arrival_date: string | null
          stripe_transfer_date: string | null
          stripe_transfer_failure_code: string | null
          stripe_transfer_failure_message: string | null
          stripe_transfer_fee: number | null
          stripe_transfer_id: string | null
          stripe_transfer_status: string | null
          subtotal: number
          updated_at: string | null
          vendor_accepted: boolean | null
          vendor_delivery_fee: number | null
          vendor_driver_name: string | null
          vendor_driver_phone: string | null
          vendor_id: string
          vendor_order_number: number | null
          vendor_payout: number | null
        }
        Insert: {
          acceptance_deadline?: string | null
          accepted_at?: string | null
          actual_prep_seconds?: number | null
          auto_declined_at?: string | null
          completed_at?: string | null
          created_at?: string | null
          delivery_method?: string | null
          display_id?: string | null
          estimated_pickup_distance?: number | null
          fulfillment_location_id?: string | null
          id?: string
          internal_notes?: string | null
          is_simulated?: boolean
          note_for_vendor?: string | null
          parent_order_id: string
          payment_capture_amount?: number | null
          payment_captured_at?: string | null
          picked_up_at?: string | null
          pickup_sequence?: number | null
          platform_commission_amount?: number | null
          platform_commission_rate?: number | null
          prep_time?: number | null
          ready_at?: string | null
          rejection_reason?: string | null
          status?: string
          storefront_id: string
          stripe_transfer_amount?: number | null
          stripe_transfer_arrival_date?: string | null
          stripe_transfer_date?: string | null
          stripe_transfer_failure_code?: string | null
          stripe_transfer_failure_message?: string | null
          stripe_transfer_fee?: number | null
          stripe_transfer_id?: string | null
          stripe_transfer_status?: string | null
          subtotal: number
          updated_at?: string | null
          vendor_accepted?: boolean | null
          vendor_delivery_fee?: number | null
          vendor_driver_name?: string | null
          vendor_driver_phone?: string | null
          vendor_id: string
          vendor_order_number?: number | null
          vendor_payout?: number | null
        }
        Update: {
          acceptance_deadline?: string | null
          accepted_at?: string | null
          actual_prep_seconds?: number | null
          auto_declined_at?: string | null
          completed_at?: string | null
          created_at?: string | null
          delivery_method?: string | null
          display_id?: string | null
          estimated_pickup_distance?: number | null
          fulfillment_location_id?: string | null
          id?: string
          internal_notes?: string | null
          is_simulated?: boolean
          note_for_vendor?: string | null
          parent_order_id?: string
          payment_capture_amount?: number | null
          payment_captured_at?: string | null
          picked_up_at?: string | null
          pickup_sequence?: number | null
          platform_commission_amount?: number | null
          platform_commission_rate?: number | null
          prep_time?: number | null
          ready_at?: string | null
          rejection_reason?: string | null
          status?: string
          storefront_id?: string
          stripe_transfer_amount?: number | null
          stripe_transfer_arrival_date?: string | null
          stripe_transfer_date?: string | null
          stripe_transfer_failure_code?: string | null
          stripe_transfer_failure_message?: string | null
          stripe_transfer_fee?: number | null
          stripe_transfer_id?: string | null
          stripe_transfer_status?: string | null
          subtotal?: number
          updated_at?: string | null
          vendor_accepted?: boolean | null
          vendor_delivery_fee?: number | null
          vendor_driver_name?: string | null
          vendor_driver_phone?: string | null
          vendor_id?: string
          vendor_order_number?: number | null
          vendor_payout?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "vendor_orders_fulfillment_location_id_fkey"
            columns: ["fulfillment_location_id"]
            isOneToOne: false
            referencedRelation: "vendor_locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vendor_orders_parent_order_id_fkey"
            columns: ["parent_order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vendor_orders_storefront_id_fkey"
            columns: ["storefront_id"]
            isOneToOne: false
            referencedRelation: "active_vendor_storefronts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vendor_orders_storefront_id_fkey"
            columns: ["storefront_id"]
            isOneToOne: false
            referencedRelation: "storefront_creation_summary"
            referencedColumns: ["storefront_id"]
          },
          {
            foreignKeyName: "vendor_orders_storefront_id_fkey"
            columns: ["storefront_id"]
            isOneToOne: false
            referencedRelation: "v_public_store_stats"
            referencedColumns: ["storefront_id"]
          },
          {
            foreignKeyName: "vendor_orders_storefront_id_fkey"
            columns: ["storefront_id"]
            isOneToOne: false
            referencedRelation: "vendor_storefronts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vendor_orders_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendor_public"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vendor_orders_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      vendor_owners: {
        Row: {
          created_at: string | null
          id: string
          is_primary: boolean | null
          updated_at: string
          user_id: string | null
          vendor_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_primary?: boolean | null
          updated_at?: string
          user_id?: string | null
          vendor_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_primary?: boolean | null
          updated_at?: string
          user_id?: string | null
          vendor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "vendor_owners_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendor_public"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vendor_owners_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      vendor_persons: {
        Row: {
          created_at: string | null
          email: string | null
          first_name: string | null
          id: string
          last_name: string | null
          percent_ownership: number | null
          roles: string[] | null
          stripe_person_id: string
          updated_at: string | null
          vendor_id: string
          verification_status: string | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          percent_ownership?: number | null
          roles?: string[] | null
          stripe_person_id: string
          updated_at?: string | null
          vendor_id: string
          verification_status?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          percent_ownership?: number | null
          roles?: string[] | null
          stripe_person_id?: string
          updated_at?: string | null
          vendor_id?: string
          verification_status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "vendor_persons_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendor_public"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vendor_persons_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      vendor_ratings: {
        Row: {
          comment: string | null
          created_at: string | null
          id: string
          thumbs_down: number | null
          thumbs_up: number | null
          updated_at: string
          user_id: string | null
          vendor_id: string
        }
        Insert: {
          comment?: string | null
          created_at?: string | null
          id?: string
          thumbs_down?: number | null
          thumbs_up?: number | null
          updated_at?: string
          user_id?: string | null
          vendor_id: string
        }
        Update: {
          comment?: string | null
          created_at?: string | null
          id?: string
          thumbs_down?: number | null
          thumbs_up?: number | null
          updated_at?: string
          user_id?: string | null
          vendor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "vendor_ratings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vendor_ratings_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendor_public"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vendor_ratings_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      vendor_schedules: {
        Row: {
          created_at: string
          id: string
          location_id: string | null
          published_at: string | null
          published_by: string | null
          updated_at: string
          vendor_id: string
          week_start_date: string
        }
        Insert: {
          created_at?: string
          id?: string
          location_id?: string | null
          published_at?: string | null
          published_by?: string | null
          updated_at?: string
          vendor_id: string
          week_start_date: string
        }
        Update: {
          created_at?: string
          id?: string
          location_id?: string | null
          published_at?: string | null
          published_by?: string | null
          updated_at?: string
          vendor_id?: string
          week_start_date?: string
        }
        Relationships: [
          {
            foreignKeyName: "vendor_schedules_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "vendor_locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vendor_schedules_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendor_public"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vendor_schedules_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      vendor_shift_swaps: {
        Row: {
          accepted_by_staff_id: string | null
          created_at: string
          decided_at: string | null
          id: string
          manager_id: string | null
          reason: string | null
          requested_by_staff_id: string
          shift_id: string
          status: Database["public"]["Enums"]["vendor_shift_swap_status"]
          updated_at: string
        }
        Insert: {
          accepted_by_staff_id?: string | null
          created_at?: string
          decided_at?: string | null
          id?: string
          manager_id?: string | null
          reason?: string | null
          requested_by_staff_id: string
          shift_id: string
          status?: Database["public"]["Enums"]["vendor_shift_swap_status"]
          updated_at?: string
        }
        Update: {
          accepted_by_staff_id?: string | null
          created_at?: string
          decided_at?: string | null
          id?: string
          manager_id?: string | null
          reason?: string | null
          requested_by_staff_id?: string
          shift_id?: string
          status?: Database["public"]["Enums"]["vendor_shift_swap_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "vendor_shift_swaps_accepted_by_staff_id_fkey"
            columns: ["accepted_by_staff_id"]
            isOneToOne: false
            referencedRelation: "vendor_staff"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vendor_shift_swaps_requested_by_staff_id_fkey"
            columns: ["requested_by_staff_id"]
            isOneToOne: false
            referencedRelation: "vendor_staff"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vendor_shift_swaps_shift_id_fkey"
            columns: ["shift_id"]
            isOneToOne: false
            referencedRelation: "vendor_shifts"
            referencedColumns: ["id"]
          },
        ]
      }
      vendor_shifts: {
        Row: {
          created_at: string
          ends_at: string
          id: string
          location_id: string | null
          notes: string | null
          role_id: number | null
          schedule_id: string
          starts_at: string
          status: Database["public"]["Enums"]["vendor_shift_status"]
          updated_at: string
          vendor_staff_id: string
        }
        Insert: {
          created_at?: string
          ends_at: string
          id?: string
          location_id?: string | null
          notes?: string | null
          role_id?: number | null
          schedule_id: string
          starts_at: string
          status?: Database["public"]["Enums"]["vendor_shift_status"]
          updated_at?: string
          vendor_staff_id: string
        }
        Update: {
          created_at?: string
          ends_at?: string
          id?: string
          location_id?: string | null
          notes?: string | null
          role_id?: number | null
          schedule_id?: string
          starts_at?: string
          status?: Database["public"]["Enums"]["vendor_shift_status"]
          updated_at?: string
          vendor_staff_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "vendor_shifts_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "vendor_locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vendor_shifts_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "vendor_staff_roles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vendor_shifts_schedule_id_fkey"
            columns: ["schedule_id"]
            isOneToOne: false
            referencedRelation: "vendor_schedules"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vendor_shifts_vendor_staff_id_fkey"
            columns: ["vendor_staff_id"]
            isOneToOne: false
            referencedRelation: "vendor_staff"
            referencedColumns: ["id"]
          },
        ]
      }
      vendor_staff: {
        Row: {
          assigned_location_id: string | null
          assigned_storefront_id: string | null
          created_at: string
          hourly_rate_cents: number | null
          id: string
          role_id: number
          scope_type: Database["public"]["Enums"]["staff_assignment_scope"]
          status: Database["public"]["Enums"]["vendor_staff_status"]
          status_note: string | null
          updated_at: string
          user_id: string
          vendor_id: string
          weekly_hours_target: number | null
        }
        Insert: {
          assigned_location_id?: string | null
          assigned_storefront_id?: string | null
          created_at?: string
          hourly_rate_cents?: number | null
          id?: string
          role_id: number
          scope_type?: Database["public"]["Enums"]["staff_assignment_scope"]
          status?: Database["public"]["Enums"]["vendor_staff_status"]
          status_note?: string | null
          updated_at?: string
          user_id: string
          vendor_id: string
          weekly_hours_target?: number | null
        }
        Update: {
          assigned_location_id?: string | null
          assigned_storefront_id?: string | null
          created_at?: string
          hourly_rate_cents?: number | null
          id?: string
          role_id?: number
          scope_type?: Database["public"]["Enums"]["staff_assignment_scope"]
          status?: Database["public"]["Enums"]["vendor_staff_status"]
          status_note?: string | null
          updated_at?: string
          user_id?: string
          vendor_id?: string
          weekly_hours_target?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "vendor_staff_assigned_location_id_fkey"
            columns: ["assigned_location_id"]
            isOneToOne: false
            referencedRelation: "vendor_locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vendor_staff_assigned_storefront_id_fkey"
            columns: ["assigned_storefront_id"]
            isOneToOne: false
            referencedRelation: "active_vendor_storefronts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vendor_staff_assigned_storefront_id_fkey"
            columns: ["assigned_storefront_id"]
            isOneToOne: false
            referencedRelation: "storefront_creation_summary"
            referencedColumns: ["storefront_id"]
          },
          {
            foreignKeyName: "vendor_staff_assigned_storefront_id_fkey"
            columns: ["assigned_storefront_id"]
            isOneToOne: false
            referencedRelation: "v_public_store_stats"
            referencedColumns: ["storefront_id"]
          },
          {
            foreignKeyName: "vendor_staff_assigned_storefront_id_fkey"
            columns: ["assigned_storefront_id"]
            isOneToOne: false
            referencedRelation: "vendor_storefronts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vendor_staff_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "vendor_staff_roles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vendor_staff_user_id_public_users_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vendor_staff_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendor_public"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vendor_staff_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      vendor_staff_invite_requests: {
        Row: {
          created_at: string
          expires_at: string | null
          id: string
          message: string | null
          owner_email: string
          requester_email: string
          requester_user_id: string
          responded_at: string | null
          responded_by: string | null
          status: string
          updated_at: string
          vendor_id: string
        }
        Insert: {
          created_at?: string
          expires_at?: string | null
          id?: string
          message?: string | null
          owner_email: string
          requester_email: string
          requester_user_id: string
          responded_at?: string | null
          responded_by?: string | null
          status?: string
          updated_at?: string
          vendor_id: string
        }
        Update: {
          created_at?: string
          expires_at?: string | null
          id?: string
          message?: string | null
          owner_email?: string
          requester_email?: string
          requester_user_id?: string
          responded_at?: string | null
          responded_by?: string | null
          status?: string
          updated_at?: string
          vendor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "vendor_staff_invite_requests_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendor_public"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vendor_staff_invite_requests_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      vendor_staff_invites: {
        Row: {
          assigned_location_id: string | null
          assigned_storefront_id: string | null
          created_at: string
          email: string
          id: string
          role_id: number
          scope_type: Database["public"]["Enums"]["staff_assignment_scope"]
          status: string
          updated_at: string
          vendor_id: string
        }
        Insert: {
          assigned_location_id?: string | null
          assigned_storefront_id?: string | null
          created_at?: string
          email: string
          id?: string
          role_id: number
          scope_type?: Database["public"]["Enums"]["staff_assignment_scope"]
          status?: string
          updated_at?: string
          vendor_id: string
        }
        Update: {
          assigned_location_id?: string | null
          assigned_storefront_id?: string | null
          created_at?: string
          email?: string
          id?: string
          role_id?: number
          scope_type?: Database["public"]["Enums"]["staff_assignment_scope"]
          status?: string
          updated_at?: string
          vendor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "vendor_staff_invites_assigned_location_id_fkey"
            columns: ["assigned_location_id"]
            isOneToOne: false
            referencedRelation: "vendor_locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vendor_staff_invites_assigned_storefront_id_fkey"
            columns: ["assigned_storefront_id"]
            isOneToOne: false
            referencedRelation: "active_vendor_storefronts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vendor_staff_invites_assigned_storefront_id_fkey"
            columns: ["assigned_storefront_id"]
            isOneToOne: false
            referencedRelation: "storefront_creation_summary"
            referencedColumns: ["storefront_id"]
          },
          {
            foreignKeyName: "vendor_staff_invites_assigned_storefront_id_fkey"
            columns: ["assigned_storefront_id"]
            isOneToOne: false
            referencedRelation: "v_public_store_stats"
            referencedColumns: ["storefront_id"]
          },
          {
            foreignKeyName: "vendor_staff_invites_assigned_storefront_id_fkey"
            columns: ["assigned_storefront_id"]
            isOneToOne: false
            referencedRelation: "vendor_storefronts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vendor_staff_invites_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "vendor_staff_roles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vendor_staff_invites_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendor_public"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vendor_staff_invites_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      vendor_staff_permissions: {
        Row: {
          created_at: string
          description: string | null
          id: number
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: number
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: number
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      vendor_staff_role_permissions: {
        Row: {
          created_at: string
          permission_id: number
          role_id: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          permission_id: number
          role_id: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          permission_id?: number
          role_id?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "vendor_staff_role_permissions_permission_id_fkey"
            columns: ["permission_id"]
            isOneToOne: false
            referencedRelation: "vendor_staff_permissions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vendor_staff_role_permissions_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "vendor_staff_roles"
            referencedColumns: ["id"]
          },
        ]
      }
      vendor_staff_roles: {
        Row: {
          created_at: string
          id: number
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: number
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: number
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      vendor_storefront_creation_log: {
        Row: {
          action: string
          created_at: string
          id: string
          ip_address: string | null
          scrape_job_id: string | null
          user_id: string | null
          vendor_id: string | null
        }
        Insert: {
          action: string
          created_at?: string
          id?: string
          ip_address?: string | null
          scrape_job_id?: string | null
          user_id?: string | null
          vendor_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          id?: string
          ip_address?: string | null
          scrape_job_id?: string | null
          user_id?: string | null
          vendor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "vendor_storefront_creation_log_scrape_job_id_fkey"
            columns: ["scrape_job_id"]
            isOneToOne: false
            referencedRelation: "mv_lead_intel_scored"
            referencedColumns: ["job_id"]
          },
          {
            foreignKeyName: "vendor_storefront_creation_log_scrape_job_id_fkey"
            columns: ["scrape_job_id"]
            isOneToOne: false
            referencedRelation: "scrape_jobs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vendor_storefront_creation_log_scrape_job_id_fkey"
            columns: ["scrape_job_id"]
            isOneToOne: false
            referencedRelation: "scrape_jobs_dashboard"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vendor_storefront_creation_log_scrape_job_id_fkey"
            columns: ["scrape_job_id"]
            isOneToOne: false
            referencedRelation: "v_canonical_listings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vendor_storefront_creation_log_scrape_job_id_fkey"
            columns: ["scrape_job_id"]
            isOneToOne: false
            referencedRelation: "v_lead_intel"
            referencedColumns: ["job_id"]
          },
          {
            foreignKeyName: "vendor_storefront_creation_log_scrape_job_id_fkey"
            columns: ["scrape_job_id"]
            isOneToOne: false
            referencedRelation: "v_lead_intel_scored"
            referencedColumns: ["job_id"]
          },
          {
            foreignKeyName: "vendor_storefront_creation_log_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendor_public"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vendor_storefront_creation_log_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      vendor_storefronts: {
        Row: {
          accepted_payment_methods: string | null
          accepts_pickup: boolean | null
          accepts_platform_delivery: boolean | null
          app_theme: Json | null
          auto_close_ordering: boolean | null
          banner_path: string | null
          bluesky_url: string | null
          category_group_id: number | null
          category_id: string | null
          commission_rate_id: string | null
          concierge: boolean
          contact_number: string | null
          created_at: string
          delivery_setup_detected: Json | null
          description: string | null
          facebook_url: string | null
          free_delivery_threshold_cents: number | null
          gbp_metadata: Json | null
          id: string
          imported_from_platform: string | null
          instagram_url: string | null
          is_active: boolean | null
          is_age_restricted: boolean | null
          is_demo: boolean
          last_paused_at: string | null
          location_id: string | null
          logo_path: string | null
          markup_bps: number
          min_margin_cents: number
          min_order_amount_cents: number | null
          minimum_order_value: number | null
          name: string | null
          own_delivery_fee_cents: number
          parent_storefront_id: string | null
          paused: boolean
          pinterest_url: string | null
          prep_time: number | null
          price_policy: string
          scrape_job_id: string | null
          short_description: string | null
          slug: string | null
          store_platform: string | null
          sub_category_id: string | null
          tester_visible: boolean
          tiktok_url: string | null
          timezone: string
          updated_at: string
          uses_own_delivery: boolean | null
          vendor_id: string | null
          website: string | null
          x_url: string | null
        }
        Insert: {
          accepted_payment_methods?: string | null
          accepts_pickup?: boolean | null
          accepts_platform_delivery?: boolean | null
          app_theme?: Json | null
          auto_close_ordering?: boolean | null
          banner_path?: string | null
          bluesky_url?: string | null
          category_group_id?: number | null
          category_id?: string | null
          commission_rate_id?: string | null
          concierge?: boolean
          contact_number?: string | null
          created_at?: string
          delivery_setup_detected?: Json | null
          description?: string | null
          facebook_url?: string | null
          free_delivery_threshold_cents?: number | null
          gbp_metadata?: Json | null
          id?: string
          imported_from_platform?: string | null
          instagram_url?: string | null
          is_active?: boolean | null
          is_age_restricted?: boolean | null
          is_demo?: boolean
          last_paused_at?: string | null
          location_id?: string | null
          logo_path?: string | null
          markup_bps?: number
          min_margin_cents?: number
          min_order_amount_cents?: number | null
          minimum_order_value?: number | null
          name?: string | null
          own_delivery_fee_cents?: number
          parent_storefront_id?: string | null
          paused?: boolean
          pinterest_url?: string | null
          prep_time?: number | null
          price_policy?: string
          scrape_job_id?: string | null
          short_description?: string | null
          slug?: string | null
          store_platform?: string | null
          sub_category_id?: string | null
          tester_visible?: boolean
          tiktok_url?: string | null
          timezone?: string
          updated_at?: string
          uses_own_delivery?: boolean | null
          vendor_id?: string | null
          website?: string | null
          x_url?: string | null
        }
        Update: {
          accepted_payment_methods?: string | null
          accepts_pickup?: boolean | null
          accepts_platform_delivery?: boolean | null
          app_theme?: Json | null
          auto_close_ordering?: boolean | null
          banner_path?: string | null
          bluesky_url?: string | null
          category_group_id?: number | null
          category_id?: string | null
          commission_rate_id?: string | null
          concierge?: boolean
          contact_number?: string | null
          created_at?: string
          delivery_setup_detected?: Json | null
          description?: string | null
          facebook_url?: string | null
          free_delivery_threshold_cents?: number | null
          gbp_metadata?: Json | null
          id?: string
          imported_from_platform?: string | null
          instagram_url?: string | null
          is_active?: boolean | null
          is_age_restricted?: boolean | null
          is_demo?: boolean
          last_paused_at?: string | null
          location_id?: string | null
          logo_path?: string | null
          markup_bps?: number
          min_margin_cents?: number
          min_order_amount_cents?: number | null
          minimum_order_value?: number | null
          name?: string | null
          own_delivery_fee_cents?: number
          parent_storefront_id?: string | null
          paused?: boolean
          pinterest_url?: string | null
          prep_time?: number | null
          price_policy?: string
          scrape_job_id?: string | null
          short_description?: string | null
          slug?: string | null
          store_platform?: string | null
          sub_category_id?: string | null
          tester_visible?: boolean
          tiktok_url?: string | null
          timezone?: string
          updated_at?: string
          uses_own_delivery?: boolean | null
          vendor_id?: string | null
          website?: string | null
          x_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "vendor_storefronts_category_group_id_fkey"
            columns: ["category_group_id"]
            isOneToOne: false
            referencedRelation: "vendor_category_groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vendor_storefronts_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "vendor_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vendor_storefronts_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "vendor_locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vendor_storefronts_parent_storefront_id_fkey"
            columns: ["parent_storefront_id"]
            isOneToOne: false
            referencedRelation: "active_vendor_storefronts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vendor_storefronts_parent_storefront_id_fkey"
            columns: ["parent_storefront_id"]
            isOneToOne: false
            referencedRelation: "storefront_creation_summary"
            referencedColumns: ["storefront_id"]
          },
          {
            foreignKeyName: "vendor_storefronts_parent_storefront_id_fkey"
            columns: ["parent_storefront_id"]
            isOneToOne: false
            referencedRelation: "v_public_store_stats"
            referencedColumns: ["storefront_id"]
          },
          {
            foreignKeyName: "vendor_storefronts_parent_storefront_id_fkey"
            columns: ["parent_storefront_id"]
            isOneToOne: false
            referencedRelation: "vendor_storefronts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vendor_storefronts_scrape_job_id_fkey"
            columns: ["scrape_job_id"]
            isOneToOne: false
            referencedRelation: "mv_lead_intel_scored"
            referencedColumns: ["job_id"]
          },
          {
            foreignKeyName: "vendor_storefronts_scrape_job_id_fkey"
            columns: ["scrape_job_id"]
            isOneToOne: false
            referencedRelation: "scrape_jobs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vendor_storefronts_scrape_job_id_fkey"
            columns: ["scrape_job_id"]
            isOneToOne: false
            referencedRelation: "scrape_jobs_dashboard"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vendor_storefronts_scrape_job_id_fkey"
            columns: ["scrape_job_id"]
            isOneToOne: false
            referencedRelation: "v_canonical_listings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vendor_storefronts_scrape_job_id_fkey"
            columns: ["scrape_job_id"]
            isOneToOne: false
            referencedRelation: "v_lead_intel"
            referencedColumns: ["job_id"]
          },
          {
            foreignKeyName: "vendor_storefronts_scrape_job_id_fkey"
            columns: ["scrape_job_id"]
            isOneToOne: false
            referencedRelation: "v_lead_intel_scored"
            referencedColumns: ["job_id"]
          },
          {
            foreignKeyName: "vendor_storefronts_sub_category_id_fkey"
            columns: ["sub_category_id"]
            isOneToOne: false
            referencedRelation: "vendor_sub_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vendor_storefronts_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendor_public"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vendor_storefronts_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      vendor_sub_categories: {
        Row: {
          created_at: string
          description: string | null
          display_order: number | null
          id: string
          is_active: boolean
          name: string
          updated_at: string
          vendor_category_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          display_order?: number | null
          id?: string
          is_active?: boolean
          name: string
          updated_at?: string
          vendor_category_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          display_order?: number | null
          id?: string
          is_active?: boolean
          name?: string
          updated_at?: string
          vendor_category_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "vendor_sub_categories_vendor_category_id_fkey"
            columns: ["vendor_category_id"]
            isOneToOne: false
            referencedRelation: "vendor_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      vendor_suppliers: {
        Row: {
          account_number: string | null
          archived_at: string | null
          contact_name: string | null
          created_at: string
          delivery_days: number[]
          email: string | null
          id: string
          lead_time_days: number | null
          minimum_order: number | null
          name: string
          notes: string | null
          order_days: number[]
          payment_terms: string | null
          phone: string | null
          updated_at: string
          vendor_id: string
          website: string | null
        }
        Insert: {
          account_number?: string | null
          archived_at?: string | null
          contact_name?: string | null
          created_at?: string
          delivery_days?: number[]
          email?: string | null
          id?: string
          lead_time_days?: number | null
          minimum_order?: number | null
          name: string
          notes?: string | null
          order_days?: number[]
          payment_terms?: string | null
          phone?: string | null
          updated_at?: string
          vendor_id: string
          website?: string | null
        }
        Update: {
          account_number?: string | null
          archived_at?: string | null
          contact_name?: string | null
          created_at?: string
          delivery_days?: number[]
          email?: string | null
          id?: string
          lead_time_days?: number | null
          minimum_order?: number | null
          name?: string
          notes?: string | null
          order_days?: number[]
          payment_terms?: string | null
          phone?: string | null
          updated_at?: string
          vendor_id?: string
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "vendor_suppliers_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendor_public"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vendor_suppliers_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      vendor_time_punches: {
        Row: {
          clocked_in_at: string
          clocked_out_at: string | null
          created_at: string
          edit_reason: string | null
          edited_by: string | null
          id: string
          photo_url: string | null
          shift_id: string | null
          source: Database["public"]["Enums"]["vendor_time_punch_source"]
          updated_at: string
          vendor_staff_id: string
        }
        Insert: {
          clocked_in_at: string
          clocked_out_at?: string | null
          created_at?: string
          edit_reason?: string | null
          edited_by?: string | null
          id?: string
          photo_url?: string | null
          shift_id?: string | null
          source?: Database["public"]["Enums"]["vendor_time_punch_source"]
          updated_at?: string
          vendor_staff_id: string
        }
        Update: {
          clocked_in_at?: string
          clocked_out_at?: string | null
          created_at?: string
          edit_reason?: string | null
          edited_by?: string | null
          id?: string
          photo_url?: string | null
          shift_id?: string | null
          source?: Database["public"]["Enums"]["vendor_time_punch_source"]
          updated_at?: string
          vendor_staff_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "vendor_time_punches_shift_id_fkey"
            columns: ["shift_id"]
            isOneToOne: false
            referencedRelation: "vendor_shifts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vendor_time_punches_vendor_staff_id_fkey"
            columns: ["vendor_staff_id"]
            isOneToOne: false
            referencedRelation: "vendor_staff"
            referencedColumns: ["id"]
          },
        ]
      }
      vendor_trust_metrics: {
        Row: {
          acceptance_rate: number | null
          average_prep_time_mins: number | null
          average_rating: number | null
          cancelled_orders: number | null
          complaint_count: number | null
          completed_orders: number | null
          created_at: string | null
          flags: Json | null
          id: string
          on_time_rate: number | null
          refunded_orders: number | null
          rejected_orders: number | null
          total_orders: number | null
          total_revenue_cents: number | null
          trust_score: number | null
          updated_at: string | null
          vendor_id: string | null
        }
        Insert: {
          acceptance_rate?: number | null
          average_prep_time_mins?: number | null
          average_rating?: number | null
          cancelled_orders?: number | null
          complaint_count?: number | null
          completed_orders?: number | null
          created_at?: string | null
          flags?: Json | null
          id?: string
          on_time_rate?: number | null
          refunded_orders?: number | null
          rejected_orders?: number | null
          total_orders?: number | null
          total_revenue_cents?: number | null
          trust_score?: number | null
          updated_at?: string | null
          vendor_id?: string | null
        }
        Update: {
          acceptance_rate?: number | null
          average_prep_time_mins?: number | null
          average_rating?: number | null
          cancelled_orders?: number | null
          complaint_count?: number | null
          completed_orders?: number | null
          created_at?: string | null
          flags?: Json | null
          id?: string
          on_time_rate?: number | null
          refunded_orders?: number | null
          rejected_orders?: number | null
          total_orders?: number | null
          total_revenue_cents?: number | null
          trust_score?: number | null
          updated_at?: string | null
          vendor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "vendor_trust_metrics_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: true
            referencedRelation: "vendor_public"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vendor_trust_metrics_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: true
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      vendors: {
        Row: {
          address: string | null
          ai_features_enabled: boolean | null
          anonymized_at: string | null
          bank_account_bank_name: string | null
          bank_account_currency: string | null
          bank_account_last4: string | null
          business_model: string | null
          business_name: string | null
          business_type: string | null
          category: string | null
          category_group_id: number | null
          category_id: string | null
          created_at: string | null
          creator_id: string
          custom_domain: string | null
          custom_domain_verified: boolean | null
          deleted_at: string | null
          deletion_requested: boolean | null
          deletion_requested_at: string | null
          demo_simulator_state: Json | null
          description: string | null
          id: string
          is_adult_only: boolean | null
          is_demo: boolean
          is_live: boolean | null
          location_coordinates: unknown
          logo_url: string | null
          mcc_id: number | null
          onboarding_completed_at: string | null
          onboarding_intent: string | null
          onboarding_mode: string | null
          opening_hours: Json | null
          organization_id: string | null
          parent_vendor_id: string | null
          phone_number: string | null
          prep_time: number | null
          registration_number: string | null
          stripe_account_id: string | null
          stripe_account_status: string | null
          stripe_charges_enabled: boolean | null
          stripe_connect_id: string | null
          stripe_current_deadline: string | null
          stripe_details_submitted: boolean | null
          stripe_disabled_reason: string | null
          stripe_onboarding_completed: boolean | null
          stripe_onboarding_step: string | null
          stripe_payouts_enabled: boolean | null
          stripe_person_id: string | null
          stripe_requirements: Json | null
          stripe_tos_accepted_at: string | null
          stripe_tos_accepted_ip: unknown
          subdomain: string | null
          support_email: string | null
          trading_name: string | null
          updated_at: string | null
          vat_number: string | null
          vertical: string | null
          vertical_subtype: string | null
          website_url: string | null
        }
        Insert: {
          address?: string | null
          ai_features_enabled?: boolean | null
          anonymized_at?: string | null
          bank_account_bank_name?: string | null
          bank_account_currency?: string | null
          bank_account_last4?: string | null
          business_model?: string | null
          business_name?: string | null
          business_type?: string | null
          category?: string | null
          category_group_id?: number | null
          category_id?: string | null
          created_at?: string | null
          creator_id: string
          custom_domain?: string | null
          custom_domain_verified?: boolean | null
          deleted_at?: string | null
          deletion_requested?: boolean | null
          deletion_requested_at?: string | null
          demo_simulator_state?: Json | null
          description?: string | null
          id?: string
          is_adult_only?: boolean | null
          is_demo?: boolean
          is_live?: boolean | null
          location_coordinates?: unknown
          logo_url?: string | null
          mcc_id?: number | null
          onboarding_completed_at?: string | null
          onboarding_intent?: string | null
          onboarding_mode?: string | null
          opening_hours?: Json | null
          organization_id?: string | null
          parent_vendor_id?: string | null
          phone_number?: string | null
          prep_time?: number | null
          registration_number?: string | null
          stripe_account_id?: string | null
          stripe_account_status?: string | null
          stripe_charges_enabled?: boolean | null
          stripe_connect_id?: string | null
          stripe_current_deadline?: string | null
          stripe_details_submitted?: boolean | null
          stripe_disabled_reason?: string | null
          stripe_onboarding_completed?: boolean | null
          stripe_onboarding_step?: string | null
          stripe_payouts_enabled?: boolean | null
          stripe_person_id?: string | null
          stripe_requirements?: Json | null
          stripe_tos_accepted_at?: string | null
          stripe_tos_accepted_ip?: unknown
          subdomain?: string | null
          support_email?: string | null
          trading_name?: string | null
          updated_at?: string | null
          vat_number?: string | null
          vertical?: string | null
          vertical_subtype?: string | null
          website_url?: string | null
        }
        Update: {
          address?: string | null
          ai_features_enabled?: boolean | null
          anonymized_at?: string | null
          bank_account_bank_name?: string | null
          bank_account_currency?: string | null
          bank_account_last4?: string | null
          business_model?: string | null
          business_name?: string | null
          business_type?: string | null
          category?: string | null
          category_group_id?: number | null
          category_id?: string | null
          created_at?: string | null
          creator_id?: string
          custom_domain?: string | null
          custom_domain_verified?: boolean | null
          deleted_at?: string | null
          deletion_requested?: boolean | null
          deletion_requested_at?: string | null
          demo_simulator_state?: Json | null
          description?: string | null
          id?: string
          is_adult_only?: boolean | null
          is_demo?: boolean
          is_live?: boolean | null
          location_coordinates?: unknown
          logo_url?: string | null
          mcc_id?: number | null
          onboarding_completed_at?: string | null
          onboarding_intent?: string | null
          onboarding_mode?: string | null
          opening_hours?: Json | null
          organization_id?: string | null
          parent_vendor_id?: string | null
          phone_number?: string | null
          prep_time?: number | null
          registration_number?: string | null
          stripe_account_id?: string | null
          stripe_account_status?: string | null
          stripe_charges_enabled?: boolean | null
          stripe_connect_id?: string | null
          stripe_current_deadline?: string | null
          stripe_details_submitted?: boolean | null
          stripe_disabled_reason?: string | null
          stripe_onboarding_completed?: boolean | null
          stripe_onboarding_step?: string | null
          stripe_payouts_enabled?: boolean | null
          stripe_person_id?: string | null
          stripe_requirements?: Json | null
          stripe_tos_accepted_at?: string | null
          stripe_tos_accepted_ip?: unknown
          subdomain?: string | null
          support_email?: string | null
          trading_name?: string | null
          updated_at?: string | null
          vat_number?: string | null
          vertical?: string | null
          vertical_subtype?: string | null
          website_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "vendors_category_group_id_fkey"
            columns: ["category_group_id"]
            isOneToOne: false
            referencedRelation: "vendor_category_groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vendors_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "vendor_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vendors_mcc_id_fkey"
            columns: ["mcc_id"]
            isOneToOne: false
            referencedRelation: "mcc_codes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vendors_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vendors_parent_vendor_id_fkey"
            columns: ["parent_vendor_id"]
            isOneToOne: false
            referencedRelation: "vendor_public"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vendors_parent_vendor_id_fkey"
            columns: ["parent_vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      wa_messages: {
        Row: {
          body: string | null
          created_at: string
          delivered_at: string | null
          direction: string
          error_code: string | null
          error_message: string | null
          id: string
          kind: string
          provider_message_id: string | null
          status: string
          template_id: string | null
          thread_id: string
        }
        Insert: {
          body?: string | null
          created_at?: string
          delivered_at?: string | null
          direction: string
          error_code?: string | null
          error_message?: string | null
          id?: string
          kind: string
          provider_message_id?: string | null
          status?: string
          template_id?: string | null
          thread_id: string
        }
        Update: {
          body?: string | null
          created_at?: string
          delivered_at?: string | null
          direction?: string
          error_code?: string | null
          error_message?: string | null
          id?: string
          kind?: string
          provider_message_id?: string | null
          status?: string
          template_id?: string | null
          thread_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "wa_messages_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "wa_templates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wa_messages_thread_id_fkey"
            columns: ["thread_id"]
            isOneToOne: false
            referencedRelation: "wa_threads"
            referencedColumns: ["id"]
          },
        ]
      }
      wa_opt_outs: {
        Row: {
          opted_out_at: string
          reason: string | null
          wa_phone_e164: string
        }
        Insert: {
          opted_out_at?: string
          reason?: string | null
          wa_phone_e164: string
        }
        Update: {
          opted_out_at?: string
          reason?: string | null
          wa_phone_e164?: string
        }
        Relationships: []
      }
      wa_templates: {
        Row: {
          body: string
          category: string
          created_at: string
          id: string
          language: string
          name: string
          provider_id: string | null
          status: string
          variables: Json | null
        }
        Insert: {
          body: string
          category: string
          created_at?: string
          id?: string
          language?: string
          name: string
          provider_id?: string | null
          status?: string
          variables?: Json | null
        }
        Update: {
          body?: string
          category?: string
          created_at?: string
          id?: string
          language?: string
          name?: string
          provider_id?: string | null
          status?: string
          variables?: Json | null
        }
        Relationships: []
      }
      wa_threads: {
        Row: {
          id: string
          last_inbound_at: string | null
          last_outbound_at: string | null
          lead_key: string | null
          opened_at: string
          wa_phone_e164: string
          window_expires_at: string | null
        }
        Insert: {
          id?: string
          last_inbound_at?: string | null
          last_outbound_at?: string | null
          lead_key?: string | null
          opened_at?: string
          wa_phone_e164: string
          window_expires_at?: string | null
        }
        Update: {
          id?: string
          last_inbound_at?: string | null
          last_outbound_at?: string | null
          lead_key?: string | null
          opened_at?: string
          wa_phone_e164?: string
          window_expires_at?: string | null
        }
        Relationships: []
      }
      website_audits: {
        Row: {
          audit: Json
          audited_at: string
          url: string
        }
        Insert: {
          audit: Json
          audited_at?: string
          url: string
        }
        Update: {
          audit?: Json
          audited_at?: string
          url?: string
        }
        Relationships: []
      }
    }
    Views: {
      active_vendor_storefronts: {
        Row: {
          accepted_payment_methods: string | null
          accepts_pickup: boolean | null
          accepts_platform_delivery: boolean | null
          auto_close_ordering: boolean | null
          banner_path: string | null
          bluesky_url: string | null
          category_group_id: number | null
          category_id: string | null
          commission_rate_id: string | null
          contact_number: string | null
          created_at: string | null
          delivery_setup_detected: Json | null
          description: string | null
          facebook_url: string | null
          free_delivery_threshold_cents: number | null
          gbp_metadata: Json | null
          id: string | null
          imported_from_platform: string | null
          instagram_url: string | null
          is_active: boolean | null
          is_age_restricted: boolean | null
          last_paused_at: string | null
          location_id: string | null
          logo_path: string | null
          min_order_amount_cents: number | null
          minimum_order_value: number | null
          name: string | null
          own_delivery_fee_cents: number | null
          parent_storefront_id: string | null
          paused: boolean | null
          pinterest_url: string | null
          prep_time: number | null
          scrape_job_id: string | null
          short_description: string | null
          slug: string | null
          sub_category_id: string | null
          tiktok_url: string | null
          updated_at: string | null
          uses_own_delivery: boolean | null
          vendor_id: string | null
          website: string | null
          x_url: string | null
        }
        Insert: {
          accepted_payment_methods?: string | null
          accepts_pickup?: boolean | null
          accepts_platform_delivery?: boolean | null
          auto_close_ordering?: boolean | null
          banner_path?: string | null
          bluesky_url?: string | null
          category_group_id?: number | null
          category_id?: string | null
          commission_rate_id?: string | null
          contact_number?: string | null
          created_at?: string | null
          delivery_setup_detected?: Json | null
          description?: string | null
          facebook_url?: string | null
          free_delivery_threshold_cents?: number | null
          gbp_metadata?: Json | null
          id?: string | null
          imported_from_platform?: string | null
          instagram_url?: string | null
          is_active?: boolean | null
          is_age_restricted?: boolean | null
          last_paused_at?: string | null
          location_id?: string | null
          logo_path?: string | null
          min_order_amount_cents?: number | null
          minimum_order_value?: number | null
          name?: string | null
          own_delivery_fee_cents?: number | null
          parent_storefront_id?: string | null
          paused?: boolean | null
          pinterest_url?: string | null
          prep_time?: number | null
          scrape_job_id?: string | null
          short_description?: string | null
          slug?: string | null
          sub_category_id?: string | null
          tiktok_url?: string | null
          updated_at?: string | null
          uses_own_delivery?: boolean | null
          vendor_id?: string | null
          website?: string | null
          x_url?: string | null
        }
        Update: {
          accepted_payment_methods?: string | null
          accepts_pickup?: boolean | null
          accepts_platform_delivery?: boolean | null
          auto_close_ordering?: boolean | null
          banner_path?: string | null
          bluesky_url?: string | null
          category_group_id?: number | null
          category_id?: string | null
          commission_rate_id?: string | null
          contact_number?: string | null
          created_at?: string | null
          delivery_setup_detected?: Json | null
          description?: string | null
          facebook_url?: string | null
          free_delivery_threshold_cents?: number | null
          gbp_metadata?: Json | null
          id?: string | null
          imported_from_platform?: string | null
          instagram_url?: string | null
          is_active?: boolean | null
          is_age_restricted?: boolean | null
          last_paused_at?: string | null
          location_id?: string | null
          logo_path?: string | null
          min_order_amount_cents?: number | null
          minimum_order_value?: number | null
          name?: string | null
          own_delivery_fee_cents?: number | null
          parent_storefront_id?: string | null
          paused?: boolean | null
          pinterest_url?: string | null
          prep_time?: number | null
          scrape_job_id?: string | null
          short_description?: string | null
          slug?: string | null
          sub_category_id?: string | null
          tiktok_url?: string | null
          updated_at?: string | null
          uses_own_delivery?: boolean | null
          vendor_id?: string | null
          website?: string | null
          x_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "vendor_storefronts_category_group_id_fkey"
            columns: ["category_group_id"]
            isOneToOne: false
            referencedRelation: "vendor_category_groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vendor_storefronts_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "vendor_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vendor_storefronts_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "vendor_locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vendor_storefronts_parent_storefront_id_fkey"
            columns: ["parent_storefront_id"]
            isOneToOne: false
            referencedRelation: "active_vendor_storefronts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vendor_storefronts_parent_storefront_id_fkey"
            columns: ["parent_storefront_id"]
            isOneToOne: false
            referencedRelation: "storefront_creation_summary"
            referencedColumns: ["storefront_id"]
          },
          {
            foreignKeyName: "vendor_storefronts_parent_storefront_id_fkey"
            columns: ["parent_storefront_id"]
            isOneToOne: false
            referencedRelation: "v_public_store_stats"
            referencedColumns: ["storefront_id"]
          },
          {
            foreignKeyName: "vendor_storefronts_parent_storefront_id_fkey"
            columns: ["parent_storefront_id"]
            isOneToOne: false
            referencedRelation: "vendor_storefronts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vendor_storefronts_scrape_job_id_fkey"
            columns: ["scrape_job_id"]
            isOneToOne: false
            referencedRelation: "mv_lead_intel_scored"
            referencedColumns: ["job_id"]
          },
          {
            foreignKeyName: "vendor_storefronts_scrape_job_id_fkey"
            columns: ["scrape_job_id"]
            isOneToOne: false
            referencedRelation: "scrape_jobs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vendor_storefronts_scrape_job_id_fkey"
            columns: ["scrape_job_id"]
            isOneToOne: false
            referencedRelation: "scrape_jobs_dashboard"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vendor_storefronts_scrape_job_id_fkey"
            columns: ["scrape_job_id"]
            isOneToOne: false
            referencedRelation: "v_canonical_listings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vendor_storefronts_scrape_job_id_fkey"
            columns: ["scrape_job_id"]
            isOneToOne: false
            referencedRelation: "v_lead_intel"
            referencedColumns: ["job_id"]
          },
          {
            foreignKeyName: "vendor_storefronts_scrape_job_id_fkey"
            columns: ["scrape_job_id"]
            isOneToOne: false
            referencedRelation: "v_lead_intel_scored"
            referencedColumns: ["job_id"]
          },
          {
            foreignKeyName: "vendor_storefronts_sub_category_id_fkey"
            columns: ["sub_category_id"]
            isOneToOne: false
            referencedRelation: "vendor_sub_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vendor_storefronts_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendor_public"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vendor_storefronts_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      location_delivery_radius_with_details: {
        Row: {
          address: string | null
          center_lat: number | null
          center_long: number | null
          city: string | null
          country: string | null
          created_at: string | null
          id: number | null
          location_id: string | null
          location_lat: number | null
          location_long: number | null
          postcode: string | null
          radius_km: number | null
          state: string | null
          updated_at: string | null
          vendor_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "location_delivery_radius_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: true
            referencedRelation: "vendor_locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vendor_locations_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendor_public"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vendor_locations_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      mv_lead_intel_scored: {
        Row: {
          address: string | null
          brand_key: string | null
          chain_blocked: boolean | null
          claimed_at: string | null
          claimed_by_vendor_id: string | null
          detected_ordering_platform: string | null
          detected_pos: string | null
          facebook_url: string | null
          first_seen: string | null
          google_place_id: string | null
          has_contact_channel: boolean | null
          has_direct_order: boolean | null
          has_enrichment: boolean | null
          icp_score: number | null
          inferred_city: string | null
          instagram_url: string | null
          is_claimed: boolean | null
          job_id: string | null
          last_seen: string | null
          lead_tier: string | null
          listing_url: string | null
          operator_name: string | null
          phone: string | null
          platform: string | null
          primary_email: string | null
          rating: number | null
          rating_count: number | null
          site_count: number | null
          site_kind: string | null
          status: string | null
          tier_override: string | null
          tiktok_url: string | null
          vertical: string | null
          warm_has_own_site: boolean | null
          website: string | null
          whatsapp_url: string | null
        }
        Relationships: [
          {
            foreignKeyName: "scrape_jobs_claimed_by_vendor_id_fkey"
            columns: ["claimed_by_vendor_id"]
            isOneToOne: false
            referencedRelation: "vendor_public"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "scrape_jobs_claimed_by_vendor_id_fkey"
            columns: ["claimed_by_vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      mv_vendor_customer_rfm: {
        Row: {
          customer_id: string | null
          last_order_at: string | null
          orders_count: number | null
          rfm_frequency_score: number | null
          rfm_monetary_score: number | null
          rfm_recency_score: number | null
          rfm_segment: string | null
          total_spent_cents: number | null
          vendor_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "orders_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vendor_orders_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendor_public"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vendor_orders_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      product_fetch_active: {
        Row: {
          completed_at: string | null
          created_at: string | null
          created_by: string | null
          error_message: string | null
          estimated_seconds_remaining: number | null
          id: string | null
          metadata: Json | null
          priority: number | null
          products_found: number | null
          products_imported: number | null
          progress: number | null
          scrape_job_id: string | null
          source_type: string | null
          source_url: string | null
          started_at: string | null
          status: string | null
          status_message: string | null
          storefront_id: string | null
          storefront_name: string | null
          updated_at: string | null
          vendor_id: string | null
          vendor_name: string | null
        }
        Relationships: [
          {
            foreignKeyName: "product_fetch_jobs_scrape_job_id_fkey"
            columns: ["scrape_job_id"]
            isOneToOne: false
            referencedRelation: "mv_lead_intel_scored"
            referencedColumns: ["job_id"]
          },
          {
            foreignKeyName: "product_fetch_jobs_scrape_job_id_fkey"
            columns: ["scrape_job_id"]
            isOneToOne: false
            referencedRelation: "scrape_jobs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_fetch_jobs_scrape_job_id_fkey"
            columns: ["scrape_job_id"]
            isOneToOne: false
            referencedRelation: "scrape_jobs_dashboard"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_fetch_jobs_scrape_job_id_fkey"
            columns: ["scrape_job_id"]
            isOneToOne: false
            referencedRelation: "v_canonical_listings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_fetch_jobs_scrape_job_id_fkey"
            columns: ["scrape_job_id"]
            isOneToOne: false
            referencedRelation: "v_lead_intel"
            referencedColumns: ["job_id"]
          },
          {
            foreignKeyName: "product_fetch_jobs_scrape_job_id_fkey"
            columns: ["scrape_job_id"]
            isOneToOne: false
            referencedRelation: "v_lead_intel_scored"
            referencedColumns: ["job_id"]
          },
          {
            foreignKeyName: "product_fetch_jobs_storefront_id_fkey"
            columns: ["storefront_id"]
            isOneToOne: false
            referencedRelation: "active_vendor_storefronts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_fetch_jobs_storefront_id_fkey"
            columns: ["storefront_id"]
            isOneToOne: false
            referencedRelation: "storefront_creation_summary"
            referencedColumns: ["storefront_id"]
          },
          {
            foreignKeyName: "product_fetch_jobs_storefront_id_fkey"
            columns: ["storefront_id"]
            isOneToOne: false
            referencedRelation: "v_public_store_stats"
            referencedColumns: ["storefront_id"]
          },
          {
            foreignKeyName: "product_fetch_jobs_storefront_id_fkey"
            columns: ["storefront_id"]
            isOneToOne: false
            referencedRelation: "vendor_storefronts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_fetch_jobs_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendor_public"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_fetch_jobs_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      scrape_jobs_dashboard: {
        Row: {
          claimed_at: string | null
          claimed_by_vendor_id: string | null
          completed_at: string | null
          created_at: string | null
          created_by: string | null
          duration_minutes: number | null
          error_message: string | null
          extracted_address: string | null
          extracted_business_name: string | null
          extracted_metadata: Json | null
          failed_at: string | null
          geo_point: unknown
          google_place_id: string | null
          id: string | null
          is_claimed: boolean | null
          is_phone_verified: boolean | null
          last_attempt_at: string | null
          latitude: number | null
          longitude: number | null
          max_retries: number | null
          next_attempt_at: string | null
          notes: string | null
          phone_verified_at: string | null
          phone_verified_by: string | null
          places_address: string | null
          places_data: Json | null
          places_match_confidence: number | null
          places_name: string | null
          priority: number | null
          raw_html_content_type: string | null
          raw_html_size_bytes: number | null
          raw_html_storage_path: string | null
          retry_count: number | null
          scheduled_for: string | null
          source_type: string | null
          source_url: string | null
          started_at: string | null
          status: string | null
          status_order: number | null
          tags: string[] | null
          target_address: string | null
          target_store_name: string | null
          updated_at: string | null
        }
        Insert: {
          claimed_at?: string | null
          claimed_by_vendor_id?: string | null
          completed_at?: string | null
          created_at?: string | null
          created_by?: string | null
          duration_minutes?: never
          error_message?: string | null
          extracted_address?: never
          extracted_business_name?: never
          extracted_metadata?: Json | null
          failed_at?: string | null
          geo_point?: unknown
          google_place_id?: string | null
          id?: string | null
          is_claimed?: never
          is_phone_verified?: never
          last_attempt_at?: string | null
          latitude?: never
          longitude?: never
          max_retries?: number | null
          next_attempt_at?: string | null
          notes?: string | null
          phone_verified_at?: string | null
          phone_verified_by?: string | null
          places_address?: never
          places_data?: Json | null
          places_match_confidence?: number | null
          places_name?: never
          priority?: number | null
          raw_html_content_type?: string | null
          raw_html_size_bytes?: number | null
          raw_html_storage_path?: string | null
          retry_count?: number | null
          scheduled_for?: string | null
          source_type?: string | null
          source_url?: string | null
          started_at?: string | null
          status?: string | null
          status_order?: never
          tags?: string[] | null
          target_address?: string | null
          target_store_name?: string | null
          updated_at?: string | null
        }
        Update: {
          claimed_at?: string | null
          claimed_by_vendor_id?: string | null
          completed_at?: string | null
          created_at?: string | null
          created_by?: string | null
          duration_minutes?: never
          error_message?: string | null
          extracted_address?: never
          extracted_business_name?: never
          extracted_metadata?: Json | null
          failed_at?: string | null
          geo_point?: unknown
          google_place_id?: string | null
          id?: string | null
          is_claimed?: never
          is_phone_verified?: never
          last_attempt_at?: string | null
          latitude?: never
          longitude?: never
          max_retries?: number | null
          next_attempt_at?: string | null
          notes?: string | null
          phone_verified_at?: string | null
          phone_verified_by?: string | null
          places_address?: never
          places_data?: Json | null
          places_match_confidence?: number | null
          places_name?: never
          priority?: number | null
          raw_html_content_type?: string | null
          raw_html_size_bytes?: number | null
          raw_html_storage_path?: string | null
          retry_count?: number | null
          scheduled_for?: string | null
          source_type?: string | null
          source_url?: string | null
          started_at?: string | null
          status?: string | null
          status_order?: never
          tags?: string[] | null
          target_address?: string | null
          target_store_name?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "scrape_jobs_claimed_by_vendor_id_fkey"
            columns: ["claimed_by_vendor_id"]
            isOneToOne: false
            referencedRelation: "vendor_public"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "scrape_jobs_claimed_by_vendor_id_fkey"
            columns: ["claimed_by_vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      scrape_refresh_candidates: {
        Row: {
          age: string | null
          has_active_job: boolean | null
          last_scraped_at: string | null
          source_type: string | null
          source_url: string | null
          total_scrapes: number | null
        }
        Relationships: []
      }
      scrape_refresh_status: {
        Row: {
          avg_duration_secs: number | null
          completed: number | null
          date: string | null
          failed: number | null
          in_progress: number | null
          total: number | null
        }
        Relationships: []
      }
      storefront_creation_summary: {
        Row: {
          created_at: string | null
          google_place_id: string | null
          has_hours_conflict: boolean | null
          imported_from: string | null
          imported_from_url: string | null
          is_fetching_products: boolean | null
          last_product_fetch_status: string | null
          places_address: string | null
          places_match_confidence: number | null
          places_name: string | null
          scrape_job_id: string | null
          scraped_address: string | null
          scraped_name: string | null
          storefront_id: string | null
          storefront_name: string | null
          vendor_id: string | null
          vendor_name: string | null
        }
        Relationships: [
          {
            foreignKeyName: "vendor_storefronts_scrape_job_id_fkey"
            columns: ["scrape_job_id"]
            isOneToOne: false
            referencedRelation: "mv_lead_intel_scored"
            referencedColumns: ["job_id"]
          },
          {
            foreignKeyName: "vendor_storefronts_scrape_job_id_fkey"
            columns: ["scrape_job_id"]
            isOneToOne: false
            referencedRelation: "scrape_jobs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vendor_storefronts_scrape_job_id_fkey"
            columns: ["scrape_job_id"]
            isOneToOne: false
            referencedRelation: "scrape_jobs_dashboard"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vendor_storefronts_scrape_job_id_fkey"
            columns: ["scrape_job_id"]
            isOneToOne: false
            referencedRelation: "v_canonical_listings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vendor_storefronts_scrape_job_id_fkey"
            columns: ["scrape_job_id"]
            isOneToOne: false
            referencedRelation: "v_lead_intel"
            referencedColumns: ["job_id"]
          },
          {
            foreignKeyName: "vendor_storefronts_scrape_job_id_fkey"
            columns: ["scrape_job_id"]
            isOneToOne: false
            referencedRelation: "v_lead_intel_scored"
            referencedColumns: ["job_id"]
          },
          {
            foreignKeyName: "vendor_storefronts_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendor_public"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vendor_storefronts_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      v_canonical_listings: {
        Row: {
          claimed_at: string | null
          claimed_by_vendor_id: string | null
          completed_at: string | null
          consensus_data: Json | null
          created_at: string | null
          created_by: string | null
          data_confidence: number | null
          error_message: string | null
          estimated_cost_cents: number | null
          extracted_metadata: Json | null
          failed_at: string | null
          geo_point: unknown
          google_place_id: string | null
          id: string | null
          is_canonical: boolean | null
          last_attempt_at: string | null
          max_retries: number | null
          next_attempt_at: string | null
          notes: string | null
          phone_verified_at: string | null
          phone_verified_by: string | null
          places_data: Json | null
          places_match_confidence: number | null
          priority: number | null
          raw_html_content_type: string | null
          raw_html_size_bytes: number | null
          raw_html_storage_path: string | null
          retry_count: number | null
          scheduled_for: string | null
          scraper_agreement: number | null
          secondary_html_size_bytes: number | null
          secondary_html_storage_path: string | null
          source_type: string | null
          source_url: string | null
          started_at: string | null
          status: string | null
          superseded_by_id: string | null
          tags: string[] | null
          target_address: string | null
          target_store_name: string | null
          updated_at: string | null
          vertical: string | null
        }
        Insert: {
          claimed_at?: string | null
          claimed_by_vendor_id?: string | null
          completed_at?: string | null
          consensus_data?: Json | null
          created_at?: string | null
          created_by?: string | null
          data_confidence?: number | null
          error_message?: string | null
          estimated_cost_cents?: number | null
          extracted_metadata?: Json | null
          failed_at?: string | null
          geo_point?: unknown
          google_place_id?: string | null
          id?: string | null
          is_canonical?: boolean | null
          last_attempt_at?: string | null
          max_retries?: number | null
          next_attempt_at?: string | null
          notes?: string | null
          phone_verified_at?: string | null
          phone_verified_by?: string | null
          places_data?: Json | null
          places_match_confidence?: number | null
          priority?: number | null
          raw_html_content_type?: string | null
          raw_html_size_bytes?: number | null
          raw_html_storage_path?: string | null
          retry_count?: number | null
          scheduled_for?: string | null
          scraper_agreement?: number | null
          secondary_html_size_bytes?: number | null
          secondary_html_storage_path?: string | null
          source_type?: string | null
          source_url?: string | null
          started_at?: string | null
          status?: string | null
          superseded_by_id?: string | null
          tags?: string[] | null
          target_address?: string | null
          target_store_name?: string | null
          updated_at?: string | null
          vertical?: string | null
        }
        Update: {
          claimed_at?: string | null
          claimed_by_vendor_id?: string | null
          completed_at?: string | null
          consensus_data?: Json | null
          created_at?: string | null
          created_by?: string | null
          data_confidence?: number | null
          error_message?: string | null
          estimated_cost_cents?: number | null
          extracted_metadata?: Json | null
          failed_at?: string | null
          geo_point?: unknown
          google_place_id?: string | null
          id?: string | null
          is_canonical?: boolean | null
          last_attempt_at?: string | null
          max_retries?: number | null
          next_attempt_at?: string | null
          notes?: string | null
          phone_verified_at?: string | null
          phone_verified_by?: string | null
          places_data?: Json | null
          places_match_confidence?: number | null
          priority?: number | null
          raw_html_content_type?: string | null
          raw_html_size_bytes?: number | null
          raw_html_storage_path?: string | null
          retry_count?: number | null
          scheduled_for?: string | null
          scraper_agreement?: number | null
          secondary_html_size_bytes?: number | null
          secondary_html_storage_path?: string | null
          source_type?: string | null
          source_url?: string | null
          started_at?: string | null
          status?: string | null
          superseded_by_id?: string | null
          tags?: string[] | null
          target_address?: string | null
          target_store_name?: string | null
          updated_at?: string | null
          vertical?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "scrape_jobs_claimed_by_vendor_id_fkey"
            columns: ["claimed_by_vendor_id"]
            isOneToOne: false
            referencedRelation: "vendor_public"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "scrape_jobs_claimed_by_vendor_id_fkey"
            columns: ["claimed_by_vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "scrape_jobs_superseded_by_id_fkey"
            columns: ["superseded_by_id"]
            isOneToOne: false
            referencedRelation: "mv_lead_intel_scored"
            referencedColumns: ["job_id"]
          },
          {
            foreignKeyName: "scrape_jobs_superseded_by_id_fkey"
            columns: ["superseded_by_id"]
            isOneToOne: false
            referencedRelation: "scrape_jobs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "scrape_jobs_superseded_by_id_fkey"
            columns: ["superseded_by_id"]
            isOneToOne: false
            referencedRelation: "scrape_jobs_dashboard"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "scrape_jobs_superseded_by_id_fkey"
            columns: ["superseded_by_id"]
            isOneToOne: false
            referencedRelation: "v_canonical_listings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "scrape_jobs_superseded_by_id_fkey"
            columns: ["superseded_by_id"]
            isOneToOne: false
            referencedRelation: "v_lead_intel"
            referencedColumns: ["job_id"]
          },
          {
            foreignKeyName: "scrape_jobs_superseded_by_id_fkey"
            columns: ["superseded_by_id"]
            isOneToOne: false
            referencedRelation: "v_lead_intel_scored"
            referencedColumns: ["job_id"]
          },
        ]
      }
      v_cron_recent_failures: {
        Row: {
          end_time: string | null
          jobname: string | null
          return_message: string | null
          start_time: string | null
          status: string | null
        }
        Relationships: []
      }
      v_lead_intel: {
        Row: {
          address: string | null
          claimed_at: string | null
          claimed_by_vendor_id: string | null
          detected_ordering_platform: string | null
          detected_pos: string | null
          facebook_url: string | null
          first_seen: string | null
          google_place_id: string | null
          has_contact_channel: boolean | null
          has_direct_order: boolean | null
          has_enrichment: boolean | null
          inferred_city: string | null
          instagram_url: string | null
          is_claimed: boolean | null
          job_id: string | null
          last_seen: string | null
          listing_url: string | null
          operator_name: string | null
          phone: string | null
          platform: string | null
          primary_email: string | null
          rating: number | null
          rating_count: number | null
          site_kind: string | null
          status: string | null
          tiktok_url: string | null
          vertical: string | null
          warm_has_own_site: boolean | null
          website: string | null
          whatsapp_url: string | null
        }
        Relationships: [
          {
            foreignKeyName: "scrape_jobs_claimed_by_vendor_id_fkey"
            columns: ["claimed_by_vendor_id"]
            isOneToOne: false
            referencedRelation: "vendor_public"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "scrape_jobs_claimed_by_vendor_id_fkey"
            columns: ["claimed_by_vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      v_lead_intel_scored: {
        Row: {
          address: string | null
          brand_key: string | null
          chain_blocked: boolean | null
          claimed_at: string | null
          claimed_by_vendor_id: string | null
          detected_ordering_platform: string | null
          detected_pos: string | null
          facebook_url: string | null
          first_seen: string | null
          google_place_id: string | null
          has_contact_channel: boolean | null
          has_direct_order: boolean | null
          has_enrichment: boolean | null
          icp_score: number | null
          inferred_city: string | null
          instagram_url: string | null
          is_claimed: boolean | null
          job_id: string | null
          last_seen: string | null
          lead_tier: string | null
          listing_url: string | null
          operator_name: string | null
          phone: string | null
          platform: string | null
          primary_email: string | null
          rating: number | null
          rating_count: number | null
          site_count: number | null
          site_kind: string | null
          status: string | null
          tier_override: string | null
          tiktok_url: string | null
          vertical: string | null
          warm_has_own_site: boolean | null
          website: string | null
          whatsapp_url: string | null
        }
        Relationships: [
          {
            foreignKeyName: "scrape_jobs_claimed_by_vendor_id_fkey"
            columns: ["claimed_by_vendor_id"]
            isOneToOne: false
            referencedRelation: "vendor_public"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "scrape_jobs_claimed_by_vendor_id_fkey"
            columns: ["claimed_by_vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      v_public_store_stats: {
        Row: {
          has_promos: boolean | null
          on_sale_count: number | null
          photo_count: number | null
          product_count: number | null
          section_count: number | null
          shared_photo_count: number | null
          storefront_id: string | null
        }
        Relationships: []
      }
      vendor_public: {
        Row: {
          business_name: string | null
          business_type: string | null
          id: string | null
          is_demo: boolean | null
          logo_url: string | null
          opening_hours: Json | null
          phone_number: string | null
          stripe_account_id: string | null
          support_email: string | null
          trading_name: string | null
          website_url: string | null
        }
        Insert: {
          business_name?: string | null
          business_type?: string | null
          id?: string | null
          is_demo?: boolean | null
          logo_url?: string | null
          opening_hours?: Json | null
          phone_number?: string | null
          stripe_account_id?: string | null
          support_email?: string | null
          trading_name?: string | null
          website_url?: string | null
        }
        Update: {
          business_name?: string | null
          business_type?: string | null
          id?: string | null
          is_demo?: boolean | null
          logo_url?: string | null
          opening_hours?: Json | null
          phone_number?: string | null
          stripe_account_id?: string | null
          support_email?: string | null
          trading_name?: string | null
          website_url?: string | null
        }
        Relationships: []
      }
      vendor_staff_invite_requests_pending: {
        Row: {
          created_at: string | null
          expires_at: string | null
          id: string | null
          message: string | null
          owner_email: string | null
          requester_email: string | null
          requester_email_confirmed: string | null
          requester_first_name: string | null
          requester_last_name: string | null
          requester_user_id: string | null
          responded_at: string | null
          responded_by: string | null
          status: string | null
          updated_at: string | null
          vendor_id: string | null
          vendor_name: string | null
        }
        Relationships: [
          {
            foreignKeyName: "vendor_staff_invite_requests_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendor_public"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vendor_staff_invite_requests_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      adjust_customer_credit: {
        Args: {
          p_amount_cents: number
          p_issued_by: string
          p_reason: string
          p_user_id: string
          p_vendor_id: string
        }
        Returns: number
      }
      admin_scraping_spend: { Args: { window_start: string }; Returns: Json }
      assert_vendor_access: {
        Args: { p_vendor_id: string }
        Returns: undefined
      }
      calculate_distance: {
        Args: { lat1: number; lat2: number; lon1: number; lon2: number }
        Returns: number
      }
      calculate_distance_km: {
        Args: { lat1: number; lat2: number; lng1: number; lng2: number }
        Returns: number
      }
      check_rider_geofences: {
        Args: never
        Returns: {
          assignment_id: string
          assignment_order_id: string
          assignment_rider_id: string
          distance_meters: number
          fence_type: string
        }[]
      }
      claim_price_sources: {
        Args: { p_lease_seconds: number; p_limit: number }
        Returns: {
          address: string | null
          base_url: string | null
          city: string | null
          consecutive_failures: number
          crawl_interval_hours: number
          crawl_state: Json
          created_at: string
          email: string | null
          enabled: boolean
          hours: Json | null
          id: string
          is_food: boolean
          item_count: number
          kind: string
          last_crawled_at: string | null
          last_error: string | null
          last_status: string | null
          lat: number | null
          lease_until: string | null
          lng: number | null
          location_precision: string | null
          name: string
          next_crawl_at: string
          online_only: boolean
          phone: string | null
          platform: string | null
          rating: number | null
          review_count: number | null
          scrape_job_id: string | null
          source_key: string
          storefront_id: string | null
          updated_at: string
          whatsapp: string | null
        }[]
        SetofOptions: {
          from: "*"
          to: "price_sources"
          isOneToOne: false
          isSetofReturn: true
        }
      }
      company_register_counts: {
        Args: never
        Returns: {
          count: number
          country_code: string
        }[]
      }
      company_register_stats: {
        Args: never
        Returns: {
          count: number
          country_code: string
          last_synced: string
        }[]
      }
      compute_compliance_state: {
        Args: { p_vendor_id: string }
        Returns: {
          category_slug: string
          criticality: Database["public"]["Enums"]["compliance_criticality"]
          current_version_id: string
          days_until_expiry: number
          display_name: string
          expiry_date: string
          icon: string
          jurisdiction: string
          scope: Database["public"]["Enums"]["compliance_document_scope"]
          scope_target_id: string
          status: Database["public"]["Enums"]["compliance_document_status"]
        }[]
      }
      count_vendor_customer_orders: {
        Args: { p_customer_id: string; p_vendor_id: string }
        Returns: number
      }
      decrement_product_stock: {
        Args: { p_product_id: string; p_qty: number }
        Returns: {
          new_stock: number
          ok: boolean
        }[]
      }
      decrement_variant_stock: {
        Args: { p_qty: number; p_variant_id: string }
        Returns: {
          new_stock: number
          ok: boolean
        }[]
      }
      demo_seller_facets: { Args: never; Returns: Json }
      demo_sellers: {
        Args: {
          p_city?: string
          p_cuisine?: string
          p_limit?: number
          p_offset?: number
          p_platform?: string
          p_search?: string
        }
        Returns: Json
      }
      demo_storefront: { Args: { p_job_id: string }; Returns: Json }
      find_nearby_riders: {
        Args: {
          p_location_max_age_minutes?: number
          p_max_results?: number
          p_pickup_lat: number
          p_pickup_lng: number
          p_radius_km?: number
        }
        Returns: {
          accept_rate: number
          current_lat: number
          current_lng: number
          distance_km: number
          last_offer_at: string
          location_updated_at: string
          reliability_score: number
          rider_id: string
          today_deliveries: number
          user_id: string
          vehicle_type: string
        }[]
      }
      find_nearby_scrape_jobs: {
        Args: {
          p_lat: number
          p_limit?: number
          p_lng: number
          p_platform?: string
          p_radius_m?: number
          p_search?: string
        }
        Returns: {
          claimed_by_vendor_id: string
          created_at: string
          distance_m: number
          extracted_metadata: Json
          google_place_id: string
          id: string
          places_data: Json
          places_match_confidence: number
          source_type: string
          source_url: string
          status: string
          target_address: string
          target_store_name: string
        }[]
      }
      find_orders_near_point: {
        Args: {
          lat: number
          lng: number
          order_statuses?: string[]
          radius_meters: number
        }
        Returns: {
          distance_meters: number
          order_id: string
        }[]
      }
      find_riders_near_order: {
        Args: { max_results?: number; order_id: string; radius_meters?: number }
        Returns: {
          distance_meters: number
          location_age_seconds: number
          rider_id: string
          rider_name: string
        }[]
      }
      fn_is_vendor_member: { Args: { p_vendor_id: string }; Returns: boolean }
      get_applicable_credit: {
        Args: { p_user_id: string; p_vendor_id: string }
        Returns: number
      }
      get_credit_holders: {
        Args: { p_limit: number; p_offset: number; p_search: string }
        Returns: {
          balance_cents: number
          email: string
          first_name: string
          last_name: string
          phone_number: string
          total_count: number
          user_id: string
        }[]
      }
      get_credit_liability: {
        Args: never
        Returns: {
          customers: number
          issued_30d_cents: number
          spent_30d_cents: number
          total_cents: number
        }[]
      }
      get_current_surge_multiplier: {
        Args: { p_region?: string }
        Returns: {
          multiplier: number
          name: string
        }[]
      }
      get_delivery_fee: {
        Args: { p_distance_km: number; p_location_id: string }
        Returns: number
      }
      get_location_delivery_zone_geojson: {
        Args: { p_location_id: string }
        Returns: string
      }
      get_order_distance_km: { Args: { order_id: string }; Returns: number }
      get_platform_service_area_geojson: {
        Args: { p_area_id: string }
        Returns: string
      }
      get_rider_notification_settings: {
        Args: { p_user_id: string }
        Returns: {
          created_at: string | null
          delivery_updates: boolean | null
          id: string
          payment_received: boolean | null
          security_alerts: boolean | null
          updated_at: string | null
          user_id: string
        }
        SetofOptions: {
          from: "*"
          to: "rider_notification_settings"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      get_user_achievement_count: {
        Args: { user_id_input: string }
        Returns: number
      }
      get_user_notification_settings: {
        Args: { p_user_id: string }
        Returns: {
          basket_reminders: boolean | null
          chat_channel_updates: boolean | null
          chat_member_updates: boolean | null
          chat_messages: boolean | null
          chat_reactions: boolean | null
          created_at: string | null
          email_order_updates: boolean | null
          email_promotions: boolean | null
          email_receipts: boolean | null
          email_weekly_summary: boolean | null
          order_updates: boolean | null
          promotions: boolean | null
          security_alerts: boolean | null
          updated_at: string | null
          user_id: string
          vendor_status_updates: boolean | null
        }
        SetofOptions: {
          from: "*"
          to: "notification_settings"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      get_user_workout_calendar: {
        Args: { end_date: string; start_date: string; user_id_input: string }
        Returns: {
          program_id: string
          program_name: string
          total_volume: number
          workout_count: number
          workout_date: string
        }[]
      }
      get_user_workout_logs: {
        Args: { user_id_input: string }
        Returns: {
          duration_min: number
          id: string
          name: string
          performed_at: string
          total_volume: number
        }[]
      }
      get_vendor_notification_settings: {
        Args: { p_user_id: string; p_vendor_id: string }
        Returns: {
          chat_messages: boolean | null
          chat_reactions: boolean | null
          created_at: string | null
          email_account_alerts: boolean | null
          email_daily_summary: boolean | null
          email_disputes: boolean | null
          email_low_stock: boolean | null
          email_new_orders: boolean | null
          email_order_completed: boolean | null
          email_payment_received: boolean | null
          email_payout_processed: boolean | null
          email_promotions: boolean | null
          email_reviews: boolean | null
          email_weekly_summary: boolean | null
          id: string
          low_stock_alerts: boolean | null
          new_orders: boolean | null
          order_updates: boolean | null
          payment_received: boolean | null
          payout_processed: boolean | null
          promotions: boolean | null
          review_alerts: boolean | null
          security_alerts: boolean | null
          updated_at: string | null
          user_id: string
          vendor_id: string
        }
        SetofOptions: {
          from: "*"
          to: "vendor_notification_settings"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      get_vendor_order_customers: {
        Args: { p_parent_order_ids: string[] }
        Returns: {
          customer_id: string
          delivery_instructions: string
          dropoff_location: Json
          first_name: string
          id: string
          last_name: string
          payment_status: string
          phone_number: string
        }[]
      }
      get_workout_log_details: { Args: { log_id_input: string }; Returns: Json }
      get_workouts_for_program: {
        Args: { program_id_input: string }
        Returns: {
          id: string
          mesocycle_name: string
          name: string
          order_index: number
        }[]
      }
      grant_campaign_credit: {
        Args: {
          p_amount_cents: number
          p_campaign_key: string
          p_kind: string
          p_reason: string
          p_user_id: string
          p_vendor_id: string
        }
        Returns: string
      }
      grant_customer_credit: {
        Args: {
          p_amount_cents: number
          p_issued_by: string
          p_kind: string
          p_order_id?: string
          p_reason: string
          p_user_id: string
          p_vendor_id: string
        }
        Returns: string
      }
      insert_vendor_document_version: {
        Args: {
          p_document_id: string
          p_expiry_date: string
          p_file_hash_sha256: string
          p_file_mime: string
          p_file_path: string
          p_file_size: number
          p_issued_by?: string
          p_issued_date?: string
          p_notes?: string
          p_reference_number?: string
        }
        Returns: {
          document_id: string
          expiry_date: string
          file_hash_sha256: string | null
          file_mime: string | null
          file_path: string
          file_size: number | null
          id: string
          is_current: boolean
          issued_by: string | null
          issued_date: string | null
          ocr_extracted: Json | null
          reference_number: string | null
          uploaded_at: string
          uploaded_by_user_id: string | null
        }
        SetofOptions: {
          from: "*"
          to: "vendor_document_versions"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      is_customer_in_delivery_zone: {
        Args: {
          p_customer_lat: number
          p_customer_lng: number
          p_location_id: string
        }
        Returns: boolean
      }
      is_customer_in_platform_service_area: {
        Args: {
          p_customer_lat: number
          p_customer_lng: number
          p_region?: string
        }
        Returns: boolean
      }
      is_vendor_manager: { Args: { p_vendor_id: string }; Returns: boolean }
      is_vendor_member_folder: { Args: { p_folder: string }; Returns: boolean }
      lead_intel_stats: { Args: never; Returns: Json }
      next_order_number: {
        Args: { p_location_id: string; p_storefront_id: string }
        Returns: number
      }
      price_index_take_budget: {
        Args: { p_key: string; p_max: number; p_n: number }
        Returns: boolean
      }
      price_source_comparison: {
        Args: { p_source_id: string }
        Returns: {
          match_key: string
          others_count: number
          others_median_cents: number
          own_price_cents: number
        }[]
      }
      quick_expand_service_area: {
        Args: {
          p_lat: number
          p_lng: number
          p_name: string
          p_radius_m: number
        }
        Returns: string
      }
      receive_purchase_order: {
        Args: {
          p_has_issues?: boolean
          p_invoice_number?: string
          p_invoice_total?: number
          p_lines: Json
          p_notes?: string
          p_purchase_order_id: string
        }
        Returns: string
      }
      refresh_lead_intel_mv: { Args: never; Returns: undefined }
      refresh_mv_vendor_customer_rfm: { Args: never; Returns: undefined }
      reverse_order_credit: {
        Args: { p_order_id: string; p_reason: string }
        Returns: number
      }
      revoke_customer_credit: {
        Args: {
          p_issued_by: string
          p_reason: string
          p_user_id: string
          p_vendor_id: string
        }
        Returns: number
      }
      search_price_items: {
        Args: {
          p_food?: boolean
          p_fuzzy?: boolean
          p_in_stock_only?: boolean
          p_include_online?: boolean
          p_lat?: number
          p_limit?: number
          p_lng?: number
          p_max_price_cents?: number
          p_offset?: number
          p_query: string
          p_radius_km?: number
        }
        Returns: {
          brand: string
          city: string
          compare_at_cents: number
          distance_km: number
          gtin: string
          hours: Json
          image_url: string
          in_stock: boolean
          item_id: string
          last_seen_at: string
          lat: number
          lng: number
          location_precision: string
          match_key: string
          online_only: boolean
          price_cents: number
          rating: number
          review_count: number
          score: number
          source_id: string
          source_kind: string
          source_name: string
          source_rating: number
          source_review_count: number
          storefront_id: string
          text_rank: number
          title: string
          url: string
        }[]
      }
      search_vendor_orders_by_customer: {
        Args: { p_limit?: number; p_query: string; p_vendor_id: string }
        Returns: string[]
      }
      set_location_delivery_zone: {
        Args: { p_geojson: string; p_location_id: string }
        Returns: undefined
      }
      set_platform_service_area: {
        Args: { p_area_id: string; p_geojson: string }
        Returns: undefined
      }
      set_scrape_job_geo_point: {
        Args: { p_job_id: string; p_lat: number; p_lng: number }
        Returns: undefined
      }
      show_limit: { Args: never; Returns: number }
      show_trgm: { Args: { "": string }; Returns: string[] }
      slugify: { Args: { s: string }; Returns: string }
      soft_delete_storefront: {
        Args: { storefront_uuid: string }
        Returns: {
          message: string
          order_count: number
          success: boolean
        }[]
      }
      spend_customer_credit: {
        Args: {
          p_amount_cents: number
          p_order_id: string
          p_user_id: string
          p_vendor_id: string
        }
        Returns: number
      }
      storefront_ids_in_customer_service_area: {
        Args: {
          p_customer_lat: number
          p_customer_lng: number
          p_region?: string
        }
        Returns: string[]
      }
      unaccent: { Args: { "": string }; Returns: string }
      upsert_price_sources: { Args: { p_rows: Json }; Returns: number }
      upsert_vendor_document: {
        Args: {
          p_category_slug: string
          p_jurisdiction: string
          p_location_id?: string
          p_vendor_id: string
          p_vendor_staff_id?: string
        }
        Returns: {
          category_slug: string
          created_at: string
          current_version_id: string | null
          expiry_date: string | null
          id: string
          jurisdiction: string
          location_id: string | null
          notes: string | null
          reference_number: string | null
          status: Database["public"]["Enums"]["compliance_document_status"]
          updated_at: string
          vendor_id: string
          vendor_staff_id: string | null
        }
        SetofOptions: {
          from: "*"
          to: "vendor_documents"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      user_has_achievement: {
        Args: { achievement_code_input: string; user_id_input: string }
        Returns: boolean
      }
      vendor_analytics_channels: {
        Args: { p_days?: number; p_tz?: string; p_vendor_id: string }
        Returns: Json
      }
      vendor_analytics_customers: {
        Args: { p_tz?: string; p_vendor_id: string }
        Returns: Json
      }
      vendor_analytics_revenue: {
        Args: { p_days?: number; p_tz?: string; p_vendor_id: string }
        Returns: Json
      }
      vendor_today_stats: {
        Args: { p_tz?: string; p_vendor_id: string }
        Returns: Json
      }
    }
    Enums: {
      compliance_business_type:
        | "restaurant"
        | "cafe"
        | "dark_kitchen"
        | "market_stall"
        | "food_truck"
        | "bakery"
        | "caterer"
        | "other"
      compliance_criticality: "critical" | "high" | "normal"
      compliance_document_scope: "vendor" | "location" | "staff"
      compliance_document_status:
        | "valid"
        | "expiring_soon"
        | "expired"
        | "missing"
      customer_audit_action:
        | "view_list"
        | "view_detail"
        | "export"
        | "merge"
        | "note_added"
        | "tag_added"
        | "tag_removed"
        | "edit"
        | "block"
        | "unblock"
        | "delete"
      customer_blast_channel: "push" | "sms" | "email"
      customer_blast_recipient_status:
        | "queued"
        | "sent"
        | "delivered"
        | "failed"
        | "opened"
        | "clicked"
        | "converted"
        | "opted_out"
        | "rate_limited"
        | "quiet_hours_skipped"
      customer_blast_status:
        | "draft"
        | "scheduled"
        | "sending"
        | "sent"
        | "failed"
        | "cancelled"
      customer_comm_channel:
        | "order"
        | "push"
        | "sms"
        | "email"
        | "inbox"
        | "system"
      customer_comm_direction: "inbound" | "outbound"
      customer_identity_kind: "email" | "phone" | "device"
      customer_lifecycle_stage:
        | "new"
        | "active"
        | "regular"
        | "vip"
        | "dormant"
        | "at_risk"
        | "lost"
        | "blocked"
      customer_winback_run_status: "queued" | "running" | "completed" | "failed"
      customer_winback_trigger: "dormant_days"
      delivery_provider: "platform" | "own"
      order_payment_status:
        | "pending"
        | "processing"
        | "completed"
        | "failed"
        | "refunded"
        | "partially_refunded"
      pos_payment_method: "card" | "cash" | "split"
      pos_shift_status: "open" | "closed"
      staff_assignment_scope:
        | "vendor_wide"
        | "storefront_specific"
        | "location_specific_all_storefronts_at_location"
        | "location_specific"
      user_notification_types:
        | "order_update"
        | "chat_message"
        | "promotion"
        | "security_alert"
        | "basket_reminder"
        | "vendor_status"
        | "chat_reaction"
        | "chat_member"
        | "chat_update"
        | "chat_unread"
        | "payout"
        | "payment"
        | "menu_import"
        | "compliance_alert"
        | "vendor_signup"
        | "consumer_signup"
        | "activity_digest"
        | "cron_run"
        | "auth_email"
        | "posthog_event"
        | "sentry_issue"
        | "infra"
        | "growth_event"
      vendor_shift_status: "draft" | "published" | "swap_pending" | "cancelled"
      vendor_shift_swap_status:
        | "open"
        | "accepted"
        | "manager_approved"
        | "manager_rejected"
        | "cancelled"
      vendor_staff_scope_types:
        | "vendor_wide"
        | "storefront_specific"
        | "location_specific"
        | "location_specific_all_storefronts_at_location"
      vendor_staff_status: "active" | "on_holiday" | "suspended"
      vendor_time_punch_source: "app" | "manager_edit"
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
    Enums: {
      compliance_business_type: [
        "restaurant",
        "cafe",
        "dark_kitchen",
        "market_stall",
        "food_truck",
        "bakery",
        "caterer",
        "other",
      ],
      compliance_criticality: ["critical", "high", "normal"],
      compliance_document_scope: ["vendor", "location", "staff"],
      compliance_document_status: [
        "valid",
        "expiring_soon",
        "expired",
        "missing",
      ],
      customer_audit_action: [
        "view_list",
        "view_detail",
        "export",
        "merge",
        "note_added",
        "tag_added",
        "tag_removed",
        "edit",
        "block",
        "unblock",
        "delete",
      ],
      customer_blast_channel: ["push", "sms", "email"],
      customer_blast_recipient_status: [
        "queued",
        "sent",
        "delivered",
        "failed",
        "opened",
        "clicked",
        "converted",
        "opted_out",
        "rate_limited",
        "quiet_hours_skipped",
      ],
      customer_blast_status: [
        "draft",
        "scheduled",
        "sending",
        "sent",
        "failed",
        "cancelled",
      ],
      customer_comm_channel: [
        "order",
        "push",
        "sms",
        "email",
        "inbox",
        "system",
      ],
      customer_comm_direction: ["inbound", "outbound"],
      customer_identity_kind: ["email", "phone", "device"],
      customer_lifecycle_stage: [
        "new",
        "active",
        "regular",
        "vip",
        "dormant",
        "at_risk",
        "lost",
        "blocked",
      ],
      customer_winback_run_status: ["queued", "running", "completed", "failed"],
      customer_winback_trigger: ["dormant_days"],
      delivery_provider: ["platform", "own"],
      order_payment_status: [
        "pending",
        "processing",
        "completed",
        "failed",
        "refunded",
        "partially_refunded",
      ],
      pos_payment_method: ["card", "cash", "split"],
      pos_shift_status: ["open", "closed"],
      staff_assignment_scope: [
        "vendor_wide",
        "storefront_specific",
        "location_specific_all_storefronts_at_location",
        "location_specific",
      ],
      user_notification_types: [
        "order_update",
        "chat_message",
        "promotion",
        "security_alert",
        "basket_reminder",
        "vendor_status",
        "chat_reaction",
        "chat_member",
        "chat_update",
        "chat_unread",
        "payout",
        "payment",
        "menu_import",
        "compliance_alert",
        "vendor_signup",
        "consumer_signup",
        "activity_digest",
        "cron_run",
        "auth_email",
        "posthog_event",
        "sentry_issue",
        "infra",
        "growth_event",
      ],
      vendor_shift_status: ["draft", "published", "swap_pending", "cancelled"],
      vendor_shift_swap_status: [
        "open",
        "accepted",
        "manager_approved",
        "manager_rejected",
        "cancelled",
      ],
      vendor_staff_scope_types: [
        "vendor_wide",
        "storefront_specific",
        "location_specific",
        "location_specific_all_storefronts_at_location",
      ],
      vendor_staff_status: ["active", "on_holiday", "suspended"],
      vendor_time_punch_source: ["app", "manager_edit"],
    },
  },
} as const

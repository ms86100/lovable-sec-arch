export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  public: {
    Tables: {
      backlog_dependencies: {
        Row: {
          created_at: string
          created_by: string | null
          dependency_type: Database["public"]["Enums"]["dependency_type"]
          id: string
          notes: string | null
          source_item_id: string
          status: string | null
          target_item_id: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          dependency_type?: Database["public"]["Enums"]["dependency_type"]
          id?: string
          notes?: string | null
          source_item_id: string
          status?: string | null
          target_item_id: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          dependency_type?: Database["public"]["Enums"]["dependency_type"]
          id?: string
          notes?: string | null
          source_item_id?: string
          status?: string | null
          target_item_id?: string
        }
        Relationships: []
      }
      backlog_item_okrs: {
        Row: {
          backlog_item_id: string
          contribution_weight: number | null
          id: string
          okr_id: string
        }
        Insert: {
          backlog_item_id: string
          contribution_weight?: number | null
          id?: string
          okr_id: string
        }
        Update: {
          backlog_item_id?: string
          contribution_weight?: number | null
          id?: string
          okr_id?: string
        }
        Relationships: []
      }
      backlog_item_personas: {
        Row: {
          backlog_item_id: string
          id: string
          persona_id: string
        }
        Insert: {
          backlog_item_id: string
          id?: string
          persona_id: string
        }
        Update: {
          backlog_item_id?: string
          id?: string
          persona_id?: string
        }
        Relationships: []
      }
      backlog_items: {
        Row: {
          acceptance_criteria: string | null
          actual_hours: number | null
          assignee_id: string | null
          business_value: number | null
          completed_date: string | null
          created_at: string
          created_by: string | null
          custom_fields: Json | null
          definition_of_done: string | null
          description: string | null
          due_date: string | null
          epic_id: string | null
          estimated_hours: number | null
          id: string
          item_type: Database["public"]["Enums"]["backlog_item_type"]
          order_index: number | null
          parent_id: string | null
          priority: Database["public"]["Enums"]["backlog_priority"]
          project_id: string
          reporter_id: string | null
          risk_score: number | null
          start_date: string | null
          status: Database["public"]["Enums"]["backlog_status"]
          story_points: number | null
          strategic_alignment_score: number | null
          tags: string[] | null
          tech_complexity_score: number | null
          title: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          acceptance_criteria?: string | null
          actual_hours?: number | null
          assignee_id?: string | null
          business_value?: number | null
          completed_date?: string | null
          created_at?: string
          created_by?: string | null
          custom_fields?: Json | null
          definition_of_done?: string | null
          description?: string | null
          due_date?: string | null
          epic_id?: string | null
          estimated_hours?: number | null
          id?: string
          item_type?: Database["public"]["Enums"]["backlog_item_type"]
          order_index?: number | null
          parent_id?: string | null
          priority?: Database["public"]["Enums"]["backlog_priority"]
          project_id: string
          reporter_id?: string | null
          risk_score?: number | null
          start_date?: string | null
          status?: Database["public"]["Enums"]["backlog_status"]
          story_points?: number | null
          strategic_alignment_score?: number | null
          tags?: string[] | null
          tech_complexity_score?: number | null
          title: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          acceptance_criteria?: string | null
          actual_hours?: number | null
          assignee_id?: string | null
          business_value?: number | null
          completed_date?: string | null
          created_at?: string
          created_by?: string | null
          custom_fields?: Json | null
          definition_of_done?: string | null
          description?: string | null
          due_date?: string | null
          epic_id?: string | null
          estimated_hours?: number | null
          id?: string
          item_type?: Database["public"]["Enums"]["backlog_item_type"]
          order_index?: number | null
          parent_id?: string | null
          priority?: Database["public"]["Enums"]["backlog_priority"]
          project_id?: string
          reporter_id?: string | null
          risk_score?: number | null
          start_date?: string | null
          status?: Database["public"]["Enums"]["backlog_status"]
          story_points?: number | null
          strategic_alignment_score?: number | null
          tags?: string[] | null
          tech_complexity_score?: number | null
          title?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      custom_fields: {
        Row: {
          created_at: string
          created_by: string | null
          default_value: string | null
          dropdown_options: string[] | null
          field_key: string
          field_type: string
          help_text: string | null
          id: string
          is_required: boolean | null
          name: string
          updated_at: string
          updated_by: string | null
          validation_rules: Json | null
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          default_value?: string | null
          dropdown_options?: string[] | null
          field_key: string
          field_type: string
          help_text?: string | null
          id?: string
          is_required?: boolean | null
          name: string
          updated_at?: string
          updated_by?: string | null
          validation_rules?: Json | null
        }
        Update: {
          created_at?: string
          created_by?: string | null
          default_value?: string | null
          dropdown_options?: string[] | null
          field_key?: string
          field_type?: string
          help_text?: string | null
          id?: string
          is_required?: boolean | null
          name?: string
          updated_at?: string
          updated_by?: string | null
          validation_rules?: Json | null
        }
        Relationships: []
      }
      discussion_action_items: {
        Row: {
          created_at: string
          created_by: string | null
          discussion_id: string
          id: string
          owner_id: string | null
          status: string
          target_date: string | null
          task_description: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          discussion_id: string
          id?: string
          owner_id?: string | null
          status?: string
          target_date?: string | null
          task_description: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          created_at?: string
          created_by?: string | null
          discussion_id?: string
          id?: string
          owner_id?: string | null
          status?: string
          target_date?: string | null
          task_description?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_discussion"
            columns: ["discussion_id"]
            isOneToOne: false
            referencedRelation: "project_discussions"
            referencedColumns: ["id"]
          },
        ]
      }
      discussion_change_log: {
        Row: {
          action_item_id: string | null
          change_type: string
          changed_at: string
          changed_by: string | null
          discussion_id: string | null
          field_name: string | null
          id: string
          new_value: string | null
          old_value: string | null
        }
        Insert: {
          action_item_id?: string | null
          change_type: string
          changed_at?: string
          changed_by?: string | null
          discussion_id?: string | null
          field_name?: string | null
          id?: string
          new_value?: string | null
          old_value?: string | null
        }
        Update: {
          action_item_id?: string | null
          change_type?: string
          changed_at?: string
          changed_by?: string | null
          discussion_id?: string | null
          field_name?: string | null
          id?: string
          new_value?: string | null
          old_value?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_action_item_log"
            columns: ["action_item_id"]
            isOneToOne: false
            referencedRelation: "discussion_action_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_discussion_log"
            columns: ["discussion_id"]
            isOneToOne: false
            referencedRelation: "project_discussions"
            referencedColumns: ["id"]
          },
        ]
      }
      feasibility_assessments: {
        Row: {
          created_at: string
          created_by: string | null
          decision: string
          financial: Json
          financial_score: number
          id: string
          operational: Json
          operational_score: number
          project_id: string
          technical: Json
          technical_score: number
          total_score: number
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          decision?: string
          financial?: Json
          financial_score?: number
          id?: string
          operational?: Json
          operational_score?: number
          project_id: string
          technical?: Json
          technical_score?: number
          total_score?: number
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          created_at?: string
          created_by?: string | null
          decision?: string
          financial?: Json
          financial_score?: number
          id?: string
          operational?: Json
          operational_score?: number
          project_id?: string
          technical?: Json
          technical_score?: number
          total_score?: number
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      iteration_items: {
        Row: {
          backlog_item_id: string
          committed: boolean | null
          id: string
          iteration_id: string
          order_index: number | null
        }
        Insert: {
          backlog_item_id: string
          committed?: boolean | null
          id?: string
          iteration_id: string
          order_index?: number | null
        }
        Update: {
          backlog_item_id?: string
          committed?: boolean | null
          id?: string
          iteration_id?: string
          order_index?: number | null
        }
        Relationships: []
      }
      iteration_members: {
        Row: {
          availability_percent: number
          created_at: string
          created_by: string | null
          id: string
          iteration_id: string
          member_id: string | null
          role: string | null
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          availability_percent?: number
          created_at?: string
          created_by?: string | null
          id?: string
          iteration_id: string
          member_id?: string | null
          role?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          availability_percent?: number
          created_at?: string
          created_by?: string | null
          id?: string
          iteration_id?: string
          member_id?: string | null
          role?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "iteration_members_iteration_id_fkey"
            columns: ["iteration_id"]
            isOneToOne: false
            referencedRelation: "iterations"
            referencedColumns: ["id"]
          },
        ]
      }
      iterations: {
        Row: {
          capacity_points: number | null
          committed_points: number | null
          created_at: string
          created_by: string | null
          delivered_points: number | null
          description: string | null
          end_date: string
          id: string
          name: string
          pi_id: string
          start_date: string
          status: string | null
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          capacity_points?: number | null
          committed_points?: number | null
          created_at?: string
          created_by?: string | null
          delivered_points?: number | null
          description?: string | null
          end_date: string
          id?: string
          name: string
          pi_id: string
          start_date: string
          status?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          capacity_points?: number | null
          committed_points?: number | null
          created_at?: string
          created_by?: string | null
          delivered_points?: number | null
          description?: string | null
          end_date?: string
          id?: string
          name?: string
          pi_id?: string
          start_date?: string
          status?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_iterations_program_increment"
            columns: ["pi_id"]
            isOneToOne: false
            referencedRelation: "program_increments"
            referencedColumns: ["id"]
          },
        ]
      }
      monte_carlo_runs: {
        Row: {
          created_at: string
          created_by: string | null
          id: string
          inputs: Json | null
          outputs: Json | null
          runs: number
          scenario_id: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          id?: string
          inputs?: Json | null
          outputs?: Json | null
          runs?: number
          scenario_id: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          id?: string
          inputs?: Json | null
          outputs?: Json | null
          runs?: number
          scenario_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "monte_carlo_runs_scenario_id_fkey"
            columns: ["scenario_id"]
            isOneToOne: false
            referencedRelation: "what_if_scenarios"
            referencedColumns: ["id"]
          },
        ]
      }
      okrs: {
        Row: {
          completion_percentage: number | null
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          key_results: Json
          objective_text: string
          owner_id: string | null
          project_id: string
          quarter: string
          status: string | null
          title: string
          updated_at: string
          updated_by: string | null
          year: number
        }
        Insert: {
          completion_percentage?: number | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          key_results?: Json
          objective_text: string
          owner_id?: string | null
          project_id: string
          quarter: string
          status?: string | null
          title: string
          updated_at?: string
          updated_by?: string | null
          year: number
        }
        Update: {
          completion_percentage?: number | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          key_results?: Json
          objective_text?: string
          owner_id?: string | null
          project_id?: string
          quarter?: string
          status?: string | null
          title?: string
          updated_at?: string
          updated_by?: string | null
          year?: number
        }
        Relationships: []
      }
      personas: {
        Row: {
          avatar_url: string | null
          created_at: string
          created_by: string | null
          description: string | null
          frustrations: string | null
          goals: string | null
          id: string
          name: string
          project_id: string
          role: string | null
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          frustrations?: string | null
          goals?: string | null
          id?: string
          name: string
          project_id: string
          role?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          frustrations?: string | null
          goals?: string | null
          id?: string
          name?: string
          project_id?: string
          role?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      products: {
        Row: {
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          name: string
          owner_id: string
          tags: string[] | null
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          name: string
          owner_id: string
          tags?: string[] | null
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          name?: string
          owner_id?: string
          tags?: string[] | null
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string | null
          first_name: string | null
          id: string
          last_name: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      program_increments: {
        Row: {
          capacity_points: number | null
          committed_points: number | null
          created_at: string
          created_by: string | null
          delivered_points: number | null
          description: string | null
          end_date: string
          id: string
          name: string
          objectives: Json | null
          project_id: string
          start_date: string
          status: string | null
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          capacity_points?: number | null
          committed_points?: number | null
          created_at?: string
          created_by?: string | null
          delivered_points?: number | null
          description?: string | null
          end_date: string
          id?: string
          name: string
          objectives?: Json | null
          project_id: string
          start_date: string
          status?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          capacity_points?: number | null
          committed_points?: number | null
          created_at?: string
          created_by?: string | null
          delivered_points?: number | null
          description?: string | null
          end_date?: string
          id?: string
          name?: string
          objectives?: Json | null
          project_id?: string
          start_date?: string
          status?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      project_aop: {
        Row: {
          activity: string
          amount_eur: number | null
          aop_year: number | null
          approver: string | null
          category: string
          created_at: string
          created_by: string | null
          id: string
          impact_risk_associated: string | null
          project_id: string
          task_description: string | null
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          activity: string
          amount_eur?: number | null
          aop_year?: number | null
          approver?: string | null
          category: string
          created_at?: string
          created_by?: string | null
          id?: string
          impact_risk_associated?: string | null
          project_id: string
          task_description?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          activity?: string
          amount_eur?: number | null
          aop_year?: number | null
          approver?: string | null
          category?: string
          created_at?: string
          created_by?: string | null
          id?: string
          impact_risk_associated?: string | null
          project_id?: string
          task_description?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      project_budget_items: {
        Row: {
          actual_amount: number | null
          category: string
          created_at: string
          created_by: string | null
          date_incurred: string | null
          description: string | null
          id: string
          item_name: string
          planned_amount: number
          project_id: string
          quotation_link: string | null
          rfq_rom_link: string | null
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          actual_amount?: number | null
          category: string
          created_at?: string
          created_by?: string | null
          date_incurred?: string | null
          description?: string | null
          id?: string
          item_name: string
          planned_amount?: number
          project_id: string
          quotation_link?: string | null
          rfq_rom_link?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          actual_amount?: number | null
          category?: string
          created_at?: string
          created_by?: string | null
          date_incurred?: string | null
          description?: string | null
          id?: string
          item_name?: string
          planned_amount?: number
          project_id?: string
          quotation_link?: string | null
          rfq_rom_link?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      project_custom_values: {
        Row: {
          created_at: string
          custom_field_id: string
          field_value: string | null
          id: string
          project_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          custom_field_id: string
          field_value?: string | null
          id?: string
          project_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          custom_field_id?: string
          field_value?: string | null
          id?: string
          project_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_custom_values_custom_field_id_fkey"
            columns: ["custom_field_id"]
            isOneToOne: false
            referencedRelation: "custom_fields"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_custom_values_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_discussions: {
        Row: {
          attendees: Json | null
          created_at: string
          created_by: string | null
          id: string
          meeting_date: string
          meeting_title: string
          project_id: string
          summary_notes: string | null
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          attendees?: Json | null
          created_at?: string
          created_by?: string | null
          id?: string
          meeting_date: string
          meeting_title: string
          project_id: string
          summary_notes?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          attendees?: Json | null
          created_at?: string
          created_by?: string | null
          id?: string
          meeting_date?: string
          meeting_title?: string
          project_id?: string
          summary_notes?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      project_documentation: {
        Row: {
          created_at: string
          created_by: string | null
          document_name: string
          document_url: string | null
          id: string
          last_updated_date: string
          project_id: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          document_name: string
          document_url?: string | null
          id?: string
          last_updated_date: string
          project_id: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          created_at?: string
          created_by?: string | null
          document_name?: string
          document_url?: string | null
          id?: string
          last_updated_date?: string
          project_id?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_documentation_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_issues: {
        Row: {
          assigned_to: string | null
          attachments: Json | null
          closed_at: string | null
          created_at: string
          description: string | null
          id: string
          issue_type: string
          labels: string[] | null
          priority: string
          project_id: string
          reported_by: string | null
          resolution_notes: string | null
          resolution_timeline: string | null
          resolved_at: string | null
          severity: string
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          assigned_to?: string | null
          attachments?: Json | null
          closed_at?: string | null
          created_at?: string
          description?: string | null
          id?: string
          issue_type?: string
          labels?: string[] | null
          priority?: string
          project_id: string
          reported_by?: string | null
          resolution_notes?: string | null
          resolution_timeline?: string | null
          resolved_at?: string | null
          severity?: string
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          assigned_to?: string | null
          attachments?: Json | null
          closed_at?: string | null
          created_at?: string
          description?: string | null
          id?: string
          issue_type?: string
          labels?: string[] | null
          priority?: string
          project_id?: string
          reported_by?: string | null
          resolution_notes?: string | null
          resolution_timeline?: string | null
          resolved_at?: string | null
          severity?: string
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_issues_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_milestones: {
        Row: {
          created_at: string
          created_by: string | null
          description: string | null
          due_date: string | null
          id: string
          progress: number | null
          project_id: string
          status: string
          title: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          progress?: number | null
          project_id: string
          status?: string
          title: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          progress?: number | null
          project_id?: string
          status?: string
          title?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      project_raci_matrix: {
        Row: {
          accountable_id: string | null
          accountable_type: string | null
          activity_name: string
          consulted_ids: Json | null
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          informed_ids: Json | null
          project_id: string
          responsible_id: string | null
          responsible_type: string | null
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          accountable_id?: string | null
          accountable_type?: string | null
          activity_name: string
          consulted_ids?: Json | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          informed_ids?: Json | null
          project_id: string
          responsible_id?: string | null
          responsible_type?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          accountable_id?: string | null
          accountable_type?: string | null
          activity_name?: string
          consulted_ids?: Json | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          informed_ids?: Json | null
          project_id?: string
          responsible_id?: string | null
          responsible_type?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      project_risks: {
        Row: {
          assigned_to: string | null
          category: string | null
          created_at: string
          created_by: string | null
          description: string | null
          due_date: string | null
          id: string
          impact: string
          mitigation_strategy: string | null
          probability: string
          project_id: string
          resolution_date: string | null
          resolution_notes: string | null
          risk_owner: string | null
          risk_score: number | null
          severity_level: string
          status: string
          title: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          assigned_to?: string | null
          category?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          impact?: string
          mitigation_strategy?: string | null
          probability?: string
          project_id: string
          resolution_date?: string | null
          resolution_notes?: string | null
          risk_owner?: string | null
          risk_score?: number | null
          severity_level?: string
          status?: string
          title: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          assigned_to?: string | null
          category?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          impact?: string
          mitigation_strategy?: string | null
          probability?: string
          project_id?: string
          resolution_date?: string | null
          resolution_notes?: string | null
          risk_owner?: string | null
          risk_score?: number | null
          severity_level?: string
          status?: string
          title?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_risks_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_security_compliance: {
        Row: {
          created_at: string
          created_by: string | null
          data_compliance_last_assessment: string | null
          export_control_status: string | null
          id: string
          project_id: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          data_compliance_last_assessment?: string | null
          export_control_status?: string | null
          id?: string
          project_id: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          created_at?: string
          created_by?: string | null
          data_compliance_last_assessment?: string | null
          export_control_status?: string | null
          id?: string
          project_id?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_security_compliance_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_servers: {
        Row: {
          assessment_type: string | null
          configuration_details: Json | null
          created_at: string
          created_by: string | null
          environment: string
          id: string
          notes: string | null
          project_id: string
          server_name: string
          server_type: string | null
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          assessment_type?: string | null
          configuration_details?: Json | null
          created_at?: string
          created_by?: string | null
          environment: string
          id?: string
          notes?: string | null
          project_id: string
          server_name: string
          server_type?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          assessment_type?: string | null
          configuration_details?: Json | null
          created_at?: string
          created_by?: string | null
          environment?: string
          id?: string
          notes?: string | null
          project_id?: string
          server_name?: string
          server_type?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_servers_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_stakeholders: {
        Row: {
          contact_info: Json | null
          created_at: string
          created_by: string | null
          department: string | null
          email: string | null
          id: string
          influence_level: string
          is_internal: boolean | null
          name: string
          notes: string | null
          project_id: string
          raci_role: string | null
          role: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          contact_info?: Json | null
          created_at?: string
          created_by?: string | null
          department?: string | null
          email?: string | null
          id?: string
          influence_level?: string
          is_internal?: boolean | null
          name: string
          notes?: string | null
          project_id: string
          raci_role?: string | null
          role: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          contact_info?: Json | null
          created_at?: string
          created_by?: string | null
          department?: string | null
          email?: string | null
          id?: string
          influence_level?: string
          is_internal?: boolean | null
          name?: string
          notes?: string | null
          project_id?: string
          raci_role?: string | null
          role?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_stakeholders_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_status_updates: {
        Row: {
          achievements: string | null
          budget_spent: number | null
          challenges: string | null
          created_at: string
          id: string
          milestone_reached: string | null
          next_steps: string | null
          progress_percentage: number | null
          project_id: string
          summary: string
          update_date: string
          updated_by: string | null
        }
        Insert: {
          achievements?: string | null
          budget_spent?: number | null
          challenges?: string | null
          created_at?: string
          id?: string
          milestone_reached?: string | null
          next_steps?: string | null
          progress_percentage?: number | null
          project_id: string
          summary: string
          update_date?: string
          updated_by?: string | null
        }
        Update: {
          achievements?: string | null
          budget_spent?: number | null
          challenges?: string | null
          created_at?: string
          id?: string
          milestone_reached?: string | null
          next_steps?: string | null
          progress_percentage?: number | null
          project_id?: string
          summary?: string
          update_date?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_status_updates_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_suppliers: {
        Row: {
          access_level: string | null
          company_name: string
          contact_info: Json | null
          contract_end_date: string | null
          contract_start_date: string | null
          contract_value: number | null
          created_at: string
          created_by: string | null
          focal_point_email: string | null
          focal_point_name: string | null
          id: string
          is_internal: boolean | null
          notes: string | null
          project_id: string
          roles_assigned: string[] | null
          supplier_type: string | null
          updated_at: string
        }
        Insert: {
          access_level?: string | null
          company_name: string
          contact_info?: Json | null
          contract_end_date?: string | null
          contract_start_date?: string | null
          contract_value?: number | null
          created_at?: string
          created_by?: string | null
          focal_point_email?: string | null
          focal_point_name?: string | null
          id?: string
          is_internal?: boolean | null
          notes?: string | null
          project_id: string
          roles_assigned?: string[] | null
          supplier_type?: string | null
          updated_at?: string
        }
        Update: {
          access_level?: string | null
          company_name?: string
          contact_info?: Json | null
          contract_end_date?: string | null
          contract_start_date?: string | null
          contract_value?: number | null
          created_at?: string
          created_by?: string | null
          focal_point_email?: string | null
          focal_point_name?: string | null
          id?: string
          is_internal?: boolean | null
          notes?: string | null
          project_id?: string
          roles_assigned?: string[] | null
          supplier_type?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_suppliers_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_tasks: {
        Row: {
          created_at: string
          created_by: string | null
          dependencies: Json | null
          description: string | null
          due_date: string | null
          estimated_effort_hours: number | null
          id: string
          milestone_id: string
          mitigation_plan: string | null
          owner_id: string | null
          owner_type: string
          points: number | null
          priority: string
          progress: number | null
          risk_impact: number | null
          risk_level: string | null
          risk_probability: number | null
          status: string
          title: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          dependencies?: Json | null
          description?: string | null
          due_date?: string | null
          estimated_effort_hours?: number | null
          id?: string
          milestone_id: string
          mitigation_plan?: string | null
          owner_id?: string | null
          owner_type?: string
          points?: number | null
          priority?: string
          progress?: number | null
          risk_impact?: number | null
          risk_level?: string | null
          risk_probability?: number | null
          status?: string
          title: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          created_at?: string
          created_by?: string | null
          dependencies?: Json | null
          description?: string | null
          due_date?: string | null
          estimated_effort_hours?: number | null
          id?: string
          milestone_id?: string
          mitigation_plan?: string | null
          owner_id?: string | null
          owner_type?: string
          points?: number | null
          priority?: string
          progress?: number | null
          risk_impact?: number | null
          risk_level?: string | null
          risk_probability?: number | null
          status?: string
          title?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      project_team_members: {
        Row: {
          availability_hours: number | null
          created_at: string
          created_by: string | null
          department: string | null
          email: string | null
          hourly_rate: number | null
          id: string
          is_active: boolean | null
          name: string
          project_id: string
          role: string
          skills: Json | null
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          availability_hours?: number | null
          created_at?: string
          created_by?: string | null
          department?: string | null
          email?: string | null
          hourly_rate?: number | null
          id?: string
          is_active?: boolean | null
          name: string
          project_id: string
          role: string
          skills?: Json | null
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          availability_hours?: number | null
          created_at?: string
          created_by?: string | null
          department?: string | null
          email?: string | null
          hourly_rate?: number | null
          id?: string
          is_active?: boolean | null
          name?: string
          project_id?: string
          role?: string
          skills?: Json | null
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      project_templates: {
        Row: {
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          is_public: boolean | null
          name: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          is_public?: boolean | null
          name: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          is_public?: boolean | null
          name?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      projects: {
        Row: {
          assigned_to: string | null
          budget: number | null
          created_at: string
          created_by: string | null
          description: string | null
          end_date: string | null
          external_company_name: string | null
          id: string
          is_active: boolean | null
          name: string
          operator_type: string | null
          priority: string
          product_id: string
          progress: number | null
          start_date: string | null
          status: string
          template_id: string | null
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          assigned_to?: string | null
          budget?: number | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          end_date?: string | null
          external_company_name?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          operator_type?: string | null
          priority?: string
          product_id: string
          progress?: number | null
          start_date?: string | null
          status?: string
          template_id?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          assigned_to?: string | null
          budget?: number | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          end_date?: string | null
          external_company_name?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          operator_type?: string | null
          priority?: string
          product_id?: string
          progress?: number | null
          start_date?: string | null
          status?: string
          template_id?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "projects_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projects_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "project_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      retrospective_actions: {
        Row: {
          created_at: string
          created_by: string | null
          description: string | null
          due_date: string | null
          id: string
          linked_task_id: string | null
          owner_id: string | null
          retrospective_id: string
          status: string
          target_iteration_id: string | null
          title: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          linked_task_id?: string | null
          owner_id?: string | null
          retrospective_id: string
          status?: string
          target_iteration_id?: string | null
          title: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          linked_task_id?: string | null
          owner_id?: string | null
          retrospective_id?: string
          status?: string
          target_iteration_id?: string | null
          title?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "retrospective_actions_linked_task_id_fkey"
            columns: ["linked_task_id"]
            isOneToOne: false
            referencedRelation: "project_tasks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "retrospective_actions_retrospective_id_fkey"
            columns: ["retrospective_id"]
            isOneToOne: false
            referencedRelation: "retrospectives"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "retrospective_actions_target_iteration_id_fkey"
            columns: ["target_iteration_id"]
            isOneToOne: false
            referencedRelation: "iterations"
            referencedColumns: ["id"]
          },
        ]
      }
      retrospective_lessons: {
        Row: {
          categories: string[] | null
          created_at: string
          created_by: string | null
          description: string
          id: string
          impact: string | null
          retrospective_id: string
          type: string | null
          updated_at: string
        }
        Insert: {
          categories?: string[] | null
          created_at?: string
          created_by?: string | null
          description: string
          id?: string
          impact?: string | null
          retrospective_id: string
          type?: string | null
          updated_at?: string
        }
        Update: {
          categories?: string[] | null
          created_at?: string
          created_by?: string | null
          description?: string
          id?: string
          impact?: string | null
          retrospective_id?: string
          type?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "retrospective_lessons_retrospective_id_fkey"
            columns: ["retrospective_id"]
            isOneToOne: false
            referencedRelation: "retrospectives"
            referencedColumns: ["id"]
          },
        ]
      }
      retrospective_rca: {
        Row: {
          content: Json
          created_at: string
          created_by: string | null
          id: string
          linked_lesson_id: string | null
          method: string
          retrospective_id: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          content?: Json
          created_at?: string
          created_by?: string | null
          id?: string
          linked_lesson_id?: string | null
          method: string
          retrospective_id: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          content?: Json
          created_at?: string
          created_by?: string | null
          id?: string
          linked_lesson_id?: string | null
          method?: string
          retrospective_id?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "retrospective_rca_linked_lesson_id_fkey"
            columns: ["linked_lesson_id"]
            isOneToOne: false
            referencedRelation: "retrospective_lessons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "retrospective_rca_retrospective_id_fkey"
            columns: ["retrospective_id"]
            isOneToOne: false
            referencedRelation: "retrospectives"
            referencedColumns: ["id"]
          },
        ]
      }
      retrospectives: {
        Row: {
          created_at: string
          created_by: string | null
          date: string
          facilitator: string | null
          id: string
          iteration_id: string | null
          notes: string | null
          project_id: string
          status: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          date?: string
          facilitator?: string | null
          id?: string
          iteration_id?: string | null
          notes?: string | null
          project_id: string
          status?: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          created_at?: string
          created_by?: string | null
          date?: string
          facilitator?: string | null
          id?: string
          iteration_id?: string | null
          notes?: string | null
          project_id?: string
          status?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "retrospectives_iteration_id_fkey"
            columns: ["iteration_id"]
            isOneToOne: false
            referencedRelation: "iterations"
            referencedColumns: ["id"]
          },
        ]
      }
      team_capacity: {
        Row: {
          availability_percentage: number | null
          capacity_hours: number | null
          capacity_points: number | null
          created_at: string
          created_by: string | null
          id: string
          iteration_id: string | null
          notes: string | null
          pi_id: string | null
          project_id: string
          team_member_id: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          availability_percentage?: number | null
          capacity_hours?: number | null
          capacity_points?: number | null
          created_at?: string
          created_by?: string | null
          id?: string
          iteration_id?: string | null
          notes?: string | null
          pi_id?: string | null
          project_id: string
          team_member_id: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          availability_percentage?: number | null
          capacity_hours?: number | null
          capacity_points?: number | null
          created_at?: string
          created_by?: string | null
          id?: string
          iteration_id?: string | null
          notes?: string | null
          pi_id?: string | null
          project_id?: string
          team_member_id?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      template_fields: {
        Row: {
          custom_field_id: string
          field_order: number | null
          id: string
          is_required_in_template: boolean | null
          template_default_value: string | null
          template_id: string
        }
        Insert: {
          custom_field_id: string
          field_order?: number | null
          id?: string
          is_required_in_template?: boolean | null
          template_default_value?: string | null
          template_id: string
        }
        Update: {
          custom_field_id?: string
          field_order?: number | null
          id?: string
          is_required_in_template?: boolean | null
          template_default_value?: string | null
          template_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "template_fields_custom_field_id_fkey"
            columns: ["custom_field_id"]
            isOneToOne: false
            referencedRelation: "custom_fields"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "template_fields_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "project_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          assigned_at: string
          assigned_by: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          assigned_at?: string
          assigned_by?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          assigned_at?: string
          assigned_by?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      what_if_scenarios: {
        Row: {
          created_at: string
          created_by: string | null
          id: string
          project_id: string
          result_summary: Json | null
          updated_at: string
          updated_by: string | null
          variables: Json
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          id?: string
          project_id: string
          result_summary?: Json | null
          updated_at?: string
          updated_by?: string | null
          variables?: Json
        }
        Update: {
          created_at?: string
          created_by?: string | null
          id?: string
          project_id?: string
          result_summary?: Json | null
          updated_at?: string
          updated_by?: string | null
          variables?: Json
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_role: {
        Args: { user_uuid: string }
        Returns: Database["public"]["Enums"]["app_role"]
      }
      has_role: {
        Args: {
          user_uuid: string
          required_role: Database["public"]["Enums"]["app_role"]
        }
        Returns: boolean
      }
      is_admin: {
        Args: { user_uuid: string }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "manager" | "viewer"
      backlog_item_type: "epic" | "feature" | "story" | "task" | "bug"
      backlog_priority: "critical" | "high" | "medium" | "low"
      backlog_status:
        | "new"
        | "approved"
        | "committed"
        | "in_progress"
        | "done"
        | "cancelled"
      dependency_type:
        | "blocks"
        | "blocked_by"
        | "depends_on"
        | "duplicates"
        | "relates_to"
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
      app_role: ["admin", "manager", "viewer"],
      backlog_item_type: ["epic", "feature", "story", "task", "bug"],
      backlog_priority: ["critical", "high", "medium", "low"],
      backlog_status: [
        "new",
        "approved",
        "committed",
        "in_progress",
        "done",
        "cancelled",
      ],
      dependency_type: [
        "blocks",
        "blocked_by",
        "depends_on",
        "duplicates",
        "relates_to",
      ],
    },
  },
} as const

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      tools: {
        Row: {
          created_at: string
          created_by: string
          data: Json | null
          description: string | null
          id: string
          name: string
          published: boolean | null
          settings: Json | null
        }
        Insert: {
          created_at?: string
          created_by?: string
          data?: Json | null
          description?: string | null
          id?: string
          name: string
          published?: boolean | null
          settings?: Json | null
        }
        Update: {
          created_at?: string
          created_by?: string
          data?: Json | null
          description?: string | null
          id?: string
          name?: string
          published?: boolean | null
          settings?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "tools_created_by_fkey"
            columns: ["created_by"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
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

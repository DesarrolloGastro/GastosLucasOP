export type UserRole = 'registrador' | 'gerencia'

export interface UserProfile {
  id: string
  email: string
  full_name: string | null
  role: UserRole
  created_at: string
  updated_at: string
}

export interface AuthUser {
  id: string
  email: string
  profile: UserProfile | null
}

export interface AuthContextType {
  user: AuthUser | null
  profile: UserProfile | null
  isLoading: boolean
  isGerencia: boolean
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>
  signOut: () => Promise<void>
}

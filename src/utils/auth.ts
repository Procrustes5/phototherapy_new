import { supabase } from './supabase'

export const isAuthenticated = async () => {
  const { data } = await supabase.auth.getUser()
  return data.user !== null
}

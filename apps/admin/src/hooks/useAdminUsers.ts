import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  banUser,
  demoteAdminUser,
  fetchAllUsers,
  fetchUserAdmin,
  promoteUserToAdmin,
  unbanUser,
} from '@family/supabase'
import { useAdminAuth } from '@/contexts/auth'
import { toast } from 'sonner'

export function useAdminUsers(opts?: {
  page?: number
  banned?: boolean
  search?: string
}) {
  return useQuery({
    queryKey: ['admin', 'users', opts],
    queryFn: () => fetchAllUsers(opts),
  })
}

export function useAdminUser(userId: string) {
  return useQuery({
    queryKey: ['admin', 'user', userId],
    queryFn: () => fetchUserAdmin(userId),
    enabled: !!userId,
  })
}

export function useAdminUserMutations() {
  const qc = useQueryClient()
  const { adminUser } = useAdminAuth()
  const adminId = adminUser?.id ?? ''

  const ban = useMutation({
    mutationFn: ({ userId, reason }: { userId: string; reason: string }) =>
      banUser(userId, adminId, reason),
    onSuccess: (_data, { userId }) => {
      qc.invalidateQueries({ queryKey: ['admin', 'users'] })
      qc.invalidateQueries({ queryKey: ['admin', 'user', userId] })
      toast.success('User banned')
    },
    onError: () => toast.error('Failed to ban user'),
  })

  const unban = useMutation({
    mutationFn: ({ userId }: { userId: string }) => unbanUser(userId, adminId),
    onSuccess: (_data, { userId }) => {
      qc.invalidateQueries({ queryKey: ['admin', 'users'] })
      qc.invalidateQueries({ queryKey: ['admin', 'user', userId] })
      toast.success('User unbanned')
    },
    onError: () => toast.error('Failed to unban user'),
  })

  const promote = useMutation({
    mutationFn: ({ userId }: { userId: string }) => promoteUserToAdmin(userId, adminId),
    onSuccess: (_data, { userId }) => {
      qc.invalidateQueries({ queryKey: ['admin', 'users'] })
      qc.invalidateQueries({ queryKey: ['admin', 'user', userId] })
      toast.success('User promoted to admin')
    },
    onError: () => toast.error('Failed to promote user'),
  })

  const demote = useMutation({
    mutationFn: ({ userId }: { userId: string }) => demoteAdminUser(userId, adminId),
    onSuccess: (_data, { userId }) => {
      qc.invalidateQueries({ queryKey: ['admin', 'users'] })
      qc.invalidateQueries({ queryKey: ['admin', 'user', userId] })
      toast.success('Admin privileges removed')
    },
    onError: () => toast.error('Failed to demote user'),
  })

  return { ban, unban, promote, demote }
}

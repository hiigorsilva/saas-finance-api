import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { IUser } from '../../users/interfaces/user.interface'
import type { IWorkspaceMember } from '../interfaces/workspace-member.interface'
import { WorkspaceMemberService } from './add-member.service'

const mockWorkspaceMemberRepository = {
  addMember: vi.fn(),
  changeMemberRole: vi.fn(),
  getMemberById: vi.fn(),
  getUserRole: vi.fn(),
  isMember: vi.fn(),
  isOwner: vi.fn(),
  listAllMembers: vi.fn(),
  removeMember: vi.fn(),
}

const mockWorkspaceRepository = {
  alreadyExistsById: vi.fn(),
  alreadyExistsByName: vi.fn(),
  edit: vi.fn(),
  findWorkspaceById: vi.fn(),
  isPrivateWorkspace: vi.fn(),
  list: vi.fn(),
  remove: vi.fn(),
  save: vi.fn(),
}

const mockUserRepository = {
  findUserByEmail: vi.fn(),
  findUserById: vi.fn(),
  isUserExistsByEmail: vi.fn(),
  isUserExistsById: vi.fn(),
  listAllUsers: vi.fn(),
  listInactiveUsers: vi.fn(),
  save: vi.fn(),
}

const inputData = {
  workspaceId: 'workspace_id',
  email: 'john.doe@email.com',
  role: 'MEMBER' as IWorkspaceMember['role'],
}

describe('WorkspaceMemberService', async () => {
  let sut: WorkspaceMemberService

  beforeEach(() => {
    sut = new WorkspaceMemberService(
      mockWorkspaceMemberRepository,
      mockWorkspaceRepository,
      mockUserRepository
    )
  })

  it('should throw an error if user not exists', async () => {
    const { workspaceId, email, role } = inputData

    mockUserRepository.findUserByEmail.mockResolvedValue(null)

    await expect(sut.addMember({ workspaceId, email, role })).rejects.toThrow(
      'User not exists.'
    )
    expect(mockUserRepository.findUserByEmail).toHaveBeenCalledWith(email)
  })

  it('should throw an error if workspace not found', async () => {
    const { workspaceId, email, role } = inputData

    const user = {
      id: 'user_id',
      name: 'John Doe',
      email: 'john.doe@email.com',
      passwordHashed: 'hashed_password',
      financialProfile: null,
      updatedAt: new Date(),
      createdAt: new Date(),
      deletedAt: null,
    } as IUser

    mockUserRepository.findUserByEmail.mockResolvedValue(user)
    mockWorkspaceRepository.alreadyExistsById.mockResolvedValue(false)

    await expect(sut.addMember({ workspaceId, email, role })).rejects.toThrow(
      'Workspace not found.'
    )
    expect(mockWorkspaceRepository.alreadyExistsById).toHaveBeenCalledWith(
      workspaceId
    )
    expect(mockWorkspaceRepository.isPrivateWorkspace).not.toHaveBeenCalled()
    expect(mockWorkspaceMemberRepository.isMember).not.toHaveBeenCalledWith(
      workspaceId,
      user.id
    )
    expect(mockWorkspaceMemberRepository.addMember).not.toHaveBeenCalledWith(
      workspaceId,
      user.id,
      role
    )
  })

  it('should throw an error if workspace is private', async () => {
    const { workspaceId, email, role } = inputData

    const user = {
      id: 'user_id',
      name: 'John Doe',
      email: 'john.doe@email.com',
      passwordHashed: 'hashed_password',
      financialProfile: null,
      updatedAt: new Date(),
      createdAt: new Date(),
      deletedAt: null,
    } as IUser

    mockUserRepository.findUserByEmail.mockResolvedValue(user)
    mockWorkspaceRepository.alreadyExistsById.mockResolvedValue(true)
    mockWorkspaceRepository.isPrivateWorkspace.mockResolvedValue(true)

    await expect(sut.addMember({ workspaceId, email, role })).rejects.toThrow(
      'Cannot add members to a private workspace.'
    )
    expect(mockWorkspaceRepository.isPrivateWorkspace).toHaveBeenCalledWith(
      workspaceId
    )
    expect(mockWorkspaceMemberRepository.isMember).not.toHaveBeenCalled()
    expect(mockWorkspaceMemberRepository.addMember).not.toHaveBeenCalled()
  })

  it('should throw an error if user already is a member', async () => {
    const { workspaceId, email, role } = inputData

    const user = {
      id: 'user_id',
      name: 'John Doe',
      email: 'john.doe@email.com',
      passwordHashed: 'hashed_password',
      financialProfile: null,
      updatedAt: new Date(),
      createdAt: new Date(),
      deletedAt: null,
    } as IUser

    mockUserRepository.findUserByEmail.mockResolvedValue(user)
    mockWorkspaceRepository.alreadyExistsById.mockResolvedValue(true)
    mockWorkspaceRepository.isPrivateWorkspace.mockResolvedValue(false)
    mockWorkspaceMemberRepository.isMember.mockResolvedValue(true)

    await expect(sut.addMember({ workspaceId, email, role })).rejects.toThrow(
      'User is already a member of this workspace.'
    )
    expect(mockWorkspaceMemberRepository.isMember).toHaveBeenCalledWith(
      workspaceId,
      user.id
    )
    expect(mockWorkspaceMemberRepository.addMember).not.toHaveBeenCalled()
  })

  it('should add a member to workspace', async () => {
    const { workspaceId, email, role } = inputData

    const user = {
      id: 'user_id',
      name: 'John Doe',
      email: 'john.doe@email.com',
      passwordHashed: 'hashed_password',
      financialProfile: null,
      updatedAt: new Date(),
      createdAt: new Date(),
      deletedAt: null,
    } as IUser

    mockUserRepository.findUserByEmail.mockResolvedValue(user)
    mockWorkspaceRepository.alreadyExistsById.mockResolvedValue(true)
    mockWorkspaceRepository.isPrivateWorkspace.mockResolvedValue(false)
    mockWorkspaceMemberRepository.isMember.mockResolvedValue(false)

    const mockMember = {
      id: 'member_id',
      workspaceId,
      userId: user.id,
      role,
    }
    mockWorkspaceMemberRepository.addMember.mockResolvedValue(mockMember)

    const result = await sut.addMember({ workspaceId, email, role })
    expect(result).toEqual(mockMember)
    expect(mockWorkspaceMemberRepository.addMember).toHaveBeenCalledWith(
      workspaceId,
      user.id,
      role
    )
  })
})

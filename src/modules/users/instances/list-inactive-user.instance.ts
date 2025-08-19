import { ListInactiveUsersController } from '../controllers/list-inactive-user.controller'
import { UserRepository } from '../repositories/user.repository'
import { ListUserService } from '../services/list-user.service'

const userRepository = new UserRepository()
const listUserService = new ListUserService(userRepository)
export const listInactiveUserController = new ListInactiveUsersController(
  listUserService
)

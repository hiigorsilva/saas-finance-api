import { UserRepository } from '../../users/repositories/user.repository'
import { SignInController } from '../controllers/signin.controller'
import { SignInService } from '../services/signin.service'

const userRepository = new UserRepository()
const signinService = new SignInService(userRepository)
export const signinController = new SignInController(signinService)

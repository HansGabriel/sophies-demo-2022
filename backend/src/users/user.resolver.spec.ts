import { Test } from '@nestjs/testing'
import { RegistrationSource } from './registration-source'
import { UserWithoutHash } from './user-without-hash.dto'
import { UserResolver } from './user.resolver'
import { UsersService } from './users.service'

const mockUser: UserWithoutHash = {
  id: 1,
  email: 'fifi@cpu.ph',
  familyName: 'Coo',
  givenName: 'Fifi',
  createdAt: new Date(),
  updatedAt: new Date(),
  registrationSource: RegistrationSource.LOCAL,
}

const mockUsersService = {
  allUsers: jest.fn().mockResolvedValue([mockUser]),
  register: jest.fn().mockResolvedValue(mockUser),
}

describe('UserResolver', () => {
  let resolver: UserResolver

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UserResolver,
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile()

    resolver = module.get(UserResolver)
  })

  describe('#users()', () => {
    it('returns all users', () => {
      return expect(resolver.users()).resolves.toStrictEqual([mockUser])
    })
  })

  describe('#register()', () => {
    it('registers a user', () => {
      return expect(
        resolver.register({
          email: 'fifi@cpu.ph',
          password: 'anypass',
          familyName: 'Coo',
          givenName: 'Fifi',
          registrationSource: RegistrationSource.GOOGLE, // is overriden
        })
      ).resolves.toStrictEqual(mockUser)
    })
  })
})

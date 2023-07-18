import type { Config } from 'jest'

const config: Config = {
  roots:['<rootDir>/src'],
  collectCoverage: true,
  coveragePathIgnorePatterns: ['<rootDir>/coverage', '/node_modules/'],
  collectCoverageFrom: ['<rootDir>/src/**/**'],
  coverageDirectory: 'coverage',
  testEnvironment: 'node',
  transform: {
    '^.+\\.ts?$': 'ts-jest'
  },
  coverageProvider: 'babel',
  preset: '@shelf/jest-mongodb'


}

export default config

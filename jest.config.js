module.exports = {
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '\\.(css|less|scss)$': 'identity-obj-proxy',
    '\\.svg$': '<rootDir>/jest-SVGTransformer.tsx',
  },
  setupFilesAfterEnv: ['<rootDir>/jest-setup.ts'],
};

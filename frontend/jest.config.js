module.exports = {
    testEnvironment: 'jsdom',
    transform: {
        '^.+\\.jsx?$': 'babel-jest',
    },
    moduleNameMapper: {
        '\\.(css|less|scss|sass)$': '<rootDir>/__mocks__/styleMock.js', // Use the CSS mock
    },
    setupFiles: ['./jest.setup.js'],
    moduleFileExtensions: ['js', 'jsx'],
};
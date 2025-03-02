module.exports = [
    {
        files: ["**/*.js"],
        languageOptions: { sourceType: "commonjs" },
        rules: {
            quotes: ["error", "double"],
            semi: ["error", "always"],
            indent: ["error", 4]
        }
    },
];

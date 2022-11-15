// ChainLoop workflow associated with .github/workflows/deploy.yml
// https://docs.chainloop.dev/reference/operator/contract
schemaVersion: "v1",
materials: [
    { type: "ARTIFACT", name: "built-site", output: true },
]
runner: type: "GITHUB_ACTION"
